import type { EssayPrompt } from '../../types';
import { englishEssays } from './english';
import { historyEssays } from './history';
import { spanishEssays } from './spanish';
import { spanishLarraEssays } from './spanishLarra';

/** All built-in timed-writing prompts. */
export const ALL_ESSAYS: EssayPrompt[] = [...englishEssays, ...historyEssays, ...spanishEssays, ...spanishLarraEssays];
