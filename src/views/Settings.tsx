import { useRef, useState } from 'react';
import { useStore } from '../store';
import { defaultData, exportData, importData, mergeData } from '../lib/storage';
import { SubjectChips } from '../components/ui';
import { SUBJECT_IDS } from '../data/subjectIds';
import { ALL_CARDS } from '../data/cards';
import { ALL_QUESTIONS } from '../data/questions';
import { SHORTCUTS } from '../components/Shortcuts';
import type { AppData, ThemePref } from '../types';

export default function Settings() {
  const { data, updateSettings, replaceData, saveOk } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<AppData | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const s = data.settings;

  const doExport = () => {
    const blob = new Blob([exportData(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ib-revision-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg({ ok: true, text: 'Backup downloaded.' });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      const parsed = importData(await f.text());
      setPending(parsed);
      setMsg(null);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Import failed.' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      {!saveOk && (
        <div className="feedback no" style={{ marginBottom: '1rem' }}>
          Your browser is blocking local storage (private mode or storage full). Progress will be lost when you close this tab — export a backup.
        </div>
      )}

      <section className="card stack">
        <h2>Appearance</h2>
        <div className="row" role="group" aria-label="Theme">
          {(['system', 'light', 'dark'] as ThemePref[]).map((t) => (
            <button key={t} className="chip" aria-pressed={s.theme === t} onClick={() => updateSettings({ theme: t })}>
              {t === 'system' ? 'Match system' : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h2>Study</h2>
        <div>
          <h3>My subjects</h3>
          <p className="small muted">Subjects you don't take can be hidden everywhere. Your progress in them is kept.</p>
          <SubjectChips
            all
            value={SUBJECT_IDS.filter((id) => !s.hiddenSubjects.includes(id))}
            onChange={(shown) => updateSettings({ hiddenSubjects: SUBJECT_IDS.filter((id) => !shown.includes(id)) })}
          />
        </div>
        <div>
          <h3>Included in reviews, recommendations and the daily plan</h3>
          <SubjectChips value={s.enabledSubjects} onChange={(v) => updateSettings({ enabledSubjects: v })} />
        </div>
        <div className="form-grid">
          <label className="field">
            <span>New cards per day</span>
            <input type="number" min={0} max={500} value={s.newPerDay} onChange={(e) => updateSettings({ newPerDay: Math.max(0, Math.min(500, Number(e.target.value) || 0)) })} />
          </label>
          <label className="field">
            <span>Daily study budget (minutes)</span>
            <input type="number" min={10} max={600} step={5} value={s.dailyMinutes} onChange={(e) => updateSettings({ dailyMinutes: Math.max(10, Math.min(600, Number(e.target.value) || 10)) })} />
          </label>
          <label className="field">
            <span>Max cards per session</span>
            <input type="number" min={5} max={1000} value={s.maxReviewsPerSession} onChange={(e) => updateSettings({ maxReviewsPerSession: Math.max(5, Math.min(1000, Number(e.target.value) || 5)) })} />
          </label>
        </div>
        <p className="small muted">
          With ≈ {ALL_CARDS.length} built-in cards, 20 new cards per day covers everything in about {Math.ceil(ALL_CARDS.length / 20)} days. Reviews of
          learned cards are always shown regardless of this limit. The daily budget drives the plan on the Dashboard.
        </p>
      </section>

      <section className="card stack">
        <h2>Mistake notebook</h2>
        <label className="row" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={s.mistakeCards} onChange={(e) => updateSettings({ mistakeCards: e.target.checked })} />
          Turn practice and mock questions I get wrong (or partly wrong) into review cards
        </label>
        <p className="small muted">Find them in the Library under Status → Mistake notebook. They are scheduled like any other card.</p>
      </section>

      <section className="card stack">
        <h2>Backup</h2>
        <p className="muted small">
          All progress lives only in this browser’s local storage. Export a JSON backup regularly (e.g. weekly) and import it to restore or to move to another device.
        </p>
        <div className="row">
          <button className="btn primary" onClick={doExport}>Export backup</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Import backup…</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
        {pending && (
          <div className="feedback info">
            <p>
              Backup contains {Object.keys(pending.cards).length} card states, {pending.reviews.length} reviews, {pending.practice.length} practice answers and{' '}
              {pending.customCards.length} custom cards. How should it be applied?
            </p>
            <div className="row">
              <button className="btn primary" onClick={() => { replaceData(mergeData(data, pending)); setPending(null); setMsg({ ok: true, text: 'Backup merged.' }); }}>
                Merge (keep newest progress)
              </button>
              <button className="btn danger" onClick={() => { replaceData(pending); setPending(null); setMsg({ ok: true, text: 'Data replaced from backup.' }); }}>
                Replace everything
              </button>
              <button className="btn ghost" onClick={() => setPending(null)}>Cancel</button>
            </div>
          </div>
        )}
        {msg && <div className={`feedback ${msg.ok ? 'ok' : 'no'}`}>{msg.text}</div>}
      </section>

      <section className="card stack">
        <h2>Keyboard shortcuts</h2>
        <table className="keys">
          <tbody>
            {SHORTCUTS.map(([k, d]) => (
              <tr key={k}><td><kbd>{k}</kbd></td><td>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card stack">
        <h2>Danger zone</h2>
        <button
          className="btn danger"
          onClick={() => {
            if (window.confirm('Delete ALL progress, custom cards and settings? Export a backup first if unsure.')) {
              replaceData(defaultData());
              setMsg({ ok: true, text: 'All data reset.' });
            }
          }}
        >
          Reset all data
        </button>
      </section>

      <p className="small muted center" style={{ marginTop: '1.5rem' }}>
        IB Revision v{__APP_VERSION__} · {ALL_CARDS.length} cards · {ALL_QUESTIONS.length} practice questions · Not affiliated with or endorsed by the International Baccalaureate Organization.
      </p>
    </div>
  );
}
