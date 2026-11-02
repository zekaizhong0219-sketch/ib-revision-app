import { parseQuestions } from '../dsl';

export const HISTORY_QUESTIONS_VERSION = 1;

/** Original practice questions for History SL (PS3, topics 11 and 12). Dates double-checked. */
const source = String.raw`
@num PS3.JP value=1931 abs=0
Q: In which year did the Mukden Incident take place?
S: 18 September 1931 — the pretext for the Japanese occupation of Manchuria.

@text PS3.JP
Q: What was the name of the puppet state Japan created in Manchuria in 1932?
A: Manchukuo | Manchuguo
S: Nominally headed by Puyi, the last Qing emperor.

@text PS3.JP
Q: Which League of Nations report (1932) condemned Japan's actions in Manchuria?
A: Lytton Report | Lytton Commission | Lytton
S: After the League adopted it in February 1933, Japan walked out.

@mc PS3.JP
Q: What was the immediate trigger of full-scale war between Japan and China in 1937?
O: The Mukden Incident
O*: The Marco Polo Bridge Incident
O: The Panay incident
O: The Xi'an Incident
S: The clash near Beijing on 7 July 1937 escalated into the Second Sino-Japanese War.

@mc PS3.JP
Q: Why did the US freezing of Japanese assets and oil embargo (July–August 1941) push Japan towards war?
O: Japan depended on the US for food imports.
O*: Without oil, Japan's navy and its war in China could not be sustained for long.
O: The embargo ended the Tripartite Pact.
O: It forced Japan to leave the League of Nations.
S: Japan imported most of its oil, largely from the US; the embargo set a deadline for seizing the Dutch East Indies' oil.

@order PS3.JP
Q: Put these events in chronological order.
I: Mukden Incident
I: Japan walks out of the League of Nations
I: Marco Polo Bridge Incident
I: Tripartite Pact
I: Attack on Pearl Harbor
S: 1931 → 1933 → 1937 → 1940 → 1941.

@mc PS3.JP
Q: Which agreement secured Japan's northern flank in April 1941?
O: Anti-Comintern Pact
O: Pact of Steel
O*: Soviet–Japanese Neutrality Pact
O: Tanggu Truce
S: After the defeat at Khalkhin Gol (1939), Japan chose southern expansion.

@open PS3.JP
Q: Outline two domestic factors in Japan that encouraged expansion in the 1930s.
A: Any two, with detail: the Great Depression (collapse of silk exports, rural poverty) discredited party politics and made autarky attractive; rising militarism — army insubordination (Kwantung Army), assassinations (Inukai 1932), the February 26 Incident (1936) — increased military control of policy; ultranationalist ideology centred on the emperor; need for raw materials and markets.

@num PS3.EU value=1936 abs=0
Q: In which year did German troops remilitarise the Rhineland?
S: 7 March 1936.

@text PS3.EU
Q: What name is given to the German annexation of Austria in March 1938?
A: Anschluss
S: 12–13 March 1938, confirmed by a controlled plebiscite in April.

@mc PS3.EU
Q: Which territory did the Munich Agreement (September 1938) transfer to Germany?
O: Danzig
O: The Saar
O*: The Sudetenland
O: Memel
S: The German-speaking border regions of Czechoslovakia; Czechoslovakia was not consulted.

@mc PS3.EU
Q: Which was a major weakness of the League's sanctions against Italy in 1935?
O: They banned all trade with Italy.
O*: They excluded oil, and the Suez Canal remained open.
O: The USA enforced them strictly.
O: They were imposed before the invasion began.
S: Without an oil embargo or closing Suez, Italy could continue the war in Abyssinia.

@order PS3.EU
Q: Put these events in chronological order.
I: Remilitarisation of the Rhineland
I: Anschluss with Austria
I: Munich Agreement
I: Occupation of Bohemia and Moravia
I: Nazi–Soviet Pact
I: Invasion of Poland
S: March 1936 → March 1938 → September 1938 → March 1939 → August 1939 → September 1939.

@match PS3.EU
Q: Match each event to its year.
P: Saar plebiscite => 1935
P: Rome–Berlin Axis => 1936
P: Italy leaves the League of Nations => 1937
P: Pact of Steel => 1939
P: Italy enters the Second World War => 1940
S: Saar Jan 1935; Axis Nov 1936; Italy leaves League Dec 1937; Pact of Steel May 1939; Italy at war June 1940.

@text PS3.EU
Q: Which 1935 agreement allowed Germany a navy of 35 % of British surface tonnage?
A: Anglo-German Naval Agreement | Anglo German Naval Agreement | Anglo-German Naval Treaty
S: June 1935 — it undermined the Stresa Front.

@mc PS3.EU
Q: Which statement about the Nazi–Soviet Pact (August 1939) is correct?
O: It created a military alliance against Britain.
O*: It included a secret protocol dividing Eastern Europe into spheres of influence.
O: It was signed after the invasion of Poland.
O: It was immediately rejected by Stalin.
S: Signed 23 August 1939; the secret protocol divided Poland and the Baltic region.

@open PS3.EU
Q: Explain two reasons why Britain followed a policy of appeasement in the 1930s.
A: Any two, developed: public opinion feared another war after 1914–18; many believed Versailles had been unfair to Germany; Britain's armed forces were unprepared and rearmament needed time; economic weakness after the Depression; imperial commitments and Dominion reluctance; Hitler seen as a barrier to communism.

@mc SRC
Q: In OPVL, "purpose" refers to
O: when the source was produced.
O*: why the source was produced and for whom.
O: how useful the source is.
O: who the historian is.
S: Purpose = the reason and intended audience; it often explains bias.

@mc SRC
Q: A private diary entry by a government minister written in 1938 is likely to have the value of
O: being completely objective.
O*: revealing the minister's private views, which may differ from public statements.
O: representing the views of the whole population.
O: showing what happened after 1938.
S: Private sources can show genuine opinions; but they reflect one person's perspective.

@mc SRC
Q: How many marks is Paper 1 question 4 worth?
O: 4
O: 6
O*: 9
O: 15
S: Q1 (3 + 2), Q2 (4), Q3 (6), Q4 (9) — total 24.

@open SRC
Q: A speech by Hitler to the Reichstag in 1936 justifies the remilitarisation of the Rhineland. Give one value and one limitation of this source.
A: Value (origin/purpose): it shows how Hitler publicly justified the action and the arguments he used to reassure foreign powers and win domestic support. Limitation: as propaganda intended for public and international audiences, it may hide his real intentions and military plans.

@mc W11.TH
Q: Which best describes "total war"?
O: A war fought by professional armies only
O*: A war in which a state mobilises all its resources and civilians become targets
O: A war limited to one region
O: A war between factions within one country
S: Both world wars are classic examples.

@match W11.TH
Q: Match each type of war to an example.
P: Civil war => Spanish Civil War
P: Total war => Second World War
P: Limited war => Korean War (from the US perspective)
P: Guerrilla war => Viet Cong campaign in South Vietnam
S: Types may overlap; justify your classification in essays.

@mc W11.TH
Q: The assassination of Franz Ferdinand is best described as a
O: long-term cause.
O*: trigger (immediate cause).
O: consequence.
O: peace settlement.
S: It sparked the July Crisis, but deeper causes made war likely.

@mc W11.WW1
Q: Which country was NOT a member of the Triple Entente?
O: Britain
O: France
O: Russia
O*: Italy
S: Italy was part of the Triple Alliance (1882) but joined the Entente side in 1915.

@order W11.WW1
Q: Put these events of 1914 in chronological order.
I: Assassination of Franz Ferdinand
I: Austria-Hungary's ultimatum to Serbia
I: Austria-Hungary declares war on Serbia
I: Germany declares war on Russia
I: Britain declares war on Germany
S: 28 June → 23 July → 28 July → 1 August → 4 August.

@text W11.WW1
Q: Which article of the Treaty of Versailles is known as the "war guilt clause"? (number)
A: 231 | Article 231
S: It formed the legal basis for reparations.

@num W11.WW1 value=100000 abs=0 unit=soldiers
Q: To what size did the Treaty of Versailles limit the German army?
S: 100,000 men, with no conscription, tanks or air force.

@mc W11.WW1
Q: Which historian argued in 1961 that Germany bore the main responsibility for the First World War?
O: A.J.P. Taylor
O*: Fritz Fischer
O: John Lewis Gaddis
O: Hugh Trevor-Roper
S: Fischer's "Griff nach der Weltmacht" (Germany's Aims in the First World War).

@match W11.WW1
Q: Match each treaty to the defeated power.
P: Versailles => Germany
P: Saint-Germain => Austria
P: Trianon => Hungary
P: Neuilly => Bulgaria
P: Sèvres => Ottoman Empire
S: Sèvres was later replaced by the Treaty of Lausanne (1923).

@mc W11.WW1
Q: What immediately brought the USA into the war in April 1917?
O: The sinking of the Lusitania in 1915
O*: Germany's unrestricted submarine warfare and the Zimmermann Telegram
O: The Russian Revolution
O: The Treaty of Brest-Litovsk
S: Germany resumed unrestricted submarine warfare in February 1917; the Zimmermann Telegram proposed a German–Mexican alliance.

@mc W11.WW2
Q: Which battle is usually seen as the turning point on the Eastern Front?
O: Kursk
O*: Stalingrad
O: Moscow
O: Leningrad
S: The surrender of the German 6th Army (February 1943) began the long Soviet advance. (Kursk, July 1943, confirmed it.)

@order W11.WW2
Q: Put these events in chronological order.
I: Fall of France
I: Operation Barbarossa
I: Attack on Pearl Harbor
I: Battle of Midway
I: D-Day landings
I: Atomic bombing of Hiroshima
S: June 1940 → June 1941 → December 1941 → June 1942 → June 1944 → August 1945.

@text W11.WW2
Q: What name is given to the German tactic of rapid, concentrated attacks by tanks and aircraft?
A: Blitzkrieg | lightning war
S: Used in Poland (1939) and France (1940).

@mc W11.WW2
Q: Which was a political effect of the Second World War?
O: The restoration of the Austro-Hungarian Empire
O*: The division of Germany and Europe into US and Soviet spheres
O: The creation of the League of Nations
O: The end of the British monarchy
S: The League dates from 1919; the UN replaced it in 1945.

@num W11.WW2 value=1945 abs=0
Q: In which year did the UN Charter come into force?
S: 24 October 1945.

@num W11.SCW value=1936 abs=0
Q: In which year did the Spanish Civil War begin?
S: The military uprising began on 17–18 July 1936.

@mc W11.SCW
Q: Which foreign unit bombed Guernica in April 1937?
O: The International Brigades
O*: The German Condor Legion
O: The Soviet air force
O: The French air force
S: With support from Italian aircraft; 26 April 1937.

@mc W11.SCW
Q: Which was NOT a reason for the Nationalist victory?
O: Unified military command under Franco
O: German and Italian aid
O: Divisions among Republicans
O*: Strong support from Britain and France for the Nationalists
S: Britain and France pursued non-intervention, which in practice hurt the Republic more.

@order W11.SCW
Q: Put these events in chronological order.
I: Proclamation of the Second Republic
I: Revolution in Asturias
I: Popular Front election victory
I: Military uprising
I: Bombing of Guernica
I: Battle of the Ebro
S: April 1931 → October 1934 → February 1936 → July 1936 → April 1937 → July–November 1938.

@open W11.SCW
Q: Outline two long-term causes of the Spanish Civil War.
A: Any two, with detail: land inequality and rural poverty (latifundia in the south); conflict over the role of the Catholic Church (anticlerical laws of the Republic); a politicised army used to intervening (pronunciamientos); regional nationalism in Catalonia and the Basque Country; growing left–right polarisation and class conflict.

@mc W12.RMA
Q: The Truman Doctrine (March 1947) first provided aid to
O: West Germany and France
O*: Greece and Turkey
O: Korea and Japan
O: Poland and Czechoslovakia
S: Truman asked Congress for US\$400 million to support Greece and Turkey against communist pressure.

@order W12.RMA
Q: Put these events in chronological order.
I: Yalta Conference
I: Iron Curtain speech
I: Truman Doctrine
I: Berlin Blockade begins
I: NATO founded
I: Warsaw Pact formed
S: Feb 1945 → Mar 1946 → Mar 1947 → Jun 1948 → Apr 1949 → May 1955.

@match W12.RMA
Q: Match each historian or school to its view of Cold War origins.
P: Orthodox => Soviet expansionism was mainly to blame
P: Revisionist => US economic expansionism was mainly to blame
P: Post-revisionist => mutual misperception and security fears on both sides
S: Gaddis's later work ("We Now Know", 1997) shifted towards blaming Stalin.

@text W12.RMA
Q: What was the Soviet bloc's economic organisation founded in January 1949 called?
A: Comecon | CMEA | Council for Mutual Economic Assistance
S: A response to the Marshall Plan.

@mc W12.LN
Q: Who denounced Stalin in the "Secret Speech" of February 1956?
O: Brezhnev
O*: Khrushchev
O: Malenkov
O: Gorbachev
S: At the 20th Party Congress; it encouraged unrest in Poland and Hungary.

@match W12.LN
Q: Match each leader to a policy or idea associated with them.
P: Eisenhower => domino theory
P: Khrushchev => peaceful coexistence
P: Brezhnev => doctrine justifying intervention in socialist states
P: Gorbachev => glasnost and perestroika
P: Kennedy => flexible response
S: Learn at least two leaders from different regions for "Leaders and nations".

@num W12.CR value=1962 abs=0
Q: In which year did the Cuban Missile Crisis take place?
S: 16–28 October 1962.

@order W12.CR
Q: Put these Cold War crises in chronological order.
I: Korean War begins
I: Hungarian Uprising
I: Berlin Wall built
I: Cuban Missile Crisis
I: Prague Spring crushed
I: Soviet invasion of Afghanistan
S: 1950 → 1956 → 1961 → 1962 → 1968 → 1979.

@mc W12.CR
Q: Why was the USSR unable to veto UN military action in Korea in June 1950?
O: It supported the action.
O*: It was boycotting the Security Council over China's seat.
O: It was not a member of the UN.
O: The vote took place in the General Assembly.
S: The USSR boycotted the Security Council because Nationalist China (Taiwan) held China's seat.

@mc W12.CR
Q: Which was a consequence of the Cuban Missile Crisis?
O: The building of the Berlin Wall
O*: The Moscow–Washington hotline and the Partial Test Ban Treaty (1963)
O: The end of the Warsaw Pact
O: The Korean War armistice
S: Both sides sought to reduce the risk of accidental nuclear war.

@match W12.END
Q: Match each agreement to its year.
P: Partial Test Ban Treaty => 1963
P: SALT I => 1972
P: Helsinki Accords => 1975
P: INF Treaty => 1987
S: Détente peaked in the early to mid-1970s.

@order W12.END
Q: Put these events in chronological order.
I: Solidarity founded in Poland
I: INF Treaty signed
I: Fall of the Berlin Wall
I: German reunification
I: Dissolution of the USSR
S: 1980 → December 1987 → November 1989 → October 1990 → December 1991.

@open W12.END
Q: Explain two reasons why the Cold War ended.
A: Any two, developed: Soviet economic stagnation and the cost of the arms race and the war in Afghanistan; Gorbachev's reforms (glasnost, perestroika) and abandonment of the Brezhnev Doctrine, allowing Eastern Europe to break away in 1989; popular movements (Solidarity, mass protests in East Germany); US pressure under Reagan (military build-up, SDI) followed by negotiation (INF Treaty).

@mc HS
Q: A.J.P. Taylor argued that Hitler
O: followed a detailed blueprint for world domination.
O*: was an opportunist who exploited the mistakes of others.
O: wanted peace and was forced into war by Britain.
O: was controlled by the German army.
S: "The Origins of the Second World War" (1961) — challenged by Trevor-Roper and others.

@mc HS
Q: In a "To what extent…" essay, what is essential?
O: A narrative of all events in order
O*: A clear judgement weighing the given factor against others
O: Quoting as many historians as possible
O: Discussing only the factor named in the question
S: Weigh, judge, and support the judgement with precise evidence.
`;

export const historyQuestions = parseQuestions('history', source);
