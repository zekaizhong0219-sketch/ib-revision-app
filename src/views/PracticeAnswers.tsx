import { useMemo, useState } from 'react';
import { checkNumeric, checkText, formatNumber, resultFromMarks, resultFromScore, scoreMatch, scoreOrder } from '../lib/answer';
import { shuffle } from '../lib/queue';
import { MathText } from '../components/MathText';
import type { MatchQuestion, OrderQuestion, PracticeResult, StructuredPart, StructuredQuestion, TextQuestion } from '../types';

interface Props<Q> {
  q: Q;
  /** Result once answered, null before. */
  done: { result: PracticeResult } | null;
  onAnswer: (r: PracticeResult, response: string, marks?: { got: number; max: number }) => void;
}

function Feedback({ result, children }: { result: PracticeResult; children: React.ReactNode }) {
  const cls = result === 'correct' ? 'ok' : result === 'partial' ? 'info' : 'no';
  const label = result === 'correct' ? 'Correct ✓' : result === 'partial' ? 'Partly correct' : 'Not quite';
  return (
    <div className={`feedback ${cls}`}>
      <strong>{label}.</strong> {children}
    </div>
  );
}

export function TextAnswer({ q, done, onAnswer }: Props<TextQuestion>) {
  const [value, setValue] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (done || !value.trim()) return;
        onAnswer(checkText(value, q.answers, q.strict) ? 'correct' : 'incorrect', value);
      }}
    >
      <div className="row" style={{ flexWrap: 'nowrap' }}>
        <input
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Your answer"
          value={value}
          disabled={!!done}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          placeholder="Type your answer"
        />
        {!done && (
          <button className="btn primary" type="submit" disabled={!value.trim()}>
            Check
          </button>
        )}
      </div>
      {!done && !q.strict && <p className="small muted" style={{ marginTop: 6 }}>Accents and capital letters are not checked.</p>}
      {done && (
        <Feedback result={done.result}>
          Accepted: {q.answers.map((a, i) => (
            <span key={a}>
              {i > 0 && ' / '}
              <strong>{a}</strong>
            </span>
          ))}
        </Feedback>
      )}
    </form>
  );
}

export function OrderAnswer({ q, done, onAnswer }: Props<OrderQuestion>) {
  const [order, setOrder] = useState(() => {
    // Shuffle until the order differs from the answer (always possible with ≥ 2 distinct items).
    let s = shuffle(q.items);
    for (let k = 0; k < 5 && s.every((x, i) => x === q.items[i]); k++) s = shuffle(q.items, Date.now() + k + 1);
    return s;
  });
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  const correctAt = (i: number) => order[i] === q.items[i];
  return (
    <div>
      <ol className="order-list">
        {order.map((item, i) => (
          <li key={item} className={`option ${done ? (correctAt(i) ? 'correct' : 'wrong') : ''}`}>
            <span className="letter">{i + 1}</span>
            <MathText as="span" text={item} className="grow" />
            {!done && (
              <span className="row" style={{ flexWrap: 'nowrap', gap: 4 }}>
                <button type="button" className="btn small icon-btn" aria-label={`Move "${item}" up`} disabled={i === 0} onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" className="btn small icon-btn" aria-label={`Move "${item}" down`} disabled={i === order.length - 1} onClick={() => move(i, 1)}>
                  ↓
                </button>
              </span>
            )}
          </li>
        ))}
      </ol>
      {!done && (
        <button className="btn primary" style={{ marginTop: '0.75rem' }} onClick={() => onAnswer(resultFromScore(scoreOrder(order, q.items)), order.join(' → '))}>
          Check order
        </button>
      )}
      {done && (
        <Feedback result={done.result}>
          Correct order:
          <ol style={{ margin: '0.3rem 0 0', paddingLeft: '1.3rem' }}>
            {q.items.map((x) => (
              <li key={x}>
                <MathText as="span" text={x} />
              </li>
            ))}
          </ol>
        </Feedback>
      )}
    </div>
  );
}

export function MatchAnswer({ q, done, onAnswer }: Props<MatchQuestion>) {
  const rights = useMemo(() => shuffle(q.pairs.map((p) => p[1])), [q]);
  const [choice, setChoice] = useState<Record<string, string>>({});
  const complete = q.pairs.every(([l]) => choice[l]);
  return (
    <div>
      <div className="match-grid">
        {q.pairs.map(([left, right]) => {
          const state = done ? (choice[left] === right ? 'correct' : 'wrong') : '';
          return (
            <div key={left} className={`match-row option ${state}`}>
              <MathText as="span" text={left} className="grow" />
              <select
                aria-label={`Match for ${left}`}
                value={choice[left] ?? ''}
                disabled={!!done}
                onChange={(e) => setChoice({ ...choice, [left]: e.target.value })}
              >
                <option value="">— choose —</option>
                {rights.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {done && choice[left] !== right && <span className="small" style={{ gridColumn: '1 / -1' }}>→ {right}</span>}
            </div>
          );
        })}
      </div>
      {!done && (
        <button
          className="btn primary"
          style={{ marginTop: '0.75rem' }}
          disabled={!complete}
          onClick={() => onAnswer(resultFromScore(scoreMatch(choice, q.pairs)), q.pairs.map(([l]) => `${l} → ${choice[l]}`).join('; '))}
        >
          Check matches
        </button>
      )}
      {done && <Feedback result={done.result}>{Math.round(scoreMatch(choice, q.pairs) * q.pairs.length)} of {q.pairs.length} matched correctly.</Feedback>}
    </div>
  );
}

/**
 * Paper 2-style question: parts answered in order. Numeric parts are auto-marked (with an
 * optional self-override for method marks); other parts are self-marked against the mark scheme.
 */
export function StructuredAnswer({ q, done, onAnswer }: Props<StructuredQuestion>) {
  const [marks, setMarks] = useState<(number | null)[]>(() => q.parts.map(() => null));
  const [step, setStep] = useState(0);
  const max = q.parts.reduce((s, p) => s + p.marks, 0);
  const got = marks.reduce<number>((s, m) => s + (m ?? 0), 0);
  const allMarked = marks.every((m) => m !== null);

  const setPart = (i: number, m: number) => {
    const next = [...marks];
    next[i] = m;
    setMarks(next);
    if (i === step && step < q.parts.length - 1) setStep(step + 1);
  };

  return (
    <div className="stack">
      {q.parts.slice(0, step + 1).map((p, i) => (
        <PartView key={p.label} part={p} mark={marks[i]} locked={!!done} onMark={(m) => setPart(i, m)} />
      ))}
      {!done && allMarked && (
        <button
          className="btn primary"
          onClick={() => onAnswer(resultFromMarks(got, max), `${got}/${max} marks`, { got, max })}
        >
          Submit — {got} / {max} marks
        </button>
      )}
      {done && (
        <div className={`feedback ${done.result === 'correct' ? 'ok' : done.result === 'partial' ? 'info' : 'no'}`}>
          <strong>
            {got} / {max} marks
          </strong>{' '}
          ({Math.round((got / max) * 100)}%)
        </div>
      )}
    </div>
  );
}

function PartView({ part, mark, locked, onMark }: { part: StructuredPart; mark: number | null; locked: boolean; onMark: (m: number) => void }) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState<null | boolean>(null);
  const [shown, setShown] = useState(false);
  const revealed = shown || checked !== null;
  return (
    <div className="list-item">
      <div className="spread">
        <strong>({part.label})</strong>
        <span className="badge">
          {mark ?? '–'} / {part.marks} {part.marks === 1 ? 'mark' : 'marks'}
        </span>
      </div>
      <MathText text={part.prompt} />
      {part.accept && checked === null && (
        <form
          className="row"
          style={{ flexWrap: 'nowrap', marginTop: '0.5rem' }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!value.trim()) return;
            const ok = checkText(value, part.accept!);
            setChecked(ok);
            onMark(ok ? part.marks : 0);
          }}
        >
          <input type="text" autoComplete="off" autoCapitalize="off" aria-label={`Answer to part ${part.label}`} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Your answer" autoFocus />
          <button className="btn primary" type="submit" disabled={!value.trim()}>
            Check
          </button>
        </form>
      )}
      {part.numeric && checked === null && (
        <form
          className="row"
          style={{ flexWrap: 'nowrap', marginTop: '0.5rem' }}
          onSubmit={(e) => {
            e.preventDefault();
            const r = checkNumeric(value, part.numeric!);
            if (r.parsed === null) return;
            setChecked(r.ok);
            onMark(r.ok ? part.marks : 0);
          }}
        >
          <input type="text" inputMode="decimal" autoComplete="off" aria-label={`Answer to part ${part.label}`} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Final answer" autoFocus />
          {part.numeric.unit && <span className="muted" style={{ whiteSpace: 'nowrap' }}>{part.numeric.unit}</span>}
          <button className="btn primary" type="submit" disabled={!value.trim()}>
            Check
          </button>
        </form>
      )}
      {!part.numeric && !part.accept && !revealed && (
        <button className="btn small" style={{ marginTop: '0.5rem' }} onClick={() => setShown(true)}>
          Write your answer on paper, then show the mark scheme
        </button>
      )}
      {revealed && (
        <div className="feedback info">
          {part.accept && (
            <p style={{ margin: '0 0 0.4rem' }}>
              {checked ? '✓ Accepted' : '✗ Not accepted'} — expected: <strong>{part.accept.join(' / ')}</strong>
            </p>
          )}
          {part.numeric && (
            <p style={{ margin: '0 0 0.4rem' }}>
              {checked ? '✓ Correct final answer' : '✗ Final answer differs'} — accepted: <strong>{formatNumber(part.numeric.value)}</strong> {part.numeric.unit}
            </p>
          )}
          <strong className="small">Mark scheme</strong>
          <MathText text={part.scheme} className="small" />
          {!locked && (
            <div className="row" style={{ marginTop: '0.5rem' }} role="group" aria-label={`Marks for part ${part.label}`}>
              <span className="small muted">{part.numeric || part.accept ? 'Override if your answer is equivalent:' : 'Your marks:'}</span>
              {Array.from({ length: part.marks + 1 }, (_, m) => (
                <button key={m} className="chip" aria-pressed={mark === m} onClick={() => onMark(m)}>
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
