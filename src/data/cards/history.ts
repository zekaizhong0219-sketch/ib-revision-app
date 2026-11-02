import { parseCards } from '../dsl';
import { commandTermCards } from './commandTerms';
import { historyPS3Source } from './historyPS3';
import { historyT11Source } from './historyT11';
import { historyT11bSource } from './historyT11b';
import { historyT12Source } from './historyT12';

export const HISTORY_DECK_VERSION = 1;

export const historyCards = [
  ...parseCards('history', historyPS3Source),
  ...parseCards('history', historyT11Source),
  ...parseCards('history', historyT11bSource),
  ...parseCards('history', historyT12Source),
  ...commandTermCards('history', ['Analyse', 'Compare and contrast', 'Discuss', 'Evaluate', 'Examine', 'Explain', 'To what extent']),
];
