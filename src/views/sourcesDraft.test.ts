import { afterEach, describe, expect, it } from 'vitest';
import { loadP1Draft, saveP1Draft } from './Sources';

describe('Paper 1 draft autosave', () => {
  afterEach(() => window.localStorage.clear());
  it('round-trips a draft and pads it to the number of questions', () => {
    const t = Date.now() - 60_000;
    saveP1Draft('p1b-x', { t, answers: ['a', 'b'] });
    expect(loadP1Draft('p1b-x', 5)).toEqual({ t, answers: ['a', 'b', '', '', ''] });
  });
  it('ignores stale, future-dated or corrupt drafts and clears on null', () => {
    saveP1Draft('old', { t: Date.now() - 4 * 3_600_000, answers: ['x'] });
    expect(loadP1Draft('old', 5)).toBeNull();
    saveP1Draft('future', { t: Date.now() + 60_000, answers: ['x'] });
    expect(loadP1Draft('future', 5)).toBeNull();
    window.localStorage.setItem('ib-revision:p1-draft:bad', '{not json');
    expect(loadP1Draft('bad', 5)).toBeNull();
    saveP1Draft('p1b-x', { t: Date.now(), answers: [] });
    saveP1Draft('p1b-x', null);
    expect(loadP1Draft('p1b-x', 5)).toBeNull();
  });
});
