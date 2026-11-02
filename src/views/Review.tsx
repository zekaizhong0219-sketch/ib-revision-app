import { useCallback, useEffect, useMemo, useState } from 'react';
import { useT } from '../i18n';
import { ReportButton } from '../components/ReportButton';
import { useStore } from '../store';
import { buildQueue, matchesFilter, queueCounts, shuffle } from '../lib/queue';
import { formatInterval, previewWith } from '../lib/srs';
import { topicLabel } from '../data/syllabus';
import { MathText } from '../components/MathText';
import { ProgressBar, SubjectChips, SubjectDot, TopicPicker } from '../components/ui';
import { href, navigate, type Route } from '../router';
import type { Card, Grade, SubjectId } from '../types';

const GRADES: { g: Grade; label: string; key: string }[] = [
  { g: 'again', label: 'Again', key: '1' },
  { g: 'hard', label: 'Hard', key: '2' },
  { g: 'good', label: 'Good', key: '3' },
  { g: 'easy', label: 'Easy', key: '4' },
];

const CRAM_SIZE = 30;

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
}

export default function Review({ route }: { route: Route }) {
  const t = useT();
  const { data, cards, activeSubjectIds } = useStore();
  const enabled = activeSubjectIds;
  const subjParam = route.params.get('subjects');
  const topicParam = route.params.get('topics');
  const subjects = useMemo(() => (subjParam?.split(',').filter(Boolean) as SubjectId[] | undefined) ?? enabled, [subjParam, enabled]);
  const topics = useMemo(() => topicParam?.split(',').filter(Boolean) ?? [], [topicParam]);
  const cram = route.params.get('mode') === 'cram';
  const [session, setSession] = useState<{ queue: Card[]; cram: boolean } | null>(null);

  const filter = useMemo(() => ({ subjects, topics }), [subjects, topics]);
  const counts = useMemo(() => queueCounts(data, cards, filter, Date.now()), [data, cards, filter]);
  const cramPool = useMemo(() => cards.filter((c) => matchesFilter(c, filter) && !data.cards[c.id]?.suspended).length, [cards, filter, data.cards]);

  const setParams = (next: { subjects?: SubjectId[]; topics?: string[]; mode?: string | undefined }) =>
    navigate('/review', {
      subjects: next.subjects ?? subjects,
      topics: next.topics ?? topics,
      mode: 'mode' in next ? next.mode : cram ? 'cram' : undefined,
    });

  const start = (asCram: boolean) => {
    const now = Date.now();
    const queue = asCram
      ? shuffle(cards.filter((c) => matchesFilter(c, filter) && !data.cards[c.id]?.suspended)).slice(0, CRAM_SIZE)
      : buildQueue(data, cards, filter, now);
    setSession({ queue, cram: asCram });
  };

  if (session) return <Session initialQueue={session.queue} cram={session.cram} onExit={() => setSession(null)} />;

  return (
    <div>
      <h1>{t('Flashcard review')}</h1>
      <div className="card stack">
        <div>
          <h3>{t('Subjects')}</h3>
          <SubjectChips value={subjects} onChange={(v) => setParams({ subjects: v })} />
        </div>
        <div>
          <h3>{t('Topics')}</h3>
          <TopicPicker subjects={subjects} value={topics} onChange={(v) => setParams({ topics: v })} />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h2>{t('Scheduled review')}</h2>
          <p className="muted">
            <strong>{counts.due}</strong> due · <strong>{counts.newToday}</strong> new (of {counts.unseen} unseen; daily limit {data.settings.newPerDay})
          </p>
          <button className="btn primary" disabled={counts.due + counts.newToday === 0} onClick={() => start(false)} autoFocus={!cram}>
            {t('Start review')}
          </button>
          {counts.due + counts.newToday === 0 && <p className="small muted" style={{ marginTop: '0.5rem' }}>All caught up for this selection 🎉</p>}
        </div>
        <div className="card">
          <h2>{t('Cram mode')}</h2>
          <p className="muted">
            Up to {CRAM_SIZE} random cards from the selection ({cramPool} available). Answers count towards your topic accuracy but do{' '}
            <em>not</em> change the review schedule — ideal the night before a test.
          </p>
          <button className="btn" disabled={cramPool === 0} onClick={() => start(true)} autoFocus={cram}>
            {t('Start cram session')}
          </button>
        </div>
      </div>
      <p className="small muted kbd-hint" style={{ marginTop: '1rem' }}>
        Shortcuts: <kbd>Space</kbd> show answer · <kbd>1</kbd>–<kbd>4</kbd> grade · <kbd>Esc</kbd> end session
      </p>
    </div>
  );
}

function Session({ initialQueue, cram, onExit }: { initialQueue: Card[]; cram: boolean; onExit: () => void }) {
  const t = useT();
  const { data, gradeCard } = useStore();
  const [queue, setQueue] = useState(initialQueue);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState<Record<Grade, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const card = queue[idx];
  const done = idx >= queue.length;
  const intervals = card ? previewWith(data.settings, data.cards[card.id], Date.now()) : null;

  const grade = useCallback(
    (g: Grade) => {
      if (!card || !revealed) return;
      gradeCard(card, g, { cram });
      setTally((t) => ({ ...t, [g]: t[g] + 1 }));
      // Failed cards come back later in the same session (once per session for cram).
      if (g === 'again' && queue.filter((c) => c.id === card.id).length < 3) setQueue((q) => [...q, card]);
      setRevealed(false);
      setIdx((i) => i + 1);
    },
    [card, revealed, gradeCard, cram, queue],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') return onExit();
      if (done) return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      const gr = GRADES.find((x) => x.key === e.key);
      if (gr && revealed) {
        e.preventDefault();
        grade(gr.g);
      } else if (revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        grade('good');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, done, grade, onExit]);

  if (done) {
    const total = tally.again + tally.hard + tally.good + tally.easy;
    return (
      <div className="card center">
        <h1>{t('Session complete')} ✅</h1>
        <p className="muted">
          {total} answers · {tally.good + tally.easy} good/easy · {tally.hard} hard · {tally.again} again
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn primary" onClick={onExit} autoFocus>
            {t('Back')}
          </button>
          <a className="btn" href={href('/')}>
            {t('Dashboard')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="spread" style={{ marginBottom: '0.6rem' }}>
        <span className="small muted">
          {idx + 1} / {queue.length} {cram && <span className="badge">cram</span>}
        </span>
        <button className="btn small ghost" onClick={onExit}>
          {t('End session')}
        </button>
      </div>
      <ProgressBar value={idx / queue.length} />
      <div className="card flash" style={{ marginTop: '0.75rem' }} aria-live="polite">
        <div className="row small muted" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
          <SubjectDot subject={card.subject} /> {topicLabel(card.subject, card.topic)}
          <span className="badge">{card.kind}</span>
          {card.custom && <span className="badge">mine</span>}
        </div>
        <MathText className="front" text={card.front} />
        {revealed && <MathText className="back" text={card.back} />}
        {revealed && (
          <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
            <ReportButton key={card.id + idx} item={card.id} subject={card.subject} excerpt={card.front} />
          </div>
        )}
      </div>
      {!revealed ? (
        <button className="btn primary" style={{ width: '100%', marginTop: '1rem', minHeight: 52 }} onClick={() => setRevealed(true)} autoFocus>
          {t('Show answer')} <kbd className="kbd-hint">Space</kbd>
        </button>
      ) : (
        <div className="grade-bar">
          {GRADES.map(({ g, label, key }) => (
            <button key={g} className={`btn grade-${g}`} onClick={() => grade(g)}>
              {t(label)}
              <small>
                {cram ? '—' : formatInterval(intervals![g])} <kbd className="kbd-hint">{key}</kbd>
              </small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
