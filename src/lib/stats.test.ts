import { describe, expect, it } from 'vitest';
import { defaultData } from './storage';
import { DAY_MS, schedule } from './srs';
import { activityByDay, currentStreak, daysToExam, dueForecast, longestStreak, recommend, topicStats } from './stats';
import { buildQueue, newCardsStudiedToday, queueCounts, shuffle } from './queue';
import type { AppData, Card } from '../types';

const NOW = new Date(2026, 10, 2, 15, 0, 0).getTime(); // local time

function card(id: string, subject: Card['subject'], topic: string): Card {
  return { id, subject, topic, front: id, back: id, kind: 'concept' };
}

const CARDS: Card[] = [
  card('p1', 'physics', 'A.1'),
  card('p2', 'physics', 'A.1'),
  card('p3', 'physics', 'A.2'),
  card('c1', 'chemistry', 'S1.1'),
  card('m1', 'math', 'M5'),
];

function data(): AppData {
  return defaultData();
}

describe('streaks', () => {
  it('counts consecutive days ending today', () => {
    const d = data();
    for (const k of [0, 1, 2]) d.reviews.push({ c: 'p1', s: 'physics', tp: 'A.1', g: 'good', t: NOW - k * DAY_MS });
    expect(currentStreak(d, NOW)).toBe(3);
  });
  it('stays alive if yesterday was active but not today yet', () => {
    const d = data();
    d.practice.push({ q: 'q', s: 'math', tp: 'M5', r: 'correct', t: NOW - DAY_MS });
    expect(currentStreak(d, NOW)).toBe(1);
  });
  it('breaks after a missed day', () => {
    const d = data();
    d.reviews.push({ c: 'p1', s: 'physics', tp: 'A.1', g: 'good', t: NOW - 2 * DAY_MS });
    expect(currentStreak(d, NOW)).toBe(0);
  });
  it('computes longest streak', () => {
    const d = data();
    for (const k of [0, 1, 5, 6, 7, 8]) d.reviews.push({ c: 'p1', s: 'physics', tp: 'A.1', g: 'good', t: NOW - k * DAY_MS });
    expect(longestStreak(d)).toBe(4);
  });
});

describe('topicStats', () => {
  it('combines review grades and practice results', () => {
    const d = data();
    d.cards.p1 = schedule(undefined, 'good', NOW - 2 * DAY_MS); // due
    d.reviews.push({ c: 'p1', s: 'physics', tp: 'A.1', g: 'good', t: NOW - 2 * DAY_MS });
    d.reviews.push({ c: 'p2', s: 'physics', tp: 'A.1', g: 'again', t: NOW - DAY_MS });
    d.practice.push({ q: 'q1', s: 'physics', tp: 'A.1', r: 'correct', t: NOW });
    const s = topicStats(d, CARDS, NOW).get('physics|A.1')!;
    expect(s.total).toBe(2);
    expect(s.seen).toBe(1);
    expect(s.due).toBe(1);
    expect(s.reviews).toBe(2);
    // (1 + 0 + 2·1) / (1 + 1 + 2)
    expect(s.accuracy).toBeCloseTo(0.75);
  });
  it('reports null accuracy without attempts and excludes suspended cards', () => {
    const d = data();
    d.cards.p3 = { ...schedule(undefined, 'good', NOW), suspended: true };
    const s = topicStats(d, CARDS, NOW).get('physics|A.2')!;
    expect(s.accuracy).toBeNull();
    expect(s.total).toBe(0);
  });
});

describe('recommend', () => {
  it('ranks a weak topic above a strong one', () => {
    const d = data();
    for (let i = 0; i < 10; i++) {
      d.reviews.push({ c: 'p1', s: 'physics', tp: 'A.1', g: 'again', t: NOW - i * 1000 });
      d.reviews.push({ c: 'm1', s: 'math', tp: 'M5', g: 'easy', t: NOW - i * 1000 });
      d.cards.p1 = schedule(undefined, 'good', NOW);
      d.cards.p2 = schedule(undefined, 'good', NOW);
      d.cards.m1 = schedule(undefined, 'good', NOW);
    }
    const recs = recommend(d, CARDS, NOW, 10);
    const order = recs.map((r) => `${r.subject}|${r.topic}`);
    expect(order.indexOf('physics|A.1')).toBeLessThan(order.indexOf('math|M5'));
    expect(recs.find((r) => r.topic === 'A.1')!.reasons.join(' ')).toMatch(/accuracy/);
  });
  it('ignores disabled subjects', () => {
    const d = data();
    d.settings.enabledSubjects = ['math'];
    expect(recommend(d, CARDS, NOW, 10).every((r) => r.subject === 'math')).toBe(true);
  });
  it('boosts subjects with an imminent exam', () => {
    const d = data();
    d.settings.exams = [{ id: 'e', name: 'Chem P1', subject: 'chemistry', date: new Date(NOW + 5 * DAY_MS).toISOString() }];
    const recs = recommend(d, CARDS, NOW, 10);
    expect(recs[0].subject).toBe('chemistry');
  });
});

describe('daysToExam', () => {
  it('finds the nearest future exam, honouring subject filter', () => {
    const exams = [
      { id: 'a', name: 'A', subject: 'math' as const, date: new Date(NOW + 10 * DAY_MS).toISOString() },
      { id: 'b', name: 'B', subject: 'physics' as const, date: new Date(NOW + 3 * DAY_MS).toISOString() },
      { id: 'c', name: 'past', date: new Date(NOW - DAY_MS).toISOString() },
    ];
    expect(daysToExam(exams, 'math', NOW)).toBeCloseTo(10);
    expect(daysToExam(exams, null, NOW)).toBeCloseTo(3);
    expect(daysToExam(exams, 'chemistry', NOW)).toBeNull();
  });
});

describe('charts data', () => {
  it('activityByDay buckets the last n days', () => {
    const d = data();
    d.reviews.push({ c: 'p1', s: 'physics', tp: 'A.1', g: 'good', t: NOW });
    d.practice.push({ q: 'q', s: 'math', tp: 'M5', r: 'correct', t: NOW - DAY_MS });
    const a = activityByDay(d, NOW, 7);
    expect(a).toHaveLength(7);
    expect(a[6].reviews).toBe(1);
    expect(a[5].practice).toBe(1);
  });
  it('dueForecast puts overdue cards in today', () => {
    const d = data();
    d.cards.p1 = { ...schedule(undefined, 'good', NOW - 5 * DAY_MS) };
    d.cards.p2 = schedule(undefined, 'good', NOW); // due tomorrow
    const f = dueForecast(d, CARDS, NOW, 7);
    expect(f[0]).toBe(1);
    expect(f[1]).toBe(1);
  });
});

describe('review queue', () => {
  it('puts due cards first and limits new cards to the daily allowance', () => {
    const d = data();
    d.settings.newPerDay = 2;
    d.cards.p3 = schedule(undefined, 'good', NOW - 3 * DAY_MS);
    const q = buildQueue(d, CARDS, { subjects: ['physics', 'chemistry', 'math'] }, NOW);
    expect(q[0].id).toBe('p3');
    expect(q).toHaveLength(3);
    // new cards interleave subjects
    expect(new Set(q.slice(1).map((c) => c.subject)).size).toBe(2);
  });
  it('respects topic filter and suspension', () => {
    const d = data();
    d.cards.p2 = { ...schedule(undefined, 'again', NOW - DAY_MS), last: 0, suspended: true };
    const q = buildQueue(d, CARDS, { subjects: ['physics'], topics: ['physics|A.1'] }, NOW);
    expect(q.map((c) => c.id)).toEqual(['p1']);
  });
  it('subtracts new cards already studied today', () => {
    const d = data();
    d.settings.newPerDay = 3;
    d.reviews.push({ c: 'p1', s: 'physics', tp: 'A.1', g: 'good', t: NOW - 1000 });
    d.cards.p1 = schedule(undefined, 'good', NOW - 1000);
    expect(newCardsStudiedToday(d, NOW)).toBe(1);
    expect(queueCounts(d, CARDS, { subjects: ['physics', 'chemistry', 'math'] }, NOW).newToday).toBe(2);
  });
  it('shuffle is deterministic and a permutation', () => {
    const a = [1, 2, 3, 4, 5, 6];
    expect(shuffle(a, 42)).toEqual(shuffle(a, 42));
    expect([...shuffle(a, 7)].sort()).toEqual(a);
  });
});
