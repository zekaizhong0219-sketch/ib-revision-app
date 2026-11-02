import type { EssayAttempt, EssayPrompt } from '../types';
import type { Rubric } from '../data/rubrics';

/**
 * Builds a self-contained Markdown request for external feedback (Claude, another AI tool or a
 * teacher) on a timed-writing attempt: the task, the paraphrased criteria with their bands, the
 * answer and the student's own marks. Spanish A tasks get the request in Spanish.
 */
export function buildFeedbackPrompt(prompt: EssayPrompt, attempt: EssayAttempt, rubric: Rubric): string {
  const es = prompt.subject === 'spanish';
  const max = rubric.criteria.reduce((s, c) => s + c.max, 0);
  const words =
    prompt.minWords || prompt.maxWords
      ? es
        ? ` (extensión recomendada: ${prompt.minWords ?? 0}–${prompt.maxWords ?? '∞'} palabras)`
        : ` (required length: ${prompt.minWords ?? 0}–${prompt.maxWords ?? '∞'} words)`
      : '';
  const criteria = rubric.criteria
    .map((c) => {
      const bands = c.bands.map((b) => `  - ${b.min === b.max ? b.min : `${b.min}–${b.max}`}: ${b.text}`).join('\n');
      return `### ${c.name} (/${c.max})\n${c.focus}\n${bands}`;
    })
    .join('\n\n');
  const self = attempt.done
    ? rubric.criteria.map((c) => `- ${c.name}: ${attempt.scores[c.id] ?? '–'}/${c.max}`).join('\n')
    : es
      ? '- (todavía no me he autoevaluado)'
      : '- (not self-assessed yet)';
  const minutes = Math.max(1, Math.round(attempt.sec / 60));

  if (es) {
    return [
      `# Solicitud de corrección: ${rubric.name}`,
      '',
      'Actúa como examinador experimentado del IB. Corrige mi respuesta con los criterios de abajo (son paráfrasis, no el texto oficial). Sé exigente: no infles la nota y justifica cada puntuación con citas breves de mi texto.',
      '',
      `## Tarea${words}`,
      prompt.prompt,
      '',
      `## Criterios (total /${max})`,
      criteria,
      '',
      '## Mi autoevaluación',
      self,
      '',
      `## Mi respuesta (${attempt.words} palabras, ${minutes} min de ${prompt.minutes})`,
      attempt.text.trim() || '(vacía)',
      '',
      '## Qué necesito',
      '1. Una nota por criterio, con la banda elegida y una justificación con citas.',
      '2. La diferencia entre tu nota y mi autoevaluación, y por qué.',
      '3. Las tres mejoras con más impacto en la nota, en orden de prioridad.',
      '4. Uno de mis párrafos reescrito al nivel de la banda superior, explicando los cambios.',
      'Escribe en español de España, con registro académico.',
    ].join('\n');
  }
  return [
    `# Feedback request: ${rubric.name}`,
    '',
    'Act as an experienced IB examiner. Mark my answer against the criteria below (they are paraphrases, not the official wording). Be strict: do not inflate the mark, and justify each score with short quotations from my text.',
    '',
    `## Task${words}`,
    prompt.prompt,
    '',
    `## Criteria (total /${max})`,
    criteria,
    '',
    '## My self-assessment',
    self,
    '',
    `## My answer (${attempt.words} words, ${minutes} min of ${prompt.minutes})`,
    attempt.text.trim() || '(empty)',
    '',
    '## What I need',
    '1. A mark for each criterion, with the band chosen and a justification quoting my text.',
    '2. The difference between your marks and my self-assessment, and why.',
    '3. The three changes that would raise the mark most, in priority order.',
    '4. One of my paragraphs rewritten at the level of the top band, with the changes explained.',
  ].join('\n');
}
