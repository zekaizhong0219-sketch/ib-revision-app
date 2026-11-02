import type { AppData, SubjectId } from '../types';
import { essayPercent } from './stats';

/**
 * Rough percentage → IB grade (1–7) conversion.
 *
 * IMPORTANT: real grade boundaries are set per subject, level and session, and combine all
 * components (including internal assessment). These thresholds are a deliberately simple,
 * typical-looking guide so mock results can be read as an approximate grade with a margin
 * of error — not a prediction of your final IB grade.
 */
export const GRADE_THRESHOLDS: [grade: number, minPercent: number][] = [
  [7, 70],
  [6, 58],
  [5, 46],
  [4, 35],
  [3, 24],
  [2, 13],
  [1, 0],
];

export function gradeFromPercent(pct: number): number {
  for (const [g, min] of GRADE_THRESHOLDS) if (pct >= min) return g;
  return 1;
}

export interface GradeEstimate {
  subject: SubjectId;
  /** Weighted mean percentage of recent mocks/essays. */
  percent: number;
  grade: number;
  /** Range of grades from ± one standard deviation (min 4 percentage points). */
  low: number;
  high: number;
  /** Half-width of the range in percentage points. */
  spread: number;
  /** Number of results used. */
  n: number;
}

const RECENT = 6;

/**
 * Estimates a grade from the most recent mock papers (and, for essay subjects, self-assessed
 * timed writing). Needs at least 2 results; more recent results weigh more.
 */
export function estimateGrade(data: AppData, subject: SubjectId, asOf = Infinity): GradeEstimate | null {
  const results: { t: number; pct: number }[] = [
    ...data.mocks.filter((m) => m.subject === subject && m.max > 0 && m.t <= asOf).map((m) => ({ t: m.t, pct: (100 * m.got) / m.max })),
    ...data.essays
      .filter((e) => e.subject === subject && e.done && e.t <= asOf)
      .map((e) => ({ t: e.t, pct: (essayPercent(e) ?? NaN) * 100 }))
      .filter((r) => Number.isFinite(r.pct)),
  ]
    .sort((a, b) => b.t - a.t)
    .slice(0, RECENT);
  if (results.length < 2) return null;
  // Linearly decreasing weights: newest = RECENT, oldest = RECENT - n + 1.
  let wsum = 0;
  let sum = 0;
  results.forEach((r, i) => {
    const w = RECENT - i;
    wsum += w;
    sum += w * r.pct;
  });
  const mean = sum / wsum;
  const sd = Math.sqrt(results.reduce((s, r) => s + (r.pct - mean) ** 2, 0) / results.length);
  const spread = Math.max(4, sd);
  return withPercent(subject, mean, spread, results.length);
}

function withPercent(subject: SubjectId, mean: number, spread: number, n: number): GradeEstimate {
  const pct = Math.min(100, Math.max(0, mean));
  return {
    subject,
    percent: pct,
    grade: gradeFromPercent(pct),
    low: gradeFromPercent(Math.max(0, pct - spread)),
    high: gradeFromPercent(Math.min(100, pct + spread)),
    spread,
    n,
  };
}

const DAY = 86_400_000;

export interface Calibration {
  subject: SubjectId;
  /** Number of school results for the subject. */
  n: number;
  /** Mean percentage of the most recent (up to 3) school results. */
  schoolPct: number;
  /** Most recent grade given by a teacher, if any was entered. */
  schoolGrade: number | null;
  /** School results for which the app had its own estimate on that date. */
  pairs: number;
  /** Mean of (app estimate % − school %) over those pairs; positive = the app is more generous. */
  bias: number | null;
  /** Current app estimate shifted by −bias (null without a current estimate or any pair). */
  adjusted: GradeEstimate | null;
}

/**
 * Compares the app's estimate with real school results. For each school result, the app's
 * estimate is recomputed from mocks and essays done up to one day after that assessment, so
 * results entered later are still compared with what the app knew at the time.
 */
export function calibrate(data: AppData, subject: SubjectId): Calibration | null {
  const results = data.school.filter((r) => r.subject === subject && r.max > 0).sort((a, b) => a.t - b.t);
  if (!results.length) return null;
  const pct = (r: { got: number; max: number }) => (100 * r.got) / r.max;
  const recent = results.slice(-3);
  const diffs = results
    .map((r) => {
      const e = estimateGrade(data, subject, r.t + DAY);
      return e ? e.percent - pct(r) : null;
    })
    .filter((x): x is number => x !== null);
  const bias = diffs.length ? diffs.reduce((a, b) => a + b, 0) / diffs.length : null;
  const current = estimateGrade(data, subject);
  const graded = results.filter((r) => r.grade);
  return {
    subject,
    n: results.length,
    schoolPct: recent.reduce((s, r) => s + pct(r), 0) / recent.length,
    schoolGrade: graded.length ? graded[graded.length - 1].grade ?? null : null,
    pairs: diffs.length,
    bias,
    adjusted: current && bias !== null ? withPercent(subject, current.percent - bias, current.spread, current.n) : null,
  };
}
