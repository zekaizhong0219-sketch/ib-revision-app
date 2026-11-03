import type { Card } from '../../types';
import { hashString } from '../dsl';
import { LUCANOR } from '../spanishSources.generated';

/**
 * El conde Lucanor: la moraleja en verso de cada exemplo, citada literalmente (grafía medieval
 * de la edición de la Biblioteca Calleja, h. 1920, transcrita por el Proyecto Gutenberg).
 */
export const lucanorCards: Card[] = LUCANOR.filter((e) => e.verses.length).map((e) => {
  const front = `**Cita** · *El conde Lucanor*, exemplo ${e.number}: «${e.title.replace(/\.$/, '')}». ¿Con qué versos (la moraleja) termina?`;
  return {
    id: `esp-CL-${hashString(front)}`,
    subject: 'spanish',
    topic: 'CL',
    kind: 'quote',
    front,
    back: `${e.verses.map((v) => `«${v}»`).join('\n')}\n\n*Grafía medieval de la edición de la Biblioteca Calleja (h. 1920; Proyecto Gutenberg). Tu edición puede modernizar la ortografía: cita siempre por la edición de clase.*\n\n**Úsalo:** la estructura fija del exemplo (problema del conde, consejo de Patronio con un cuento, aplicación y moraleja en verso de don Juan Manuel) y su finalidad didáctica.`,
  };
});
