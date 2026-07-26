#!/usr/bin/env node
/**
 * Erzeugt die Inhaltsgerüste aus dem Bauplan in scripts/plan/.
 *
 * Warum ein Generator und keine 120 handgeschriebenen Dateien:
 * Das Gerüst soll überall exakt dieselbe Struktur haben – gleiche
 * Frontmatter-Felder, gleiche Reihenfolge, gleiche Art von
 * Rechercheauftrag. Wenn sich die Konvention ändert, wird sie hier
 * einmal geändert und nicht 120-mal nachgezogen.
 *
 * WICHTIG: Der Generator überschreibt bestehende Dateien NICHT.
 * Sobald an einer Seite recherchiert wurde, bleibt sie unangetastet.
 * Mit --force lässt sich das übergehen; das ist nur für den Aufbau
 * des Gerüsts gedacht.
 *
 * Aufruf:  node scripts/generate-stubs.mjs [--force] [--dry]
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ueberblick, religion } from './plan/01-ueberblick-religion.mjs';
import { gesellschaft, heiligeOrte } from './plan/02-gesellschaft-orte.mjs';
import { feste as festeArtikel, sprache, geschichte } from './plan/03-feste-sprache-geschichte.mjs';
import { genozid, gegenwart } from './plan/04-genozid-gegenwart.mjs';
import {
  kultur,
  wissenschaft,
  vermittlung,
  meta,
} from './plan/05-kultur-wissenschaft-vermittlung-meta.mjs';
import {
  feste as festeCollection,
  missverstaendnisse,
  glossar,
  personen,
  orte,
  rezepte,
  unterricht,
} from './plan/06-weitere-collections.mjs';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const inhalt = join(wurzel, 'src', 'content');

const force = process.argv.includes('--force');
const dry = process.argv.includes('--dry');
const STAND = '2026-07-26';

let geschrieben = 0;
let uebersprungen = 0;

/* ------------------------------------------------------------------ */
/* Hilfen                                                              */
/* ------------------------------------------------------------------ */

/** YAML-sicherer String. Immer in doppelten Anführungszeichen. */
function y(wert) {
  if (wert === null || wert === undefined) return 'null';
  return JSON.stringify(String(wert));
}

/** YAML-Liste aus Strings; leere Liste als `[]`. */
function yListe(werte, einrueckung = '  ') {
  if (!werte || werte.length === 0) return '[]';
  return '\n' + werte.map((w) => `${einrueckung}- ${y(w)}`).join('\n');
}

async function schreibe(pfad, text) {
  if (existsSync(pfad) && !force) {
    uebersprungen += 1;
    return;
  }
  if (dry) {
    console.info(`[dry] ${pfad.replace(wurzel + '/', '')}`);
    geschrieben += 1;
    return;
  }
  await mkdir(dirname(pfad), { recursive: true });
  await writeFile(pfad, text, 'utf8');
  geschrieben += 1;
}

/**
 * Baut den Rumpf einer Gerüstseite: echte Zwischenüberschriften plus
 * je Abschnitt eine sichtbare Beleglücke mit konkretem Auftrag.
 *
 * Bewusst KEIN Fülltext: Was hier steht, ist entweder eine Überschrift
 * oder ein Rechercheauftrag. Es entsteht nichts, was für Inhalt
 * gehalten werden könnte.
 */
function rumpf(gliederung, extra = '') {
  const teile = [];
  for (const [h2, h3s, auftrag] of gliederung) {
    teile.push(`## ${h2}`);
    teile.push('');
    if (auftrag) {
      teile.push(`<Belegluecke auftrag=${y(auftrag)} />`);
      teile.push('');
    }
    for (const h3 of h3s ?? []) {
      teile.push(`### ${h3}`);
      teile.push('');
      teile.push(
        `<Belegluecke auftrag=${y(`Unterpunkt „${h3}“: Inhalt erarbeiten und belegen.`)} inline />`,
      );
      teile.push('');
    }
  }
  if (extra) {
    teile.push(extra);
    teile.push('');
  }
  return teile.join('\n');
}

/* ------------------------------------------------------------------ */
/* Artikel                                                             */
/* ------------------------------------------------------------------ */

async function artikel(eintrag) {
  const {
    s,
    slug,
    t,
    o = 100,
    lead,
    tags = [],
    p = 'gemischt',
    cw = false,
    conf = 'unklar',
    g = [],
    w = [],
    auftrag,
    gl = [],
    q = [],
  } = eintrag;

  const frontmatter = [
    '---',
    `title: ${y(t)}`,
    `slug: ${y(slug)}`,
    `lead: >-\n  ${lead.replace(/\n/g, ' ')}`,
    `section: ${s}`,
    `order: ${o}`,
    `tags: ${yListe(tags)}`,
    `lang: "de"`,
    `status: "stub"`,
    `confidence: ${y(conf)}`,
    `perspektive: ${y(p)}`,
    `contentWarning: ${cw}`,
    `sources: []`,
    `relatedGlossary: ${yListe(g)}`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions: ${yListe(q)}`,
    `gliederung: ${yListe(gl.map(([h2]) => h2))}`,
    auftrag ? `rechercheauftrag: >-\n  ${auftrag.replace(/\n/g, ' ')}` : null,
    `weiterfuehrend: ${yListe(w)}`,
    `bilder: []`,
    `draft: false`,
    '---',
    '',
  ]
    .filter((z) => z !== null)
    .join('\n');

  await schreibe(join(inhalt, 'articles', 'de', s, `${slug}.mdx`), frontmatter + rumpf(gl));
}

/* ------------------------------------------------------------------ */
/* Feste                                                               */
/* ------------------------------------------------------------------ */

async function fest(e) {
  const frontmatter = [
    '---',
    `title: ${y(e.t)}`,
    `slug: ${y(e.slug)}`,
    `lead: >-\n  ${e.lead}`,
    `nameKurmanci: ${y(e.ku)}`,
    `nameDeutsch: ${e.de ? y(e.de) : 'null'}`,
    `nameVarianten: ${yListe(e.varianten)}`,
    `kalendersystem: ${y(e.system)}`,
    `monatGregorianisch: ${e.monat ?? 'null'}`,
    `dauerTage: null`,
    `beweglich: true`,
    `ort: []`,
    `order: ${e.o}`,
    `tags: ${yListe(['fest', 'kalender'])}`,
    `lang: "de"`,
    `status: "stub"`,
    `confidence: "unklar"`,
    `contentWarning: false`,
    `sources: []`,
    `relatedGlossary: ${yListe(e.slug === 'sere-sal-carsema-sor' ? ['sere-sal'] : [])}`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions: ${yListe(e.q)}`,
    `gliederung: ${yListe(e.gl.map(([h2]) => h2))}`,
    `rechercheauftrag: >-\n  Terminregel, Ablauf und Verbreitung belegen. Kein festes gregorianisches Datum ohne Fachquelle; die Monatszuordnung im Kalender gilt bis dahin als ungeprüft.`,
    `bilder: []`,
    `draft: false`,
    '---',
    '',
  ].join('\n');

  await schreibe(join(inhalt, 'festivals', 'de', `${e.slug}.mdx`), frontmatter + rumpf(e.gl));
}

/* ------------------------------------------------------------------ */
/* Missverständnisse                                                   */
/* ------------------------------------------------------------------ */

async function missverstaendnis(e) {
  const frontmatter = [
    '---',
    `title: ${y(e.t)}`,
    `slug: ${y(e.slug)}`,
    `lead: >-\n  ${e.lead}`,
    `behauptung: >-\n  ${e.behauptung}`,
    `faktenlage: ""`,
    `hintergrund: ""`,
    `verbreitung: ${y(e.verbreitung)}`,
    `order: ${e.o}`,
    `tags: ${yListe(['missverständnis', 'richtigstellung'])}`,
    `lang: "de"`,
    `status: "stub"`,
    `confidence: "unklar"`,
    `contentWarning: ${e.cw ?? false}`,
    `sources: []`,
    `relatedGlossary: ${yListe(e.g)}`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions: ${yListe(e.q)}`,
    `gliederung: ${yListe(e.gl.map(([h2]) => h2))}`,
    `rechercheauftrag: >-\n  ${e.auftrag}`,
    `weiterfuehrend: ${yListe(e.w)}`,
    `bilder: []`,
    `draft: false`,
    '---',
    '',
  ].join('\n');

  await schreibe(join(inhalt, 'misconceptions', 'de', `${e.slug}.mdx`), frontmatter + rumpf(e.gl));
}

/* ------------------------------------------------------------------ */
/* Glossar                                                             */
/* ------------------------------------------------------------------ */

const kategorieTexte = {
  religion: 'Religion und Glaube',
  gesellschaft: 'Gesellschaftsordnung',
  orte: 'Heilige Orte und Regionen',
  feste: 'Feste und Riten',
  sprache: 'Sprache und Namen',
  geschichte: 'Geschichte',
  recht: 'Recht und Völkerrecht',
};

async function glossareintrag([slug, titel, kurmanci, kategorie, varianten]) {
  /*
    Die Kurzdefinition eines Gerüsteintrags nennt bewusst nur den
    Themenbereich, in dem der Begriff im Portal geführt wird, und sagt
    ausdrücklich, dass die Definition noch fehlt. Eine inhaltliche
    Kurzdefinition wäre an dieser Stelle eine unbelegte Behauptung.
  */
  const kurz = `Begriff aus dem Bereich ${kategorieTexte[kategorie]}; die Definition ist noch nicht belegt.`;

  const frontmatter = [
    '---',
    `title: ${y(titel)}`,
    `slug: ${y(slug)}`,
    kurmanci ? `kurmanci: ${y(kurmanci)}` : null,
    `varianten: ${yListe(varianten)}`,
    `aussprache: null`,
    `audio: null`,
    `kurzdefinition: ${y(kurz)}`,
    `kategorie: ${kategorie}`,
    `siehe: []`,
    `lang: "de"`,
    `status: "stub"`,
    `confidence: "unklar"`,
    `contentWarning: false`,
    `sources: []`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions:`,
    `  - "Definition mit Fachquelle belegen."`,
    `  - "Aussprachehilfe in der Portal-Umschrift ergänzen und prüfen lassen."`,
    varianten.length > 0
      ? `  - "Prüfen, in welchen Zusammenhängen die genannten Varianten üblich sind."`
      : null,
    `tags: []`,
    `draft: false`,
    '---',
    '',
    `<Belegluecke auftrag="Definition dieses Begriffs erarbeiten und mit einer Fachquelle belegen. Emische und etische Beschreibung trennen, falls sie auseinandergehen." />`,
    '',
  ]
    .filter((z) => z !== null)
    .join('\n');

  await schreibe(join(inhalt, 'glossary', 'de', `${slug}.mdx`), frontmatter);
}

/* ------------------------------------------------------------------ */
/* Personen, Orte, Rezepte, Unterricht                                 */
/* ------------------------------------------------------------------ */

async function person(e) {
  const gl = [
    ['Leben', [], 'Lebensdaten und Stationen ausschließlich aus belegten, öffentlich zugänglichen Quellen.'],
    ['Wirken', [], 'Öffentlich relevantes Wirken belegen. Keine Privatdetails, keine sinngemäßen Zitate.'],
    ['Rezeption', [], 'Einordnung in Forschung oder Öffentlichkeit belegen.'],
  ];

  const frontmatter = [
    '---',
    `title: ${y(e.t)}`,
    `slug: ${y(e.slug)}`,
    `lead: >-\n  ${e.lead}`,
    `nameUmschrift: ${y(e.umschrift)}`,
    `nameVarianten: ${yListe(e.varianten)}`,
    `rolle: ${y(e.rolle)}`,
    `kategorie: ${y(e.kategorie)}`,
    `geboren: null`,
    `gestorben: null`,
    `lebend: ${e.lebend}`,
    `wirkungsort: []`,
    `tags: []`,
    `lang: "de"`,
    `status: "stub"`,
    `confidence: "unklar"`,
    `contentWarning: false`,
    `sources: []`,
    `relatedGlossary: []`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions: ${yListe(e.q)}`,
    `bilder: []`,
    `draft: false`,
    '---',
    '',
  ].join('\n');

  await schreibe(join(inhalt, 'persons', 'de', `${e.slug}.mdx`), frontmatter + rumpf(gl));
}

async function ort(e) {
  const frontmatter = [
    '---',
    `title: ${y(e.t)}`,
    `slug: ${y(e.slug)}`,
    `lead: >-\n  ${e.lead}`,
    `nameUmschrift: ${y(e.umschrift)}`,
    `nameVarianten: ${yListe(e.varianten)}`,
    `art: ${y(e.art)}`,
    `land: ${y(e.land)}`,
    e.region ? `region: ${y(e.region)}` : null,
    `koordinaten: [${e.koord[0]}, ${e.koord[1]}]`,
    `koordinatenGenauigkeit: "ungefähr"`,
    `zustand: "unbekannt"`,
    `kartenebene: ${yListe(e.ebenen)}`,
    `tags: []`,
    `lang: "de"`,
    `status: "stub"`,
    `confidence: "unklar"`,
    `contentWarning: false`,
    `sources: []`,
    `relatedGlossary: []`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions:`,
    `  - "Koordinaten gegen einen amtlichen oder wissenschaftlichen Geodatensatz prüfen und die Genauigkeit anpassen."`,
    `  - "Erhaltungszustand mit Stand-Datum belegen."`,
    `bilder: []`,
    `draft: false`,
    '---',
    '',
  ]
    .filter((z) => z !== null)
    .join('\n');

  const gl = [
    ['Lage', [], 'Lage und Verwaltungszugehörigkeit belegen; Koordinaten prüfen.'],
    ['Bedeutung', [], 'Bedeutung des Ortes belegen; auf die inhaltlichen Seiten verweisen.'],
    ['Zustand', [], 'Erhaltungszustand mit Quelle und Stand-Datum belegen.'],
  ];

  await schreibe(join(inhalt, 'places', 'de', `${e.slug}.mdx`), frontmatter + rumpf(gl));
}

async function rezept(e) {
  const frontmatter = [
    '---',
    `title: ${y(e.t)}`,
    `slug: ${y(e.slug)}`,
    `lead: >-\n  ${e.lead}`,
    `anlass: []`,
    `region: []`,
    `zutaten: []`,
    `schritte: []`,
    `tags: ${yListe(['küche'])}`,
    `lang: "de"`,
    `status: "stub"`,
    `confidence: "unklar"`,
    `contentWarning: false`,
    `sources: []`,
    `relatedGlossary: []`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions: ${yListe(e.q)}`,
    `bilder: []`,
    `draft: false`,
    '---',
    '',
    `<Belegluecke auftrag="Rezept aus einer publizierten Sammlung, einer Vereinspublikation oder einem dokumentierten Interview übernehmen. Herkunft, Region und Anlass angeben. Keine Rekonstruktion aus dem Gedächtnis." />`,
    '',
  ].join('\n');

  await schreibe(join(inhalt, 'recipes', 'de', `${e.slug}.mdx`), frontmatter);
}

async function material(e) {
  const gl = [
    ['Lernziele', [], 'Lernziele nach fachlicher Prüfung festlegen.'],
    ['Material', [], 'Material erarbeiten, sobald die Bezugsseiten belegt sind.'],
    ['Hinweise für Lehrkräfte', [], 'Didaktische Hinweise erarbeiten, für belastende Themen mit Fachberatung.'],
  ];

  const frontmatter = [
    '---',
    `title: ${y(e.t)}`,
    `slug: ${y(e.slug)}`,
    `lead: >-\n  ${e.lead}`,
    `stufe: ${yListe(e.stufe)}`,
    `fach: ${yListe(e.fach)}`,
    `umfang: ${y(e.umfang)}`,
    `lernziele: ${yListe(e.lernziele)}`,
    `bezug: ${yListe(e.bezug)}`,
    `materialtyp: ${y(e.typ)}`,
    `order: ${e.o}`,
    `tags: ${yListe(['unterricht'])}`,
    `lang: "de"`,
    `status: "stub"`,
    `confidence: "unklar"`,
    `contentWarning: ${e.cw ?? false}`,
    `sources: []`,
    `relatedGlossary: []`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions: ${yListe(e.q)}`,
    `gliederung: ${yListe(gl.map(([h2]) => h2))}`,
    `bilder: []`,
    `draft: false`,
    '---',
    '',
  ].join('\n');

  await schreibe(join(inhalt, 'teaching', 'de', `${e.slug}.mdx`), frontmatter + rumpf(gl));
}

/* ------------------------------------------------------------------ */
/* Englische Stubs                                                     */
/* ------------------------------------------------------------------ */

/**
 * Für Englisch werden nur die Bereichs-Einstiege angelegt – als
 * ehrlicher Hinweis, dass die Übersetzung noch aussteht. Recherche-
 * Regel 9: Übersetzt wird erst, wenn die deutsche Fassung belegt ist.
 */
async function englischerStub(sectionId, titel) {
  const frontmatter = [
    '---',
    `title: ${y(titel)}`,
    `slug: ${y('overview')}`,
    `lead: >-\n  This section has not been translated yet. The German version is the reference text; translations are only produced once the German page has reached the status "belegt" (sourced). Until then, please refer to the German pages.`,
    `section: ${sectionId}`,
    `order: 1`,
    `tags: []`,
    `lang: "en"`,
    `status: "stub"`,
    `confidence: "unklar"`,
    `perspektive: "gemischt"`,
    `contentWarning: false`,
    `sources: []`,
    `relatedGlossary: []`,
    `updated: ${STAND}`,
    `reviewedBy: null`,
    `openQuestions:`,
    `  - "Translate once the German source page is marked as 'belegt'."`,
    `gliederung: []`,
    `weiterfuehrend: []`,
    `bilder: []`,
    `draft: false`,
    '---',
    '',
    `<Belegluecke auftrag="English translation pending. Do not translate before the German page is sourced (status 'belegt')." />`,
    '',
  ].join('\n');

  await schreibe(join(inhalt, 'articles', 'en', sectionId, 'overview.mdx'), frontmatter);
}

/* ------------------------------------------------------------------ */
/* Lauf                                                                */
/* ------------------------------------------------------------------ */

const alleArtikel = [
  ...ueberblick,
  ...religion,
  ...gesellschaft,
  ...heiligeOrte,
  ...festeArtikel,
  ...sprache,
  ...geschichte,
  ...genozid,
  ...gegenwart,
  ...kultur,
  ...wissenschaft,
  ...vermittlung,
  ...meta,
];

for (const e of alleArtikel) await artikel(e);
for (const e of festeCollection) await fest(e);
for (const e of missverstaendnisse) await missverstaendnis(e);
for (const e of glossar) await glossareintrag(e);
for (const e of personen) await person(e);
for (const e of orte) await ort(e);
for (const e of rezepte) await rezept(e);
for (const e of unterricht) await material(e);

// Englische Bereichs-Stubs für die drei Einstiegsbereiche.
await englischerStub('ueberblick', 'Overview');
await englischerStub('religion', 'Religion and belief');
await englischerStub('genozid', 'The 2014 genocide and persecution');

// Kurze Bilanz für die Konsole.
const zusammenfassung = {
  Artikel: alleArtikel.length,
  Feste: festeCollection.length,
  'Missverständnisse': missverstaendnisse.length,
  Glossar: glossar.length,
  Personen: personen.length,
  Orte: orte.length,
  Rezepte: rezepte.length,
  Unterricht: unterricht.length,
};

console.info('\nGerüst erzeugt:');
for (const [k, v] of Object.entries(zusammenfassung)) {
  console.info(`  ${k.padEnd(18)} ${String(v).padStart(4)}`);
}
console.info(`\n  neu geschrieben    ${String(geschrieben).padStart(4)}`);
console.info(`  übersprungen       ${String(uebersprungen).padStart(4)} (bereits vorhanden)`);
if (uebersprungen > 0 && !force) {
  console.info('\n  Mit --force werden vorhandene Dateien überschrieben.');
}

// `readFile` wird bewusst importiert, damit spätere Erweiterungen
// (Zusammenführen mit bestehenden Dateien) hier ansetzen können.
void readFile;
