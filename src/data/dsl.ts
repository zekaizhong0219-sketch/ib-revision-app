import type { Card, CardKind, Question, SubjectId } from '../types';

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
 *              [k] concept     [x] fact      (no tag → concept)
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

const PREFIX: Record<SubjectId, string> = { physics: 'phy', chemistry: 'chem', math: 'math' };

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
    type: 'mc' | 'num' | 'open';
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
    } else {
      const answer = get('A')[0];
      if (!answer) throw new Error(`${where}: open question needs A:`);
      out.push({ ...base, type: 'open', answer });
    }
  };

  source.split('\n').forEach((rawLine, i) => {
    const line = rawLine.trim();
    if (line.startsWith('//')) return;
    const head = line.match(/^@(mc|num|open)\s+(\S+)(.*)$/);
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
        params[k] = v;
      }
      cur = { type: head[1] as Draft['type'], topic: head[2], params, fields: [], line: i + 1 };
      return;
    }
    if (!cur) {
      if (line) throw new Error(`[${subject}] line ${i + 1}: text outside a question block`);
      return;
    }
    const field = line.match(/^(Q|O\*|O|S|A):\s?(.*)$/);
    if (field) {
      cur.fields.push({ key: field[1], text: field[2] });
    } else if (cur.fields.length) {
      // continuation line (blank lines become paragraph breaks)
      const last = cur.fields[cur.fields.length - 1];
      last.text += line ? (last.text ? ' ¶ ' : '') + line : ' ¶ ';
    } else if (line) {
      throw new Error(`[${subject}] line ${i + 1}: expected Q:/O:/S:/A:`);
    }
  });
  finish(cur);
  return out;
}
