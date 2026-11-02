import { describe, expect, it } from 'vitest';
import { parseCards, parseEssays, parseQuestions } from './dsl';

describe('parseCards', () => {
  it('parses kinds including new tags and stable ids', () => {
    const src = String.raw`
# W12.CR
[y] Cuban Missile Crisis :: October 1962
[p] Khrushchev :: Soviet leader
[r] Anáfora :: Repetición al inicio
[v] to bolster :: to strengthen
[s] Blog :: informal, first person
[q] «Verde que te quiero verde» :: Lorca
`;
    const cards = parseCards('history', src);
    expect(cards.map((c) => c.kind)).toEqual(['date', 'person', 'device', 'vocab', 'texttype', 'quote']);
    expect(parseCards('history', src)[0].id).toBe(cards[0].id);
    expect(cards[0].id.startsWith('hist-W12.CR-')).toBe(true);
  });
  it('rejects cards before a header and unknown tags', () => {
    expect(() => parseCards('english', '[d] a :: b')).toThrow(/header/);
    expect(() => parseCards('english', '# TT\n[z] a :: b')).toThrow(/unknown kind/);
  });
});

describe('parseQuestions: new types', () => {
  it('parses text, order and match', () => {
    const qs = parseQuestions(
      'history',
      String.raw`
@text W12.CR
Q: Which 1962 crisis?
A: Cuban Missile Crisis | Missile Crisis
S: Oct 1962.

@text W12.CR strict
Q: Exact spelling?
A: Jruschov

@order W12.RMA
Q: Order these.
I: Yalta
I: Potsdam
I: Truman Doctrine

@match W12.LN
Q: Match leader to country.
P: Castro => Cuba
P: Mao => China
P: Tito => Yugoslavia
`,
    );
    expect(qs.map((q) => q.type)).toEqual(['text', 'text', 'order', 'match']);
    const [t, strict, order, match] = qs;
    expect(t.type === 'text' && t.answers).toEqual(['Cuban Missile Crisis', 'Missile Crisis']);
    expect(strict.type === 'text' && strict.strict).toBe(true);
    expect(order.type === 'order' && order.items).toEqual(['Yalta', 'Potsdam', 'Truman Doctrine']);
    expect(match.type === 'match' && match.pairs[0]).toEqual(['Castro', 'Cuba']);
  });
  it('validates new types', () => {
    expect(() => parseQuestions('history', '@order X\nQ: q\nI: a\nI: b')).toThrow(/three/);
    expect(() => parseQuestions('history', '@match X\nQ: q\nP: a => 1\nP: b => 1\nP: c => 2')).toThrow(/distinct/);
    expect(() => parseQuestions('history', '@text X\nQ: q\nA: ')).toThrow(/answer/);
  });
});

describe('parseEssays', () => {
  it('parses params and guidance', () => {
    const [e] = parseEssays(
      'english',
      String.raw`@essay TT rubric=engb-p1 minutes=90 min=450 max=600
Q: Write a blog post.
S: Use a catchy title.
Address readers directly.`,
    );
    expect(e.rubric).toBe('engb-p1');
    expect(e.minutes).toBe(90);
    expect(e.minWords).toBe(450);
    expect(e.maxWords).toBe(600);
    expect(e.guidance).toBe('Use a catchy title.\nAddress readers directly.');
    expect(e.id.startsWith('engb-e-TT-')).toBe(true);
  });
  it('requires rubric and minutes', () => {
    expect(() => parseEssays('english', '@essay TT minutes=90\nQ: x')).toThrow(/rubric/);
    expect(() => parseEssays('english', '@essay TT rubric=r\nQ: x')).toThrow(/minutes/);
  });
});
