import type { AppData, Card, CardState, Exam, PracticeLog, ReviewLog, Settings, SubjectId } from '../types';

export const STORAGE_KEY = 'ib-revision:data';
export const DATA_VERSION = 1;
/** Cap stored logs so localStorage (≈5 MB) never fills up. */
export const MAX_LOG_ENTRIES = 30000;

const SUBJECTS: SubjectId[] = ['physics', 'chemistry', 'math'];

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
    maxReviewsPerSession: 100,
    exams: defaultExams(),
    enabledSubjects: [...SUBJECTS],
  };
}

export function defaultData(): AppData {
  return {
    version: DATA_VERSION,
    cards: {},
    reviews: [],
    practice: [],
    customCards: [],
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
const isSubject = (v: unknown): v is SubjectId => SUBJECTS.includes(v as SubjectId);
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
  return out;
}

function sanitizeCard(v: unknown): Card | null {
  if (!isObj(v) || !isStr(v.id) || !isSubject(v.subject) || !isStr(v.topic) || !isStr(v.front) || !isStr(v.back)) return null;
  const kinds = ['definition', 'formula', 'unit', 'command', 'concept', 'fact'];
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
        }))
    : d.exams;
  const enabled = Array.isArray(v.enabledSubjects) ? v.enabledSubjects.filter(isSubject) : d.enabledSubjects;
  return {
    theme,
    newPerDay: isNum(v.newPerDay) ? Math.min(500, Math.max(0, Math.floor(v.newPerDay))) : d.newPerDay,
    maxReviewsPerSession: isNum(v.maxReviewsPerSession)
      ? Math.min(1000, Math.max(5, Math.floor(v.maxReviewsPerSession)))
      : d.maxReviewsPerSession,
    exams,
    enabledSubjects: enabled.length ? Array.from(new Set(enabled)) : d.enabledSubjects,
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
  return {
    version: DATA_VERSION,
    cards,
    reviews: reviews.slice(-MAX_LOG_ENTRIES),
    practice: practice.slice(-MAX_LOG_ENTRIES),
    customCards,
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
  return {
    version: DATA_VERSION,
    cards,
    reviews: reviews.slice(-MAX_LOG_ENTRIES),
    practice: practice.slice(-MAX_LOG_ENTRIES),
    customCards: custom,
    settings: incoming.settings,
  };
}

function dedupe<T>(items: T[], key: (x: T) => string): T[] {
  const seen = new Map<string, T>();
  for (const it of items) seen.set(key(it), it);
  return [...seen.values()];
}
