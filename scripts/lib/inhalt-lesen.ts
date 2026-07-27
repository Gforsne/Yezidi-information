/**
 * Liest die Inhalte direkt von der Platte – ohne Astro.
 *
 * Warum nicht über `astro:content`: `check:content` soll auch dann
 * laufen (und fehlschlagen) können, wenn der Astro-Build gar nicht erst
 * startet. Ein Prüfskript, das den Build braucht, prüft zu spät.
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';

export const WURZEL = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
export const INHALT = join(WURZEL, 'src', 'content');

export interface Dokument {
  /** Pfad relativ zur Projektwurzel – für Fehlermeldungen. */
  readonly pfad: string;
  readonly collection: string;
  readonly frontmatter: Record<string, unknown>;
  readonly rumpf: string;
}

async function dateienUnter(verzeichnis: string, endungen: string[]): Promise<string[]> {
  if (!existsSync(verzeichnis)) return [];
  const eintraege = await readdir(verzeichnis, { withFileTypes: true });
  const ergebnis: string[] = [];
  for (const e of eintraege) {
    const voll = join(verzeichnis, e.name);
    if (e.isDirectory()) ergebnis.push(...(await dateienUnter(voll, endungen)));
    else if (endungen.some((x) => e.name.endsWith(x))) ergebnis.push(voll);
  }
  return ergebnis;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Liest alle MDX-/MD-Dokumente einer Collection samt Frontmatter. */
export async function leseDokumente(collection: string): Promise<Dokument[]> {
  const dateien = await dateienUnter(join(INHALT, collection), ['.md', '.mdx']);
  const dokumente: Dokument[] = [];

  for (const datei of dateien) {
    const roh = await readFile(datei, 'utf8');
    const treffer = FRONTMATTER.exec(roh);
    if (!treffer) {
      throw new Error(`${relative(WURZEL, datei)}: kein Frontmatter gefunden.`);
    }
    let frontmatter: Record<string, unknown>;
    try {
      frontmatter = (parseYaml(treffer[1] ?? '') ?? {}) as Record<string, unknown>;
    } catch (fehler) {
      throw new Error(
        `${relative(WURZEL, datei)}: Frontmatter ist kein gültiges YAML – ${String(fehler)}`,
      );
    }
    dokumente.push({
      pfad: relative(WURZEL, datei),
      collection,
      frontmatter,
      rumpf: treffer[2] ?? '',
    });
  }

  return dokumente.sort((a, b) => a.pfad.localeCompare(b.pfad));
}

/** Liest eine YAML-Datensammlung (sources, events, faq, media). */
export async function leseDatensammlung(
  collection: string,
  datei: string,
): Promise<{ pfad: string; eintraege: Record<string, unknown>[] }> {
  const voll = join(INHALT, collection, datei);
  if (!existsSync(voll)) return { pfad: relative(WURZEL, voll), eintraege: [] };
  const roh = await readFile(voll, 'utf8');
  const daten = parseYaml(roh) as unknown;
  if (!Array.isArray(daten)) {
    throw new Error(`${relative(WURZEL, voll)}: erwartet wird eine Liste von Einträgen.`);
  }
  return { pfad: relative(WURZEL, voll), eintraege: daten as Record<string, unknown>[] };
}

/** Alle MDX-Collections, die redaktionelle Inhalte tragen. */
export const MDX_COLLECTIONS = [
  'articles',
  'persons',
  'places',
  'festivals',
  'glossary',
  'recipes',
  'misconceptions',
  'teaching',
] as const;

export interface Kennzahlen {
  zitate: string[];
  belegluecken: number;
  unsicher: number;
  abschnitte: number;
  begriffe: string[];
}

/**
 * Wertet den MDX-Rumpf aus: welche Quellen zitiert werden, wie viele
 * Beleglücken markiert sind, wie viele Abschnitte es gibt.
 *
 * Bewusst eine schlanke Textanalyse statt eines MDX-Parsers: Die
 * Komponenten werden immer in derselben, generierten Form geschrieben,
 * und die Prüfung soll ohne Bau-Werkzeuge laufen.
 */
export function werteRumpfAus(rumpf: string): Kennzahlen {
  const zitate = [...rumpf.matchAll(/<Cite\s[^>]*id=["']([^"']+)["']/g)].map((m) => m[1] ?? '');
  const begriffe = [...rumpf.matchAll(/<Begriff\s[^>]*id=["']([^"']+)["']/g)].map(
    (m) => m[1] ?? '',
  );
  const belegluecken = [...rumpf.matchAll(/<Belegluecke[\s/>]/g)].length;
  const unsicher = [...rumpf.matchAll(/<Unsicher[\s/>]/g)].length;
  const abschnitte = [...rumpf.matchAll(/^##\s+\S/gm)].length;
  return { zitate, belegluecken, unsicher, abschnitte, begriffe };
}

/** Interne Links aus dem Rumpf – Markdown und HTML. */
export function interneLinks(rumpf: string): string[] {
  const md = [...rumpf.matchAll(/\]\((\/[^)\s]+)\)/g)].map((m) => m[1] ?? '');
  const html = [...rumpf.matchAll(/href=["'](\/[^"']+)["']/g)].map((m) => m[1] ?? '');
  return [...md, ...html];
}
