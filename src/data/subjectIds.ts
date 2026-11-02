import type { SubjectId } from '../types';

/**
 * Dependency-free list of subject ids (used by storage and the content parser).
 * The full subject definitions live in syllabus.ts.
 */
export const SUBJECT_IDS: SubjectId[] = ['physics', 'chemistry', 'math', 'spanish', 'english', 'history'];

/** Prefix used in generated card / question ids. Never change these — ids must stay stable. */
export const SUBJECT_PREFIX: Record<SubjectId, string> = {
  physics: 'phy',
  chemistry: 'chem',
  math: 'math',
  spanish: 'esp',
  english: 'engb',
  history: 'hist',
};

export function isSubjectId(v: unknown): v is SubjectId {
  return SUBJECT_IDS.includes(v as SubjectId);
}
