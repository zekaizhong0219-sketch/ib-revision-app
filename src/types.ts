export type SubjectId = 'physics' | 'chemistry' | 'math' | 'spanish' | 'english' | 'history';

/** Language the subject's content is written in. */
export type ContentLang = 'en' | 'es';

export type CardKind =
  | 'definition'
  | 'formula'
  | 'unit'
  | 'command'
  | 'concept'
  | 'fact'
  | 'date'
  | 'person'
  | 'device'
  | 'vocab'
  | 'texttype'
  | 'quote';

export interface Topic {
  /** Stable topic code, e.g. "A.1", "S1.2", "M5". */
  id: string;
  name: string;
  /** Theme / strand this topic belongs to (for grouping in the UI). */
  theme: string;
  /** True for Additional Higher Level content. */
  ahl?: boolean;
}

export interface Subject {
  id: SubjectId;
  name: string;
  short: string;
  color: string;
  level: 'SL' | 'HL';
  lang: ContentLang;
  /** IB subject group, 1–6. */
  group: number;
  topics: Topic[];
}

export interface Card {
  id: string;
  subject: SubjectId;
  topic: string;
  front: string;
  back: string;
  kind: CardKind;
  /** True for user-created cards. */
  custom?: boolean;
}

/** SM-2 scheduling state for a single card. */
export interface CardState {
  /** Easiness factor (>= 1.3). */
  ef: number;
  /** Current interval in days. */
  interval: number;
  /** Consecutive successful repetitions. */
  reps: number;
  /** Number of times the card was forgotten after having been learned. */
  lapses: number;
  /** Due time (ms since epoch). */
  due: number;
  /** Last review time (ms since epoch). */
  last: number;
  suspended?: boolean;
}

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewLog {
  /** Card id */
  c: string;
  /** Subject */
  s: SubjectId;
  /** Topic id */
  tp: string;
  /** Grade */
  g: Grade;
  /** Timestamp (ms) */
  t: number;
}

export type PracticeResult = 'correct' | 'partial' | 'incorrect';

export interface PracticeLog {
  /** Question id */
  q: string;
  s: SubjectId;
  tp: string;
  r: PracticeResult;
  t: number;
  /** Time spent in seconds */
  sec?: number;
  /** Marks gained / available (structured questions and mock papers). */
  m?: number;
  mx?: number;
}

export interface Exam {
  id: string;
  name: string;
  subject?: SubjectId;
  /** 'exam' (default) or a coursework/oral 'deadline' (IO, IA, EE, TOK…). */
  kind?: 'exam' | 'deadline';
  /** ISO date-time string in local time, e.g. 2027-05-05T13:00 */
  date: string;
}

export type ThemePref = 'system' | 'light' | 'dark';

export interface Settings {
  theme: ThemePref;
  newPerDay: number;
  /** Daily study-time budget used by the planner (minutes). */
  dailyMinutes: number;
  maxReviewsPerSession: number;
  exams: Exam[];
  /** Subjects that appear in review queues / recommendations. */
  enabledSubjects: SubjectId[];
  /** Subjects hidden from the whole interface (you don't take them). */
  hiddenSubjects: SubjectId[];
}

export interface AppData {
  version: number;
  cards: Record<string, CardState>;
  reviews: ReviewLog[];
  practice: PracticeLog[];
  customCards: Card[];
  essays: EssayAttempt[];
  settings: Settings;
}

/** A timed writing attempt with self-assessed criterion scores. */
export interface EssayAttempt {
  id: string;
  /** Essay prompt id */
  prompt: string;
  subject: SubjectId;
  topic: string;
  rubric: string;
  /** Start time (ms) */
  t: number;
  /** Seconds actually used */
  sec: number;
  words: number;
  text: string;
  /** Self-assessed marks per criterion id; empty while still a draft. */
  scores: Record<string, number>;
  done: boolean;
}

export interface NumericSpec {
  value: number;
  /** Relative tolerance, e.g. 0.02 = ±2 %. */
  rel?: number;
  /** Absolute tolerance. */
  abs?: number;
  unit?: string;
}

interface QuestionBase {
  id: string;
  subject: SubjectId;
  topic: string;
  prompt: string;
  /** Worked solution / mark-scheme style explanation. */
  solution: string;
}

export interface MCQuestion extends QuestionBase {
  type: 'mc';
  options: string[];
  answer: number;
}

export interface NumericQuestion extends QuestionBase {
  type: 'numeric';
  numeric: NumericSpec;
}

export interface OpenQuestion extends QuestionBase {
  type: 'open';
  /** Model answer used for self-marking. */
  answer: string;
}

/** Short typed answer compared against accepted variants. */
export interface TextQuestion extends QuestionBase {
  type: 'text';
  answers: string[];
  /** When true, accents and capitalisation must match exactly. */
  strict?: boolean;
}

/** Put items into the correct order (items are stored in the correct order). */
export interface OrderQuestion extends QuestionBase {
  type: 'order';
  items: string[];
}

/** Match each left item to its right item (pairs stored correctly matched). */
export interface MatchQuestion extends QuestionBase {
  type: 'match';
  pairs: [string, string][];
}

/** One part of a multi-part (Paper 2-style) question. */
export interface StructuredPart {
  /** "a", "b", "c(i)"… */
  label: string;
  marks: number;
  prompt: string;
  /** If present the part is auto-marked: all marks for a correct value, otherwise 0 (self-override allowed). */
  numeric?: NumericSpec;
  /** Mark scheme: one point per line. */
  scheme: string;
}

/** Multi-part exam-style question with marks per part. */
export interface StructuredQuestion extends QuestionBase {
  type: 'structured';
  parts: StructuredPart[];
}

export type Question = MCQuestion | NumericQuestion | OpenQuestion | TextQuestion | OrderQuestion | MatchQuestion | StructuredQuestion;

/** A timed extended-writing task, self-assessed with a rubric. */
export interface EssayPrompt {
  id: string;
  subject: SubjectId;
  topic: string;
  /** Rubric id from data/rubrics.ts */
  rubric: string;
  prompt: string;
  minutes: number;
  minWords?: number;
  maxWords?: number;
  /** Planning hints / points a strong answer would cover. */
  guidance: string;
}
