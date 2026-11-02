import { parseEssays } from '../dsl';

/** Original Paper 2 essay questions in IB style (not taken from IB papers). One essay ≈ 45 minutes. */
const source = String.raw`
@essay W11.TH rubric=hist-p2 minutes=45
Q: Compare and contrast the causes of two 20th-century wars, each chosen from a different region.
S: Choose two wars you know in depth (e.g. Spanish Civil War vs Second World War in the Pacific). Organise thematically: ideological, economic, political, territorial causes; long- vs short-term; triggers. Make explicit comparisons in every paragraph.

@essay W11.WW1 rubric=hist-p2 minutes=45
Q: "The alliance system was the main cause of the First World War." To what extent do you agree with this statement?
S: Define the alliance system (Triple Alliance, Entente). Weigh it against militarism, imperialism, nationalism, the July Crisis decisions and German war aims (Fischer). Reach a judgement: did alliances cause the war or turn a local war into a general one?

@essay W11.WW1 rubric=hist-p2 minutes=45
Q: Evaluate the success of the peace settlements that followed the First World War.
S: Criteria for "success" (stability, fairness, enforcement). Versailles terms and German resentment; successor states and minorities; League of Nations; economic consequences (reparations); Locarno-era stabilisation vs 1930s collapse.

@essay W11.WW2 rubric=hist-p2 minutes=45
Q: Examine the importance of technological developments in determining the outcome of the Second World War.
S: Aircraft and tanks (Blitzkrieg), radar, codebreaking, carriers (Midway), atomic bomb. Weigh against industrial capacity, manpower, strategy, leadership, alliances. Conclude on relative importance.

@essay W11.WW2 rubric=hist-p2 minutes=45
Q: Discuss the social and economic effects of the Second World War on two countries.
S: Pick two contrasting countries (e.g. Britain and Japan, or the USSR and Germany). Deaths and displacement, destruction, role of women, welfare state, occupation and reform, economic recovery. Compare explicitly.

@essay W11.SCW rubric=hist-p2 minutes=45
Q: To what extent was foreign intervention the main reason for the Nationalist victory in the Spanish Civil War?
S: Assess German/Italian aid vs Soviet aid and non-intervention; weigh against Franco's unified command, the Army of Africa, Republican divisions (May Days 1937), economic resources. Judgement.

@essay W11.SCW rubric=hist-p2 minutes=45
Q: Discuss the role of ideology in causing one civil war.
S: Spanish Civil War: left vs right polarisation, anarchism, communism, fascism (Falange), Catholicism. Weigh against land, regionalism, army and economic factors. Use precise events (1934 Asturias, Feb 1936 election).

@essay W12.RMA rubric=hist-p2 minutes=45
Q: "The USSR was more to blame than the USA for the origins of the Cold War." Discuss.
S: Orthodox, revisionist and post-revisionist views; Soviet actions in Eastern Europe, Berlin Blockade; US atomic diplomacy, Truman Doctrine, Marshall Plan. Evaluate historians. Clear judgement.

@essay W12.LN rubric=hist-p2 minutes=45
Q: Compare and contrast the impact of two leaders, each from a different region, on the course of the Cold War.
S: E.g. Khrushchev (Europe) and Mao (Asia), or Kennedy (Americas) and Gorbachev. Compare aims, key decisions, crises managed or provoked, legacy. Thematic structure.

@essay W12.CR rubric=hist-p2 minutes=45
Q: Examine the reasons for, and the consequences of, one Cold War crisis.
S: E.g. Cuban Missile Crisis: Bay of Pigs, missile gap, Soviet motives (Turkey missiles, defence of Cuba); consequences — hotline, test ban, détente, Khrushchev's fall, Soviet arms build-up.

@essay W12.CR rubric=hist-p2 minutes=45
Q: Compare and contrast the Soviet responses to the Hungarian Uprising (1956) and the Prague Spring (1968).
S: Causes and aims of each movement (Nagy wanted to leave the Warsaw Pact; Dubček stayed in it); Soviet/Warsaw Pact intervention; Western reactions; Brezhnev Doctrine; outcomes.

@essay W12.END rubric=hist-p2 minutes=45
Q: To what extent was Gorbachev responsible for the end of the Cold War?
S: Glasnost, perestroika, abandoning the Brezhnev Doctrine, INF Treaty, Afghanistan withdrawal; weigh against Soviet economic decline, Reagan's pressure, popular movements in Eastern Europe. Judgement.

@essay W11.RJW rubric=hist-p2 minutes=45
Q: Compare and contrast the causes of the Russo-Japanese War (1904–1905) and one other 20th-century war from a different region.
S: Imperial rivalry over Manchuria/Korea, the Triple Intervention, Russian expansion and the Anglo-Japanese Alliance versus, e.g., the causes of the Spanish Civil War (ideological, social, regional). Compare by category: territorial, economic, ideological, short-term triggers.

@essay W11.CCW rubric=hist-p2 minutes=45
Q: To what extent was Mao Zedong's leadership the main reason for the communist victory in the Chinese Civil War?
S: Mao's strategy and propaganda (Zunyi, Yan'an, guerrilla war, land reform) versus GMD weaknesses (corruption, hyperinflation, war exhaustion), the impact of the war against Japan and Soviet/US roles. Clear judgement.

@essay W11.TH rubric=hist-p2 minutes=45
Q: Examine the importance of guerrilla warfare in two 20th-century wars.
S: E.g. the Chinese Civil War (Mao's base areas and peasant support) and the Spanish Civil War (limited guerrilla role; mostly conventional) or WWII resistance movements. Assess when guerrilla tactics were decisive and when conventional warfare mattered more.

@essay W11.TH rubric=hist-p2 minutes=45
Q: Evaluate the political repercussions of two wars, each chosen from a different region.
S: E.g. the Russo-Japanese War (1905 Revolution, Japan's rise, Korea) and the Second World War in Europe (division of Germany, Cold War, UN). Weigh short- and long-term repercussions.
`;

export const historyEssays = parseEssays('history', source);
