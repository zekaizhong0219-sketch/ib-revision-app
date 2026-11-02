import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { getSubject } from '../data/syllabus';
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
  const upcoming = sortExams(data.settings.exams).filter((e) => new Date(e.date).getTime() > now);
  const next = upcoming.find((e) => e.kind !== 'deadline') ?? upcoming[0];
  const nextDeadline = upcoming.find((e) => e.kind === 'deadline' && e !== next);
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
        <div className="small muted">{next.kind === 'deadline' ? 'Next deadline' : 'Next exam'}</div>
        <strong>
          {next.subject && <SubjectDot subject={next.subject} />} {next.name}
        </strong>
        <div className="small muted">{new Date(next.date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</div>
        {nextDeadline && (
          <div className="small" style={{ marginTop: 4 }}>
            <span className="badge">deadline</span> {nextDeadline.name} · {Math.ceil((new Date(nextDeadline.date).getTime() - now) / 86400000)} d
          </div>
        )}
      </div>
      <Countdown target={new Date(next.date).getTime()} now={now} />
    </a>
  );
}

const blank = (): Exam => ({ id: `ex-${Date.now().toString(36)}`, name: '', date: '', kind: 'exam' });

export default function Exams() {
  const { data, updateSettings, visibleSubjects } = useStore();
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
      <h1>Exams & deadlines</h1>
      <p className="muted">
        Add each paper from your official timetable, plus coursework and oral deadlines (IO, History IA, EE, TOK). Exams within 30 days boost that
        subject in the recommendations and the daily plan; deadlines are shown as reminders only.
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
                  {e.subject && <SubjectDot subject={e.subject} />} {e.name} {e.kind === 'deadline' && <span className="badge">deadline</span>}
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
        <h2>{data.settings.exams.some((e) => e.id === draft.id) ? 'Edit' : 'Add exam or deadline'}</h2>
        <form
          className="form-grid"
          onSubmit={(ev) => {
            ev.preventDefault();
            save();
          }}
        >
          <label className="field">
            <span>Name</span>
            <input type="text" value={draft.name} placeholder="e.g. Physics Paper 1, Spanish IO" onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
          </label>
          <label className="field">
            <span>Date & time</span>
            <input type="datetime-local" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} required />
          </label>
          <label className="field">
            <span>Subject (optional)</span>
            <select value={draft.subject ?? ''} onChange={(e) => setDraft({ ...draft, subject: (e.target.value || undefined) as SubjectId | undefined })}>
              <option value="">—</option>
              {visibleSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Type</span>
            <select value={draft.kind ?? 'exam'} onChange={(e) => setDraft({ ...draft, kind: e.target.value as Exam['kind'] })}>
              <option value="exam">Exam paper</option>
              <option value="deadline">Deadline (IO, IA, EE, TOK…)</option>
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
