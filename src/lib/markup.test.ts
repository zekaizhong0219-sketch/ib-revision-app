import { describe, expect, it } from 'vitest';
import { toHtml } from './markup';

describe('toHtml', () => {
  it('escapes HTML in plain text', () => {
    expect(toHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
  it('renders italics without touching maths or bold', () => {
    expect(toHtml('*La Regenta* y **negrita**')).toBe('<em>La Regenta</em> y <strong>negrita</strong>');
    expect(toHtml('a * b * c')).toBe('a * b * c');
    expect(toHtml('$z^*$ and *x*')).toMatch(/<em>x<\/em>$/);
  });
  it('renders bold and newlines', () => {
    expect(toHtml('**a**\nb')).toBe('<strong>a</strong><br/>b');
  });
  it('renders inline and display maths with KaTeX', () => {
    expect(toHtml('x $a^2$ y')).toContain('class="katex"');
    expect(toHtml('$$\\frac12$$')).toContain('katex-display');
  });
  it('renders mhchem', () => {
    expect(toHtml('$\\ce{H2O}$')).toContain('katex');
  });
  it('treats \\$ as a literal dollar sign', () => {
    expect(toHtml('about US\\$13 billion and $x$')).toMatch(/^about US\$13 billion and <span class="katex">/);
  });
  it('does not throw on invalid TeX', () => {
    expect(() => toHtml('$\\frac{$')).not.toThrow();
  });
});
