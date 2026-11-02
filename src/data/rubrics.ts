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

/** One band per mark, 5 → 1 (descriptors from the IB guide as summarised in the student's study skills). */
const lv5 = (l5: string, l4: string, l3: string, l2: string, l1: string): Band[] => [
  { min: 5, max: 5, text: l5 },
  { min: 4, max: 4, text: l4 },
  { min: 3, max: 3, text: l3 },
  { min: 2, max: 2, text: l2 },
  { min: 1, max: 1, text: l1 },
];


export const RUBRICS: Rubric[] = [
  {
    id: 'esp-p1',
    name: 'Español A LyL NM: Prueba 1 (análisis guiado)',
    minutes: 75,
    note: 'NM: un texto no literario de dos propuestos, 1 h 15 min, 20 puntos (4 criterios de 5).',
    criteria: [
      {
        id: 'A', name: 'A. Comprensión e interpretación', max: 5,
        focus: 'Comprendes el sentido literal y las implicaciones del texto, y apoyas la interpretación con referencias pertinentes.',
        bands: lv5(
          'Comprensión perspicaz; interpretación convincente de las implicaciones mayores y de las sutilezas; referencias bien elegidas.',
          'Comprensión profunda; interpretación convincente de muchas implicaciones; referencias pertinentes.',
          'Comprensión literal; interpretación satisfactoria de algunas implicaciones; referencias en general pertinentes.',
          'Cierta comprensión literal; referencias a veces adecuadas.',
          'Poca comprensión literal; referencias escasas o inadecuadas.',
        ),
      },
      {
        id: 'B', name: 'B. Análisis y evaluación', max: 5,
        focus: 'Analizas y valoras cómo las decisiones textuales y los recursos construyen el significado (si falta el efecto, B no supera el 3).',
        bands: lv5(
          'Análisis perspicaz y convincente; muy buena evaluación del efecto en el significado.',
          'Análisis adecuado y a veces perspicaz; buena evaluación del efecto.',
          'Análisis generalmente adecuado.',
          'Cierto análisis, pero basado en la descripción.',
          'Descriptivo; poco análisis pertinente.',
        ),
      },
      {
        id: 'C', name: 'C. Focalización y organización', max: 5,
        focus: 'El análisis está centrado en la pregunta, organizado y desarrollado con coherencia.',
        bands: lv5(
          'Organización eficaz y coherente; bien centrado.',
          'Bien organizado y en su mayor parte coherente; adecuadamente centrado.',
          'Organización adecuada y en general coherente; centrado en alguna medida.',
          'Cierta organización; muy poco centrado.',
          'Poca organización; sin foco.',
        ),
      },
      {
        id: 'D', name: 'D. Lenguaje', max: 5,
        focus: 'Lenguaje claro, variado y preciso, con registro y terminología adecuados.',
        bands: lv5(
          'Muy claro, eficaz y preciso; alta corrección; registro eficaz.',
          'Claro y cuidado; buena corrección; registro siempre adecuado.',
          'Claro y cuidado, con algunos errores; registro adecuado en su mayor parte.',
          'A veces claro; errores e incoherencias; registro adecuado en parte.',
          'Rara vez claro; muchos errores; sin noción de registro.',
        ),
      },
    ],
  },
  {
    id: 'esp-p2',
    name: 'Español A LyL: Prueba 2 (ensayo comparativo)',
    minutes: 105,
    note: 'NM y NS: una de cuatro preguntas generales; comparación de dos obras literarias estudiadas (no las del oral individual); 1 h 45 min. Desde mayo de 2026, sobre 25 (A, B1, B2, C y D, de 5 puntos cada uno).',
    criteria: [
      {
        id: 'A', name: 'A. Conocimiento, comprensión e interpretación', max: 5,
        focus: 'Conocimiento de las dos obras en relación con la pregunta e interpretación de sus implicaciones.',
        bands: lv5(
          'Conocimiento perspicaz; interpretación persuasiva.',
          'Buen conocimiento; interpreta constantemente las implicaciones.',
          'Conocimiento satisfactorio e interpretación de las implicaciones.',
          'Cierto conocimiento.',
          'Poco conocimiento de las obras en relación con la pregunta.',
        ),
      },
      {
        id: 'B1', name: 'B1. Análisis de rasgos textuales y decisiones de los autores', max: 5,
        focus: 'Calidad del análisis de las decisiones formales y de su efecto en el significado (no el número de recursos). Si solo hay contenido, B1 no supera el 2.',
        bands: lv5(
          'Perspicaz y convincente en todo momento; muy buena evaluación.',
          'Adecuado y a veces perspicaz; buena evaluación del efecto en el significado.',
          'Análisis generalmente adecuado.',
          'Cierto análisis, basado en la descripción.',
          'Descriptivo; poco análisis pertinente.',
        ),
      },
      {
        id: 'B2', name: 'B2. Análisis comparativo', max: 5,
        focus: 'Cómo las semejanzas y diferencias dan profundidad al análisis (no su cantidad ni su equilibrio).',
        bands: lv5('Muy buen análisis.', 'Buen análisis.', 'Análisis adecuado.', 'Análisis superficial.', 'Poco análisis significativo de semejanzas y diferencias.'),
      },
      {
        id: 'C', name: 'C. Focalización y organización', max: 5,
        focus: 'Ensayo centrado en la pregunta, equilibrado entre las dos obras y con desarrollo lógico.',
        bands: lv5(
          'Centrado de forma clara y constante; muy equilibrado; desarrollo lógico y convincente.',
          'Centrado de forma clara y constante en su mayor parte; tratamiento equilibrado; desarrollo lógico.',
          'Centrado a pesar de algunos errores; obras en su mayor parte equilibradas; desarrollo en general lógico.',
          'Centrado solo a veces; puede faltar equilibrio; conexiones no siempre coherentes.',
          'Rara vez centrado; pocas conexiones.',
        ),
      },
      {
        id: 'D', name: 'D. Lenguaje', max: 5,
        focus: 'Lenguaje claro, preciso y con registro académico.',
        bands: lv5(
          'Muy claro, eficaz y preciso; registro eficaz.',
          'Claro, buena corrección; registro siempre adecuado.',
          'Claro y cuidado, con algunos errores; registro adecuado en su mayor parte.',
          'A veces claro; errores; registro adecuado en parte.',
          'Rara vez claro; muchos errores.',
        ),
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
