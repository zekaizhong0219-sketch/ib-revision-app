import type { Question, SubjectId } from '../types';
import { checkMC, checkNumeric, checkText, scoreMatch, scoreOrder } from './answer';
import { shuffle } from './queue';

/**
 * Mock exams: a timed paper assembled from the question bank and sat without feedback.
 * Auto-markable responses are marked at the end; open answers and non-numeric structured
 * parts are self-marked afterwards against the mark scheme, as in a real mock.
 */

export interface MockItem {
  q: Question;
  max: number;
}

/** Response captured while sitting the paper. */
export type MockResponse =
  | { kind: 'mc'; choice: number | null }
  | { kind: 'value'; text: string }
  | { kind: 'order'; order: string[] }
  | { kind: 'match'; choice: Record<string, string> }
  | { kind: 'parts'; texts: string[] };

/** Marks available for one question in a mock. */
export function itemMax(q: Question): number {
  switch (q.type) {
    case 'structured':
      return q.parts.reduce((s, p) => s + p.marks, 0);
    case 'order':
    case 'match':
    case 'open':
      return 2;
    default:
      return 1;
  }
}

/** Typical marks per minute in IB papers (≈ 1 mark per 1.2–1.5 min); used to size a mock. */
export const MINUTES_PER_MARK = 1.3;

/**
 * Assembles a paper of roughly `minutes / MINUTES_PER_MARK` marks. When structured questions
 * exist, about 60 % of the marks come from them (Paper 2 style), the rest from short items.
 * Questions are spread across topics by round-robin over shuffled topics.
 */
export function buildMock(bank: Question[], subject: SubjectId, minutes: number, seed = Date.now(), topics?: string[]): MockItem[] {
  const target = Math.max(5, Math.round(minutes / MINUTES_PER_MARK));
  const pool = bank.filter((q) => q.subject === subject && (!topics?.length || topics.includes(q.topic)));
  const structured = spread(pool.filter((q) => q.type === 'structured'), seed);
  const short = spread(pool.filter((q) => q.type !== 'structured'), seed + 1);
  const items: MockItem[] = [];
  let marks = 0;
  const structuredTarget = structured.length ? target * 0.6 : 0;
  for (const q of structured) {
    if (marks >= structuredTarget) break;
    const m = itemMax(q);
    if (marks + m > target + 2) continue;
    items.push({ q, max: m });
    marks += m;
  }
  for (const q of short) {
    if (marks >= target) break;
    const m = itemMax(q);
    items.push({ q, max: m });
    marks += m;
  }
  // Short items first (like Paper 1), then structured questions.
  return [...items.filter((i) => i.q.type !== 'structured'), ...items.filter((i) => i.q.type === 'structured')];
}

/** Shuffle, then interleave by topic so a short paper still covers many topics. */
function spread(qs: Question[], seed: number): Question[] {
  const byTopic = new Map<string, Question[]>();
  for (const q of shuffle(qs, seed)) {
    const l = byTopic.get(q.topic) ?? [];
    l.push(q);
    byTopic.set(q.topic, l);
  }
  const lists = shuffle([...byTopic.values()], seed + 7);
  const out: Question[] = [];
  for (let i = 0; out.length < qs.length; i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

export function emptyResponse(q: Question): MockResponse {
  switch (q.type) {
    case 'mc':
      return { kind: 'mc', choice: null };
    case 'order':
      return { kind: 'order', order: [] };
    case 'match':
      return { kind: 'match', choice: {} };
    case 'structured':
      return { kind: 'parts', texts: q.parts.map(() => '') };
    default:
      return { kind: 'value', text: '' };
  }
}

/**
 * Automatic marks for a response. Returns marks per part for structured questions:
 * `null` entries (and a null total for open questions) need self-marking.
 */
export function autoMark(q: Question, r: MockResponse): { total: number | null; parts?: (number | null)[] } {
  switch (q.type) {
    case 'mc':
      return { total: r.kind === 'mc' && checkMC(r.choice, q.answer) ? 1 : 0 };
    case 'numeric':
      return { total: r.kind === 'value' && checkNumeric(r.text, q.numeric).ok ? 1 : 0 };
    case 'text':
      return { total: r.kind === 'value' && checkText(r.text, q.answers, q.strict) ? 1 : 0 };
    case 'order':
      return { total: r.kind === 'order' && r.order.length ? Math.round(scoreOrder(r.order, q.items) * 2) : 0 };
    case 'match':
      return { total: r.kind === 'match' ? Math.round(scoreMatch(r.choice, q.pairs) * 2) : 0 };
    case 'open':
      return { total: null };
    case 'structured': {
      const texts = r.kind === 'parts' ? r.texts : [];
      const parts = q.parts.map((p, i) => {
        const t = texts[i] ?? '';
        if (p.numeric) return checkNumeric(t, p.numeric).ok ? p.marks : 0;
        if (p.accept) return checkText(t, p.accept) ? p.marks : 0;
        return t.trim() ? null : 0; // blank answers score 0 without self-marking
      });
      return { total: parts.every((x) => x !== null) ? parts.reduce<number>((s, x) => s + (x ?? 0), 0) : null, parts };
    }
  }
}
