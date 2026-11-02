import type { NumericSpec } from '../types';

const SUPERSCRIPTS: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+',
};

/**
 * Parses a user-typed number. Accepts:
 *  - plain decimals: "12.5", "-0.03", "+4"
 *  - decimal commas (es): "12,5"
 *  - scientific notation: "3.2e-5", "3.2E5", "3.2×10^-5", "3.2x10^-5", "3.2*10**-5", "3.2·10⁻⁵", "10^-3"
 *  - simple fractions: "1/3", "-2/5"
 *  - percentages: "45%" → 45 (the percent sign is ignored)
 *  - trailing units / text after a space: "9.81 m s^-2" → 9.81
 * Returns null if the input cannot be parsed.
 */
export function parseNumber(raw: string): number | null {
  if (typeof raw !== 'string') return null;
  let s = raw.trim();
  if (!s) return null;
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (m) => '^' + [...m].map((ch) => SUPERSCRIPTS[ch]).join(''));
  s = s.replace(/−/g, '-').replace(/\s+/g, ' ');

  // Thousands separators like "1 000 000" or "12 345.6" (groups of exactly 3 digits).
  s = s.replace(/^([-+]?\d{1,3})((?: \d{3})+)(?=$|[.,]\d| [^\d])/, (_m, a: string, b: string) => a + b.replace(/ /g, ''));

  // Fraction a/b (both plain numbers).
  const frac = s.match(/^([-+]?\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)$/);
  if (frac) {
    const a = Number(frac[1].replace(',', '.'));
    const b = Number(frac[2].replace(',', '.'));
    if (b === 0 || !isFinite(a) || !isFinite(b)) return null;
    return a / b;
  }

  const num = String.raw`([-+]?(?:\d+(?:[.,]\d*)?|[.,]\d+))`;
  const exp = String.raw`([-+]?\d+)`;
  const patterns: RegExp[] = [
    // mantissa × 10^exp
    new RegExp(String.raw`^${num}\s*(?:[x×*·]|\\times)\s*10\s*(?:\^|\*\*)\s*\(?${exp}\)?(?:\s.*)?$`, 'i'),
    // 10^exp alone
    new RegExp(String.raw`^()10\s*(?:\^|\*\*)\s*\(?${exp}\)?(?:\s.*)?$`),
    // e-notation
    new RegExp(String.raw`^${num}[eE]${exp}(?:\s.*)?$`),
    // plain number possibly followed by unit / percent
    new RegExp(String.raw`^${num}()\s*%?(?:\s.*|[a-zA-Zµμ°Ω].*)?$`),
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (!m) continue;
    const mant = m[1] === '' ? 1 : Number(m[1].replace(',', '.'));
    const e = m[2] === '' || m[2] === undefined ? 0 : Number(m[2]);
    if (!isFinite(mant) || !isFinite(e)) return null;
    const v = mant * Math.pow(10, e);
    return isFinite(v) ? v : null;
  }
  return null;
}

export const DEFAULT_REL_TOLERANCE = 0.02;

/** Allowed absolute deviation for a numeric answer. */
export function toleranceFor(spec: NumericSpec): number {
  if (spec.abs !== undefined && spec.rel !== undefined) {
    return Math.max(spec.abs, Math.abs(spec.value) * spec.rel);
  }
  if (spec.abs !== undefined) return spec.abs;
  const rel = spec.rel ?? DEFAULT_REL_TOLERANCE;
  return Math.abs(spec.value) * rel;
}

export function checkNumeric(input: string, spec: NumericSpec): { ok: boolean; parsed: number | null } {
  const parsed = parseNumber(input);
  if (parsed === null) return { ok: false, parsed };
  const tol = toleranceFor(spec);
  // Small epsilon so that e.g. exact boundary values pass despite float error.
  const ok = Math.abs(parsed - spec.value) <= tol * (1 + 1e-9) + 4 * Number.EPSILON * Math.abs(spec.value);
  return { ok, parsed };
}

export function checkMC(selected: number | null, answer: number): boolean {
  return selected !== null && selected === answer;
}

/** Formats a number for display in feedback, using scientific notation when helpful. */
export function formatNumber(v: number, sig = 3): string {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1e5 || a < 1e-3) {
    const [m, e] = v.toExponential(sig - 1).split('e');
    return `${m} × 10^${Number(e)}`;
  }
  return String(Number(v.toPrecision(sig)));
}

/**
 * Normalises a short text answer for lenient comparison: lower case, accents removed,
 * punctuation and quotes stripped, whitespace collapsed, a leading article dropped
 * (the/a/an/el/la/los/las/un/una), and "&" read as "and".
 */
export function normaliseText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[«»"'“”‘’.,;:!?¡¿()[\]{}]/g, ' ')
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(the|a|an|el|la|los|las|un|una) /, '');
}

/** Checks a typed answer against accepted variants. Strict mode only trims and collapses spaces. */
export function checkText(input: string, answers: string[], strict = false): boolean {
  const norm = strict ? (x: string) => x.trim().replace(/\s+/g, ' ') : normaliseText;
  const v = norm(input);
  if (!v) return false;
  return answers.some((a) => norm(a) === v);
}

/**
 * Scores an ordering answer: the fraction of adjacent pairs in the response that also
 * appear adjacent and in the same order in the correct sequence (1 = perfect).
 */
export function scoreOrder(response: string[], correct: string[]): number {
  if (response.length !== correct.length || correct.length < 2) return 0;
  const pos = new Map(correct.map((x, i) => [x, i]));
  let good = 0;
  for (let i = 0; i < response.length - 1; i++) {
    const a = pos.get(response[i]);
    const b = pos.get(response[i + 1]);
    if (a !== undefined && b !== undefined && b === a + 1) good++;
  }
  return good / (correct.length - 1);
}

/** Fraction of left items matched to the correct right item. */
export function scoreMatch(response: Record<string, string>, pairs: [string, string][]): number {
  if (!pairs.length) return 0;
  return pairs.filter(([l, r]) => response[l] === r).length / pairs.length;
}

/** Maps a 0–1 score to a practice result: 1 → correct, ≥ 0.5 → partial, else incorrect. */
export function resultFromScore(score: number): 'correct' | 'partial' | 'incorrect' {
  if (score >= 1 - 1e-9) return 'correct';
  return score >= 0.5 ? 'partial' : 'incorrect';
}

/** Counts words like exam word counts do: sequences separated by whitespace. */
export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Practice result for a structured question from marks gained (≥ 75 % correct, ≥ 40 % partial). */
export function resultFromMarks(got: number, max: number): 'correct' | 'partial' | 'incorrect' {
  if (max <= 0) return 'incorrect';
  const f = got / max;
  return f >= 0.75 ? 'correct' : f >= 0.4 ? 'partial' : 'incorrect';
}
