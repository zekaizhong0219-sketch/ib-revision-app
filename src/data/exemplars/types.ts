/** A model answer for a timed-writing task, with estimated marks and commentary per criterion. */
export interface ExemplarSource {
  /** A distinctive snippet of the essay prompt this exemplar answers (must match exactly one prompt). */
  prompt: string;
  title: string;
  text: string;
  /** Estimated marks per rubric criterion id. */
  scores: Record<string, number>;
  /** Examiner-style comment per criterion id. */
  notes: Record<string, string>;
  overall: string;
}

export interface Exemplar extends ExemplarSource {
  /** Id of the matched essay prompt. */
  promptId: string;
}
