import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { LISTENING, LISTENING_STRATEGY, type ListeningItem } from '../data/listening';
import { topicLabel } from '../data/syllabus';
import { StructuredAnswer } from './PracticeAnswers';
import { href } from '../router';
import type { PracticeResult } from '../types';

const RATES = [0.85, 1, 1.1];

/** Picks distinct English voices (one per speaker) from those installed in the browser / OS. */
function pickVoices(count: number): (SpeechSynthesisVoice | null)[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return Array(count).fill(null);
  const all = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
  const preferred = [...all.filter((v) => /en-gb/i.test(v.lang)), ...all.filter((v) => !/en-gb/i.test(v.lang))];
  return Array.from({ length: count }, (_, i) => preferred[i % Math.max(1, preferred.length)] ?? null);
}

export default function Listening() {
  const [item, setItem] = useState<ListeningItem | null>(null);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  if (item) return <Session item={item} supported={supported} onBack={() => setItem(null)} />;
  return (
    <div>
      <h1>English B listening</h1>
      <p className="muted">
        Original recordings read aloud by your device's text-to-speech, with Paper 2-style questions. As in the exam, read the questions first,
        then listen twice. The transcript appears only after you submit.
      </p>
      {!supported && (
        <div className="feedback no">
          This browser has no speech synthesis, so the recordings can't be played. You can still read the transcript after answering, but for real
          listening practice use Chrome, Edge or Safari.
        </div>
      )}
      <div className="list" style={{ marginTop: '1rem' }}>
        {LISTENING.map((it) => (
          <div className="list-item spread" key={it.id}>
            <div>
              <strong>{it.title}</strong>
              <div className="small muted">
                {it.kind} · {topicLabel('english', it.theme)} · {it.question.parts.length} questions
              </div>
            </div>
            <button className="btn primary small" onClick={() => setItem(it)}>
              Start
            </button>
          </div>
        ))}
      </div>
      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h2>How to approach the listening paper</h2>
        <p className="small muted">
          In English B Paper 2 you hear several recordings, each played twice, and answer short comprehension questions: gap-fills,
          short answers, multiple choice and true/false with justification.
        </p>
        {LISTENING_STRATEGY.map((s) => (
          <div key={s.title} style={{ marginTop: '0.75rem' }}>
            <h3>{s.title}</h3>
            <ul className="small" style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

function Session({ item, supported, onBack }: { item: ListeningItem; supported: boolean; onBack: () => void }) {
  const { logPractice } = useStore();
  const [rate, setRate] = useState(1);
  const [plays, setPlays] = useState(0);
  const [unlimited, setUnlimited] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(-1);
  const [done, setDone] = useState<{ result: PracticeResult } | null>(null);
  const [, setVoicesReady] = useState(0);
  const cancelled = useRef(false);
  const maxPlays = unlimited ? Infinity : 2;

  useEffect(() => {
    if (!supported) return;
    const onVoices = () => setVoicesReady((n) => n + 1);
    window.speechSynthesis.addEventListener?.('voiceschanged', onVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', onVoices);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const stop = useCallback(() => {
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setPlaying(false);
    setLine(-1);
  }, []);

  const play = () => {
    if (!supported || playing || plays >= maxPlays) return;
    cancelled.current = false;
    const speakers = Object.keys(item.speakers);
    const voices = pickVoices(speakers.length);
    setPlaying(true);
    setPlays((p) => p + 1);
    const speakLine = (i: number) => {
      if (cancelled.current) return;
      if (i >= item.script.length) {
        setPlaying(false);
        setLine(-1);
        return;
      }
      const l = item.script[i];
      const u = new SpeechSynthesisUtterance(l.text);
      const v = voices[speakers.indexOf(l.speaker)];
      if (v) u.voice = v;
      u.lang = v?.lang ?? 'en-GB';
      u.rate = rate;
      // Slightly different pitch helps tell speakers apart when only one voice is installed.
      u.pitch = speakers.indexOf(l.speaker) === 1 ? 1.15 : 1;
      u.onend = () => setTimeout(() => speakLine(i + 1), 350);
      u.onerror = () => {
        setPlaying(false);
        setLine(-1);
      };
      setLine(i);
      window.speechSynthesis.speak(u);
    };
    speakLine(0);
  };

  const record = (result: PracticeResult, response: string, marks?: { got: number; max: number }) => {
    stop();
    setDone({ result });
    logPractice([{ q: item.id, s: 'english', tp: 'RD', r: result, t: Date.now(), ...(marks ? { m: marks.got, mx: marks.max } : {}) }]);
    void response;
  };

  return (
    <div>
      <div className="spread">
        <h1 style={{ margin: 0 }}>{item.title}</h1>
        <button
          className="btn"
          onClick={() => {
            stop();
            onBack();
          }}
        >
          Back
        </button>
      </div>
      <p className="small muted">
        {item.kind} · Speakers: {Object.values(item.speakers).join(', ')}
      </p>
      <section className="card stack">
        <div className="row">
          <button className="btn primary" onClick={play} disabled={!supported || playing || plays >= maxPlays}>
            ▶ {plays === 0 ? 'Play' : 'Play again'}
          </button>
          <button className="btn" onClick={stop} disabled={!playing}>
            ■ Stop
          </button>
          <span className="small muted">
            {unlimited ? `${plays} plays` : `${plays} / 2 plays`}
            {playing && line >= 0 ? ` · speaking ${line + 1}/${item.script.length}` : ''}
          </span>
        </div>
        <div className="row" role="group" aria-label="Speed">
          <span className="small muted">Speed:</span>
          {RATES.map((r) => (
            <button key={r} className="chip" aria-pressed={rate === r} onClick={() => setRate(r)} disabled={playing}>
              {r === 1 ? 'normal' : r < 1 ? 'slower' : 'faster'}
            </button>
          ))}
          <label className="row small" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={unlimited} onChange={(e) => setUnlimited(e.target.checked)} /> practice mode (unlimited plays)
          </label>
        </div>
        <p className="small muted">Read the questions below before the first play. Voices depend on your device; installing an English voice in your system settings improves quality.</p>
      </section>
      <section className="card">
        <StructuredAnswer q={item.question} done={done} onAnswer={record} />
      </section>
      {done && (
        <section className="card">
          <h2>Transcript</h2>
          {item.script.map((l, i) => (
            <p key={i} className="small" style={{ margin: '0 0 0.5rem' }}>
              <strong>{item.speakers[l.speaker]}:</strong> {l.text}
            </p>
          ))}
          <a className="btn small" href={href('/listening')} onClick={onBack}>
            Another recording
          </a>
        </section>
      )}
    </div>
  );
}
