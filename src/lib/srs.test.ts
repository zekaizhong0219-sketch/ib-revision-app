import { describe, expect, it } from 'vitest';
import {
  DAY_MS,
  MAX_INTERVAL_DAYS,
  MIN_EF,
  RELEARN_MINUTES,
  START_EF,
  formatInterval,
  isDue,
  isNew,
  newCardState,
  nextInterval,
  previewIntervals,
  schedule,
  updateEase,
} from './srs';
import type { Grade } from '../types';

const T0 = Date.UTC(2026, 10, 2, 12);

describe('updateEase (SM-2 formula)', () => {
  it('matches the SM-2 EF formula for each quality', () => {
    expect(updateEase(2.5, 5)).toBeCloseTo(2.6, 6);
    expect(updateEase(2.5, 4)).toBeCloseTo(2.5, 6);
    expect(updateEase(2.5, 3)).toBeCloseTo(2.36, 6);
    expect(updateEase(2.5, 2)).toBeCloseTo(2.18, 6);
  });
  it('never drops below the minimum', () => {
    let ef = START_EF;
    for (let i = 0; i < 50; i++) ef = updateEase(ef, 2);
    expect(ef).toBe(MIN_EF);
  });
});

describe('schedule', () => {
  it('first good review → 1 day, second → 6 days, then × EF', () => {
    let s = schedule(undefined, 'good', T0);
    expect(s.reps).toBe(1);
    expect(s.interval).toBe(1);
    expect(s.due).toBe(T0 + DAY_MS);
    s = schedule(s, 'good', s.due);
    expect(s.interval).toBe(6);
    s = schedule(s, 'good', s.due);
    expect(s.interval).toBe(Math.round(6 * 2.5));
    expect(s.reps).toBe(3);
  });

  it('easy grows faster than good which grows faster than hard', () => {
    const base = schedule(schedule(undefined, 'good', T0), 'good', T0 + DAY_MS);
    const h = nextInterval(base, 'hard');
    const g = nextInterval(base, 'good');
    const e = nextInterval(base, 'easy');
    expect(h).toBeLessThan(g);
    expect(g).toBeLessThan(e);
  });

  it('again resets reps, counts a lapse and re-queues in minutes', () => {
    let s = schedule(undefined, 'good', T0);
    s = schedule(s, 'good', T0 + DAY_MS);
    const failed = schedule(s, 'again', T0 + 7 * DAY_MS);
    expect(failed.reps).toBe(0);
    expect(failed.interval).toBe(0);
    expect(failed.lapses).toBe(1);
    expect(failed.due).toBe(T0 + 7 * DAY_MS + RELEARN_MINUTES * 60 * 1000);
    expect(failed.ef).toBeLessThan(s.ef);
  });

  it('failing a brand-new card is not a lapse', () => {
    const s = schedule(undefined, 'again', T0);
    expect(s.lapses).toBe(0);
    expect(s.last).toBe(T0);
  });

  it('interval is monotonic for repeated good answers and capped', () => {
    let s = newCardState(T0);
    let prev = 0;
    let now = T0;
    for (let i = 0; i < 30; i++) {
      s = schedule(s, 'good', now);
      expect(s.interval).toBeGreaterThanOrEqual(prev);
      prev = s.interval;
      now = s.due;
    }
    expect(s.interval).toBe(MAX_INTERVAL_DAYS);
  });

  it('hard on a learned card never shrinks the interval', () => {
    let s = schedule(undefined, 'good', T0);
    s = schedule(s, 'good', T0);
    s = { ...s, ef: MIN_EF };
    const next = schedule(s, 'hard', T0);
    expect(next.interval).toBeGreaterThanOrEqual(s.interval);
  });

  it('is pure (does not mutate input)', () => {
    const s = newCardState(T0);
    const copy = { ...s };
    schedule(s, 'easy', T0);
    expect(s).toEqual(copy);
  });

  it('preserves suspension flag', () => {
    const s = { ...newCardState(T0), suspended: true };
    expect(schedule(s, 'good', T0).suspended).toBe(true);
  });
});

describe('helpers', () => {
  it('isNew / isDue', () => {
    expect(isNew(undefined)).toBe(true);
    const s = schedule(undefined, 'good', T0);
    expect(isNew(s)).toBe(false);
    expect(isDue(s, T0)).toBe(false);
    expect(isDue(s, T0 + DAY_MS)).toBe(true);
    expect(isDue({ ...s, suspended: true }, T0 + DAY_MS)).toBe(false);
    expect(isDue(undefined, T0)).toBe(false);
  });

  it('previewIntervals matches schedule', () => {
    const s = schedule(schedule(undefined, 'good', T0), 'good', T0);
    const p = previewIntervals(s, T0);
    for (const g of ['hard', 'good', 'easy'] as Grade[]) {
      expect(schedule(s, g, T0).interval).toBe(p[g]);
    }
    expect(p.again).toBe(0);
  });

  it('formatInterval', () => {
    expect(formatInterval(0)).toBe(`${RELEARN_MINUTES}m`);
    expect(formatInterval(3)).toBe('3d');
    expect(formatInterval(60)).toBe('2mo');
    expect(formatInterval(365)).toBe('1.0y');
  });
});
