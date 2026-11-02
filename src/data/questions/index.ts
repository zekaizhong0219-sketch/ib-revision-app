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
import { englishReading } from './englishReading';
import { worksQuestions } from './worksAndWars';
import { physicsExtra } from './physicsExtra';
import { chemistryExtra } from './chemistryExtra';
import { mathExtra } from './mathExtra';

export const ALL_QUESTIONS: Question[] = [...physicsQuestions, ...chemistryQuestions, ...mathQuestions, ...englishQuestions, ...historyQuestions, ...spanishQuestions,
  ...physicsStructured,
  ...chemistryStructured,
  ...mathStructured,
  ...englishReading,
  ...worksQuestions,
  ...physicsExtra,
  ...chemistryExtra,
  ...mathExtra,
];
