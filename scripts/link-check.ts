#!/usr/bin/env tsx
/**
 * Prüft alle internen Links im gebauten Verzeichnis `dist/`.
 *
 * Anders als `check:content` (das die Quellen prüft) arbeitet dieses
 * Skript auf dem Ergebnis: Es findet auch Links, die erst durch Layouts,
 * Navigation oder Komponenten entstehen. Ergänzend prüft es, ob
 * Sprungmarken (`#anker`) auf den Zielseiten existieren.
 *
 * Externe Links werden bewusst NICHT abgerufen – ein Prüflauf soll keine
 * fremden Server kontaktieren. Sie werden nur gezählt und aufgelistet.
 *
 * Aufruf: npm run check:links   (setzt `npm run build` voraus)
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { WURZEL } from './lib/inhalt-lesen.ts';

const DIST = join(WURZEL, 'dist');

if (!existsSync(DIST)) {
  console.error('dist/ existiert nicht. Zuerst `npm run build` ausführen.');
  process.exit(1);
}

async function htmlDateien(verzeichnis: string): Promise<string[]> {
  const eintraege = await readdir(verzeichnis, { withFileTypes: true });
  const ergebnis: string[] = [];
  for (const e of eintraege) {
    const voll = join(verzeichnis, e.name);
    if (e.isDirectory()) ergebnis.push(...(await htmlDateien(voll)));
    else if (e.name.endsWith('.html')) ergebnis.push(voll);
  }
  return ergebnis;
}

const dateien = await htmlDateien(DIST);

/** Menge aller ausgelieferten Pfade, normalisiert ohne abschließenden Slash. */
const vorhanden = new Set<string>();
/** Anker je Seite, damit `#…` geprüft werden kann. */
const ankerJeSeite = new Map<string, Set<string>>();

for (const datei of dateien) {
  const rel = '/' + relative(DIST, datei).replace(/\\/g, '/');
  const pfad = rel.replace(/\/index\.html$/, '').replace(/\.html$/, '') || '/';
  vorhanden.add(pfad);

  const html = await readFile(datei, 'utf8');
  const anker = new Set<string>(
    [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1] ?? ''),
  );
  ankerJeSeite.set(pfad, anker);
}

// Statische Dateien in public/ zählen ebenfalls als gültige Ziele.
async function statischeDateien(verzeichnis: string, praefix = ''): Promise<string[]> {
  if (!existsSync(verzeichnis)) return [];
  const eintraege = await readdir(verzeichnis, { withFileTypes: true });
  const ergebnis: string[] = [];
  for (const e of eintraege) {
    const voll = join(verzeichnis, e.name);
    if (e.isDirectory()) ergebnis.push(...(await statischeDateien(voll, `${praefix}/${e.name}`)));
    else ergebnis.push(`${praefix}/${e.name}`);
  }
  return ergebnis;
}

for (const d of await statischeDateien(DIST)) {
  if (!d.endsWith('.html')) vorhanden.add(d);
}

const fehler: string[] = [];
let interneLinks = 0;
const externeLinks = new Set<string>();

/**
 * Absolute Links auf die eigene Adresse (Canonical, hreflang, OG) sind
 * keine externen Verweise. Sie werden auf ihren Pfad zurückgeführt und
 * wie interne Links geprüft.
 */
const EIGENE_ADRESSE = process.env['SITE_URL'] ?? 'https://ezidi-portal.example';

for (const datei of dateien) {
  const rel = '/' + relative(DIST, datei).replace(/\\/g, '/');
  const seite = rel.replace(/\/index\.html$/, '').replace(/\.html$/, '') || '/';
  const html = await readFile(datei, 'utf8');

  for (const treffer of html.matchAll(/\shref=["']([^"']+)["']/g)) {
    const roh = treffer[1] ?? '';
    if (!roh || roh.startsWith('mailto:') || roh.startsWith('tel:')) continue;

    let ziel_roh = roh;
    if (roh.startsWith(EIGENE_ADRESSE)) {
      ziel_roh = roh.slice(EIGENE_ADRESSE.length) || '/';
    } else if (/^https?:\/\//.test(roh)) {
      externeLinks.add(roh);
      continue;
    }

    // Reine Sprungmarke innerhalb derselben Seite
    if (ziel_roh.startsWith('#')) {
      const anker = ziel_roh.slice(1);
      if (anker && !ankerJeSeite.get(seite)?.has(anker)) {
        fehler.push(`${seite}: Sprungmarke "${roh}" existiert auf dieser Seite nicht.`);
      }
      continue;
    }

    if (!ziel_roh.startsWith('/')) continue; // relative Pfade kommen im Ausgabecode nicht vor

    interneLinks += 1;
    const [pfadTeil = '', ankerTeil] = ziel_roh.split('#');
    const ziel = (pfadTeil.split('?')[0] ?? '').replace(/\/$/, '') || '/';

    if (!vorhanden.has(ziel)) {
      fehler.push(`${seite}: Link "${roh}" führt zu keiner ausgelieferten Seite.`);
      continue;
    }
    if (ankerTeil && !ankerJeSeite.get(ziel)?.has(ankerTeil)) {
      // Anker auf statischen Dateien können nicht geprüft werden.
      if (ankerJeSeite.has(ziel)) {
        fehler.push(`${seite}: Sprungmarke "${roh}" existiert auf der Zielseite nicht.`);
      }
    }
  }
}

console.info('');
console.info(`Geprüft: ${dateien.length} Seiten, ${interneLinks} interne Links.`);
console.info(`Externe Links (nicht abgerufen): ${externeLinks.size}`);
for (const e of [...externeLinks].sort()) console.info(`  → ${e}`);

if (fehler.length > 0) {
  console.error(`\n${fehler.length} kaputte Verweise:`);
  for (const f of fehler.slice(0, 60)) console.error(`  ✗ ${f}`);
  if (fehler.length > 60) console.error(`  … und ${fehler.length - 60} weitere.`);
  console.error('');
  process.exit(1);
}

console.info('\nAlle internen Links und Sprungmarken sind gültig.\n');
