import { describe, expect, it } from 'vitest';
import { autoMark, buildMock, emptyResponse, itemMax, MINUTES_PER_MARK } from './mock';
import { calibrate, estimateGrade, gradeFromPercent } from './grades';
import { addMistakeCards, isLeech, mistakeCard, MISTAKE_PREFIX } from './mistakes';
import { defaultData, sanitizeData } from './storage';
import { ALL_QUESTIONS } from '../data/questions';
import type { MCQuestion, Question, StructuredQuestion } from '../types';

const mc: MCQuestion = { id: 'q-mc', subject: 'physics', topic: 'A.1', type: 'mc', prompt: 'p', solution: 's', options: ['a', 'b'], answer: 1 };
const st: StructuredQuestion = {
  id: 'q-st',
  subject: 'physics',
  topic: 'A.2',
  type: 'structured',
  prompt: 'stem',
  solution: '',
  parts: [
    { label: 'a', marks: 2, prompt: 'calc', numeric: { value: 10 }, scheme: 'x' },
    { label: 'b', marks: 1, prompt: 'word', accept: ['swift'], scheme: 'y' },
    { label: 'c', marks: 3, prompt: 'explain', scheme: 'z' },
  ],
};

describe('mock marking', () => {
  it('assigns marks per question type', () => {
    expect(itemMax(mc)).toBe(1);
    expect(itemMax(st)).toBe(6);
    expect(itemMax({ ...mc, type: 'open', answer: 'a' } as unknown as Question)).toBe(2);
  });
  it('auto-marks MC, numeric and text parts; leaves explanations for self-marking', () => {
    expect(autoMark(mc, { kind: 'mc', choice: 1 }).total).toBe(1);
    expect(autoMark(mc, { kind: 'mc', choice: null }).total).toBe(0);
    const r = autoMark(st, { kind: 'parts', texts: ['10', 'Swift', 'because…'] });
    expect(r.parts).toEqual([2, 1, null]);
    expect(r.total).toBeNull();
    const blank = autoMark(st, { kind: 'parts', texts: ['9', '', ''] });
    expect(blank.parts).toEqual([0, 0, 0]);
    expect(blank.total).toBe(0);
  });
  it('gives partial credit for order and match out of 2', () => {
    const order = { id: 'o', subject: 'history', topic: 'W12.CR', type: 'order', prompt: '', solution: '', items: ['a', 'b', 'c'] } as Question;
    expect(autoMark(order, { kind: 'order', order: ['a', 'b', 'c'] }).total).toBe(2);
    expect(autoMark(order, { kind: 'order', order: ['a', 'c', 'b'] }).total).toBe(1);
    expect(autoMark(order, emptyResponse(order)).total).toBe(0);
  });
});

describe('buildMock', () => {
  it('sizes the paper to the time and mixes short and structured questions', () => {
    const items = buildMock(ALL_QUESTIONS, 'physics', 60, 42);
    const marks = items.reduce((s, i) => s + i.max, 0);
    const target = Math.round(60 / MINUTES_PER_MARK);
    expect(marks).toBeGreaterThanOrEqual(target);
    expect(marks).toBeLessThanOrEqual(target + 8);
    expect(items.some((i) => i.q.type === 'structured')).toBe(true);
    expect(items.every((i) => i.q.subject === 'physics')).toBe(true);
    // short items come first
    const firstStructured = items.findIndex((i) => i.q.type === 'structured');
    expect(items.slice(firstStructured).every((i) => i.q.type === 'structured')).toBe(true);
    expect(new Set(items.map((i) => i.q.id)).size).toBe(items.length);
  });
  it('covers several topics and respects a topic filter', () => {
    const items = buildMock(ALL_QUESTIONS, 'history', 30, 1);
    expect(new Set(items.map((i) => i.q.topic)).size).toBeGreaterThanOrEqual(5);
    const only = buildMock(ALL_QUESTIONS, 'history', 30, 1, ['W12.CR']);
    expect(only.every((i) => i.q.topic === 'W12.CR')).toBe(true);
  });
  it('keeps Paper 3 investigations out of mixed papers and builds style-only papers', () => {
    for (let seed = 0; seed < 20; seed++) {
      expect(buildMock(ALL_QUESTIONS, 'math', 90, seed).some((i) => i.q.type === 'structured' && i.q.style === 'P3')).toBe(false);
    }
    const p3 = buildMock(ALL_QUESTIONS, 'math', 60, 3, undefined, 'P3');
    expect(p3.length).toBeGreaterThanOrEqual(2);
    expect(p3.every((i) => i.q.type === 'structured' && i.q.style === 'P3')).toBe(true);
    const p1b = buildMock(ALL_QUESTIONS, 'chemistry', 30, 3, undefined, 'P1B');
    expect(p1b.length).toBeGreaterThanOrEqual(2);
    expect(p1b.every((i) => i.q.type === 'structured' && i.q.style === 'P1B')).toBe(true);
  });
});

describe('grades', () => {
  it('converts percentages using the guide thresholds', () => {
    expect(gradeFromPercent(85)).toBe(7);
    expect(gradeFromPercent(70)).toBe(7);
    expect(gradeFromPercent(69.9)).toBe(6);
    expect(gradeFromPercent(40)).toBe(4);
    expect(gradeFromPercent(5)).toBe(1);
  });
  it('needs two results and weights recent ones more', () => {
    const d = defaultData();
    d.mocks.push({ id: 'm1', subject: 'math', t: 1, minutes: 60, got: 30, max: 60, items: 10 });
    expect(estimateGrade(d, 'math')).toBeNull();
    d.mocks.push({ id: 'm2', subject: 'math', t: 2, minutes: 60, got: 48, max: 60, items: 10 });
    const e = estimateGrade(d, 'math')!;
    expect(e.n).toBe(2);
    expect(e.percent).toBeGreaterThan(65); // newer 80 % weighs more than older 50 %
    expect(e.low).toBeLessThanOrEqual(e.grade);
    expect(e.high).toBeGreaterThanOrEqual(e.grade);
  });
  it('includes self-assessed essays for writing subjects', () => {
    const d = defaultData();
    for (const [i, m] of [9, 12].entries()) {
      d.essays.push({ id: `e${i}`, prompt: 'p', subject: 'history', topic: 'W12.CR', rubric: 'hist-p2', t: i, sec: 1, words: 1, text: '', scores: { M: m }, done: true });
    }
    expect(estimateGrade(d, 'history')!.n).toBe(2);
  });
  it('ignores results after the asOf date', () => {
    const d = defaultData();
    d.mocks.push({ id: 'a', subject: 'math', t: 10, minutes: 60, got: 30, max: 60, items: 1 });
    d.mocks.push({ id: 'b', subject: 'math', t: 20, minutes: 60, got: 30, max: 60, items: 1 });
    d.mocks.push({ id: 'c', subject: 'math', t: 30, minutes: 60, got: 60, max: 60, items: 1 });
    expect(estimateGrade(d, 'math', 25)!.percent).toBeCloseTo(50);
    expect(estimateGrade(d, 'math', 15)).toBeNull();
  });
});

describe('calibration against school results', () => {
  const DAY = 86_400_000;
  it('returns null without school results', () => {
    expect(calibrate(defaultData(), 'math')).toBeNull();
  });
  it('compares each school result with the app estimate at that date and adjusts the current estimate', () => {
    const d = defaultData();
    // App says 80 % from two mocks before the school test; the school test gave 60 % → bias +20.
    d.mocks.push({ id: 'a', subject: 'math', t: 0, minutes: 60, got: 48, max: 60, items: 1 });
    d.mocks.push({ id: 'b', subject: 'math', t: DAY, minutes: 60, got: 48, max: 60, items: 1 });
    d.school.push({ id: 's1', subject: 'math', t: 5 * DAY, label: 'Test', got: 30, max: 50, grade: 5 });
    // A later mock must not change the comparison for the earlier school test.
    d.mocks.push({ id: 'c', subject: 'math', t: 10 * DAY, minutes: 60, got: 54, max: 60, items: 1 });
    const c = calibrate(d, 'math')!;
    expect(c.n).toBe(1);
    expect(c.pairs).toBe(1);
    expect(c.bias).toBeCloseTo(20);
    expect(c.schoolPct).toBeCloseTo(60);
    expect(c.schoolGrade).toBe(5);
    const now = estimateGrade(d, 'math')!;
    expect(c.adjusted!.percent).toBeCloseTo(now.percent - 20);
    expect(c.adjusted!.grade).toBeLessThanOrEqual(now.grade);
  });
  it('has no bias when the app had no estimate before the school result', () => {
    const d = defaultData();
    d.school.push({ id: 's1', subject: 'math', t: 0, label: 'Test', got: 30, max: 50 });
    d.mocks.push({ id: 'a', subject: 'math', t: 5 * DAY, minutes: 60, got: 48, max: 60, items: 1 });
    d.mocks.push({ id: 'b', subject: 'math', t: 6 * DAY, minutes: 60, got: 48, max: 60, items: 1 });
    const c = calibrate(d, 'math')!;
    expect(c.bias).toBeNull();
    expect(c.adjusted).toBeNull();
  });
});

describe('mistake cards and leeches', () => {
  it('turns a failed question into a card once', () => {
    const c = mistakeCard(mc);
    expect(c.id).toBe(`${MISTAKE_PREFIX}q-mc`);
    expect(c.front).toContain('B. b');
    expect(c.back).toContain('**B.** b');
    const d = defaultData();
    d.customCards = addMistakeCards(d, [mc, mc]);
    expect(d.customCards).toHaveLength(1);
    expect(addMistakeCards(d, [mc])).toBe(d.customCards);
  });
  it('builds structured mistake cards with schemes', () => {
    const c = mistakeCard(st);
    expect(c.front).toContain('(c) [3] explain');
    expect(c.back).toContain('**(a)** x');
  });
  it('flags leeches at 5 lapses', () => {
    expect(isLeech({ ef: 1.3, interval: 1, reps: 0, lapses: 5, due: 0, last: 1 })).toBe(true);
    expect(isLeech({ ef: 1.3, interval: 1, reps: 0, lapses: 4, due: 0, last: 1 })).toBe(false);
  });
  it('storage keeps mocks and the mistake-card setting', () => {
    const d = sanitizeData({ mocks: [{ id: 'm', subject: 'math', t: 1, minutes: 30, got: 50, max: 40 }, { id: 'bad' }], settings: { mistakeCards: false } });
    expect(d.mocks).toEqual([{ id: 'm', subject: 'math', t: 1, minutes: 30, got: 40, max: 40, items: 0 }]);
    expect(d.settings.mistakeCards).toBe(false);
  });
});
