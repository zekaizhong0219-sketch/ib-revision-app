# Content accuracy audit

Audit of all built-in content (1,183 flashcards, 327 practice questions, 31 writing tasks) carried out on 2 November 2026.

## Method
1. **Constants:** every physical constant written as `a × 10^n` was extracted and compared with the IB data booklet (h, e, G, mₑ, k_B, N_A, ε₀, g, c). All matched. An automated test (`src/data/__tests__/audit.test.ts`) now enforces this.
2. **Numeric answers:** all 48 science/maths numeric answers were recomputed independently in Python earlier; all were within 1 %.
3. **Marked answers:** all 141 multiple-choice and short-answer questions were listed with their marked answer and checked one by one.
4. **Line-by-line re-read** of the claims most likely to be wrong: dates (History), angles and data values (Chemistry), formulas (Physics, Maths), course facts (assessment weights, durations, criteria) and attributions of literary quotations (Spanish).
5. **Rendering:** every formula compiles in KaTeX; mhchem radical notation (`\ce{Cl^.}`) renders as a superscript dot.

## Corrections
| Subject | Card | Problem | Fix |
|---|---|---|---|
| Spanish A | Tipos de narrador | *Equisciente* and *testigo* were merged into one type. They differ: equisciente is third person with the knowledge of one character; testigo is a secondary character narrating in first person. | Split into five types: omnisciente, equisciente, protagonista, testigo, objetivo. |
| Chemistry | VSEPR: 2, 3 and 4 electron domains | "One lone pair → bent, ≈ 117°" was too specific (SO₂ is ≈ 119°). | "Slightly less than 120°, e.g. SO₂ ≈ 119°". |
| History | July Crisis — key steps | The card did not state the year. | Front now reads "July Crisis (1914)". Changing the front resets that one card's review progress. |

No other factual errors were found.

## New automated guards
- Physical constants must use data-booklet values.
- `g = 9.81` and `c = 3.00 × 10^8` wherever they are stated.
- Every History date card contains a year; every year in History questions falls within the syllabus period (1839–1997).
- Spanish content contains no em dash (house style: parentheses for asides).
- No placeholder text (TODO, FIXME, lorem ipsum).

## Limits of this audit
It was done by the same author who wrote the content, using scripted checks plus re-reading. It is not a substitute for a teacher's review. If you find an error, correct it in `src/data/` (the tests catch formatting problems) or note it for your teacher.

## Update: assessment criteria (from the student's Paper 1 / Paper 2 skills)
- **Spanish A Paper 2** is marked out of **25** from May 2026: A (5), B1 *Análisis de rasgos textuales y decisiones de los autores* (5), B2 *Análisis comparativo* (5), C (5), D (5). The rubric and the course cards previously used the pre-2026 scheme (A 10, B 10, C 5, D 5 = 30) and have been corrected. Essays self-assessed under the old scheme lose their old "B" mark in the estimate; re-mark them if needed.
- Criterion C in Paper 1 and the IO is *Focalización y organización* (was written as "Enfoque y organización").
