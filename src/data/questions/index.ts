import type { Question } from '../../types';
import { physicsQuestions } from './physics';
import { chemistryQuestions } from './chemistry';
import { mathQuestions } from './math';
import { englishQuestions } from './english';
import { historyQuestions } from './history';
import { spanishQuestions } from './spanish';
import { physicsStructured } from './physicsStructured';
import { chemistryStructured } from './chemistryStructured';
import { mathStructured } from './mathStructured';

export const ALL_QUESTIONS: Question[] = [...physicsQuestions, ...chemistryQuestions, ...mathQuestions, ...englishQuestions, ...historyQuestions, ...spanishQuestions,
  ...physicsStructured,
  ...chemistryStructured,
  ...mathStructured,
];
