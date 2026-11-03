import { hashString } from '../dsl';
import { SUBJECT_PREFIX } from '../subjectIds';
import { OPENSTAX_EXERCISES, type OpenStaxExercise } from '../openstax.generated';
import type { Question } from '../../types';

/**
 * Practice questions adapted from OpenStax textbooks (CC BY 4.0), with answers from the
 * OpenStax answer keys. A question whose answer is a single number (with an optional unit)
 * and has no parts is auto-marked within ±3 %; the rest are self-marked against the answer.
 */
const SINGLE_NUMBER = /^(?:[A-Za-z]\s*=\s*)?(-?\d+(?:\.\d+)?)(?:\s*(?:×|x)\s*10\^?\{?(-?\d+)\}?)?\s*([A-Za-z°%/·\s]{0,12})\.?$/;

function attribution(x: OpenStaxExercise): string {
  return `Adapted from OpenStax, *${x.source.book}*, chapter ${x.source.chapter}, exercise ${x.source.number} (CC BY 4.0; answer from the OpenStax answer key). ${x.source.url}`;
}

export function openstaxQuestion(x: OpenStaxExercise): Question {
  const id = `${SUBJECT_PREFIX[x.subject]}-q-${x.topic}-ox${hashString(x.prompt)}`;
  const plain = x.answer.replace(/−/g, '-').trim();
  const m = !/\(a\)|\ba\.\s/.test(x.prompt + ' ' + x.answer) && !plain.includes('$') ? plain.match(SINGLE_NUMBER) : null;
  if (m) {
    const value = Number(m[1]) * (m[2] ? 10 ** Number(m[2]) : 1);
    if (Number.isFinite(value) && value !== 0) {
      const unit = m[3].trim() || undefined;
      return {
        id,
        subject: x.subject,
        topic: x.topic,
        type: 'numeric',
        prompt: x.prompt,
        numeric: { value, rel: 0.03, ...(unit ? { unit } : {}) },
        solution: `Answer: ${x.answer}\n\n${attribution(x)}`,
      };
    }
  }
  return { id, subject: x.subject, topic: x.topic, type: 'open', prompt: x.prompt, answer: x.answer, solution: attribution(x) };
}

/** Some books repeat an exercise word for word; keep the first. */
export const openstaxQuestions: Question[] = [...new Map(OPENSTAX_EXERCISES.map(openstaxQuestion).map((q) => [q.id, q] as const)).values()];
