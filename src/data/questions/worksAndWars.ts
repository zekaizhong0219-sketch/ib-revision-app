import { parseQuestions } from '../dsl';

/** Practice questions for the student's set works (Spanish A, English B) and the extra Topic 11 wars. */
const spanish = String.raw`
@mc AE
Q: ¿Qué tipo de narradora es Elena Greco en *La amiga estupenda*?
O: Heterodiegética y omnisciente
O*: Autodiegética, retrospectiva y poco fiable
O: Testigo en tercera persona
O: Objetiva, como una cámara
S: Narra su propia historia desde los 66 años, filtrada por la rivalidad y la culpa: el lector debe distinguir hechos e interpretaciones.

@text AE
Q: ¿Cómo se llama la sensación de Lila de que los contornos de la realidad se disuelven? (palabra en castellano)
A: desbordamiento | smarginatura | el desbordamiento
S: Primer episodio: Nochevieja de 1958, durante el tiroteo de los Solara.

@mc AE
Q: ¿Con qué imagen termina *La amiga estupenda*?
O: Lila desaparece de Nápoles
O: Lenù se marcha a estudiar a Pisa
O*: Marcello Solara aparece en la boda calzando los zapatos que diseñó Lila
O: Don Achille es asesinado
S: Final abierto de tipo serial: la traición de Stefano y la apropiación masculina del trabajo de Lila.

@order AE
Q: Ordena estos episodios de *La amiga estupenda*.
I: Las muñecas caen al sótano
I: Lila es arrojada por la ventana
I: Asesinato de don Achille
I: Nochevieja de 1958 y primer «desbordamiento»
I: Verano en Ischia
I: Boda de Lila
S: Infancia (muñecas, ventana, asesinato) y adolescencia (Nochevieja, Ischia, boda).

@mc EP
Q: En *Un enemigo del pueblo*, ¿quién pronuncia por primera vez la etiqueta «enemigo del pueblo»?
O: Aslaksen, en la asamblea
O*: El alcalde, en el acto II
O: Hovstad, en la redacción
O: Morten Kul, en el acto V
S: La pronuncia el alcalde (II); Aslaksen la convierte en resolución oficial en el acto IV.

@match EP
Q: Relaciona cada acto con su espacio escénico.
P: Actos I y II => salón de los Stockmann
P: Acto III => redacción de La Voz del Pueblo
P: Acto IV => sala en casa del capitán Horster
P: Acto V => despacho del doctor
S: La sala de la condena (IV) será la sala de la escuela (V).

@text EP
Q: ¿Qué expresión repiten Aslaksen y el doctor para referirse a la masa de pequeños propietarios? (dos palabras)
A: mayoría compacta | la mayoría compacta
S: Aslaksen la invoca como apoyo (II); el doctor la ataca como enemiga de la verdad (IV).

@mc EP
Q: ¿Cuál es el único voto que no condena al doctor en la asamblea?
O: El de Petra
O: El de Horster
O*: El de un borracho
O: El de Catalina
S: Ironía: el único que no lo condena no está en sus cabales.

@mc AC
Q: ¿Qué parte de *El árbol de la ciencia* funciona como eje filosófico de la novela?
O: Parte I, en la universidad
O*: Parte IV, el diálogo entre Andrés e Iturrioz
O: Parte V, en Alcolea del Campo
O: Parte VII, la muerte de Lulú
S: La acción se detiene; el capítulo IV, 3 da título a la obra.

@text AC
Q: Completa la cita (IV, 3): «A más comprender corresponde menos ___».
A: desear
S: Tesis schopenhaueriana: el conocimiento debilita la voluntad de vivir.

@match AC
Q: Relaciona cada personaje con su función.
P: Iturrioz => mentor pragmático, el Baroja maduro
P: Lulú => única persona con la que Andrés conecta
P: Julio Aracil => éxito práctico sin escrúpulos
P: Luisito => hermano pequeño cuya muerte destruye un refugio
S: Los secundarios suelen ser contrastes o tipos sociales.

@mc AC
Q: ¿Cómo termina *El árbol de la ciencia*?
O: Andrés emigra a Europa
O*: Muere el hijo, muere Lulú y Andrés se envenena
O: Andrés vuelve a Alcolea como médico
O: Iturrioz se suicida
S: Frase final: «Pero había en él algo de precursor».

@mc CL
Q: ¿Cuál es la estructura de cada ejemplo de *El conde Lucanor*?
O*: Problema del conde → cuento de Patronio → aplicación → moraleja en verso
O: Diálogo entre dos pastores en verso
O: Un único relato largo dividido en capítulos
O: Cartas entre el conde y su consejero
S: Marco fijo que facilita la enseñanza; la moraleja la añade don Juan Manuel.

@match CL
Q: Relaciona cada ejemplo con su tema.
P: Don Illán y el deán de Santiago => la ingratitud
P: Los burladores que hicieron el paño => el miedo al qué dirán
P: Doña Truhana => las esperanzas vanas
P: El hombre bueno, su hijo y el asno => no se puede contentar a todos
S: Fuentes orientales, clásicas y cristianas adaptadas a la nobleza castellana.

@mc PE
Q: ¿Qué efecto principal tiene el blanco y negro sin grises en *Persépolis*?
O: Abaratar la edición
O*: Contraste y sobriedad: oposiciones morales y distancia ante la violencia
O: Imitar la fotografía documental
O: Indicar los sueños de la protagonista
S: El dibujo sencillo e icónico además universaliza la experiencia.

@mc CA
Q: ¿Qué es el «cuarto de atrás» en la novela de Martín Gaite?
O: La celda donde estuvo presa la narradora
O*: El cuarto de juegos de su infancia, símbolo de la memoria y la imaginación
O: El despacho del hombre de negro
O: Un capítulo eliminado por la censura
S: Tras la guerra pasó a ser despensa: la imaginación infantil frente al orden de la posguerra.
`;

const english = String.raw`
@mc TKM
Q: Why is Tom Robinson's left arm important at the trial?
O: It proves he was at the Ewells' house.
O*: It is crippled, while Mayella's injuries suggest a left-handed attacker.
O: It shows he fought back against Bob Ewell.
O: It was injured by the lynch mob.
S: Bob Ewell is left-handed; the evidence points away from Tom, yet the jury convicts him.

@match TKM
Q: Match each character to their role.
P: Atticus Finch => lawyer and moral centre of the novel
P: Boo Radley => reclusive neighbour who saves the children
P: Calpurnia => bridge between the Black and white communities
P: Mrs Dubose => example of courage in fighting addiction
P: Heck Tate => sheriff who protects Boo at the end
S: Characters test the lesson of empathy.

@text TKM
Q: In which fictional Alabama town is the novel set?
A: Maycomb
S: Maycomb, Alabama, 1933–1935.

@open TKM
Q: Explain what the mockingbird symbolises and identify two characters who embody it.
A: Mockingbirds harm no one and only make music, so it is a sin to kill one: the symbol stands for innocence destroyed by evil. Tom Robinson (convicted and killed despite being innocent) and Boo Radley (harmless, and protected at the end so that he is not exposed) embody it.

@mc VC
Q: How does the narrator present *Victory City*?
O: As Pampa Kampana's diary written day by day
O*: As a retelling of Pampa Kampana's epic poem *Jayaparajaya*
O: As a historian's academic study
O: As a series of letters between kings
S: The frame makes storytelling itself a central theme.

@text VC
Q: Which historical South Indian empire does Bisnaga represent?
A: Vijayanagara | Vijayanagar | the Vijayanagara Empire
S: Founded in the 14th century; destroyed after the Battle of Talikota (1565).

@open VC
Q: Outline Pampa Kampana's vision for Bisnaga and how it is threatened.
A: She wants a city where women are equal to men, different religions coexist and art flourishes. Rulers' ambitions and religious hardliners repeatedly undo this vision, and the city finally falls; only her words survive.

@open IO
Q: Prepare a link between your two works for the general discussion: choose one theme from the course and explain how each work treats it.
A: Example: Social organization / justice. *To Kill a Mockingbird* shows a legal system corrupted by racism (Tom's trial) and individual moral courage (Atticus). *Victory City* shows how rulers and religious authorities betray a just, tolerant vision. Both use storytelling and perspective to make readers judge injustice.
`;

const history = String.raw`
@num W11.RJW value=1905 abs=0
Q: In which year was the Treaty of Portsmouth signed?
S: September 1905, mediated by Theodore Roosevelt.

@mc W11.RJW
Q: Which battle destroyed Russia's Baltic Fleet in May 1905?
O: Mukden
O: Port Arthur
O*: Tsushima
O: Talikota
S: Admiral Tōgō's decisive naval victory.

@order W11.RJW
Q: Put these events in chronological order.
I: Treaty of Shimonoseki and the Triple Intervention
I: Anglo-Japanese Alliance
I: Attack on Port Arthur
I: Battle of Tsushima
I: Treaty of Portsmouth
I: Japanese annexation of Korea
S: 1895 → 1902 → 1904 → May 1905 → September 1905 → 1910.

@open W11.RJW
Q: Explain two effects of the Russo-Japanese War.
A: Any two, developed: Japan became a great power and gained Port Arthur/Liaodong, southern Sakhalin and control of Korea (protectorate 1905, annexation 1910); Russia's defeat helped trigger the 1905 Revolution (Bloody Sunday, October Manifesto, Duma); first modern Asian victory over a European power, inspiring nationalists; Russia refocused on the Balkans, raising tension before 1914.

@mc W11.CCW
Q: Which event in April 1927 ended the First United Front?
O: The Long March
O*: The Shanghai Massacre
O: The Xi'an Incident
O: The Zunyi Conference
S: Chiang Kai-shek turned on the communists in Shanghai.

@order W11.CCW
Q: Put these events in chronological order.
I: Shanghai Massacre
I: Start of the Long March
I: Zunyi Conference
I: Xi'an Incident
I: Huaihai Campaign
I: Proclamation of the People's Republic of China
S: 1927 → Oct 1934 → Jan 1935 → Dec 1936 → 1948–49 → 1 Oct 1949.

@open W11.CCW
Q: Explain two reasons for the communist victory in the Chinese Civil War.
A: Any two, developed: land reform won peasant support; disciplined guerrilla strategy and base areas; Mao's leadership and propaganda; GMD corruption, hyperinflation and loss of legitimacy; the war against Japan weakened the GMD while the CCP expanded; captured Japanese weapons in Manchuria.

@text W11.CCW
Q: To which island did Chiang Kai-shek's government retreat in 1949?
A: Taiwan | Formosa
S: December 1949.
`;

export const worksQuestions = [
  ...parseQuestions('spanish', spanish),
  ...parseQuestions('english', english),
  ...parseQuestions('history', history),
];
