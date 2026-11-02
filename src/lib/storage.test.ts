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
