import { parseEssays } from '../dsl';
import { LARRA } from '../spanishSources.generated';
import type { EssayPrompt } from '../../types';

/**
 * Prueba 1 con textos auténticos de dominio público: artículos de Mariano José de Larra (1833),
 * fragmentos literales de la transcripción del Proyecto Gutenberg. Pregunta orientadora y guía
 * escritas para la aplicación.
 */
const body = (key: string) => LARRA[key].paragraphs.join(' ¶ ');

export const spanishLarraEssays: EssayPrompt[] = parseEssays(
  'spanish',
  `
@essay P1 rubric=esp-p1 minutes=75
Q: **Texto: artículo periodístico satírico, Mariano José de Larra, «${LARRA.vuelva.title}» (${LARRA.vuelva.date}), fragmento** ¶ ${body('vuelva')} ¶ **Pregunta orientadora:** ¿De qué manera utiliza el autor la repetición y la ironía para criticar a la sociedad de su tiempo?
S: Tipo de texto: artículo de costumbres satírico publicado en la prensa madrileña en 1833; narrador en primera persona (Fígaro) que acompaña a un extranjero, monsieur Sans-délai (nombre parlante: «sin demora»). Recursos: repetición anafórica de «Vuelva usted mañana» con una excusa distinta cada vez (no se ha levantado, ha salido, duerme la siesta, ha ido a los toros), que crea una gradación cómica y retrata la pereza; pregunta retórica («¿Qué día, a qué hora se ve a un español?»); apelación directa al «perezoso lector»; autoironía final: el narrador también aplaza («Dejemos esta cuestión para mañana»), lo que lo incluye en la crítica. Propósito: censurar la pereza y la ineficacia (también la de la Administración) para provocar la reforma; tono humorístico pero crítico.

@essay P1 rubric=esp-p1 minutes=75
Q: **Texto: artículo periodístico satírico, Mariano José de Larra, «${LARRA.pais.title}» (${LARRA.pais.date}), fragmento** ¶ ${body('pais')} ¶ **Pregunta orientadora:** ¿Cómo construye el autor el personaje de don Periquito y con qué propósito?
S: Tipo de texto: artículo de costumbres con tesis explícita al final. Personaje tipo: don Periquito (diminutivo despectivo), que repite la muletilla «en este país» para culpar a España de todo. Recursos: estructura de escenas breves (obra, charco, robo, pobre, teatro, café, viajes) con oraciones cortas y ritmo acumulativo; contraste España / extranjero; ironía por antífrasis en los comentarios del narrador («Porque en Londres no se roba», «En el extranjero no hay lodo»); exclamaciones que caricaturizan la queja; cierre exhortativo en primera persona del plural inclusiva («Borremos, pues, de nuestro lenguaje la humillante expresión»). Propósito: criticar el derrotismo y la admiración superficial por lo extranjero, y defender los progresos reales del país.
`,
);
