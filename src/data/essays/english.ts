import { parseEssays } from '../dsl';

/** Original Paper 1 HL writing tasks (not taken from IB papers). 450–600 words, 90 minutes for one task. */
const source = String.raw`
@essay ID rubric=engb-p1 minutes=90 min=450 max=600
Q: Your school magazine is running a series on growing up between cultures. Write an **article** about the challenges and advantages of having more than one cultural identity.
S: Headline + by-line; hook (anecdote or striking fact); 3–4 developed paragraphs (language at home vs school, belonging, opportunities); quotes from classmates; semi-formal register; memorable ending.

@essay ID rubric=engb-p1 minutes=90 min=450 max=600
Q: After reading an advertisement promising "the perfect body in 30 days", write a **letter to the editor** of a national newspaper expressing your concerns about how advertising affects young people's self-image.
S: "Dear Editor"; state the advert and your purpose; arguments (unrealistic ideals, mental health, responsibility of advertisers); evidence; suggestion for regulation; formal register; "Yours faithfully".

@essay EX rubric=engb-p1 minutes=90 min=450 max=600
Q: You have just returned from a volunteering trip abroad that changed your view of the world. Write a **blog post** describing the experience and what you learned.
S: Catchy title; date; personal, reflective voice; vivid description; one or two anecdotes; reflection on culture shock and personal growth; invite readers' comments.

@essay EX rubric=engb-p1 minutes=90 min=450 max=600
Q: Your town council wants to attract more tourists but residents worry about the impact. Write a **proposal** to the council for a sustainable-tourism plan.
S: Title; to/from/date; aim; background (problems of mass tourism); detailed plan with steps, timeline, resources; expected benefits for residents and visitors; formal persuasive conclusion.

@essay HI rubric=engb-p1 minutes=90 min=450 max=600
Q: Students at your school are allowed to use AI tools for homework. Write a **speech** for a school assembly arguing either for or against this policy.
S: Greet audience; state position; 2–3 arguments with examples; refute one objection; rhetorical devices (questions, triads, inclusive "we"); call to action; thank listeners.

@essay HI rubric=engb-p1 minutes=90 min=450 max=600
Q: Write a **review** for a youth website of a film, series or video game that uses technology in an innovative way.
S: Title naming the work; key facts; brief non-spoiler summary; evaluation of innovation, story, performances; strengths and weaknesses with examples; clear recommendation/rating.

@essay SO rubric=engb-p1 minutes=90 min=450 max=600
Q: Many teenagers combine part-time jobs with their studies. Write an **opinion column** for a local newspaper on whether students should work during term time.
S: Headline; clear thesis; balanced consideration with rebuttal; facts and examples; persuasive devices; firm conclusion.

@essay SO rubric=engb-p1 minutes=90 min=450 max=600
Q: As a student representative, write a **report** for the head of school on how students use the library and study spaces, with recommendations for improvement.
S: Title; to/from/date; purpose; methodology (survey of students); findings under headings; impersonal language and passive voice; numbered recommendations.

@essay SP rubric=engb-p1 minutes=90 min=450 max=600
Q: A local environmental group wants young people to reduce food waste. Write a **set of guidelines** for a leaflet aimed at teenagers.
S: Eye-catching title; short introduction on the problem; numbered/bulleted tips with imperatives; reasons for each tip; friendly, direct tone; contact details or call to action.

@essay SP rubric=engb-p1 minutes=90 min=450 max=600
Q: You interviewed a young climate activist from your city. Write the **interview** for your school website.
S: Introduction presenting the activist and context; Q&A format with names; follow-up questions; activist's authentic voice; closing thanks; consistent semi-formal register.
`;

export const englishEssays = parseEssays('english', source);
