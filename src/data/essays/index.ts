import type { EssayPrompt } from '../../types';
import { englishEssays } from './english';
import { historyEssays } from './history';
import { spanishEssays } from './spanish';

/** All built-in timed-writing prompts. */
export const ALL_ESSAYS: EssayPrompt[] = [...englishEssays, ...historyEssays, ...spanishEssays];
