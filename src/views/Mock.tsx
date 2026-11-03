import { useEffect, useMemo, useState } from 'react';
import { useT } from '../i18n';
import { useStore } from '../store';
import { ALL_QUESTIONS } from '../data/questions';
import { getSubject, topicLabel } from '../data/syllabus';
import { autoMark, buildMock, emptyResponse, type MockItem, type MockResponse } from '../lib/mock';
import { estimateGrade, gradeFromPercent, GRADE_THRESHOLDS } from '../lib/grades';
import { resultFromMarks } from '../lib/answer';
import { shuffle } from '../lib/queue';
import { MathText } from '../components/MathText';
import { HBars } from '../components/Charts';
import { SubjectDot } from '../components/ui';
import { href } from '../router';
import type { PracticeLog, QuestionStyle, SubjectId } from '../types';

const LENGTHS = [30, 60, 90];
const STYLE_OPTIONS: [QuestionStyle | '', string][] = [
  ['', 'Mixed (Paper 1 + 2 style)'],
  ['P1B', 'Paper 1B data-based'],
  ['P3', 'Paper 3 investigations'],
];

type Phase =
  | { kind: 'setup' }
  | { kind: 'sit'; subject: SubjectId; minutes: number; items: MockItem[]; started: number }
  | { kind: 'mark'; subject: SubjectId; minutes: number; items: MockItem[]; started: number; responses: MockResponse[] }
  | { kind: 'done'; subject: SubjectId; got: number; max: number; rows: { item: MockItem; got: number }[] };

export default function Mock() {
  const t = useT();
  const { visibleSubjects } = useStore();
  const subjects = visibleSubjects.filter((s) => ALL_QUESTIONS.some((q) => q.subject === s.id));
  const [phase, setPhase] = useState<Phase>({ kind: 'setup' });
  const [subject, setSubject] = useState<SubjectId>(subjects[0]?.id ?? 'physics');
  const [minutes, setMinutes] = useState(60);
  const [style, setStyle] = useState<QuestionStyle | ''>('');
  const styles = STYLE_OPTIONS.filter(([st]) => !st || ALL_QUESTIONS.some((q) => q.subject === subject && q.type === 'structured' && q.style === st));
  const activeStyle = styles.some(([st]) => st === style) ? style : '';

  if (phase.kind === 'sit') {
    return (
      <Sit
        {...phase}
        onFinish={(responses) => setPhase({ ...phase, kind: 'mark', responses })}
      />
    );
  }
  if (phase.kind === 'mark') {
    return <MarkPhase {...phase} onDone={(got, max, rows) => setPhase({ kind: 'done', subject: phase.subject, got, max, rows })} />;
  }
  if (phase.kind === 'done') return <Results {...phase} onAgain={() => setPhase({ kind: 'setup' })} />;

  return (
    <div>
      <h1>{t('Mock exam')}</h1>
      <p className="muted">
        A timed paper built from the question bank, sat under exam conditions: no feedback until the end. Short items come first, then
        Paper 2-style structured questions. Afterwards you mark your written answers against the mark scheme, then get a score and a rough
        grade estimate. Wrong answers become review cards (switch this off in Settings).
      </p>
      <div className="card stack">
        <div>
          <h3>{t('Subject')}</h3>
          <div className="row">
            {subjects.map((s) => (
              <button key={s.id} className="chip" aria-pressed={subject === s.id} onClick={() => setSubject(s.id)}>
                <SubjectDot subject={s.id} /> {s.name}
              </button>
            ))}
          </div>
        </div>
        {styles.length > 1 && (
          <div>
            <h3>{t('Paper')}</h3>
            <div className="row">
              {styles.map(([st, label]) => (
                <button key={st || 'mixed'} className="chip" aria-pressed={activeStyle === st} onClick={() => setStyle(st)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <h3>{t('Length')}</h3>
          <div className="row">
            {LENGTHS.map((m) => (
              <button key={m} className="chip" aria-pressed={minutes === m} onClick={() => setMinutes(m)}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        <p className="small muted">
          Essay papers (Spanish Paper 1/2, English Paper 1, History Paper 2) are practised in <a href={href('/writing')}>{t('Writing')}</a>; for those
          subjects the mock covers the short-answer and reading items.
        </p>
        <button
          className="btn primary"
          onClick={() => setPhase({ kind: 'sit', subject, minutes, items: buildMock(ALL_QUESTIONS, subject, minutes, Date.now(), undefined, activeStyle || undefined), started: Date.now() })}
        >
          Start {minutes}-minute mock
        </button>
      </div>
    </div>
  );
}

function Sit({ subject, minutes, items, started, onFinish }: { subject: SubjectId; minutes: number; items: MockItem[]; started: number; onFinish: (r: MockResponse[]) => void }) {
  const t = useT();
  const [responses, setResponses] = useState<MockResponse[]>(() => items.map((i) => emptyResponse(i.q)));
  const [idx, setIdx] = useState(0);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const remaining = Math.max(0, started + minutes * 60000 - now);
  useEffect(() => {
    if (remaining === 0) onFinish(responses);
  }, [remaining, onFinish, responses]);

  const item = items[idx];
  const set = (r: MockResponse) => setResponses((rs) => rs.map((x, i) => (i === idx ? r : x)));
  const answered = (r: MockResponse) =>
    r.kind === 'mc' ? r.choice !== null : r.kind === 'value' ? !!r.text.trim() : r.kind === 'order' ? r.order.length > 0 : r.kind === 'match' ? Object.keys(r.choice).length > 0 : r.texts.some((x) => x.trim());
  const secs = Math.ceil(remaining / 1000);
  const totalMarks = items.reduce((s, i) => s + i.max, 0);

  return (
    <div>
      <div className="spread" style={{ marginBottom: '0.75rem' }}>
        <span className={`timer ${secs < 300 ? 'low' : ''}`}>
          ⏱ {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}
        </span>
        <span className="small muted">
          <SubjectDot subject={subject} /> {getSubject(subject).short} mock · {items.length} questions · {totalMarks} marks
        </span>
        <button
          className="btn small primary"
          onClick={() => {
            if (window.confirm('Finish the paper and start marking?')) onFinish(responses);
          }}
        >
          {t('Finish paper')}
        </button>
      </div>
      <nav className="row palette" aria-label="Questions">
        {items.map((it, i) => (
          <button
            key={it.q.id}
            className="chip"
            aria-pressed={i === idx}
            aria-label={`Question ${i + 1}${answered(responses[i]) ? ', answered' : ''}`}
            style={answered(responses[i]) ? { borderColor: 'var(--good)' } : undefined}
            onClick={() => setIdx(i)}
          >
            {i + 1}
          </button>
        ))}
      </nav>
      <div className="card" style={{ marginTop: '0.75rem' }}>
        <div className="spread small muted" style={{ marginBottom: 6 }}>
          <span>
            Question {idx + 1} · {topicLabel(item.q.subject, item.q.topic)}
          </span>
          <span className="badge">
            [{item.max} {item.max === 1 ? 'mark' : 'marks'}]
          </span>
        </div>
        <MathText text={item.q.prompt} />
        <div style={{ marginTop: '0.75rem' }}>
          <ResponseInput key={item.q.id} item={item} value={responses[idx]} onChange={set} />
        </div>
      </div>
      <div className="spread" style={{ marginTop: '0.75rem' }}>
        <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
          ← {t('Previous')}
        </button>
        <button className="btn" disabled={idx === items.length - 1} onClick={() => setIdx(idx + 1)}>
          {t('Next')} →
        </button>
      </div>
    </div>
  );
}

function ResponseInput({ item, value, onChange }: { item: MockItem; value: MockResponse; onChange: (r: MockResponse) => void }) {
  const q = item.q;
  const initialOrder = useMemo(() => (q.type === 'order' ? shuffle(q.items) : []), [q]);
  const rights = useMemo(() => (q.type === 'match' ? shuffle(q.pairs.map((p) => p[1])) : []), [q]);
  switch (q.type) {
    case 'mc':
      return (
        <div className="options">
          {q.options.map((o, k) => (
            <button key={k} className={`option ${value.kind === 'mc' && value.choice === k ? 'selected' : ''}`} onClick={() => onChange({ kind: 'mc', choice: k })}>
              <span className="letter">{String.fromCharCode(65 + k)}</span>
              <MathText as="span" text={o} />
            </button>
          ))}
        </div>
      );
    case 'numeric':
    case 'text':
      return (
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <input
            type="text"
            inputMode={q.type === 'numeric' ? 'decimal' : undefined}
            autoComplete="off"
            aria-label="Your answer"
            value={value.kind === 'value' ? value.text : ''}
            onChange={(e) => onChange({ kind: 'value', text: e.target.value })}
            placeholder="Your answer"
          />
          {q.type === 'numeric' && q.numeric.unit && <span className="muted">{q.numeric.unit}</span>}
        </div>
      );
    case 'open':
      return (
        <textarea
          aria-label="Your answer"
          placeholder="Write your answer"
          value={value.kind === 'value' ? value.text : ''}
          onChange={(e) => onChange({ kind: 'value', text: e.target.value })}
        />
      );
    case 'order': {
      const order = value.kind === 'order' && value.order.length ? value.order : initialOrder;
      const move = (i: number, d: -1 | 1) => {
        const j = i + d;
        if (j < 0 || j >= order.length) return;
        const next = [...order];
        [next[i], next[j]] = [next[j], next[i]];
        onChange({ kind: 'order', order: next });
      };
      return (
        <ol className="order-list">
          {order.map((x, i) => (
            <li key={x} className="option">
              <span className="letter">{i + 1}</span>
              <MathText as="span" text={x} className="grow" />
              <button className="btn small icon-btn" aria-label={`Move "${x}" up`} disabled={i === 0} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button className="btn small icon-btn" aria-label={`Move "${x}" down`} disabled={i === order.length - 1} onClick={() => move(i, 1)}>
                ↓
              </button>
            </li>
          ))}
        </ol>
      );
    }
    case 'match': {
      const choice = value.kind === 'match' ? value.choice : {};
      return (
        <div className="match-grid">
          {q.pairs.map(([l]) => (
            <div key={l} className="match-row option">
              <MathText as="span" text={l} className="grow" />
              <select aria-label={`Match for ${l}`} value={choice[l] ?? ''} onChange={(e) => onChange({ kind: 'match', choice: { ...choice, [l]: e.target.value } })}>
                <option value="">— choose —</option>
                {rights.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    case 'structured': {
      const texts = value.kind === 'parts' ? value.texts : q.parts.map(() => '');
      return (
        <div className="stack">
          {q.parts.map((p, i) => (
            <div key={p.label} className="list-item">
              <div className="spread">
                <strong>({p.label})</strong>
                <span className="small muted">[{p.marks}]</span>
              </div>
              <MathText text={p.prompt} />
              {p.numeric || p.accept ? (
                <input
                  type="text"
                  autoComplete="off"
                  aria-label={`Answer to part ${p.label}`}
                  value={texts[i]}
                  placeholder={p.numeric ? 'Final answer' : 'Your answer'}
                  onChange={(e) => onChange({ kind: 'parts', texts: texts.map((t, k) => (k === i ? e.target.value : t)) })}
                  style={{ marginTop: 6 }}
                />
              ) : (
                <textarea
                  aria-label={`Answer to part ${p.label}`}
                  value={texts[i]}
                  placeholder="Write your answer (or work on paper and note key points)"
                  onChange={(e) => onChange({ kind: 'parts', texts: texts.map((t, k) => (k === i ? e.target.value : t)) })}
                  style={{ marginTop: 6, minHeight: 70 }}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
  }
}

interface SelfItem {
  index: number;
  part?: number;
  max: number;
  prompt: string;
  scheme: string;
  answer: string;
}

function MarkPhase({ subject, minutes, items, started, responses, onDone }: {
  subject: SubjectId;
  minutes: number;
  items: MockItem[];
  started: number;
  responses: MockResponse[];
  onDone: (got: number, max: number, rows: { item: MockItem; got: number }[]) => void;
}) {
  const t = useT();
  const { logPractice, saveMock } = useStore();
  const auto = useMemo(() => items.map((it, i) => autoMark(it.q, responses[i])), [items, responses]);
  const selfItems = useMemo(() => {
    const out: SelfItem[] = [];
    items.forEach((it, i) => {
      const q = it.q;
      if (q.type === 'open' && auto[i].total === null) {
        const r = responses[i];
        out.push({ index: i, max: 2, prompt: q.prompt, scheme: q.answer, answer: r.kind === 'value' ? r.text : '' });
      }
      if (q.type === 'structured') {
        auto[i].parts?.forEach((m, p) => {
          if (m === null) {
            const r = responses[i];
            out.push({ index: i, part: p, max: q.parts[p].marks, prompt: `(${q.parts[p].label}) ${q.parts[p].prompt}`, scheme: q.parts[p].scheme, answer: r.kind === 'parts' ? r.texts[p] : '' });
          }
        });
      }
    });
    return out;
  }, [items, auto, responses]);
  const [self, setSelf] = useState<(number | null)[]>(() => selfItems.map(() => null));
  const complete = self.every((x) => x !== null);

  const finish = () => {
    const rows = items.map((item, i) => {
      let got = auto[i].total ?? 0;
      if (auto[i].parts) got = auto[i].parts!.reduce<number>((s, m) => s + (m ?? 0), 0);
      selfItems.forEach((si, k) => {
        if (si.index === i) got += self[k] ?? 0;
      });
      return { item, got: Math.min(item.max, got) };
    });
    const got = rows.reduce((s, r) => s + r.got, 0);
    const max = rows.reduce((s, r) => s + r.item.max, 0);
    const now = Date.now();
    const entries: PracticeLog[] = rows.map((r) => ({
      q: r.item.q.id,
      s: r.item.q.subject,
      tp: r.item.q.topic,
      r: resultFromMarks(r.got, r.item.max),
      t: now,
      m: r.got,
      mx: r.item.max,
    }));
    logPractice(entries);
    saveMock({ id: `mock-${now.toString(36)}`, subject, t: started, minutes, got, max, items: items.length });
    onDone(got, max, rows);
  };

  return (
    <div>
      <h1>{t('Mark your paper')}</h1>
      <p className="muted">
        Multiple choice, numeric and short-answer items have been marked automatically. Mark each written answer below against the scheme,
        strictly, as an examiner would.
      </p>
      {selfItems.length === 0 && <div className="empty">Nothing to self-mark.</div>}
      {selfItems.map((si, k) => (
        <section className="card" key={`${si.index}-${si.part ?? 'q'}`}>
          <div className="small muted">Question {si.index + 1}</div>
          <MathText text={si.prompt} />
          <div className="list-item" style={{ marginTop: 6 }}>
            <div className="small muted">Your answer</div>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{si.answer || '—'}</p>
          </div>
          <div className="feedback info">
            <strong className="small">Mark scheme</strong>
            <MathText text={si.scheme} className="small" />
          </div>
          <div className="row" style={{ marginTop: '0.5rem' }} role="group" aria-label={`Marks for question ${si.index + 1}`}>
            {Array.from({ length: si.max + 1 }, (_, m) => (
              <button key={m} className="chip" aria-pressed={self[k] === m} onClick={() => setSelf(self.map((x, j) => (j === k ? m : x)))}>
                {m}
              </button>
            ))}
            <span className="small muted">/ {si.max}</span>
          </div>
        </section>
      ))}
      <div className="card spread">
        <span className="muted">
          {self.filter((x) => x !== null).length} / {selfItems.length} marked
        </span>
        <button className="btn primary" disabled={!complete} onClick={finish}>
          {t('See results')}
        </button>
      </div>
    </div>
  );
}

function Results({ subject, got, max, rows, onAgain }: { subject: SubjectId; got: number; max: number; rows: { item: MockItem; got: number }[]; onAgain: () => void }) {
  const t = useT();
  const { data } = useStore();
  const pct = (100 * got) / max;
  const estimate = estimateGrade(data, subject);
  const byTopic = new Map<string, { got: number; max: number }>();
  for (const r of rows) {
    const k = r.item.q.topic;
    const v = byTopic.get(k) ?? { got: 0, max: 0 };
    v.got += r.got;
    v.max += r.item.max;
    byTopic.set(k, v);
  }
  const lost = rows.filter((r) => r.got < r.item.max).length;
  return (
    <div>
      <h1>{t('Mock results')}</h1>
      <div className="tiles">
        <div className="tile">
          <div className="label">{t('Score')}</div>
          <div className="value">{Math.round(pct)}%</div>
          <div className="sub">
            {got} / {max} marks
          </div>
        </div>
        <div className="tile">
          <div className="label">This paper ≈ grade</div>
          <div className="value">{gradeFromPercent(pct)}</div>
          <div className="sub">rough guide only</div>
        </div>
        <div className="tile">
          <div className="label">Estimate from recent results</div>
          <div className="value">{estimate ? (estimate.low === estimate.high ? estimate.grade : `${estimate.low}–${estimate.high}`) : '—'}</div>
          <div className="sub">{estimate ? `${estimate.n} results, mean ${Math.round(estimate.percent)}%` : 'needs at least 2 results'}</div>
        </div>
      </div>
      <section className="card" style={{ marginTop: '1rem' }}>
        <h2>{t('By topic')}</h2>
        <HBars items={[...byTopic].map(([tp, v]) => ({ key: tp, name: `${topicLabel(subject, tp)} (${v.got}/${v.max})`, value: v.got / v.max }))} />
      </section>
      <p className="small muted">
        Grade thresholds used: {GRADE_THRESHOLDS.slice(0, -1).map(([g, p]) => `${g} ≥ ${p}%`).join(', ')}. Real IB boundaries differ by subject, level and
        session and include internal assessment, so treat this as an indication, not a prediction. {lost > 0 && data.settings.mistakeCards && `${lost} question${lost === 1 ? '' : 's'} with lost marks were added to your review cards.`}
      </p>
      <div className="row">
        <button className="btn primary" onClick={onAgain}>
          {t('New mock')}
        </button>
        <a className="btn" href={href('/')}>
          {t('Dashboard')}
        </a>
      </div>
    </div>
  );
}
