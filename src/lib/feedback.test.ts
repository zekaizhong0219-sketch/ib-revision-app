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
