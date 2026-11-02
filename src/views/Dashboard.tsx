import { useMemo, useState } from 'react';
import { useT } from '../i18n';
import { useStore } from '../store';
import { getSubject, topicLabel } from '../data/syllabus';
import { activityByDay, currentStreak, dueForecast, longestStreak, recommend, topicStats } from '../lib/stats';
import { queueCounts } from '../lib/queue';
import { ALL_QUESTIONS } from '../data/questions';
import { planDay, reviewLoad, type PlanItem } from '../lib/planner';
import { estimateGrade } from '../lib/grades';
import { isLeech } from '../lib/mistakes';
import { BarChart, HBars } from '../components/Charts';
import { ProgressBar, SubjectDot, Tile } from '../components/ui';
import { href } from '../router';
import { NextExamBanner } from './Exams';
import type { SubjectId } from '../types';

export default function Dashboard() {
  const t = useT();
  const { data, cards, visibleSubjects, activeSubjectIds } = useStore();
  const [now] = useState(() => Date.now());
  const [tab, setSubjectTab] = useState<SubjectId>(visibleSubjects[0]?.id ?? 'physics');
  const subjectTab = visibleSubjects.some((s) => s.id === tab) ? tab : (visibleSubjects[0]?.id ?? 'physics');

  const enabled = activeSubjectIds;
  const counts = useMemo(() => queueCounts(data, cards, { subjects: enabled }, now), [data, cards, enabled, now]);
  const stats = useMemo(() => topicStats(data, cards, now), [data, cards, now]);
  const recs = useMemo(() => recommend(data, cards, now, 5), [data, cards, now]);
  const activity = useMemo(() => activityByDay(data, now, 30), [data, now]);
  const forecast = useMemo(() => dueForecast(data, cards, now, 14), [data, cards, now]);
  const plan = useMemo(() => planDay(data, cards, enabled, now, PRACTICE_TOPICS), [data, cards, enabled, now]);
  const load = useMemo(() => reviewLoad(data, cards, enabled, now, 7), [data, cards, enabled, now]);
  const streak = currentStreak(data, now);
  const leeches = Object.values(data.cards).filter(isLeech).length;
  const best = longestStreak(data);
  const todayCount = activity[activity.length - 1];
  const studied = Object.values(data.cards).filter((s) => s.last > 0).length;
  const isFresh = data.reviews.length === 0 && data.practice.length === 0;

  const subjectSummary = visibleSubjects.map((s) => {
    let total = 0, seen = 0, due = 0, mature = 0, score = 0, weight = 0;
    for (const st of stats.values()) {
      if (st.subject !== s.id) continue;
      total += st.total; seen += st.seen; due += st.due; mature += st.mature;
      if (st.accuracy !== null) {
        const w = st.reviews + st.practiceAttempts;
        score += st.accuracy * w; weight += w;
      }
    }
    return { s, total, seen, due, mature, accuracy: weight ? score / weight : null };
  });

  const topicBars = getSubject(subjectTab)
    .topics.map((t) => {
      const st = stats.get(`${subjectTab}|${t.id}`);
      return {
        key: t.id,
        name: topicLabel(subjectTab, t.id),
        value: st?.accuracy ?? null,
        detail: st ? `${st.reviews} reviews · ${st.practiceAttempts} practice answers · ${st.seen}/${st.total} cards studied` : undefined,
      };
    });

  const dayLabel = (k: string) => k.slice(8);

  return (
    <div>
      <div className="spread">
        <h1>{t('Dashboard')}</h1>
        <div className="row">
          <a className="btn primary" href={href('/review')}>
            {t('Review')} {counts.due + counts.newToday > 0 ? `(${counts.due + counts.newToday})` : ''}
          </a>
          <a className="btn" href={href('/practice')}>
            {t('Timed practice')}
          </a>
        </div>
      </div>

      <NextExamBanner />

      {isFresh && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2>{t('Welcome')} 👋</h2>
          <p>{t('welcome.body', { cards: cards.length, subjects: visibleSubjects.length, n: data.settings.newPerDay })}</p>
          <p className="muted small">
            {t('welcome.exams')} <a href={href('/exams')}>{t('Exams')}</a>. {t('welcome.backup')} <a href={href('/settings')}>{t('Settings')}</a>.
          </p>
        </div>
      )}

      <div className="tiles" style={{ marginTop: '1rem' }}>
        <Tile label={t('Due now')} value={counts.due} sub={t('+ {n} new today', { n: counts.newToday })} />
        <Tile label={t('Streak')} value={`${streak} 🔥`} sub={t('best {n} days', { n: best })} />
        <Tile label={t('Today')} value={todayCount.reviews + todayCount.practice} sub={t('{a} cards · {b} questions', { a: todayCount.reviews, b: todayCount.practice })} />
        <Tile label={t('Cards studied')} value={studied} sub={t('of {n}', { n: cards.length })} />
      </div>

      <div className="grid grid-2" style={{ marginTop: '1rem' }}>
        <section className="card">
          <div className="spread">
            <h2 style={{ margin: 0 }}>{t('Today\'s plan')}</h2>
            <span className="small muted">
              {t('≈ {a} of {b} min', { a: plan.total, b: plan.budget })} · <a href={href('/settings')}>{t('change budget')}</a>
            </span>
          </div>
          {plan.overBudget && (
            <p className="small" style={{ color: 'var(--warn)' }}>
              Your due reviews alone exceed today's budget: do them first, or lower "new cards per day" in Settings.
            </p>
          )}
          {plan.items.length === 0 && <p className="muted">Nothing scheduled: enable some subjects in Settings.</p>}
          {plan.items.map((it, i) => (
            <PlanRow key={i} item={it} />
          ))}
        </section>
        <section className="card">
          <h2>{t('Review load: next 7 days (min)')}</h2>
          <BarChart
            title="Estimated review minutes per day by subject"
            labels={['today', '+1', '+2', '+3', '+4', '+5', '+6']}
            series={enabled.map((s) => ({ label: getSubject(s).short, values: load[s], color: getSubject(s).color }))}
          />
          <p className="small muted">Estimated at about 10 s per review; new cards and practice come on top.</p>
        </section>
      </div>

      <div className="grid grid-2" style={{ marginTop: '1rem' }}>
        <section className="card">
          <h2>{t('What to revise next')}</h2>
          {recs.length === 0 && <p className="muted">Enable at least one subject in Settings.</p>}
          {recs.map((r) => (
            <div className="rec" key={`${r.subject}|${r.topic}`}>
              <div>
                <div>
                  <SubjectDot subject={r.subject} /> <strong>{topicLabel(r.subject, r.topic)}</strong>
                </div>
                <div className="small muted">{r.reasons.join(' · ')}</div>
              </div>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <a className="btn small" href={href('/review', { subjects: r.subject, topics: `${r.subject}|${r.topic}`, mode: r.stats.due > 0 ? undefined : 'cram' })}>
                  {t('Cards')}
                </a>
                <a className="btn small" href={href('/practice', { subject: r.subject, topics: `${r.subject}|${r.topic}` })}>
                  {t('Practice')}
                </a>
              </div>
            </div>
          ))}
        </section>

        <section className="card">
          <h2>{t('Subjects')}</h2>
          <div className="stack">
            {subjectSummary.map(({ s, total, seen, due, mature, accuracy }) => (
              <div key={s.id}>
                <div className="spread">
                  <strong>
                    <SubjectDot subject={s.id} /> {s.name}
                  </strong>
                  <span className="small muted">
                    {due} due · {accuracy === null ? '—' : `${Math.round(accuracy * 100)}%`} accuracy
                  </span>
                </div>
                <ProgressBar value={total ? seen / total : 0} color={s.color} />
                <div className="small muted">
                  {seen}/{total} studied · {mature} mature (interval ≥ 21 d)
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-2" style={{ marginTop: '1rem' }}>
        <section className="card">
          <h2>{t('Activity: last 30 days')}</h2>
          <BarChart
            title="Daily activity"
            labels={activity.map((a) => dayLabel(a.day))}
            series={[
              { label: 'flashcards', values: activity.map((a) => a.reviews), color: 'var(--accent)' },
              { label: 'practice questions', values: activity.map((a) => a.practice), color: 'var(--c-chemistry)' },
            ]}
          />
        </section>
        <section className="card">
          <h2>{t('Upcoming reviews: next 14 days')}</h2>
          <BarChart
            title="Cards due per day"
            labels={forecast.map((_, i) => (i === 0 ? 'today' : `+${i}`))}
            series={[{ label: 'cards due', values: forecast, color: 'var(--c-math)' }]}
          />
        </section>
      </div>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="spread">
          <h2 style={{ margin: 0 }}>{t('Grade estimates')}</h2>
          <a className="btn small" href={href('/mock')}>
            {t('Take a mock')}
          </a>
        </div>
        <div className="tiles" style={{ marginTop: '0.75rem' }}>
          {visibleSubjects.map((s) => {
            const e = estimateGrade(data, s.id);
            return (
              <div className="tile" key={s.id}>
                <div className="label">
                  <SubjectDot subject={s.id} /> {s.short}
                </div>
                <div className="value">{e ? (e.low === e.high ? e.grade : `${e.low}–${e.high}`) : '—'}</div>
                <div className="sub">{e ? `${Math.round(e.percent)}% · ${e.n} results` : 'needs 2 mocks / essays'}</div>
              </div>
            );
          })}
        </div>
        <p className="small muted" style={{ marginTop: '0.5rem' }}>
          From your recent mock papers and self-assessed essays, with a range reflecting how much your results vary. Rough guide only: real
          boundaries differ by subject and session, and internal assessment is not included.
        </p>
        {leeches > 0 && (
          <p className="small" style={{ color: 'var(--warn)' }}>
            {leeches} card{leeches === 1 ? '' : 's'} you keep forgetting (5+ lapses).{' '}
            <a href={href('/cards', { status: 'leech' })}>Review and rewrite them</a>: splitting a card into smaller ones usually helps.
          </p>
        )}
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="spread" style={{ marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0 }}>{t('Accuracy by topic')}</h2>
          <div className="row">
            {visibleSubjects.map((s) => (
              <button key={s.id} className="chip" aria-pressed={subjectTab === s.id} onClick={() => setSubjectTab(s.id)}>
                <SubjectDot subject={s.id} /> {s.short}
              </button>
            ))}
          </div>
        </div>
        <HBars items={topicBars} />
        <p className="small muted" style={{ marginTop: '0.75rem' }}>
          Accuracy over the last 90 days: flashcards count Good/Easy as correct and Hard as half; practice questions count double.
        </p>
      </section>
    </div>
  );
}

/** Topics with at least three practice questions (the planner only sends you to these). */
const PRACTICE_TOPICS = (() => {
  const counts = new Map<string, number>();
  for (const q of ALL_QUESTIONS) counts.set(`${q.subject}|${q.topic}`, (counts.get(`${q.subject}|${q.topic}`) ?? 0) + 1);
  return new Set([...counts].filter(([, n]) => n >= 3).map(([k]) => k));
})();

const KIND_LABEL: Record<PlanItem['kind'], string> = { review: 'Flashcards', practice: 'Practice', writing: 'Timed writing' };

function PlanRow({ item }: { item: PlanItem }) {
  const t = useT();
  const link =
    item.kind === 'review'
      ? href('/review', { subjects: item.subject })
      : item.kind === 'practice'
        ? href('/practice', { subject: item.subject, topics: item.topic ? `${item.subject}|${item.topic}` : undefined })
        : href('/writing', { subject: item.subject });
  return (
    <div className="plan-item">
      <div>
        <div>
          <SubjectDot subject={item.subject} /> <strong>{t(KIND_LABEL[item.kind])}</strong> · {getSubject(item.subject).short}
          {item.topic && item.kind !== 'review' ? ` · ${topicLabel(item.subject, item.topic)}` : ''}
        </div>
        <div className="small muted">
          ~{item.minutes} min · {item.reason}
        </div>
      </div>
      <a className="btn small" href={link}>
        {t('Start')}
      </a>
    </div>
  );
}
