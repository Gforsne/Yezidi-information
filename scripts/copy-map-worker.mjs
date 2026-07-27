#!/usr/bin/env node
/**
 * Kopiert den Web Worker von MapLibre nach `public/vendor/maplibre/`.
 *
 * Warum das nötig ist: MapLibre bestimmt die Adresse seines Workers zur
 * Laufzeit als Nachbardatei des eigenen Moduls. Nach dem Bündeln liegt
 * dort nichts – der Worker wird mit 404 quittiert, und die Karte zeichnet
 * gar nichts, ohne einen Fehler zu melden. Der Worker lädt zusätzlich
 * `maplibre-gl-shared.mjs` als Nachbardatei; beide müssen deshalb
 * zusammen und unverändert nebeneinander liegen.
 *
 * Die Dateien werden bei jedem `dev` und `build` frisch aus node_modules
 * kopiert, damit sie nicht von der installierten Version abweichen. Sie
 * sind deshalb in .gitignore ausgenommen.
 *
 * Aufruf: node scripts/copy-map-worker.mjs
 */

import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = dirname(fileURLToPath(new URL('.', import.meta.url)));
const quelle = join(wurzel, 'node_modules', 'maplibre-gl', 'dist');
const ziel = join(wurzel, 'public', 'vendor', 'maplibre');

const dateien = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

if (!existsSync(quelle)) {
  console.error('maplibre-gl ist nicht installiert – nichts zu kopieren.');
  process.exit(1);
}

await mkdir(ziel, { recursive: true });

for (const datei of dateien) {
  await copyFile(join(quelle, datei), join(ziel, datei));
}

// Kurzer Hinweis im Zielordner, damit niemand die Dateien von Hand pflegt.
await writeFile(
  join(ziel, 'README.md'),
  [
    '# Nicht von Hand bearbeiten',
    '',
    'Diese Dateien werden von `scripts/copy-map-worker.mjs` aus',
    '`node_modules/maplibre-gl/dist/` kopiert – bei jedem `npm run dev`',
    'und `npm run build`. Änderungen hier gehen verloren.',
    '',
    `Version: ${JSON.parse(await readFile(join(wurzel, 'node_modules', 'maplibre-gl', 'package.json'), 'utf8')).version}`,
    '',
  ].join('\n'),
  'utf8',
);

console.info(`MapLibre-Worker nach public/vendor/maplibre/ kopiert (${dateien.length} Dateien).`);
