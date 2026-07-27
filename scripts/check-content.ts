#!/usr/bin/env tsx
/**
 * BUILD-GATE für Inhalte.
 *
 * Bricht ab bei:
 *   1. fehlenden Pflichtfeldern
 *   2. `status` != 'stub' ohne Quelle
 *   3. <Cite id="…"> mit unbekannter Quellen-ID
 *   4. <Cite id="…">, das nicht im Frontmatter angemeldet ist
 *   5. Glossarbegriffen (relatedGlossary, <Begriff>) ohne Eintrag
 *   6. kaputten internen Links
 *   7. Slug/Dateiname- oder Sprach-/Ordner-Abweichungen
 *   8. Bildern ohne Alt-Text, Urheber, Lizenz oder Quelle
 *   9. Quellen mit URL ohne Abrufdatum
 *  10. ungeprüften Quellen, die nicht als `unklar` markiert sind
 *  11. <Cite> auf Quellen, deren Volltext nicht geprüft ist
 *  12. Inline-Komponenten am Zeilenanfang (zerrissene Absätze)
 *
 * Aufruf: npm run check:content
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  INHALT,
  MDX_COLLECTIONS,
  interneLinks,
  leseDatensammlung,
  leseDokumente,
  werteRumpfAus,
  type Dokument,
} from './lib/inhalt-lesen.ts';
import { sections, toolPages } from '../src/lib/sections.ts';

const fehler: string[] = [];
const warnungen: string[] = [];

function fehle(pfad: string, text: string) {
  fehler.push(`${pfad}\n    ${text}`);
}

function warne(pfad: string, text: string) {
  warnungen.push(`${pfad}\n    ${text}`);
}

/* ------------------------------------------------------------------ */
/* Daten einlesen                                                      */
/* ------------------------------------------------------------------ */

const dokumente: Dokument[] = [];
for (const collection of MDX_COLLECTIONS) {
  dokumente.push(...(await leseDokumente(collection)));
}

const quellen = await leseDatensammlung('sources', 'sources.yaml');
const ereignisse = await leseDatensammlung('events', 'events.yaml');
const faq = await leseDatensammlung('faq', 'faq.yaml');
const medien = await leseDatensammlung('media', 'media.yaml');

const quellenIds = new Set(quellen.eintraege.map((q) => String(q['id'])));

/**
 * Quellen, deren Volltext der Redaktion nachweislich vorlag. Nur sie
 * dürfen belegen. Titel, die bloß aus einem Katalog bekannt sind, stehen
 * im Verzeichnis als Literaturhinweis – aber nie unter einer Belegziffer.
 */
const volltextIds = new Set(
  quellen.eintraege.filter((q) => q['volltextGeprueft'] === true).map((q) => String(q['id'])),
);
const glossarSlugs = new Set(
  dokumente.filter((d) => d.collection === 'glossary').map((d) => String(d.frontmatter['slug'])),
);

/** Alle gültigen internen Zielpfade ohne Sprachpräfix. */
const zielPfade = new Set<string>();
for (const s of sections) zielPfade.add(s.slug);
for (const p of toolPages) zielPfade.add(p.slug);
for (const d of dokumente) {
  const slug = String(d.frontmatter['slug'] ?? '');
  switch (d.collection) {
    case 'articles':
      zielPfade.add(`${String(d.frontmatter['section'])}/${slug}`);
      break;
    case 'festivals':
      zielPfade.add(`feste/${slug}`);
      break;
    case 'misconceptions':
      zielPfade.add(`missverstaendnisse/${slug}`);
      break;
    case 'persons':
      zielPfade.add(`personen/${slug}`);
      break;
    case 'places':
      zielPfade.add(`orte/${slug}`);
      break;
    case 'recipes':
      zielPfade.add(`rezepte/${slug}`);
      break;
    case 'teaching':
      zielPfade.add(`unterricht/${slug}`);
      break;
    case 'glossary':
      zielPfade.add(`glossar/${slug}`);
      break;
    default:
      break;
  }
}

/* ------------------------------------------------------------------ */
/* 1–8: Dokumentprüfungen                                              */
/* ------------------------------------------------------------------ */

const PFLICHT_ALLE = ['title', 'slug', 'lang', 'status', 'updated'];
const PFLICHT_MIT_LEAD = ['lead', 'confidence', 'sources', 'openQuestions', 'reviewedBy'];

for (const d of dokumente) {
  const f = d.frontmatter;
  const slug = String(f['slug'] ?? '');

  for (const feld of PFLICHT_ALLE) {
    if (f[feld] === undefined) fehle(d.pfad, `Pflichtfeld fehlt: ${feld}`);
  }
  if (d.collection !== 'glossary') {
    for (const feld of PFLICHT_MIT_LEAD) {
      if (f[feld] === undefined) fehle(d.pfad, `Pflichtfeld fehlt: ${feld}`);
    }
  }

  // 7. Slug und Sprache müssen zum Dateipfad passen.
  const teile = d.pfad.split('/');
  const dateiname = (teile.at(-1) ?? '').replace(/\.mdx?$/, '');
  if (slug && dateiname !== slug) {
    fehle(d.pfad, `slug "${slug}" passt nicht zum Dateinamen "${dateiname}".`);
  }
  const sprachOrdner = teile[3];
  if (sprachOrdner && ['de', 'en', 'ku', 'ar'].includes(sprachOrdner)) {
    if (String(f['lang']) !== sprachOrdner) {
      fehle(d.pfad, `lang: "${String(f['lang'])}" widerspricht dem Ordner "${sprachOrdner}".`);
    }
  }

  // Artikel müssen in dem Ordner liegen, der ihrem Bereich entspricht.
  if (d.collection === 'articles') {
    const bereichOrdner = teile[4];
    if (bereichOrdner && String(f['section']) !== bereichOrdner) {
      fehle(
        d.pfad,
        `section: "${String(f['section'])}" widerspricht dem Ordner "${bereichOrdner}".`,
      );
    }
  }

  const refs = Array.isArray(f['sources'])
    ? (f['sources'] as { id?: string }[]).map((r) => String(r?.id ?? ''))
    : [];
  const status = String(f['status'] ?? 'stub');

  // 2. Belegpflicht ab Entwurf.
  if (status !== 'stub' && refs.length === 0) {
    fehle(
      d.pfad,
      `status: "${status}" ohne Quelle. Beleg nachtragen oder auf "stub" zurücksetzen.`,
    );
  }

  // 3./4. Zitate prüfen.
  const kennzahlen = werteRumpfAus(d.rumpf);
  for (const id of kennzahlen.zitate) {
    if (!quellenIds.has(id)) {
      fehle(d.pfad, `<Cite id="${id}"> verweist auf eine Quelle, die es nicht gibt.`);
    } else if (!refs.includes(id)) {
      fehle(
        d.pfad,
        `<Cite id="${id}"> ist nicht im Frontmatter unter "sources" angemeldet – ohne Anmeldung bekommt der Beleg keine Ziffer.`,
      );
    } else if (!volltextIds.has(id)) {
      fehle(
        d.pfad,
        `<Cite id="${id}"> belegt mit einer Quelle, deren Volltext nicht geprüft ist (volltextGeprueft: false). Erst lesen, dann belegen.`,
      );
    }
  }
  for (const id of refs) {
    if (!quellenIds.has(id)) {
      fehle(d.pfad, `sources enthält die unbekannte Quellen-ID "${id}".`);
    } else if (status !== 'stub' && !kennzahlen.zitate.includes(id)) {
      warne(d.pfad, `Quelle "${id}" steht im Frontmatter, wird im Text aber nirgends zitiert.`);
    }
  }

  /*
    Inline-Komponenten dürfen nie am Zeilenanfang stehen. MDX behandelt ein
    JSX-Element in dieser Stellung als Block; Prettier setzt dann eine
    Leerzeile davor, und aus einem Absatz werden drei. Sichtbar wird das erst
    im gebauten HTML – deshalb prüft der Build es hier.
  */
  for (const [nr, zeile] of d.rumpf.split('\n').entries()) {
    const treffer = /^\s*<(Cite|Begriff|KurmanciBegriff)\b/.exec(zeile);
    if (treffer) {
      fehle(
        d.pfad,
        `Zeile ${nr + 1}: <${treffer[1]}> beginnt die Zeile. Inline-Komponenten an die vorige Zeile anhängen – sonst rutscht der Beleg aus dem Absatz heraus oder es entsteht eine Lücke vor der Ziffer.`,
      );
    }
    /*
      Die Gegenprobe: Eine Überschrift darf keine Inline-Komponente
      enthalten. Genau das entsteht, wenn ein Reparaturlauf eine Zeile
      unbesehen an die vorherige hängt – die Überschrift verschluckt dann
      den nächsten Absatz.
    */
    const ueberschrift = /^#{1,6}\s.*<(Cite|Begriff|KurmanciBegriff|Unsicher)\b/.exec(zeile);
    if (ueberschrift) {
      fehle(
        d.pfad,
        `Zeile ${nr + 1}: Die Überschrift enthält <${ueberschrift[1]}>. Überschriften bestehen nur aus Text; der Absatz gehört in die nächste Zeile.`,
      );
    }
  }

  // 5. Glossarbezüge.
  const bezugsBegriffe = [
    ...(Array.isArray(f['relatedGlossary']) ? (f['relatedGlossary'] as string[]) : []),
    ...kennzahlen.begriffe,
  ];
  for (const begriff of bezugsBegriffe) {
    if (!glossarSlugs.has(begriff)) {
      fehle(d.pfad, `Glossarbegriff "${begriff}" hat keinen Eintrag in src/content/glossary.`);
    }
  }

  // 6. Interne Querverweise.
  const verweisFelder = ['weiterfuehrend', 'bezug'];
  for (const feld of verweisFelder) {
    const werte = Array.isArray(f[feld]) ? (f[feld] as string[]) : [];
    for (const ziel of werte) {
      if (!zielPfade.has(ziel)) {
        fehle(d.pfad, `${feld}: "${ziel}" zeigt auf eine Seite, die es nicht gibt.`);
      }
    }
  }

  // Links im Fließtext.
  for (const link of interneLinks(d.rumpf)) {
    const ohneAnker = (link.split('#')[0] ?? '').replace(/\/$/, '');
    const ohneSprache = ohneAnker.replace(/^\/(de|en|ku|ar)\//, '');
    if (ohneSprache && !zielPfade.has(ohneSprache) && !ohneAnker.startsWith('/fonts')) {
      fehle(d.pfad, `Interner Link "${link}" führt ins Leere.`);
    }
  }

  // 8. Bildnachweise.
  const bilder = Array.isArray(f['bilder']) ? (f['bilder'] as Record<string, unknown>[]) : [];
  for (const bild of bilder) {
    for (const pflicht of ['datei', 'alt', 'urheber', 'lizenz', 'quelle']) {
      if (!bild[pflicht]) {
        fehle(d.pfad, `Bild "${String(bild['datei'] ?? '?')}": Pflichtangabe "${pflicht}" fehlt.`);
      }
    }
    if (typeof bild['alt'] === 'string' && bild['alt'].trim().length < 5) {
      fehle(d.pfad, `Bild "${String(bild['datei'])}": Alt-Text ist zu kurz.`);
    }
    const datei = String(bild['datei'] ?? '');
    if (datei && !existsSync(join(INHALT, '..', '..', 'public', 'img', datei))) {
      warne(d.pfad, `Bilddatei "public/img/${datei}" liegt nicht vor.`);
    }
  }

  // Leitplanke 10.13: lebende Personen brauchen den Hinweis.
  if (d.collection === 'persons' && f['lebend'] === true && status !== 'stub') {
    const fragen = Array.isArray(f['openQuestions']) ? (f['openQuestions'] as string[]) : [];
    if (!fragen.some((q) => q.toLowerCase().includes('lebende person'))) {
      warne(
        d.pfad,
        'Lebende Person ohne ausdrücklichen Prüfhinweis in openQuestions. Zurückhaltung dokumentieren.',
      );
    }
  }
}

/* ------------------------------------------------------------------ */
/* 9./10.: Quellenverzeichnis                                          */
/* ------------------------------------------------------------------ */

const gesehenIds = new Set<string>();
for (const q of quellen.eintraege) {
  const id = String(q['id'] ?? '');
  if (!id) {
    fehle(quellen.pfad, 'Quelle ohne id.');
    continue;
  }
  if (gesehenIds.has(id)) fehle(quellen.pfad, `Doppelte Quellen-ID: "${id}".`);
  gesehenIds.add(id);

  for (const pflicht of ['type', 'title', 'language', 'reliability']) {
    if (q[pflicht] === undefined) fehle(quellen.pfad, `Quelle "${id}": Feld "${pflicht}" fehlt.`);
  }
  if (q['url'] && !q['accessed']) {
    fehle(quellen.pfad, `Quelle "${id}": Webquelle ohne Abrufdatum (accessed).`);
  }
  if (q['verifiziert'] !== true && q['reliability'] !== 'unklar') {
    fehle(
      quellen.pfad,
      `Quelle "${id}": nicht am Original geprüft, muss deshalb reliability: "unklar" tragen.`,
    );
  }
  if (q['volltextGeprueft'] === true && q['verifiziert'] !== true) {
    fehle(
      quellen.pfad,
      `Quelle "${id}": volltextGeprueft ohne verifiziert ist widersprüchlich – wer den Volltext hatte, kennt auch die bibliografischen Angaben.`,
    );
  }
}

/* ------------------------------------------------------------------ */
/* Datensammlungen: Verweise                                           */
/* ------------------------------------------------------------------ */

for (const e of ereignisse.eintraege) {
  const ziel = e['artikel'];
  if (typeof ziel === 'string' && ziel && !zielPfade.has(ziel)) {
    fehle(ereignisse.pfad, `Ereignis "${String(e['id'])}": Artikel "${ziel}" gibt es nicht.`);
  }
  const refs = Array.isArray(e['sources']) ? (e['sources'] as { id?: string }[]) : [];
  for (const r of refs) {
    if (!quellenIds.has(String(r?.id))) {
      fehle(
        ereignisse.pfad,
        `Ereignis "${String(e['id'])}": unbekannte Quelle "${String(r?.id)}".`,
      );
    }
  }
}

for (const f of faq.eintraege) {
  const status = String(f['status'] ?? 'stub');
  const refs = Array.isArray(f['sources']) ? (f['sources'] as { id?: string }[]) : [];
  if (status !== 'stub' && refs.length === 0) {
    fehle(faq.pfad, `Frage "${String(f['id'])}": status "${status}" ohne Quelle.`);
  }
  if (status !== 'stub' && !String(f['antwort'] ?? '').trim()) {
    fehle(faq.pfad, `Frage "${String(f['id'])}": status "${status}" ohne Antworttext.`);
  }
  for (const ziel of (f['weiterfuehrend'] as string[] | undefined) ?? []) {
    if (!zielPfade.has(ziel)) {
      fehle(faq.pfad, `Frage "${String(f['id'])}": weiterfuehrend "${ziel}" gibt es nicht.`);
    }
  }
}

for (const m of medien.eintraege) {
  if (m['rechteGeklaert'] === true && !m['url']) {
    fehle(medien.pfad, `Medium "${String(m['id'])}": Rechteklärung ohne Fundstelle.`);
  }
}

/* ------------------------------------------------------------------ */
/* Bereichsabdeckung: keine Sektion darf leer bleiben                  */
/* ------------------------------------------------------------------ */

for (const s of sections) {
  const anzahl = dokumente.filter((d) => {
    if (d.collection === 'articles') return String(d.frontmatter['section']) === s.id;
    if (d.collection === 'festivals') return s.id === 'feste';
    if (d.collection === 'misconceptions') return s.id === 'missverstaendnisse';
    if (d.collection === 'persons') return s.id === 'personen';
    return false;
  }).length;
  if (anzahl === 0) {
    fehle('src/lib/sections.ts', `Bereich "${s.id}" hat keine einzige Seite.`);
  }
}

/* ------------------------------------------------------------------ */
/* Ausgabe                                                             */
/* ------------------------------------------------------------------ */

const anzahlDokumente = dokumente.length + faq.eintraege.length + ereignisse.eintraege.length;

console.info('');
console.info(`Geprüft: ${anzahlDokumente} Einträge, ${quellen.eintraege.length} Quellen.`);

if (warnungen.length > 0) {
  console.info(`\n${warnungen.length} Hinweis(e):`);
  for (const w of warnungen) console.info(`  • ${w}`);
}

if (fehler.length > 0) {
  console.error(`\n${fehler.length} Fehler:`);
  for (const f of fehler) console.error(`  ✗ ${f}`);
  console.error('\ncheck:content fehlgeschlagen.\n');
  process.exit(1);
}

console.info('\ncheck:content bestanden.\n');
