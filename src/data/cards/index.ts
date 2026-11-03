import type { Card } from '../../types';
import { physicsCards } from './physics';
import { chemistryCards } from './chemistry';
import { mathCards } from './math';
import { englishCards } from './english';
import { historyCards } from './history';
import { spanishCards } from './spanish';
import { coldWarSourceCards } from './coldWarSources';
import { topic11SourceCards } from './topic11Sources';
import { historiographyCards } from './historiography';
import { lucanorCards } from './lucanorSources';

/** All built-in flashcards. User-created cards live in AppData.customCards. */
export const ALL_CARDS: Card[] = [...physicsCards, ...chemistryCards, ...mathCards, ...englishCards, ...historyCards, ...spanishCards, ...coldWarSourceCards, ...topic11SourceCards, ...historiographyCards, ...lucanorCards];
