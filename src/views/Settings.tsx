import { useRef, useState } from 'react';
import { UI_LANGS, useT } from '../i18n';
import { useStore } from '../store';
import { defaultData, exportData, importData, mergeData } from '../lib/storage';
import { SubjectChips } from '../components/ui';
import { SUBJECT_IDS } from '../data/subjectIds';
import { ALL_CARDS } from '../data/cards';
import { ALL_QUESTIONS } from '../data/questions';
import { SHORTCUTS } from '../components/Shortcuts';
import type { AppData, ContentReport, ThemePref } from '../types';

export default function Settings() {
  const t = useT();
  const { data, updateSettings, replaceData, saveOk, clearReports, cardById } = useStore();
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
      <h1>{t('Settings')}</h1>
      {!saveOk && (
        <div className="feedback no" style={{ marginBottom: '1rem' }}>
          Your browser is blocking local storage (private mode or storage full). Progress will be lost when you close this tab — export a backup.
        </div>
      )}

      <section className="card stack">
        <h2>{t('Appearance')}</h2>
        <div className="row" role="group" aria-label="Theme">
          {(['system', 'light', 'dark'] as ThemePref[]).map((t) => (
            <button key={t} className="chip" aria-pressed={s.theme === t} onClick={() => updateSettings({ theme: t })}>
              {t === 'system' ? 'Match system' : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div>
          <h3>{t('Interface language')}</h3>
          <div className="row" role="group" aria-label="Interface language">
            {UI_LANGS.map((l) => (
              <button key={l.id} className="chip" aria-pressed={s.uiLang === l.id} onClick={() => updateSettings({ uiLang: l.id })}>
                {l.label}
              </button>
            ))}
          </div>
          <p className="small muted">Changes menus and buttons. Study content stays in each subject's own language.</p>
        </div>
      </section>

      <section className="card stack">
        <h2>{t('Study')}</h2>
        <div>
          <h3>{t('My subjects')}</h3>
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
        <h2>{t('Scheduling algorithm')}</h2>
        <div className="row" role="group" aria-label="Scheduling algorithm">
          <button className="chip" aria-pressed={s.scheduler === 'fsrs'} onClick={() => updateSettings({ scheduler: 'fsrs' })}>
            FSRS-4.5 ({t('recommended')})
          </button>
          <button className="chip" aria-pressed={s.scheduler === 'sm2'} onClick={() => updateSettings({ scheduler: 'sm2' })}>
            SM-2 ({t('classic')})
          </button>
        </div>
        {s.scheduler === 'fsrs' && (
          <label className="field">
            <span>
              {t('Target recall')}: {Math.round(s.retention * 100)}%
            </span>
            <input
              type="range"
              min={0.8}
              max={0.97}
              step={0.01}
              value={s.retention}
              onChange={(e) => updateSettings({ retention: Number(e.target.value) })}
              aria-label="Target recall"
            />
          </label>
        )}
        <p className="small muted">
          FSRS models each card's memory stability and difficulty, and schedules it when your chance of recalling it drops to the target. It
          usually needs fewer reviews than SM-2 for the same retention. Higher targets mean more reviews: 90% is a good default, 93–95% in the
          last weeks before exams. Existing progress converts automatically the next time each card is reviewed, and you can switch back at any
          time.
        </p>
      </section>

      <section className="card stack">
        <h2>{t('Mistake notebook')}</h2>
        <label className="row" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={s.mistakeCards} onChange={(e) => updateSettings({ mistakeCards: e.target.checked })} />
          Turn practice and mock questions I get wrong (or partly wrong) into review cards
        </label>
        <p className="small muted">Find them in the Library under Status → Mistake notebook. They are scheduled like any other card.</p>
      </section>

      <section className="card stack">
        <h2>{t('Backup')}</h2>
        <p className="muted small">
          All progress lives only in this browser’s local storage. Export a JSON backup regularly (e.g. weekly) and import it to restore or to move to another device.
        </p>
        <div className="row">
          <button className="btn primary" onClick={doExport}>{t('Export backup')}</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>{t('Import backup…')}</button>
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
              <button className="btn ghost" onClick={() => setPending(null)}>{t('Cancel')}</button>
            </div>
          </div>
        )}
        {msg && <div className={`feedback ${msg.ok ? 'ok' : 'no'}`}>{msg.text}</div>}
      </section>

      <section className="card stack">
        <h2>Reported mistakes ({data.reports.length})</h2>
        {data.reports.length === 0 ? (
          <p className="small muted">Use "⚑ Report a mistake" under any card or question to note a possible error. Your notes are listed here.</p>
        ) : (
          <>
            <div className="list">
              {data.reports.map((r) => (
                <div className="list-item small" key={r.id}>
                  <div className="meta muted">
                    {new Date(r.t).toLocaleDateString()} · {r.subject} · <code>{r.item}</code>
                    {cardById.has(r.item) ? '' : ' (question)'}
                  </div>
                  <div className="muted">{r.excerpt}</div>
                  <div>→ {r.note}</div>
                </div>
              ))}
            </div>
            <div className="row">
              <button className="btn" onClick={() => downloadText(`ib-revision-reports-${new Date().toISOString().slice(0, 10)}.md`, reportsMarkdown(data.reports))}>
                Export as Markdown
              </button>
              <button className="btn danger" onClick={() => window.confirm('Delete all reports?') && clearReports()}>
                {t('Clear')}
              </button>
            </div>
          </>
        )}
      </section>

      <section className="card stack">
        <h2>{t('Keyboard shortcuts')}</h2>
        <table className="keys">
          <tbody>
            {SHORTCUTS.map(([k, d]) => (
              <tr key={k}><td><kbd>{k}</kbd></td><td>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card stack">
        <h2>{t('Danger zone')}</h2>
        <button
          className="btn danger"
          onClick={() => {
            if (window.confirm('Delete ALL progress, custom cards and settings? Export a backup first if unsure.')) {
              replaceData(defaultData());
              setMsg({ ok: true, text: 'All data reset.' });
            }
          }}
        >
          {t('Reset all data')}
        </button>
      </section>

      <p className="small muted center" style={{ marginTop: '1.5rem' }}>
        IB Revision v{__APP_VERSION__} · {ALL_CARDS.length} cards · {ALL_QUESTIONS.length} practice questions · Not affiliated with or endorsed by the International Baccalaureate Organization.
      </p>
    </div>
  );
}

function reportsMarkdown(reports: ContentReport[]): string {
  const lines = ['# Reported content mistakes', '', `Exported ${new Date().toISOString().slice(0, 10)}. Item ids refer to src/data in the ib-revision-app repository.`, ''];
  for (const r of reports) {
    lines.push(`## ${r.subject} · \`${r.item}\``, '', `> ${r.excerpt.replace(/\n/g, ' ')}`, '', r.note, '', `_${new Date(r.t).toISOString().slice(0, 10)}_`, '');
  }
  return lines.join('\n');
}

function downloadText(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
