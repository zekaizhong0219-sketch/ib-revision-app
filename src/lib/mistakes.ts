import type { AppData, Card, CardState, Question } from '../types';
import { formatNumber } from './answer';

/** Prefix of automatically created mistake cards. */
export const MISTAKE_PREFIX = 'mk-';

/** A card has become a "leech" when it has been forgotten this many times. */
export const LEECH_LAPSES = 5;

export function isLeech(st: CardState | undefined): boolean {
  return !!st && st.lapses >= LEECH_LAPSES;
}

export function isMistakeCard(c: Card): boolean {
  return c.id.startsWith(MISTAKE_PREFIX);
}

/** Converts a practice question you got wrong into a review flashcard. */
export function mistakeCard(q: Question): Card {
  let front = q.prompt;
  let back: string;
  switch (q.type) {
    case 'mc':
      front += '\n' + q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n');
      back = `**${String.fromCharCode(65 + q.answer)}.** ${q.options[q.answer]}`;
      break;
    case 'numeric':
      back = `**${formatNumber(q.numeric.value)}${q.numeric.unit ? ' ' + q.numeric.unit : ''}**`;
      break;
    case 'text':
      back = `**${q.answers.join(' / ')}**`;
      break;
    case 'open':
      back = q.answer;
      break;
    case 'order':
      back = q.items.map((x, i) => `${i + 1}. ${x}`).join('\n');
      break;
    case 'match':
      back = q.pairs.map(([l, r]) => `${l} → ${r}`).join('\n');
      break;
    case 'structured':
      front += '\n' + q.parts.map((p) => `(${p.label}) [${p.marks}] ${p.prompt}`).join('\n');
      back = q.parts.map((p) => `**(${p.label})** ${p.scheme}`).join('\n');
      break;
  }
  if (q.solution) back += `\n\n${q.solution}`;
  return { id: `${MISTAKE_PREFIX}${q.id}`, subject: q.subject, topic: q.topic, front, back, kind: 'concept', custom: true };
}

/**
 * Returns the custom-card list with mistake cards added for any newly failed questions
 * (incorrect or partial). Existing mistake cards are left untouched.
 */
export function addMistakeCards(data: AppData, failed: Question[]): Card[] {
  if (!failed.length) return data.customCards;
  const have = new Set(data.customCards.map((c) => c.id));
  const added = failed.map(mistakeCard).filter((c) => !have.has(c.id) && (have.add(c.id), true));
  return added.length ? [...data.customCards, ...added] : data.customCards;
}
