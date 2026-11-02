import { describe, expect, it } from 'vitest';
import { toHtml } from './markup';

describe('toHtml', () => {
  it('escapes HTML in plain text', () => {
    expect(toHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
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
  it('does not throw on invalid TeX', () => {
    expect(() => toHtml('$\\frac{$')).not.toThrow();
  });
});
