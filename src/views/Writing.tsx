import { useEffect, useMemo, useRef, useState } from 'react';
import { FeedbackExport } from '../components/FeedbackExport';
import { buildFeedbackPrompt } from '../lib/feedback';
import { copyText } from '../lib/clipboard';
import { useT } from '../i18n';
import { useStore } from '../store';
import { ALL_ESSAYS } from '../data/essays';
import { getRubric, rubricMax, type Rubric } from '../data/rubrics';
import { getSubject, topicLabel } from '../data/syllabus';
import { countWords } from '../lib/answer';
import { essayPercent } from '../lib/stats';
import { MathText } from '../components/MathText';
import { BarChart } from '../components/Charts';
import { SubjectDot } from '../components/ui';
import { navigate, type Route } from '../router';
import { EXEMPLAR_BY_PROMPT, type Exemplar } from '../data/exemplars';
import type { EssayAttempt, EssayPrompt, SubjectId } from '../types';

const AUTOSAVE_MS = 1500;

export default function Writing({ route }: { route: Route }) {
  const t = useT();
  const { data, visibleSubjects, deleteEssay } = useStore();
  const essaySubjects = useMemo(() => visibleSubjects.filter((s) => ALL_ESSAYS.some((e) => e.subject === s.id)), [visibleSubjects]);
  const param = route.params.get('subject') as SubjectId | null;
  const subject = essaySubjects.find((s) => s.id === param)?.id ?? essaySubjects[0]?.id;
  const [active, setActive] = useState<{ prompt: EssayPrompt; attempt: EssayAttempt; phase: 'write' | 'assess' } | null>(null);
  const [exemplar, setExemplar] = useState<{ ex: Exemplar; prompt: EssayPrompt } | null>(null);

  const prompts = ALL_ESSAYS.filter((e) => e.subject === subject);
  const attempts = data.essays.filter((e) => e.subject === subject).sort((a, b) => b.t - a.t);
  const promptById = useMemo(() => new Map(ALL_ESSAYS.map((p) => [p.id, p])), []);

  if (exemplar) return <ExemplarView ex={exemplar.ex} prompt={exemplar.prompt} onBack={() => setExemplar(null)} />;

  if (active) {
    return active.phase === 'write' ? (
      <WriteSession
        prompt={active.prompt}
        initial={active.attempt}
        onFinish={(a) => setActive({ ...active, attempt: a, phase: 'assess' })}
        onExit={() => setActive(null)}
      />
    ) : (
      <Assess prompt={active.prompt} attempt={active.attempt} onDone={() => setActive(null)} />
    );
  }

  if (!subject) {
    return (
      <div>
        <h1>{t('Timed writing')}</h1>
        <div className="empty">Timed writing is available for Spanish A, English B and History. Unhide one of them in Settings.</div>
      </div>
    );
  }

  const start = (p: EssayPrompt) => {
    const draft = data.essays.find((e) => e.prompt === p.id && !e.done);
    const attempt: EssayAttempt = draft ?? {
      id: `es-${Date.now().toString(36)}`,
      prompt: p.id,
      subject: p.subject,
      topic: p.topic,
      rubric: p.rubric,
      t: Date.now(),
      sec: 0,
      words: 0,
      text: '',
      scores: {},
      done: false,
    };
    setActive({ prompt: p, attempt, phase: 'write' });
  };

  const done = attempts.filter((a) => a.done && essayPercent(a) !== null).reverse();

  return (
    <div>
      <h1>{t('Timed writing')}</h1>
      <p className="muted">
        Exam-style essays under real time limits, with a live word count. Drafts save automatically. When you finish, mark yourself against the
        criteria; scores feed your topic accuracy at single weight, because self-marking is less reliable than auto-marking.
      </p>
      <div className="row" role="group" aria-label={t('Subject')}>
        {essaySubjects.map((s) => (
          <button key={s.id} className="chip" aria-pressed={s.id === subject} onClick={() => navigate('/writing', { subject: s.id })}>
            <SubjectDot subject={s.id} /> {s.name}
          </button>
        ))}
      </div>

      <div className="list" style={{ marginTop: '1rem' }}>
        {prompts.map((p) => {
          const r = getRubric(p.rubric)!;
          const mine = data.essays.filter((e) => e.prompt === p.id);
          const draft = mine.find((e) => !e.done);
          const best = Math.max(-1, ...mine.filter((e) => e.done).map((e) => essayPercent(e) ?? -1));
          return (
            <div className="list-item" key={p.id}>
              <div className="meta small muted">
                {topicLabel(p.subject, p.topic)} · <span className="badge">{r.name}</span> · {p.minutes} min
                {p.minWords && p.maxWords ? ` · ${p.minWords}–${p.maxWords} words` : ''}
                {best >= 0 && <span className="badge good">best {Math.round(best * 100)}%</span>}
                {EXEMPLAR_BY_PROMPT.has(p.id) && <span className="badge">exemplar</span>}
                {draft && <span className="badge">draft saved</span>}
              </div>
              <details>
                <summary>
                  <MathText as="span" text={firstLine(p.prompt)} />
                </summary>
                <MathText text={p.prompt} className="small" />
              </details>
              <div className="row" style={{ marginTop: '0.5rem' }}>
                <button className="btn primary small" onClick={() => start(p)}>
                  {draft ? t('Resume draft') : t('Start')}
                </button>
                {EXEMPLAR_BY_PROMPT.has(p.id) && (
                  <button
                    className="btn small"
                    onClick={() => {
                      const tried = mine.some((e) => e.done);
                      if (tried || window.confirm('You get much more out of an exemplar after writing your own answer first. Show it anyway?')) {
                        setExemplar({ ex: EXEMPLAR_BY_PROMPT.get(p.id)!, prompt: p });
                      }
                    }}
                  >
                    {t('View exemplar')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {subject === 'history' && (
        <a className="card spread" href="#/sources" style={{ textDecoration: 'none', color: 'inherit', marginTop: '1rem' }}>
          <div>
            <strong>{t('History Paper 1 workshop')}</strong>
            <div className="small muted">Practise with your own sources in the Paper 1 workshop.</div>
          </div>
          <span className="btn small">{t('Open')}</span>
        </a>
      )}

      <div className="section-title">
        <h2>Your attempts — {getSubject(subject).name}</h2>
      </div>
      {done.length >= 2 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <BarChart
            title="Self-assessed score per attempt (%)"
            labels={done.map((a) => new Date(a.t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }))}
            series={[{ label: 'score %', values: done.map((a) => Math.round((essayPercent(a) ?? 0) * 100)), color: getSubject(subject).color }]}
          />
        </div>
      )}
      <div className="list">
        {attempts.length === 0 && <div className="empty">No attempts yet.</div>}
        {attempts.map((a) => {
          const p = promptById.get(a.prompt);
          const pct = essayPercent(a);
          return (
            <div className="list-item" key={a.id}>
              <div className="meta small muted">
                {new Date(a.t).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · {a.words} words · {Math.round(a.sec / 60)} min
                {a.done ? pct !== null && <span className="badge good">{Math.round(pct * 100)}%</span> : <span className="badge">draft</span>}
              </div>
              <MathText as="div" className="small" text={p ? firstLine(p.prompt) : '(prompt removed)'} />
              <details>
                <summary className="small muted">Text & actions</summary>
                <p style={{ whiteSpace: 'pre-wrap' }}>{a.text || '—'}</p>
                <div className="row">
                  {p && (
                    <button className="btn small" onClick={() => setActive({ prompt: p, attempt: a, phase: a.done ? 'assess' : 'write' })}>
                      {a.done ? 'Re-mark' : 'Continue'}
                    </button>
                  )}
                  {p && a.text.trim() && (
                    <button
                      className="btn small"
                      onClick={async () => {
                        const r = getRubric(a.rubric);
                        if (!r) return;
                        const text = buildFeedbackPrompt(p, a, r);
                        window.alert(
                          (await copyText(text))
                            ? 'Feedback request copied. Paste it into Claude or send it to your teacher.'
                            : 'Copying was blocked by the browser. Open "Re-mark" and use Download .md instead.',
                        );
                      }}
                    >
                      {t('Copy feedback request')}
                    </button>
                  )}
                  <button
                    className="btn small danger"
                    onClick={() => {
                      if (window.confirm('Delete this attempt?')) deleteEssay(a.id);
                    }}
                  >
                    {t('Delete')}
                  </button>
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function firstLine(text: string): string {
  const line = text.split('\n').find((l) => l.trim() && !/^\*\*Text/.test(l)) ?? text;
  return line.length > 180 ? `${line.slice(0, 177)}…` : line;
}

function WriteSession({ prompt, initial, onFinish, onExit }: { prompt: EssayPrompt; initial: EssayAttempt; onFinish: (a: EssayAttempt) => void; onExit: () => void }) {
  const t = useT();
  const { saveEssay } = useStore();
  const [text, setText] = useState(initial.text);
  const [hints, setHints] = useState(false);
  const [now, setNow] = useState(Date.now());
  const resumedAt = useRef(Date.now());
  const elapsed = initial.sec + Math.floor((now - resumedAt.current) / 1000);
  const words = countWords(text);
  const limit = prompt.minutes * 60;
  const remaining = limit - elapsed;

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const snapshot = (done = false): EssayAttempt => ({
    ...initial,
    text,
    words,
    sec: initial.sec + Math.floor((Date.now() - resumedAt.current) / 1000),
    done: done || initial.done,
  });
  const latest = useRef(snapshot);
  latest.current = snapshot;

  // Autosave the draft shortly after typing stops, and when leaving (never save an empty draft).
  const persist = useRef(() => {
    const a = latest.current();
    if (a.text.trim()) saveEssay(a);
  });
  useEffect(() => {
    const id = window.setTimeout(() => persist.current(), AUTOSAVE_MS);
    return () => window.clearTimeout(id);
  }, [text]);
  useEffect(() => {
    const save = persist.current;
    return () => save();
  }, []);

  const fmt = (s: number) => `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`;
  const r = getRubric(prompt.rubric)!;
  const wordClass =
    prompt.minWords && words < prompt.minWords ? 'badge' : prompt.maxWords && words > prompt.maxWords ? 'badge bad' : prompt.minWords ? 'badge good' : 'badge';

  return (
    <div>
      <div className="spread" style={{ marginBottom: '0.75rem' }}>
        <span className={`timer ${remaining < 300 ? 'low' : ''}`}>
          ⏱ {remaining >= 0 ? fmt(remaining) : `+${fmt(remaining)} over`}
        </span>
        <span className={wordClass}>
          {words} words
          {prompt.minWords && prompt.maxWords ? ` (${prompt.minWords}–${prompt.maxWords})` : ''}
        </span>
        <div className="row">
          <button className="btn small ghost" onClick={onExit}>
            {t('Save & exit')}
          </button>
          <button
            className="btn small primary"
            onClick={() => {
              const a = snapshot(false);
              saveEssay(a);
              onFinish(a);
            }}
            disabled={!text.trim()}
          >
            {t('Finish & self-assess')}
          </button>
        </div>
      </div>
      <div className="card">
        <div className="small muted" style={{ marginBottom: 6 }}>
          <SubjectDot subject={prompt.subject} /> {topicLabel(prompt.subject, prompt.topic)} · {r.name}
        </div>
        <MathText text={prompt.prompt} />
        {prompt.guidance && (
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn small ghost" onClick={() => setHints((h) => !h)} aria-expanded={hints}>
              {hints ? t('Hide planning hints') : t('Show planning hints')}
            </button>
            {hints && <MathText className="feedback info small" text={prompt.guidance} />}
          </div>
        )}
      </div>
      <textarea
        className="essay-box"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Plan briefly, then write your answer here…"
        aria-label="Your essay"
        spellCheck
        lang={getSubject(prompt.subject).lang}
        autoFocus
      />
      <p className="small muted">Autosaved locally. Tip: keep spellcheck in mind; in the real exam you write by hand without it.</p>
    </div>
  );
}

function Assess({ prompt, attempt, onDone }: { prompt: EssayPrompt; attempt: EssayAttempt; onDone: () => void }) {
  const t = useT();
  const { saveEssay } = useStore();
  const r = getRubric(attempt.rubric) as Rubric;
  const [scores, setScores] = useState<Record<string, number>>(() => ({ ...attempt.scores }));
  const total = r.criteria.reduce((s, c) => s + (scores[c.id] ?? 0), 0);
  const complete = r.criteria.every((c) => scores[c.id] !== undefined);
  const max = rubricMax(r);

  return (
    <div>
      <h1>{t('Self-assessment')}</h1>
      <p className="muted">
        Read your answer as an examiner would, choose the band that fits best for each criterion, then pick a mark within it. These descriptors
        are short paraphrases; check the official guide with your teacher.
      </p>
      <details className="card">
        <summary>
          Your answer ({attempt.words} words, {Math.round(attempt.sec / 60)} min of {prompt.minutes})
        </summary>
        <MathText className="small muted" text={prompt.prompt} />
        <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.75rem' }}>{attempt.text}</p>
      </details>
      {r.criteria.map((c) => (
        <section className="card" key={c.id}>
          <div className="spread">
            <h2 style={{ margin: 0 }}>{c.name}</h2>
            <span className="badge">
              {scores[c.id] ?? '–'} / {c.max}
            </span>
          </div>
          <p className="small muted">{c.focus}</p>
          <div className="list">
            {c.bands.map((b) => {
              const inBand = scores[c.id] !== undefined && scores[c.id] >= b.min && scores[c.id] <= b.max;
              return (
                <div key={b.min} className={`list-item ${inBand ? 'band-on' : ''}`}>
                  <div className="spread">
                    <span className="small">{b.text}</span>
                    <span className="row" style={{ flexWrap: 'nowrap', gap: 4 }}>
                      {Array.from({ length: b.max - b.min + 1 }, (_, k) => b.min + k).map((m) => (
                        <button
                          key={m}
                          className="chip"
                          aria-pressed={scores[c.id] === m}
                          aria-label={`${c.name}: ${m} marks`}
                          onClick={() => setScores({ ...scores, [c.id]: m })}
                        >
                          {m}
                        </button>
                      ))}
                    </span>
                  </div>
                </div>
              );
            })}
            <button className="chip" aria-pressed={scores[c.id] === 0} onClick={() => setScores({ ...scores, [c.id]: 0 })} style={{ justifySelf: 'start' }}>
              0 — does not reach the lowest band
            </button>
          </div>
        </section>
      ))}
      <div className="card spread">
        <strong>
          Total: {total} / {max} ({Math.round((total / max) * 100)}%)
        </strong>
        <button
          className="btn primary"
          disabled={!complete}
          onClick={() => {
            saveEssay({ ...attempt, scores, done: true });
            onDone();
          }}
        >
          {t('Save marks')}
        </button>
      </div>
      <FeedbackExport
        build={() => buildFeedbackPrompt(prompt, { ...attempt, scores, done: complete }, r)}
        filename={`feedback-${prompt.subject}-${new Date(attempt.t).toISOString().slice(0, 10)}.md`}
      />
    </div>
  );
}

function ExemplarView({ ex, prompt, onBack }: { ex: Exemplar; prompt: EssayPrompt; onBack: () => void }) {
  const t = useT();
  const r = getRubric(prompt.rubric)!;
  const total = r.criteria.reduce((sum, c) => sum + (ex.scores[c.id] ?? 0), 0);
  const words = countWords(ex.text.replace(/\*\*/g, ''));
  return (
    <div>
      <div className="spread">
        <h1 style={{ margin: 0 }}>{ex.title}</h1>
        <button className="btn" onClick={onBack}>
          {t('Back')}
        </button>
      </div>
      <details className="card" style={{ marginTop: '1rem' }}>
        <summary>Task · {r.name}</summary>
        <MathText text={prompt.prompt} className="small" />
      </details>
      <article className="card exemplar" lang={getSubject(prompt.subject).lang}>
        <div className="small muted" style={{ marginBottom: 8 }}>
          {words} words{prompt.minWords && prompt.maxWords ? ` (required ${prompt.minWords}–${prompt.maxWords})` : ''}
        </div>
        {ex.text.split(/\n\s*\n/).map((para, i) => (
          <MathText key={i} text={para} className="exemplar-para" />
        ))}
      </article>
      <section className="card">
        <div className="spread">
          <h2 style={{ margin: 0 }}>Estimated marks</h2>
          <span className="badge good">
            {total} / {rubricMax(r)}
          </span>
        </div>
        <table className="keys" style={{ marginTop: '0.5rem' }}>
          <tbody>
            {r.criteria.map((c) => (
              <tr key={c.id}>
                <td style={{ width: '32%', verticalAlign: 'top' }}>
                  <strong>{c.name}</strong>
                  <div className="small muted">
                    {ex.scores[c.id]} / {c.max}
                  </div>
                </td>
                <td className="small">{ex.notes[c.id]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small" style={{ marginTop: '0.75rem' }}>
          {ex.overall}
        </p>
        <p className="small muted">
          Written for this app; the marks are an estimate against the criteria, not an official IB result. Use it to see structure and
          technique, not to memorise.
        </p>
      </section>
    </div>
  );
}
