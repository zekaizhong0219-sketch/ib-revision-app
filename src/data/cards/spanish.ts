import { parseCards } from '../dsl';
import { spanishToolsSource } from './spanishTools';
import { spanishCourseSource } from './spanishCourse';
import { spanishTextSource } from './spanishText';

export const SPANISH_DECK_VERSION = 1;

export const spanishCards = [...parseCards('spanish', spanishToolsSource), ...parseCards('spanish', spanishCourseSource),
  ...parseCards('spanish', spanishTextSource),
];
