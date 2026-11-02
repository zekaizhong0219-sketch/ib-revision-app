import { parseEssays } from '../dsl';

/**
 * Tareas de escritura cronometrada para Español A: Lengua y Literatura NM.
 * Los textos de la Prueba 1 son originales, escritos para esta aplicación.
 * Las preguntas de la Prueba 2 imitan el estilo general del IB, con redacción propia.
 */
const source = String.raw`
@essay P1 rubric=esp-p1 minutes=75
Q: **Texto: artículo de opinión (original)** ¶ «Vivimos conectados y, sin embargo, nunca habíamos estado tan solos. Cada mañana deslizamos el dedo por la pantalla como quien reza el rosario: mil caras, mil vidas perfectas, mil desayunos que nadie se comió frío. ¿Alguien recuerda la última vez que miró por la ventana del autobús? Nos prometieron una plaza pública y nos han dado un escaparate. No se trata de demonizar la tecnología (sería absurdo hacerlo desde un ordenador), sino de preguntarnos quién maneja a quién. Quizá la verdadera revolución consista hoy en algo tan sencillo como apagar el móvil y escuchar.» ¶ **Pregunta orientativa:** ¿De qué manera utiliza el autor el contraste y la ironía para transmitir su crítica?
S: Tipo de texto y destinatario; tesis (crítica a la dependencia digital y al aislamiento). Recursos: antítesis inicial (conectados / solos), símil religioso («como quien reza el rosario»), anáfora y enumeración («mil…»), pregunta retórica, metáfora («plaza pública» / «escaparate»), inciso irónico autorreferencial, primera persona del plural inclusiva, cierre con propuesta. Valora la eficacia persuasiva.

@essay P1 rubric=esp-p1 minutes=75
Q: **Texto: anuncio de una campaña institucional (original, descrito)** ¶ Fotografía en blanco y negro de un plato vacío sobre una mesa de cocina; solo una cuchara aparece en color, roja. Plano cenital. Arriba, en letras grandes: «Para ti es una comida. Para ellos, la única del día.» Abajo, en letra pequeña: «Uno de cada cinco niños de tu ciudad vive en riesgo de pobreza. Con 10 € al mes, ningún plato se queda vacío.» Logotipo de una ONG ficticia y un código QR. ¶ **Pregunta orientativa:** ¿Cómo se combinan los elementos visuales y verbales para persuadir al receptor?
S: Campaña de una ONG; destinatario adulto con capacidad económica. Imagen: contraste blanco y negro / color (la cuchara roja como foco y símbolo), plano cenital (mirada que juzga), vacío como metáfora de carencia. Texto: antítesis y paralelismo («Para ti… / Para ellos…»), interpelación en segunda persona, dato estadístico (logos), apelación emotiva (pathos), llamada a la acción concreta y facilidad (QR). Relación de anclaje entre imagen y eslogan.

@essay P1 rubric=esp-p1 minutes=75
Q: **Texto: entrada de blog de viajes (original)** ¶ «Llegué a Albarracín cuando el sol empezaba a rendirse detrás de las murallas. Las casas, colgadas sobre el río como nidos de golondrina, parecían sostenerse por pura cabezonería. Subí las cuestas sin mapa (el móvil se había quedado sin batería, bendito despiste) y me dejé guiar por el olor a leña. En una plaza diminuta, una señora sacó dos sillas a la puerta y me ofreció una: "Siéntate, que aquí las prisas no llegan". Tenía razón. Hay lugares que no se visitan: se escuchan.» ¶ **Pregunta orientativa:** ¿Cómo construye el autor una imagen idealizada del lugar?
S: Blog personal, primera persona, registro semiformal con rasgos coloquiales. Recursos: personificación («el sol empezaba a rendirse»), símil («como nidos de golondrina»), hipérbole humorística («pura cabezonería»), inciso con ironía amable, sinestesia y sensaciones (olor a leña), estilo directo de la señora, sentencia final con paradoja («no se visitan: se escuchan»). Valora el tópico del «beatus ille» y la idealización del mundo rural.

@essay P2 rubric=esp-p2 minutes=105
Q: ¿De qué manera y con qué efecto presentan dos de las obras estudiadas a personajes que se enfrentan a las normas de su sociedad?
S: Tesis comparativa; puntos de comparación: el conflicto con la norma, la caracterización, el desenlace, el narrador o la estructura dramática, los símbolos. Ambas obras en cada párrafo; citas breves memorizadas.

@essay P2 rubric=esp-p2 minutes=105
Q: Compare cómo dos de las obras estudiadas utilizan el espacio (lugares, ambientes, paisajes) para construir su significado.
S: Espacio físico y simbólico; espacio cerrado frente a abierto; relación entre espacio y personaje; descripción y punto de vista; contexto de recepción.

@essay P2 rubric=esp-p2 minutes=105
Q: «Toda obra literaria es, en el fondo, una reflexión sobre el poder.» Discuta esta afirmación con referencia a dos de las obras estudiadas.
S: Define «poder» (político, familiar, económico, de género, del lenguaje); matiza la afirmación; compara cómo cada obra representa y cuestiona el poder; técnicas del autor.

@essay P2 rubric=esp-p2 minutes=105
Q: ¿En qué medida el final de dos de las obras estudiadas transforma la interpretación del conjunto?
S: Tipos de final (abierto, cerrado, circular, trágico); anticipaciones previas; efecto en el lector; relación con los temas centrales. Juicio claro sobre «en qué medida».

@essay P2 rubric=esp-p2 minutes=105
Q: Analice cómo dos de las obras estudiadas emplean la voz narrativa o poética para influir en la perspectiva del lector.
S: Tipo de narrador o yo lírico; fiabilidad; focalización; estilo indirecto libre; distancia o cercanía emocional; consecuencias para la interpretación. Compara en cada párrafo.

@essay P2 rubric=esp-p2 minutes=105
Q: ¿Cómo presentan dos de las obras estudiadas la relación entre el individuo y la memoria (personal o colectiva)?
S: Memoria como tema y como técnica (analepsis, estructura fragmentada); contexto histórico; símbolos del recuerdo; olvido y silencio.
`;

export const spanishEssays = parseEssays('spanish', source);
