import { parseCards } from '../dsl';
import { commandTermCards } from './commandTerms';
import { chemistryStructureSource } from './chemistryStructure';
import { chemistryReactivitySource } from './chemistryReactivity';

export const CHEMISTRY_DECK_VERSION = 1;

export const chemistryCards = [
  ...parseCards('chemistry', chemistryStructureSource),
  ...parseCards('chemistry', chemistryReactivitySource),
  ...commandTermCards('chemistry', [
    'Annotate', 'Calculate', 'Compare and contrast', 'Deduce', 'Define', 'Describe', 'Determine', 'Discuss',
    'Distinguish', 'Draw', 'Estimate', 'Evaluate', 'Explain', 'Identify', 'Justify', 'Outline', 'Predict',
    'Sketch', 'State', 'Suggest',
  ]),
];
