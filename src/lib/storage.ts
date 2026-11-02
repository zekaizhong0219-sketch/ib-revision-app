import type { AppData, Card, CardState, ContentReport, EssayAttempt, Exam, MockRecord, PracticeLog, ReviewLog, Settings, SubjectId } from '../types';
import { SUBJECT_IDS, isSubjectId } from '../data/subjectIds';

export const STORAGE_KEY = 'ib-revision:data';
export const DATA_VERSION = 2;
/** Cap stored logs so localStorage (≈5 MB) never fills up. */
export const MAX_LOG_ENTRIES = 30000;
/** Cap on stored essay attempts (each can hold a few KB of text). */
export const MAX_ESSAYS = 200;
/** Subjects added in data version 2. */
const V2_SUBJECTS: SubjectId[] = ['spanish', 'english', 'history'];


export function defaultExams(): Exam[] {
  // Placeholders — the user is expected to edit these to match their official timetable.
  return [
    { id: 'ex-start', name: 'IB May 2027 exams begin (edit me)', date: '2027-04-30T09:00' },
  ];
}

export function defaultSettings(): Settings {
  return {
    theme: 'system',
    newPerDay: 20,
    dailyMinutes: 60,
    maxReviewsPerSession: 100,
    exams: defaultExams(),
    enabledSubjects: [...SUBJECT_IDS],
    hiddenSubjects: [],
    mistakeCards: true,
    uiLang: 'en',
  };
}

export function defaultData(): AppData {
  return {
    version: DATA_VERSION,
    cards: {},
    reviews: [],
    practice: [],
    customCards: [],
    essays: [],
    mocks: [],
    reports: [],
    settings: defaultSettings(),
  };
}

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isSubject = isSubjectId;
const GRADES = ['again', 'hard', 'good', 'easy'];
const RESULTS = ['correct', 'partial', 'incorrect'];

function sanitizeCardState(v: unknown): CardState | null {
  if (!isObj(v)) return null;
  if (!isNum(v.ef) || !isNum(v.interval) || !isNum(v.reps) || !isNum(v.due)) return null;
  return {
    ef: Math.max(1.3, v.ef),
    interval: Math.max(0, v.interval),
    reps: Math.max(0, Math.floor(v.reps)),
    lapses: isNum(v.lapses) ? Math.max(0, Math.floor(v.lapses)) : 0,
    due: v.due,
    last: isNum(v.last) ? v.last : 0,
    ...(v.suspended === true ? { suspended: true } : {}),
  };
}

function sanitizeReview(v: unknown): ReviewLog | null {
  if (!isObj(v) || !isStr(v.c) || !isSubject(v.s) || !isStr(v.tp) || !GRADES.includes(v.g as string) || !isNum(v.t)) return null;
  return { c: v.c, s: v.s, tp: v.tp, g: v.g as ReviewLog['g'], t: v.t };
}

function sanitizePractice(v: unknown): PracticeLog | null {
  if (!isObj(v) || !isStr(v.q) || !isSubject(v.s) || !isStr(v.tp) || !RESULTS.includes(v.r as string) || !isNum(v.t)) return null;
  const out: PracticeLog = { q: v.q, s: v.s, tp: v.tp, r: v.r as PracticeLog['r'], t: v.t };
  if (isNum(v.sec)) out.sec = v.sec;
  if (isNum(v.m) && isNum(v.mx) && v.mx > 0) {
    out.mx = v.mx;
    out.m = Math.min(v.mx, Math.max(0, v.m));
  }
  return out;
}

function sanitizeCard(v: unknown): Card | null {
  if (!isObj(v) || !isStr(v.id) || !isSubject(v.subject) || !isStr(v.topic) || !isStr(v.front) || !isStr(v.back)) return null;
  const kinds = ['definition', 'formula', 'unit', 'command', 'concept', 'fact', 'date', 'person', 'device', 'vocab', 'texttype', 'quote'];
  return {
    id: v.id,
    subject: v.subject,
    topic: v.topic,
    front: v.front,
    back: v.back,
    kind: kinds.includes(v.kind as string) ? (v.kind as Card['kind']) : 'concept',
    custom: true,
  };
}

function sanitizeEssay(v: unknown): EssayAttempt | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.prompt) || !isSubject(v.subject) || !isStr(v.topic) || !isStr(v.rubric) || !isNum(v.t)) return null;
  const scores: Record<string, number> = {};
  if (isObj(v.scores)) for (const [k, n] of Object.entries(v.scores)) if (isNum(n)) scores[k] = Math.max(0, n);
  return {
    id: v.id,
    prompt: v.prompt,
    subject: v.subject,
    topic: v.topic,
    rubric: v.rubric,
    t: v.t,
    sec: isNum(v.sec) ? Math.max(0, v.sec) : 0,
    words: isNum(v.words) ? Math.max(0, Math.floor(v.words)) : 0,
    text: isStr(v.text) ? v.text.slice(0, 20000) : '',
    scores,
    done: v.done === true,
  };
}

function sanitizeReport(v: unknown): ContentReport | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.item) || !isSubject(v.subject) || !isStr(v.note) || !isNum(v.t)) return null;
  return { id: v.id, item: v.item, subject: v.subject, excerpt: isStr(v.excerpt) ? v.excerpt.slice(0, 300) : '', note: v.note.slice(0, 2000), t: v.t };
}

function sanitizeMock(v: unknown): MockRecord | null {
  if (!isObj(v) || !isStr(v.id) || !isSubject(v.subject) || !isNum(v.t) || !isNum(v.max) || !isNum(v.got) || v.max <= 0) return null;
  return {
    id: v.id,
    subject: v.subject,
    t: v.t,
    minutes: isNum(v.minutes) ? Math.max(0, v.minutes) : 0,
    max: v.max,
    got: Math.min(v.max, Math.max(0, v.got)),
    items: isNum(v.items) ? Math.max(0, Math.floor(v.items)) : 0,
  };
}

function sanitizeSettings(v: unknown): Settings {
  const d = defaultSettings();
  if (!isObj(v)) return d;
  const theme = v.theme === 'light' || v.theme === 'dark' || v.theme === 'system' ? v.theme : d.theme;
  const exams = Array.isArray(v.exams)
    ? v.exams
        .filter((e): e is Record<string, unknown> => isObj(e) && isStr(e.id) && isStr(e.name) && isStr(e.date))
        .map((e) => ({
          id: e.id as string,
          name: e.name as string,
          date: e.date as string,
          ...(isSubject(e.subject) ? { subject: e.subject } : {}),
          ...(e.kind === 'deadline' ? { kind: 'deadline' as const } : {}),
        }))
    : d.exams;
  const enabled = Array.isArray(v.enabledSubjects) ? v.enabledSubjects.filter(isSubject) : d.enabledSubjects;
  const hidden = Array.isArray(v.hiddenSubjects) ? Array.from(new Set(v.hiddenSubjects.filter(isSubject))) : [];
  return {
    theme,
    newPerDay: isNum(v.newPerDay) ? Math.min(500, Math.max(0, Math.floor(v.newPerDay))) : d.newPerDay,
    dailyMinutes: isNum(v.dailyMinutes) ? Math.min(600, Math.max(10, Math.round(v.dailyMinutes))) : d.dailyMinutes,
    maxReviewsPerSession: isNum(v.maxReviewsPerSession)
      ? Math.min(1000, Math.max(5, Math.floor(v.maxReviewsPerSession)))
      : d.maxReviewsPerSession,
    exams,
    enabledSubjects: enabled.length ? Array.from(new Set(enabled)) : d.enabledSubjects,
    // Never hide everything.
    hiddenSubjects: hidden.length >= SUBJECT_IDS.length ? [] : hidden,
    mistakeCards: typeof v.mistakeCards === 'boolean' ? v.mistakeCards : d.mistakeCards,
    uiLang: v.uiLang === 'es' || v.uiLang === 'zh' || v.uiLang === 'en' ? v.uiLang : d.uiLang,
  };
}

/** Upgrades older stored shapes to the current version. */
export function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  const out = { ...raw };
  const v = isNum(out.version) ? out.version : 0;
  if (v < 1) {
    // v0 (pre-release) had no version field; nothing structural changed.
    out.version = 1;
  }
  if (v < 2) {
    // v2 added Spanish A, English B and History: enable them for existing users.
    if (isObj(out.settings) && Array.isArray(out.settings.enabledSubjects)) {
      const en = out.settings.enabledSubjects as unknown[];
      out.settings = { ...out.settings, enabledSubjects: [...en, ...V2_SUBJECTS.filter((s) => !en.includes(s))] };
    }
    out.version = 2;
  }
  return out;
}

/**
 * Validates and normalises arbitrary parsed JSON into AppData.
 * Invalid entries are dropped instead of failing the whole load.
 * Throws if the value is not an object at all.
 */
export function sanitizeData(input: unknown): AppData {
  if (!isObj(input)) throw new Error('Data is not an object');
  const raw = migrate(input);
  if (isNum(raw.version) && raw.version > DATA_VERSION) {
    throw new Error(`Data version ${raw.version} is newer than this app supports (${DATA_VERSION}).`);
  }
  const cards: Record<string, CardState> = {};
  if (isObj(raw.cards)) {
    for (const [id, st] of Object.entries(raw.cards)) {
      const s = sanitizeCardState(st);
      if (s) cards[id] = s;
    }
  }
  const reviews = (Array.isArray(raw.reviews) ? raw.reviews : []).map(sanitizeReview).filter((x): x is ReviewLog => !!x);
  const practice = (Array.isArray(raw.practice) ? raw.practice : [])
    .map(sanitizePractice)
    .filter((x): x is PracticeLog => !!x);
  const customCards = (Array.isArray(raw.customCards) ? raw.customCards : [])
    .map(sanitizeCard)
    .filter((x): x is Card => !!x);
  const essays = (Array.isArray(raw.essays) ? raw.essays : []).map(sanitizeEssay).filter((x): x is EssayAttempt => !!x);
  return {
    version: DATA_VERSION,
    cards,
    reviews: reviews.slice(-MAX_LOG_ENTRIES),
    practice: practice.slice(-MAX_LOG_ENTRIES),
    customCards,
    essays: essays.slice(-MAX_ESSAYS),
    mocks: (Array.isArray(raw.mocks) ? raw.mocks : []).map(sanitizeMock).filter((x): x is MockRecord => !!x).slice(-MAX_ESSAYS),
    reports: (Array.isArray(raw.reports) ? raw.reports : []).map(sanitizeReport).filter((x): x is ContentReport => !!x).slice(-500),
    settings: sanitizeSettings(raw.settings),
  };
}

export function loadData(storage: Storage | null = getStorage()): AppData {
  try {
    if (!storage) return defaultData();
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    return sanitizeData(JSON.parse(raw));
  } catch (err) {
    console.warn('[storage] could not load saved data, starting fresh', err);
    return defaultData();
  }
}

/** Returns true when the data was written successfully. */
export function saveData(data: AppData, storage: Storage | null = getStorage()): boolean {
  try {
    if (!storage) return false;
    const trimmed: AppData = {
      ...data,
      reviews: data.reviews.slice(-MAX_LOG_ENTRIES),
      practice: data.practice.slice(-MAX_LOG_ENTRIES),
      essays: data.essays.slice(-MAX_ESSAYS),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch (err) {
    console.warn('[storage] could not save data', err);
    return false;
  }
}

export function clearData(storage: Storage | null = getStorage()): void {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export interface ExportFile {
  app: 'ib-revision-app';
  exportedAt: string;
  data: AppData;
}

export function exportData(data: AppData, now = new Date()): string {
  const file: ExportFile = { app: 'ib-revision-app', exportedAt: now.toISOString(), data };
  return JSON.stringify(file, null, 2);
}

/** Parses an exported backup (or a bare AppData object). Throws a readable error if invalid. */
export function importData(text: string): AppData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }
  if (isObj(parsed) && parsed.app === 'ib-revision-app' && 'data' in parsed) {
    return sanitizeData(parsed.data);
  }
  if (isObj(parsed) && ('cards' in parsed || 'settings' in parsed)) {
    return sanitizeData(parsed);
  }
  throw new Error('This file does not look like an IB Revision backup.');
}

/**
 * Merges an imported backup into the current data: for each card the more recently
 * reviewed state wins; logs are unioned (deduplicated); custom cards are unioned by id;
 * settings come from the import.
 */
export function mergeData(current: AppData, incoming: AppData): AppData {
  const cards: Record<string, CardState> = { ...current.cards };
  for (const [id, st] of Object.entries(incoming.cards)) {
    const cur = cards[id];
    if (!cur || st.last >= cur.last) cards[id] = st;
  }
  const revKey = (r: ReviewLog) => `${r.c}|${r.t}`;
  const prKey = (p: PracticeLog) => `${p.q}|${p.t}`;
  const reviews = dedupe([...current.reviews, ...incoming.reviews], revKey).sort((a, b) => a.t - b.t);
  const practice = dedupe([...current.practice, ...incoming.practice], prKey).sort((a, b) => a.t - b.t);
  const custom = dedupe([...current.customCards, ...incoming.customCards], (c) => c.id);
  const essays = dedupe([...current.essays, ...incoming.essays], (e) => e.id).sort((a, b) => a.t - b.t);
  const mocks = dedupe([...current.mocks, ...incoming.mocks], (m) => m.id).sort((a, b) => a.t - b.t);
  const reports = dedupe([...current.reports, ...incoming.reports], (r) => r.id).sort((a, b) => a.t - b.t);
  return {
    version: DATA_VERSION,
    cards,
    reviews: reviews.slice(-MAX_LOG_ENTRIES),
    practice: practice.slice(-MAX_LOG_ENTRIES),
    customCards: custom,
    essays: essays.slice(-MAX_ESSAYS),
    mocks: mocks.slice(-MAX_ESSAYS),
    reports: reports.slice(-500),
    settings: incoming.settings,
  };
}

function dedupe<T>(items: T[], key: (x: T) => string): T[] {
  const seen = new Map<string, T>();
  for (const it of items) seen.set(key(it), it);
  return [...seen.values()];
}
