# IB Revision

A study app for six IB Diploma subjects: **Physics HL, Chemistry HL, Math AA HL, Spanish A: Language & Literature SL, English B HL and History SL**. It uses spaced repetition, timed practice, timed essay writing with rubric self-assessment, and tracks your weak topics. It runs entirely in the browser, works offline, and can be installed on a phone as an app (PWA).

**Live app:** https://zekaizhong0219-sketch.github.io/ib-revision-app/ (after Pages is enabled, see [Deploy](#deploy-github-pages))

| | |
|---|---|
| Flashcards | **1,183**: Physics 279 · Chemistry 219 · Math AA 161 · Spanish A 152 · English B 155 · History 217 (including IB command terms) |
| Practice questions | **518**, all original: Physics 127 · Chemistry 103 · Math 103 · Spanish A 64 · English B 57 · History 64 |
| Structured (Paper 2-style) questions | **58** of the above, 221 parts with mark schemes: Physics 21 · Chemistry 16 · Math 17 · English B reading texts 4 |
| Timed writing tasks | **38**: Spanish A Paper 1 (3 original texts) and Paper 2 (9) · English B Paper 1 (10) · History Paper 2 (16) |
| Model answers (exemplars) | **6** annotated: Spanish A Paper 1 and Paper 2 · History Paper 2 (×2) · English B Paper 1 (speech, blog) |
| Listening | **4** original English B recordings (29 questions) played by text-to-speech, plus a strategy guide |
| Syllabus | Physics & Chemistry: first assessment 2025. Math AA: first assessment 2021, topics 1–5. Spanish A Lang & Lit: first assessment 2021. English B: first assessment 2020 (five themes). History: prescribed subject 3 *The move to global war*, world history topics 11 *Causes and effects of 20th-century wars* (examples: WWI, WWII, Spanish Civil War, Russo-Japanese War, Chinese Civil War) and 12 *The Cold War*. AHL content is tagged. |

## Features

### 1. Flashcards with spaced repetition
- **FSRS-4.5 scheduler** (default, `src/lib/fsrs.ts`) with the published default parameters. Each card has a memory *stability* (days until your chance of recall falls to 90 %) and a *difficulty* (1–10). A card comes back when its predicted recall drops to your **target recall** (default 90 %, adjustable from 80 to 97 % in Settings). FSRS usually needs fewer reviews than SM-2 for the same retention.
- **SM-2** (`src/lib/srs.ts`) is still available in Settings. Existing SM-2 progress converts to FSRS automatically the next time each card is reviewed: stability ≈ the current interval, difficulty mapped from the ease factor. You can switch back at any time. Intervals are capped at 365 days.
- A failed card ("Again") comes back after 10 minutes and again later in the same session.
- New cards are limited per day (default 20, configurable) and interleaved across subjects.
- **Cram mode** shows up to 30 random cards from chosen topics without changing the schedule. Use it the night before a test.
- All maths renders with **KaTeX**. Chemical equations use `\ce{}` (mhchem).
- **Card library**: search and filter by subject, topic, type and status; suspend cards or reset their progress; **add, edit and delete your own cards** with a live preview.
- **Mistake notebook**: questions you get wrong or only partly right in Practice or a mock automatically become review cards (Library → Status → Mistake notebook). This can be switched off in Settings.
- **Leeches**: cards you have forgotten 5 or more times are flagged on the Dashboard and in the Library, so you can rewrite or split them.
- **Report a mistake** (⚑) under any card or question saves a note. Settings lists your notes and exports them as Markdown.

### Subjects in detail
- **Spanish A** (written in Spain's Spanish, following RAE norms): rhetorical figures with public-domain examples, genres and metre, non-literary text types and image analysis, literary movements, the course framework (areas of exploration, concepts, global-issue fields), and Paper 1 / Paper 2 / IO strategy. Set-work packs for *La amiga estupenda*, *Un enemigo del pueblo* and *El árbol de la ciencia* follow the student's own reading guides (Baroja and Ibsen quotations checked against the class editions; no literal Ferrante quotations, as the guide advises), plus packs for *El conde Lucanor*, *Persépolis* and *El cuarto de atrás*. Paper 2 is self-marked with the criteria in force from May 2026 (A, B1, B2, C, D; 25 marks).
- **English B HL**: conventions of 19 text types, register and tone, linking words and C1 grammar, idioms, vocabulary for the five themes, and Paper 2 / IO strategy. Packs for the two IO works, *To Kill a Mockingbird* and *Victory City* (very few quotations; check them against your edition).
- **History SL**: dated events, people and concepts for PS3 (Japan 1931–41; Germany and Italy 1933–40), OPVL source skills, WWI, WWII, the Spanish Civil War, the Cold War (origins, leaders, crises, détente and end) and historiography. Dates were double-checked; still confirm anything you quote in an exam against your textbook.

### 2. Timed practice
- Pick subjects, topics and a duration from 5 to 45 minutes.
- **Multiple choice** questions are marked automatically.
- **Numeric** questions are marked automatically within a tolerance (±2 % by default, or set per question). Accepted formats include `12.5`, `12,5` (decimal comma), `3.2e-5`, `3.2×10^-5`, `3.2·10⁻⁵`, `1/3` and `9.81 m s^-2`.
- **Short answer** questions are marked automatically; accents, capitals and a leading article are ignored (e.g. *metafora* = *metáfora*).
- **Put in order** (chronology, essay structure) and **matching** questions give partial credit.
- **Open** questions are self-marked (Missed / Partly / Got it) against a model answer. You can optionally mix in flashcard recall prompts.
- **Structured questions** (Paper 2 style) are answered part by part, e.g. (a) [2], (b) [3]. Numeric and short-answer parts are auto-marked, and you can override for method marks. For explanation parts you write on paper, then mark yourself against the mark scheme. Marks are recorded and feed topic accuracy exactly.
- The results screen gives your score, average time per question, accuracy per topic, and worked solutions for every question you missed.

### Mock exams (Practice → Mock exam mode, or press `m`)
- A 30, 60 or 90-minute paper is assembled from the question bank and spread across topics: short items first, then structured questions (about 60 % of the marks when available), sized at about 1 mark per 1.3 minutes.
- **No feedback while you sit it**, like a real exam. A question palette shows what you've answered.
- Afterwards, auto-markable answers are scored and you mark the written ones against the scheme. You then get a score, a by-topic breakdown and a rough grade.
- **Grade estimates** on the Dashboard combine your recent mocks and, for essay subjects, your self-assessed essays. They are shown as a range that reflects how much your results vary. The thresholds (7 ≥ 70 %, 6 ≥ 58 %, 5 ≥ 46 %, 4 ≥ 35 %, 3 ≥ 24 %, 2 ≥ 13 %) are a rough guide, **not** real IB boundaries, which differ by subject and session and include internal assessment.

### Timed writing (Writing tab)
- Real paper timings (e.g. English B Paper 1: 90 min, 450–600 words; Spanish Paper 1 SL: 75 min; History Paper 2: 45 min per essay), a live word count against the word range, optional planning hints, and drafts that **autosave**.
- When you finish, mark yourself against each criterion. The bands are short **paraphrases** of the IB criteria; check the official wording with your teacher. Your score history is charted per subject, and essay scores feed topic accuracy at single weight.
- **Exemplars**: some tasks have an annotated model answer (written for the app) with an estimated score and a note per criterion. Try the task first; the app asks before showing it if you haven't completed an attempt. Scores are estimates, not official marking.

### English B listening (Practice → Listening trainer)
- Four original recordings (radio interview, podcast, school news report, talk) across the five themes, read aloud by your browser's speech synthesis with a different voice per speaker where the device has several. Quality depends on the voices installed on your system; Chrome, Edge and Safari work best.
- As in the exam, you get **two plays**; *practice mode* removes the limit, and you can slow the speed down. Questions (gap-fill, short answer, multiple choice, true/false with justification) are auto-marked, and the transcript appears only after you submit.
- A strategy guide covers what to do before listening, on the first and second play, and afterwards.

### 3. Weak-topic tracker / dashboard
- **Today's plan** fits your daily study budget (default 60 min). Due reviews come first, then practice slots aimed at each subject's weakest topic, weighted by how close the exam is. Spanish, English and History get a timed-writing session if you haven't written one in the last 7 days.
- **Review load** chart: estimated review minutes for the next 7 days, per subject.
- Tiles show cards due now, new cards today, your streak (current and best), activity today and cards studied.
- **What to revise next** ranks topics using four signals: low accuracy, cards never studied, due backlog, and how soon that subject's exam is. It shows the reasons for each pick and links straight to cards or practice for that topic.
- Charts: activity over the last 30 days, review forecast for the next 14 days, and **accuracy by topic** for each subject.
- Accuracy covers the last 90 days. In flashcard reviews Good and Easy count as correct and Hard as half. Practice answers count double, because they test application rather than recall.

### 4. Exams & deadlines
- Add each paper with a date, time and optional subject. The next exam shows on the dashboard with a live countdown.
- Add **deadlines** too (Spanish IO, English IO, History IA, EE, TOK). They show as reminders but don't change the recommendations.
- **Calendar export**: download an `.ics` file with every exam and deadline, each with a reminder the day before, plus an optional daily study session until your last exam. It imports into Google Calendar or Apple Calendar.
- Exams less than 30 days away push their subject up in the recommendations.
- The default entry is a **placeholder**: replace it with your official timetable.

### 5. Look and feel
- Light, dark or system theme. Responsive layout with a bottom tab bar on phones. Installable and works offline.
- **Interface language**: English, Español or 中文 (Settings). Menus and buttons change; study content stays in each subject's own language.
- **Keyboard shortcuts** (press `?` in the app):

| Key | Action |
|---|---|
| `d` `r` `p` `w` `c` `e` `s` | Dashboard, Review, Practice, Writing, Library (cards), Exams, Settings |
| `m` | Mock exam |
| `t` | Cycle theme |
| `Space` / `Enter` | Show answer (then `Enter` = Good) |
| `1` `2` `3` `4` | Again / Hard / Good / Easy, or choose an MC option (`A`–`D` also work) |
| `1` `2` `3` | Self-mark an open question |
| `Esc` | End session |

### Settings
- **My subjects**: hide subjects you don't take; your progress in them is kept.
- Which subjects go into reviews and the plan, new cards per day, daily study budget, theme, and backup.

### Your data
Progress is saved in your browser's `localStorage`. Every read and write is wrapped in try/catch, invalid entries are dropped on load, and the logs are capped so storage never fills up. Nothing is sent to any server.
**Settings → Export backup** downloads a JSON file. **Import** can either *merge* it (keeping the newest progress for each card) or *replace* everything. Export regularly, especially before clearing your browser data or switching devices.

## Run locally

Requires Node 20+.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173/ib-revision-app/.

Other scripts:

```bash
npm test          # Vitest unit tests: scheduler, answer checking, storage, stats, content validation
npm run lint      # ESLint
npm run typecheck # TypeScript
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Add or edit content

Content lives in versioned TypeScript files under `src/data/`, written in a compact text format inside `String.raw` template literals, so LaTeX backslashes don't need escaping.

### Flashcards: `src/data/cards/*.ts`

```
# B.3                                  ← topic id from src/data/syllabus.ts
[f] Ideal gas equation :: $PV = nRT$
[d] Isotopes :: Atoms of the same element with different numbers of neutrons.
// comments and blank lines are ignored
```

- Kind tags: `[d]` definition, `[f]` formula, `[u]` unit, `[c]` command term, `[k]` concept, `[x]` fact, `[y]` date/event, `[p]` person, `[r]` literary/rhetorical device, `[v]` vocabulary, `[s]` text type, `[q]` quotation.
- `¶` is a line break. `$…$` is inline maths, `$$…$$` is display maths, `$\ce{…}$` is a chemical equation, `**bold**` is bold, and `\$` is a literal dollar sign (e.g. `US\$13 billion`).
- Don't write `${` in content: inside a template literal it starts code. Write `$ {}^nP_r$` (with a space) instead.
- A card's ID is a hash of subject + topic + front text. Adding or reordering cards never loses progress; changing a card's **front** resets that card only.

### Practice questions: `src/data/questions/*.ts`

```
@mc A.2
Q: Question text
O: wrong option
O*: correct option
S: Worked solution

@num C.4 value=352 rel=0.02 unit=m s^-1
Q: …
S: …

@open D.4
Q: …
A: Model answer used for self-marking
```

For numeric questions, `rel` is a relative tolerance (default 0.02) and `abs` an absolute one; with both, the larger applies.

```
@text W12.CR                ← accepted answers separated by |  (add "strict" to require exact accents/case)
Q: Which 1962 crisis…?
A: Cuban Missile Crisis | Missile Crisis

@order W12.RMA              ← items in the CORRECT order; shown shuffled
Q: Put these in order.
I: Yalta
I: Potsdam
I: Truman Doctrine

@match FIG                  ← left => right, correctly paired
Q: Match each example to its figure.
P: «hielo abrasador» => oxímoron
P: «Luchó como un león» => símil
P: «Te lo he dicho mil veces» => hipérbole
```

### Structured questions: `src/data/questions/*Structured.ts`, `englishReading.ts`

```
@struct A.2
Q: Stem / context
a) [2] Calculate the common velocity.
= 7.5 unit=m s^-1          ← optional: numeric auto-marking (default ±2 %)
M: mark-scheme point (1) ¶ next point (1)
b) [1] Which word means "quick"?
~ swift | rapid            ← optional: short-text auto-marking
M: swift (1)
c) [2] Explain…
M: point (1) ¶ point (1)
```

### Timed writing tasks: `src/data/essays/*.ts`

```
@essay TT rubric=engb-p1 minutes=90 min=450 max=600
Q: Task text
S: Planning hints
```

The rubrics (`src/data/rubrics.ts`) are `esp-p1`, `esp-p2`, `engb-p1`, `hist-p2` and `hist-p1-q4`.

After editing, run `npm test`. The content tests check that IDs are unique, every topic exists in the syllabus, every formula compiles in KaTeX, dollar signs are balanced, each subject has at least 150 cards and 40 questions, every MC question has exactly one correct option, essay tasks use an existing rubric, and the rubric bands cover every mark.

You can also add cards from inside the app (**Library → + New card**). Those are stored with your progress and included in backups.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` runs lint, tests and the build on every push and pull request, and deploys `dist/` to GitHub Pages on pushes to `main`. Vite's `base` is set to `/ib-revision-app/`.

**One-time setup:** in the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. Then re-run the workflow, or push to `main`.

> **Private repository:** GitHub Pages for private repositories requires a paid plan (GitHub Pro, Team or Enterprise). On a free plan, either make the repository public or run the app locally. Pages sites are publicly accessible even when the repository is private, unless you use Enterprise access control.

## Project structure

```
src/
  data/        syllabus, flashcard decks, question banks, content DSL parser
  lib/         srs (SM-2), answer checking, storage/backup (v2 migration), stats & recommendations, daily planner, review queue, KaTeX markup
  data/rubrics.ts, data/essays/   assessment criteria (paraphrased) and timed-writing tasks
  data/exemplars/   annotated model answers, each linked to one writing task
  data/listening.ts  English B listening scripts, questions and strategy guide
  views/       Dashboard, Review, Practice, Mock, Listening, Writing, Cards (library), Exams, Settings
  components/  MathText, charts, UI primitives, keyboard help
```

## Accuracy and disclaimer

A full content audit is documented in [`docs/AUDIT.md`](docs/AUDIT.md): method, corrections made, and the automated guards now enforced by the tests (data-booklet constants, History years, Spanish house style, no placeholders).


All definitions and formulas were written for this app and checked against standard physics, chemistry and mathematics (IB data-booklet notation and constants where relevant). Every numeric practice answer was independently recomputed. If you find a mistake, fix it in `src/data/`; the tests will catch formatting errors.

Questions, writing tasks, Paper 1 texts, exemplars and listening scripts are original and are **not** taken from IB past papers. Assessment criteria are paraphrased, not quoted. Literary examples are from public-domain authors or written for the app. This project is not affiliated with or endorsed by the International Baccalaureate Organization.
