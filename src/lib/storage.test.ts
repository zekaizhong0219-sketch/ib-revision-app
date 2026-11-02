import { describe, expect, it, vi } from 'vitest';
import {
  DATA_VERSION,
  MAX_LOG_ENTRIES,
  STORAGE_KEY,
  defaultData,
  exportData,
  importData,
  loadData,
  mergeData,
  sanitizeData,
  saveData,
} from './storage';
import type { AppData } from '../types';

function memoryStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    store,
  };
}

function sample(): AppData {
  const d = defaultData();
  d.cards['phy-1'] = { ef: 2.3, interval: 6, reps: 2, lapses: 1, due: 1000, last: 500 };
  d.reviews.push({ c: 'phy-1', s: 'physics', tp: 'A.1', g: 'good', t: 500 });
  d.practice.push({ q: 'q1', s: 'math', tp: 'M5', r: 'partial', t: 600, sec: 40 });
  d.customCards.push({ id: 'u-1', subject: 'chemistry', topic: 'S1.1', front: 'F', back: 'B', kind: 'fact', custom: true });
  d.settings.theme = 'dark';
  return d;
}

describe('loadData / saveData', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadData(memoryStorage())).toEqual(defaultData());
  });

  it('round-trips through storage', () => {
    const s = memoryStorage();
    const d = sample();
    expect(saveData(d, s)).toBe(true);
    expect(loadData(s)).toEqual(d);
  });

  it('returns defaults on corrupt JSON', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(loadData(memoryStorage({ [STORAGE_KEY]: '{not json' }))).toEqual(defaultData());
    warn.mockRestore();
  });

  it('survives storage that throws (e.g. private mode / quota)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const throwing = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {
        throw new Error('nope');
      },
    };
    expect(loadData(throwing)).toEqual(defaultData());
    expect(saveData(sample(), throwing)).toBe(false);
    warn.mockRestore();
  });

  it('handles missing storage', () => {
    expect(loadData(null)).toEqual(defaultData());
    expect(saveData(sample(), null)).toBe(false);
  });

  it('trims logs to the cap on save', () => {
    const s = memoryStorage();
    const d = defaultData();
    for (let i = 0; i < MAX_LOG_ENTRIES + 10; i++) d.reviews.push({ c: 'x', s: 'math', tp: 'M1', g: 'good', t: i });
    saveData(d, s);
    const loaded = loadData(s);
    expect(loaded.reviews.length).toBe(MAX_LOG_ENTRIES);
    expect(loaded.reviews[0].t).toBe(10);
  });
});

describe('sanitizeData', () => {
  it('drops invalid entries but keeps valid ones', () => {
    const d = sanitizeData({
      cards: { good: { ef: 2.5, interval: 1, reps: 1, due: 5, last: 1 }, bad: { ef: 'x' }, worse: null },
      reviews: [{ c: 'a', s: 'physics', tp: 'A.1', g: 'good', t: 1 }, { c: 'a', s: 'biology', tp: 'x', g: 'good', t: 1 }, 7],
      practice: [{ q: 'q', s: 'math', tp: 'M1', r: 'wrong', t: 1 }],
      customCards: [{ id: 'u', subject: 'math', topic: 'M1', front: 'f', back: 'b', kind: 'weird' }],
      settings: { theme: 'neon', newPerDay: -5, exams: [{ id: 'e', name: 'P1', date: '2027-05-01T09:00', subject: 'math' }, {}] },
    });
    expect(Object.keys(d.cards)).toEqual(['good']);
    expect(d.cards.good.lapses).toBe(0);
    expect(d.reviews).toHaveLength(1);
    expect(d.practice).toHaveLength(0);
    expect(d.customCards[0].kind).toBe('concept');
    expect(d.settings.theme).toBe('system');
    expect(d.settings.newPerDay).toBe(0);
    expect(d.settings.exams).toEqual([{ id: 'e', name: 'P1', date: '2027-05-01T09:00', subject: 'math' }]);
    expect(d.version).toBe(DATA_VERSION);
  });

  it('clamps EF to the SM-2 minimum', () => {
    const d = sanitizeData({ cards: { a: { ef: 0.5, interval: 1, reps: 1, due: 1 } } });
    expect(d.cards.a.ef).toBe(1.3);
  });

  it('rejects non-objects and future versions', () => {
    expect(() => sanitizeData(null)).toThrow();
    expect(() => sanitizeData([1, 2])).toThrow();
    expect(() => sanitizeData({ version: DATA_VERSION + 1 })).toThrow(/newer/);
  });

  it('migrates unversioned data', () => {
    expect(sanitizeData({ cards: {} }).version).toBe(DATA_VERSION);
  });
});

describe('export / import', () => {
  it('round-trips', () => {
    const d = sample();
    const text = exportData(d, new Date('2026-11-02T00:00:00Z'));
    expect(JSON.parse(text).exportedAt).toBe('2026-11-02T00:00:00.000Z');
    expect(importData(text)).toEqual(d);
  });

  it('accepts a bare AppData object', () => {
    const d = sample();
    expect(importData(JSON.stringify(d))).toEqual(d);
  });

  it('gives readable errors', () => {
    expect(() => importData('nope')).toThrow(/valid JSON/);
    expect(() => importData('{"hello":1}')).toThrow(/backup/);
  });
});

describe('mergeData', () => {
  it('keeps the most recently reviewed card state and unions logs', () => {
    const a = sample();
    const b = sample();
    b.cards['phy-1'] = { ...b.cards['phy-1'], last: 900, interval: 15 };
    b.cards['phy-2'] = { ef: 2.5, interval: 1, reps: 1, lapses: 0, due: 1, last: 1 };
    b.reviews.push({ c: 'phy-1', s: 'physics', tp: 'A.1', g: 'easy', t: 900 });
    b.customCards.push({ id: 'u-2', subject: 'math', topic: 'M1', front: 'x', back: 'y', kind: 'fact', custom: true });
    const m = mergeData(a, b);
    expect(m.cards['phy-1'].interval).toBe(15);
    expect(m.cards['phy-2']).toBeDefined();
    expect(m.reviews).toHaveLength(2); // duplicate (phy-1 @ 500) removed
    expect(m.reviews.map((r) => r.t)).toEqual([500, 900]);
    expect(m.customCards.map((c) => c.id).sort()).toEqual(['u-1', 'u-2']);
  });

  it('does not overwrite newer local progress with older imported progress', () => {
    const a = sample();
    a.cards['phy-1'] = { ...a.cards['phy-1'], last: 2000, interval: 30 };
    const m = mergeData(a, sample());
    expect(m.cards['phy-1'].interval).toBe(30);
  });
});

describe('v2 migration and essays', () => {
  it('adds the new subjects to an old v1 enabled list', () => {
    const d = sanitizeData({ version: 1, settings: { enabledSubjects: ['physics', 'math'] } });
    expect(d.settings.enabledSubjects).toEqual(['physics', 'math', 'spanish', 'english', 'history']);
    expect(d.settings.hiddenSubjects).toEqual([]);
    expect(d.essays).toEqual([]);
  });
  it('does not re-enable subjects for current-version data', () => {
    const d = sanitizeData({ version: DATA_VERSION, settings: { enabledSubjects: ['history'] } });
    expect(d.settings.enabledSubjects).toEqual(['history']);
  });
  it('never hides every subject and keeps deadline kind', () => {
    const d = sanitizeData({
      settings: {
        hiddenSubjects: ['physics', 'chemistry', 'math', 'spanish', 'english', 'history'],
        exams: [{ id: 'io', name: 'Spanish IO', date: '2027-01-15T10:00', kind: 'deadline', subject: 'spanish' }],
      },
    });
    expect(d.settings.hiddenSubjects).toEqual([]);
    expect(d.settings.exams[0].kind).toBe('deadline');
  });
  it('sanitises essays and merges them by id', () => {
    const e = { id: 'e1', prompt: 'p', subject: 'history', topic: 'W12.CR', rubric: 'hist-p2', t: 5, sec: 60, words: 3, text: 'a b c', scores: { A: 10, bad: 'x' }, done: true };
    const d = sanitizeData({ essays: [e, { id: 'broken' }] });
    expect(d.essays).toHaveLength(1);
    expect(d.essays[0].scores).toEqual({ A: 10 });
    const m = mergeData(d, sanitizeData({ essays: [{ ...e, id: 'e2', t: 1 }] }));
    expect(m.essays.map((x) => x.id)).toEqual(['e2', 'e1']);
  });
});

describe('school results and source sets', () => {
  it('sanitises school results and source sets, clamping marks', () => {
    const d = sanitizeData({
      version: DATA_VERSION,
      school: [
        { id: 's1', subject: 'math', t: 1, label: 'Mock', got: 70, max: 60, grade: 9 },
        { id: 's2', subject: 'nope', t: 1, got: 1, max: 2 },
        { id: 's3', subject: 'physics', t: 1, got: 1, max: 0 },
      ],
      sourceSets: [
        {
          id: 'p1',
          title: 'Manchuria',
          topic: 'PS3.JP',
          t: 5,
          sources: [{ origin: 'Source A', text: 'text' }, 'junk'],
          questions: [{ label: '1a', marks: 3, prompt: 'What…' }, { label: 'x' }],
          attempts: [{ t: 9, sec: 60, answers: ['a', 7], scores: [5] }],
        },
        { id: 'p2', title: 'empty', topic: 'PS3.EU', t: 1, sources: [], questions: [] },
      ],
    });
    expect(d.school).toHaveLength(1);
    expect(d.school[0]).toMatchObject({ got: 60, max: 60 });
    expect(d.school[0].grade).toBeUndefined();
    expect(d.sourceSets).toHaveLength(1);
    expect(d.sourceSets[0].sources).toHaveLength(1);
    expect(d.sourceSets[0].questions).toHaveLength(1);
    expect(d.sourceSets[0].attempts[0]).toEqual({ t: 9, sec: 60, answers: ['a'], scores: [3] });
  });
  it('defaults to empty lists for older data and merges attempts of the same set', () => {
    const old = sanitizeData({ version: DATA_VERSION });
    expect(old.school).toEqual([]);
    expect(old.sourceSets).toEqual([]);
    const set = { id: 'p1', title: 'T', topic: 'PS3.JP', t: 1, sources: [{ origin: 'o', text: 't' }], questions: [{ label: '1a', marks: 3, prompt: 'q' }] };
    const a: AppData = { ...defaultData(), sourceSets: [{ ...set, attempts: [{ t: 1, sec: 1, answers: [''], scores: [1] }] }] };
    const b: AppData = { ...defaultData(), sourceSets: [{ ...set, attempts: [{ t: 2, sec: 1, answers: [''], scores: [2] }] }] };
    const m = mergeData(a, b);
    expect(m.sourceSets).toHaveLength(1);
    expect(m.sourceSets[0].attempts.map((x) => x.t)).toEqual([1, 2]);
  });
});

describe('built-in Paper 1 attempts', () => {
  it('keeps attempts for built-in set ids only, clamped to the standard marks, and merges them', () => {
    const d = sanitizeData({
      version: DATA_VERSION,
      p1Attempts: {
        'p1b-munich': [{ t: 5, sec: 10, answers: ['x'], scores: [9, 2, 4, 6, 9] }],
        'evil-id': [{ t: 1, sec: 1, answers: [], scores: [] }],
      },
    });
    expect(Object.keys(d.p1Attempts)).toEqual(['p1b-munich']);
    expect(d.p1Attempts['p1b-munich'][0].scores).toEqual([3, 2, 4, 6, 9]);
    const other: AppData = { ...defaultData(), p1Attempts: { 'p1b-munich': [{ t: 6, sec: 1, answers: [], scores: [0, 0, 0, 0, 0] }] } };
    expect(mergeData(d, other).p1Attempts['p1b-munich'].map((a) => a.t)).toEqual([5, 6]);
  });
});
