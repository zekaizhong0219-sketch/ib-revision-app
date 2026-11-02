import { useMemo, useState } from 'react';
import { checkText, resultFromScore, scoreMatch, scoreOrder } from '../lib/answer';
import { shuffle } from '../lib/queue';
import { MathText } from '../components/MathText';
import type { MatchQuestion, OrderQuestion, PracticeResult, TextQuestion } from '../types';

interface Props<Q> {
  q: Q;
  /** Result once answered, null before. */
  done: { result: PracticeResult } | null;
  onAnswer: (r: PracticeResult, response: string) => void;
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
