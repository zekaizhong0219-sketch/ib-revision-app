import type { SourceQuestion } from '../types';

/**
 * History Paper 1 (prescribed subject) structure and marking guidance, paraphrased for the app.
 * Paper 1 SL/HL: 1 hour (plus 5 minutes' reading time), four sources, 24 marks.
 * The guidance summarises common marking practice; check the current guide with your teacher.
 */

export const PAPER1_MINUTES = 60;
export const PAPER1_READING_MINUTES = 5;

export const PAPER1_TOPICS = [
  { id: 'PS3.JP', name: 'Japanese expansion in East Asia (1931–1941)' },
  { id: 'PS3.EU', name: 'German and Italian expansion (1933–1940)' },
];

/** Default question set for a focus such as "the reasons for the Japanese invasion of Manchuria". */
export function paper1Questions(focus: string): SourceQuestion[] {
  const f = focus.trim() || '[the focus of this set]';
  return [
    { label: '1a', marks: 3, prompt: `What does Source A suggest about ${f}?` },
    { label: '1b', marks: 2, prompt: 'What is the message of Source B?' },
    {
      label: '2',
      marks: 4,
      prompt: `Referring to its origin, purpose and content, assess the value and limitations of Source C for a historian studying ${f}.`,
    },
    { label: '3', marks: 6, prompt: `Compare and contrast what Sources A and D reveal about ${f}.` },
    { label: '4', marks: 9, prompt: `Using all the sources and your own knowledge, examine ${f}.` },
  ];
}

export interface Paper1Guide {
  /** Suggested minutes for the question. */
  minutes: number;
  /** What earns marks. */
  marking: string[];
  /** How to write it. */
  method: string[];
}

/** Marking guidance by question label. */
export const PAPER1_GUIDE: Record<string, Paper1Guide> = {
  '1a': {
    minutes: 5,
    marking: ['About 1 mark per distinct, relevant point taken from the source (3 points for 3 marks).', 'No own knowledge is needed.'],
    method: ['Paraphrase rather than copy long quotations.', 'One sentence per point; make each point clearly different.'],
  },
  '1b': {
    minutes: 4,
    marking: ['About 1 mark per valid element of the message (2 points for 2 marks).'],
    method: [
      'For a cartoon or poster, use the caption, symbols, figures and their size or position as evidence.',
      'State the message (the creator\'s point of view), not just a description of the image.',
    ],
  },
  '2': {
    minutes: 10,
    marking: [
      'Value and limitations, each linked to the origin, purpose or content of the source.',
      'An answer that covers only value or only limitations usually cannot reach full marks.',
    ],
    method: [
      'Origin: who, when, what type of source; Purpose: why it was produced and for whom.',
      'Explain why each feature makes the source valuable or limited for this particular question, not in general.',
      'Avoid generic claims ("it is biased", "it is only one source") unless you explain their effect.',
    ],
  },
  '3': {
    minutes: 15,
    marking: [
      'Marks for valid points of comparison (similarity) and contrast (difference), each supported from both sources.',
      'Answers with only similarities or only differences are usually capped below full marks.',
    ],
    method: [
      'Write a running comparison: each paragraph links both sources ("Both A and D…", "Whereas A…, D…").',
      'Aim for at least three linked points in total, including at least one similarity and one difference.',
      'Do not evaluate origin or purpose here; focus on what the sources say.',
    ],
  },
  '4': {
    minutes: 25,
    marking: ['Marked with markbands (0–9); see the bands below.'],
    method: [
      'Short introduction with a clear argument that answers the question.',
      'Use the sources as evidence (cite them as "Source A…") and add specific own knowledge: dates, names, events, figures.',
      'Integrate the two: each paragraph should combine source evidence with own knowledge.',
      'Use at least three sources; a conclusion that weighs the evidence.',
    ],
  },
};

/** Where to find suitable sources (no source text is bundled with the app). */
export const SOURCE_TIPS = [
  'Your Paper 1 textbook and your teacher\'s source packs (the best match for the exam\'s style).',
  'Past Paper 1s and specimen papers from your teacher.',
  'Public-domain archives such as the Avalon Project (Yale Law School: treaties, the Hossbach Memorandum, the Munich Agreement), the League of Nations archives (the Lytton Report, 1932) and Hansard (UK parliamentary debates, e.g. on appeasement).',
  'For visual sources, describe the cartoon or poster in the text box (caption, figures, symbols) and note where it was published.',
];
