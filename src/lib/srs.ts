import type { CardState, Grade } from '../types';

/**
 * Spaced-repetition scheduler: a variant of SuperMemo SM-2.
 *
 * Grades map onto SM-2 quality scores q ∈ {0..5}:
 *   again → 2 (failed recall), hard → 3, good → 4, easy → 5.
 *
 * - EF' = EF + (0.1 − (5 − q)(0.08 + (5 − q)·0.02)), clamped to ≥ 1.3.
 * - q < 3  → repetition count resets, the card is re-shown after RELEARN_MINUTES.
 * - First success → 1 day, second → 6 days, then interval·EF.
 * - "hard" grows the interval more slowly (×1.2), "easy" gets a 1.3 bonus.
 */

export const DAY_MS = 24 * 60 * 60 * 1000;
export const MIN_EF = 1.3;
export const START_EF = 2.5;
export const RELEARN_MINUTES = 10;
export const MAX_INTERVAL_DAYS = 365;

export const GRADE_QUALITY: Record<Grade, number> = {
  again: 2,
  hard: 3,
  good: 4,
  easy: 5,
};

export function newCardState(now: number): CardState {
  return { ef: START_EF, interval: 0, reps: 0, lapses: 0, due: now, last: 0 };
}

export function updateEase(ef: number, q: number): number {
  const next = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  return Math.max(MIN_EF, Math.round(next * 1000) / 1000);
}

/** Returns the next interval in days (0 means "relearn today"). */
export function nextInterval(state: CardState, grade: Grade): number {
  const q = GRADE_QUALITY[grade];
  if (q < 3) return 0;
  const ef = updateEase(state.ef, q);
  let interval: number;
  if (state.reps === 0) {
    interval = grade === 'easy' ? 4 : 1;
  } else if (state.reps === 1) {
    interval = grade === 'hard' ? 3 : grade === 'easy' ? 8 : 6;
  } else {
    const base = Math.max(1, state.interval);
    if (grade === 'hard') interval = base * 1.2;
    else if (grade === 'easy') interval = base * ef * 1.3;
    else interval = base * ef;
  }
  interval = Math.round(interval);
  // Always move forward at least one day for a successful review of a learned card.
  if (state.reps >= 2) interval = Math.max(interval, Math.max(1, state.interval) + (grade === 'hard' ? 0 : 1));
  return Math.min(MAX_INTERVAL_DAYS, Math.max(1, interval));
}

export function schedule(state: CardState | undefined, grade: Grade, now: number): CardState {
  const prev = state ?? newCardState(now);
  const q = GRADE_QUALITY[grade];
  const ef = updateEase(prev.ef, q);
  if (q < 3) {
    return {
      ...prev,
      ef,
      reps: 0,
      interval: 0,
      lapses: prev.reps > 0 ? prev.lapses + 1 : prev.lapses,
      due: now + RELEARN_MINUTES * 60 * 1000,
      last: now,
    };
  }
  const interval = nextInterval(prev, grade);
  return {
    ...prev,
    ef,
    reps: prev.reps + 1,
    interval,
    due: now + interval * DAY_MS,
    last: now,
  };
}

export function isNew(state: CardState | undefined): boolean {
  return !state || state.last === 0;
}

export function isDue(state: CardState | undefined, now: number): boolean {
  if (!state || state.suspended) return false;
  return state.last > 0 && state.due <= now;
}

/** "Mature" = interval of at least 21 days (Anki convention). */
export function isMature(state: CardState | undefined): boolean {
  return !!state && state.interval >= 21;
}

/** Human-readable interval preview for the grade buttons. */
export function formatInterval(days: number): string {
  if (days <= 0) return `${RELEARN_MINUTES}m`;
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

export function previewIntervals(state: CardState | undefined, now: number): Record<Grade, number> {
  const s = state ?? newCardState(now);
  return {
    again: 0,
    hard: nextInterval(s, 'hard'),
    good: nextInterval(s, 'good'),
    easy: nextInterval(s, 'easy'),
  };
}
