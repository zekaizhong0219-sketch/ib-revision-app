import { useState } from 'react';
import { useStore } from '../store';
import type { SubjectId } from '../types';

/** Small "Report a mistake" control that saves a note about a card or question. */
export function ReportButton({ item, subject, excerpt }: { item: string; subject: SubjectId; excerpt: string }) {
  const { addReport } = useStore();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  if (sent) return <span className="small muted">Reported ✓ (see Settings)</span>;
  if (!open) {
    return (
      <button type="button" className="btn small ghost" onClick={() => setOpen(true)} title="Report a possible mistake in this item">
        ⚑ Report a mistake
      </button>
    );
  }
  return (
    <form
      className="report-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!note.trim()) return;
        addReport({ item, subject, excerpt: excerpt.slice(0, 300), note: note.trim() });
        setSent(true);
      }}
    >
      <textarea autoFocus value={note} onChange={(e) => setNote(e.target.value)} placeholder="What looks wrong? (e.g. wrong value, typo, unclear wording)" aria-label="Describe the mistake" style={{ minHeight: 60 }} />
      <div className="row" style={{ marginTop: 6 }}>
        <button className="btn small primary" type="submit" disabled={!note.trim()}>
          Save report
        </button>
        <button className="btn small ghost" type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
