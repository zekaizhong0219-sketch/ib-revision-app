import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';
import { FeedbackExport } from '../components/FeedbackExport';
import { buildSourceFeedbackPrompt } from '../lib/feedback';
import { getRubric } from '../data/rubrics';
import { topicLabel } from '../data/syllabus';
import { BUILTIN_SOURCE_SETS } from '../data/paper1Sets';
import { PAPER1_GUIDE, PAPER1_MINUTES, PAPER1_READING_MINUTES, PAPER1_TOPICS, SOURCE_TIPS, paper1Questions } from '../data/paper1';
import { countWords } from '../lib/answer';
import { MathText } from '../components/MathText';
import type { SourceAttempt, SourceSet } from '../types';

const LETTERS = 'ABCD';
const Q4_BANDS = (getRubric('hist-p1-q4')?.criteria[0].bands ?? []).map((b) => `${b.min}–${b.max}: ${b.text}`);

const emptySet = (): SourceSet => ({
  id: `p1-${Date.now().toString(36)}`,
  title: '',
  topic: PAPER1_TOPICS[0].id,
  sources: Array.from({ length: 4 }, () => ({ origin: '', text: '' })),
  questions: paper1Questions(''),
  t: Date.now(),
  attempts: [],
});

type Mode = { kind: 'list' } | { kind: 'edit'; set: SourceSet } | { kind: 'sit'; set: SourceSet } | { kind: 'mark'; set: SourceSet; attempt: SourceAttempt };

export default function Sources() {
  const { data, saveSourceSet, deleteSourceSet } = useStore();
  const [mode, setMode] = useState<Mode>({ kind: 'list' });

  if (mode.kind === 'edit')
    return (
      <Editor
        initial={mode.set}
        onCancel={() => setMode({ kind: 'list' })}
        onSave={(s) => {
          saveSourceSet(s);
          setMode({ kind: 'list' });
        }}
      />
    );
  if (mode.kind === 'sit') return <Sit set={mode.set} onFinish={(attempt) => setMode({ kind: 'mark', set: mode.set, attempt })} onExit={() => setMode({ kind: 'list' })} />;
  if (mode.kind === 'mark') return <Mark set={mode.set} attempt={mode.attempt} onDone={() => setMode({ kind: 'list' })} />;

  const sets = [...data.sourceSets].reverse();
  const builtins: SourceSet[] = BUILTIN_SOURCE_SETS.map((b) => ({ ...b, attempts: data.p1Attempts[b.id] ?? [] }));
  const row = (s: SourceSet, own: boolean) => {
    const last = s.attempts[s.attempts.length - 1];
    const max = s.questions.reduce((a, q) => a + q.marks, 0);
    return (
      <div className="list-item spread" key={s.id}>
        <div>
          <strong>{s.title}</strong>
          <div className="small muted">
            {topicLabel('history', s.topic)} · {s.attempts.length} attempt{s.attempts.length === 1 ? '' : 's'}
            {last ? ` · last ${last.scores.reduce((a, b) => a + b, 0)}/${max}` : ''}
          </div>
        </div>
        <div className="row">
          <button className="btn primary small" onClick={() => setMode({ kind: 'sit', set: s })}>
            Sit
          </button>
          {own && (
            <>
              <button className="btn small" onClick={() => setMode({ kind: 'edit', set: s })}>
                Edit
              </button>
              <button
                className="btn small danger"
                onClick={() => {
                  if (window.confirm(`Delete "${s.title}" and its attempts?`)) deleteSourceSet(s.id);
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };
  return (
    <div>
      <h1>History Paper 1 workshop</h1>
      <p className="muted">
        Practise Paper 1 with sources you choose: type or paste four sources from your textbook, class packs or archives, and the app builds a
        Paper 1-style question set (24 marks, 1 hour). Sit it under time, mark it against the guidance, and export it for feedback. Your sources are
        stored only on this device and in your backups; they are never published.
      </p>
      <div className="row" style={{ marginBottom: '1rem' }}>
        <button className="btn primary" onClick={() => setMode({ kind: 'edit', set: emptySet() })}>
          New source set
        </button>
      </div>
      <h2>Real sources</h2>
      <p className="small muted">
        Sets built on verbatim primary sources (US diplomatic papers, treaty texts and Hansard), with mark-scheme notes written for the app.
      </p>
      <div className="list">{builtins.map((b) => row(b, false))}</div>
      <h2 style={{ marginTop: '1.5rem' }}>Your sets</h2>
      <div className="list">
        {sets.length === 0 && <div className="empty">No source sets yet. Create one from a set of four sources on the same focus.</div>}
        {sets.map((s) => row(s, true))}
      </div>
      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h2>How each question is marked</h2>
        <p className="small muted">A paraphrase of common marking practice, not the official markscheme; check the current guide with your teacher.</p>
        {['1a', '1b', '2', '3', '4'].map((l) => (
          <div key={l} style={{ marginTop: '0.75rem' }}>
            <h3>
              Question {l} · about {PAPER1_GUIDE[l].minutes} min
            </h3>
            <ul className="small" style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {[...PAPER1_GUIDE[l].marking, ...PAPER1_GUIDE[l].method].map((p) => (
                <li key={p}>{p}</li>
              ))}
              {l === '4' && Q4_BANDS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        ))}
      </section>
      <section className="card" style={{ marginTop: '1rem' }}>
        <h2>Where to find sources</h2>
        <ul className="small" style={{ margin: 0, paddingLeft: '1.2rem' }}>
          {SOURCE_TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Editor({ initial, onSave, onCancel }: { initial: SourceSet; onSave: (s: SourceSet) => void; onCancel: () => void }) {
  const [set, setSet] = useState<SourceSet>(initial);
  const [focus, setFocus] = useState('');
  const filled = set.sources.filter((s) => s.text.trim()).length;
  const valid = set.title.trim() !== '' && filled >= 2 && set.questions.every((q) => q.prompt.trim());

  const setSource = (i: number, patch: Partial<SourceSet['sources'][number]>) =>
    setSet({ ...set, sources: set.sources.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  return (
    <div>
      <div className="spread">
        <h1 style={{ margin: 0 }}>{initial.title ? 'Edit source set' : 'New source set'}</h1>
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <div className="card stack" style={{ marginTop: '1rem' }}>
        <label className="small">
          Title
          <input type="text" value={set.title} maxLength={160} placeholder="e.g. The Manchurian Crisis" onChange={(e) => setSet({ ...set, title: e.target.value })} />
        </label>
        <div className="row" role="group" aria-label="Case study">
          {PAPER1_TOPICS.map((t) => (
            <button key={t.id} className="chip" aria-pressed={set.topic === t.id} onClick={() => setSet({ ...set, topic: t.id })}>
              {t.name}
            </button>
          ))}
        </div>
      </div>
      {set.sources.map((s, i) => (
        <section className="card stack" key={i}>
          <h2 style={{ margin: 0 }}>Source {LETTERS[i]}</h2>
          <label className="small">
            Origin (author, title, date, type of source)
            <input type="text" value={s.origin} maxLength={400} onChange={(e) => setSource(i, { origin: e.target.value })} />
          </label>
          <label className="small">
            Text, or a description of a visual source (caption, figures, symbols)
            <textarea value={s.text} maxLength={6000} rows={6} onChange={(e) => setSource(i, { text: e.target.value })} style={{ fontFamily: 'inherit' }} />
          </label>
          <span className="small muted">{countWords(s.text)} words</span>
        </section>
      ))}
      <section className="card stack">
        <h2 style={{ margin: 0 }}>Questions</h2>
        <div className="row" style={{ alignItems: 'end' }}>
          <label className="small" style={{ flex: '1 1 16rem' }}>
            Focus of the set
            <input type="text" value={focus} placeholder="e.g. the reasons for the Japanese invasion of Manchuria" onChange={(e) => setFocus(e.target.value)} />
          </label>
          <button className="btn small" disabled={!focus.trim()} onClick={() => setSet({ ...set, questions: paper1Questions(focus) })}>
            Fill in questions
          </button>
        </div>
        <p className="small muted">Edit the wording so each question fits your sources (e.g. "Source B" should be the visual source).</p>
        {set.questions.map((q, i) => (
          <label className="small" key={q.label}>
            Question {q.label} [{q.marks}]
            <textarea
              value={q.prompt}
              rows={2}
              maxLength={600}
              onChange={(e) => setSet({ ...set, questions: set.questions.map((x, k) => (k === i ? { ...x, prompt: e.target.value } : x)) })}
              style={{ fontFamily: 'inherit', minHeight: 0 }}
            />
          </label>
        ))}
      </section>
      <div className="card spread">
        <span className="small muted">{valid ? `${filled} sources ready.` : 'Add a title, at least two sources and all five questions.'}</span>
        <button
          className="btn primary"
          disabled={!valid}
          onClick={() => onSave({ ...set, title: set.title.trim(), sources: set.sources.map((s) => ({ origin: s.origin.trim(), text: s.text.trim() })) })}
        >
          Save set
        </button>
      </div>
    </div>
  );
}

function SourcePanel({ set }: { set: SourceSet }) {
  return (
    <div className="stack">
      {set.sources.map((s, i) =>
        s.text ? (
          <section className="card" key={i} style={{ margin: 0 }}>
            <h3 style={{ marginTop: 0 }}>Source {LETTERS[i]}</h3>
            {s.origin &&
              (s.url ? (
                <MathText as="div" className="small muted" text={s.origin} />
              ) : (
                <p className="small muted" style={{ fontStyle: 'italic' }}>
                  {s.origin}
                </p>
              ))}
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{s.text}</p>
            {s.url && (
              <a className="small" href={s.url} target="_blank" rel="noopener noreferrer">
                Full document ↗
              </a>
            )}
          </section>
        ) : null,
      )}
    </div>
  );
}

function Sit({ set, onFinish, onExit }: { set: SourceSet; onFinish: (a: SourceAttempt) => void; onExit: () => void }) {
  const [started] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  const [answers, setAnswers] = useState<string[]>(() => set.questions.map(() => ''));
  const finished = useRef(false);
  const totalMs = (PAPER1_MINUTES + PAPER1_READING_MINUTES) * 60000;
  const elapsed = now - started;
  const reading = elapsed < PAPER1_READING_MINUTES * 60000;
  const remaining = Math.max(0, totalMs - elapsed);
  const mmss = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onFinish({ t: started, sec: Math.round((Date.now() - started) / 1000), answers, scores: set.questions.map(() => 0) });
  };

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('beforeunload', warn);
    };
  }, []);
  useEffect(() => {
    if (remaining === 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  return (
    <div>
      <div className="spread" style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--bg)', padding: '0.5rem 0' }}>
        <strong>{set.title}</strong>
        <span className={`badge ${remaining < 5 * 60000 ? 'bad' : ''}`} aria-live="polite">
          {reading ? `Reading time ${mmss(PAPER1_READING_MINUTES * 60000 - elapsed)}` : `${mmss(remaining)} left`}
        </span>
        <div className="row">
          <button
            className="btn small"
            onClick={() => {
              if (window.confirm('Leave without saving this attempt?')) onExit();
            }}
          >
            Quit
          </button>
          <button className="btn primary small" onClick={finish}>
            Finish
          </button>
        </div>
      </div>
      {reading && <p className="small muted">Reading time: read the sources and questions, and plan. You may start writing whenever you like.</p>}
      <SourcePanel set={set} />
      {set.questions.map((q, i) => (
        <section className="card" key={q.label}>
          <div className="spread">
            <strong>
              {q.label}. {q.prompt}
            </strong>
            <span className="badge">[{q.marks}]</span>
          </div>
          <textarea
            value={answers[i]}
            rows={q.marks >= 6 ? 12 : 5}
            aria-label={`Answer to question ${q.label}`}
            onChange={(e) => setAnswers(answers.map((a, k) => (k === i ? e.target.value : a)))}
            style={{ fontFamily: 'inherit', marginTop: '0.5rem' }}
          />
          <span className="small muted">
            {countWords(answers[i])} words · suggested {PAPER1_GUIDE[q.label]?.minutes ?? '–'} min
          </span>
        </section>
      ))}
      <div className="card spread">
        <span className="small muted">When you finish, you mark each answer against the guidance.</span>
        <button className="btn primary" onClick={finish}>
          Finish and mark
        </button>
      </div>
    </div>
  );
}

function Mark({ set, attempt, onDone }: { set: SourceSet; attempt: SourceAttempt; onDone: () => void }) {
  const { addSourceAttempt, saveMock, logPractice } = useStore();
  const [scores, setScores] = useState<(number | undefined)[]>(() => set.questions.map(() => undefined));
  const max = useMemo(() => set.questions.reduce((s, q) => s + q.marks, 0), [set]);
  const total = scores.reduce<number>((s, x) => s + (x ?? 0), 0);
  const complete = scores.every((x) => x !== undefined);
  const final: SourceAttempt = { ...attempt, scores: scores.map((x) => x ?? 0) };

  const save = () => {
    addSourceAttempt(set.id, final);
    saveMock({ id: `mock-p1-${attempt.t.toString(36)}`, subject: 'history', t: attempt.t, minutes: PAPER1_MINUTES, got: total, max, items: set.questions.length });
    const pct = total / max;
    logPractice([
      { q: set.id, s: 'history', tp: set.topic, r: pct >= 0.7 ? 'correct' : pct >= 0.4 ? 'partial' : 'incorrect', t: Date.now(), m: total, mx: max },
    ]);
    onDone();
  };

  return (
    <div>
      <h1>Mark your Paper 1</h1>
      <p className="muted">For each question, compare your answer with the guidance and choose a mark. Be as strict as an examiner would be.</p>
      <details className="card">
        <summary>Sources</summary>
        <SourcePanel set={set} />
      </details>
      {set.questions.map((q, i) => {
        const g = PAPER1_GUIDE[q.label];
        return (
          <section className="card" key={q.label}>
            <div className="spread">
              <strong>
                {q.label}. {q.prompt}
              </strong>
              <span className="badge">
                {scores[i] ?? '–'} / {q.marks}
              </span>
            </div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{attempt.answers[i]?.trim() || <em className="muted">No answer.</em>}</p>
            {q.scheme && (
              <details open>
                <summary className="small">Points a good answer may make</summary>
                <ul className="small" style={{ paddingLeft: '1.2rem' }}>
                  {q.scheme.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </details>
            )}
            {g && (
              <ul className="small muted" style={{ paddingLeft: '1.2rem' }}>
                {g.marking.map((p) => (
                  <li key={p}>{p}</li>
                ))}
                {q.label === '4' && Q4_BANDS.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
            <div className="row" role="group" aria-label={`Mark for question ${q.label}`}>
              {Array.from({ length: q.marks + 1 }, (_, m) => (
                <button key={m} className="chip" aria-pressed={scores[i] === m} onClick={() => setScores(scores.map((x, k) => (k === i ? m : x)))}>
                  {m}
                </button>
              ))}
            </div>
          </section>
        );
      })}
      <div className="card spread">
        <strong>
          Total: {total} / {max} ({Math.round((100 * total) / max)}%)
        </strong>
        <button className="btn primary" disabled={!complete} onClick={save}>
          Save marks
        </button>
      </div>
      <FeedbackExport
        build={() => buildSourceFeedbackPrompt(set, final, PAPER1_GUIDE, Q4_BANDS)}
        filename={`feedback-history-p1-${new Date(attempt.t).toISOString().slice(0, 10)}.md`}
      />
    </div>
  );
}
