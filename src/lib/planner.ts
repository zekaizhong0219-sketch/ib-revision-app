import type { AppData, Card, SubjectId } from '../types';
import { DAY_MS, isDue, isNew } from './srs';
import { daysToExam, recommend, startOfDay } from './stats';
import { newCardsStudiedToday } from './queue';

/** Rough time costs used for planning (seconds). */
export const SEC_PER_REVIEW = 10;
export const SEC_PER_NEW_CARD = 25;
/** Subjects whose exams are mainly extended writing get a weekly writing session. */
export const WRITING_SUBJECTS: SubjectId[] = ['spanish', 'english', 'history'];
const WRITING_INTERVAL_DAYS = 7;

export type PlanKind = 'review' | 'practice' | 'writing';

export interface PlanItem {
  subject: SubjectId;
  kind: PlanKind;
  minutes: number;
  /** Topic to focus on (practice / writing). */
  topic?: string;
  /** Number of cards (review). */
  cards?: number;
  reason: string;
}

export interface DayPlan {
  budget: number;
  total: number;
  items: PlanItem[];
  /** True when scheduled reviews alone exceed the budget. */
  overBudget: boolean;
}

const round5 = (m: number) => Math.max(5, Math.round(m / 5) * 5);

/**
 * Builds today's study plan within the daily budget:
 *  1. Scheduled reviews (due cards) for each active subject, plus today's new cards.
 *  2. The remaining time is split between subjects by urgency (exam proximity) and weakness,
 *     each slot aimed at the subject's top recommended topic. Writing subjects get a timed
 *     writing session if none was done in the last week.
 */
export function planDay(data: AppData, cards: Card[], subjects: SubjectId[], now: number): DayPlan {
  const budget = data.settings.dailyMinutes;
  const items: PlanItem[] = [];

  // 1. Reviews.
  const allowance = Math.max(0, data.settings.newPerDay - newCardsStudiedToday(data, now));
  const due = new Map<SubjectId, number>();
  const unseen = new Map<SubjectId, number>();
  for (const c of cards) {
    if (!subjects.includes(c.subject)) continue;
    const st = data.cards[c.id];
    if (st?.suspended) continue;
    if (isDue(st, now)) due.set(c.subject, (due.get(c.subject) ?? 0) + 1);
    else if (isNew(st)) unseen.set(c.subject, (unseen.get(c.subject) ?? 0) + 1);
  }
  const totalUnseen = [...unseen.values()].reduce((a, b) => a + b, 0);
  let reviewMinutes = 0;
  for (const s of subjects) {
    const d = due.get(s) ?? 0;
    const n = totalUnseen ? Math.round((allowance * (unseen.get(s) ?? 0)) / totalUnseen) : 0;
    if (d + n === 0) continue;
    const minutes = (d * SEC_PER_REVIEW + n * SEC_PER_NEW_CARD) / 60;
    reviewMinutes += minutes;
    items.push({
      subject: s,
      kind: 'review',
      minutes: round5(minutes),
      cards: d + n,
      reason: `${d} due${n ? ` + ${n} new` : ''}`,
    });
  }

  // 2. Practice / writing with the remaining time.
  const remaining = budget - items.reduce((a, b) => a + b.minutes, 0);
  if (remaining >= 5 && subjects.length) {
    const recs = recommend(data, cards, now, 1000);
    const weights = subjects.map((s) => {
      const top = recs.find((r) => r.subject === s);
      const days = daysToExam(data.settings.exams, s, now);
      const urgency = days === null ? 1 : 1 + Math.min(2, 30 / Math.max(days, 3));
      const weakness = top ? 1 - (top.stats.accuracy ?? 0.5) : 0.5;
      return { s, top, w: urgency * (0.5 + weakness) };
    });
    const totalW = weights.reduce((a, b) => a + b.w, 0);
    // Give time to the most urgent subjects first; drop slots under 10 minutes.
    weights.sort((a, b) => b.w - a.w);
    let left = remaining;
    for (const { s, top, w } of weights) {
      if (left < 10) break;
      const share = Math.min(left, Math.max(10, Math.round(((remaining * w) / totalW) / 5) * 5));
      const lastEssay = Math.max(0, ...data.essays.filter((e) => e.subject === s && e.done).map((e) => e.t));
      const writing = WRITING_SUBJECTS.includes(s) && now - lastEssay > WRITING_INTERVAL_DAYS * DAY_MS && share >= 30;
      const days = daysToExam(data.settings.exams, s, now);
      const reasons = [top?.reasons[0], days !== null && days < 60 ? `exam in ${Math.ceil(days)} d` : undefined].filter(Boolean);
      items.push({
        subject: s,
        kind: writing ? 'writing' : 'practice',
        minutes: share,
        topic: top?.topic,
        reason: writing ? 'no timed writing in the last 7 days' : reasons.join(' · ') || 'keep it fresh',
      });
      left -= share;
    }
  }

  const total = items.reduce((a, b) => a + b.minutes, 0);
  return { budget, total, items, overBudget: reviewMinutes > budget };
}

/** Estimated review minutes for each of the next `n` days, per subject (index 0 = today). */
export function reviewLoad(data: AppData, cards: Card[], subjects: SubjectId[], now: number, n = 7): Record<SubjectId, number[]> {
  const out = Object.fromEntries(subjects.map((s) => [s, new Array(n).fill(0)])) as Record<SubjectId, number[]>;
  const today = startOfDay(now);
  for (const c of cards) {
    if (!subjects.includes(c.subject)) continue;
    const st = data.cards[c.id];
    if (!st || st.suspended || st.last === 0) continue;
    const i = Math.max(0, Math.round((startOfDay(st.due) - today) / DAY_MS));
    if (i < n) out[c.subject][i] += SEC_PER_REVIEW / 60;
  }
  for (const s of subjects) out[s] = out[s].map((m) => Math.round(m * 10) / 10);
  return out;
}
