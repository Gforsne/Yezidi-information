#!/usr/bin/env node
/**
 * Quellen-PDF herunterladen und in Text umwandeln.
 *
 * Recherche-Regel 4 verlangt, dass belegt nur wird, was tatsächlich
 * gelesen wurde. Dieses Skript ist der Weg dorthin: Es lädt ein PDF,
 * legt es unter `quellen/` ab und schreibt den extrahierten Text
 * daneben. Erst danach darf die Quelle in `sources.yaml` das Flag
 * `volltextGeprueft: true` bekommen.
 *
 *   node scripts/quelle-lesen.mjs <id> <url>
 *   node scripts/quelle-lesen.mjs un-coi-2016 https://…/A_HRC_32_CRP.2_en.pdf
 *
 * `quellen/` ist bewusst nicht versioniert: Die Dateien sind fremdes
 * Material mit eigenen Lizenzbedingungen. Versioniert wird nur der
 * Nachweis in `sources.yaml`.
 */

import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const ordner = join(wurzel, 'quellen');

const [, , id, url] = process.argv;

if (!id || !url) {
  console.error('Aufruf: node scripts/quelle-lesen.mjs <id> <url>');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(id)) {
  console.error(`Ungültige ID "${id}" – erlaubt sind Kleinbuchstaben, Ziffern und Bindestriche.`);
  process.exit(1);
}

/**
 * Abruf über curl, wenn ein Proxy gesetzt ist.
 *
 * Node berücksichtigt `HTTPS_PROXY` in `fetch` nicht; in Umgebungen mit
 * Proxy scheitert der direkte Abruf deshalb mit einem irreführenden
 * HTTP-Fehler. curl liest die Variable von sich aus.
 */
function ueberProxy() {
  return Boolean(process.env['HTTPS_PROXY'] ?? process.env['https_proxy']);
}

function ladeMitCurl(adresse) {
  return execFileSync('curl', ['-sSL', '--fail', '--max-time', '180', adresse], {
    maxBuffer: 256 * 1024 * 1024,
    encoding: 'buffer',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
}

let daten;
let typ = '';

if (ueberProxy()) {
  try {
    daten = ladeMitCurl(url);
  } catch (fehler) {
    console.error(`Abruf über curl fehlgeschlagen: ${fehler.message}`);
    process.exit(1);
  }
  // Ein PDF beginnt mit der Signatur %PDF-.
  typ = daten.subarray(0, 5).toString('latin1') === '%PDF-' ? 'application/pdf' : 'unbekannt';
} else {
  const antwort = await fetch(url, { redirect: 'follow' });
  if (!antwort.ok) {
    console.error(`Abruf fehlgeschlagen: HTTP ${antwort.status} für ${url}`);
    process.exit(1);
  }
  typ = antwort.headers.get('content-type') ?? '';
  daten = Buffer.from(await antwort.arrayBuffer());
}

if (!typ.includes('pdf')) {
  console.error(`Kein PDF, sondern "${typ}". Häufige Ursache: Der Link zeigt auf eine`);
  console.error('Vorschauseite statt auf die Datei. Den direkten Download-Link suchen.');
  process.exit(1);
}
await mkdir(ordner, { recursive: true });

const pdfPfad = join(ordner, `${id}.pdf`);
const txtPfad = join(ordner, `${id}.txt`);
await writeFile(pdfPfad, daten);

const pdf = require('pdf-parse');
const ergebnis = await pdf(daten);
await writeFile(txtPfad, ergebnis.text);

console.info('');
console.info(`  ${pdfPfad}`);
console.info(`  ${txtPfad}`);
console.info(`  ${ergebnis.numpages} Seiten · ${ergebnis.text.length} Zeichen`);
console.info('');
console.info('  Bibliografische Angaben im Dokument selbst prüfen, dann in');
console.info('  src/content/sources/sources.yaml eintragen. `volltextGeprueft: true`');
console.info('  erst setzen, wenn der Text auch gelesen wurde.');
console.info('');
