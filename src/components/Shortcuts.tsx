import { Icon } from './ui';

// eslint-disable-next-line react-refresh/only-export-components
export const SHORTCUTS: [string, string][] = [
  ['d', 'Dashboard'],
  ['r', 'Flashcard review'],
  ['p', 'Timed practice'],
  ['w', 'Timed writing (essays)'],
  ['m', 'Mock exam'],
  ['c', 'Card library'],
  ['e', 'Exam countdown'],
  ['s', 'Settings'],
  ['t', 'Cycle theme (system → light → dark)'],
  ['?', 'Show / hide this help'],
  ['Space / Enter', 'Review: show answer (then Enter = Good)'],
  ['1 2 3 4', 'Review: Again / Hard / Good / Easy'],
  ['1–4 or A–D', 'Practice: choose a multiple-choice option'],
  ['1 2 3', 'Practice: self-mark Missed / Partly / Got it'],
  ['Enter', 'Practice: check answer / next question'],
  ['Esc', 'End the current session'],
];

export function ShortcutHelp({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onClick={onClose}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <div className="spread">
          <h2 style={{ margin: 0 }}>
            <Icon name="keyboard" /> Keyboard shortcuts
          </h2>
          <button className="btn small ghost" onClick={onClose} autoFocus>
            Close
          </button>
        </div>
        <table className="keys" style={{ marginTop: '0.75rem' }}>
          <tbody>
            {SHORTCUTS.map(([k, d]) => (
              <tr key={k}>
                <td style={{ width: '40%' }}>
                  <kbd>{k}</kbd>
                </td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
