import { parseCards } from '../dsl';

/**
 * Historiography cards (History Paper 2): the main interpretations of each debate, summarised in
 * the app's own words. Use them to name and weigh historians' views, not as quotations.
 */
export const historiographyCards = parseCards(
  'history',
  String.raw`
# W11.WW1
[p] Historiography, causes of WWI: what did Fritz Fischer argue in *Griff nach der Weltmacht* (1961)? :: Germany's leaders deliberately risked or sought a major war in 1914 to become a world power and to escape domestic pressures; he pointed to German war aims (the September Programme, 1914). His work started the "Fischer controversy" by reviving German responsibility.
[p] Historiography, causes of WWI: what is Christopher Clark's view in *The Sleepwalkers* (2012)? :: No single power planned the war: leaders in all the capitals, including Serbia and Russia, made a chain of decisions based on mistrust and misperception, so responsibility is shared and the outbreak was contingent.
[p] Historiography, causes of WWI: what did A. J. P. Taylor argue in *War by Timetable* (1969)? :: Mobilisation plans and railway timetables (above all the Schlieffen Plan) created a momentum that politicians could not stop once mobilisation began: a "structural" explanation.
[k] Historiography, causes of WWI: what was the dominant view between the wars, before Fischer? :: Responsibility was broadly shared: the powers "slid" into war through alliances, the arms race and crisis diplomacy, which softened Article 231's verdict of German guilt.

# W11.WW2
[p] Historiography, causes of WWII in Europe: what did A. J. P. Taylor argue in *The Origins of the Second World War* (1961)? :: Hitler was an opportunist acting like a traditional German statesman, exploiting the mistakes of others, with no fixed plan for war; war in 1939 came from miscalculation on all sides.
[p] Historiography, causes of WWII: what was the "intentionalist" reply to Taylor (e.g. Hugh Trevor-Roper)? :: Hitler had long-term aims set out in *Mein Kampf* (Lebensraum in the East, racial war), so the war followed from his ideology and programme, whatever tactical opportunism he showed.
[p] Historiography, causes of WWII: what did Tim Mason argue about 1939, and how did Richard Overy respond? :: Mason: economic strain and labour unrest pushed the regime into war earlier than planned (a "flight into war"). Overy: the evidence shows no such domestic crisis forced Hitler's hand; foreign-policy aims and opportunity mattered more.
[k] Historiography, appeasement: what are the "Guilty Men", revisionist and counter-revisionist views? :: *Guilty Men* (1940): appeasers were weak and blind. Revisionists (from the 1960s, with opened archives; later e.g. John Charmley): Chamberlain had few options given weak forces, the Dominions and public opinion. Counter-revisionists (R. A. C. Parker, 1993): alternatives such as a firm alliance with France and the USSR existed, and Chamberlain chose not to pursue them.
[p] Historiography, Japanese expansion: what did Michael Barnhart argue in *Japan Prepares for Total War* (1987)? :: The search for economic security (autarky in raw materials for a future total war) drove expansion into China and South-East Asia, shaped by army planners.
[p] Historiography, Japanese expansion: how did Herbert Bix change the view of Hirohito (*Hirohito and the Making of Modern Japan*, 2000)? :: Against the post-war image of a powerless figurehead, he argued that the emperor took an active part in war decisions, so responsibility reached the top.

# W11.SCW
[p] Historiography, Spanish Civil War: what is Paul Preston's interpretation? :: The war grew from deep social conflict (land, Church, army, regions); the right, and Franco in particular, waged it with deliberate repression; German and Italian help was decisive for the Nationalist victory.
[p] Historiography, Spanish Civil War: why did the Nationalists win, according to Antony Beevor (*The Battle for Spain*, 2006)? :: Nationalist unity of command, Franco's caution and steady foreign military aid, against Republican divisions (communists, anarchists, POUM), poor coordination and limited, costly Soviet help.
[p] Historiography, Spanish Civil War: what does Stanley Payne emphasise? :: The radicalisation of the Second Republic and revolutionary violence on the left before and during the war, which in his view made a breakdown more likely; a more critical view of the Republic than Preston's.

# W11.CCW
[p] Historiography, Chinese Civil War: what did Chalmers Johnson argue in *Peasant Nationalism and Communist Power* (1962)? :: The CCP won because it led peasant resistance to the Japanese invasion behind the lines, so nationalism, more than land reform alone, built its mass support.
[p] Historiography, Chinese Civil War: what does Suzanne Pepper's *Civil War in China* (1978) stress? :: The political failure of the GMD after 1945: corruption, inflation and repression lost it the support of the cities and the middle classes.
[p] Historiography, Chinese Civil War: what is Odd Arne Westad's view in *Decisive Encounters* (2003)? :: The outcome was decided by military and political choices, especially in Manchuria in 1946–1948; communist victory was not inevitable, and Chiang's strategic mistakes mattered.

# W12.RMA
[k] Historiography, origins of the Cold War: what is the orthodox view? :: Soviet expansion and Stalin's ideology caused the Cold War; the US responded defensively (e.g. Herbert Feis, Arthur Schlesinger Jr.; dominant in the 1940s–1950s).
[k] Historiography, origins of the Cold War: what is the revisionist view? :: US economic expansion and the drive for open markets ("Open Door"), plus atomic diplomacy, threatened the USSR and caused the conflict (William Appleman Williams, *The Tragedy of American Diplomacy*, 1959; Gabriel Kolko).
[p] Historiography, origins of the Cold War: what is the post-revisionist view of John Lewis Gaddis (1972), and how did he revise it in *We Now Know* (1997)? :: 1972: shared responsibility and mutual misperception, with domestic US politics limiting options. 1997, using Soviet-bloc archives: Stalin's personality and ideology bear the main responsibility.
[p] Historiography, origins of the Cold War: what did Melvyn Leffler argue in *A Preponderance of Power* (1992)? :: US leaders pursued a national-security strategy aimed at preponderance (bases, control of industrial centres, alliances), which went beyond defence and helped escalate the conflict, even though the USSR was also expansionist.

# W12.END
[k] Historiography, end of the Cold War: what are the "triumphalist" and Gorbachev-centred explanations? :: Triumphalist: Reagan's arms build-up, SDI and ideological pressure forced the USSR to give way. Gorbachev-centred (e.g. Archie Brown, *The Gorbachev Factor*, 1996): Gorbachev's own choices (glasnost, perestroika, refusing to use force in Eastern Europe) ended it; structural economic decline made reform urgent.
`,
);
