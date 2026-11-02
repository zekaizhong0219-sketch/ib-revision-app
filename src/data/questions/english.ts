import { parseQuestions } from '../dsl';

export const ENGLISH_QUESTIONS_VERSION = 1;

/** Original practice questions for English B HL (no IB past-paper text). */
const source = String.raw`
@mc TT
Q: A letter begins "Dear Sir or Madam". How should it end?
O: Yours sincerely
O*: Yours faithfully
O: Best wishes
O: Cheers
S: When the recipient's name is unknown, use "Yours faithfully"; with a named recipient ("Dear Ms Lee"), use "Yours sincerely".

@mc TT
Q: Which feature is most typical of a news report?
O: A personal anecdote in the first paragraph
O*: A lead paragraph answering who, what, where, when and why
O: A recommendation and star rating
O: Numbered instructions in the imperative
S: News reports follow the inverted pyramid: the key facts come first.

@mc TT
Q: You must persuade the school board to fund a community garden, including a timeline and budget. The best text type is
O: a diary entry.
O: a blog post.
O*: a proposal.
O: a review.
S: A proposal presents a plan with steps, resources and costs and asks for approval.

@mc TT
Q: Which is NOT a convention of a formal report?
O: Headings for each section
O: Recommendations at the end
O*: Rhetorical questions addressed to "you, dear reader"
O: Impersonal, often passive, language
S: Reports are impersonal; direct emotional address belongs to speeches, blogs or opinion pieces.

@match TT
Q: Match each text type to a typical opening.
P: Speech => Good morning, everyone, and thank you for coming.
P: Diary entry => Monday, 3 March — What a day!
P: Formal email => Subject: Request for information about the summer course
P: Film review => Five stars do not do justice to this quiet masterpiece.
P: Instructions => Before you begin, make sure you have the following items:
S: Each opening signals the conventions of its text type.

@match TT
Q: Match each text type to its main purpose.
P: Editorial => to persuade readers to accept a viewpoint
P: News report => to inform objectively about a recent event
P: Set of guidelines => to tell readers how to do something
P: Diary entry => to reflect privately on experiences and feelings
S: Purpose determines register, structure and language.

@text TT
Q: In a news report, the structure that places the most important information first is called the inverted ___. (one word)
A: pyramid
S: The inverted pyramid lets readers stop at any point and still have the key facts.

@open TT
Q: List four conventions you would include in a speech to your classmates about reducing plastic use.
A: Any four of: greeting the audience ("Good morning, fellow students"); introducing yourself and the topic; direct address and inclusive "we"; rhetorical questions; repetition / rule of three; signposting ("Firstly…", "Finally…"); a call to action; thanking the audience at the end.

@mc REG
Q: Which sentence is in the most formal register?
O: We wanna find out what went wrong.
O: Let's look into what happened.
O*: The committee intends to investigate the causes of the incident.
O: We're gonna check it out ASAP.
S: Formal register avoids contractions and phrasal verbs, using precise single-word verbs ("investigate").

@match REG
Q: Match each informal phrasal verb to its formal equivalent.
P: put off => postpone
P: find out => discover
P: carry on => continue
P: set up => establish
P: get rid of => eliminate
S: Formal writing often replaces phrasal verbs with single Latin-based verbs.

@text REG
Q: Give a more formal single-word synonym for "go up" (as in "prices went up").
A: increase | rise | rose | increased | escalate | soar
S: "Prices increased / rose significantly."

@mc REG
Q: Which phrase is an example of hedging?
O: This is definitely the only solution.
O*: This may, to some extent, help reduce emissions.
O: Everyone knows that this is true.
O: This will solve the problem completely.
S: Hedging ("may", "to some extent", "arguably") makes a claim more cautious.

@mc REG
Q: "Are we really going to sit back and let our planet burn?" This is an example of
O: hedging.
O: passive voice.
O*: a rhetorical question.
O: an anecdote.
S: A rhetorical question is asked for effect, not to obtain an answer.

@mc LG
Q: Choose the correct sentence.
O: Despite it was raining, the match continued.
O: Despite of the rain, the match continued.
O*: Despite the rain, the match continued.
O: Although the rain, the match continued.
S: "Despite" is followed by a noun or -ing form; "although" by a clause.

@mc LG
Q: Complete: "If the government ___ earlier, fewer people would have lost their homes."
O: acted
O: would act
O*: had acted
O: has acted
S: Third conditional: if + past perfect, would have + past participle.

@mc LG
Q: Complete: "Not only ___ the policy expensive, but it is also ineffective."
O: the policy is
O*: is
O: it is
O: does
S: Inversion after "not only": auxiliary before subject — "Not only is the policy expensive…".

@mc LG
Q: Which sentence uses the passive voice?
O: Scientists analysed the samples.
O*: The samples were analysed in a laboratory.
O: The samples have changed colour.
O: Analysing samples takes time.
S: Passive = be + past participle; the agent may be omitted.

@mc LG
Q: Which is correct?
O: My brother, that lives in London, is a nurse.
O*: My brother, who lives in London, is a nurse.
O: My brother who, lives in London is a nurse.
O: My brother, which lives in London, is a nurse.
S: Non-defining relative clauses use commas and never "that"; "who" for people.

@text LG
Q: Report this sentence: She said, "I will call you tomorrow." → She said that she ___ call me the next day. (one word)
A: would
S: Backshift: will → would; tomorrow → the next day.

@mc LG
Q: "The new law will ___ the problem rather than solve it." Which verb fits best?
O: alleviate
O*: exacerbate
O: foster
O: advocate
S: "Exacerbate" means to make worse, contrasting with "solve".

@mc LG
Q: Choose the correct word: "There are ___ cars on the road at night."
O: less
O*: fewer
O: little
O: lesser
S: "Fewer" with countable plural nouns.

@mc LG
Q: Which linking word expresses a consequence?
O: whereas
O: nevertheless
O*: consequently
O: in addition
S: "Consequently" introduces a result; "whereas" and "nevertheless" contrast; "in addition" adds.

@match LG
Q: Match each idiom to its meaning.
P: a double-edged sword => something with both advantages and disadvantages
P: the tip of the iceberg => a small visible part of a larger problem
P: to turn a blind eye => to deliberately ignore wrongdoing
P: a wake-up call => an event that makes people realise a problem
S: Use idioms sparingly and accurately; they show range under criterion A.

@text LG
Q: Complete with one word: "Social media can be detrimental ___ teenagers' mental health."
A: to
S: The adjective "detrimental" takes "to".

@mc LG
Q: "I wish I ___ more attention in class last year."
O: paid
O*: had paid
O: would pay
O: have paid
S: Regret about the past: wish + past perfect.

@mc LG
Q: "She must have left already." This expresses
O: an obligation in the past.
O*: a logical deduction about the past.
O: a possibility in the future.
O: advice.
S: must have + past participle = near certainty about a past event.

@order TT
Q: Put these parts of a formal letter of complaint in a logical order.
I: Sender's address and date
I: Dear Sir or Madam,
I: I am writing to complain about the service I received on 12 May.
I: Details of the problem and its consequences
I: I would be grateful if you could refund the full amount.
I: Yours faithfully,
S: Layout → greeting → purpose → details → request → closing.

@order REG
Q: Put these stages of a persuasive speech in a logical order.
I: Greet the audience and introduce yourself
I: Present the issue with a striking fact
I: Develop arguments with evidence
I: Refute a common objection
I: Call to action
I: Thank the audience
S: A clear structure helps listeners follow the argument.

@mc RD
Q: Text: "Although the festival attracts thousands of visitors, local residents complain that the noise continues well past midnight." Which statement is TRUE?
O: Residents organise the festival.
O*: Some residents are unhappy with the noise.
O: The festival ends before midnight.
O: Few people attend the festival.
S: "Residents complain that the noise continues well past midnight."

@text RD
Q: Text: "The scheme, launched in 2019, has already planted over two million trees." Which word in the text means "started"?
A: launched
S: "Launched" = started / introduced; same part of speech (past participle) as "started".

@mc RD
Q: Text: "Critics dismissed the app as a gimmick, yet within months it had become indispensable to millions." The writer suggests the critics were
O: correct.
O*: mistaken.
O: indifferent.
O: the app's developers.
S: "Yet" introduces a contrast: the app became "indispensable", proving the critics wrong.

@text RD
Q: Text: "Maria handed the letter to her grandmother, who read it twice before she smiled." Who does "she" refer to? (two words)
A: her grandmother | the grandmother | grandmother
S: Reference words usually point back to the nearest noun that fits.

@mc RD
Q: Which of these is an opinion rather than a fact?
O: The bridge was completed in 1998.
O: The bridge is 1.2 km long.
O*: The bridge is the most beautiful landmark in the city.
O: Around 40,000 vehicles cross the bridge daily.
S: Evaluative words ("most beautiful") signal opinion.

@mc ID
Q: Which word describes someone who has adopted the culture of a new country and lost much of their original culture?
O: segregated
O*: assimilated
O: marginalised
O: stereotyped
S: Assimilation implies absorbing the dominant culture; integration suggests keeping both.

@mc ID
Q: "Code-switching" refers to
O: changing passwords regularly.
O*: alternating between languages or varieties within a conversation.
O: translating a text word for word.
O: speaking with a foreign accent.
S: Common among bilingual and multilingual speakers.

@mc EX
Q: An asylum seeker is someone who
O: has been officially recognised as a refugee.
O*: has applied for international protection and is awaiting a decision.
O: moves abroad for a better job.
O: travels for tourism.
S: A refugee has already been granted protection status (or recognised as fleeing persecution).

@text EX
Q: What three-word phrase means a ceremony marking an important life transition (e.g. graduation)?
A: rite of passage | rites of passage
S: A rite of passage marks the move from one stage of life to another.

@mc HI
Q: What is the difference between misinformation and disinformation?
O: There is no difference.
O*: Disinformation is spread deliberately to deceive; misinformation is not necessarily intentional.
O: Misinformation is only found in newspapers.
O: Disinformation is always true.
S: Intent is the key difference.

@mc HI
Q: An online space where people only see opinions that confirm their own is called
O: a digital divide.
O*: an echo chamber.
O: a firewall.
O: a viral post.
S: Echo chambers are reinforced by recommendation algorithms.

@match SO
Q: Match each term to its definition.
P: gig economy => short-term, freelance or app-based work
P: grassroots => organised by ordinary people, not institutions
P: equity => giving people what they need to reach fair outcomes
P: rehabilitation => helping offenders return to normal life
S: Precise vocabulary strengthens criterion A and your message.

@mc SP
Q: Which energy source is renewable?
O: Coal
O: Natural gas
O*: Wind
O: Oil
S: Renewable sources are naturally replenished.

@text SP
Q: What two-word term means the total greenhouse gases produced by a person or product?
A: carbon footprint
S: e.g. "Flying significantly increases your carbon footprint."

@mc SP
Q: The Universal Declaration of Human Rights was adopted by the UN General Assembly in
O: 1919
O: 1945
O*: 1948
O: 1989
S: Adopted on 10 December 1948 — now marked as Human Rights Day.

@mc IO
Q: In the HL individual oral, the stimulus is
O: a photograph linked to a theme.
O*: an extract from one of the literary works studied.
O: a newspaper article chosen by the student.
O: a recording of a podcast.
S: HL orals are based on a literary extract (SL orals use a visual stimulus).

@open IO
Q: Prepare a 30-second opening for your oral presentation of a literary extract. What should it include?
A: Title and author; where the extract occurs in the work; a one-sentence summary of what happens; the main idea or theme you will analyse; a link to one of the course themes.
`;

export const englishQuestions = parseQuestions('english', source);
