import { describe, expect, it } from 'vitest';
import { defaultData } from './storage';
import { DAY_MS, schedule } from './srs';
import { planDay, reviewLoad } from './planner';
import { essayPercent } from './stats';
import type { AppData, Card, SubjectId } from '../types';

const NOW = new Date(2026, 10, 2, 15).getTime();
const card = (id: string, subject: SubjectId, topic: string): Card => ({ id, subject, topic, front: id, back: id, kind: 'concept' });

function deck(): Card[] {
  const out: Card[] = [];
  for (let i = 0; i < 30; i++) out.push(card(`p${i}`, 'physics', 'A.1'));
  for (let i = 0; i < 30; i++) out.push(card(`h${i}`, 'history', 'W12.CR'));
  return out;
}

function withDue(d: AppData, ids: string[]) {
  for (const id of ids) d.cards[id] = schedule(undefined, 'good', NOW - 3 * DAY_MS);
}

describe('planDay', () => {
  it('schedules reviews for due cards and new cards', () => {
    const d = defaultData();
    d.settings.newPerDay = 10;
    withDue(d, ['p0', 'p1', 'p2']);
    const plan = planDay(d, deck(), ['physics', 'history'], NOW);
    const phys = plan.items.find((i) => i.kind === 'review' && i.subject === 'physics')!;
    expect(phys.reason).toMatch(/^3 due/);
    expect(plan.items.some((i) => i.kind === 'review' && i.subject === 'history')).toBe(true);
  });

  it('stays within the budget when reviews are light', () => {
    const d = defaultData();
    d.settings.dailyMinutes = 60;
    const plan = planDay(d, deck(), ['physics', 'history'], NOW);
    expect(plan.total).toBeLessThanOrEqual(60);
    expect(plan.overBudget).toBe(false);
  });

  it('flags when due reviews exceed the budget', () => {
    const d = defaultData();
    d.settings.dailyMinutes = 10;
    const many: Card[] = Array.from({ length: 200 }, (_, i) => card(`x${i}`, 'physics', 'A.1'));
    withDue(d, many.map((c) => c.id));
    expect(planDay(d, many, ['physics'], NOW).overBudget).toBe(true);
  });

  it('gives more practice time to the subject with an imminent exam', () => {
    const d = defaultData();
    d.settings.dailyMinutes = 90;
    d.settings.newPerDay = 0;
    d.settings.exams = [{ id: 'e', name: 'Physics P1', subject: 'physics', date: new Date(NOW + 4 * DAY_MS).toISOString() }];
    const plan = planDay(d, deck(), ['physics', 'history'], NOW);
    const mins = (s: SubjectId) => plan.items.filter((i) => i.subject === s && i.kind !== 'review').reduce((a, b) => a + b.minutes, 0);
    expect(mins('physics')).toBeGreaterThan(mins('history'));
  });

  it('suggests timed writing for essay subjects without a recent essay', () => {
    const d = defaultData();
    d.settings.dailyMinutes = 120;
    d.settings.newPerDay = 0;
    const plan = planDay(d, deck(), ['history'], NOW);
    expect(plan.items.find((i) => i.subject === 'history' && i.kind !== 'review')?.kind).toBe('writing');
    d.essays.push({ id: 'e', prompt: 'x', subject: 'history', topic: 'W12.CR', rubric: 'hist-p2', t: NOW - DAY_MS, sec: 2400, words: 700, text: '', scores: { M: 9 }, done: true });
    expect(planDay(d, deck(), ['history'], NOW).items.find((i) => i.kind !== 'review')?.kind).toBe('practice');
  });

  it('ignores coursework deadlines for exam urgency', () => {
    const d = defaultData();
    d.settings.dailyMinutes = 90;
    d.settings.newPerDay = 0;
    d.settings.exams = [{ id: 'io', name: 'IO', kind: 'deadline', subject: 'history', date: new Date(NOW + 2 * DAY_MS).toISOString() }];
    const plan = planDay(d, deck(), ['physics', 'history'], NOW);
    expect(plan.items.every((i) => !/exam in/.test(i.reason))).toBe(true);
  });
});

describe('reviewLoad', () => {
  it('buckets future reviews per subject and day', () => {
    const d = defaultData();
    d.cards.p0 = schedule(undefined, 'good', NOW); // due tomorrow
    withDue(d, ['h0']);
    const load = reviewLoad(d, deck(), ['physics', 'history'], NOW, 7);
    expect(load.physics[1]).toBeGreaterThan(0);
    expect(load.history[0]).toBeGreaterThan(0);
    expect(load.physics).toHaveLength(7);
  });
});

describe('essayPercent', () => {
  it('computes the self-assessed fraction, clamping to criterion maxima', () => {
    expect(essayPercent({ rubric: 'engb-p1', scores: { A: 9, B: 9, C: 6 } })).toBeCloseTo(24 / 30);
    expect(essayPercent({ rubric: 'hist-p2', scores: { M: 99 } })).toBe(1);
    expect(essayPercent({ rubric: 'nope', scores: { A: 1 } })).toBeNull();
    expect(essayPercent({ rubric: 'hist-p2', scores: {} })).toBeNull();
  });
});
