import katex from 'katex';
import 'katex/contrib/mhchem';

const cache = new Map<string, string>();

function renderTex(tex: string, display: boolean): string {
  const key = (display ? 'D:' : 'I:') + tex;
  let html = cache.get(key);
  if (html === undefined) {
    html = katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false, output: 'html' });
    if (cache.size > 5000) cache.clear();
    cache.set(key, html);
  }
  return html;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Converts our light markup (text, **bold**, $inline$, $$display$$, newlines) to HTML. */
export function toHtml(text: string): string {
  const out: string[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const plain = (s: string) =>
    escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  while ((m = re.exec(text))) {
    out.push(plain(text.slice(last, m.index)));
    out.push(m[1] !== undefined ? renderTex(m[1], true) : renderTex(m[2], false));
    last = re.lastIndex;
  }
  out.push(plain(text.slice(last)));
  return out.join('');
}

