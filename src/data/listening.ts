import { parseStructured } from './dsl';
import type { StructuredQuestion } from '../types';
import { VOA_STORIES } from './voa.generated';

/**
 * English B listening practice. Original scripts written for this app, read aloud by the
 * browser's speech synthesis. Each script has Paper 2-style questions (short answers,
 * gap-fills, true/false with justification). Script lines start with a speaker letter.
 */

export interface ScriptLine {
  speaker: string;
  text: string;
}

export interface ListeningItem {
  id: string;
  title: string;
  /** Text type, e.g. radio interview, podcast. */
  kind: string;
  theme: string;
  /** Speaker letter → label shown in the transcript. */
  speakers: Record<string, string>;
  script: ScriptLine[];
  question: StructuredQuestion;
  /** A real recording (VOA Learning English) instead of speech synthesis. */
  audio?: { url: string; source: string; credit: string; date: string };
}

interface Raw {
  title: string;
  kind: string;
  theme: string;
  speakers: Record<string, string>;
  script: string;
  questions: string;
}

function parseScript(raw: string): ScriptLine[] {
  return raw
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^([A-Z]):\s*(.+)$/);
      if (!m) throw new Error(`Bad script line: ${l}`);
      return { speaker: m[1], text: m[2] };
    });
}

const RAW: Raw[] = [
  {
    title: 'Plastic in the Deep',
    kind: 'Radio interview',
    theme: 'SP',
    speakers: { A: 'Presenter', B: 'Dr Amira Hassan, marine biologist' },
    script: String.raw`
A: Good evening and welcome to Planet Matters. Tonight I'm joined by marine biologist Dr Amira Hassan, who has just returned from a research trip in the South Pacific. Dr Hassan, welcome.
B: Thank you. It's a pleasure to be here.
A: Your team was studying plastic pollution. What exactly were you looking for?
B: Most people imagine floating bottles and bags, but we were interested in what happens below the surface. We collected samples at depths of up to two thousand metres, and in almost every sample we found microplastics, tiny fragments smaller than five millimetres.
A: Even at two thousand metres? That's surprising.
B: It surprised us too. The fragments sink slowly, often attached to marine snow, which is the dead organic material that drifts down from the surface. Small animals eat it, and the plastic enters the food chain.
A: Does that affect the fish we eat?
B: It can. We don't yet know the full effect on human health, and I want to be careful not to exaggerate. But we do know that some fish species are eating less real food because their stomachs are partly full of plastic.
A: So what can ordinary listeners do?
B: The single most useful step is to reduce single-use plastic. Recycling helps, but only about nine per cent of all plastic ever made has been recycled. Supporting stronger laws on packaging matters even more than individual choices.
A: Dr Hassan, thank you very much.
`,
    questions: String.raw`
@struct SP
Q: Listen to the interview and answer the questions.
a) [1] How deep did the team collect samples? (give the number of metres)
= 2000 abs=0 unit=metres
M: up to 2000 metres (1)
b) [1] What size are microplastics, according to Dr Hassan? Complete: smaller than ___ millimetres.
= 5 abs=0 unit=mm
M: five millimetres (1)
c) [1] What does "marine snow" consist of?
~ dead organic material | dead organic matter | organic material | dead material
M: dead organic material that drifts down from the surface (1)
d) [1] True or false: Dr Hassan says microplastics definitely damage human health. Justify your answer.
M: False — "We don't yet know the full effect on human health" (both needed) (1)
e) [1] Why are some fish eating less real food?
M: their stomachs are partly full of plastic (1)
f) [1] What percentage of all plastic ever made has been recycled?
= 9 abs=0 unit=%
M: about nine per cent (1)
g) [1] According to Dr Hassan, what matters even more than individual choices?
~ stronger laws on packaging | laws on packaging | stronger laws | packaging laws | supporting stronger laws on packaging
M: supporting stronger laws on packaging (1)
`,
  },
  {
    title: 'The Gap Year Question',
    kind: 'Podcast conversation',
    theme: 'EX',
    speakers: { A: 'Josh', B: 'Priya' },
    script: String.raw`
A: Welcome back to Next Steps, the podcast for students who don't have it all figured out. I'm Josh.
B: And I'm Priya. Today we're talking about gap years, because, Josh, you took one, didn't you?
A: I did. After my exams I spent nine months working in a café in Lisbon and then travelling around Morocco.
B: Your parents must have been nervous.
A: My mum was terrified at first. She thought I'd never go to university. But I'd already accepted my place and deferred it for a year, so she calmed down.
B: What was the hardest part?
A: Honestly, money. Lisbon isn't cheap any more, and the café paid the minimum wage. I shared a tiny flat with four other people. But that's where I learned Portuguese, and I learned to cook properly for the first time.
B: I didn't take a gap year, and I sometimes regret it. I went straight into a medical degree, and by the second year I was exhausted.
A: Do you think everyone should take one?
B: No, not everyone. If you're going to spend the year scrolling on your phone at home, it's pointless. You need a plan, even a flexible one.
A: Agreed. My advice is: work for part of it, so you appreciate money, and do something that scares you a little.
B: That's a good rule for life, not just gap years.
`,
    questions: String.raw`
@struct EX
Q: Listen to the podcast and answer the questions.
a) [1] How many months did Josh work in Lisbon?
= 9 abs=0 unit=months
M: nine months (1)
b) [1] Which country did Josh travel around afterwards?
~ Morocco
M: Morocco (1)
c) [1] Why did Josh's mother calm down?
M: he had already accepted his university place and deferred it for a year (1)
d) [1] What was the hardest part of Josh's gap year?
~ money | the money | money problems
M: money (1)
e) [2] Name two things Josh learned in Lisbon.
M: Portuguese (1) ¶ to cook properly (1)
f) [1] True or false: Priya thinks every student should take a gap year. Justify your answer.
M: False — "No, not everyone" (both needed) (1)
g) [1] According to Priya, what does a gap year need?
~ a plan | a flexible plan | plan
M: a plan (even a flexible one) (1)
`,
  },
  {
    title: 'Robots on the Field',
    kind: 'School radio news report',
    theme: 'HI',
    speakers: { A: 'Reporter' },
    script: String.raw`
A: This is Westbridge School Radio with the morning news. Last weekend, our robotics team travelled to Manchester for the national schools' robotics competition, and they came home with second place out of thirty-two teams.
A: The challenge this year was to design a robot that could sort recyclable waste into three categories: paper, plastic and metal. Each robot had four minutes to sort as many items as possible.
A: Our team's robot, nicknamed Bin-E, uses a camera and a simple artificial intelligence program to recognise each item. Team captain Leo Martins explained that the hardest part was teaching the robot to tell the difference between shiny plastic and aluminium cans.
A: The team only lost first place by three points to a school from Glasgow. The judges praised Westbridge for the robot's low cost, as it was built mainly from recycled parts for less than two hundred pounds.
A: The team is now looking for new members, especially students interested in programming. Meetings take place every Thursday after school in the science block, room twelve. No experience is necessary.
A: That's all from the morning news. Have a great day.
`,
    questions: String.raw`
@struct HI
Q: Listen to the news report and answer the questions.
a) [1] In which city did the competition take place?
~ Manchester
M: Manchester (1)
b) [1] How many teams took part?
= 32 abs=0
M: thirty-two (1)
c) [1] Name the three categories of waste.
M: paper, plastic and metal (all three needed) (1)
d) [1] How long did each robot have?
= 4 abs=0 unit=minutes
M: four minutes (1)
e) [1] What was the hardest part for the team?
M: teaching the robot to tell the difference between shiny plastic and aluminium cans (1)
f) [1] By how many points did the team miss first place?
= 3 abs=0 unit=points
M: three points (1)
g) [1] What did the judges praise?
~ low cost | the low cost | the robots low cost | its low cost | the robot's low cost
M: the robot's low cost (built mainly from recycled parts for under £200) (1)
h) [1] On which day do team meetings take place?
~ Thursday | Thursdays | every Thursday
M: Thursday (1)
`,
  },
  {
    title: 'Living Between Languages',
    kind: 'Talk',
    theme: 'ID',
    speakers: { A: 'Speaker' },
    script: String.raw`
A: When I was seven, my family moved from Seoul to Toronto. On my first day at school, I knew exactly three English words: hello, thank you and toilet. I used the last one quite a lot, mostly to escape.
A: For years I felt that I had two separate selves. At home I was Ji-woo, polite and quiet, speaking Korean with my grandmother. At school I was Jenny, loud and funny, speaking English with my friends. I thought I had to choose one.
A: Things changed when I was fifteen. My grandmother became ill, and I spent every afternoon at the hospital translating between her and the doctors. Suddenly, my two languages were not a problem. They were a bridge. Without me, nobody in that room could understand each other.
A: Researchers sometimes describe people like me as heritage speakers. We may understand a language perfectly but find it hard to write it. That was certainly true for me. So at sixteen, I started Saturday classes to learn to write Korean properly.
A: Today I don't see myself as half Korean and half Canadian. I see myself as both, completely. If you live between languages, my message to you is simple: you don't have to choose.
`,
    questions: String.raw`
@struct ID
Q: Listen to the talk and answer the questions.
a) [1] How old was the speaker when the family moved to Toronto?
= 7 abs=0 unit=years
M: seven (1)
b) [1] How many English words did she know on her first day?
= 3 abs=0
M: three (1)
c) [2] Contrast the speaker's "two separate selves" at home and at school.
M: at home: Ji-woo, polite and quiet, speaking Korean (1) ¶ at school: Jenny, loud and funny, speaking English (1)
d) [1] What happened when she was fifteen?
M: her grandmother became ill and she translated between her and the doctors at the hospital (1)
e) [1] Which word does she use to describe her two languages at the hospital?
~ bridge | a bridge
M: a bridge (1)
f) [1] What do heritage speakers often find difficult, according to the talk?
~ writing | to write | writing the language | write it
M: writing the language (1)
g) [1] What is the speaker's final message?
~ you don't have to choose | you do not have to choose | dont have to choose
M: you don't have to choose (1)
`,
  },
];

export const LISTENING: ListeningItem[] = RAW.map((r) => {
  const [question] = parseStructured('english', r.questions);
  return {
    id: question.id.replace('-s-', '-l-'),
    title: r.title,
    kind: r.kind,
    theme: r.theme,
    speakers: r.speakers,
    script: parseScript(r.script),
    question: { ...question, prompt: `**${r.title}** (${r.kind}). ${question.prompt}` },
  };
});

/**
 * Authentic recordings: Voice of America Learning English stories (public domain), with the
 * verbatim transcript generated by scripts/voa_resources.py and questions written for the app.
 */
const VOA_ITEMS: { key: string; theme: string; kind: string; questions: string }[] = [
  {
    key: 'wright',
    theme: 'HI',
    kind: 'Radio feature (VOA)',
    questions: String.raw`
@struct HI
Q: Listen to the recording about the Wright brothers and answer the questions.
a) [1] In what year was Wilbur Wright born?
= 1867 abs=0
M: 1867 (1)
b) [1] Name ONE thing whose earlier experiments gave the brothers ideas for their flying machine.
~ toy helicopter | a toy helicopter | kites | kite | the printing machine | printing machine | bicycles | bicycle
M: a toy helicopter / kites / the printing machine / bicycles (any one) (1)
c) [1] Why did they test their ideas at Kill Devil Hill?
~ best wind conditions | the best wind conditions | wind conditions | good wind conditions | the wind
M: it had the best wind conditions (1)
d) [1] How far, in metres, did Orville fly on 17 December 1903?
= 36 abs=0 unit=m
M: 36 metres (1)
e) [1] For how many seconds was he in the air?
= 12 abs=0 unit=s
M: 12 seconds (1)
f) [1] True or false: many newspapers reported the first flight. Justify your answer.
M: False: "Few newspapers, however, noted the event." (both needed) (1)
g) [1] In 1908, a company from which country agreed to make their machine?
~ France | French | a French company
M: France (1)
h) [1] What did Wilbur Wright die of?
~ typhoid fever | typhoid
M: typhoid fever (1)
`,
  },
  {
    key: 'yellowstone',
    theme: 'SP',
    kind: 'Radio feature (VOA)',
    questions: String.raw`
@struct SP
Q: Listen to the recording about Yellowstone National Park and answer the questions.
a) [1] In what year was the park established?
= 1872 abs=0
M: 1872 (1)
b) [1] In which state does most of the park lie?
~ Wyoming
M: Wyoming (1)
c) [1] What lies underneath the park?
~ a super volcano | super volcano | an ancient super volcano | supervolcano | a volcano | volcano | the Yellowstone Caldera | Yellowstone Caldera
M: an ancient super volcano (the Yellowstone Caldera) (1)
d) [1] The park has more than how many geysers?
= 300 abs=0
M: 300 (1)
e) [1] About how often, in minutes, does Old Faithful erupt?
= 90 abs=0 unit=min
M: about every 90 minutes (1)
f) [1] True or false: the areas burned by the 1988 fires are still bare. Justify your answer.
M: False: "Most of those areas are now covered with plants and young trees." (1)
g) [1] What was the estimated bison population in 2024?
= 4500 abs=0
M: about 4,500 (1)
h) [1] Which phrase does the speaker use to sum up Yellowstone at the end? Complete: "There is still a ___ in America".
~ wild west | a wild west
M: wild west (1)
`,
  },
  {
    key: 'buck',
    theme: 'ID',
    kind: 'Radio biography (VOA)',
    questions: String.raw`
@struct ID
Q: Listen to the recording about Pearl S. Buck and answer the questions.
a) [1] What was the title of the top-selling book in the United States in 1931?
~ The Good Earth | Good Earth
M: The Good Earth (1)
b) [1] In what year did Buck win the Nobel Prize in Literature?
= 1938 abs=0
M: 1938 (1)
c) [1] For about how many years was China her home?
= 40 abs=0
M: nearly 40 years (1)
d) [1] What subject did she study at college in Virginia?
~ philosophy
M: philosophy (1)
e) [1] Apart from a Chinese teacher, who taught Pearl at home?
~ her mother | mother | Caroline | Caroline Sydenstricker
M: her mother (1)
f) [1] What provided the subject matter for many of her books?
M: their life among the poorest people (in a village in northern China) (1)
g) [1] True or false: when Buck wrote her first books, most people knew a lot about Chinese life. Justify your answer.
M: False: most people "knew almost nothing about the Chinese way of life" (1)
h) [2] Identify TWO things Buck told young people in her speeches.
M: the importance of a good education (1) ¶ they needed to know more about other people around the world (1)
`,
  },
  {
    key: 'marykay',
    theme: 'SO',
    kind: 'Radio biography (VOA)',
    questions: String.raw`
@struct SO
Q: Listen to the recording about Mary Kay Ash and answer the questions.
a) [1] How much money did she invest to start the business (in dollars)?
= 5000 abs=0 unit=$
M: $5,000 (1)
b) [1] How old was she when she married Ben Rogers?
= 17 abs=0
M: 17 (1)
c) [1] How much did she pay for the legal rights to the skin care products (in dollars)?
= 500 abs=0 unit=$
M: $500 (1)
d) [1] In which city did the company begin operating in 1963?
~ Dallas | Dallas, Texas | Dallas Texas
M: Dallas (1)
e) [2] Explain why experienced sales representatives were willing to train new ones.
M: they received part of the new person's earnings (1) ¶ so training recruits increased their own income (1)
f) [1] According to the recording, what was the idea behind the sales competition? Complete: it is best to compete against ___.
~ yourself | against yourself | oneself
M: yourself (1)
g) [1] What does the Mary Kay Ash Charitable Foundation provide money for?
M: research on cancers affecting women (also, from 2001, preventing violence against women) (1)
h) [1] According to sales representatives, what did Mary Kay make possible for women?
M: earning money while still spending time with their families (1)
`,
  },
];

const VOA_LISTENING: ListeningItem[] = VOA_ITEMS.map((v) => {
  const story = VOA_STORIES[v.key];
  if (!story || !story.audio) throw new Error(`Missing VOA story or audio: ${v.key}`);
  const [question] = parseStructured('english', v.questions);
  return {
    id: question.id.replace('-s-', '-l-'),
    title: story.title,
    kind: v.kind,
    theme: v.theme,
    speakers: { V: 'VOA Learning English' },
    script: story.paragraphs.map((text) => ({ speaker: 'V', text })),
    question: { ...question, prompt: `**${story.title}** (${v.kind}). ${question.prompt}` },
    audio: { url: story.audio, source: story.url, credit: story.credit, date: story.date },
  };
});

LISTENING.push(...VOA_LISTENING);

/** Approach to the English B listening paper (strategy guide shown in the trainer). */
export const LISTENING_STRATEGY: { title: string; points: string[] }[] = [
  {
    title: 'Before you listen (reading time)',
    points: [
      'Read every question and underline the key words: who, how many, why, which day.',
      'Predict the type of answer: a number, a name, a place, a reason, a single word for a gap.',
      'Notice the order: answers almost always come in the same order as the questions.',
      'Check the word limit ("no more than three words") and whether a justification is needed.',
    ],
  },
  {
    title: 'First listening',
    points: [
      'Listen for the overall situation: who is speaking, to whom, and why (interview, podcast, report, talk).',
      'Write short notes, not full sentences: abbreviations, numbers as digits, initials for names.',
      "Don't panic if you miss something: you will hear each recording twice in the exam.",
      'Listen for signposts that introduce answers: "the main reason", "what surprised us", "my advice is".',
    ],
  },
  {
    title: 'Second listening',
    points: [
      'Focus on the gaps you left and check the answers you were unsure of.',
      'Watch for distractors: the speaker may mention a number or idea and then correct it ("not nine, but…").',
      'For true/false questions, note the exact words that prove the answer.',
      'Answers are often paraphrased: the question says "nervous", the speaker says "terrified".',
    ],
  },
  {
    title: 'After listening',
    points: [
      'Check spelling and grammar: the answer must fit the gap grammatically.',
      'Do not leave blanks: a reasonable guess can still earn the mark.',
      'Keep answers short and precise; do not add information that contradicts the recording.',
    ],
  },
  {
    title: 'Practise regularly (outside the app)',
    points: [
      'Listen to 10–15 minutes of English every day: news podcasts, interviews, documentaries, TED-style talks on the five themes.',
      'Vary accents: British, American, Australian, Indian and other international English.',
      'Use transcripts afterwards: listen once without, then read along and note words you missed.',
      'Practise past Paper 2 listening tasks from your teacher under timed conditions.',
    ],
  },
];
