import { describe, expect, it } from 'vitest';
import {
  FACTOR,
  FSRS_MAX_INTERVAL,
  fromSm2,
  fsrsPreview,
  fsrsSchedule,
  initDifficulty,
  initStability,
  intervalFor,
  nextDifficulty,
  retrievability,
  stabilityAfterLapse,
  stabilityAfterRecall,
} from './fsrs';
import { previewWith, scheduleWith } from './srs';
import type { CardState } from '../types';

const DAY = 86400000;
const T0 = Date.UTC(2026, 10, 2, 12);

describe('FSRS memory model', () => {
  it('retrievability is 0.9 after exactly S days and decreases with time', () => {
    expect(retrievability(10, 10)).toBeCloseTo(0.9, 10);
    expect(retrievability(0, 10)).toBe(1);
    expect(retrievability(20, 10)).toBeLessThan(0.9);
    expect(FACTOR).toBeCloseTo(19 / 81);
  });
  it('interval equals stability at 90 % retention, longer at lower retention', () => {
    expect(intervalFor(10, 0.9)).toBeCloseTo(10, 8);
    expect(intervalFor(10, 0.8)).toBeGreaterThan(10);
    expect(intervalFor(10, 0.95)).toBeLessThan(10);
  });
  it('initial stability and difficulty follow the default weights', () => {
    expect([1, 2, 3, 4].map(initStability)).toEqual([0.4872, 1.4003, 3.7145, 13.8206]);
    expect(initDifficulty(3)).toBeCloseTo(5.1618);
    expect(initDifficulty(1)).toBeCloseTo(5.1618 + 2 * 1.2298);
    expect(initDifficulty(4)).toBeLessThan(initDifficulty(3));
  });
  it('difficulty rises after Again, falls after Easy, stays within 1–10', () => {
    expect(nextDifficulty(5, 1)).toBeGreaterThan(5);
    expect(nextDifficulty(5, 4)).toBeLessThan(5);
    expect(nextDifficulty(10, 1)).toBeLessThanOrEqual(10);
    expect(nextDifficulty(1, 4)).toBeGreaterThanOrEqual(1);
  });
  it('successful recall increases stability, more when recall was harder (lower R)', () => {
    const atDue = stabilityAfterRecall(5, 10, 0.9, 3);
    const early = stabilityAfterRecall(5, 10, 0.99, 3);
    expect(atDue).toBeGreaterThan(10);
    expect(early).toBeLessThan(atDue);
    expect(stabilityAfterRecall(5, 10, 0.9, 2)).toBeLessThan(atDue);
    expect(stabilityAfterRecall(5, 10, 0.9, 4)).toBeGreaterThan(atDue);
  });
  it('a lapse never increases stability', () => {
    expect(stabilityAfterLapse(5, 30, 0.9)).toBeLessThan(30);
    expect(stabilityAfterLapse(5, 0.2, 0.9)).toBeLessThanOrEqual(0.2);
  });
});

describe('fsrsSchedule', () => {
  it('first answers use initial stability', () => {
    expect(fsrsSchedule(undefined, 'good', T0).interval).toBe(4); // S0(good) = 3.71 → 4 days
    expect(fsrsSchedule(undefined, 'easy', T0).interval).toBe(14);
    const again = fsrsSchedule(undefined, 'again', T0);
    expect(again.interval).toBe(0);
    expect(again.due).toBe(T0 + 10 * 60 * 1000);
    expect(again.lapses).toBe(0);
  });
  it('intervals grow with repeated on-time good answers and are capped', () => {
    let s = fsrsSchedule(undefined, 'good', T0);
    let prev = s.interval;
    for (let i = 0; i < 20; i++) {
      s = fsrsSchedule(s, 'good', s.due);
      expect(s.interval).toBeGreaterThanOrEqual(prev);
      prev = s.interval;
    }
    expect(s.interval).toBe(FSRS_MAX_INTERVAL);
  });
  it('keeps hard ≤ good < easy and Again at 0', () => {
    let s = fsrsSchedule(undefined, 'good', T0);
    s = fsrsSchedule(s, 'good', s.due);
    const p = fsrsPreview(s, s.due, 0.9);
    expect(p.again).toBe(0);
    expect(p.hard).toBeLessThanOrEqual(p.good);
    expect(p.good).toBeLessThan(p.easy);
    for (const g of ['hard', 'good', 'easy'] as const) expect(fsrsSchedule(s, g, s.due).interval).toBe(p[g]);
  });
  it('a lapse on a learned card counts, lowers stability and re-queues in minutes', () => {
    let s = fsrsSchedule(undefined, 'good', T0);
    s = fsrsSchedule(s, 'good', s.due);
    const failed = fsrsSchedule(s, 'again', s.due);
    expect(failed.lapses).toBe(1);
    expect(failed.reps).toBe(0);
    expect(failed.s!).toBeLessThan(s.s!);
    expect(failed.d!).toBeGreaterThan(s.d!);
  });
  it('lower desired retention gives longer intervals', () => {
    let s = fsrsSchedule(undefined, 'good', T0);
    s = fsrsSchedule(s, 'good', s.due);
    expect(fsrsSchedule(s, 'good', s.due, 0.8).interval).toBeGreaterThan(fsrsSchedule(s, 'good', s.due, 0.95).interval);
  });
  it('preserves suspension and the SM-2 ease factor', () => {
    const st: CardState = { ef: 2.1, interval: 6, reps: 2, lapses: 0, due: T0, last: T0 - 6 * DAY, suspended: true };
    const next = fsrsSchedule(st, 'good', T0);
    expect(next.suspended).toBe(true);
    expect(next.ef).toBe(2.1);
  });
});

describe('migration from SM-2', () => {
  it('derives memory state from interval and ease', () => {
    expect(fromSm2({ ef: 2.5, interval: 15, reps: 3, lapses: 0, due: 0, last: 1 })).toEqual({ s: 15, d: expect.closeTo(5.1618, 3) });
    expect(fromSm2({ ef: 1.3, interval: 2, reps: 1, lapses: 2, due: 0, last: 1 }).d).toBeCloseTo(10);
    expect(fromSm2({ ef: 2.8, interval: 10, reps: 3, lapses: 0, due: 0, last: 1 }).d).toBeLessThan(5.1618);
  });
  it('an SM-2 card reviewed on time with Good keeps a sensible, growing interval', () => {
    const sm2: CardState = { ef: 2.5, interval: 15, reps: 3, lapses: 0, due: T0, last: T0 - 15 * DAY };
    const next = fsrsSchedule(sm2, 'good', T0);
    expect(next.interval).toBeGreaterThan(15);
    expect(next.s).toBeDefined();
  });
});

describe('scheduler dispatch', () => {
  const st: CardState = { ef: 2.5, interval: 6, reps: 2, lapses: 0, due: T0, last: T0 - 6 * DAY, s: 6, d: 5 };
  it('uses FSRS or SM-2 according to settings', () => {
    const f = scheduleWith({ scheduler: 'fsrs', retention: 0.9 }, st, 'good', T0);
    const m = scheduleWith({ scheduler: 'sm2', retention: 0.9 }, st, 'good', T0);
    expect(f.s).toBeDefined();
    expect(m.s).toBeUndefined(); // SM-2 drops FSRS fields
    expect(m.interval).toBe(15); // 6 × 2.5
    expect(previewWith({ scheduler: 'sm2', retention: 0.9 }, st, T0).good).toBe(15);
  });
});
