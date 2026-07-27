#!/usr/bin/env node
/**
 * Läuft nach `astro build` und `pagefind`.
 *
 * Zwei Aufgaben:
 *  1. `content-report.md` und `RESEARCH-BRIEF.md` neu erzeugen, damit
 *     die Kennzahlen nie älter sind als der letzte Bau.
 *  2. Eine kurze Bilanz des Baus ausgeben – Seitenzahl, Suchindex,
 *     größte Skripte. Das macht Regressionen bei der Auslieferungsgröße
 *     sofort sichtbar, ohne ein weiteres Werkzeug.
 */

import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const wurzel = fileURLToPath(new URL('..', import.meta.url));
const dist = join(wurzel, 'dist');

const bericht = spawnSync('npx', ['tsx', join(wurzel, 'scripts', 'build-report.ts')], {
  stdio: 'inherit',
  cwd: wurzel,
});
if (bericht.status !== 0) process.exit(bericht.status ?? 1);

async function sammle(verzeichnis, endung) {
  if (!existsSync(verzeichnis)) return [];
  const eintraege = await readdir(verzeichnis, { withFileTypes: true });
  const ergebnis = [];
  for (const e of eintraege) {
    const voll = join(verzeichnis, e.name);
    if (e.isDirectory()) ergebnis.push(...(await sammle(voll, endung)));
    else if (e.name.endsWith(endung)) ergebnis.push(voll);
  }
  return ergebnis;
}

const seiten = await sammle(dist, '.html');
const skripte = await sammle(join(dist, '_astro'), '.js');
const stile = await sammle(join(dist, '_astro'), '.css');

const groessen = await Promise.all(
  skripte.map(async (s) => ({ datei: s.replace(dist + '/', ''), bytes: (await stat(s)).size })),
);
groessen.sort((a, b) => b.bytes - a.bytes);

const gesamtJs = groessen.reduce((a, g) => a + g.bytes, 0);
const gesamtCss = (await Promise.all(stile.map(async (s) => (await stat(s)).size))).reduce(
  (a, b) => a + b,
  0,
);

const kb = (b) => `${(b / 1024).toFixed(1)} kB`;

console.info('\nBau-Bilanz');
console.info(`  HTML-Seiten        ${seiten.length}`);
console.info(`  JavaScript gesamt  ${kb(gesamtJs)} in ${skripte.length} Dateien`);
console.info(`  CSS gesamt         ${kb(gesamtCss)} in ${stile.length} Dateien`);
console.info(`  Suchindex          ${existsSync(join(dist, 'pagefind')) ? 'vorhanden' : 'FEHLT'}`);

if (groessen.length > 0) {
  console.info('\n  Größte Skripte:');
  for (const g of groessen.slice(0, 5)) {
    console.info(`    ${kb(g.bytes).padStart(10)}  ${g.datei}`);
  }
  console.info(
    '\n  Hinweis: MapLibre ist mit Abstand das größte Skript. Es wird nur auf der\n' +
      '  Kartenseite geladen, und auch dort erst, wenn die Karte ins Bild kommt.',
  );
}

console.info('');
