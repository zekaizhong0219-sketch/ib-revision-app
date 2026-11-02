import { parseCards } from '../dsl';
import { englishWritingSource } from './englishWriting';
import { englishThemesSource } from './englishThemes';
import { englishIdiomsSource } from './englishIdioms';
import { englishWorksSource } from './englishWorks';

export const ENGLISH_DECK_VERSION = 1;

export const englishCards = [...parseCards('english', englishWritingSource), ...parseCards('english', englishThemesSource),
  ...parseCards('english', englishIdiomsSource),
  ...parseCards('english', englishWorksSource),
];
