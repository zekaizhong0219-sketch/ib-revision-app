import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import katex from 'katex';
import 'katex/contrib/mhchem';
import { ALL_CARDS } from '../cards';
import { SUBJECTS } from '../syllabus';
import { toHtml } from '../../lib/markup';

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
      if (q.type === 'structured') texts.push(...q.parts.flatMap((p) => [p.prompt, p.scheme, ...(p.accept ?? [])]));
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
    expect(rubricMax(getRubric('esp-p2')!)).toBe(25); // from May 2026: A, B1, B2, C, D × 5
    expect(rubricMax(getRubric('engb-p1')!)).toBe(30);
    expect(rubricMax(getRubric('hist-p2')!)).toBe(15);
    expect(rubricMax(getRubric('hist-p1-q4')!)).toBe(9);
  });
});

import { EXEMPLARS } from '../exemplars';
import { countWords } from '../../lib/answer';

describe('exemplars', () => {
  it('each matches one prompt and scores every rubric criterion within range', () => {
    expect(EXEMPLARS.length).toBeGreaterThanOrEqual(6);
    for (const ex of EXEMPLARS) {
      const prompt = ALL_ESSAYS.find((e) => e.id === ex.promptId)!;
      const r = getRubric(prompt.rubric)!;
      expect(Object.keys(ex.scores).sort(), ex.title).toEqual(r.criteria.map((c) => c.id).sort());
      for (const c of r.criteria) {
        expect(ex.scores[c.id], `${ex.title} ${c.id}`).toBeGreaterThanOrEqual(0);
        expect(ex.scores[c.id], `${ex.title} ${c.id}`).toBeLessThanOrEqual(c.max);
        expect(ex.notes[c.id], `${ex.title} note ${c.id}`).toBeTruthy();
      }
      if (prompt.minWords && prompt.maxWords) {
        const w = countWords(ex.text.replace(/\*\*/g, ''));
        expect(w, `${ex.title} words`).toBeGreaterThanOrEqual(prompt.minWords);
        expect(w, `${ex.title} words`).toBeLessThanOrEqual(prompt.maxWords);
      }
    }
  });
  it('Spanish exemplars follow the house style (no em dash)', () => {
    for (const ex of EXEMPLARS.filter((e) => e.promptId.startsWith('esp-'))) expect(ex.text.includes('—'), ex.title).toBe(false);
  });
});

import { LISTENING } from '../listening';

describe('listening items', () => {
  it('have scripts, unique ids and valid questions referencing English topics', () => {
    expect(LISTENING.length).toBeGreaterThanOrEqual(4);
    expect(new Set(LISTENING.map((l) => l.id)).size).toBe(LISTENING.length);
    for (const l of LISTENING) {
      expect(l.script.length).toBeGreaterThan(3);
      for (const line of l.script) expect(l.speakers[line.speaker], `${l.title}: speaker ${line.speaker}`).toBeTruthy();
      expect(l.question.parts.length).toBeGreaterThanOrEqual(6);
      expect(SUBJECTS.find((s) => s.id === 'english')!.topics.map((t) => t.id)).toContain(l.theme);
    }
  });
  it('every auto-marked numeric answer appears in the script (as digits or words)', () => {
    const words: Record<number, string> = { 2: 'two', 3: 'three', 4: 'four', 5: 'five', 7: 'seven', 9: 'nine', 32: 'thirty-two', 2000: 'two thousand' };
    for (const l of LISTENING) {
      // Thousands separators are ignored ("4,500" counts as 4500).
      const text = l.script.map((s) => s.text).join(' ').toLowerCase().replace(/(\d),(\d{3})/g, '$1$2');
      for (const p of l.question.parts) {
        if (!p.numeric) continue;
        const v = p.numeric.value;
        expect(new RegExp(`(^|[^\\d])${v}([^\\d]|$)`).test(text) || (words[v] !== undefined && text.includes(words[v])), `${l.title} (${p.label}) ${v}`).toBe(true);
      }
    }
  });
});

describe('exam-style formats (Paper 1B, Paper 3)', () => {
  const styled = ALL_QUESTIONS.filter((q) => q.type === 'structured' && q.style);
  it('has data-based questions for both sciences and Paper 3 investigations for math only', () => {
    const count = (s: string, st: string) => styled.filter((q) => q.subject === s && q.type === 'structured' && q.style === st).length;
    expect(count('physics', 'P1B')).toBeGreaterThanOrEqual(4);
    expect(count('chemistry', 'P1B')).toBeGreaterThanOrEqual(4);
    expect(count('math', 'P3')).toBeGreaterThanOrEqual(5);
    expect(styled.every((q) => (q.subject === 'math') === (q.type === 'structured' && q.style === 'P3'))).toBe(true);
  });
  it('gives every data-based question a rendered data table', () => {
    for (const q of styled.filter((x) => x.type === 'structured' && x.style === 'P1B')) {
      expect(toHtml(q.prompt), q.id).toMatch(/<table class="data"><thead>/);
    }
  });
  it('makes Paper 3 investigations long, multi-step and partly auto-marked', () => {
    for (const q of styled.filter((x) => x.type === 'structured' && x.style === 'P3')) {
      if (q.type !== 'structured') continue;
      const marks = q.parts.reduce((s, p) => s + p.marks, 0);
      expect(marks, q.id).toBeGreaterThanOrEqual(18);
      expect(q.parts.length, q.id).toBeGreaterThanOrEqual(6);
      expect(q.parts.filter((p) => p.numeric).length, q.id).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('built-in History Paper 1 sets (real sources)', () => {
  it('has complete sets on both case studies with the standard question structure', async () => {
    const { BUILTIN_SOURCE_SETS } = await import('../paper1Sets');
    expect(BUILTIN_SOURCE_SETS.length).toBeGreaterThanOrEqual(12);
    expect(BUILTIN_SOURCE_SETS.some((x) => x.sources.some((y) => y.image))).toBe(true);
    expect(new Set(BUILTIN_SOURCE_SETS.map((s) => s.topic))).toEqual(new Set(['PS3.JP', 'PS3.EU']));
    expect(new Set(BUILTIN_SOURCE_SETS.map((s) => s.id)).size).toBe(BUILTIN_SOURCE_SETS.length);
    for (const set of BUILTIN_SOURCE_SETS) {
      expect(set.id).toMatch(/^p1b-[a-z0-9-]+$/);
      expect(set.questions.map((q) => [q.label, q.marks])).toEqual([['1a', 3], ['1b', 2], ['2', 4], ['3', 6], ['4', 9]]);
      for (const q of set.questions) expect(q.scheme?.length, `${set.id} ${q.label}`).toBeGreaterThanOrEqual(2);
      expect(set.sources).toHaveLength(4);
      for (const src of set.sources) {
        expect(src.origin.length).toBeGreaterThan(40);
        if (src.image) {
          // Visual sources: a shipped image with a credit and a text description.
          expect(src.url).toMatch(/^https:\/\/www\.loc\.gov\/pictures\/item\/\d+\/$/);
          expect(existsSync(`public/${src.image.src}`), src.image.src).toBe(true);
          expect(src.image.credit).toMatch(/no known restrictions/i);
          expect(src.text.length).toBeGreaterThan(60);
          continue;
        }
        expect(src.url).toMatch(/^https:\/\/(history\.state\.gov|avalon\.law\.yale\.edu|api\.parliament\.uk)\//);
        const words = src.text.split(/\s+/).length;
        expect(words, src.url).toBeGreaterThanOrEqual(60);
        expect(words, src.url).toBeLessThanOrEqual(300);
        // No stray Hansard column numbers (e.g. "four Powers 50 at Munich").
        if (src.url?.includes('parliament.uk')) expect(src.text).not.toMatch(/[A-Za-z,] \d{2,4} [a-z]/);
      }
      // Hansard extracts carry the Open Parliament Licence attribution.
      for (const src of set.sources.filter((x) => x.url?.includes('parliament.uk'))) expect(src.origin).toContain('Open Parliament Licence');
    }
  });
  it('refers to sources that exist (A–D) in every question', async () => {
    const { BUILTIN_SOURCE_SETS } = await import('../paper1Sets');
    for (const set of BUILTIN_SOURCE_SETS) {
      for (const q of set.questions) {
        const letters = [...q.prompt.matchAll(/Sources? ([A-D])(?: and ([A-D]))?/g)].flatMap((m) => [m[1], m[2]]).filter(Boolean);
        if (q.label !== '4') expect(letters.length, `${set.id} ${q.label}`).toBeGreaterThan(0);
      }
    }
  });
});

describe('Cold War source-quote cards', () => {
  it('quotes every generated Cold War excerpt verbatim, with origin and usage notes', async () => {
    const { COLD_WAR_QUOTES } = await import('../paper1Sources.generated');
    const quoteCards = ALL_CARDS.filter((c) => c.kind === 'quote' && c.front.startsWith('**Source quote**') && c.topic.startsWith('W12'));
    expect(quoteCards.length).toBeGreaterThanOrEqual(15);
    expect(new Set(quoteCards.map((c) => c.topic))).toEqual(new Set(['W12.RMA', 'W12.CR', 'W12.END']));
    for (const [key, q] of Object.entries(COLD_WAR_QUOTES)) {
      expect(quoteCards.some((c) => c.back.includes(q.text)), key).toBe(true);
      expect(q.url).toMatch(/^https:\/\/(history\.state\.gov|avalon\.law\.yale\.edu|www\.presidency\.ucsb\.edu|en\.wikisource\.org)\//);
      expect(q.text.split(/\s+/).length, key).toBeLessThanOrEqual(100);
    }
    for (const c of quoteCards) expect(c.back).toMatch(/\*\*Use it:\*\* .{40,}/);
  });
});

describe('authentic listening (VOA)', () => {
  it('uses real VOA recordings with full transcripts and credits', () => {
    const real = LISTENING.filter((l) => l.audio);
    expect(real.length).toBeGreaterThanOrEqual(4);
    expect(new Set(real.map((l) => l.theme)).size).toBeGreaterThanOrEqual(4);
    for (const l of real) {
      expect(l.audio!.url).toMatch(/^https:\/\/voa-audio\.voanews\.eu\/.+\.mp3$/);
      expect(l.audio!.source).toMatch(/^https:\/\/learningenglish\.voanews\.com\//);
      expect(l.audio!.credit).toMatch(/wrote|reported|adapted/);
      const words = l.script.map((s) => s.text).join(' ');
      expect(words.split(/\s+/).length).toBeGreaterThan(250);
      expect(words).not.toMatch(/Associated Press|Reuters|\bAFP\b/);
    }
  });
});

describe('Topic 11 evidence and historiography cards', () => {
  it('quotes every Topic 11 excerpt verbatim on a card for each war', async () => {
    const { TOPIC11_QUOTES } = await import('../paper1Sources.generated');
    const cards = ALL_CARDS.filter((c) => c.kind === 'quote' && c.topic.startsWith('W11'));
    for (const [key, q] of Object.entries(TOPIC11_QUOTES)) expect(cards.some((c) => c.back.includes(q.text)), key).toBe(true);
    expect(new Set(cards.map((c) => c.topic))).toEqual(new Set(['W11.WW1', 'W11.WW2', 'W11.SCW', 'W11.RJW', 'W11.CCW']));
  });
  it('has historiography cards for every Topic 11 war studied and the Cold War', () => {
    const h = ALL_CARDS.filter((c) => c.front.startsWith('Historiography'));
    expect(h.length).toBeGreaterThanOrEqual(20);
    for (const t of ['W11.WW1', 'W11.WW2', 'W11.SCW', 'W11.CCW', 'W12.RMA']) expect(h.some((c) => c.topic === t), t).toBe(true);
  });
});
