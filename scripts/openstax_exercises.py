#!/usr/bin/env python3
"""
Builds src/data/openstax.generated.ts: end-of-chapter exercises from OpenStax textbooks with
the answers from OpenStax's own answer keys, for self-marked practice.

Licence: OpenStax books are licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
Attribution is stored with every exercise (book, chapter, exercise number, link). Changes: maths
converted from MathML to LaTeX, exercises that need a figure, graph or table are left out, and
only exercises whose answers appear in the answer key (mostly odd-numbered) are used.

Usage: python3 scripts/openstax_exercises.py   (needs curl, beautifulsoup4, lxml)
"""
import json
import pathlib
import re
import subprocess
import sys
from functools import lru_cache

from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data' / 'openstax.generated.ts'
BASE = 'https://openstax.org/books/'
PER_CHAPTER = 14

BOOK_TITLE = {
    'university-physics-volume-1': 'University Physics Volume 1',
    'university-physics-volume-2': 'University Physics Volume 2',
    'university-physics-volume-3': 'University Physics Volume 3',
    'chemistry-2e': 'Chemistry 2e',
    'calculus-volume-1': 'Calculus Volume 1',
    'precalculus-2e': 'Precalculus 2e',
}

# (book, chapter, subject, topic)
CHAPTERS = [
    ('university-physics-volume-1', 3, 'physics', 'A.1'),
    ('university-physics-volume-1', 4, 'physics', 'A.1'),
    ('university-physics-volume-1', 5, 'physics', 'A.2'),
    ('university-physics-volume-1', 6, 'physics', 'A.2'),
    ('university-physics-volume-1', 7, 'physics', 'A.3'),
    ('university-physics-volume-1', 8, 'physics', 'A.3'),
    ('university-physics-volume-1', 9, 'physics', 'A.2'),
    ('university-physics-volume-1', 10, 'physics', 'A.4'),
    ('university-physics-volume-1', 13, 'physics', 'D.1'),
    ('university-physics-volume-1', 15, 'physics', 'C.1'),
    ('university-physics-volume-1', 16, 'physics', 'C.2'),
    ('university-physics-volume-1', 17, 'physics', 'C.4'),
    ('university-physics-volume-2', 1, 'physics', 'B.1'),
    ('university-physics-volume-2', 2, 'physics', 'B.3'),
    ('university-physics-volume-2', 3, 'physics', 'B.4'),
    ('university-physics-volume-2', 5, 'physics', 'D.2'),
    ('university-physics-volume-2', 7, 'physics', 'D.2'),
    ('university-physics-volume-2', 9, 'physics', 'B.5'),
    ('university-physics-volume-2', 10, 'physics', 'B.5'),
    ('university-physics-volume-2', 11, 'physics', 'D.3'),
    ('university-physics-volume-2', 13, 'physics', 'D.4'),
    ('university-physics-volume-3', 5, 'physics', 'A.5'),
    ('university-physics-volume-3', 6, 'physics', 'E.2'),
    ('university-physics-volume-3', 10, 'physics', 'E.3'),
    ('chemistry-2e', 3, 'chemistry', 'S1.4'),
    ('chemistry-2e', 4, 'chemistry', 'R2.1'),
    ('chemistry-2e', 5, 'chemistry', 'R1.1'),
    ('chemistry-2e', 9, 'chemistry', 'S1.5'),
    ('chemistry-2e', 12, 'chemistry', 'R2.2'),
    ('chemistry-2e', 13, 'chemistry', 'R2.3'),
    ('chemistry-2e', 14, 'chemistry', 'R3.1'),
    ('chemistry-2e', 16, 'chemistry', 'R1.4'),
    ('chemistry-2e', 17, 'chemistry', 'R3.2'),
    ('precalculus-2e', 1, 'math', 'M2'),
    ('precalculus-2e', 4, 'math', 'M2'),
    ('precalculus-2e', 5, 'math', 'M3'),
    ('precalculus-2e', 7, 'math', 'M3'),
    ('precalculus-2e', 11, 'math', 'M1'),
    ('calculus-volume-1', 3, 'math', 'M5'),
    ('calculus-volume-1', 4, 'math', 'M5'),
    ('calculus-volume-1', 5, 'math', 'M5'),
    ('calculus-volume-1', 6, 'math', 'M5'),
]

GREEK = {
    'α': r'\alpha', 'β': r'\beta', 'γ': r'\gamma', 'δ': r'\delta', 'ε': r'\varepsilon', 'θ': r'\theta', 'λ': r'\lambda',
    'μ': r'\mu', 'ν': r'\nu', 'π': r'\pi', 'ρ': r'\rho', 'σ': r'\sigma', 'τ': r'\tau', 'φ': r'\varphi', 'ϕ': r'\phi',
    'ω': r'\omega', 'Δ': r'\Delta', 'Ω': r'\Omega', 'Σ': r'\Sigma', 'Φ': r'\Phi', 'Θ': r'\Theta', 'Λ': r'\Lambda',
    'ψ': r'\psi', 'χ': r'\chi', 'η': r'\eta', 'κ': r'\kappa', 'ξ': r'\xi', 'ζ': r'\zeta', 'ι': r'\iota',
}
OPS = {
    '−': '-', '×': r'\times ', '·': r'\cdot ', '⋅': r'\cdot ', '°': r'^\circ ', '≈': r'\approx ', '→': r'\to ', '≤': r'\le ',
    '≥': r'\ge ', '±': r'\pm ', '∞': r'\infty ', '≠': r'\ne ', '∫': r'\int ', '∑': r'\sum ', '∂': r'\partial ', '√': r'\sqrt',
    '⟶': r'\longrightarrow ', '⇌': r'\rightleftharpoons ', '∝': r'\propto ', '∠': r'\angle ', '′': "'", '″': "''", '∘': r'\circ ',
    '{': r'\{', '}': r'\}', '%': r'\%', '|': '|', '…': r'\ldots ', '⋯': r'\cdots ', '⁡': '', '⁢': '', ' ': ' ',
    'ℏ': r'\hbar ', '∈': r'\in ', '∪': r'\cup ', '∩': r'\cap ', '⊥': r'\perp ', '∥': r'\parallel ', '⇒': r'\Rightarrow ',
    '←': r'\leftarrow ', '↔': r'\leftrightarrow ', '⟹': r'\Rightarrow ', '∣': '|', '−−': '--',
}
FUNCS = {'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'lim', 'sec', 'csc', 'cot', 'max', 'min', 'arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh'}


def esc_text(t: str) -> str:
    return ''.join(GREEK.get(c, OPS.get(c, c)) if c in GREEK or c in OPS else c for c in t).replace('$', r'\$')


def sym(t: str) -> str:
    out = []
    for c in t:
        if c in GREEK:
            out.append(GREEK[c] + ' ')
        elif c in OPS:
            out.append(OPS[c])
        elif c in '#&_^~':
            out.append('\\' + c if c in '#&_' else '')
        else:
            out.append(c)
    return ''.join(out)


def tex(n) -> str:
    if isinstance(n, NavigableString):
        return sym(str(n).strip())
    if not isinstance(n, Tag):
        return ''
    name = n.name.split(':')[-1]
    kids = [c for c in n.children if not (isinstance(c, NavigableString) and not str(c).strip())]
    T = lambda i: tex(kids[i]) if i < len(kids) else ''
    if name in ('math', 'mrow', 'mstyle', 'mpadded', 'mphantom', 'menclose', 'merror'):
        return ''.join(tex(c) for c in kids)
    if name == 'semantics':
        return tex(kids[0]) if kids else ''
    if name in ('annotation', 'annotation-xml', 'none', 'mprescripts'):
        return ''
    if name == 'mi':
        t = n.get_text().strip()
        if t in FUNCS:
            return '\\' + t + ' '
        if len(t) > 1 and not any(c in GREEK for c in t):
            return r'\mathrm{' + esc_text(t) + '}'
        return sym(t)
    if name == 'mn':
        return sym(n.get_text().strip())
    if name == 'mo':
        t = n.get_text().strip()
        if t in ('(', ')', '[', ']'):
            return t
        return sym(t)
    if name == 'mtext':
        t = n.get_text()
        return r'\text{' + t.replace('\\', '').replace('{', '').replace('}', '').replace('$', r'\$').replace('%', r'\%').replace('#', r'\#').replace('&', r'\&').replace('_', r'\_').replace('^', '') + '}' if t.strip() else r'\ '
    if name == 'mspace':
        return r'\,'
    if name == 'msup':
        return '{' + T(0) + '}^{' + T(1) + '}'
    if name == 'msub':
        return '{' + T(0) + '}_{' + T(1) + '}'
    if name == 'msubsup':
        return '{' + T(0) + '}_{' + T(1) + '}^{' + T(2) + '}'
    if name == 'mfrac':
        return r'\frac{' + T(0) + '}{' + T(1) + '}'
    if name == 'msqrt':
        return r'\sqrt{' + ''.join(tex(c) for c in kids) + '}'
    if name == 'mroot':
        return r'\sqrt[' + T(1) + ']{' + T(0) + '}'
    if name == 'mover':
        acc = kids[1].get_text().strip() if len(kids) > 1 and isinstance(kids[1], Tag) else ''
        if acc in ('→', '⇀', '⟶'):
            return r'\vec{' + T(0) + '}'
        if acc in ('¯', '―', '‾', '_', '−'):
            return r'\overline{' + T(0) + '}'
        if acc in ('^', 'ˆ'):
            return r'\hat{' + T(0) + '}'
        if acc in ('.', '˙', '·'):
            return r'\dot{' + T(0) + '}'
        return r'\overset{' + T(1) + '}{' + T(0) + '}'
    if name == 'munder':
        return r'\underset{' + T(1) + '}{' + T(0) + '}'
    if name == 'munderover':
        return '{' + T(0) + '}_{' + T(1) + '}^{' + T(2) + '}'
    if name == 'mmultiscripts':
        return ''.join(tex(c) for c in kids)
    if name == 'mfenced':
        o, c = n.get('open', '('), n.get('close', ')')
        return o + ','.join(tex(k) for k in kids) + c
    if name == 'mtable':
        rows = [' & '.join(tex(td) for td in tr.find_all(re.compile('mtd$'), recursive=False)) for tr in n.find_all(re.compile('mtr$'), recursive=False)]
        return r'\begin{matrix}' + r' \\ '.join(rows) + r'\end{matrix}'
    return ''.join(tex(c) for c in kids)


SKIP_WORDS = re.compile(r'\b(figure|graph|graphs|graphing|sketch|draw|table|diagram|shown|plot|picture|image|chart)\b', re.I)


def to_markup(container: Tag) -> str:
    """Text with $LaTeX$ for maths; paragraphs and list items on separate lines."""
    c = BeautifulSoup(str(container), 'lxml')
    for m in c.find_all(re.compile('(^|:)math$')):
        latex = re.sub(r'\s+', ' ', tex(m)).strip()
        disp = m.get('display') == 'block'
        m.replace_with(NavigableString(f' $${latex}$$ ' if disp else f' ${latex}$ '))
    for br in c.find_all(['p', 'li', 'div']):
        br.insert_after(NavigableString('\n'))
    text = c.get_text()
    # Escape stray dollar signs outside maths: OpenStax uses "$" in money amounts rarely; skip those exercises instead.
    lines = [' '.join(l.split()) for l in text.split('\n')]
    out = '\n'.join(l for l in lines if l)
    out = re.sub(r'\s+([,.;:?!)])', r'\1', out)
    return out


@lru_cache(None)
def page(book: str, slug: str) -> BeautifulSoup:
    r = subprocess.run(['curl', '-sSL', '--fail', '-m', '90', f'{BASE}{book}/pages/{slug}'], capture_output=True)
    if r.returncode != 0:
        sys.exit(f'Could not fetch {book}/{slug}')
    return BeautifulSoup(r.stdout.decode('utf-8', 'replace'), 'lxml')


def balanced(t: str) -> bool:
    return t.replace(r'\$', '').count('$') % 2 == 0


def chapter(book: str, ch: int, subject: str, topic: str) -> list:
    key = page(book, f'chapter-{ch}')
    out = []
    for sol in key.select('[data-type="solution"]'):
        a = sol.select_one('a.os-number')
        if not a:
            continue
        slug, frag, num = a.get('data-page-slug'), a.get('data-page-fragment'), a.get_text().strip()
        if not slug or not frag or 'conceptual' in slug or 'check-your-understanding' in slug or not num.isdigit():
            continue
        ex = page(book, slug).find(id=frag)
        if ex is None:
            continue
        prob = ex.select_one('.os-problem-container') or ex
        ans = sol.select_one('.os-solution-container') or sol
        if prob.find(['img', 'table', 'figure']) or ans.find(['img', 'table', 'figure']):
            continue
        p_text = to_markup(prob)
        a_text = to_markup(ans)
        if not p_text or not a_text or SKIP_WORDS.search(p_text) or SKIP_WORDS.search(a_text):
            continue
        if '$' in prob.get_text() or not balanced(p_text) or not balanced(a_text):
            continue
        if len(p_text) > 700 or len(a_text) > 500 or len(p_text) < 40:
            continue
        if re.search(r'answers? (will|may) vary|explain|discuss|describe', a_text, re.I):
            continue
        out.append({
            'subject': subject,
            'topic': topic,
            'prompt': p_text,
            'answer': a_text,
            'source': {'book': BOOK_TITLE[book], 'chapter': ch, 'number': int(num), 'url': f'{BASE}{book}/pages/{slug}'},
        })
        if len(out) >= PER_CHAPTER:
            break
    return out


def main():
    allx = []
    for book, ch, subject, topic in CHAPTERS:
        got = chapter(book, ch, subject, topic)
        print(f'{book} ch{ch} -> {len(got)}')
        allx += got
    OUT.write_text(
        '// Generated by scripts/openstax_exercises.py. Do not edit by hand.\n'
        '// Exercises and answers from OpenStax textbooks (Rice University), licensed under CC BY 4.0:\n'
        '// https://creativecommons.org/licenses/by/4.0/. Changes: maths converted to LaTeX; exercises needing figures removed.\n'
        'export interface OpenStaxExercise { subject: "physics" | "chemistry" | "math"; topic: string; prompt: string; answer: string; '
        'source: { book: string; chapter: number; number: number; url: string } }\n\n'
        f'export const OPENSTAX_EXERCISES: OpenStaxExercise[] = {json.dumps(allx, ensure_ascii=False, indent=1)};\n',
        encoding='utf-8',
    )
    print(f'{len(allx)} exercises -> {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
