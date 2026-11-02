import type { Question } from '../../types';
import { physicsQuestions } from './physics';
import { chemistryQuestions } from './chemistry';
import { mathQuestions } from './math';
import { englishQuestions } from './english';

export const ALL_QUESTIONS: Question[] = [...physicsQuestions, ...chemistryQuestions, ...mathQuestions, ...englishQuestions];
