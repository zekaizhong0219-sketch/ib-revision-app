import type { Card } from '../../types';
import { physicsCards } from './physics';
import { chemistryCards } from './chemistry';

export const ALL_CARDS: Card[] = [...physicsCards, ...chemistryCards];
