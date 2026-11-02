#!/usr/bin/env python3
"""
Builds src/data/paper1Sources.generated.ts: verbatim excerpts of public-domain / openly
licensed primary sources for the built-in History Paper 1 sets.

Every excerpt is cut from the fetched document by exact anchor strings, so the text in the
app is character-for-character the published text (only "[…]" marks omissions). The script
fails loudly if a document changes and an anchor is no longer found.

Sources:
  - Foreign Relations of the United States (FRUS), Japan 1931–1941, vols I–II (US government
    publication, public domain), via the official EPUB files from history.state.gov.
  - The Avalon Project, Yale Law School (treaty texts and the Nuremberg translation of the
    Hossbach Memorandum; public domain).
  - Hansard (UK House of Commons debates), via api.parliament.uk; reproduced under the
    Open Parliament Licence v3.0.

Usage: python3 scripts/paper1_sources.py   (needs curl, beautifulsoup4, lxml)
"""
import io
import json
import pathlib
import re
import subprocess
import sys
import zipfile
from functools import lru_cache

from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data' / 'paper1Sources.generated.ts'
GAP = '[…]'


def fetch(url: str) -> bytes:
    r = subprocess.run(['curl', '-sSL', '--fail', '-m', '120', url], capture_output=True)
    if r.returncode != 0:
        sys.exit(f'Could not fetch {url}: {r.stderr.decode()[:200]}')
    return r.stdout


def clean(t: str) -> str:
    return ' '.join(t.split())


@lru_cache(None)
def hansard(url: str, speaker: str) -> tuple:
    """Paragraphs spoken by `speaker` in a Hansard debate page (column markers removed)."""
    s = BeautifulSoup(fetch(url), 'lxml')
    for x in s.select('.column-permalink, .permalink'):
        x.decompose()
    out, cur = [], None
    for el in s.select('div.hentry'):
        who = el.select_one('cite')
        if who:
            cur = clean(who.get_text())
        if cur and speaker.lower() in cur.lower() and 'member_contribution' in el.get('class', []):
            out += [clean(p.get_text()) for p in el.find_all('p') if clean(p.get_text())]
    return tuple(dict.fromkeys(out))


@lru_cache(None)
def avalon(url: str) -> tuple:
    s = BeautifulSoup(fetch(url), 'lxml')
    return tuple(t for t in (clean(p.get_text()) for p in s.find_all('p')) if t)


@lru_cache(None)
def frus_epub(vol: str) -> zipfile.ZipFile:
    return zipfile.ZipFile(io.BytesIO(fetch(f'https://static.history.state.gov/frus/{vol}/ebook/{vol}.epub')))


@lru_cache(None)
def frus(vol: str, doc: str) -> tuple:
    """Paragraphs and list items of a FRUS document, footnote markers removed."""
    s = BeautifulSoup(frus_epub(vol).read(f'OEBPS/{doc}.html').decode('utf-8'), 'lxml')
    for x in s.select('a.note, sup'):
        x.decompose()
    return tuple(t for t in (clean(e.get_text()) for e in s.find_all(['p', 'li'])) if t)


def cut(paras: tuple, find: str, start: str | None = None, end: str | None = None) -> str:
    """The paragraph containing `find`, cut from `start` (inclusive) to `end` (inclusive)."""
    hits = [p for p in paras if find in p]
    if len(hits) != 1:
        sys.exit(f'Anchor {find!r}: expected 1 paragraph, found {len(hits)}')
    p = hits[0]
    if start and start not in p:
        sys.exit(f'Start {start!r} not found')
    i = p.index(start) if start else 0
    if end and end not in p[i:]:
        sys.exit(f'End {end!r} not found in {p[i:i + 300]!r}…')
    j = p.index(end, i) + len(end) if end else len(p)
    return p[i:j]


FRUS1 = 'frus1931-41v01'
FRUS2 = 'frus1931-41v02'
FRUS_URL = 'https://history.state.gov/historicaldocuments/{}/{}'
HANSARD = 'https://api.parliament.uk/historic-hansard/commons/'
AVALON = 'https://avalon.law.yale.edu/'


def build() -> dict:
    ex = {}

    def add(key: str, url: str, *parts: str):
        ex[key] = {'url': url, 'text': '\n\n'.join(parts)}

    # ── Manchuria, 1931–1933 ─────────────────────────────────────
    d = frus(FRUS1, 'd57')
    add('stimson-1932', FRUS_URL.format(FRUS1, 'd57'), cut(d, 'With the recent military operations about Chinchow'))
    d = frus(FRUS1, 'd58')
    add(
        'japan-reply-1932',
        FRUS_URL.format(FRUS1, 'd58'),
        cut(d, 'They take note of the statement', 'They take note of the statement', 'means contrary to the treaty of 27 August, 1928.'),
        GAP,
        cut(d, 'replacement which has occurred in the personnel'),
        cut(d, 'Japan entertains in Manchuria no territorial aims', 'While it need not be repeated', 'of quite extraordinary importance to the Japanese people.'),
    )
    d = frus(FRUS1, 'd73')
    add(
        'grew-1932',
        FRUS_URL.format(FRUS1, 'd73'),
        cut(d, 'I cannot too strongly impress', 'I cannot too strongly impress', 'all opposition on that basis.'),
    )
    d = frus(FRUS1, 'd81')
    add(
        'grew-1933',
        FRUS_URL.format(FRUS1, 'd81'),
        cut(d, 'The Foreign Office spokesman stated definitely', 'The Foreign Office spokesman stated definitely', 'have not yet been determined.'),
        GAP,
        cut(d, 'The decision to withdraw cannot yet be said', 'The decision to withdraw cannot yet be said', 'indicates such a possibility.'),
        cut(d, 'advance into Jehol'),
    )

    # ── The road to Pearl Harbor, 1940–1941 ──────────────────────
    d = avalon(AVALON + 'wwii/triparti.asp')
    add(
        'tripartite-1940',
        AVALON + 'wwii/triparti.asp',
        cut(d, 'considering it as a condition precedent of any lasting peace'),
        cut(d, 'Japan recognizes and respects the leadership of Germany and Italy'),
        cut(d, 'Germany and Italy recognize and respect the leadership of Japan'),
        cut(d, 'They further undertake to assist one another'),
    )
    d = frus(FRUS2, 'd409')
    add(
        'hull-1941',
        FRUS_URL.format(FRUS2, 'd409'),
        cut(d, 'propose to take steps as follows'),
        GAP,
        cut(d, 'will withdraw all military, naval, air and police forces from China'),
        cut(d, 'will not support—militarily, politically, economically'),
        GAP,
        cut(d, 'remove the freezing restrictions on Japanese funds'),
    )
    d = frus(FRUS2, 'd420')
    add(
        'japan-memo-1941',
        FRUS_URL.format(FRUS2, 'd420'),
        cut(d, 'resorted to every possible measure to assist the Chungking'),
        GAP,
        cut(d, 'it is impossible to reach an agreement through further negotiations'),
    )
    d = frus(FRUS2, 'd422')
    add(
        'fdr-1941',
        FRUS_URL.format(FRUS2, 'd422'),
        cut(d, 'a date which will live in infamy'),
        cut(d, 'The United States was at peace with that Nation'),
        cut(d, 'the distance of Hawaii from Japan'),
    )

    # ── Czechoslovakia and Munich, 1937–1938 ─────────────────────
    d = avalon(AVALON + 'imt/hossbach.asp')
    add(
        'hossbach-1937',
        AVALON + 'imt/hossbach.asp',
        cut(d, "Germany's problem could only be solved by means of force", None, 'never without attendant risk.'),
        GAP,
        cut(d, 'our first objective, in the event of our being embroiled in war', None, 'operation against the West.'),
        GAP,
        cut(d, 'Actually, the Fuehrer believed', None, 'war against Germany.'),
    )
    d = avalon(AVALON + 'imt/munich1.asp')
    add(
        'munich-1938',
        AVALON + 'imt/munich1.asp',
        cut(d, 'taking into consideration the agreement, which has been already reached in principle'),
        cut(d, '(1) The evacuation will begin on 1st October.'),
        cut(d, '(2) The United Kingdom, France and Italy agree that the evacuation'),
    )
    url = HANSARD + '1938/oct/03/prime-ministers-statement'
    d = hansard(url, 'Prime Minister')
    add(
        'chamberlain-1938',
        url,
        cut(d, 'we should do well to avoid describing it as a personal or a national triumph', None, 'ended civilisation as we have known it.'),
        GAP,
        cut(d, 'Ever since I assumed my present office my main purpose'),
    )
    url = HANSARD + '1938/oct/05/policy-of-his-majestys-government'
    d = hansard(url, 'Churchill')
    add(
        'churchill-1938',
        url,
        cut(d, 'Having thus fortified myself by the example of others', 'I will begin by saying what everybody'),
        GAP,
        cut(d, 'All is over. Silent, mournful, abandoned, broken', None, 'with the League of Nations, of which she has always been an obedient servant.'),
    )

    # ── The outbreak of war, 1939 ────────────────────────────────
    url = HANSARD + '1939/mar/31/european-situation-1'
    d = hansard(url, 'Prime Minister')
    add('guarantee-1939', url, cut(d, 'I am glad to take this opportunity'), cut(d, 'which clearly threatened Polish independence'))
    d = avalon(AVALON + '20th_century/nonagres.asp')
    add(
        'nonaggression-1939',
        AVALON + '20th_century/nonagres.asp',
        cut(d, 'desirous of strengthening the cause of peace'),
        cut(d, 'obligate, themselves to desist from any act of violence'),
        cut(d, 'shall in no manner lend its support to this third power'),
        cut(d, 'Neither of the two High Contracting Parties shall participate in any grouping'),
    )
    d = avalon(AVALON + '20th_century/addsepro.asp')
    add(
        'protocol-1939',
        AVALON + '20th_century/addsepro.asp',
        cut(d, 'On the occasion of the signature of the Nonaggression Pact'),
        cut(d, 'the northern boundary of Lithuania shall represent the boundary'),
        cut(d, 'areas belonging to the Polish state'),
        cut(d, 'maintenance of an independent Polish state'),
        cut(d, 'This protocol shall be treated by both parties as strictly secret.'),
    )
    url = HANSARD + '1939/sep/03/prime-ministers-announcement'
    d = hansard(url, 'Prime Minister')
    add('chamberlain-1939', url, cut(d, 'This is a sad day for all of us'))
    return ex


def main():
    ex = build()
    for k, v in ex.items():
        if re.search(r'[\[\]]', v['text'].replace(GAP, '')):
            print(f'note: {k} contains square brackets (editorial insertions in the original)')
        print(f'{k}: {len(v["text"].split())} words')
    body = json.dumps(ex, ensure_ascii=False, indent=2)
    OUT.write_text(
        '// Generated by scripts/paper1_sources.py. Do not edit by hand; re-run the script instead.\n'
        '// Verbatim excerpts; "[…]" marks omitted text. See the script for sources and licences.\n'
        f'export const PAPER1_SOURCE_TEXT: Record<string, {{ url: string; text: string }}> = {body};\n',
        encoding='utf-8',
    )
    print(f'wrote {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
