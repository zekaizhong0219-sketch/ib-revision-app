import { describe, expect, it } from 'vitest';
import katex from 'katex';
import 'katex/contrib/mhchem';
import { ALL_CARDS } from '../cards';
import { SUBJECTS } from '../syllabus';

function mathSegments(text: string): string[] {
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
        const stripped = text.replace(/\$\$[\s\S]+?\$\$/g, '');
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
