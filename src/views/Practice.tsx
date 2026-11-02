import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';
import { ALL_QUESTIONS } from '../data/questions';
import { topicLabel } from '../data/syllabus';
import { checkMC, checkNumeric, formatNumber, toleranceFor } from '../lib/answer';
import { shuffle } from '../lib/queue';
import { MathText } from '../components/MathText';
import { HBars } from '../components/Charts';
import { SubjectChips, SubjectDot, TopicPicker } from '../components/ui';
import { navigate, type Route } from '../router';
import { MatchAnswer, OrderAnswer, StructuredAnswer, TextAnswer } from './PracticeAnswers';
import type { Card, PracticeResult, Question, SubjectId } from '../types';

const DURATIONS = [5, 10, 15, 20, 30, 45];

const TYPE_LABEL: Record<Question['type'], string> = {
  mc: 'multiple choice',
  numeric: 'numeric',
  open: 'open',
  text: 'short answer',
  order: 'put in order',
  match: 'matching',
  structured: 'structured (Paper 2 style)',
};

/** Turns a flashcard into a self-marked recall question. */
function cardToQuestion(c: Card): Question {
  return { id: c.id, subject: c.subject, topic: c.topic, type: 'open', prompt: c.front, answer: c.back, solution: '' };
}

/** Real questions shuffled, with one flashcard recall prompt interleaved after every two questions. */
// eslint-disable-next-line react-refresh/only-export-components
export function buildPracticePool(questions: Question[], cards: Card[], includeCards: boolean, seed = Date.now()): Question[] {
  const qs = shuffle(questions, seed);
  if (!includeCards) return qs;
  const cs = shuffle(cards, seed + 1).map(cardToQuestion);
  const out: Question[] = [];
  let ci = 0;
  for (let i = 0; i < qs.length; i++) {
    out.push(qs[i]);
    if (i % 2 === 1 && ci < cs.length) out.push(cs[ci++]);
  }
  while (ci < cs.length && out.length < 400) out.push(cs[ci++]);
  return out;
}

interface Answered {
  q: Question;
  result: PracticeResult;
  response: string;
  sec: number;
  marks?: { got: number; max: number };
}

export default function Practice({ route }: { route: Route }) {
  const { data, cards, activeSubjectIds } = useStore();
  const p = route.params;
  const subjects = (p.get('subject')?.split(',').filter(Boolean) as SubjectId[] | undefined) ?? [activeSubjectIds[0] ?? 'physics'];
  const topics = p.get('topics')?.split(',').filter(Boolean) ?? [];
  const minutes = Number(p.get('min')) || 10;
  const includeCards = p.get('cards') !== '0';
  const [running, setRunning] = useState<{ pool: Question[]; endsAt: number; minutes: number } | null>(null);

  const inScope = useCallback(
    (x: { subject: SubjectId; topic: string }) => subjects.includes(x.subject) && (!topics.length || topics.includes(`${x.subject}|${x.topic}`)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.toString()],
  );
  const questions = useMemo(() => ALL_QUESTIONS.filter(inScope), [inScope]);
  const scopedCards = useMemo(() => cards.filter((c) => inScope(c) && !data.cards[c.id]?.suspended), [cards, inScope, data.cards]);

  const set = (patch: Record<string, string | string[] | undefined>) =>
    navigate('/practice', { subject: subjects, topics, min: String(minutes), cards: includeCards ? undefined : '0', ...patch });

  if (running) {
    return <Run pool={running.pool} endsAt={running.endsAt} minutes={running.minutes} onExit={() => setRunning(null)} />;
  }

  const poolSize = questions.length + (includeCards ? scopedCards.length : 0);
  return (
    <div>
      <h1>Timed practice</h1>
      <p className="muted">
        Short exam-style questions. Multiple choice, numeric (decimal comma and forms like <code>3.2e-5</code> or <code>3.2×10^-5</code> are accepted),
        short-answer, ordering and matching questions are marked automatically; open questions and flashcard prompts are self-marked against a model
        answer. For timed essays use <a href="#/writing">Writing</a>.
      </p>
      <a className="card spread" href="#/mock" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '1rem' }}>
        <div>
          <strong>Mock exam mode</strong>
          <div className="small muted">A full timed paper with no feedback until the end, self-marking against mark schemes and a grade estimate.</div>
        </div>
        <span className="btn small">Open</span>
      </a>
      <div className="card stack">
        <div>
          <h3>Subjects</h3>
          <SubjectChips value={subjects} onChange={(v) => set({ subject: v })} />
        </div>
        <div>
          <h3>Topics</h3>
          <TopicPicker subjects={subjects} value={topics} onChange={(v) => set({ topics: v })} />
        </div>
        <div>
          <h3>Duration</h3>
          <div className="row">
            {DURATIONS.map((d) => (
              <button key={d} className="chip" aria-pressed={minutes === d} onClick={() => set({ min: String(d) })}>
                {d} min
              </button>
            ))}
          </div>
        </div>
        <label className="row" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={includeCards} onChange={(e) => set({ cards: e.target.checked ? undefined : '0' })} />
          Mix in flashcard recall prompts (self-marked)
        </label>
        <div className="spread">
          <span className="muted small">
            {questions.length} questions{includeCards ? ` + ${scopedCards.length} recall prompts` : ''} in scope
          </span>
          <button
            className="btn primary"
            disabled={poolSize === 0}
            onClick={() => setRunning({ pool: buildPracticePool(questions, scopedCards, includeCards), endsAt: Date.now() + minutes * 60000, minutes })}
          >
            Start {minutes}-minute session
          </button>
        </div>
      </div>
      <p className="small muted kbd-hint" style={{ marginTop: '1rem' }}>
        Shortcuts: <kbd>1</kbd>–<kbd>4</kbd> choose option / self-mark · <kbd>Enter</kbd> check or next · <kbd>Esc</kbd> finish
      </p>
    </div>
  );
}

function Run({ pool, endsAt, minutes, onExit }: { pool: Question[]; endsAt: number; minutes: number; onExit: () => void }) {
  const { logPractice } = useStore();
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [current, setCurrent] = useState<Answered | null>(null);
  const [now, setNow] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());
  const q = pool[i % pool.length];
  const remaining = Math.max(0, endsAt - now);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (remaining === 0 && !finished) setFinished(true);
  }, [remaining, finished]);

  const record = useCallback(
    (result: PracticeResult, response: string, marks?: { got: number; max: number }) => {
      const sec = Math.round((Date.now() - startedAt.current) / 1000);
      const a: Answered = { q, result, response, sec, marks };
      setCurrent(a);
      setAnswered((xs) => [...xs, a]);
      logPractice([{ q: q.id, s: q.subject, tp: q.topic, r: result, t: Date.now(), sec, ...(marks ? { m: marks.got, mx: marks.max } : {}) }]);
    },
    [q, logPractice],
  );

  const next = useCallback(() => {
    setCurrent(null);
    setI((x) => x + 1);
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFinished(true);
        return;
      }
      if (current && e.key === 'Enter' && !finished) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, next, finished]);

  if (finished) return <Results answered={answered} minutes={minutes} onExit={onExit} />;

  const t = Math.ceil(remaining / 1000);
  const mm = Math.floor(t / 60);
  const ss = String(t % 60).padStart(2, '0');
  const correct = answered.filter((a) => a.result === 'correct').length;

  return (
    <div>
      <div className="spread" style={{ marginBottom: '0.75rem' }}>
        <span className={`timer ${t < 60 ? 'low' : ''}`} aria-live="off">
          ⏱ {mm}:{ss}
        </span>
        <span className="small muted">
          Q{i + 1} · {correct}/{answered.length} correct
        </span>
        <button className="btn small" onClick={() => setFinished(true)}>
          Finish
        </button>
      </div>
      <div className="card">
        <div className="row small muted" style={{ marginBottom: '0.6rem' }}>
          <SubjectDot subject={q.subject} /> {topicLabel(q.subject, q.topic)}
          <span className="badge">{TYPE_LABEL[q.type] ?? q.type}{q.type === 'open' && !q.id.includes('-q-') ? ' (flashcard)' : ''}</span>
        </div>
        <MathText text={q.prompt} />
        <div style={{ marginTop: '1rem' }}>
          {q.type === 'mc' && <MCAnswer key={i} q={q} done={current} onAnswer={record} />}
          {q.type === 'numeric' && <NumericAnswer key={i} q={q} done={current} onAnswer={record} />}
          {q.type === 'open' && <OpenAnswer key={i} q={q} done={current} onAnswer={record} />}
          {q.type === 'text' && <TextAnswer key={i} q={q} done={current} onAnswer={record} />}
          {q.type === 'order' && <OrderAnswer key={i} q={q} done={current} onAnswer={record} />}
          {q.type === 'match' && <MatchAnswer key={i} q={q} done={current} onAnswer={record} />}
          {q.type === 'structured' && <StructuredAnswer key={i} q={q} done={current} onAnswer={record} />}
        </div>
        {current && q.solution && (
          <div className="feedback info">
            <strong className="small">Solution</strong>
            <MathText text={q.solution} />
          </div>
        )}
        {current && (
          <button className="btn primary" style={{ marginTop: '1rem' }} onClick={next} autoFocus>
            Next <kbd className="kbd-hint">Enter</kbd>
          </button>
        )}
      </div>
    </div>
  );
}

type AnswerProps<T extends Question['type']> = {
  q: Extract<Question, { type: T }>;
  done: Answered | null;
  onAnswer: (r: PracticeResult, response: string) => void;
};

function MCAnswer({ q, done, onAnswer }: AnswerProps<'mc'>) {
  const [sel, setSel] = useState<number | null>(null);
  const choose = useCallback(
    (k: number) => {
      if (done) return;
      setSel(k);
      onAnswer(checkMC(k, q.answer) ? 'correct' : 'incorrect', String.fromCharCode(65 + k));
    },
    [done, onAnswer, q.answer],
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const n = '1234'.indexOf(e.key) >= 0 ? Number(e.key) - 1 : 'abcd'.indexOf(e.key.toLowerCase());
      if (n >= 0 && n < q.options.length) choose(n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, q.options.length]);
  return (
    <div className="options">
      {q.options.map((o, k) => {
        const cls = done ? (k === q.answer ? 'correct' : k === sel ? 'wrong' : '') : '';
        return (
          <button key={k} className={`option ${cls}`} disabled={!!done} onClick={() => choose(k)}>
            <span className="letter">{String.fromCharCode(65 + k)}</span>
            <MathText as="span" text={o} />
          </button>
        );
      })}
      {done && (
        <div className={`feedback ${done.result === 'correct' ? 'ok' : 'no'}`}>
          {done.result === 'correct' ? 'Correct ✓' : `Incorrect — the answer is ${String.fromCharCode(65 + q.answer)}.`}
        </div>
      )}
    </div>
  );
}

function NumericAnswer({ q, done, onAnswer }: AnswerProps<'numeric'>) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (done) return;
    const r = checkNumeric(value, q.numeric);
    if (r.parsed === null) {
      setError('Could not read that number — try e.g. 0.25, 3,2 or 6.6e-34.');
      return;
    }
    onAnswer(r.ok ? 'correct' : 'incorrect', value);
  };
  const tol = toleranceFor(q.numeric);
  const tolText = q.numeric.abs !== undefined && q.numeric.rel === undefined ? `± ${formatNumber(tol)}` : `± ${Math.round((q.numeric.rel ?? 0.02) * 1000) / 10} %`;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="row" style={{ flexWrap: 'nowrap' }}>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          aria-label="Your answer"
          value={value}
          disabled={!!done}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          autoFocus
          placeholder="Your answer"
        />
        {q.numeric.unit && <span className="muted" style={{ whiteSpace: 'nowrap' }}>{q.numeric.unit}</span>}
        {!done && (
          <button className="btn primary" type="submit">
            Check
          </button>
        )}
      </div>
      {error && <p className="small" style={{ color: 'var(--bad)', marginTop: 6 }}>{error}</p>}
      {done && (
        <div className={`feedback ${done.result === 'correct' ? 'ok' : 'no'}`}>
          {done.result === 'correct' ? 'Correct ✓ ' : 'Not quite. '}
          Accepted answer: <strong>{formatNumber(q.numeric.value)}</strong> {q.numeric.unit} <span className="small muted">({tolText})</span>
        </div>
      )}
    </form>
  );
}

function OpenAnswer({ q, done, onAnswer }: AnswerProps<'open'>) {
  const [shown, setShown] = useState(false);
  const [notes, setNotes] = useState('');
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if (!shown && (e.key === ' ' || (e.key === 'Enter' && !done))) {
        e.preventDefault();
        setShown(true);
        return;
      }
      if (!shown || done) return;
      const map: Record<string, PracticeResult> = { '1': 'incorrect', '2': 'partial', '3': 'correct' };
      if (map[e.key]) onAnswer(map[e.key], notes);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shown, done, notes, onAnswer]);
  return (
    <div>
      {!shown && (
        <>
          <textarea placeholder="Optional: write or outline your answer first, then reveal the model answer." value={notes} onChange={(e) => setNotes(e.target.value)} aria-label="Your answer (optional)" />
          <button className="btn primary" style={{ marginTop: '0.5rem' }} onClick={() => setShown(true)}>
            Show model answer
          </button>
        </>
      )}
      {shown && (
        <>
          <div className="feedback info">
            <strong className="small">Model answer</strong>
            <MathText text={q.answer} />
          </div>
          {!done ? (
            <div className="grade-bar" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <button className="btn grade-again" onClick={() => onAnswer('incorrect', notes)}>
                Missed <small>1</small>
              </button>
              <button className="btn grade-hard" onClick={() => onAnswer('partial', notes)}>
                Partly <small>2</small>
              </button>
              <button className="btn grade-good" onClick={() => onAnswer('correct', notes)}>
                Got it <small>3</small>
              </button>
            </div>
          ) : (
            <p className="small muted" style={{ marginTop: '0.5rem' }}>
              Self-marked: {done.result}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Results({ answered, minutes, onExit }: { answered: Answered[]; minutes: number; onExit: () => void }) {
  const score = answered.reduce((s, a) => s + (a.result === 'correct' ? 1 : a.result === 'partial' ? 0.5 : 0), 0);
  const byTopic = new Map<string, { name: string; s: number; n: number }>();
  for (const a of answered) {
    const k = `${a.q.subject}|${a.q.topic}`;
    const v = byTopic.get(k) ?? { name: topicLabel(a.q.subject, a.q.topic), s: 0, n: 0 };
    v.s += a.result === 'correct' ? 1 : a.result === 'partial' ? 0.5 : 0;
    v.n++;
    byTopic.set(k, v);
  }
  const missed = answered.filter((a) => a.result !== 'correct');
  return (
    <div>
      <h1>Session results</h1>
      <div className="tiles">
        <div className="tile">
          <div className="label">Score</div>
          <div className="value">{answered.length ? Math.round((score / answered.length) * 100) : 0}%</div>
          <div className="sub">
            {score} / {answered.length}
          </div>
        </div>
        <div className="tile">
          <div className="label">Answered</div>
          <div className="value">{answered.length}</div>
          <div className="sub">in {minutes} min session</div>
        </div>
        <div className="tile">
          <div className="label">Avg time</div>
          <div className="value">{answered.length ? Math.round(answered.reduce((s, a) => s + a.sec, 0) / answered.length) : 0}s</div>
          <div className="sub">per question</div>
        </div>
      </div>
      <section className="card" style={{ marginTop: '1rem' }}>
        <h2>By topic</h2>
        <HBars items={[...byTopic.entries()].map(([k, v]) => ({ key: k, name: `${v.name} (${v.n})`, value: v.s / v.n }))} emptyText="No questions answered." />
      </section>
      {missed.length > 0 && (
        <section className="card">
          <h2>Review these</h2>
          <div className="list">
            {missed.map((a, k) => (
              <div className="list-item" key={k}>
                <div className="meta small muted">
                  <SubjectDot subject={a.q.subject} /> {topicLabel(a.q.subject, a.q.topic)} <span className="badge bad">{a.result}</span>
                </div>
                <MathText text={a.q.prompt} />
                <details>
                  <summary className="small">Answer</summary>
                  {a.q.type === 'mc' && <MathText text={`**${String.fromCharCode(65 + a.q.answer)}.** ${a.q.options[a.q.answer]}`} />}
                  {a.q.type === 'numeric' && (
                    <p>
                      {formatNumber(a.q.numeric.value)} {a.q.numeric.unit} — you wrote “{a.response}”
                    </p>
                  )}
                  {a.q.type === 'open' && <MathText text={a.q.answer} />}
                  {a.q.type === 'text' && <p>{a.q.answers.join(' / ')} — you wrote “{a.response}”</p>}
                  {a.q.type === 'order' && <MathText text={a.q.items.map((x, k) => `${k + 1}. ${x}`).join('\n')} />}
                  {a.q.type === 'match' && <MathText text={a.q.pairs.map(([l, r]) => `${l} → ${r}`).join('\n')} />}
                  {a.q.type === 'structured' && (
                    <MathText text={a.q.parts.map((pt) => `**(${pt.label}) [${pt.marks}]** ${pt.scheme}`).join('\n')} />
                  )}
                  {a.q.solution && <MathText className="small muted" text={a.q.solution} />}
                </details>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="row" style={{ marginTop: '1rem' }}>
        <button className="btn primary" onClick={onExit} autoFocus>
          New session
        </button>
        <a className="btn" href="#/">
          Dashboard
        </a>
      </div>
    </div>
  );
}
