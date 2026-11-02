import type { EssayPrompt } from '../../types';
import { englishEssays } from './english';

/** All built-in timed-writing prompts. */
export const ALL_ESSAYS: EssayPrompt[] = [...englishEssays];
