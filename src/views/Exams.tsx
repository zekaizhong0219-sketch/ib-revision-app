import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { SUBJECTS, getSubject } from '../data/syllabus';
import { SubjectDot } from '../components/ui';
import type { Exam, SubjectId } from '../types';
import { href } from '../router';

// eslint-disable-next-line react-refresh/only-export-components
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

// eslint-disable-next-line react-refresh/only-export-components
export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

function Countdown({ target, now }: { target: number; now: number }) {
  const d = splitDuration(target - now);
  return (
    <div className="countdown" aria-label={`${d.days} days ${d.hours} hours ${d.minutes} minutes`}>
      {(
        [
          ['days', d.days],
          ['hrs', d.hours],
          ['min', d.minutes],
          ['sec', d.seconds],
        ] as const
      ).map(([l, v]) => (
        <div className="unit" key={l}>
          <div className="num">{l === 'days' ? v : String(v).padStart(2, '0')}</div>
          <div className="lbl">{l}</div>
        </div>
      ))}
    </div>
  );
}

const sortExams = (exams: Exam[]) => [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export function NextExamBanner() {
  const { data } = useStore();
  const now = useNow();
  const next = sortExams(data.settings.exams).find((e) => new Date(e.date).getTime() > now);
  if (!next) {
    return (
      <div className="card" style={{ marginTop: '1rem' }}>
        <span className="muted">No upcoming exams set. </span>
        <a href={href('/exams')}>Add your exam dates →</a>
      </div>
    );
  }
  return (
    <a href={href('/exams')} className="card spread" style={{ marginTop: '1rem', textDecoration: 'none', color: 'inherit' }}>
      <div>
        <div className="small muted">Next exam</div>
        <strong>
          {next.subject && <SubjectDot subject={next.subject} />} {next.name}
        </strong>
        <div className="small muted">{new Date(next.date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</div>
      </div>
      <Countdown target={new Date(next.date).getTime()} now={now} />
    </a>
  );
}

const blank = (): Exam => ({ id: `ex-${Date.now().toString(36)}`, name: '', date: '' });

export default function Exams() {
  const { data, updateSettings } = useStore();
  const now = useNow();
  const [draft, setDraft] = useState<Exam>(blank);
  const exams = sortExams(data.settings.exams);

  const save = () => {
    if (!draft.name.trim() || !draft.date) return;
    const others = data.settings.exams.filter((e) => e.id !== draft.id);
    updateSettings({ exams: [...others, { ...draft, name: draft.name.trim() }] });
    setDraft(blank());
  };
  const remove = (id: string) => updateSettings({ exams: data.settings.exams.filter((e) => e.id !== id) });

  return (
    <div>
      <h1>Exam countdown</h1>
      <p className="muted">
        Add each paper from your official May/November timetable. Exams within 30 days boost that subject in the “what to revise next” recommendations.
      </p>

      <div className="list">
        {exams.length === 0 && <div className="empty">No exams yet — add one below.</div>}
        {exams.map((e) => {
          const t = new Date(e.date).getTime();
          const past = t <= now;
          return (
            <div className="list-item spread" key={e.id}>
              <div>
                <strong>
                  {e.subject && <SubjectDot subject={e.subject} />} {e.name}
                </strong>
                <div className="small muted">
                  {Number.isFinite(t) ? new Date(t).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Invalid date'}
                  {e.subject && ` · ${getSubject(e.subject).name}`}
                </div>
              </div>
              <div className="row">
                {past ? <span className="badge">done</span> : <Countdown target={t} now={now} />}
                <button className="btn small" onClick={() => setDraft(e)}>
                  Edit
                </button>
                <button className="btn small danger" onClick={() => remove(e.id)} aria-label={`Delete ${e.name}`}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h2>{data.settings.exams.some((e) => e.id === draft.id) ? 'Edit exam' : 'Add exam'}</h2>
        <form
          className="form-grid"
          onSubmit={(ev) => {
            ev.preventDefault();
            save();
          }}
        >
          <label className="field">
            <span>Name</span>
            <input type="text" value={draft.name} placeholder="e.g. Physics Paper 1" onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
          </label>
          <label className="field">
            <span>Date & time</span>
            <input type="datetime-local" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} required />
          </label>
          <label className="field">
            <span>Subject (optional)</span>
            <select value={draft.subject ?? ''} onChange={(e) => setDraft({ ...draft, subject: (e.target.value || undefined) as SubjectId | undefined })}>
              <option value="">—</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <div className="row" style={{ alignSelf: 'end' }}>
            <button className="btn primary" type="submit">
              Save
            </button>
            <button className="btn ghost" type="button" onClick={() => setDraft(blank())}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
