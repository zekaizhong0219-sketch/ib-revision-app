import type { Exam } from '../types';

/**
 * Minimal RFC 5545 (iCalendar) writer for exams, deadlines and a daily study reminder.
 * Times are written as floating local times (no TZ), which calendar apps interpret in the
 * user's own time zone — matching how dates are entered in the app.
 */

/** Escapes TEXT values (RFC 5545 §3.3.11). */
export function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Folds content lines longer than 75 octets (RFC 5545 §3.1), never splitting a UTF-8 character. */
export function foldLine(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let cur = '';
  let curLen = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (curLen + n > limit) {
      out.push(cur);
      cur = '';
      curLen = 0;
    }
    cur += ch;
    curLen += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** "2027-05-05T13:00" → "20270505T130000" (floating local time). Returns null if invalid. */
export function toIcsLocal(isoLocal: string): string | null {
  const m = isoLocal.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  return `${m[1]}${m[2]}${m[3]}T${m[4]}${m[5]}00`;
}

function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export interface IcsOptions {
  now?: Date;
  /** Daily study reminder at "HH:MM" until the last exam, or null for none. */
  dailyReminder?: string | null;
  reminderMinutes?: number;
}

export function buildIcs(exams: Exam[], opts: IcsOptions = {}): string {
  const now = opts.now ?? new Date();
  const stamp = utcStamp(now);
  const lines: string[] = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//IB Revision//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const e of exams) {
    const start = toIcsLocal(e.date);
    if (!start) continue;
    const isDeadline = e.kind === 'deadline';
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@ib-revision-app`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${start}`,
      // Exams: default 2 h block; deadlines: 30 min marker.
      `DURATION:${isDeadline ? 'PT30M' : 'PT2H'}`,
      `SUMMARY:${escapeText((isDeadline ? 'Deadline: ' : 'Exam: ') + e.name)}`,
      `CATEGORIES:${isDeadline ? 'DEADLINE' : 'EXAM'}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeText(e.name)}`,
      'TRIGGER:-P1D',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  if (opts.dailyReminder) {
    const [hh, mm] = opts.dailyReminder.split(':');
    const lastExam = exams
      .filter((e) => e.kind !== 'deadline')
      .map((e) => toIcsLocal(e.date))
      .filter((x): x is string => !!x)
      .sort()
      .pop();
    const today = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    lines.push(
      'BEGIN:VEVENT',
      'UID:daily-study@ib-revision-app',
      `DTSTAMP:${stamp}`,
      `DTSTART:${today}T${hh.padStart(2, '0')}${mm.padStart(2, '0')}00`,
      `DURATION:PT${opts.reminderMinutes ?? 60}M`,
      lastExam ? `RRULE:FREQ=DAILY;UNTIL=${lastExam}` : 'RRULE:FREQ=DAILY;COUNT=180',
      'SUMMARY:Study session (IB Revision)',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Time to study',
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
