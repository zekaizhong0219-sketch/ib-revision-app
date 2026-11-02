/**
 * Assessment criteria used for self-marking timed writing.
 * Criterion names, mark allocations and timings follow the current IB guides; the band
 * descriptors are short paraphrases written for this app (not quotations). Always check
 * the official guide / your teacher for the full wording.
 */

export interface Band {
  /** Lowest mark in this band. */
  min: number;
  max: number;
  text: string;
}

export interface Criterion {
  id: string;
  name: string;
  max: number;
  /** What the criterion rewards, in one sentence. */
  focus: string;
  bands: Band[];
}

export interface Rubric {
  id: string;
  name: string;
  /** Exam duration in minutes for the full paper / task. */
  minutes: number;
  criteria: Criterion[];
  note?: string;
}

const five = (top: string, mid: string, low: string): Band[] => [
  { min: 5, max: 5, text: top },
  { min: 3, max: 4, text: mid },
  { min: 1, max: 2, text: low },
];

export const RUBRICS: Rubric[] = [
  {
    id: 'esp-p1',
    name: 'Español A LyL NM — Prueba 1 (análisis guiado)',
    minutes: 75,
    note: 'NM: un texto no literario, 1 h 15 min, 20 puntos.',
    criteria: [
      {
        id: 'A', name: 'A. Comprensión e interpretación', max: 5,
        focus: 'Entiendes el sentido literal y las implicaciones del texto y apoyas tu interpretación con referencias pertinentes.',
        bands: five('Interpretación perspicaz y matizada, siempre bien respaldada por citas precisas.', 'Interpretación convincente con referencias en general pertinentes.', 'Comprensión superficial o literal; pocas referencias.'),
      },
      {
        id: 'B', name: 'B. Análisis y evaluación', max: 5,
        focus: 'Analizas y valoras cómo las decisiones textuales y los recursos estilísticos construyen el significado.',
        bands: five('Análisis y valoración perspicaces del efecto de los recursos sobre el sentido.', 'Análisis adecuado con algo de valoración; a veces descriptivo.', 'Sobre todo descriptivo: se enumeran recursos sin explicar su efecto.'),
      },
      {
        id: 'C', name: 'C. Enfoque y organización', max: 5,
        focus: 'Tu análisis está centrado, estructurado y desarrollado con coherencia.',
        bands: five('Muy bien organizado y centrado; las ideas se desarrollan con fluidez.', 'Organizado y en general centrado, con alguna falta de cohesión.', 'Poca organización; ideas sueltas o repetidas.'),
      },
      {
        id: 'D', name: 'D. Lenguaje', max: 5,
        focus: 'Usas un lenguaje claro, variado y preciso, con registro y terminología adecuados.',
        bands: five('Lenguaje muy claro, preciso y variado; registro y terminología eficaces.', 'Lenguaje claro y en general preciso, con errores que no impiden la comunicación.', 'Lenguaje a veces confuso; registro poco adecuado.'),
      },
    ],
  },
  {
    id: 'esp-p2',
    name: 'Español A LyL — Prueba 2 (ensayo comparativo)',
    minutes: 105,
    note: 'NM y NS: comparación de dos obras literarias estudiadas, 1 h 45 min, 30 puntos.',
    criteria: [
      {
        id: 'A', name: 'A. Conocimiento, comprensión e interpretación', max: 10,
        focus: 'Muestras conocimiento de las dos obras y las interpretas en relación con la pregunta, comparando sus implicaciones.',
        bands: [
          { min: 9, max: 10, text: 'Conocimiento excelente de ambas obras; interpretación perspicaz y comparación convincente respecto a la pregunta.' },
          { min: 7, max: 8, text: 'Buen conocimiento y comprensión; interpretación sólida con referencias bien escogidas.' },
          { min: 5, max: 6, text: 'Conocimiento satisfactorio; interpretación con algunas referencias pertinentes.' },
          { min: 1, max: 4, text: 'Conocimiento escaso o desigual; poca relación con la pregunta.' },
        ],
      },
      {
        id: 'B', name: 'B. Análisis y evaluación', max: 10,
        focus: 'Analizas y valoras cómo las decisiones de los autores generan significado, comparando las dos obras.',
        bands: [
          { min: 9, max: 10, text: 'Análisis comparativo perspicaz y valoración convincente de las decisiones de autor.' },
          { min: 7, max: 8, text: 'Buen análisis comparativo con valoración en general eficaz.' },
          { min: 5, max: 6, text: 'Algo de análisis, pero a menudo descriptivo o poco comparativo.' },
          { min: 1, max: 4, text: 'Sobre todo descriptivo; apenas hay comparación.' },
        ],
      },
      {
        id: 'C', name: 'C. Enfoque y organización', max: 5,
        focus: 'El ensayo se centra en la pregunta, está bien estructurado y equilibra las dos obras.',
        bands: five('Estructura eficaz y equilibrada entre ambas obras; argumento siempre centrado.', 'Organizado y en general equilibrado.', 'Desequilibrado o poco estructurado.'),
      },
      {
        id: 'D', name: 'D. Lenguaje', max: 5,
        focus: 'Usas un lenguaje claro, variado y preciso, con registro académico.',
        bands: five('Lenguaje muy claro, preciso y variado; registro académico eficaz.', 'Lenguaje claro con algunos errores.', 'Lenguaje poco claro o registro inadecuado.'),
      },
    ],
  },
  {
    id: 'engb-p1',
    name: 'English B HL — Paper 1 (writing)',
    minutes: 90,
    note: 'HL: one task from a choice of three, 450–600 words, 30 marks.',
    criteria: [
      {
        id: 'A', name: 'A. Language', max: 12,
        focus: 'Range, accuracy and effectiveness of vocabulary and grammar.',
        bands: [
          { min: 10, max: 12, text: 'Varied, idiomatic and accurate; complex structures used effectively; errors are minor.' },
          { min: 7, max: 9, text: 'Effective and mostly accurate, with some complex structures and occasional errors.' },
          { min: 4, max: 6, text: 'Generally adequate but limited range; errors sometimes obscure meaning.' },
          { min: 1, max: 3, text: 'Very limited range; frequent errors that impede communication.' },
        ],
      },
      {
        id: 'B', name: 'B. Message', max: 12,
        focus: 'Relevance, development and organisation of ideas for the task.',
        bands: [
          { min: 10, max: 12, text: 'Relevant, well-developed ideas with convincing detail; clearly and coherently organised.' },
          { min: 7, max: 9, text: 'Relevant ideas, mostly developed and organised; some lapses in coherence.' },
          { min: 4, max: 6, text: 'Some relevant ideas but limited development or organisation.' },
          { min: 1, max: 3, text: 'Ideas rarely relevant; little development or structure.' },
        ],
      },
      {
        id: 'C', name: 'C. Conceptual understanding', max: 6,
        focus: 'Choice and use of text type, register, tone and conventions for the audience and purpose.',
        bands: [
          { min: 5, max: 6, text: 'Text type fully appropriate; register, tone and conventions consistently suited to audience and purpose.' },
          { min: 3, max: 4, text: 'Text type generally appropriate; register and conventions mostly suitable.' },
          { min: 1, max: 2, text: 'Text type and register only partly appropriate; few conventions.' },
        ],
      },
    ],
  },
  {
    id: 'hist-p2',
    name: 'History — Paper 2 essay',
    minutes: 45,
    note: 'Paper 2 is 1 h 30 min for two essays (≈ 45 min each), each marked out of 15 with one holistic markband.',
    criteria: [
      {
        id: 'M', name: 'Overall markband', max: 15,
        focus: 'Focus on the question, accurate and relevant knowledge, critical analysis, structure, and evaluation of different perspectives.',
        bands: [
          { min: 13, max: 15, text: 'Clearly focused, well structured; accurate, relevant knowledge used as evidence; sustained critical analysis; perspectives evaluated; conclusion consistent with the argument.' },
          { min: 10, max: 12, text: 'Focused and structured; mostly accurate knowledge supporting critical analysis; some awareness of perspectives.' },
          { min: 7, max: 9, text: 'Generally understands demands; adequate knowledge but analysis partly descriptive or uneven.' },
          { min: 4, max: 6, text: 'Some understanding of the question; knowledge limited or inaccurate; mainly narrative.' },
          { min: 1, max: 3, text: 'Little understanding of the question; very little relevant knowledge.' },
        ],
      },
    ],
  },
  {
    id: 'hist-p1-q4',
    name: 'History — Paper 1, question 4 (sources + own knowledge)',
    minutes: 20,
    note: 'Paper 1 is 1 h for four questions (24 marks). Question 4 is worth 9 marks; aim for about 20 minutes.',
    criteria: [
      {
        id: 'M', name: 'Overall markband', max: 9,
        focus: 'Focused response that integrates evidence from the sources with accurate own knowledge.',
        bands: [
          { min: 7, max: 9, text: 'Focused; sources used effectively as evidence and integrated with accurate, relevant own knowledge; well-developed synthesis.' },
          { min: 4, max: 6, text: 'Mostly focused; uses sources and some own knowledge, but integration is limited.' },
          { min: 1, max: 3, text: 'Little focus; sources or own knowledge used generally or descriptively.' },
        ],
      },
    ],
  },
];

export function getRubric(id: string): Rubric | undefined {
  return RUBRICS.find((r) => r.id === id);
}

export function rubricMax(r: Rubric): number {
  return r.criteria.reduce((s, c) => s + c.max, 0);
}
