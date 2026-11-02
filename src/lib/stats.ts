import type { AppData, Card, Exam, Grade, PracticeResult, SubjectId } from '../types';
import { DAY_MS, isDue, isMature } from './srs';
import { getRubric, rubricMax } from '../data/rubrics';

/** Local-time calendar day key, e.g. "2026-11-02". */
export function dayKey(t: number): string {
  const d = new Date(t);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export const GRADE_SCORE: Record<Grade, number> = { again: 0, hard: 0.5, good: 1, easy: 1 };
export const RESULT_SCORE: Record<PracticeResult, number> = { incorrect: 0, partial: 0.5, correct: 1 };

/** Set of day keys with any study activity. */
export function activeDays(data: Pick<AppData, 'reviews' | 'practice'> & { essays?: AppData['essays'] }): Set<string> {
  const days = new Set<string>();
  for (const r of data.reviews) days.add(dayKey(r.t));
  for (const p of data.practice) days.add(dayKey(p.t));
  for (const e of data.essays ?? []) if (e.done) days.add(dayKey(e.t));
  return days;
}

/**
 * Current streak in days. Counts back from today; if nothing has been done today yet,
 * the streak is still alive if yesterday was active.
 */
export function currentStreak(data: Pick<AppData, 'reviews' | 'practice'> & { essays?: AppData['essays'] }, now: number): number {
  const days = activeDays(data);
  let cursor = startOfDay(now);
  if (!days.has(dayKey(cursor))) cursor -= DAY_MS;
  let streak = 0;
  // Use noon to step back safely across DST changes.
  let probe = cursor + 12 * 3600 * 1000;
  while (days.has(dayKey(probe))) {
    streak++;
    probe -= DAY_MS;
  }
  return streak;
}

export function longestStreak(data: Pick<AppData, 'reviews' | 'practice'> & { essays?: AppData['essays'] }): number {
  const keys = [...activeDays(data)].sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const k of keys) {
    const t = new Date(`${k}T12:00:00`).getTime();
    run = prev !== null && Math.round((t - prev) / DAY_MS) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  return best;
}

export interface TopicStats {
  subject: SubjectId;
  topic: string;
  total: number;
  seen: number;
  due: number;
  mature: number;
  reviews: number;
  practiceAttempts: number;
  /** Weighted accuracy 0..1 over flashcard reviews and practice answers; null if no attempts. */
  accuracy: number | null;
}

export function topicStats(data: AppData, cards: Card[], now: number, windowDays = 90): Map<string, TopicStats> {
  const key = (s: SubjectId, t: string) => `${s}|${t}`;
  const map = new Map<string, TopicStats & { scoreSum: number; attempts: number }>();
  const get = (s: SubjectId, t: string) => {
    const k = key(s, t);
    let v = map.get(k);
    if (!v) {
      v = { subject: s, topic: t, total: 0, seen: 0, due: 0, mature: 0, reviews: 0, practiceAttempts: 0, accuracy: null, scoreSum: 0, attempts: 0 };
      map.set(k, v);
    }
    return v;
  };
  for (const c of cards) {
    const st = data.cards[c.id];
    const v = get(c.subject, c.topic);
    if (st?.suspended) continue;
    v.total++;
    if (st && st.last > 0) v.seen++;
    if (isDue(st, now)) v.due++;
    if (isMature(st)) v.mature++;
  }
  const since = now - windowDays * DAY_MS;
  for (const r of data.reviews) {
    const v = get(r.s, r.tp);
    v.reviews++;
    if (r.t >= since) {
      v.scoreSum += GRADE_SCORE[r.g];
      v.attempts++;
    }
  }
  for (const p of data.practice) {
    const v = get(p.s, p.tp);
    v.practiceAttempts++;
    if (p.t >= since) {
      // Practice questions are weighted double: they test application, not just recall.
      v.scoreSum += 2 * RESULT_SCORE[p.r];
      v.attempts += 2;
    }
  }
  for (const e of data.essays ?? []) {
    if (!e.done) continue;
    const pct = essayPercent(e);
    if (pct === null) continue;
    const v = get(e.subject, e.topic);
    v.practiceAttempts++;
    if (e.t >= since) {
      // Self-assessed essays count once: valuable, but self-marking is less reliable.
      v.scoreSum += pct;
      v.attempts += 1;
    }
  }
  const out = new Map<string, TopicStats>();
  for (const [k, v] of map) {
    const { scoreSum, attempts, ...rest } = v;
    out.set(k, { ...rest, accuracy: attempts > 0 ? scoreSum / attempts : null });
  }
  return out;
}

/** Days until the next upcoming exam for a subject (or any exam without a subject). */
export function daysToExam(exams: Exam[], subject: SubjectId | null, now: number): number | null {
  let best: number | null = null;
  for (const e of exams) {
    if (e.kind === 'deadline') continue;
    if (subject && e.subject && e.subject !== subject) continue;
    const t = new Date(e.date).getTime();
    if (!Number.isFinite(t) || t < now) continue;
    const d = (t - now) / DAY_MS;
    if (best === null || d < best) best = d;
  }
  return best;
}

export interface Recommendation {
  subject: SubjectId;
  topic: string;
  score: number;
  reasons: string[];
  stats: TopicStats;
}

/**
 * Ranks topics by how urgently they should be revised. Heuristic score combining:
 *  - weakness: 1 − accuracy (unknown accuracy counts as 0.5), weighted most;
 *  - coverage: fraction of the topic's cards never studied;
 *  - backlog: number of due cards (saturating at 20);
 *  - urgency: multiplier growing as the subject's exam approaches.
 */
export function recommend(data: AppData, cards: Card[], now: number, limit = 5): Recommendation[] {
  const stats = topicStats(data, cards, now);
  const recs: Recommendation[] = [];
  for (const s of stats.values()) {
    if (!data.settings.enabledSubjects.includes(s.subject) || data.settings.hiddenSubjects.includes(s.subject)) continue;
    if (s.total === 0 && s.practiceAttempts === 0) continue;
    const acc = s.accuracy ?? 0.5;
    const weakness = 1 - acc;
    const coverage = s.total > 0 ? 1 - s.seen / s.total : 0;
    const backlog = Math.min(s.due, 20) / 20;
    const days = daysToExam(data.settings.exams, s.subject, now);
    const urgency = days === null ? 1 : 1 + Math.min(1, 30 / Math.max(days, 3));
    // Confidence: low-data topics shouldn't dominate purely through noisy accuracy.
    const attempts = s.reviews + s.practiceAttempts;
    const confidence = Math.min(1, attempts / 10);
    const score = urgency * (2 * weakness * (0.5 + 0.5 * confidence) + coverage + backlog);
    const reasons: string[] = [];
    if (s.accuracy !== null && attempts >= 3 && s.accuracy < 0.7) reasons.push(`${Math.round(s.accuracy * 100)}% accuracy`);
    if (s.due > 0) reasons.push(`${s.due} card${s.due === 1 ? '' : 's'} due`);
    if (s.total > 0 && coverage > 0.3) reasons.push(`${Math.round(coverage * 100)}% not yet studied`);
    if (days !== null && days < 30) reasons.push(`exam in ${Math.ceil(days)} d`);
    if (!reasons.length) reasons.push(s.accuracy !== null ? `${Math.round(s.accuracy * 100)}% accuracy` : 'keep it fresh');
    recs.push({ subject: s.subject, topic: s.topic, score, reasons, stats: s });
  }
  recs.sort((a, b) => b.score - a.score || a.topic.localeCompare(b.topic));
  return recs.slice(0, limit);
}

/** Activity counts (flashcard reviews + practice answers) for each of the last `n` days, oldest first. */
export function activityByDay(data: Pick<AppData, 'reviews' | 'practice'>, now: number, n = 30): { day: string; reviews: number; practice: number }[] {
  const out: { day: string; reviews: number; practice: number }[] = [];
  const idx = new Map<string, number>();
  const base = startOfDay(now) + 12 * 3600 * 1000;
  for (let i = n - 1; i >= 0; i--) {
    const k = dayKey(base - i * DAY_MS);
    idx.set(k, out.length);
    out.push({ day: k, reviews: 0, practice: 0 });
  }
  for (const r of data.reviews) {
    const i = idx.get(dayKey(r.t));
    if (i !== undefined) out[i].reviews++;
  }
  for (const p of data.practice) {
    const i = idx.get(dayKey(p.t));
    if (i !== undefined) out[i].practice++;
  }
  return out;
}

/** Number of cards falling due on each of the next `n` days (index 0 = today incl. overdue). */
export function dueForecast(data: AppData, cards: Card[], now: number, n = 14): number[] {
  const out = new Array(n).fill(0);
  const today = startOfDay(now);
  for (const c of cards) {
    const st = data.cards[c.id];
    if (!st || st.suspended || st.last === 0) continue;
    const d = Math.floor((startOfDay(st.due) - today) / DAY_MS);
    const i = Math.max(0, Math.round(d));
    if (i < n) out[i]++;
  }
  return out;
}

/** Self-assessed essay score as a fraction 0..1, or null if the rubric is unknown or unscored. */
export function essayPercent(e: Pick<AppData['essays'][number], 'rubric' | 'scores'>): number | null {
  const r = getRubric(e.rubric);
  if (!r) return null;
  const max = rubricMax(r);
  if (!max || !Object.keys(e.scores).length) return null;
  const got = r.criteria.reduce((s, c) => s + Math.min(c.max, Math.max(0, e.scores[c.id] ?? 0)), 0);
  return got / max;
}
