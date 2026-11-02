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

const DOLLAR = '\u0000D\u0000';

const TABLE_ROW = /^\|.*\|$/;
const TABLE_SEP = /^\|(\s*:?-{2,}:?\s*\|)+$/;

function renderTable(rows: string[]): string {
  const cells = (r: string) => r.slice(1, -1).split('|').map((c) => c.trim());
  const hasHead = rows.length > 1 && TABLE_SEP.test(rows[1]);
  const head = hasHead ? `<thead><tr>${cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : '';
  const body = (hasHead ? rows.slice(2) : rows).filter((r) => !TABLE_SEP.test(r));
  return `<div class="table-wrap"><table class="data">${head}<tbody>${body
    .map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;
}

/**
 * Converts our light markup (text, **bold**, *italic*, $inline$, $$display$$, newlines; \$ = literal dollar) to HTML.
 * Two or more consecutive lines that start and end with "|" form a table; a "|---|---|" second row makes the first a header.
 */
export function toHtml(input: string): string {
  if (!/(^|\n)\s*\|.*\|\s*(\n|$)/.test(input)) return inline(input);
  const lines = input.split('\n');
  const out: string[] = [];
  let buf: string[] = [];
  const flush = () => {
    if (buf.length) out.push(inline(buf.join('\n')));
    buf = [];
  };
  for (let i = 0; i < lines.length; ) {
    const rows: string[] = [];
    while (i + rows.length < lines.length && TABLE_ROW.test(lines[i + rows.length].trim())) rows.push(lines[i + rows.length].trim());
    if (rows.length >= 2) {
      flush();
      out.push(renderTable(rows));
      i += rows.length;
    } else buf.push(lines[i++]);
  }
  flush();
  return out.join('');
}

function inline(input: string): string {
  const text = input.replace(/\\\$/g, DOLLAR);
  const out: string[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const plain = (s: string) =>
    escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*(?!\s)([^*\n]+?)(?<!\s)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/\n/g, '<br/>');
  while ((m = re.exec(text))) {
    out.push(plain(text.slice(last, m.index)));
    out.push(m[1] !== undefined ? renderTex(m[1], true) : renderTex(m[2], false));
    last = re.lastIndex;
  }
  out.push(plain(text.slice(last)));
  return out.join('').split(DOLLAR).join('$');
}

