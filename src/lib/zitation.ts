import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/config';
import { formatDate } from '../i18n/utils';

export type Quelle = CollectionEntry<'sources'>['data'];

export const quellenTypLabel: Record<Quelle['type'], string> = {
  buch: 'Buch',
  aufsatz: 'Aufsatz',
  bericht: 'Bericht',
  zeitung: 'Zeitungsartikel',
  webseite: 'Webseite',
  primärquelle: 'Primärquelle',
  interview: 'Interview',
  video: 'Video',
};

export const verlaesslichkeitLabel: Record<Quelle['reliability'], string> = {
  wissenschaftlich: 'wissenschaftlich',
  institutionell: 'institutionell',
  journalistisch: 'journalistisch',
  community: 'Selbstdarstellung der Gemeinschaft',
  unklar: 'unklar',
};

/**
 * Rangfolge aus Recherche-Regel 2. Kleinere Zahl = höherwertige Quelle.
 * Wird für Sortierung und für den Hinweis „schwächste Quelle der Seite“
 * im Belegapparat benutzt.
 */
export const verlaesslichkeitRang: Record<Quelle['reliability'], number> = {
  wissenschaftlich: 1,
  institutionell: 2,
  journalistisch: 3,
  community: 4,
  unklar: 5,
};

function autorenKurz(authors: string[]): string {
  if (authors.length === 0) return 'o. A.';
  const nachname = (name: string) => {
    const teile = name.split(',');
    return (teile[0] ?? name).trim();
  };
  if (authors.length === 1) return nachname(authors[0] ?? '');
  if (authors.length === 2) return `${nachname(authors[0] ?? '')}/${nachname(authors[1] ?? '')}`;
  return `${nachname(authors[0] ?? '')} u. a.`;
}

/** Kurzbeleg für Tooltip und Randspalte: „Kreyenbroek 1995, S. 45“. */
export function kurzbeleg(quelle: Quelle, loc?: string): string {
  const jahr = quelle.year ? String(quelle.year) : 'o. J.';
  const basis = `${autorenKurz(quelle.authors)} ${jahr}`;
  return loc ? `${basis}, ${loc}` : basis;
}

/**
 * Vollbeleg für das Quellenverzeichnis.
 * Bewusst schlicht und einheitlich statt an einen Zitierstil angelehnt,
 * der für Berichte, Interviews und Videos ohnehin nicht trägt.
 */
export function vollbeleg(quelle: Quelle, locale: Locale = 'de'): string {
  const teile: string[] = [];
  if (quelle.authors.length > 0) teile.push(quelle.authors.join('; '));
  teile.push(`„${quelle.title}“`);
  if (quelle.container) teile.push(`In: ${quelle.container}`);
  if (quelle.publisher) teile.push(quelle.publisher);
  if (quelle.year) teile.push(String(quelle.year));
  if (quelle.isbn) teile.push(`ISBN ${quelle.isbn}`);
  if (quelle.doi) teile.push(`DOI ${quelle.doi}`);
  if (quelle.accessed) teile.push(`abgerufen am ${formatDate(quelle.accessed, locale)}`);
  return teile.join('. ') + '.';
}

export interface Belegposition {
  readonly nr: number;
  readonly id: string;
  readonly loc?: string | undefined;
  readonly note?: string | undefined;
  readonly quelle: Quelle | undefined;
}

/**
 * Bildet die `sources` aus dem Frontmatter auf die Ziffern ab, die
 * remark-zitate im Text vergeben hat. Beide benutzen dieselbe Regel:
 * Position im Frontmatter, Dubletten teilen sich eine Ziffer.
 */
export function belegapparat(
  refs: readonly { id: string; loc?: string | undefined; note?: string | undefined }[],
  quellen: ReadonlyMap<string, Quelle>,
): Belegposition[] {
  const gesehen = new Map<string, number>();
  const positionen: Belegposition[] = [];
  for (const ref of refs) {
    if (gesehen.has(ref.id)) continue;
    const nr = gesehen.size + 1;
    gesehen.set(ref.id, nr);
    positionen.push({
      nr,
      id: ref.id,
      loc: ref.loc,
      note: ref.note,
      quelle: quellen.get(ref.id),
    });
  }
  return positionen;
}

/** Ankername für die Sprungmarke eines Belegs. */
export function belegAnker(id: string): string {
  return `beleg-${id}`;
}

/** Ankername für die Rücksprungmarke im Text. */
export function zitatAnker(id: string, nr: number): string {
  return `zitat-${id}-${nr}`;
}

/**
 * Belegquote einer Seite: Anteil der H2-Abschnitte, in denen mindestens
 * ein Beleg steht, abzüglich markierter Beleglücken. Der Wert ist eine
 * grobe Kennzahl für den Content-Report, keine Qualitätsaussage.
 */
export function belegquote(abschnitte: number, zitate: number, luecken: number): number {
  if (abschnitte <= 0) return 0;
  const gedeckt = Math.max(0, Math.min(abschnitte, zitate) - luecken);
  return Math.round((gedeckt / abschnitte) * 100);
}
