# IB Revision

A study app for **IB Diploma Physics HL, Chemistry HL and Mathematics: Analysis & Approaches HL**. It uses spaced repetition, timed practice and tracks your weak topics. It runs entirely in the browser, works offline, and can be installed on a phone as an app (PWA).

**Live app:** https://zekaizhong0219-sketch.github.io/ib-revision-app/ (after Pages is enabled, see [Deploy](#deploy-github-pages))

| | |
|---|---|
| Flashcards | **659**: Physics 279 · Chemistry 219 · Math AA 161 (including IB command terms) |
| Practice questions | **178**, all original: Physics 67 · Chemistry 57 · Math 54 |
| Syllabus | Physics & Chemistry: first assessment 2025. Math AA: first assessment 2021, topics 1–5. AHL content is tagged. |

## Features

### 1. Flashcards with spaced repetition
- **SM-2 scheduler** (`src/lib/srs.ts`). The four grades map to SM-2 quality scores: Again = 2, Hard = 3, Good = 4, Easy = 5. The ease factor (EF) updates by the standard SM-2 formula and never drops below 1.3. A card's first intervals are 1 day, then 6 days, then the previous interval × EF. Hard multiplies the interval by 1.2 and Easy adds a ×1.3 bonus. Intervals are capped at 365 days.
- A failed card ("Again") comes back after 10 minutes and again later in the same session.
- New cards are limited per day (default 20, configurable) and interleaved across subjects.
- **Cram mode** shows up to 30 random cards from chosen topics without changing the schedule. Use it the night before a test.
- All maths renders with **KaTeX**. Chemical equations use `\ce{}` (mhchem).
- **Card library**: search and filter by subject, topic, type and status; suspend cards or reset their progress; **add, edit and delete your own cards** with a live preview.

### 2. Timed practice
- Pick subjects, topics and a duration from 5 to 45 minutes.
- **Multiple choice** questions are marked automatically.
- **Numeric** questions are marked automatically within a tolerance (±2 % by default, or set per question). Accepted formats include `12.5`, `12,5` (decimal comma), `3.2e-5`, `3.2×10^-5`, `3.2·10⁻⁵`, `1/3` and `9.81 m s^-2`.
- **Open** questions are self-marked (Missed / Partly / Got it) against a model answer. You can optionally mix in flashcard recall prompts.
- The results screen gives your score, average time per question, accuracy per topic, and worked solutions for every question you missed.

### 3. Weak-topic tracker / dashboard
- Tiles show cards due now, new cards today, your streak (current and best), activity today and cards studied.
- **What to revise next** ranks topics using four signals: low accuracy, cards never studied, due backlog, and how soon that subject's exam is. It shows the reasons for each pick and links straight to cards or practice for that topic.
- Charts: activity over the last 30 days, review forecast for the next 14 days, and **accuracy by topic** for each subject.
- Accuracy covers the last 90 days. In flashcard reviews Good and Easy count as correct and Hard as half. Practice answers count double, because they test application rather than recall.

### 4. Exam countdown
- Add each paper with a date, time and optional subject. The next exam shows on the dashboard with a live countdown.
- Exams less than 30 days away push their subject up in the recommendations.
- The default entry is a **placeholder**: replace it with your official timetable.

### 5. Look and feel
- Light, dark or system theme. Responsive layout with a bottom tab bar on phones. Installable and works offline.
- **Keyboard shortcuts** (press `?` in the app):

| Key | Action |
|---|---|
| `d` `r` `p` `c` `e` `s` | Dashboard, Review, Practice, Library (cards), Exams, Settings |
| `t` | Cycle theme |
| `Space` / `Enter` | Show answer (then `Enter` = Good) |
| `1` `2` `3` `4` | Again / Hard / Good / Easy, or choose an MC option (`A`–`D` also work) |
| `1` `2` `3` | Self-mark an open question |
| `Esc` | End session |

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

- Kind tags: `[d]` definition, `[f]` formula, `[u]` unit, `[c]` command term, `[k]` concept, `[x]` fact.
- `¶` is a line break. `$…$` is inline maths, `$$…$$` is display maths, `$\ce{…}$` is a chemical equation, `**bold**` is bold.
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

After editing, run `npm test`. The content tests check that IDs are unique, every topic exists in the syllabus, every formula compiles in KaTeX, each subject has at least 150 cards and 40 questions, and every MC question has exactly one correct option.

You can also add cards from inside the app (**Library → + New card**). Those are stored with your progress and included in backups.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` runs lint, tests and the build on every push and pull request, and deploys `dist/` to GitHub Pages on pushes to `main`. Vite's `base` is set to `/ib-revision-app/`.

**One-time setup:** in the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. Then re-run the workflow, or push to `main`.

> **Private repository:** GitHub Pages for private repositories requires a paid plan (GitHub Pro, Team or Enterprise). On a free plan, either make the repository public or run the app locally. Pages sites are publicly accessible even when the repository is private, unless you use Enterprise access control.

## Project structure

```
src/
  data/        syllabus, flashcard decks, question banks, content DSL parser
  lib/         srs (SM-2), answer checking, storage/backup, stats & recommendations, review queue, KaTeX markup
  views/       Dashboard, Review, Practice, Cards (library), Exams, Settings
  components/  MathText, charts, UI primitives, keyboard help
```

## Accuracy and disclaimer

All definitions and formulas were written for this app and checked against standard physics, chemistry and mathematics (IB data-booklet notation and constants where relevant). Every numeric practice answer was independently recomputed. If you find a mistake, fix it in `src/data/`; the tests will catch formatting errors.

Questions are original and are **not** taken from IB past papers. This project is not affiliated with or endorsed by the International Baccalaureate Organization.
