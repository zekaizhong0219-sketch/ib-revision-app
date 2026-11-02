import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppData, Card, Grade, PracticeLog, Settings } from './types';
import { loadData, saveData } from './lib/storage';
import { schedule } from './lib/srs';
import { ALL_CARDS } from './data/cards';

interface Store {
  data: AppData;
  /** Built-in + custom cards. */
  cards: Card[];
  cardById: Map<string, Card>;
  saveOk: boolean;
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

  const gradeCard = useCallback((card: Card, grade: Grade, opts?: { cram?: boolean }) => {
    const now = Date.now();
    setData((d) => ({
      ...d,
      cards: opts?.cram ? d.cards : { ...d.cards, [card.id]: schedule(d.cards[card.id], grade, now) },
      reviews: [...d.reviews, { c: card.id, s: card.subject, tp: card.topic, g: grade, t: now }],
    }));
  }, []);

  const logPractice = useCallback((entries: PracticeLog[]) => {
    if (!entries.length) return;
    setData((d) => ({ ...d, practice: [...d.practice, ...entries] }));
  }, []);

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
    () => ({ data, cards, cardById, saveOk, gradeCard, logPractice, upsertCustomCard, deleteCustomCard, setSuspended, resetCard, updateSettings, replaceData }),
    [data, cards, cardById, saveOk, gradeCard, logPractice, upsertCustomCard, deleteCustomCard, setSuspended, resetCard, updateSettings, replaceData],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
