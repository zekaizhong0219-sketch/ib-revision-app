import type { Card } from '../../types';
import { physicsCards } from './physics';
import { chemistryCards } from './chemistry';
import { mathCards } from './math';
import { englishCards } from './english';
import { historyCards } from './history';
import { spanishCards } from './spanish';

/** All built-in flashcards. User-created cards live in AppData.customCards. */
export const ALL_CARDS: Card[] = [...physicsCards, ...chemistryCards, ...mathCards, ...englishCards, ...historyCards, ...spanishCards];
