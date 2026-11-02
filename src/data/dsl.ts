import type { Card, CardKind, EssayPrompt, NumericSpec, Question, StructuredPart, StructuredQuestion, SubjectId } from '../types';
import { SUBJECT_PREFIX as PREFIX } from './subjectIds';

/**
 * Compact text formats for authoring content. Write content inside String.raw`...`
 * template literals so LaTeX backslashes need no escaping.
 *
 * ── Flashcards ───────────────────────────────────────────────
 *   # A.1                      ← topic header (topic id from syllabus.ts)
 *   [f] Front text :: Back text
 *   // comment lines and blank lines are ignored
 *
 *   Kind tags: [d] definition  [f] formula  [u] unit  [c] command term
 *              [k] concept     [x] fact      [y] date/event  [p] person
 *              [r] literary/rhetorical device  [v] vocabulary  [s] text type  [q] quotation
 *              (no tag → concept)
 *   Use ¶ for a line break inside a card. Use $…$ for inline maths, $$…$$ for display maths,
 *   \ce{…} (inside $…$) for chemical equations, **…** for bold.
 *
 * ── Questions ────────────────────────────────────────────────
 *   @mc A.1                    ← multiple choice
 *   Q: prompt (may continue on following lines)
 *   O: option
 *   O*: correct option
 *   S: worked solution
 *
 *   @num A.1 value=12.5 rel=0.02 abs=0.1 unit=m s^-1   ← numeric (tolerance optional, default ±2 %)
 *   Q: … / S: …
 *
 *   @open A.1                  ← self-marked
 *   Q: … / A: model answer / S: optional notes
 *
 *   @text H.1 [strict]         ← typed short answer; accepted variants separated by |
 *   Q: … / A: Munich Agreement | Munich Pact / S: …
 *   (accents, capitals and a leading "the/el/la" are ignored unless "strict")
 *
 *   @order H.1                 ← list I: items in the CORRECT order; shown shuffled
 *   Q: … / I: first / I: second / … / S: …
 *
 *   @match S.1                 ← list P: left => right pairs, correctly matched; right side shuffled
 *   Q: … / P: metáfora => «tus ojos son luceros» / … / S: …
 *
 * ── Structured (multi-part, Paper 2-style) questions ─────────
 *   @struct A.2
 *   Q: stem / context (may continue on following lines)
 *   a) [2] Calculate the acceleration.
 *   = 2.5 rel=0.02 unit=m s^-2        ← optional: auto-mark this part numerically
 *   M: mark-scheme point ¶ another point
 *   b) [3] Explain why…
 *   M: …
 *   S: optional overall notes
 *
 * ── Essay prompts (timed writing, self-assessed with a rubric) ──
 *   @essay P2 rubric=hist-p2 minutes=45 min=0 max=0
 *   Q: prompt / S: planning guidance
 *
 * IDs are derived from subject + topic + a hash of the front / prompt text, so editing the
 * front of a card resets its progress, but adding or reordering cards never does.
 */

const KIND_TAGS: Record<string, CardKind> = {
  d: 'definition',
  f: 'formula',
  u: 'unit',
  c: 'command',
  k: 'concept',
  x: 'fact',
  y: 'date',
  p: 'person',
  r: 'device',
  v: 'vocab',
  s: 'texttype',
  q: 'quote',
};

/** FNV-1a 32-bit hash, base-36 encoded. Stable across platforms. */
export function hashString(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}


const normalise = (s: string) => s.replace(/\s*¶\s*/g, '\n').trim();

export function parseCards(subject: SubjectId, source: string): Card[] {
  const cards: Card[] = [];
  let topic: string | null = null;
  source.split('\n').forEach((rawLine, i) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('//')) return;
    const header = line.match(/^#\s*(\S+)/);
    if (header) {
      topic = header[1];
      return;
    }
    if (!topic) throw new Error(`[${subject}] line ${i + 1}: card before any # topic header`);
    const m = line.match(/^(?:\[([a-z])\]\s*)?(.+?)\s+::\s+(.+)$/);
    if (!m) throw new Error(`[${subject}] line ${i + 1}: expected "front :: back" — got: ${line}`);
    const [, tag, front, back] = m;
    const kind = tag ? KIND_TAGS[tag] : 'concept';
    if (!kind) throw new Error(`[${subject}] line ${i + 1}: unknown kind tag [${tag}]`);
    const f = normalise(front);
    cards.push({
      id: `${PREFIX[subject]}-${topic}-${hashString(f)}`,
      subject,
      topic,
      front: f,
      back: normalise(back),
      kind,
    });
  });
  return cards;
}

export function parseQuestions(subject: SubjectId, source: string): Question[] {
  const out: Question[] = [];
  type Draft = {
    type: 'mc' | 'num' | 'open' | 'text' | 'order' | 'match';
    topic: string;
    params: Record<string, string>;
    fields: { key: string; text: string }[];
    line: number;
  };
  let cur: Draft | null = null;

  const finish = (d: Draft | null) => {
    if (!d) return;
    const get = (k: string) => d.fields.filter((f) => f.key === k).map((f) => normalise(f.text));
    const prompt = get('Q')[0];
    const where = `[${subject}] question at line ${d.line}`;
    if (!prompt) throw new Error(`${where}: missing Q:`);
    const solution = get('S')[0] ?? '';
    const base = {
      id: `${PREFIX[subject]}-q-${d.topic}-${hashString(prompt)}`,
      subject,
      topic: d.topic,
      prompt,
      solution,
    };
    if (d.type === 'mc') {
      const opts = d.fields.filter((f) => f.key === 'O' || f.key === 'O*');
      const answer = opts.findIndex((o) => o.key === 'O*');
      if (opts.length < 2) throw new Error(`${where}: needs at least two O: options`);
      if (answer < 0 || opts.filter((o) => o.key === 'O*').length !== 1) {
        throw new Error(`${where}: exactly one option must be marked O*`);
      }
      out.push({ ...base, type: 'mc', options: opts.map((o) => normalise(o.text)), answer });
    } else if (d.type === 'num') {
      const value = Number(d.params.value);
      if (!Number.isFinite(value)) throw new Error(`${where}: invalid value=`);
      const numeric: { value: number; rel?: number; abs?: number; unit?: string } = { value };
      if (d.params.rel) numeric.rel = Number(d.params.rel);
      if (d.params.abs) numeric.abs = Number(d.params.abs);
      if (d.params.unit) numeric.unit = d.params.unit;
      out.push({ ...base, type: 'numeric', numeric });
    } else if (d.type === 'text') {
      const raw = get('A')[0];
      const answers = (raw ?? '').split('|').map((x) => x.trim()).filter(Boolean);
      if (!answers.length) throw new Error(`${where}: text question needs A: with at least one answer`);
      out.push({ ...base, type: 'text', answers, ...(d.params.strict !== undefined ? { strict: true } : {}) });
    } else if (d.type === 'order') {
      const items = get('I');
      if (items.length < 3) throw new Error(`${where}: order question needs at least three I: items`);
      if (new Set(items).size !== items.length) throw new Error(`${where}: order items must be distinct`);
      out.push({ ...base, type: 'order', items });
    } else if (d.type === 'match') {
      const pairs = get('P').map((x) => {
        const [l, r] = x.split(/\s+=>\s+/);
        if (!l || !r) throw new Error(`${where}: P: lines must look like "left => right"`);
        return [l.trim(), r.trim()] as [string, string];
      });
      if (pairs.length < 3) throw new Error(`${where}: match question needs at least three P: pairs`);
      if (new Set(pairs.map((p) => p[1])).size !== pairs.length) throw new Error(`${where}: right-hand items must be distinct`);
      out.push({ ...base, type: 'match', pairs });
    } else {
      const answer = get('A')[0];
      if (!answer) throw new Error(`${where}: open question needs A:`);
      out.push({ ...base, type: 'open', answer });
    }
  };

  source.split('\n').forEach((rawLine, i) => {
    const line = rawLine.trim();
    if (line.startsWith('//')) return;
    const head = line.match(/^@(mc|num|open|text|order|match)\s+(\S+)(.*)$/);
    if (head) {
      finish(cur);
      const params: Record<string, string> = {};
      // unit=… consumes the rest of the line so units can contain spaces.
      const rest = head[3];
      const unitIdx = rest.indexOf('unit=');
      const paramPart = unitIdx >= 0 ? rest.slice(0, unitIdx) : rest;
      if (unitIdx >= 0) params.unit = rest.slice(unitIdx + 5).trim();
      for (const p of paramPart.trim().split(/\s+/).filter(Boolean)) {
        const [k, v] = p.split('=');
        params[k] = v ?? '';
      }
      cur = { type: head[1] as Draft['type'], topic: head[2], params, fields: [], line: i + 1 };
      return;
    }
    if (!cur) {
      if (line) throw new Error(`[${subject}] line ${i + 1}: text outside a question block`);
      return;
    }
    const field = line.match(/^(Q|O\*|O|S|A|I|P):\s?(.*)$/);
    if (field) {
      cur.fields.push({ key: field[1], text: field[2] });
    } else if (cur.fields.length) {
      // continuation line (blank lines become paragraph breaks)
      const last = cur.fields[cur.fields.length - 1];
      last.text += line ? (last.text ? ' ¶ ' : '') + line : ' ¶ ';
    } else if (line) {
      throw new Error(`[${subject}] line ${i + 1}: expected Q:/O:/S:/A:/I:/P:`);
    }
  });
  finish(cur);
  return out;
}

/** Parses @essay blocks (see format notes at the top of this file). */
export function parseEssays(subject: SubjectId, source: string): EssayPrompt[] {
  const out: EssayPrompt[] = [];
  const blocks = source.split(/^@essay\s+/m).slice(1);
  if (source.trim() && !source.trim().startsWith('@essay') && !source.trim().startsWith('//')) {
    throw new Error(`[${subject}] essay source must start with @essay`);
  }
  for (const block of blocks) {
    const lines = block.split('\n');
    const [topic, ...paramTokens] = lines[0].trim().split(/\s+/);
    const params: Record<string, string> = {};
    for (const t of paramTokens) {
      const [k, v] = t.split('=');
      params[k] = v ?? '';
    }
    const fields: Record<string, string> = {};
    let key: string | null = null;
    for (const raw of lines.slice(1)) {
      const line = raw.trim();
      if (line.startsWith('//')) continue;
      const m = line.match(/^(Q|S):\s?(.*)$/);
      if (m) {
        key = m[1];
        fields[key] = m[2];
      } else if (key && line) fields[key] += ' ¶ ' + line;
    }
    const where = `[${subject}] essay ${topic}`;
    if (!fields.Q) throw new Error(`${where}: missing Q:`);
    if (!params.rubric) throw new Error(`${where}: missing rubric=`);
    const minutes = Number(params.minutes);
    if (!Number.isFinite(minutes) || minutes <= 0) throw new Error(`${where}: invalid minutes=`);
    const prompt = normalise(fields.Q);
    out.push({
      id: `${PREFIX[subject]}-e-${topic}-${hashString(prompt)}`,
      subject,
      topic,
      rubric: params.rubric,
      prompt,
      minutes,
      ...(Number(params.min) > 0 ? { minWords: Number(params.min) } : {}),
      ...(Number(params.max) > 0 ? { maxWords: Number(params.max) } : {}),
      guidance: normalise(fields.S ?? ''),
    });
  }
  return out;
}

function parseNumericSpec(raw: string, where: string): NumericSpec {
  const [valueTok, ...rest] = raw.trim().split(/\s+/);
  const value = Number(valueTok);
  if (!Number.isFinite(value)) throw new Error(`${where}: invalid numeric value "${valueTok}"`);
  const spec: NumericSpec = { value };
  const restStr = rest.join(' ');
  const unitIdx = restStr.indexOf('unit=');
  const paramPart = unitIdx >= 0 ? restStr.slice(0, unitIdx) : restStr;
  if (unitIdx >= 0) spec.unit = restStr.slice(unitIdx + 5).trim();
  for (const p of paramPart.split(/\s+/).filter(Boolean)) {
    const [k, v] = p.split('=');
    if (k === 'rel') spec.rel = Number(v);
    else if (k === 'abs') spec.abs = Number(v);
    else throw new Error(`${where}: unknown numeric parameter "${k}"`);
  }
  return spec;
}

/** Parses @struct blocks (see format notes at the top of this file). */
export function parseStructured(subject: SubjectId, source: string): StructuredQuestion[] {
  const out: StructuredQuestion[] = [];
  const blocks = source.split(/^@struct\s+/m).slice(1);
  for (const block of blocks) {
    const lines = block.split('\n');
    const topic = lines[0].trim();
    const where = `[${subject}] structured ${topic}`;
    let stem = '';
    let solution = '';
    const parts: StructuredPart[] = [];
    let key: 'Q' | 'S' | 'P' | 'M' | null = null;
    for (const raw of lines.slice(1)) {
      const line = raw.trim();
      if (line.startsWith('//')) continue;
      const part = line.match(/^([a-z](?:\([ivx]+\))?)\)\s*\[(\d+)\]\s*(.*)$/);
      const field = line.match(/^(Q|S|M):\s?(.*)$/);
      if (part) {
        parts.push({ label: part[1], marks: Number(part[2]), prompt: part[3], scheme: '' });
        key = 'P';
      } else if (line.startsWith('=')) {
        if (!parts.length) throw new Error(`${where}: numeric answer before any part`);
        parts[parts.length - 1].numeric = parseNumericSpec(line.slice(1), where);
      } else if (field) {
        key = field[1] as 'Q' | 'S' | 'M';
        if (key === 'Q') stem = field[2];
        else if (key === 'S') solution = field[2];
        else {
          if (!parts.length) throw new Error(`${where}: M: before any part`);
          parts[parts.length - 1].scheme = field[2];
        }
      } else if (line && key) {
        const add = (t: string) => (t ? `${t} ¶ ${line}` : line);
        if (key === 'Q') stem = add(stem);
        else if (key === 'S') solution = add(solution);
        else if (key === 'P') parts[parts.length - 1].prompt = add(parts[parts.length - 1].prompt);
        else parts[parts.length - 1].scheme = add(parts[parts.length - 1].scheme);
      }
    }
    if (!stem) throw new Error(`${where}: missing Q:`);
    if (parts.length < 2) throw new Error(`${where}: needs at least two parts`);
    for (const p of parts) {
      if (!p.scheme) throw new Error(`${where} (${p.label}): every part needs an M: mark scheme`);
      if (p.marks < 1) throw new Error(`${where} (${p.label}): marks must be ≥ 1`);
    }
    const prompt = normalise(stem);
    out.push({
      id: `${PREFIX[subject]}-s-${topic}-${hashString(prompt)}`,
      subject,
      topic,
      type: 'structured',
      prompt,
      solution: normalise(solution),
      parts: parts.map((p) => ({ ...p, prompt: normalise(p.prompt), scheme: normalise(p.scheme) })),
    });
  }
  return out;
}
