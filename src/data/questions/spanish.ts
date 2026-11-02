import { parseQuestions } from '../dsl';

export const SPANISH_QUESTIONS_VERSION = 1;

/**
 * Preguntas originales para Español A: Lengua y Literatura NM (no proceden de exámenes del IB).
 * Ejemplos literarios de dominio público o construidos para la aplicación.
 */
const source = String.raw`
@text FIG
Q: ¿Qué figura retórica aparece en «hielo abrasador» (Quevedo)?
A: oxímoron | oximoron
S: Une en un mismo sintagma dos términos de significado opuesto.

@text FIG
Q: ¿Qué figura aparece en «Temprano levantó la muerte el vuelo, / temprano madrugó la madrugada» (Miguel Hernández)?
A: anáfora | anafora
S: Repetición de «temprano» al comienzo de versos sucesivos.

@mc FIG
Q: «Del salón en el ángulo oscuro» (Bécquer) es un ejemplo de
O: anáfora.
O*: hipérbaton.
O: sinestesia.
O: metonimia.
S: Orden habitual: «en el ángulo oscuro del salón».

@mc FIG
Q: «Se bebió dos copas» es un ejemplo de
O: metáfora.
O*: metonimia (continente por contenido).
O: hipérbole.
O: personificación.
S: Se nombra el recipiente (la copa) por su contenido (la bebida).

@mc FIG
Q: «Un amarillo chillón» es un ejemplo de
O: oxímoron.
O: aliteración.
O*: sinestesia.
O: epíteto.
S: Se atribuye a un color (vista) una cualidad sonora (oído).

@mc FIG
Q: «Cuando quiero llorar, no lloro, / y a veces lloro sin querer» (Rubén Darío) contiene un
O: polisíndeton.
O*: quiasmo.
O: apóstrofe.
O: símil.
S: Estructura cruzada: querer-llorar / llorar-querer.

@mc FIG
Q: «Acude, corre, vuela» (fray Luis de León) es un ejemplo de
O: polisíndeton.
O*: asíndeton (con gradación).
O: elipsis.
O: hipérbole.
S: Supresión de conjunciones; además, los verbos aumentan en intensidad.

@match FIG
Q: Relaciona cada ejemplo con su figura.
P: «Te lo he dicho mil veces» => hipérbole
P: «El viento susurraba entre los árboles» => personificación
P: «Luchó como un león» => símil
P: «Hay cuatro bocas que alimentar» => sinécdoque
P: «¡Qué puntualidad!» (a quien llega tarde) => ironía
S: Explica siempre el efecto de cada recurso, no solo su nombre.

@match FIG
Q: Relaciona cada figura con su definición.
P: Paradoja => contradicción aparente que encierra una verdad
P: Antítesis => contraposición de ideas opuestas
P: Lítote => afirmar algo negando lo contrario
P: Retruécano => inversión de términos que cambia el sentido
S: La paradoja implica una contradicción lógica aparente; la antítesis solo contrapone.

@text FIG
Q: «No es tonto» (para decir que es listo): ¿qué figura es?
A: lítote | litote | litotes | lítotes
S: Se afirma algo negando su contrario; suele atenuar o ironizar.

@mc FIG
Q: Al analizar un recurso en la Prueba 1, ¿qué es imprescindible para puntuar en el criterio B?
O: Nombrar el mayor número posible de figuras
O*: Explicar el efecto del recurso y relacionarlo con el sentido del texto
O: Copiar fragmentos largos del texto
O: Resumir el contenido del texto
S: El criterio B valora el análisis y la evaluación, no la mera identificación.

@num GEN value=11 abs=0 unit=sílabas
Q: ¿Cuántas sílabas métricas tiene un endecasílabo?
S: Once; es el verso de arte mayor más frecuente en la poesía española desde el Renacimiento.

@mc GEN
Q: Un soneto está formado por
O: catorce octosílabos con rima asonante.
O*: catorce endecasílabos: dos cuartetos y dos tercetos.
O: diez octosílabos con rima abbaaccddc.
O: versos libres sin estrofas fijas.
S: Rima consonante, normalmente ABBA ABBA en los cuartetos.

@mc GEN
Q: El romance es una serie de
O: endecasílabos con rima consonante.
O*: octosílabos con rima asonante en los versos pares.
O: heptasílabos y endecasílabos combinados libremente.
O: alejandrinos con rima ABAB.
S: Los versos impares quedan libres.

@mc GEN
Q: «luna / pluma» riman en
O: rima consonante.
O*: rima asonante.
O: no riman.
O: rima interna.
S: Coinciden las vocales (u-a) pero no las consonantes; «luna / cuna» sería consonante.

@mc GEN
Q: Si un verso termina en palabra aguda, al contar sus sílabas métricas
O: se resta una sílaba.
O*: se suma una sílaba.
O: se cuentan las mismas.
O: no se cuenta la última palabra.
S: Ley del acento final: aguda +1, llana igual, esdrújula −1.

@match GEN
Q: Relaciona cada técnica narrativa con su definición.
P: Analepsis => salto atrás en el tiempo del relato
P: Prolepsis => anticipación de hechos futuros
P: In medias res => comienzo en mitad de la acción
P: Monólogo interior => flujo de pensamiento de un personaje
S: Comenta siempre por qué el autor elige esa técnica.

@mc GEN
Q: «Estaba harta. ¿Por qué tenía que aguantar siempre lo mismo?» (sin verbo introductorio, en tercera persona) es un ejemplo de
O: estilo directo.
O: estilo indirecto.
O*: estilo indirecto libre.
O: acotación.
S: El narrador reproduce los pensamientos del personaje sin «pensó que…».

@mc GEN
Q: En teatro, el parlamento que oye el público pero, por convención, no los demás personajes se llama
O: soliloquio.
O*: aparte.
O: acotación.
O: monólogo interior.
S: El soliloquio se pronuncia con el personaje solo en escena.

@text GEN
Q: ¿Cómo se llama la estética teatral de Valle-Inclán que deforma la realidad para criticarla?
A: esperpento
S: «Luces de bohemia» es su ejemplo más conocido.

@match GEN
Q: Relaciona cada tópico literario con su significado.
P: carpe diem => aprovecha el momento presente
P: tempus fugit => el tiempo pasa rápidamente
P: beatus ille => alabanza de la vida retirada en el campo
P: locus amoenus => paisaje idealizado y agradable
P: ubi sunt => pregunta por lo que ya ha desaparecido
S: Jorge Manrique desarrolla el «ubi sunt» en sus «Coplas».

@mc NL
Q: En una noticia, la entradilla
O: es la opinión del periodista.
O*: resume lo esencial (qué, quién, cuándo, dónde, cómo, por qué).
O: es el pie de foto.
O: aparece al final del texto.
S: La noticia sigue la pirámide invertida: lo más importante primero.

@mc NL
Q: ¿Qué diferencia al editorial del artículo de opinión?
O: El editorial es siempre humorístico.
O*: El editorial expresa la opinión del periódico y no va firmado.
O: El artículo de opinión no tiene tesis.
O: El editorial solo informa de hechos.
S: El artículo de opinión lo firma su autor y refleja su punto de vista personal.

@match NL
Q: Relaciona cada función del lenguaje con su ejemplo.
P: Conativa => «¡Haz la prueba hoy mismo!»
P: Expresiva => «¡Qué ilusión me hace verte!»
P: Referencial => «El agua hierve a 100 °C a nivel del mar.»
P: Fática => «¿Me oyes bien?»
P: Metalingüística => «"Casa" es un sustantivo.»
S: La función poética se centra en la forma del propio mensaje.

@mc NL
Q: Un anuncio que muestra a un deportista famoso recomendando un producto apela sobre todo al
O: logos.
O*: ethos.
O: kairós.
O: pathos exclusivamente.
S: Ethos: la credibilidad o autoridad del emisor se transfiere al producto.

@mc NL
Q: Una fotografía tomada desde abajo, que hace parecer más poderosa a la persona retratada, utiliza un
O: picado.
O*: contrapicado.
O: plano detalle.
O: plano general.
S: El picado (desde arriba) la empequeñece.

@text NL
Q: ¿Cómo se llama la frase breve y memorable que resume el mensaje de un anuncio?
A: eslogan | slogan
S: Suele usar rima, aliteración, juegos de palabras o imperativos.

@mc NL
Q: «Quien defiende esta ley es un ignorante que nunca ha trabajado» es un ejemplo de
O: argumento de autoridad.
O*: falacia ad hominem.
O: argumento de datos.
O: contraargumentación.
S: Ataca a la persona en lugar de rebatir su argumento.

@match NL
Q: Relaciona cada tipo de argumento con su ejemplo.
P: De autoridad => «Según la OMS, dormir menos de siete horas…»
P: De datos => «El 62 % de los jóvenes lee menos de un libro al año.»
P: De ejemplificación => «Pensemos en el caso de Finlandia…»
P: De analogía => «Igual que un motor necesita aceite, el cerebro necesita descanso.»
S: Valorar la eficacia de los argumentos es parte del criterio B.

@mc NL
Q: Una estructura argumentativa con la tesis al principio y al final se denomina
O: deductiva.
O: inductiva.
O*: encuadrada.
O: paralela.
S: Deductiva: tesis al principio; inductiva: tesis al final.

@mc NL
Q: «Sin embargo», «no obstante» y «aun así» son marcadores
O: aditivos.
O*: contraargumentativos.
O: consecutivos.
O: reformuladores.
S: Introducen una idea que se opone o matiza lo anterior.

@mc NL
Q: «Paloma» asociada a la paz es un ejemplo de
O: denotación.
O*: connotación.
O: campo semántico.
O: eufemismo.
S: La connotación añade valores culturales o subjetivos al significado básico.

@mc CON
Q: ¿Cuál NO es una de las tres áreas de exploración del curso?
O: Lectores, escritores y textos
O: Tiempo y espacio
O: Intertextualidad: conexión de textos
O*: Lengua y poder
S: «Lengua y poder» no es un área de exploración en el programa actual.

@text CON
Q: Escribe uno de los siete conceptos del curso que empiece por «t».
A: transformación | transformacion
S: Los siete conceptos: identidad, cultura, creatividad, comunicación, perspectiva, transformación y representación.

@mc CON
Q: ¿Cuál es la ponderación de cada componente en Lengua y Literatura NM?
O: Prueba 1 50 %, Prueba 2 25 %, oral 25 %
O*: Prueba 1 35 %, Prueba 2 35 %, oral 30 %
O: Prueba 1 30 %, Prueba 2 30 %, oral 40 %
O: Prueba 1 25 %, Prueba 2 50 %, oral 25 %
S: En NS se añade el ensayo de nivel superior y cambian los porcentajes.

@num P1 value=75 abs=0 unit=minutos
Q: ¿Cuántos minutos dura la Prueba 1 en el Nivel Medio?
S: 1 h 15 min, para analizar uno de los dos textos no literarios propuestos.

@mc P1
Q: En la Prueba 1, la pregunta orientativa
O: debe responderse obligatoriamente y en exclusiva.
O*: orienta el análisis, pero se puede plantear un enfoque propio.
O: es una pregunta de comprensión de respuesta corta.
O: se responde en un párrafo aparte.
S: Es recomendable usarla como eje, pero no es obligatoria.

@order P1
Q: Ordena las partes de un buen análisis de Prueba 1.
I: Identificar tipo de texto, propósito y destinatario
I: Formular una tesis interpretativa en la introducción
I: Analizar recursos con citas y explicar su efecto
I: Valorar la eficacia del texto en relación con su propósito
I: Concluir retomando la tesis
S: Planifica antes de escribir; dedica unos 10 minutos a leer y organizar.

@num P2 value=105 abs=0 unit=minutos
Q: ¿Cuántos minutos dura la Prueba 2?
S: 1 h 45 min, en NM y en NS.

@mc P2
Q: ¿Qué organización es más eficaz para el ensayo comparativo de la Prueba 2?
O: Analizar primero una obra entera y después la otra
O*: Organizar por aspectos y tratar ambas obras en cada párrafo
O: Resumir el argumento de cada obra
O: Comparar solo los autores y su biografía
S: El modelo integrado (las dos obras en cada párrafo) es el que mejor puntúa en B2 (análisis comparativo) y en C (equilibrio).

@mc P2
Q: En la Prueba 2 no se pueden utilizar
O: obras traducidas.
O*: las obras empleadas en el oral individual.
O: obras de poesía.
O: obras estudiadas en clase.
S: Hay que usar dos obras literarias estudiadas distintas de las del oral.

@num IO value=15 abs=0 unit=minutos
Q: ¿Cuánto dura en total el oral individual (exposición y preguntas)?
S: 10 minutos de exposición y 5 de preguntas.

@mc IO
Q: El oral individual analiza un tema global a partir de
O: dos obras literarias.
O*: un fragmento de una obra literaria y otro de un corpus de textos no literarios.
O: un texto no literario visto por primera vez.
O: una pregunta general elegida por el examinador.
S: Cada fragmento puede tener hasta 40 líneas.

@match IO
Q: Relaciona cada campo de indagación con un posible tema global.
P: Política, poder y justicia => la manipulación de la verdad por parte del poder
P: Cultura, identidad y comunidad => el desarraigo de quien emigra
P: Ciencia, tecnología y medio ambiente => la explotación de la naturaleza
P: Arte, creatividad e imaginación => el artista frente a la censura
P: Creencias, valores y educación => el choque entre tradición y libertad individual
S: El tema global debe ser concreto y estar presente en ambos textos.

@mc MOV
Q: ¿Qué autor pertenece a la Generación del 27?
O: Miguel de Unamuno
O*: Federico García Lorca
O: Benito Pérez Galdós
O: Gustavo Adolfo Bécquer
S: Unamuno pertenece a la Generación del 98; Galdós al Realismo; Bécquer al Posromanticismo.

@match MOV
Q: Relaciona cada obra con su autor.
P: «La Regenta» => Clarín
P: «La familia de Pascual Duarte» => Camilo José Cela
P: «Nada» => Carmen Laforet
P: «Cien años de soledad» => Gabriel García Márquez
P: «Rayuela» => Julio Cortázar
S: Sitúa siempre las obras en su contexto si ayuda al análisis.

@order MOV
Q: Ordena cronológicamente estos movimientos literarios.
I: Renacimiento
I: Barroco
I: Neoclasicismo
I: Romanticismo
I: Realismo
I: Modernismo
S: Siglos XVI, XVII, XVIII, primera mitad del XIX, segunda mitad del XIX, finales del XIX y principios del XX.

@mc MOV
Q: El culteranismo de Góngora se caracteriza por
O: la sencillez expresiva y el lenguaje coloquial.
O*: la complejidad formal, los cultismos y el hipérbaton.
O: el retrato objetivo de la sociedad.
O: el verso libre.
S: El conceptismo (Quevedo) prima la agudeza de las ideas.
`;

export const spanishQuestions = parseQuestions('spanish', source);
