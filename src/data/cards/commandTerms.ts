import type { Card, SubjectId } from '../../types';
import { hashString } from '../dsl';
import { SUBJECT_PREFIX as PREFIX } from '../subjectIds';

/**
 * IB command terms with explanations written in our own words (paraphrased,
 * not quoted from IB documents), plus a tip on what examiners reward.
 */
export const COMMAND_TERMS: Record<string, string> = {
  Annotate: 'Add short explanatory notes to a diagram or graph.',
  Calculate: 'Work out a numerical answer and show the key steps of the working.',
  Comment: 'Make a judgement about a given statement or about the result of a calculation.',
  Compare: 'Point out the similarities between two or more things, referring to each of them throughout.',
  'Compare and contrast': 'Point out both similarities and differences between two or more things, referring to each of them throughout.',
  Construct: 'Present information in a diagram or in a logical structure.',
  Contrast: 'Point out the differences between two or more things, referring to each of them throughout.',
  Deduce: 'Arrive at a conclusion using the information provided.',
  Define: 'Give the exact meaning of a term, concept or physical quantity.',
  Derive: 'Manipulate known relationships algebraically to obtain a new equation.',
  Describe: 'Give a detailed account of what happens or what something is like (no reasons needed).',
  Determine: 'Find the single possible answer.',
  Differentiate: 'Find the derivative of a function.',
  Discuss: 'Give a balanced review covering several arguments or factors, ending with a supported conclusion.',
  Distinguish: 'Make the differences between two or more concepts clear.',
  Draw: 'Produce an accurate, labelled diagram or graph in pencil, using a ruler for straight lines and plotting points correctly.',
  Estimate: 'Find an approximate value.',
  Evaluate: 'Judge something by weighing up its strengths against its limitations.',
  Explain: 'Give a detailed account that includes the reasons or causes.',
  Find: 'Obtain an answer, showing the relevant stages of working.',
  Hence: 'Use the result you have just obtained to get the required answer — other methods earn no credit.',
  'Hence or otherwise': 'Using the preceding result is recommended, but any valid method can earn credit.',
  Identify: 'Pick out an answer from a number of possibilities.',
  Integrate: 'Find the integral of a function.',
  Interpret: 'Use your knowledge to recognise trends and draw conclusions from given information.',
  Justify: 'Give valid reasons or evidence that support an answer or conclusion.',
  Label: 'Add names or labels to a diagram.',
  List: 'Give a series of brief answers without explanation.',
  Outline: 'Give a short account or summary.',
  Plot: 'Mark the positions of points on a diagram or graph.',
  Predict: 'Give the result you would expect.',
  Prove: 'Use a formal sequence of logical steps to establish the required result.',
  Show: 'Give the steps of a calculation or derivation.',
  'Show that': 'Reach the given result by showing the steps, without the full formality of a proof; usually no calculator needed.',
  Sketch: 'Draw a diagram or graph showing the general shape and the important features (intercepts, asymptotes, turning points), labelled as needed.',
  Solve: 'Find the answer(s) by algebraic, numerical and/or graphical methods.',
  State: 'Give a name, value or short answer with no explanation or calculation.',
  Suggest: 'Put forward a possible solution, hypothesis or answer.',
  Verify: 'Provide evidence that confirms a result is correct.',
  'Write down': 'Give the answer directly — little or no calculation is needed and working need not be shown.',
};


export function commandTermCards(subject: SubjectId, terms: string[]): Card[] {
  return terms.map((term) => {
    const meaning = COMMAND_TERMS[term];
    if (!meaning) throw new Error(`Unknown command term: ${term}`);
    const front = `Command term: **${term}**`;
    return {
      id: `${PREFIX[subject]}-CT-${hashString(front)}`,
      subject,
      topic: 'CT',
      front,
      back: meaning,
      kind: 'command' as const,
    };
  });
}
