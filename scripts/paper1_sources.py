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


@lru_cache(None)
def frus_html(url: str) -> tuple:
    """Paragraphs of a FRUS document page on history.state.gov (footnotes and page markers removed)."""
    s = BeautifulSoup(fetch(url), 'lxml')
    for x in s.select('a.note, sup'):
        x.decompose()
    out = (re.sub(r'\s*\[Page \d+\]\s*', ' ', clean(p.get_text())) for p in s.find_all('p'))
    return tuple(clean(t) for t in out if t)


@lru_cache(None)
def presidency(url: str) -> tuple:
    """Paragraphs of a document on the American Presidency Project (UC Santa Barbara)."""
    s = BeautifulSoup(fetch(url), 'lxml')
    root = s.select_one('div.field-docs-content') or s
    return tuple(t for t in (clean(p.get_text()) for p in root.find_all('p')) if t)


@lru_cache(None)
def wikisource(url: str) -> tuple:
    """Paragraphs of a Wikisource transcription (main content only)."""
    s = BeautifulSoup(fetch(url), 'lxml')
    root = s.select_one('#mw-content-text') or s
    return tuple(t for t in (clean(p.get_text()) for p in root.find_all('p')) if t)


@lru_cache(None)
def page_lines(url: str) -> tuple:
    """All text lines of a page (for documents whose text is not in <p> elements)."""
    s = BeautifulSoup(fetch(url), 'lxml')
    return tuple(t for t in (clean(x) for x in s.get_text('\n').split('\n')) if t)


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

    # ── Abyssinia, 1935 ──────────────────────────────────────────
    d = avalon(AVALON + '20th_century/leagcov.asp')
    add(
        'covenant-art16',
        AVALON + '20th_century/leagcov.asp',
        cut(d, 'Should any Member of the League resort to war in disregard of its covenants'),
        cut(d, 'It shall be the duty of the Council in such case to recommend'),
    )
    url = HANSARD + '1935/dec/10/italy-and-abyssinia'
    d = hansard(url, 'Baldwin')
    add('baldwin-1935', url, cut(d, 'The House is aware that the Committee of Co-ordination at Geneva'))
    url = HANSARD + '1935/dec/19/personal-explanation'
    d = hansard(url, 'Hoare')
    add(
        'hoare-1935',
        url,
        cut(d, 'In both these fields, in both the field of collective action', 'In any case, about a fortnight ago it was clear', 'act involving war against her.'),
        GAP,
        cut(d, 'In both these fields, in both the field of collective action', 'What was in our mind was something very different'),
    )
    url = HANSARD + '1935/dec/19/league-of-nations-and-abyssinia'
    d = hansard(url, 'Attlee')
    add(
        'attlee-1935',
        url,
        cut(d, 'I beg to move, That the terms put forward', None, 'demands that these terms be immediately repudiated.'),
        GAP,
        cut(d, 'There are two issues raised to-day.', 'Secondly, there is the honour of this country.'),
    )

    # ── The Sino-Japanese War and the "New Order", 1937–1938 ─────
    d = frus(FRUS1, 'd242')
    add('hull-1937', FRUS_URL.format(FRUS1, 'd242'), cut(d, 'This country constantly and consistently advocates maintenance of peace.', None, 'faithful observance of international agreements.'))
    d = frus(FRUS1, 'd283')
    add(
        'quarantine-1937',
        FRUS_URL.format(FRUS1, 'd283'),
        cut(d, 'Innocent peoples and nations are being cruelly sacrificed'),
        GAP,
        cut(d, 'It seems to be unfortunately true that the epidemic of world lawlessness is spreading.'),
        cut(d, 'When an epidemic of physical disease starts to spread'),
        GAP,
        cut(d, 'It is my determination to pursue a policy of peace', None, 'too weak to protect themselves adequately.'),
    )
    d = frus(FRUS1, 'd329')
    add(
        'new-order-1938',
        FRUS_URL.format(FRUS1, 'd329'),
        cut(d, 'our naval and military forces have captured Canton'),
        cut(d, 'What Japan seeks is the establishment of a new order'),
        cut(d, 'This new order has for its foundation a tripartite relationship'),
    )
    d = frus(FRUS1, 'd617')
    add(
        'us-note-1938',
        FRUS_URL.format(FRUS1, 'd617'),
        cut(d, 'This Government is well aware that the situation has changed.', 'This Government is well aware that the situation has changed.'),
    )

    # ── The Rhineland and the Anschluss, 1936–1938 ───────────────
    url = HANSARD + '1936/mar/09/rhineland-military-occupation'
    d = hansard(url, 'Eden')
    add(
        'eden-1936',
        url,
        cut(d, 'The German Ambassador came to see me on the morning of 7th March', 'The Memorandum falls into two parts.'),
        GAP,
        cut(d, 'There is, I am thankful to say, no reason to suppose'),
    )
    url = HANSARD + '1938/mar/14/foreign-affairs-austria'
    d = hansard(url, 'Prime Minister')
    add(
        'neurath-1938',
        url,
        cut(d, 'To these protests the German Government replied', 'In the name of the German Government, I must state in reply', 'even though only conditional.'),
    )
    add(
        'chamberlain-austria-1938',
        url,
        cut(d, 'It is quite untrue to suggest that we have ever given Germany our assent', None, 'violent methods.'),
        GAP,
        cut(d, 'In appraising recent events it is necessary to face facts', None, 'use force to prevent it.'),
    )
    d = hansard(url, 'Churchill')
    add(
        'churchill-austria-1938',
        url,
        cut(d, 'The gravity of the event of 11th March cannot be exaggerated.', None, 'to cope with it.'),
        GAP,
        cut(d, 'The gravity of the event of 11th March cannot be exaggerated.', 'If we were to delay'),
    )
    return ex


def build_cold_war() -> dict:
    """Short verbatim quotations from public-domain Cold War documents (Topic 12 evidence cards)."""
    ex = {}

    def add(key: str, url: str, *parts: str):
        ex[key] = {'url': url, 'text': f' {GAP} '.join(parts)}

    P = 'https://www.presidency.ucsb.edu/documents/'
    H = 'https://history.state.gov/historicaldocuments/'
    url = AVALON + 'wwii/yalta.asp'
    add('yalta-1945', url, cut(page_lines(url), 'pledged to the earliest possible establishment through free elections', 'to form interim governmental authorities', 'responsive to the will of the people'))
    url = H + 'frus1946v06/d475'
    d = frus_html(url)
    add('kennan-insecurity', url, cut(d, "At bottom of Kremlin’s neurotic view", None, 'sense of insecurity.'))
    add('kennan-force', url, cut(d, 'we have here a political force committed fanatically', 'In summary,', 'if Soviet power is to be secure.'))
    url = AVALON + '20th_century/trudoc.asp'
    d = avalon(url)
    add('truman-doctrine', url, cut(d, 'nearly every nation must choose between alternative ways of life'), cut(d, 'I believe that it must be the policy of the United States to support free peoples'))
    add('truman-misery', url, cut(d, 'The seeds of totalitarian regimes are nurtured by misery and want', None, 'when the hope of a people for a better life has died.'))
    url = AVALON + '20th_century/nato.asp'
    add('nato-art5', url, cut(avalon(url), 'an armed attack against one or more of them in Europe or North America', None, 'shall be considered an attack against them all'))
    url = H + 'frus1950v01/d85'
    d = frus_html(url)
    add('nsc68-faith', url, cut(d, 'animated by a new fanatic faith', 'Second, the Soviet Union', 'over the rest of the world.'))
    add('nsc68-design', url, cut(d, 'The fundamental design of those who control the Soviet Union', None, 'areas now under their control.'))
    url = AVALON + '20th_century/warsaw.asp'
    add('warsaw-art4', url, cut(avalon(url), 'In the event of armed attack in Europe on one or more of the Parties', None, 'including armed force.'))
    url = P + 'radio-and-television-report-the-american-people-the-soviet-arms-buildup-cuba'
    d = presidency(url)
    add('jfk-missiles', url, cut(d, 'unmistakable evidence has established the fact', 'Within the past week', 'against the Western Hemisphere.'))
    add('jfk-quarantine', url, cut(d, 'To halt this offensive buildup, a strict quarantine', 'To halt this offensive buildup', 'be turned back.'))
    url = H + 'frus1961-63v06/d65'
    d = frus_html(url)
    add('khrushchev-knot', url, cut(d, 'the knot of war', 'we and you ought not now to pull', 'the tighter that knot will be tied.'))
    add('khrushchev-offer', url, cut(d, 'Let us therefore show statesmanlike wisdom. I propose:', 'We, for our part, will declare', 'military specialists in Cuba would disappear.'))
    url = P + 'remarks-the-rudolph-wilde-platz-berlin'
    d = presidency(url)
    add('jfk-berlin', url, cut(d, 'There are some who say that communism is the wave of the future.', 'There are some who say that communism', 'Let them come to Berlin. And there'), cut(d, 'we have never had to put a wall up', None, 'to prevent them from leaving us.'))
    url = P + 'text-the-basic-principles-relations-between-the-united-states-america-and-the-union-soviet'
    add('basic-principles-1972', url, cut(presidency(url), 'there is no alternative to conducting their mutual relations on the basis of peaceful coexistence', 'They will proceed', 'peaceful coexistence.'))
    url = P + 'remarks-the-annual-convention-the-national-association-evangelicals-orlando-florida'
    add('reagan-evil-empire', url, cut(presidency(url), 'the aggressive impulses of an evil empire', 'label both sides equally at fault', 'good and evil.'))
    url = P + 'remarks-east-west-relations-the-brandenburg-gate-west-berlin'
    add('reagan-wall', url, cut(presidency(url), 'Mr. Gorbachev, tear down this wall!', 'General Secretary Gorbachev', 'tear down this wall!'))
    # Balance: the Marshall Plan and Soviet statements (official translations in FRUS).
    url = 'https://en.wikisource.org/wiki/Marshall_Plan_Speech'
    d = wikisource(url)
    add(
        'marshall-1947',
        url,
        cut(d, 'Our policy is directed not against any country or doctrine', 'Our policy is directed'),
        cut(d, 'Any government which maneuvers to block the recovery', 'Any government which maneuvers', 'will encounter the opposition of the United States.'),
    )
    d = frus('frus1945v05', 'd199')
    add(
        'stalin-poland-1945',
        FRUS_URL.format('frus1945v05', 'd199'),
        cut(d, 'Poland borders with the Soviet Union', 'It is also necessary'),
        cut(d, 'You, apparently, do not agree that the Soviet Union has a right', None, 'a government hostile toward it.'),
    )
    url = AVALON + '20th_century/warsaw.asp'
    add(
        'warsaw-preamble',
        url,
        cut(avalon(url), 'with the participation of a remilitarized Western Germany', 'mindful, at the same time', 'threat to the national security of the peaceable states'),
    )
    url = H + 'frus1961-63v06/d66'
    add('khrushchev-turkey', url, cut(frus_html(url), 'But Turkey adjoins us', 'You are disturbed over Cuba.', 'do not accord the same right to us?'))
    url = H + 'frus1961-63v06/d68'
    add('khrushchev-dismantle', url, cut(frus_html(url), 'has given a new order to dismantle the arms'))
    for k, v in ex.items():
        v['text'] = v['text'].replace(' Let them come to Berlin. And there', ' Let them come to Berlin.')
    return ex


def main():
    ex = build()
    for k, v in ex.items():
        if re.search(r'[\[\]]', v['text'].replace(GAP, '')):
            print(f'note: {k} contains square brackets (editorial insertions in the original)')
        print(f'{k}: {len(v["text"].split())} words')
    cw = build_cold_war()
    for k, v in cw.items():
        print(f'{k}: {len(v["text"].split())} words')
    body = json.dumps(ex, ensure_ascii=False, indent=2)
    cw_body = json.dumps(cw, ensure_ascii=False, indent=2)
    OUT.write_text(
        '// Generated by scripts/paper1_sources.py. Do not edit by hand; re-run the script instead.\n'
        '// Verbatim excerpts; "[…]" marks omitted text. See the script for sources and licences.\n'
        f'export const PAPER1_SOURCE_TEXT: Record<string, {{ url: string; text: string }}> = {body};\n\n'
        f'export const COLD_WAR_QUOTES: Record<string, {{ url: string; text: string }}> = {cw_body};\n',
        encoding='utf-8',
    )
    print(f'wrote {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
