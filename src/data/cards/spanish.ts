import { parseCards } from '../dsl';
import { spanishToolsSource } from './spanishTools';
import { spanishCourseSource } from './spanishCourse';
import { spanishTextSource } from './spanishText';
import { spanishWorks1Source } from './spanishWorks1';
import { spanishWorks2Source } from './spanishWorks2';

export const SPANISH_DECK_VERSION = 1;

export const spanishCards = [...parseCards('spanish', spanishToolsSource), ...parseCards('spanish', spanishCourseSource),
  ...parseCards('spanish', spanishTextSource),
  ...parseCards('spanish', spanishWorks1Source),
  ...parseCards('spanish', spanishWorks2Source),
];
