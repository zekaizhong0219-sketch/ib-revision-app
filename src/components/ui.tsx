import { useMemo, useState, type ReactNode } from 'react';
import { useT } from '../i18n';
import type { SubjectId } from '../types';
import { SUBJECTS as SUBJECT_LIST, getSubject } from '../data/syllabus';
import { useStore } from '../store';

const ICON_PATHS: Record<string, string> = {
  home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  cards: 'M4 6h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm4-4h12a2 2 0 0 1 2 2v12',
  timer: 'M12 8v5l3 2M9 2h6M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  library: 'M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.5l3.8 1-4 15.5-3.8-1z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14.5 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  auto: 'M12 3a9 9 0 1 0 0 18V3z M12 3a9 9 0 0 1 0 18',
  keyboard: 'M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10',
  pen: 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
};

export function Icon({ name, className = 'icon' }: { name: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name] ?? ''} />
    </svg>
  );
}

export function SubjectDot({ subject }: { subject: SubjectId }) {
  return <span className="dot" style={{ background: getSubject(subject).color }} />;
}

export function SubjectChips({ value, onChange, multi = true, all = false }: { value: SubjectId[]; onChange: (v: SubjectId[]) => void; multi?: boolean; all?: boolean }) {
  const t = useT();
  const { visibleSubjects } = useStore();
  // `all` shows hidden subjects too (used in Settings, where you choose what to hide).
  const list = all ? SUBJECT_LIST : visibleSubjects;
  return (
    <div className="row" role="group" aria-label={t('Subjects')}>
      {list.map((s) => {
        const on = value.includes(s.id);
        return (
          <button
            key={s.id}
            type="button"
            className="chip"
            aria-pressed={on}
            onClick={() => {
              if (!multi) return onChange([s.id]);
              const next = on ? value.filter((x) => x !== s.id) : [...value, s.id];
              onChange(next.length ? next : value);
            }}
          >
            <SubjectDot subject={s.id} /> {s.name}
          </button>
        );
      })}
    </div>
  );
}

/** Topic multi-select grouped by theme. Value uses "subject|topic" keys; empty array = all. */
export function TopicPicker({ subjects, value, onChange }: { subjects: SubjectId[]; value: string[]; onChange: (v: string[]) => void }) {
  const t = useT();
  const [open, setOpen] = useState(value.length > 0);
  const groups = useMemo(() => {
    const out: { label: string; subject: SubjectId; topics: { key: string; id: string; name: string; ahl?: boolean }[] }[] = [];
    for (const sid of subjects) {
      const s = getSubject(sid);
      for (const t of s.topics) {
        const label = `${s.short} · ${t.theme}`;
        let g = out.find((x) => x.label === label);
        if (!g) out.push((g = { label, subject: sid, topics: [] }));
        g.topics.push({ key: `${sid}|${t.id}`, id: t.id, name: t.name, ahl: t.ahl });
      }
    }
    return out;
  }, [subjects]);
  const valid = value.filter((k) => subjects.includes(k.split('|')[0] as SubjectId));
  const toggle = (k: string) => onChange(valid.includes(k) ? valid.filter((x) => x !== k) : [...valid, k]);
  return (
    <div>
      <div className="row">
        <button type="button" className="btn small" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? t('Hide topics') : t('Choose topics')}
        </button>
        <span className="muted small">{valid.length ? `${valid.length} topic${valid.length > 1 ? 's' : ''} selected` : t('All topics')}</span>
        {valid.length > 0 && (
          <button type="button" className="btn small ghost" onClick={() => onChange([])}>
            {t('Clear')}
          </button>
        )}
      </div>
      {open && (
        <div className="stack" style={{ marginTop: '0.75rem' }}>
          {groups.map((g) => (
            <div key={g.label}>
              <div className="small muted" style={{ marginBottom: 4 }}>
                <SubjectDot subject={g.subject} /> {g.label}
              </div>
              <div className="row">
                {g.topics.map((t) => (
                  <button key={t.key} type="button" className="chip" aria-pressed={valid.includes(t.key)} onClick={() => toggle(t.key)}>
                    {t.id === 'CT' ? t.name : `${t.id} ${t.name}`}
                    {t.ahl && <span className="badge ahl">AHL</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Tile({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="tile">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <div style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
    </div>
  );
}
