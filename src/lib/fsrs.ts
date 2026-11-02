import type { CardState, Grade } from '../types';

/**
 * FSRS-4.5 (Free Spaced Repetition Scheduler) with the published default parameters.
 * Memory model: each card has a stability S (days until recall probability falls to 90 %)
 * and a difficulty D (1–10). Retrievability decays as R(t) = (1 + F·t/S)^C with C = −0.5,
 * F = 19/81, so R(S) = 0.9. Intervals are chosen so that R falls to the desired retention.
 *
 * Reference: open-spaced-repetition/fsrs4anki, algorithm v4.5.
 */

export const FSRS_WEIGHTS = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755,
] as const;

const w = FSRS_WEIGHTS;
export const DECAY = -0.5;
export const FACTOR = 19 / 81;
const DAY_MS = 24 * 60 * 60 * 1000;
const RELEARN_MS = 10 * 60 * 1000;
export const FSRS_MAX_INTERVAL = 365;

export const RATING: Record<Grade, 1 | 2 | 3 | 4> = { again: 1, hard: 2, good: 3, easy: 4 };

const clampD = (d: number) => Math.min(10, Math.max(1, d));

export function initStability(g: number): number {
  return Math.max(0.1, w[g - 1]);
}

export function initDifficulty(g: number): number {
  return clampD(w[4] - (g - 3) * w[5]);
}

/** Probability of recall after `elapsedDays` for stability `s`. */
export function retrievability(elapsedDays: number, s: number): number {
  return Math.pow(1 + (FACTOR * Math.max(0, elapsedDays)) / s, DECAY);
}

/** Days until retrievability drops to `retention`. */
export function intervalFor(s: number, retention: number): number {
  return (s / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
}

export function nextDifficulty(d: number, g: number): number {
  const dPrime = d - w[6] * (g - 3);
  // Mean reversion towards the initial difficulty of a "good" first answer.
  return clampD(w[7] * initDifficulty(3) + (1 - w[7]) * dPrime);
}

export function stabilityAfterRecall(d: number, s: number, r: number, g: number): number {
  const hardPenalty = g === 2 ? w[15] : 1;
  const easyBonus = g === 4 ? w[16] : 1;
  return s * (Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp(w[10] * (1 - r)) - 1) * hardPenalty * easyBonus + 1);
}

export function stabilityAfterLapse(d: number, s: number, r: number): number {
  const sf = w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp(w[14] * (1 - r));
  return Math.min(sf, s); // forgetting never increases stability
}

/**
 * Approximate FSRS memory state for a card scheduled by SM-2 so far:
 * stability ≈ current interval; difficulty mapped linearly from the ease factor
 * (EF 2.5 → default difficulty ≈ 5.2, EF 1.3 → 10; easier cards below 5).
 */
export function fromSm2(st: CardState): { s: number; d: number } {
  const s = st.interval > 0 ? st.interval : initStability(st.lapses > 0 ? 1 : 3);
  const d = clampD(initDifficulty(3) + ((2.5 - st.ef) / 1.2) * (10 - initDifficulty(3)));
  return { s, d };
}

const toDays = (s: number, retention: number) => Math.min(FSRS_MAX_INTERVAL, Math.max(1, Math.round(intervalFor(s, retention))));

interface Raw {
  s: number;
  d: number;
  lapsed: boolean;
  /** Days (0 for a failed answer). */
  interval: number;
}

/** Memory-state update for one answer, without any cross-grade adjustment. */
function computeRaw(prev: CardState | undefined, g: 1 | 2 | 3 | 4, now: number, retention: number): Raw {
  const isNew = !prev || prev.last === 0;
  let s: number;
  let d: number;
  let lapsed = false;
  if (isNew) {
    s = initStability(g);
    d = initDifficulty(g);
  } else {
    const mem = prev.s !== undefined && prev.d !== undefined ? { s: prev.s, d: prev.d } : fromSm2(prev);
    const r = retrievability((now - prev.last) / DAY_MS, mem.s);
    d = nextDifficulty(mem.d, g);
    if (g === 1) {
      s = stabilityAfterLapse(mem.d, mem.s, r);
      lapsed = prev.reps > 0;
    } else {
      s = stabilityAfterRecall(mem.d, mem.s, r, g);
    }
  }
  s = Math.max(0.1, s);
  return { s, d, lapsed, interval: g === 1 ? 0 : toDays(s, retention) };
}

/** Final interval for grade g, guaranteeing hard ≤ good < easy for the same card. */
function orderedInterval(prev: CardState | undefined, g: 1 | 2 | 3 | 4, now: number, retention: number): number {
  const raw = computeRaw(prev, g, now, retention).interval;
  if (g <= 2) return raw;
  if (g === 3) return Math.max(raw, computeRaw(prev, 2, now, retention).interval);
  return Math.min(FSRS_MAX_INTERVAL, Math.max(raw, orderedInterval(prev, 3, now, retention) + 1));
}

/** Intervals (days; 0 = relearn in minutes) each grade would produce. */
export function fsrsPreview(prev: CardState | undefined, now: number, retention: number): Record<Grade, number> {
  return {
    again: 0,
    hard: orderedInterval(prev, 2, now, retention),
    good: orderedInterval(prev, 3, now, retention),
    easy: orderedInterval(prev, 4, now, retention),
  };
}

export function fsrsSchedule(prev: CardState | undefined, grade: Grade, now: number, retention = 0.9): CardState {
  const g = RATING[grade];
  const base: CardState = prev ?? { ef: 2.5, interval: 0, reps: 0, lapses: 0, due: now, last: 0 };
  const raw = computeRaw(prev, g, now, retention);
  if (g === 1) {
    return { ...base, s: raw.s, d: raw.d, reps: 0, interval: 0, lapses: base.lapses + (raw.lapsed ? 1 : 0), due: now + RELEARN_MS, last: now };
  }
  const interval = orderedInterval(prev, g, now, retention);
  // ef is kept unchanged so switching back to SM-2 still works.
  return { ...base, s: raw.s, d: raw.d, reps: base.reps + 1, interval, due: now + interval * DAY_MS, last: now };
}
