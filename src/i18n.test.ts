import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DICTIONARIES, EN, translate } from './i18n';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.tsx$/.test(f) ? [p] : [];
  });
}

const usedKeys = new Set<string>();
for (const f of sourceFiles(join(__dirname))) {
  for (const m of readFileSync(f, 'utf8').matchAll(/\bt\('((?:[^'\\]|\\.)*)'/g)) usedKeys.add(m[1].replace(/\\'/g, "'"));
}

describe('i18n', () => {
  it('finds translated strings in the views', () => {
    expect(usedKeys.size).toBeGreaterThan(60);
  });
  it.each(['es', 'zh'] as const)('%s has a translation for every key used in the UI', (lang) => {
    const missing = [...usedKeys].filter((k) => !(k in DICTIONARIES[lang]));
    expect(missing).toEqual([]);
  });
  it('Spanish and Chinese dictionaries have the same keys', () => {
    expect(Object.keys(DICTIONARIES.es).sort()).toEqual(Object.keys(DICTIONARIES.zh).sort());
  });
  it('placeholders are preserved in every translation', () => {
    for (const lang of ['es', 'zh'] as const) {
      for (const [k, v] of Object.entries(DICTIONARIES[lang])) {
        const english = EN[k] ?? k;
        expect((v.match(/\{\w+\}/g) ?? []).sort(), `${lang}: ${k}`).toEqual((english.match(/\{\w+\}/g) ?? []).sort());
      }
    }
  });
  it('Spanish UI text uses no em dash (house style)', () => {
    expect(Object.values(DICTIONARIES.es).filter((v) => v.includes('—'))).toEqual([]);
  });
  it('translates with fallback and interpolation', () => {
    expect(translate('es', 'Review')).toBe('Repaso');
    expect(translate('zh', '+ {n} new today', { n: 5 })).toBe('今日新卡 +5');
    expect(translate('es', 'Unknown string')).toBe('Unknown string');
    expect(translate('en', 'best {n} days', { n: 3 })).toBe('best 3 days');
    expect(translate('en', 'welcome.exams')).toBe('Set your exam dates under');
  });
  it('every id-style key (containing a dot, no spaces) has English text', () => {
    const ids = [...usedKeys].filter((k) => /^[\w]+\.[\w.]+$/.test(k));
    expect(ids.filter((k) => !(k in EN))).toEqual([]);
  });
});
