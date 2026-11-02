import type { ExemplarSource } from './types';

/** English B HL Paper 1 exemplars (written for this app). Marks are an estimate (A 12, B 12, C 6). */
export const englishExemplars: ExemplarSource[] = [
  {
    prompt: 'Students at your school are allowed to use AI tools for homework.',
    title: 'Exemplar: speech against unrestricted AI homework',
    text: String.raw`Good morning, Ms Ortega, teachers and fellow students.

My name is Daniel, and I am here today as your student representative to talk about something that affects every one of us: the decision to allow artificial intelligence tools for homework. Let me be clear from the start. I am not against technology. I am against a policy that, in its current form, risks turning learning into copying.

Think about the last time you used an AI tool. You typed a question, waited three seconds, and received a perfectly organised answer. It felt efficient, didn't it? But ask yourself honestly: did you learn anything? Homework exists for one reason. It is the moment when we struggle, make mistakes and slowly understand. If a machine does the struggling for us, we may hand in better work, but we will walk into our final exams with emptier heads.

Some of you will say, "But AI is the future. We need to learn how to use it." You are absolutely right, and that is precisely my point. Using a tool well is a skill, and skills have to be taught. At the moment, our school allows AI without any guidance. Nobody has explained how to check whether an answer is accurate, how to acknowledge it, or when it is simply inappropriate. Giving students a powerful tool without rules is like handing someone car keys before they have had a single driving lesson.

Of course, I am not claiming that AI has no value. Used well, it can explain a difficult concept in a different way, suggest sources we had not considered, or help a student with dyslexia organise their ideas. These are real benefits, and they are exactly why we need a policy that encourages responsible use instead of pretending the problem does not exist.

There is also the question of fairness. Not every student has the same access to the most advanced AI programs. Some are free; others cost money every month. A policy that rewards whoever can afford the best software is not a policy that treats us equally.

Finally, consider what happens to trust. When teachers cannot tell whether a piece of work was written by a student or by a program, they begin to doubt everyone, including those who have worked honestly. Nobody wants a classroom built on suspicion.

So what am I proposing? Not a ban, but clear rules. First, AI should be allowed for research and brainstorming, but not for writing final answers. Second, every student should declare when and how they have used it. Third, our school should run workshops, perhaps during tutor time, so that we learn to use these tools critically and responsibly.

Fellow students, we are the first generation to grow up with this technology. We can let it think for us, or we can learn to think with it. I know which future I would choose.

Thank you for listening.`,
    scores: { A: 10, B: 11, C: 6 },
    notes: {
      A: 'Wide and accurate range (conditionals, rhetorical questions, idioms, complex sentences); natural spoken register. A few more advanced structures (inversion, cleft sentences) would push it to 11–12.',
      B: 'Clear position, three developed arguments, a refuted counter-argument and a concrete proposal; logically organised with signposting (First, Finally, So what am I proposing?).',
      C: 'Fully appropriate speech conventions: greeting, self-introduction, direct address, rhetorical devices, call to action and thanks.',
    },
    overall: '27/30 estimated. Note how each paragraph does one job and how the counter-argument ("Some of you will say…") is turned into support for the speaker\'s position.',
  },
  {
    prompt: 'You have just returned from a volunteering trip abroad that changed your view of the world.',
    title: 'Exemplar: blog post about volunteering abroad',
    text: String.raw`**What Three Weeks in Peru Taught Me About "Helping"**
*Posted by Lucía M. · 14 August*

Hi everyone! If you follow this blog, you know I've been quiet lately. That's because I've just spent three weeks volunteering at a small community library in a village near Cusco, Peru, and honestly, I'm still processing everything.

**Expectation vs. reality**

Before I left, I imagined myself as some kind of hero. I packed books, colouring pencils and a speech in my head about the importance of reading. What I didn't expect was that, on my first day, a ten-year-old girl called Rosa would correct my Spanish, laugh at my pronunciation of "Quechua" and then teach me three words of her grandmother's language. So who exactly was helping whom?

That moment changed the whole trip for me. I realised that I hadn't come to "save" anyone. The library already existed, run by two incredibly dedicated teachers who had been organising reading clubs for years with almost no money. My job wasn't to bring knowledge; it was to listen, carry boxes, and do whatever was actually useful.

**The small things**

Some of my best memories aren't the "big" moments at all. It's the afternoon we spent repairing old picture books with tape and glue because new ones were too expensive. It's the football match where I scored an own goal and the whole village cheered anyway. It's the night the electricity went off and we told stories by candlelight, translating for each other in a mixture of Spanish, English and laughter.

**Culture shock (the real kind)**

I'd be lying if I said everything was easy. The altitude made me dizzy for days, I missed my family, and I struggled with how slowly things moved. But culture shock also worked in reverse: when I got home, I felt uncomfortable seeing how much we throw away, from food to perfectly good books.

**Rethinking "helping"**

Looking back, the most valuable thing I did was not teaching anyone to read. It was realising how much my idea of "helping" was shaped by stereotypes. Before the trip, I had pictured the village as poor and passive, waiting for someone like me to arrive. In reality, it was a community with its own plans, skills and pride. The teachers didn't need a foreign volunteer to tell them what to do; they needed an extra pair of hands and, maybe, someone to share their work with the world. That's partly why I'm writing this post.

**What I'd tell you before you volunteer**

If you're thinking about volunteering abroad, here's my advice:
- Choose a project run by local people, not one that just wants your money.
- Learn some of the language before you go; it's a sign of respect.
- Go to learn, not to teach.

I came back with fewer books in my suitcase and many more questions in my head. Maybe that's the point.

Have you ever volunteered abroad, or are you thinking about it? Tell me in the comments. I'd love to hear your stories!`,
    scores: { A: 10, B: 10, C: 6 },
    notes: {
      A: 'Fluent, idiomatic and accurate; good range of tenses and informal features (contractions, questions). Vocabulary could be more varied in places ("incredibly", "honestly").',
      B: 'Relevant, personal and reflective; organised with subheadings; the anecdote about Rosa is a strong turning point. Some sections could develop the reflection further.',
      C: 'Excellent blog conventions: title, author and date line, direct address, subheadings, bullet-point advice, and an invitation to comment.',
    },
    overall: '26/30 estimated. Notice how the writer moves from anecdote to reflection: "So who exactly was helping whom?"',
  },
];
