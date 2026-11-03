import { useT } from '../i18n';
import { useState } from 'react';
import { useStore } from '../store';
import { calibrate, estimateGrade } from '../lib/grades';
import { SubjectDot } from './ui';
import type { SubjectId } from '../types';

const toDateInput = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Verdict on how far the app's estimate is from school results (in percentage points). */
function verdict(bias: number): string {
  const b = Math.round(Math.abs(bias));
  if (b < 5) return `close to your school marks (within ${b} points)`;
  return bias > 0
    ? `${b} points above your school marks: your self-marking is probably lenient, so mark more strictly against the scheme`
    : `${b} points below your school marks: the app's papers may be harder than your school's, or your self-marking strict`;
}

/**
 * Real school results and how they compare with the app's grade estimate. The comparison is
 * per subject and uses the app's estimate as of each assessment date (see `calibrate`).
 */
export function SchoolResults() {
  const t = useT();
  const { data, visibleSubjects, addSchoolResult, deleteSchoolResult } = useStore();
  const [subject, setSubject] = useState<SubjectId>(visibleSubjects[0]?.id ?? 'physics');
  const [date, setDate] = useState(toDateInput(Date.now()));
  const [label, setLabel] = useState('');
  const [got, setGot] = useState('');
  const [max, setMax] = useState('');
  const [grade, setGrade] = useState('');
  const [open, setOpen] = useState(false);

  const g = Number(got.replace(',', '.'));
  const m = Number(max.replace(',', '.'));
  const valid = got !== '' && max !== '' && Number.isFinite(g) && Number.isFinite(m) && m > 0 && g >= 0 && g <= m && !!date;

  const add = () => {
    if (!valid) return;
    const gr = Number(grade);
    addSchoolResult({
      subject,
      t: new Date(`${date}T12:00`).getTime(),
      label: label.trim() || 'School assessment',
      got: g,
      max: m,
      ...(gr >= 1 && gr <= 7 ? { grade: gr } : {}),
    });
    setLabel('');
    setGot('');
    setMax('');
    setGrade('');
  };

  const rows = visibleSubjects.map((s) => ({ s, cal: calibrate(data, s.id), est: estimateGrade(data, s.id) })).filter((r) => r.cal);

  return (
    <section className="card" style={{ marginTop: '1rem' }}>
      <div className="spread">
        <h2 style={{ margin: 0 }}>{t('School results')}</h2>
        <button className="btn small" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? t('Close') : t('Add a result')}
        </button>
      </div>
      <p className="small muted">
        Enter marks from real school tests and mocks. The app compares each one with its own estimate on that date, so you can see whether
        its estimates (and your self-marking) run high or low, and get an adjusted estimate.
      </p>
      {open && (
        <div className="stack" style={{ marginBottom: '1rem' }}>
          <div className="row">
            {visibleSubjects.map((s) => (
              <button key={s.id} className="chip" aria-pressed={subject === s.id} onClick={() => setSubject(s.id)}>
                <SubjectDot subject={s.id} /> {s.short}
              </button>
            ))}
          </div>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <label className="small">
              Date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="small" style={{ flex: '1 1 12rem' }}>
              Name{' '}
              <input type="text" value={label} placeholder="e.g. Mock Paper 2" onChange={(e) => setLabel(e.target.value)} maxLength={120} />
            </label>
          </div>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <label className="small">
              Mark <input type="text" inputMode="decimal" value={got} onChange={(e) => setGot(e.target.value)} style={{ width: '5rem' }} />
            </label>
            <label className="small">
              out of <input type="text" inputMode="decimal" value={max} onChange={(e) => setMax(e.target.value)} style={{ width: '5rem' }} />
            </label>
            <label className="small">
              Grade given (optional){' '}
              <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option value="">—</option>
                {[7, 6, 5, 4, 3, 2, 1].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn primary small" disabled={!valid} onClick={add}>
              {t('Save')}
            </button>
          </div>
          {got !== '' && max !== '' && !valid && <p className="small" style={{ color: 'var(--warn)' }}>The mark must be between 0 and the maximum.</p>}
        </div>
      )}
      {rows.length === 0 ? (
        <p className="small muted">No school results yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="data" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Subject</th>
                <th>School (last 3)</th>
                <th>App estimate</th>
                <th>Gap</th>
                <th>Adjusted estimate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ s, cal, est }) =>
                cal ? (
                  <tr key={s.id}>
                    <td style={{ textAlign: 'left' }}>
                      <SubjectDot subject={s.id} /> {s.short}
                    </td>
                    <td>
                      {Math.round(cal.schoolPct)}%{cal.schoolGrade ? ` · grade ${cal.schoolGrade}` : ''}
                    </td>
                    <td>{est ? `${Math.round(est.percent)}% · ${est.low === est.high ? est.grade : `${est.low}–${est.high}`}` : '—'}</td>
                    <td>{cal.bias === null ? '—' : `${cal.bias > 0 ? '+' : ''}${Math.round(cal.bias)} pts`}</td>
                    <td>
                      {cal.adjusted
                        ? `${Math.round(cal.adjusted.percent)}% · ${cal.adjusted.low === cal.adjusted.high ? cal.adjusted.grade : `${cal.adjusted.low}–${cal.adjusted.high}`}`
                        : '—'}
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
        </div>
      )}
      {rows.map(({ s, cal }) =>
        cal && cal.bias !== null ? (
          <p key={s.id} className="small" style={{ margin: '0.4rem 0 0' }}>
            <SubjectDot subject={s.id} /> <strong>{s.short}</strong>: the app's estimate has been {verdict(cal.bias)} ({cal.pairs} comparison
            {cal.pairs === 1 ? '' : 's'}
            {cal.pairs < 3 ? '; treat this as provisional until you have 3' : ''}).
          </p>
        ) : null,
      )}
      {rows.some(({ cal }) => cal && cal.bias === null) && (
        <p className="small muted">
          A gap appears once the app has its own estimate (2 mocks or self-marked essays) from before the date of a school result.
        </p>
      )}
      {data.school.length > 0 && (
        <details style={{ marginTop: '0.75rem' }}>
          <summary className="small">All entered results ({data.school.length})</summary>
          <div className="list" style={{ marginTop: '0.5rem' }}>
            {[...data.school].reverse().map((r) => (
              <div className="list-item spread" key={r.id}>
                <span className="small">
                  <SubjectDot subject={r.subject} /> {new Date(r.t).toLocaleDateString()} · {r.label} · {r.got}/{r.max} (
                  {Math.round((100 * r.got) / r.max)}%){r.grade ? ` · grade ${r.grade}` : ''}
                </span>
                <button className="btn small" onClick={() => deleteSchoolResult(r.id)} aria-label={`Delete ${r.label}`}>
                  {t('Delete')}
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
      <p className="small muted" style={{ marginTop: '0.5rem' }}>
        School papers vary in difficulty and use their own boundaries, so the gap is a rough correction, not a prediction.
      </p>
    </section>
  );
}
