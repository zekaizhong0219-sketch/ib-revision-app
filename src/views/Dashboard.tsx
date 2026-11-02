import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { getSubject, topicLabel } from '../data/syllabus';
import { activityByDay, currentStreak, dueForecast, longestStreak, recommend, topicStats } from '../lib/stats';
import { queueCounts } from '../lib/queue';
import { BarChart, HBars } from '../components/Charts';
import { ProgressBar, SubjectDot, Tile } from '../components/ui';
import { href } from '../router';
import { NextExamBanner } from './Exams';
import type { SubjectId } from '../types';

export default function Dashboard() {
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
  const streak = currentStreak(data, now);
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
        <h1>Dashboard</h1>
        <div className="row">
          <a className="btn primary" href={href('/review')}>
            Review {counts.due + counts.newToday > 0 ? `(${counts.due + counts.newToday})` : ''}
          </a>
          <a className="btn" href={href('/practice')}>
            Timed practice
          </a>
        </div>
      </div>

      <NextExamBanner />

      {isFresh && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2>Welcome 👋</h2>
          <p>
            You have <strong>{cards.length}</strong> flashcards across Physics, Chemistry and Math AA HL. Start a review to learn your first{' '}
            {data.settings.newPerDay} new cards, then come back daily — the scheduler shows each card again just before you would forget it.
          </p>
          <p className="muted small">
            Set your exam dates under <a href={href('/exams')}>Exams</a>. Progress is stored only in this browser — export a backup in{' '}
            <a href={href('/settings')}>Settings</a> now and then.
          </p>
        </div>
      )}

      <div className="tiles" style={{ marginTop: '1rem' }}>
        <Tile label="Due now" value={counts.due} sub={`+ ${counts.newToday} new today`} />
        <Tile label="Streak" value={`${streak} 🔥`} sub={`best ${best} day${best === 1 ? '' : 's'}`} />
        <Tile label="Today" value={todayCount.reviews + todayCount.practice} sub={`${todayCount.reviews} cards · ${todayCount.practice} questions`} />
        <Tile label="Cards studied" value={studied} sub={`of ${cards.length}`} />
      </div>

      <div className="grid grid-2" style={{ marginTop: '1rem' }}>
        <section className="card">
          <h2>What to revise next</h2>
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
                  Cards
                </a>
                <a className="btn small" href={href('/practice', { subject: r.subject, topics: `${r.subject}|${r.topic}` })}>
                  Practice
                </a>
              </div>
            </div>
          ))}
        </section>

        <section className="card">
          <h2>Subjects</h2>
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
          <h2>Activity — last 30 days</h2>
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
          <h2>Upcoming reviews — next 14 days</h2>
          <BarChart
            title="Cards due per day"
            labels={forecast.map((_, i) => (i === 0 ? 'today' : `+${i}`))}
            series={[{ label: 'cards due', values: forecast, color: 'var(--c-math)' }]}
          />
        </section>
      </div>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="spread" style={{ marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0 }}>Accuracy by topic</h2>
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
