import { describe, expect, it } from 'vitest';
import { buildFeedbackPrompt } from './feedback';
import { ALL_ESSAYS } from '../data/essays';
import { getRubric } from '../data/rubrics';
import type { EssayAttempt, EssayPrompt } from '../types';

const attemptFor = (p: EssayPrompt, done: boolean): EssayAttempt => ({
  id: 'e1',
  prompt: p.id,
  subject: p.subject,
  topic: p.topic,
  rubric: p.rubric,
  t: 0,
  sec: 1500,
  words: 3,
  text: 'My essay text.',
  scores: done ? Object.fromEntries(getRubric(p.rubric)!.criteria.map((c) => [c.id, 1])) : {},
  done,
});

describe('buildFeedbackPrompt', () => {
  it('includes the task, every criterion with its bands, the answer and the self-marks', () => {
    const p = ALL_ESSAYS.find((e) => e.subject === 'english')!;
    const r = getRubric(p.rubric)!;
    const text = buildFeedbackPrompt(p, attemptFor(p, true), r);
    expect(text).toContain(p.prompt);
    expect(text).toContain('My essay text.');
    expect(text).toContain('25 min of');
    for (const c of r.criteria) {
      expect(text).toContain(`### ${c.name} (/${c.max})`);
      expect(text).toContain(`- ${c.name}: 1/${c.max}`);
      for (const b of c.bands) expect(text).toContain(b.text);
    }
    expect(text).toMatch(/Be strict/);
  });
  it('writes the request in Spanish for Spanish A and notes a missing self-assessment', () => {
    const p = ALL_ESSAYS.find((e) => e.subject === 'spanish')!;
    const text = buildFeedbackPrompt(p, attemptFor(p, false), getRubric(p.rubric)!);
    expect(text).toMatch(/^# Solicitud de corrección/);
    expect(text).toContain('todavía no me he autoevaluado');
    expect(text).not.toContain('—');
  });
});

describe('Paper 1 workshop', () => {
  it('builds the five standard questions (24 marks) around the focus', async () => {
    const { paper1Questions, PAPER1_GUIDE } = await import('../data/paper1');
    const qs = paper1Questions('the causes of the Manchurian crisis');
    expect(qs.map((q) => q.label)).toEqual(['1a', '1b', '2', '3', '4']);
    expect(qs.reduce((s, q) => s + q.marks, 0)).toBe(24);
    expect(qs.filter((q) => q.prompt.includes('the causes of the Manchurian crisis'))).toHaveLength(4);
    for (const q of qs) expect(PAPER1_GUIDE[q.label]).toBeDefined();
  });
  it('puts sources, questions, answers and self-marks in the feedback request', async () => {
    const { buildSourceFeedbackPrompt } = await import('./feedback');
    const { paper1Questions, PAPER1_GUIDE } = await import('../data/paper1');
    const set = {
      id: 'p1',
      title: 'Test set',
      topic: 'PS3.JP',
      t: 0,
      sources: [{ origin: 'Origin A', text: 'Text of A' }, { origin: '', text: 'Cartoon B' }],
      questions: paper1Questions('x'),
      attempts: [],
    };
    const text = buildSourceFeedbackPrompt(set, { t: 0, sec: 3000, answers: ['ans 1a'], scores: [2, 1, 3, 4, 6] }, PAPER1_GUIDE, ['7–9: top band']);
    expect(text).toContain('### Source A\n*Origin A*\n\nText of A');
    expect(text).toContain('*(origin not given)*');
    expect(text).toContain('My mark: 2/3');
    expect(text).toContain('ans 1a');
    expect(text).toContain('(no answer)');
    expect(text).toContain('7–9: top band');
    expect(text).toContain('total /24, 50 min used');
  });
});
