import { ALL_ESSAYS } from '../essays';
import type { Exemplar, ExemplarSource } from './types';
import { spanishExemplars } from './spanish';
import { historyExemplars } from './history';
import { englishExemplars } from './english';

export type { Exemplar } from './types';

export const EXEMPLAR_SOURCES: ExemplarSource[] = [...spanishExemplars, ...historyExemplars, ...englishExemplars];

function resolve(src: ExemplarSource): Exemplar {
  const matches = ALL_ESSAYS.filter((e) => e.prompt.includes(src.prompt));
  if (matches.length !== 1) throw new Error(`Exemplar "${src.title}" matches ${matches.length} prompts`);
  return { ...src, promptId: matches[0].id };
}

export const EXEMPLARS: Exemplar[] = EXEMPLAR_SOURCES.map(resolve);
export const EXEMPLAR_BY_PROMPT = new Map(EXEMPLARS.map((e) => [e.promptId, e]));
