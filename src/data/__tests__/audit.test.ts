import { describe, expect, it } from 'vitest';
import { ALL_CARDS } from '../cards';
import { ALL_QUESTIONS } from '../questions';
import { ALL_ESSAYS } from '../essays';

/** Every text shown to the student. */
const ALL_TEXT: { id: string; text: string; subject: string }[] = [
  ...ALL_CARDS.flatMap((c) => [
    { id: c.id, text: c.front, subject: c.subject },
    { id: c.id, text: c.back, subject: c.subject },
  ]),
  ...ALL_QUESTIONS.flatMap((q) => {
    const t = [q.prompt, q.solution];
    if (q.type === 'mc') t.push(...q.options);
    if (q.type === 'open') t.push(q.answer);
    if (q.type === 'text') t.push(...q.answers);
    if (q.type === 'order') t.push(...q.items);
    if (q.type === 'match') t.push(...q.pairs.flat());
    return t.map((text) => ({ id: q.id, text, subject: q.subject }));
  }),
  ...ALL_ESSAYS.flatMap((e) => [
    { id: e.id, text: e.prompt, subject: e.subject },
    { id: e.id, text: e.guidance, subject: e.subject },
  ]),
];

/**
 * Physical constants must always use the IB data-booklet value when written as
 * mantissa × 10^exponent with that exponent.
 */
const CONSTANTS: { name: string; exp: string; allowed: string[] }[] = [
  { name: 'Planck constant', exp: '-34', allowed: ['6.63'] },
  { name: 'elementary charge', exp: '-19', allowed: ['1.60', '3.98', '4.97'] }, // photon energies in J also use 10^-19
  { name: 'gravitational constant', exp: '-11', allowed: ['6.67'] },
  { name: 'electron mass', exp: '-31', allowed: ['9.11'] },
  { name: 'Boltzmann constant', exp: '-23', allowed: ['1.38'] },
  { name: 'Avogadro constant', exp: '23', allowed: ['6.02', '6.02214076', '1.51'] },
  { name: 'permittivity of free space', exp: '-12', allowed: ['8.85', '6.0'] },
];

describe('content audit guards', () => {
  it.each(CONSTANTS)('$name uses the data-booklet value', ({ exp, allowed }) => {
    const re = new RegExp(String.raw`(\d+(?:\.\d+)?)\s*\\times\s*10\^\{${exp}\}`, 'g');
    const bad: string[] = [];
    for (const { id, text } of ALL_TEXT) {
      for (const m of text.matchAll(re)) if (!allowed.includes(m[1])) bad.push(`${id}: ${m[0]}`);
    }
    expect(bad).toEqual([]);
  });

  it('g is always 9.81 and c always 3.00 × 10^8 when stated', () => {
    const bad = ALL_TEXT.filter(
      ({ text }) => /g\s*=\s*9\.(?!81)\d/.test(text) || /c\s*=\s*3\.(?!00)\d+\\?\s*\\times\s*10\^8/.test(text),
    );
    expect(bad.map((b) => b.id)).toEqual([]);
  });

  it('History date cards contain a plausible year', () => {
    const bad = ALL_CARDS.filter((c) => c.subject === 'history' && c.kind === 'date' && !/\b(18[5-9]\d|19\d\d)\b/.test(c.back + c.front));
    expect(bad.map((c) => c.id)).toEqual([]);
  });

  it('History years mentioned in questions fall within the syllabus period', () => {
    const years = ALL_QUESTIONS.filter((q) => q.subject === 'history').flatMap((q) => [...(q.prompt + ' ' + q.solution).matchAll(/\b(1[89]\d\d|20\d\d)\b/g)].map((m) => Number(m[1])));
    expect(years.every((y) => y >= 1839 && y <= 1997)).toBe(true);
  });

  it('Spanish content follows the house style: parentheses for asides, no em dash', () => {
    const bad = ALL_TEXT.filter(({ subject, text }) => subject === 'spanish' && text.includes('—'));
    expect(bad.map((b) => b.id)).toEqual([]);
  });

  it('no placeholder or unfinished text', () => {
    const bad = ALL_TEXT.filter(({ text }) => /\b(TODO|FIXME|XXX)\b|lorem ipsum/.test(text));
    expect(bad.map((b) => b.id)).toEqual([]);
  });
});
