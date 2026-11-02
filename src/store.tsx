import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type {
  AppData, Card, ContentReport, EssayAttempt, Grade, MockRecord, PracticeLog, Question, SchoolResult, Settings, SourceAttempt, SourceSet, Subject,
} from './types';
import { ALL_QUESTIONS } from './data/questions';
import { addMistakeCards } from './lib/mistakes';
import { SUBJECTS } from './data/syllabus';
import { loadData, saveData } from './lib/storage';
import { scheduleWith } from './lib/srs';
import { ALL_CARDS } from './data/cards';

interface Store {
  data: AppData;
  /** Built-in + custom cards. */
  cards: Card[];
  cardById: Map<string, Card>;
  /** Subjects not hidden in Settings, in syllabus order. */
  visibleSubjects: Subject[];
  /** Visible subjects that are also enabled for reviews/recommendations. */
  activeSubjectIds: Subject['id'][];
  saveOk: boolean;
  saveEssay: (attempt: EssayAttempt) => void;
  saveMock: (record: MockRecord) => void;
  addReport: (r: Omit<ContentReport, 'id' | 't'>) => void;
  clearReports: () => void;
  addSchoolResult: (r: Omit<SchoolResult, 'id'>) => void;
  deleteSchoolResult: (id: string) => void;
  saveSourceSet: (set: SourceSet) => void;
  deleteSourceSet: (id: string) => void;
  addSourceAttempt: (setId: string, attempt: SourceAttempt) => void;
  deleteEssay: (id: string) => void;
  gradeCard: (card: Card, grade: Grade, opts?: { cram?: boolean }) => void;
  logPractice: (entries: PracticeLog[]) => void;
  upsertCustomCard: (card: Card) => void;
  deleteCustomCard: (id: string) => void;
  setSuspended: (id: string, suspended: boolean) => void;
  resetCard: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  replaceData: (data: AppData) => void;
}

const Ctx = createContext<Store | null>(null);

/** Built-in questions by id (mistake cards are only created for these, not for flashcard prompts). */
const QUESTION_BY_ID = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));

export function StoreProvider({ children, initial }: { children: ReactNode; initial?: AppData }) {
  const [data, setData] = useState<AppData>(() => initial ?? loadData());
  const [saveOk, setSaveOk] = useState(true);
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef(data);
  latest.current = data;

  // Debounced persistence; also flush when the page is hidden/closed.
  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaveOk(saveData(data)), 300);
    return () => window.clearTimeout(timer.current);
  }, [data]);
  useEffect(() => {
    const flush = () => saveData(latest.current);
    const onVis = () => document.visibilityState === 'hidden' && flush();
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const cards = useMemo(() => [...ALL_CARDS, ...data.customCards], [data.customCards]);
  const cardById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);
  const hidden = data.settings.hiddenSubjects;
  const enabled = data.settings.enabledSubjects;
  const visibleSubjects = useMemo(() => SUBJECTS.filter((s) => !hidden.includes(s.id)), [hidden]);
  const activeSubjectIds = useMemo(() => visibleSubjects.map((s) => s.id).filter((id) => enabled.includes(id)), [visibleSubjects, enabled]);

  const saveEssay = useCallback((attempt: EssayAttempt) => {
    setData((d) => {
      const exists = d.essays.some((e) => e.id === attempt.id);
      return { ...d, essays: exists ? d.essays.map((e) => (e.id === attempt.id ? attempt : e)) : [...d.essays, attempt] };
    });
  }, []);
  const deleteEssay = useCallback((id: string) => setData((d) => ({ ...d, essays: d.essays.filter((e) => e.id !== id) })), []);

  const gradeCard = useCallback((card: Card, grade: Grade, opts?: { cram?: boolean }) => {
    const now = Date.now();
    setData((d) => ({
      ...d,
      cards: opts?.cram ? d.cards : { ...d.cards, [card.id]: scheduleWith(d.settings, d.cards[card.id], grade, now) },
      reviews: [...d.reviews, { c: card.id, s: card.subject, tp: card.topic, g: grade, t: now }],
    }));
  }, []);

  const logPractice = useCallback((entries: PracticeLog[]) => {
    if (!entries.length) return;
    setData((d) => {
      const failed = d.settings.mistakeCards
        ? entries.filter((e) => e.r !== 'correct').map((e) => QUESTION_BY_ID.get(e.q)).filter((q): q is Question => !!q)
        : [];
      return { ...d, practice: [...d.practice, ...entries], customCards: addMistakeCards(d, failed) };
    });
  }, []);
  const saveMock = useCallback((record: MockRecord) => setData((d) => ({ ...d, mocks: [...d.mocks, record] })), []);
  const addReport = useCallback(
    (r: Omit<ContentReport, 'id' | 't'>) => setData((d) => ({ ...d, reports: [...d.reports, { ...r, id: `rp-${Date.now().toString(36)}`, t: Date.now() }] })),
    [],
  );
  const clearReports = useCallback(() => setData((d) => ({ ...d, reports: [] })), []);
  const addSchoolResult = useCallback(
    (r: Omit<SchoolResult, 'id'>) => setData((d) => ({ ...d, school: [...d.school, { ...r, id: `sr-${Date.now().toString(36)}` }].sort((a, b) => a.t - b.t) })),
    [],
  );
  const deleteSchoolResult = useCallback((id: string) => setData((d) => ({ ...d, school: d.school.filter((r) => r.id !== id) })), []);
  const saveSourceSet = useCallback(
    (set: SourceSet) =>
      setData((d) => ({
        ...d,
        sourceSets: d.sourceSets.some((x) => x.id === set.id) ? d.sourceSets.map((x) => (x.id === set.id ? set : x)) : [...d.sourceSets, set],
      })),
    [],
  );
  const deleteSourceSet = useCallback((id: string) => setData((d) => ({ ...d, sourceSets: d.sourceSets.filter((x) => x.id !== id) })), []);
  const addSourceAttempt = useCallback(
    (setId: string, attempt: SourceAttempt) =>
      setData((d) => ({ ...d, sourceSets: d.sourceSets.map((x) => (x.id === setId ? { ...x, attempts: [...x.attempts, attempt] } : x)) })),
    [],
  );

  const upsertCustomCard = useCallback((card: Card) => {
    setData((d) => {
      const exists = d.customCards.some((c) => c.id === card.id);
      const c = { ...card, custom: true };
      return { ...d, customCards: exists ? d.customCards.map((x) => (x.id === card.id ? c : x)) : [...d.customCards, c] };
    });
  }, []);

  const deleteCustomCard = useCallback((id: string) => {
    setData((d) => {
      const cardsState = { ...d.cards };
      delete cardsState[id];
      return { ...d, customCards: d.customCards.filter((c) => c.id !== id), cards: cardsState };
    });
  }, []);

  const setSuspended = useCallback((id: string, suspended: boolean) => {
    setData((d) => {
      const prev = d.cards[id] ?? { ef: 2.5, interval: 0, reps: 0, lapses: 0, due: Date.now(), last: 0 };
      const next = { ...prev };
      if (suspended) next.suspended = true;
      else delete next.suspended;
      return { ...d, cards: { ...d.cards, [id]: next } };
    });
  }, []);

  const resetCard = useCallback((id: string) => {
    setData((d) => {
      const c = { ...d.cards };
      delete c[id];
      return { ...d, cards: c };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  const replaceData = useCallback((next: AppData) => setData(next), []);

  const value = useMemo<Store>(
    () => ({
      data, cards, cardById, visibleSubjects, activeSubjectIds, saveOk, saveEssay, deleteEssay, saveMock, addReport, clearReports,
      addSchoolResult, deleteSchoolResult, saveSourceSet, deleteSourceSet, addSourceAttempt,
      gradeCard, logPractice, upsertCustomCard, deleteCustomCard, setSuspended, resetCard, updateSettings, replaceData,
    }),
    [
      data, cards, cardById, visibleSubjects, activeSubjectIds, saveOk, saveEssay, deleteEssay, saveMock, addReport, clearReports,
      addSchoolResult, deleteSchoolResult, saveSourceSet, deleteSourceSet, addSourceAttempt,
      gradeCard, logPractice, upsertCustomCard, deleteCustomCard, setSuspended, resetCard, updateSettings, replaceData,
    ],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
