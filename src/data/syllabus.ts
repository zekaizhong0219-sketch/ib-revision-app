import type { Subject, SubjectId, Topic } from '../types';

/**
 * Topic structure follows the current IB guides:
 *  - Physics: first assessment 2025 (themes A–E)
 *  - Chemistry: first assessment 2025 (Structure 1–3, Reactivity 1–3)
 *  - Mathematics: Analysis & Approaches, first assessment 2021 (topics 1–5)
 *  - Spanish A: Language and Literature SL, first assessment 2021
 *  - English B HL, first assessment 2020 (five prescribed themes)
 *  - History SL, first assessment 2017 — Prescribed subject 3 (The move to global war),
 *    World history topic 11 (Causes and effects of 20th-century wars),
 *    World history topic 12 (The Cold War: superpower tensions and rivalries)
 * "CT" holds the IB command terms relevant to each subject.
 */

const physicsTopics: Topic[] = [
  { id: 'A.1', name: 'Kinematics', theme: 'A. Space, time and motion' },
  { id: 'A.2', name: 'Forces and momentum', theme: 'A. Space, time and motion' },
  { id: 'A.3', name: 'Work, energy and power', theme: 'A. Space, time and motion' },
  { id: 'A.4', name: 'Rigid body mechanics', theme: 'A. Space, time and motion', ahl: true },
  { id: 'A.5', name: 'Galilean and special relativity', theme: 'A. Space, time and motion', ahl: true },
  { id: 'B.1', name: 'Thermal energy transfers', theme: 'B. The particulate nature of matter' },
  { id: 'B.2', name: 'Greenhouse effect', theme: 'B. The particulate nature of matter' },
  { id: 'B.3', name: 'Gas laws', theme: 'B. The particulate nature of matter' },
  { id: 'B.4', name: 'Thermodynamics', theme: 'B. The particulate nature of matter', ahl: true },
  { id: 'B.5', name: 'Current and circuits', theme: 'B. The particulate nature of matter' },
  { id: 'C.1', name: 'Simple harmonic motion', theme: 'C. Wave behaviour' },
  { id: 'C.2', name: 'Wave model', theme: 'C. Wave behaviour' },
  { id: 'C.3', name: 'Wave phenomena', theme: 'C. Wave behaviour' },
  { id: 'C.4', name: 'Standing waves and resonance', theme: 'C. Wave behaviour' },
  { id: 'C.5', name: 'Doppler effect', theme: 'C. Wave behaviour' },
  { id: 'D.1', name: 'Gravitational fields', theme: 'D. Fields' },
  { id: 'D.2', name: 'Electric and magnetic fields', theme: 'D. Fields' },
  { id: 'D.3', name: 'Motion in electromagnetic fields', theme: 'D. Fields' },
  { id: 'D.4', name: 'Induction', theme: 'D. Fields', ahl: true },
  { id: 'E.1', name: 'Structure of the atom', theme: 'E. Nuclear and quantum physics' },
  { id: 'E.2', name: 'Quantum physics', theme: 'E. Nuclear and quantum physics', ahl: true },
  { id: 'E.3', name: 'Radioactive decay', theme: 'E. Nuclear and quantum physics' },
  { id: 'E.4', name: 'Fission', theme: 'E. Nuclear and quantum physics' },
  { id: 'E.5', name: 'Fusion and stars', theme: 'E. Nuclear and quantum physics' },
  { id: 'CT', name: 'Command terms', theme: 'Exam skills' },
];

const chemistryTopics: Topic[] = [
  { id: 'S1.1', name: 'Particulate nature of matter', theme: 'Structure 1. Models of the particulate nature of matter' },
  { id: 'S1.2', name: 'The nuclear atom', theme: 'Structure 1. Models of the particulate nature of matter' },
  { id: 'S1.3', name: 'Electron configurations', theme: 'Structure 1. Models of the particulate nature of matter' },
  { id: 'S1.4', name: 'Counting particles by mass: the mole', theme: 'Structure 1. Models of the particulate nature of matter' },
  { id: 'S1.5', name: 'Ideal gases', theme: 'Structure 1. Models of the particulate nature of matter' },
  { id: 'S2.1', name: 'The ionic model', theme: 'Structure 2. Models of bonding and structure' },
  { id: 'S2.2', name: 'The covalent model', theme: 'Structure 2. Models of bonding and structure' },
  { id: 'S2.3', name: 'The metallic model', theme: 'Structure 2. Models of bonding and structure' },
  { id: 'S2.4', name: 'From models to materials', theme: 'Structure 2. Models of bonding and structure' },
  { id: 'S3.1', name: 'The periodic table', theme: 'Structure 3. Classification of matter' },
  { id: 'S3.2', name: 'Functional groups', theme: 'Structure 3. Classification of matter' },
  { id: 'R1.1', name: 'Measuring enthalpy changes', theme: 'Reactivity 1. What drives chemical reactions?' },
  { id: 'R1.2', name: 'Energy cycles in reactions', theme: 'Reactivity 1. What drives chemical reactions?' },
  { id: 'R1.3', name: 'Energy from fuels', theme: 'Reactivity 1. What drives chemical reactions?' },
  { id: 'R1.4', name: 'Entropy and spontaneity', theme: 'Reactivity 1. What drives chemical reactions?', ahl: true },
  { id: 'R2.1', name: 'How much? Amount of chemical change', theme: 'Reactivity 2. How much, how fast and how far?' },
  { id: 'R2.2', name: 'How fast? Rate of chemical change', theme: 'Reactivity 2. How much, how fast and how far?' },
  { id: 'R2.3', name: 'How far? Extent of chemical change', theme: 'Reactivity 2. How much, how fast and how far?' },
  { id: 'R3.1', name: 'Proton transfer reactions', theme: 'Reactivity 3. Mechanisms of chemical change' },
  { id: 'R3.2', name: 'Electron transfer reactions', theme: 'Reactivity 3. Mechanisms of chemical change' },
  { id: 'R3.3', name: 'Electron sharing reactions', theme: 'Reactivity 3. Mechanisms of chemical change' },
  { id: 'R3.4', name: 'Electron-pair sharing reactions', theme: 'Reactivity 3. Mechanisms of chemical change' },
  { id: 'CT', name: 'Command terms', theme: 'Exam skills' },
];

const mathTopics: Topic[] = [
  { id: 'M1', name: 'Number and algebra', theme: 'Topic 1' },
  { id: 'M2', name: 'Functions', theme: 'Topic 2' },
  { id: 'M3', name: 'Geometry and trigonometry', theme: 'Topic 3' },
  { id: 'M4', name: 'Statistics and probability', theme: 'Topic 4' },
  { id: 'M5', name: 'Calculus', theme: 'Topic 5' },
  { id: 'CT', name: 'Command terms', theme: 'Exam skills' },
];

const spanishTopics: Topic[] = [
  { id: 'FIG', name: 'Figuras retóricas', theme: 'Herramientas de análisis' },
  { id: 'GEN', name: 'Géneros literarios y métrica', theme: 'Herramientas de análisis' },
  { id: 'NL', name: 'Textos no literarios', theme: 'Herramientas de análisis' },
  { id: 'MOV', name: 'Movimientos y contexto literario', theme: 'Contexto' },
  { id: 'CON', name: 'Conceptos y áreas de exploración', theme: 'Marco del curso' },
  { id: 'P1', name: 'Prueba 1: análisis guiado', theme: 'Evaluación' },
  { id: 'P2', name: 'Prueba 2: ensayo comparativo', theme: 'Evaluación' },
  { id: 'IO', name: 'Oral individual', theme: 'Evaluación' },
  { id: 'AE', name: 'La amiga estupenda (Ferrante)', theme: 'Obras del curso' },
  { id: 'EP', name: 'Un enemigo del pueblo (Ibsen)', theme: 'Obras del curso' },
  { id: 'AC', name: 'El árbol de la ciencia (Baroja)', theme: 'Obras del curso' },
  { id: 'CL', name: 'El conde Lucanor (don Juan Manuel)', theme: 'Obras del curso' },
  { id: 'PE', name: 'Persépolis (Satrapi)', theme: 'Obras del curso' },
  { id: 'CA', name: 'El cuarto de atrás (Martín Gaite)', theme: 'Obras del curso' },
  { id: 'OBR', name: 'Mis obras (otras)', theme: 'Obras del curso' },
];

const englishTopics: Topic[] = [
  { id: 'TT', name: 'Text types and conventions', theme: 'Writing (Paper 1)' },
  { id: 'REG', name: 'Register, tone and audience', theme: 'Writing (Paper 1)' },
  { id: 'LG', name: 'Linking words and grammar', theme: 'Language' },
  { id: 'ID', name: 'Identities', theme: 'Themes' },
  { id: 'EX', name: 'Experiences', theme: 'Themes' },
  { id: 'HI', name: 'Human ingenuity', theme: 'Themes' },
  { id: 'SO', name: 'Social organization', theme: 'Themes' },
  { id: 'SP', name: 'Sharing the planet', theme: 'Themes' },
  { id: 'RD', name: 'Reading and listening skills', theme: 'Paper 2' },
  { id: 'IO', name: 'Individual oral (literature)', theme: 'Internal assessment' },
  { id: 'TKM', name: 'To Kill a Mockingbird (Lee)', theme: 'Literary works' },
  { id: 'VC', name: 'Victory City (Rushdie)', theme: 'Literary works' },
  { id: 'MYW', name: 'My notes on the works', theme: 'Literary works' },
];

const historyTopics: Topic[] = [
  { id: 'PS3.JP', name: 'Japanese expansion in East Asia (1931–1941)', theme: 'Paper 1 · Prescribed subject 3: The move to global war' },
  { id: 'PS3.EU', name: 'German and Italian expansion (1933–1940)', theme: 'Paper 1 · Prescribed subject 3: The move to global war' },
  { id: 'SRC', name: 'Source analysis (OPVL)', theme: 'Paper 1 · Prescribed subject 3: The move to global war' },
  { id: 'W11.TH', name: 'Types, causes and effects of war (concepts)', theme: 'Paper 2 · Topic 11: Causes and effects of 20th-century wars' },
  { id: 'W11.WW1', name: 'First World War (1914–1918)', theme: 'Paper 2 · Topic 11: Causes and effects of 20th-century wars' },
  { id: 'W11.WW2', name: 'Second World War (1939–1945)', theme: 'Paper 2 · Topic 11: Causes and effects of 20th-century wars' },
  { id: 'W11.SCW', name: 'Spanish Civil War (1936–1939)', theme: 'Paper 2 · Topic 11: Causes and effects of 20th-century wars' },
  { id: 'W11.RJW', name: 'Russo-Japanese War (1904–1905)', theme: 'Paper 2 · Topic 11: Causes and effects of 20th-century wars' },
  { id: 'W11.CCW', name: 'Chinese Civil War (1927–1937, 1946–1949)', theme: 'Paper 2 · Topic 11: Causes and effects of 20th-century wars' },
  { id: 'W12.RMA', name: 'Rivalry, mistrust and accord', theme: 'Paper 2 · Topic 12: The Cold War' },
  { id: 'W12.LN', name: 'Leaders and nations', theme: 'Paper 2 · Topic 12: The Cold War' },
  { id: 'W12.CR', name: 'Cold War crises', theme: 'Paper 2 · Topic 12: The Cold War' },
  { id: 'W12.END', name: 'Détente and the end of the Cold War', theme: 'Paper 2 · Topic 12: The Cold War' },
  { id: 'HS', name: 'Historiography and essay skills', theme: 'Skills' },
  { id: 'CT', name: 'Command terms', theme: 'Skills' },
];

export const SUBJECTS: Subject[] = [
  { id: 'physics', name: 'Physics HL', short: 'Phys', color: 'var(--c-physics)', level: 'HL', lang: 'en', group: 4, topics: physicsTopics },
  { id: 'chemistry', name: 'Chemistry HL', short: 'Chem', color: 'var(--c-chemistry)', level: 'HL', lang: 'en', group: 4, topics: chemistryTopics },
  { id: 'math', name: 'Math AA HL', short: 'Math', color: 'var(--c-math)', level: 'HL', lang: 'en', group: 5, topics: mathTopics },
  { id: 'spanish', name: 'Spanish A Lang & Lit SL', short: 'Esp', color: 'var(--c-spanish)', level: 'SL', lang: 'es', group: 1, topics: spanishTopics },
  { id: 'english', name: 'English B HL', short: 'Eng', color: 'var(--c-english)', level: 'HL', lang: 'en', group: 2, topics: englishTopics },
  { id: 'history', name: 'History SL', short: 'Hist', color: 'var(--c-history)', level: 'SL', lang: 'en', group: 3, topics: historyTopics },
];

export { SUBJECT_IDS } from './subjectIds';

export function getSubject(id: SubjectId): Subject {
  const s = SUBJECTS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown subject ${id}`);
  return s;
}

export function getTopic(subject: SubjectId, topicId: string): Topic | undefined {
  return getSubject(subject).topics.find((t) => t.id === topicId);
}

export function topicLabel(subject: SubjectId, topicId: string): string {
  const t = getTopic(subject, topicId);
  if (!t) return topicId;
  // Topics whose id is not a syllabus number (e.g. "FIG", "TT", "SRC") show only their name.
  return /^[A-Z]?\d|^[A-Z]\.\d|^[SR]\d|^PS\d|^W\d/.test(topicId) ? `${topicLabelId(topicId)} ${t.name}` : t.name;
}

function topicLabelId(id: string): string {
  // "PS3.JP" → "PS3", "W11.WW1" → "T11", "W12.CR" → "T12"; syllabus codes unchanged.
  if (id.startsWith('PS')) return id.split('.')[0];
  if (/^W\d+\./.test(id)) return 'T' + id.slice(1).split('.')[0];
  return id;
}
