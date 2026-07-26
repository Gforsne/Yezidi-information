#!/usr/bin/env tsx
/**
 * Erzeugt `content-report.md` und `RESEARCH-BRIEF.md`.
 *
 * Der Content-Report beantwortet eine Frage: Wie viel von diesem Portal
 * ist tatsächlich belegt? Er zählt Abschnitte, Belegstellen und
 * markierte Beleglücken und weist die Quote je Bereich aus.
 *
 * Der Research-Brief sammelt jede offene Recherchefrage mit
 * Seitenzuordnung – gruppiert nach Bereich, plus ein eigener Abschnitt
 * „Zwingend zu klären“ für Fragen, bei denen eine falsche Annahme
 * Schaden anrichten würde.
 *
 * Aufruf: npm run report:content
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  MDX_COLLECTIONS,
  WURZEL,
  leseDatensammlung,
  leseDokumente,
  werteRumpfAus,
  type Dokument,
} from './lib/inhalt-lesen.ts';
import { sections, type SectionId } from '../src/lib/sections.ts';

const STAND = new Date().toISOString().split('T')[0];

const dokumente: Dokument[] = [];
for (const collection of MDX_COLLECTIONS) {
  dokumente.push(...(await leseDokumente(collection)));
}

const quellen = await leseDatensammlung('sources', 'sources.yaml');
const faq = await leseDatensammlung('faq', 'faq.yaml');
const ereignisse = await leseDatensammlung('events', 'events.yaml');

/* ------------------------------------------------------------------ */
/* Auswertung                                                          */
/* ------------------------------------------------------------------ */

interface Zeile {
  pfad: string;
  collection: string;
  bereich: SectionId | 'ohne';
  titel: string;
  status: string;
  confidence: string;
  abschnitte: number;
  zitate: number;
  belegluecken: number;
  quellen: number;
  fragen: string[];
  auftrag: string;
  contentWarning: boolean;
  lebendePerson: boolean;
}

function bereichVon(d: Dokument): SectionId | 'ohne' {
  switch (d.collection) {
    case 'articles':
      return String(d.frontmatter['section']) as SectionId;
    case 'festivals':
      return 'feste';
    case 'misconceptions':
      return 'missverstaendnisse';
    case 'persons':
      return 'personen';
    case 'places':
      return 'heilige-orte';
    case 'recipes':
      return 'kultur';
    case 'teaching':
      return 'vermittlung';
    case 'glossary':
      return 'vermittlung';
    default:
      return 'ohne';
  }
}

const zeilen: Zeile[] = dokumente
  .filter((d) => String(d.frontmatter['lang'] ?? 'de') === 'de')
  .map((d) => {
    const k = werteRumpfAus(d.rumpf);
    const refs = Array.isArray(d.frontmatter['sources'])
      ? (d.frontmatter['sources'] as unknown[]).length
      : 0;
    return {
      pfad: d.pfad,
      collection: d.collection,
      bereich: bereichVon(d),
      titel: String(d.frontmatter['title'] ?? d.pfad),
      status: String(d.frontmatter['status'] ?? 'stub'),
      confidence: String(d.frontmatter['confidence'] ?? 'unklar'),
      abschnitte: k.abschnitte,
      zitate: k.zitate.length,
      belegluecken: k.belegluecken,
      quellen: refs,
      fragen: Array.isArray(d.frontmatter['openQuestions'])
        ? (d.frontmatter['openQuestions'] as string[])
        : [],
      auftrag: String(d.frontmatter['rechercheauftrag'] ?? ''),
      contentWarning: d.frontmatter['contentWarning'] === true,
      lebendePerson: d.frontmatter['lebend'] === true,
    };
  });

const summe = (f: (z: Zeile) => number) => zeilen.reduce((a, z) => a + f(z), 0);

const gesamtAbschnitte = summe((z) => z.abschnitte);
const gesamtZitate = summe((z) => z.zitate);
const gesamtLuecken = summe((z) => z.belegluecken);

const nachStatus = (s: string) => zeilen.filter((z) => z.status === s).length;

/** Anteil der Abschnitte mit Beleg – grobe Kennzahl, keine Qualitätsaussage. */
function quote(abschnitte: number, zitate: number): number {
  if (abschnitte === 0) return 0;
  return Math.round((Math.min(abschnitte, zitate) / abschnitte) * 100);
}

/* ------------------------------------------------------------------ */
/* content-report.md                                                   */
/* ------------------------------------------------------------------ */

const bereichszeilen = sections.map((s) => {
  const eigene = zeilen.filter((z) => z.bereich === s.id);
  return {
    titel: s.title,
    seiten: eigene.length,
    abschnitte: eigene.reduce((a, z) => a + z.abschnitte, 0),
    zitate: eigene.reduce((a, z) => a + z.zitate, 0),
    luecken: eigene.reduce((a, z) => a + z.belegluecken, 0),
    fragen: eigene.reduce((a, z) => a + z.fragen.length, 0),
    belegt: eigene.filter((z) => z.status !== 'stub').length,
  };
});

const report = `# Content-Report

**Stand:** ${STAND}
**Erzeugt von:** \`npm run report:content\` – diese Datei wird automatisch geschrieben und sollte nicht von Hand bearbeitet werden.

## Kurzfassung

${gesamtZitate} von ${gesamtAbschnitte} Abschnitten tragen einen Beleg – **Belegquote ${quote(gesamtAbschnitte, gesamtZitate)} %**.
${gesamtLuecken} Stellen sind ausdrücklich als Beleglücke markiert.

Das ist der erwartete Stand: Das Gerüst steht, die Recherche hat noch nicht begonnen.
Eine Belegquote nahe null bedeutet hier **nicht**, dass unbelegte Behauptungen im Text stehen –
sondern dass an ihrer Stelle Rechercheaufträge stehen.

## Bearbeitungsstand

| Status | Bedeutung | Seiten |
|---|---|---:|
| \`stub\` | Gerüst: Gliederung und Rechercheauftrag stehen, Inhalt fehlt | ${nachStatus('stub')} |
| \`entwurf\` | Entwurfsfassung, noch nicht vollständig belegt | ${nachStatus('entwurf')} |
| \`belegt\` | Alle Aussagen mit Quellen belegt | ${nachStatus('belegt')} |
| \`geprüft\` | Belegt und zusätzlich gegengelesen | ${nachStatus('geprüft')} |
| **Summe** | | **${zeilen.length}** |

## Bereiche

| Bereich | Seiten | belegt | Abschnitte | Belegstellen | Beleglücken | offene Fragen | Quote |
|---|---:|---:|---:|---:|---:|---:|---:|
${bereichszeilen
  .map(
    (b) =>
      `| ${b.titel} | ${b.seiten} | ${b.belegt} | ${b.abschnitte} | ${b.zitate} | ${b.luecken} | ${b.fragen} | ${quote(b.abschnitte, b.zitate)} % |`,
  )
  .join('\n')}

## Weitere Sammlungen

| Sammlung | Einträge | Anmerkung |
|---|---:|---|
| Quellen | ${quellen.eintraege.length} | ${quellen.eintraege.filter((q) => q['verifiziert'] !== true).length} davon mit ungeprüften bibliografischen Angaben |
| Zeitleiste | ${ereignisse.eintraege.length} | ${ereignisse.eintraege.filter((e) => e['firman'] === true).length} als Firman-Erinnerung markiert |
| Häufige Fragen | ${faq.eintraege.length} | ${faq.eintraege.filter((f) => String(f['antwort'] ?? '').trim()).length} beantwortet |
| Glossar | ${zeilen.filter((z) => z.collection === 'glossary').length} | Begriffe |
| Personen | ${zeilen.filter((z) => z.collection === 'persons').length} | ${zeilen.filter((z) => z.lebendePerson).length} lebende Personen (erhöhte Zurückhaltung) |
| Orte | ${zeilen.filter((z) => z.collection === 'places').length} | Koordinaten durchgehend als „ungefähr“ gekennzeichnet |

## Seiten mit Inhaltshinweis

${zeilen.filter((z) => z.contentWarning).length} Seiten tragen einen Inhaltshinweis. Für sie gelten die
Redaktionsregeln aus Abschnitt 10 der Projektvorgabe: keine Gewaltdetails, keine identifizierbaren
Opferfotos, keine Täterpropaganda, keine Namen Überlebender ohne dokumentierte Selbstnennung.

## Seiten ohne einen einzigen Beleg

${zeilen.filter((z) => z.zitate === 0).length} von ${zeilen.length} Seiten enthalten noch keine Belegstelle.
Alle tragen \`status: stub\` und zeigen das im Belegapparat sichtbar an.
`;

await writeFile(join(WURZEL, 'content-report.md'), report, 'utf8');

/* ------------------------------------------------------------------ */
/* RESEARCH-BRIEF.md                                                   */
/* ------------------------------------------------------------------ */

/**
 * „Zwingend zu klären“ nach Abschnitt 14 der Projektvorgabe: Fragen, bei
 * denen eine falsche Annahme die Community verletzen oder Falsch-
 * information erzeugen würde. Erkannt an Themenfeldern, nicht geraten.
 */
const ZWINGEND_MUSTER = [
  /geistlichen? rat|meclisa/i,
  /überlebend|sexualisierte|zwangsehe/i,
  /selbstnennung|einwilligung/i,
  /veröffentlichung religiöser|autorisiert|angemessen/i,
  /schreibweise|bevorzugte/i,
  /opferzahl|zahlen zu|schätzung/i,
  /anerkennung|beschlusstext/i,
  /anbieter|verantwortung|hosting|rechtlich/i,
  /beratungsstellen|erreichbar/i,
];

const zwingend: { frage: string; seite: string; pfad: string }[] = [];
const nachBereich = new Map<SectionId | 'ohne', { frage: string; seite: string; pfad: string }[]>();

for (const z of zeilen) {
  for (const frage of z.fragen) {
    const eintrag = { frage, seite: z.titel, pfad: z.pfad };
    if (ZWINGEND_MUSTER.some((m) => m.test(frage))) zwingend.push(eintrag);
    const liste = nachBereich.get(z.bereich) ?? [];
    liste.push(eintrag);
    nachBereich.set(z.bereich, liste);
  }
}

for (const f of faq.eintraege) {
  const fragen = Array.isArray(f['openQuestions']) ? (f['openQuestions'] as string[]) : [];
  for (const frage of fragen) {
    const eintrag = {
      frage,
      seite: `FAQ: ${String(f['frage'])}`,
      pfad: 'src/content/faq/faq.yaml',
    };
    const bereich = String(f['thema']) as SectionId;
    const liste = nachBereich.get(bereich) ?? [];
    liste.push(eintrag);
    nachBereich.set(bereich, liste);
    if (ZWINGEND_MUSTER.some((m) => m.test(frage))) zwingend.push(eintrag);
  }
}

const gesamtFragen = [...nachBereich.values()].reduce((a, l) => a + l.length, 0);

const brief = `# Research-Brief

**Stand:** ${STAND}
**Erzeugt von:** \`npm run report:content\` – automatisch aus den \`openQuestions\` aller Inhalte.
Diese Datei nicht von Hand bearbeiten; Fragen gehören in das Frontmatter der jeweiligen Seite.

Insgesamt **${gesamtFragen} offene Recherchefragen** auf ${zeilen.length} Seiten.

---

## Zwingend zu klären

Diese Fragen betreffen Punkte, bei denen eine falsche Annahme die Gemeinschaft verletzen,
Persönlichkeitsrechte berühren oder Falschinformation erzeugen würde. Sie sind vor allen
anderen zu beantworten – notfalls durch Rückfrage bei Fachleuten oder bei
Vertretungen der Gemeinschaft, nicht durch eine Schätzung.

${
  zwingend.length === 0
    ? '_Keine._'
    : [...new Map(zwingend.map((z) => [z.frage, z])).values()]
        .map((z) => `- **${z.frage}**\n  - Seite: ${z.seite} (\`${z.pfad}\`)`)
        .join('\n')
}

---

## Nach Bereichen

${sections
  .map((s) => {
    const liste = nachBereich.get(s.id) ?? [];
    if (liste.length === 0) return `### ${s.title}\n\n_Keine offenen Fragen erfasst._\n`;
    const gruppiert = new Map<string, string[]>();
    for (const e of liste) {
      const l = gruppiert.get(e.seite) ?? [];
      l.push(e.frage);
      gruppiert.set(e.seite, l);
    }
    return (
      `### ${s.title}\n\n${liste.length} Fragen auf ${gruppiert.size} Seiten.\n\n` +
      [...gruppiert.entries()]
        .map(([seite, fragen]) => `**${seite}**\n${fragen.map((f) => `- ${f}`).join('\n')}`)
        .join('\n\n') +
      '\n'
    );
  })
  .join('\n')}

---

## Rechercheaufträge je Seite

Der Auftrag beschreibt, wie eine Seite zu belegen ist – nicht, was sie behaupten soll.

${sections
  .map((s) => {
    const eigene = zeilen.filter((z) => z.bereich === s.id && z.auftrag);
    if (eigene.length === 0) return '';
    return (
      `### ${s.title}\n\n` +
      eigene.map((z) => `- **${z.titel}** (\`${z.pfad}\`)\n  - ${z.auftrag}`).join('\n') +
      '\n'
    );
  })
  .filter(Boolean)
  .join('\n')}

---

## Was nach der Recherche zu prüfen ist

- [ ] Jede Quelle im Verzeichnis ist am Original geprüft (\`verifiziert: true\`) oder trägt \`reliability: unklar\`.
- [ ] Keine Zahl ohne Herkunft, Stichjahr und Erhebungsmethode.
- [ ] Bei jeder umstrittenen Frage stehen mindestens zwei Positionen mit benannten Vertretungen.
- [ ] Emische und etische Aussagen sind auf jeder Seite unterscheidbar.
- [ ] Der Genozid-Bereich enthält keine Gewaltdetails, keine Opferfotos, keine Täterpropaganda.
- [ ] Alle Bilder haben Urheber, Lizenz und Fundstelle; keine KI-Bilder realer Personen oder Orte.
- [ ] Beratungsstellen und Anlaufstellen sind auf Erreichbarkeit geprüft, mit Prüfdatum.
- [ ] Impressum, Datenschutzerklärung und Barrierefreiheitserklärung sind ausgefüllt und rechtlich geprüft.
`;

await writeFile(join(WURZEL, 'RESEARCH-BRIEF.md'), brief, 'utf8');

console.info(`content-report.md und RESEARCH-BRIEF.md geschrieben (Stand ${STAND}).`);
console.info(
  `  ${zeilen.length} Seiten · ${gesamtAbschnitte} Abschnitte · ${gesamtZitate} Belegstellen · ${gesamtFragen} offene Fragen`,
);
