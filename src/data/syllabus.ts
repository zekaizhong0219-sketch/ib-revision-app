import type { Subject, SubjectId, Topic } from '../types';

/**
 * Topic structure follows the current IB guides:
 *  - Physics: first assessment 2025 (themes A–E)
 *  - Chemistry: first assessment 2025 (Structure 1–3, Reactivity 1–3)
 *  - Mathematics: Analysis & Approaches, first assessment 2021 (topics 1–5)
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

export const SUBJECTS: Subject[] = [
  { id: 'physics', name: 'Physics HL', short: 'Phys', color: 'var(--c-physics)', topics: physicsTopics },
  { id: 'chemistry', name: 'Chemistry HL', short: 'Chem', color: 'var(--c-chemistry)', topics: chemistryTopics },
  { id: 'math', name: 'Math AA HL', short: 'Math', color: 'var(--c-math)', topics: mathTopics },
];

export const SUBJECT_IDS: SubjectId[] = SUBJECTS.map((s) => s.id);

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
  return topicId === 'CT' ? t.name : `${t.id} ${t.name}`;
}
