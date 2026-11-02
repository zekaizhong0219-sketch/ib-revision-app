import { useDeferredValue, useMemo, useState } from 'react';
import { ReportButton } from '../components/ReportButton';
import { useStore } from '../store';
import { SUBJECTS, getSubject, topicLabel } from '../data/syllabus';
import { MathText } from '../components/MathText';
import { SubjectDot } from '../components/ui';
import { formatInterval } from '../lib/srs';
import { isLeech, isMistakeCard } from '../lib/mistakes';
import type { Card, CardKind, SubjectId } from '../types';
import type { Route } from '../router';

const KINDS: CardKind[] = ['definition', 'formula', 'unit', 'command', 'concept', 'fact'];
const PAGE = 40;

type Status = 'all' | 'new' | 'learning' | 'mature' | 'suspended' | 'mine' | 'mistake' | 'leech';

function emptyDraft(subject: SubjectId = 'physics'): Card {
  return { id: '', subject, topic: getSubject(subject).topics[0].id, front: '', back: '', kind: 'concept', custom: true };
}

export default function Cards({ route }: { route?: Route }) {
  const { cards: allCards, data, upsertCustomCard, deleteCustomCard, setSuspended, resetCard, visibleSubjects } = useStore();
  const cards = useMemo(() => allCards.filter((c) => !data.settings.hiddenSubjects.includes(c.subject)), [allCards, data.settings.hiddenSubjects]);
  const [query, setQuery] = useState('');
  const q = useDeferredValue(query.trim().toLowerCase());
  const [subject, setSubject] = useState<SubjectId | 'all'>('all');
  const [topic, setTopic] = useState('all');
  const [kind, setKind] = useState<CardKind | 'all'>('all');
  const [status, setStatus] = useState<Status>(() => (route?.params.get('status') as Status | null) ?? 'all');
  const [limit, setLimit] = useState(PAGE);
  const [draft, setDraft] = useState<Card | null>(null);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      if (subject !== 'all' && c.subject !== subject) return false;
      if (topic !== 'all' && c.topic !== topic) return false;
      if (kind !== 'all' && c.kind !== kind) return false;
      const st = data.cards[c.id];
      if (status === 'new' && st && st.last > 0) return false;
      if (status === 'learning' && !(st && st.last > 0 && st.interval < 21)) return false;
      if (status === 'mature' && !(st && st.interval >= 21)) return false;
      if (status === 'suspended' && !st?.suspended) return false;
      if (status === 'mine' && (!c.custom || isMistakeCard(c))) return false;
      if (status === 'mistake' && !isMistakeCard(c)) return false;
      if (status === 'leech' && !isLeech(st)) return false;
      if (q && !(c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [cards, data.cards, subject, topic, kind, status, q]);

  const saveDraft = () => {
    if (!draft || !draft.front.trim() || !draft.back.trim()) return;
    upsertCustomCard({ ...draft, id: draft.id || `u-${Date.now().toString(36)}`, front: draft.front.trim(), back: draft.back.trim() });
    setDraft(null);
  };

  return (
    <div>
      <div className="spread">
        <h1>Card library</h1>
        <button className="btn primary" onClick={() => setDraft(emptyDraft(subject === 'all' ? (visibleSubjects[0]?.id ?? 'physics') : subject))}>
          + New card
        </button>
      </div>

      {draft && <Editor draft={draft} setDraft={setDraft} onSave={saveDraft} />}

      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="form-grid">
          <label className="field">
            <span>Search</span>
            <input type="search" placeholder="e.g. entropy, Snell, binomial" value={query} onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }} />
          </label>
          <label className="field">
            <span>Subject</span>
            <select value={subject} onChange={(e) => { setSubject(e.target.value as SubjectId | 'all'); setTopic('all'); setLimit(PAGE); }}>
              <option value="all">All subjects</option>
              {visibleSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Topic</span>
            <select value={topic} disabled={subject === 'all'} onChange={(e) => { setTopic(e.target.value); setLimit(PAGE); }}>
              <option value="all">All topics</option>
              {subject !== 'all' && getSubject(subject).topics.map((t) => <option key={t.id} value={t.id}>{topicLabel(subject, t.id)}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Type</span>
            <select value={kind} onChange={(e) => setKind(e.target.value as CardKind | 'all')}>
              <option value="all">All types</option>
              {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              <option value="all">Any</option>
              <option value="new">New</option>
              <option value="learning">Learning (&lt; 21 d)</option>
              <option value="mature">Mature (≥ 21 d)</option>
              <option value="suspended">Suspended</option>
              <option value="mine">My cards</option>
              <option value="mistake">Mistake notebook</option>
              <option value="leech">Leeches (5+ lapses)</option>
            </select>
          </label>
        </div>
      </div>

      <p className="muted small" style={{ margin: '1rem 0 0.5rem' }}>{filtered.length} cards</p>
      <div className="list">
        {filtered.slice(0, limit).map((c) => {
          const st = data.cards[c.id];
          return (
            <div className="list-item" key={c.id}>
              <div className="meta small muted">
                <SubjectDot subject={c.subject} /> {topicLabel(c.subject, c.topic)}
                <span className="badge">{c.kind}</span>
                {c.custom && <span className="badge">mine</span>}
                {st?.suspended && <span className="badge bad">suspended</span>}
                {st && st.last > 0 && (
                  <span className="badge good" title={`ease ${st.ef.toFixed(2)} · ${st.lapses} lapses · due ${new Date(st.due).toLocaleDateString()}`}>
                    {formatInterval(st.interval)}
                  </span>
                )}
              </div>
              <MathText text={c.front} />
              <details>
                <summary className="small muted">Answer & actions</summary>
                <MathText text={c.back} />
                <div className="row" style={{ marginTop: '0.5rem' }}>
                  <button className="btn small" onClick={() => setSuspended(c.id, !st?.suspended)}>{st?.suspended ? 'Unsuspend' : 'Suspend'}</button>
                  {st && st.last > 0 && <button className="btn small" onClick={() => resetCard(c.id)}>Reset progress</button>}
                  {!c.custom && <ReportButton item={c.id} subject={c.subject} excerpt={c.front} />}
                  {c.custom && (
                    <>
                      <button className="btn small" onClick={() => { setDraft(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
                      <button className="btn small danger" onClick={() => { if (window.confirm('Delete this card?')) deleteCustomCard(c.id); }}>Delete</button>
                    </>
                  )}
                </div>
              </details>
            </div>
          );
        })}
      </div>
      {filtered.length > limit && (
        <div className="center" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setLimit((l) => l + PAGE)}>Show more</button>
        </div>
      )}
      {filtered.length === 0 && <div className="empty">No cards match these filters.</div>}
    </div>
  );
}

function Editor({ draft, setDraft, onSave }: { draft: Card; setDraft: (c: Card | null) => void; onSave: () => void }) {
  const subj = getSubject(draft.subject);
  return (
    <section className="card" style={{ marginTop: '1rem' }}>
      <h2>{draft.id ? 'Edit card' : 'New card'}</h2>
      <form className="stack" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
        <div className="form-grid">
          <label className="field">
            <span>Subject</span>
            <select value={draft.subject} onChange={(e) => {
              const s = e.target.value as SubjectId;
              setDraft({ ...draft, subject: s, topic: getSubject(s).topics[0].id });
            }}>
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Topic</span>
            <select value={draft.topic} onChange={(e) => setDraft({ ...draft, topic: e.target.value })}>
              {subj.topics.map((t) => <option key={t.id} value={t.id}>{topicLabel(draft.subject, t.id)}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Type</span>
            <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as CardKind })}>
              {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-2">
          <label className="field">
            <span>Front</span>
            <textarea value={draft.front} onChange={(e) => setDraft({ ...draft, front: e.target.value })} required placeholder="Question or term. Maths: $E = mc^2$" />
          </label>
          <label className="field">
            <span>Back</span>
            <textarea value={draft.back} onChange={(e) => setDraft({ ...draft, back: e.target.value })} required placeholder="Answer. Chemistry: $\ce{2H2 + O2 -> 2H2O}$" />
          </label>
        </div>
        <div className="grid grid-2">
          <div className="list-item"><div className="small muted">Preview — front</div><MathText text={draft.front || '…'} /></div>
          <div className="list-item"><div className="small muted">Preview — back</div><MathText text={draft.back || '…'} /></div>
        </div>
        <p className="small muted">
          Formatting: <code>$…$</code> inline maths, <code>$$…$$</code> display maths, <code>\ce{'{…}'}</code> chemical equations (inside $…$), <code>**bold**</code>, new lines are kept.
        </p>
        <div className="row">
          <button className="btn primary" type="submit">Save card</button>
          <button className="btn ghost" type="button" onClick={() => setDraft(null)}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
