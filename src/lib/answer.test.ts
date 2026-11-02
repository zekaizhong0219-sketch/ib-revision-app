import { describe, expect, it } from 'vitest';
import { checkMC, checkNumeric, formatNumber, parseNumber, toleranceFor } from './answer';

describe('parseNumber', () => {
  const cases: [string, number][] = [
    ['12.5', 12.5],
    ['-0.03', -0.03],
    ['+4', 4],
    ['12,5', 12.5],
    ['.5', 0.5],
    ['3.2e-5', 3.2e-5],
    ['3.2E5', 3.2e5],
    ['3.2×10^-5', 3.2e-5],
    ['3.2 x 10^-5', 3.2e-5],
    ['3.2X10^5', 3.2e5],
    ['3.2*10**-5', 3.2e-5],
    ['3.2·10⁻⁵', 3.2e-5],
    ['6.02 × 10²³', 6.02e23],
    ['10^-3', 1e-3],
    ['1/3', 1 / 3],
    ['-2/5', -0.4],
    ['45%', 45],
    ['9.81 m s^-2', 9.81],
    ['9.81m', 9.81],
    ['  7  ', 7],
    ['−3', -3],
    ['1 000 000', 1e6],
    ['2.0 × 10^(-3)', 2e-3],
    ['5 \\times 10^3', 5000],
  ];
  it.each(cases)('parses %s', (input, expected) => {
    const v = parseNumber(input);
    expect(v).not.toBeNull();
    expect(v! / expected).toBeCloseTo(1, 10);
  });

  it.each(['', 'abc', '1/0', 'e5', '--3', 'ten'])('rejects %s', (input) => {
    expect(parseNumber(input)).toBeNull();
  });
});

describe('checkNumeric', () => {
  it('uses default 2% relative tolerance', () => {
    expect(checkNumeric('9.81', { value: 9.81 }).ok).toBe(true);
    expect(checkNumeric('9.9', { value: 9.81 }).ok).toBe(true); // 0.9 %
    expect(checkNumeric('10.1', { value: 9.81 }).ok).toBe(false); // 3 %
  });

  it('respects explicit relative tolerance', () => {
    expect(checkNumeric('104', { value: 100, rel: 0.05 }).ok).toBe(true);
    expect(checkNumeric('106', { value: 100, rel: 0.05 }).ok).toBe(false);
  });

  it('respects absolute tolerance (useful near zero)', () => {
    expect(checkNumeric('0.04', { value: 0, abs: 0.05 }).ok).toBe(true);
    expect(checkNumeric('-0.06', { value: 0, abs: 0.05 }).ok).toBe(false);
  });

  it('accepts the exact boundary', () => {
    expect(checkNumeric('102', { value: 100, rel: 0.02 }).ok).toBe(true);
    expect(checkNumeric('98', { value: 100, rel: 0.02 }).ok).toBe(true);
  });

  it('takes the larger of abs and rel when both given', () => {
    expect(toleranceFor({ value: 1000, rel: 0.01, abs: 1 })).toBe(10);
    expect(toleranceFor({ value: 10, rel: 0.01, abs: 1 })).toBe(1);
  });

  it('handles negative values and scientific notation', () => {
    expect(checkNumeric('-1.6e-19', { value: -1.6e-19 }).ok).toBe(true);
    expect(checkNumeric('1.6e-19', { value: -1.6e-19 }).ok).toBe(false);
    expect(checkNumeric('6.6×10^-34', { value: 6.63e-34 }).ok).toBe(true);
  });

  it('fails gracefully on garbage', () => {
    expect(checkNumeric('hello', { value: 1 })).toEqual({ ok: false, parsed: null });
  });
});

describe('checkMC', () => {
  it('works', () => {
    expect(checkMC(2, 2)).toBe(true);
    expect(checkMC(1, 2)).toBe(false);
    expect(checkMC(null, 0)).toBe(false);
  });
});

describe('formatNumber', () => {
  it('formats normal and scientific numbers', () => {
    expect(formatNumber(9.8123)).toBe('9.81');
    expect(formatNumber(6.626e-34)).toBe('6.63 × 10^-34');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(123456)).toBe('1.23 × 10^5');
  });
});
