import { parseStructured } from '../dsl';

/**
 * Original English B HL Paper 2-style reading texts (written for this app; not IB material).
 * True/false items follow the IB convention: the mark needs both the correct choice and a
 * justification quoting the text.
 */
const source = String.raw`
@struct SP
Q: **Text A: "Wild in the City"** (magazine article) ¶ [1] When the council of a mid-sized river town announced it would stop mowing a third of its parks, the reaction was swift and furious. Residents complained of "messy" verges and imagined swarms of insects invading their kitchens. Three summers later, the same residents are leading guided walks through meadows humming with bees. ¶ [2] The scheme, known locally as "Let It Grow", cost almost nothing. Mowers were parked, a few paths were cut through the long grass, and signs explained what was happening. Within a year, volunteers had counted forty-two species of wild flower where there had previously been six. ¶ [3] Not everyone is convinced. Some older residents still regard the meadows as a sign of neglect, and the council admits that untidy areas near playgrounds remain a source of tension. Its solution has been to keep a neat strip along the edges, which, as one gardener put it, "shows people that the wildness is deliberate". ¶ [4] Ecologists caution that unmown grass alone will not reverse the decline of pollinators. Yet they agree that small, cheap changes, multiplied across thousands of towns, could make a measurable difference.
a) [1] Which word in paragraph 1 means "quick"?
~ swift
M: swift (1)
b) [1] True or false: The scheme was expensive. Justify with words from the text.
M: False — "cost almost nothing" (both the choice and the justification are needed for the mark) (1)
c) [1] How many species of wild flower did volunteers count after a year?
~ 42 | forty-two | forty two
M: forty-two (1)
d) [1] In paragraph 3, what does "Its" refer to?
~ the council | council | the council's
M: the council (1)
e) [2] Why does the council keep a neat strip along the edges of the meadows?
M: to show that the long grass is intentional (1) ¶ to reduce complaints / tension with residents who see it as neglect (1)
f) [2] What is the ecologists' overall view of the scheme?
M: it will not on its own reverse pollinator decline (1) ¶ but many small, cheap changes like it could make a measurable difference (1)

@struct HI
Q: **Text B: "The Repair Café"** (blog post) ¶ [1] I walked into my first repair café clutching a toaster that had stopped toasting. I expected to be told it was cheaper to buy a new one. Instead, a retired electrician called Margit pulled up a chair, handed me a screwdriver and said: "You're going to fix it. I'm just going to watch." ¶ [2] Repair cafés are free meetings where volunteers help people mend broken items, from lamps and laptops to jeans and bicycles. The idea is simple: rather than throwing things away, we learn to give them a second life. ¶ [3] Forty minutes later, my toaster was working again. The fault turned out to be a single loose wire. What struck me, though, was not the repair itself but the atmosphere: strangers chatting, children watching a sewing machine being oiled, someone offering everyone home-made biscuits. ¶ [4] Of course, repair cafés will not solve the problem of electronic waste on their own. Many manufacturers still glue devices shut and refuse to sell spare parts. But every object saved is a small act of resistance against a culture that treats everything as disposable. ¶ [5] Will I go back? Definitely. Next month I'm bringing my grandmother's radio, and this time I'm not expecting anyone to fix it for me.
a) [1] What did the writer expect to be told at the repair café?
M: that it was cheaper to buy a new toaster (1)
b) [1] What was Margit's previous job?
~ electrician | an electrician | retired electrician | a retired electrician
M: electrician (1)
c) [1] True or false: The writer repaired the toaster without any help at all. Justify with words from the text.
M: False — "pulled up a chair, handed me a screwdriver" / "I'm just going to watch" (both needed) (1)
d) [1] Which word in paragraph 2 means "repair"?
~ mend
M: mend (1)
e) [1] According to paragraph 3, what was the cause of the fault?
~ a single loose wire | a loose wire | loose wire
M: a (single) loose wire (1)
f) [2] Identify two practices of manufacturers that make repair difficult.
M: gluing devices shut (1) ¶ refusing to sell spare parts (1)
g) [1] What does the final sentence suggest about the writer's attitude?
M: they now feel confident / independent enough to do the repair themselves (1)

@struct ID
Q: **Text C: "Speaking Grandma's Language"** (opinion column) ¶ [1] Every Sunday, my cousins and I sit around our grandmother's table and nod politely as she speaks to us in a language most of us barely understand. We answer in English. She smiles, but I have started to notice something in that smile that looks a lot like loss. ¶ [2] Linguists call people like us "heritage speakers": we grew up hearing a family language but were educated in another. Many of us can follow a conversation but cannot hold one. By the third generation, the family language has often disappeared entirely. ¶ [3] Some argue this is simply the natural price of integration. Why spend hours on a language you will never need at work? I understand the argument, but I think it misses the point. A language is not only a tool for getting a job; it is a key to stories, jokes, songs and recipes that cannot be fully translated. ¶ [4] Last year I enrolled in evening classes. My grammar is still clumsy, and I mix up my verb endings. But last Sunday, for the first time, I told my grandmother a joke in her own language. She laughed so hard she had to put down her spoon.
a) [1] In paragraph 1, which word shows how the cousins respond when their grandmother speaks?
~ nod | nod politely | politely
M: nod (politely) (1)
b) [2] What is a "heritage speaker", according to the text?
M: someone who grew up hearing a family language (1) ¶ but was educated in a different language (1)
c) [1] By which generation has the family language often disappeared?
~ third | the third | third generation | the third generation
M: the third generation (1)
d) [1] True or false: The writer agrees that losing the family language is a natural price of integration. Justify with words from the text.
M: False — "I think it misses the point" (both needed) (1)
e) [2] Give two things a language provides access to, according to paragraph 3.
M: any two of: stories, jokes, songs, recipes (1 each)
f) [2] How does the final paragraph show that the writer's effort has been worthwhile?
M: they told a joke in the grandmother's language for the first time (1) ¶ she laughed so hard she put down her spoon, i.e. they connected with her (1)

@struct SO
Q: **Text D: "Should School Start Later?"** (news report) ¶ [1] A secondary school that moved its start time from 8:00 to 9:15 has reported fewer late arrivals and higher attendance after a two-year trial, according to figures released this week. ¶ [2] The change followed research suggesting that teenagers' body clocks shift during adolescence, making it harder for them to fall asleep early. "Asking a sixteen-year-old to be alert at eight in the morning is a bit like asking an adult to be alert at six," explained the school's head of science, who led the project. ¶ [3] According to the school, unauthorised absences fell by almost a fifth, and students reported sleeping, on average, forty minutes more per night. Teachers noticed improved concentration in morning lessons. ¶ [4] However, the trial has not been without problems. Parents who start work early say the new timetable makes family routines harder, and the school day now finishes later, leaving less time for after-school jobs and clubs. The local bus company also had to adjust its timetable at short notice. ¶ [5] The regional education authority says it will study the results before deciding whether other schools should follow.
a) [1] What was the new start time at the school?
~ 9:15 | 9.15 | nine fifteen | quarter past nine
M: 9:15 (1)
b) [2] Identify two positive results reported after the trial.
M: any two of: fewer late arrivals; higher attendance / unauthorised absences fell by almost a fifth; students slept 40 minutes more; improved concentration in morning lessons (1 each)
c) [2] Explain the comparison made by the head of science.
M: being alert at 8 a.m. is as hard for a teenager (1) ¶ as being alert at 6 a.m. would be for an adult, because their body clocks are shifted (1)
d) [1] How much more sleep did students report per night?
~ forty minutes | 40 minutes | forty | 40
M: forty minutes (1)
e) [2] Identify two problems caused by the change.
M: any two of: harder family routines for parents who start work early; school finishes later, less time for jobs and clubs; bus company had to change its timetable at short notice (1 each)
f) [1] Who will decide whether other schools adopt the change?
~ the regional education authority | regional education authority | the education authority | education authority
M: the regional education authority (1)
`;

export const englishReading = parseStructured('english', source);
