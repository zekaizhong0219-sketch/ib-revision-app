import { parseCards } from '../dsl';
import { commandTermCards } from './commandTerms';
import { mathAlgebraFunctionsSource } from './mathAlgebraFunctions';
import { mathGeometryStatsSource } from './mathGeometryStats';
import { mathCalculusSource } from './mathCalculus';

export const MATH_DECK_VERSION = 1;

export const mathCards = [
  ...parseCards('math', mathAlgebraFunctionsSource),
  ...parseCards('math', mathGeometryStatsSource),
  ...parseCards('math', mathCalculusSource),
  ...commandTermCards('math', [
    'Calculate', 'Comment', 'Deduce', 'Describe', 'Determine', 'Differentiate', 'Draw', 'Estimate', 'Explain',
    'Find', 'Hence', 'Hence or otherwise', 'Integrate', 'Interpret', 'Justify', 'Label', 'Plot', 'Prove',
    'Show that', 'Sketch', 'Solve', 'State', 'Verify', 'Write down',
  ]),
];
