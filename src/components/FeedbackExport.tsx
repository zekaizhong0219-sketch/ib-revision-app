import { useT } from '../i18n';
import { useState } from 'react';
import { copyText as copy, downloadText as download } from '../lib/clipboard';

/**
 * "Get feedback" panel: copies (or downloads) a ready-made request containing the task,
 * criteria and answer, to paste into Claude or send to a teacher.
 */
export function FeedbackExport({ build, filename }: { build: () => string; filename: string }) {
  const t = useT();
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  return (
    <div className="card stack" style={{ gap: '0.5rem' }}>
      <strong>{t('Get outside feedback')}</strong>
      <span className="small muted">
        Self-marking is least reliable at the top bands. This copies a ready-made request (task, criteria, your answer and your marks) to paste into
        Claude or send to your teacher. Nothing is sent anywhere by the app.
      </span>
      <div className="row">
        <button
          className="btn small primary"
          onClick={async () => {
            setStatus((await copy(build())) ? 'copied' : 'failed');
            window.setTimeout(() => setStatus('idle'), 2500);
          }}
        >
          {status === 'copied' ? '✓' : t('Copy feedback request')}
        </button>
        <button className="btn small" onClick={() => download(build(), filename)}>
          Download .md
        </button>
        <a className="btn small" href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">
          Open Claude ↗
        </a>
      </div>
      {status === 'failed' && <span className="small" style={{ color: 'var(--warn)' }}>Copying was blocked by the browser; use Download instead.</span>}
    </div>
  );
}
