import { describe, expect, it } from 'vitest';
import { buildIcs, escapeText, foldLine, toIcsLocal } from './ics';

describe('ics helpers', () => {
  it('escapes special characters', () => {
    expect(escapeText('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
  });
  it('folds long lines at 75 octets without splitting characters', () => {
    const long = 'SUMMARY:' + 'é'.repeat(60);
    const folded = foldLine(long);
    const parts = folded.split('\r\n');
    expect(parts.length).toBeGreaterThan(1);
    for (const p of parts) expect(new TextEncoder().encode(p).length).toBeLessThanOrEqual(75);
    expect(parts.slice(1).every((p) => p.startsWith(' '))).toBe(true);
    expect(parts.map((p, i) => (i ? p.slice(1) : p)).join('')).toBe(long);
    expect(foldLine('SHORT:x')).toBe('SHORT:x');
  });
  it('converts local ISO times', () => {
    expect(toIcsLocal('2027-05-05T13:00')).toBe('20270505T130000');
    expect(toIcsLocal('bad')).toBeNull();
  });
});

describe('buildIcs', () => {
  const exams = [
    { id: 'p1', name: 'Physics Paper 1, HL', date: '2027-05-05T13:00', subject: 'physics' as const },
    { id: 'io', name: 'Spanish IO', date: '2027-01-20T10:00', kind: 'deadline' as const },
    { id: 'bad', name: 'Broken', date: '' },
  ];
  const ics = buildIcs(exams, { now: new Date(Date.UTC(2026, 10, 2, 12)), dailyReminder: '18:30', reminderMinutes: 45 });

  it('is a valid calendar with CRLF line endings', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/\n/);
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(3); // 2 valid items + daily reminder
  });
  it('writes exam and deadline events with alarms', () => {
    expect(ics).toContain('DTSTART:20270505T130000');
    expect(ics).toContain('SUMMARY:Exam: Physics Paper 1\\, HL');
    expect(ics).toContain('SUMMARY:Deadline: Spanish IO');
    expect(ics).toContain('TRIGGER:-P1D');
    expect(ics).toContain('DTSTAMP:20261102T120000Z');
  });
  it('adds a daily reminder until the last exam', () => {
    expect(ics).toContain('RRULE:FREQ=DAILY;UNTIL=20270505T130000');
    expect(ics).toContain('DURATION:PT45M');
    expect(ics).toMatch(/DTSTART:20261102T183000/);
  });
});
