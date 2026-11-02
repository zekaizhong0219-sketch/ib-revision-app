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
  /** Number of results used. */
  n: number;
}

const RECENT = 6;

/**
 * Estimates a grade from the most recent mock papers (and, for essay subjects, self-assessed
 * timed writing). Needs at least 2 results; more recent results weigh more.
 */
export function estimateGrade(data: AppData, subject: SubjectId): GradeEstimate | null {
  const results: { t: number; pct: number }[] = [
    ...data.mocks.filter((m) => m.subject === subject && m.max > 0).map((m) => ({ t: m.t, pct: (100 * m.got) / m.max })),
    ...data.essays
      .filter((e) => e.subject === subject && e.done)
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
  return {
    subject,
    percent: mean,
    grade: gradeFromPercent(mean),
    low: gradeFromPercent(Math.max(0, mean - spread)),
    high: gradeFromPercent(Math.min(100, mean + spread)),
    n: results.length,
  };
}
