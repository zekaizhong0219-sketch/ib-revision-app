import type { AppData, Card, SubjectId } from '../types';
import { isDue, isNew } from './srs';
import { dayKey } from './stats';

export interface QueueFilter {
  subjects: SubjectId[];
  /** Topic keys "subject|topic"; empty = all topics of the chosen subjects. */
  topics?: string[];
}

export function matchesFilter(card: Card, f: QueueFilter): boolean {
  if (!f.subjects.includes(card.subject)) return false;
  if (f.topics && f.topics.length && !f.topics.includes(`${card.subject}|${card.topic}`)) return false;
  return true;
}

/** Number of cards studied for the first time today, derived from the review log. */
export function newCardsStudiedToday(data: AppData, now: number): number {
  const today = dayKey(now);
  const before = new Set<string>();
  const todayIds = new Set<string>();
  for (const r of data.reviews) {
    if (dayKey(r.t) === today) todayIds.add(r.c);
    else if (r.t < now) before.add(r.c);
  }
  let n = 0;
  for (const id of todayIds) if (!before.has(id)) n++;
  return n;
}

/** Deterministic shuffle (mulberry32) so tests are reproducible. */
export function shuffle<T>(items: T[], seed = Date.now()): T[] {
  const a = [...items];
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds a review session: due cards first (most overdue first), then new cards
 * up to the remaining daily allowance (in syllabus order, interleaved across subjects).
 */
export function buildQueue(data: AppData, cards: Card[], filter: QueueFilter, now: number): Card[] {
  const eligible = cards.filter((c) => matchesFilter(c, filter) && !data.cards[c.id]?.suspended);
  const due = eligible
    .filter((c) => isDue(data.cards[c.id], now))
    .sort((a, b) => data.cards[a.id].due - data.cards[b.id].due);
  const allowance = Math.max(0, data.settings.newPerDay - newCardsStudiedToday(data, now));
  const newBySubject = new Map<SubjectId, Card[]>();
  for (const c of eligible) {
    if (!isNew(data.cards[c.id])) continue;
    const list = newBySubject.get(c.subject) ?? [];
    list.push(c);
    newBySubject.set(c.subject, list);
  }
  const fresh: Card[] = [];
  const lists = [...newBySubject.values()];
  for (let i = 0; fresh.length < allowance && lists.some((l) => i < l.length); i++) {
    for (const l of lists) {
      if (i < l.length && fresh.length < allowance) fresh.push(l[i]);
    }
  }
  return [...due, ...fresh].slice(0, data.settings.maxReviewsPerSession);
}

/** Counts for the review start screen. */
export function queueCounts(data: AppData, cards: Card[], filter: QueueFilter, now: number) {
  let due = 0;
  let unseen = 0;
  for (const c of cards) {
    if (!matchesFilter(c, filter)) continue;
    const st = data.cards[c.id];
    if (st?.suspended) continue;
    if (isDue(st, now)) due++;
    else if (isNew(st)) unseen++;
  }
  const allowance = Math.max(0, data.settings.newPerDay - newCardsStudiedToday(data, now));
  return { due, unseen, newToday: Math.min(unseen, allowance) };
}
