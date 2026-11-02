import { describe, expect, it } from 'vitest';
import katex from 'katex';
import 'katex/contrib/mhchem';
import { ALL_CARDS } from '../cards';
import { SUBJECTS } from '../syllabus';

function mathSegments(raw: string): string[] {
  const text = raw.replace(/\\\$/g, '');
  const out: string[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(m[1] ?? m[2]);
  return out;
}

describe('flashcard content', () => {
  it('has unique ids', () => {
    const ids = ALL_CARDS.map((c) => c.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it('only uses topics from the syllabus', () => {
    for (const c of ALL_CARDS) {
      const subj = SUBJECTS.find((s) => s.id === c.subject)!;
      expect(subj.topics.map((t) => t.id), c.id).toContain(c.topic);
    }
  });

  it('has balanced $ delimiters and valid KaTeX', () => {
    for (const c of ALL_CARDS) {
      for (const text of [c.front, c.back]) {
        const stripped = text.replace(/\\\$/g, '').replace(/\$\$[\s\S]+?\$\$/g, '');
        expect((stripped.match(/\$/g) ?? []).length % 2, `${c.id}: ${text}`).toBe(0);
        for (const seg of mathSegments(text)) {
          expect(() => katex.renderToString(seg, { throwOnError: true }), `${c.id}: ${seg}`).not.toThrow();
        }
      }
    }
  });

  it.each(SUBJECTS.map((s) => s.id))('%s has at least 150 cards', (id) => {
    expect(ALL_CARDS.filter((c) => c.subject === id).length).toBeGreaterThanOrEqual(150);
  });
});

import { ALL_QUESTIONS } from '../questions';

describe('practice questions', () => {
  it('have unique ids and valid topics', () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    for (const q of ALL_QUESTIONS) {
      const subj = SUBJECTS.find((s) => s.id === q.subject)!;
      expect(subj.topics.map((t) => t.id), q.id).toContain(q.topic);
    }
  });

  it('have valid KaTeX everywhere', () => {
    for (const q of ALL_QUESTIONS) {
      const texts = [q.prompt, q.solution];
      if (q.type === 'mc') texts.push(...q.options);
      if (q.type === 'open') texts.push(q.answer);
      if (q.type === 'text') texts.push(...q.answers);
      if (q.type === 'order') texts.push(...q.items);
      if (q.type === 'match') texts.push(...q.pairs.flat());
      if (q.type === 'structured') texts.push(...q.parts.flatMap((p) => [p.prompt, p.scheme]));
      for (const t of texts) {
        const stripped = t.replace(/\\\$/g, '').replace(/\$\$[\s\S]+?\$\$/g, '');
        expect((stripped.match(/\$/g) ?? []).length % 2, `${q.id}: unbalanced $ in ${t}`).toBe(0);
        for (const seg of mathSegments(t)) {
          expect(() => katex.renderToString(seg, { throwOnError: true }), `${q.id}: ${seg}`).not.toThrow();
        }
      }
    }
  });

  it.each(['physics', 'chemistry', 'math'])('%s has at least 12 structured questions with ≥ 5 marks each', (id) => {
    const qs = ALL_QUESTIONS.filter((q) => q.subject === id && q.type === 'structured');
    expect(qs.length).toBeGreaterThanOrEqual(12);
    for (const q of qs) if (q.type === 'structured') expect(q.parts.reduce((s, p) => s + p.marks, 0), q.id).toBeGreaterThanOrEqual(5);
  });

  it.each(SUBJECTS.map((s) => s.id))('%s has at least 40 questions', (id) => {
    expect(ALL_QUESTIONS.filter((q) => q.subject === id).length).toBeGreaterThanOrEqual(40);
  });
});

import { ALL_ESSAYS } from '../essays';
import { RUBRICS, getRubric, rubricMax } from '../rubrics';

describe('essay prompts and rubrics', () => {
  it('reference existing rubrics, topics and have unique ids', () => {
    const ids = ALL_ESSAYS.map((e) => e.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    for (const e of ALL_ESSAYS) {
      expect(getRubric(e.rubric), e.id).toBeDefined();
      const subj = SUBJECTS.find((s) => s.id === e.subject)!;
      expect(subj.topics.map((t) => t.id), e.id).toContain(e.topic);
      if (e.minWords && e.maxWords) expect(e.minWords).toBeLessThan(e.maxWords);
    }
  });
  it('rubric bands cover each criterion exactly once from 1 to max', () => {
    for (const r of RUBRICS) {
      for (const c of r.criteria) {
        const covered = c.bands.flatMap((b) => Array.from({ length: b.max - b.min + 1 }, (_, k) => b.min + k)).sort((a, b) => a - b);
        expect(covered, `${r.id} ${c.id}`).toEqual(Array.from({ length: c.max }, (_, k) => k + 1));
      }
    }
  });
  it('rubric totals match the IB papers', () => {
    expect(rubricMax(getRubric('esp-p1')!)).toBe(20);
    expect(rubricMax(getRubric('esp-p2')!)).toBe(30);
    expect(rubricMax(getRubric('engb-p1')!)).toBe(30);
    expect(rubricMax(getRubric('hist-p2')!)).toBe(15);
    expect(rubricMax(getRubric('hist-p1-q4')!)).toBe(9);
  });
});
