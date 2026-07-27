# Content-Guide

Wie Inhalte in diesem Portal gepflegt werden. Für Sprache und Schreibweise
gilt zusätzlich `STYLEGUIDE.md`.

---

## 1. Wo was liegt

```
src/content/
  articles/de/<bereich>/<slug>.mdx   Artikel (88)
  festivals/de/<slug>.mdx            Feste (7)
  misconceptions/de/<slug>.mdx       Missverständnisse (3)
  glossary/de/<slug>.mdx             Glossarbegriffe (50)
  persons/de/<slug>.mdx              Personen (3)
  places/de/<slug>.mdx               Orte (6)
  recipes/de/<slug>.mdx              Rezepte (2)
  teaching/de/<slug>.mdx             Unterrichtsmaterial (3)
  sources/sources.yaml               Quellenverzeichnis
  events/events.yaml                 Zeitleiste
  faq/faq.yaml                       Häufige Fragen
  media/media.yaml                   Mediathek
```

Der Dateiname **muss** dem `slug` im Frontmatter entsprechen, der
Sprachordner dem Feld `lang`, der Bereichsordner dem Feld `section`.
`check:content` prüft das.

---

## 2. Die vier Bearbeitungsstände

| Status    | Bedeutung                                                              | Voraussetzung           |
| --------- | ---------------------------------------------------------------------- | ----------------------- |
| `stub`    | Gerüst: Gliederung und Rechercheauftrag stehen, kein Inhalt            | –                       |
| `entwurf` | Text vorhanden, noch nicht vollständig belegt                          | mindestens eine Quelle  |
| `belegt`  | Jede Aussage ist mit einer Quelle gedeckt                              | mindestens eine Quelle  |
| `geprüft` | Zusätzlich fachlich oder von Angehörigen der Gemeinschaft gegengelesen | zusätzlich `reviewedBy` |

**Der Sprung von `stub` auf `entwurf` ist die kritische Stelle.** Ab hier
erzwingt das Schema eine Quelle, und ab hier gilt: Jeder Satz, der eine
Tatsache behauptet, braucht eine `<Cite>`-Referenz.

---

## 3. Eine Gerüstseite füllen

1. **Rechercheauftrag lesen** – er steht im Frontmatter unter
   `rechercheauftrag` und erscheint auf der Seite.
2. **Quellen suchen** nach der Hierarchie: wissenschaftliche
   Fachliteratur > institutionelle Berichte > seriöser Journalismus >
   Selbstdarstellungen der Gemeinschaft (als solche kennzeichnen).
   Wikipedia ist keine zitierfähige Quelle – nur ein Weg, Primär- und
   Sekundärquellen zu finden.
3. **Quelle eintragen** in `sources.yaml` (siehe Abschnitt 5).
4. **Im Frontmatter anmelden**: Die Quellen-ID muss unter `sources`
   stehen, sonst bekommt der Beleg keine Ziffer.
5. **Text schreiben**, jede Aussage mit `<Cite id="…" loc="S. …" />`.
6. **Beleglücke entfernen**, sobald der Abschnitt belegt ist.
7. **`openQuestions` pflegen**: beantwortete Fragen streichen, neu
   aufgetauchte ergänzen.
8. **`status` und `confidence` anpassen**, `updated` auf das heutige Datum
   setzen.
9. **`npm run check:content`** ausführen.

---

## 4. Frontmatter eines Artikels

```yaml
---
title: 'Tawûsî Melek und die sieben Engel' # Seitentitel
slug: 'tawusi-melek-und-die-sieben-engel' # = Dateiname
lead: >- # 3–5 Sätze „In Kürze“
  …
section: religion # Bereich (src/lib/sections.ts)
order: 20 # Position im Bereich
tags: ['glaube', 'ikonografie']
lang: 'de'
status: 'stub' # stub | entwurf | belegt | geprüft
confidence: 'unklar' # gesichert | umstritten | unklar
perspektive: 'gemischt' # emisch | etisch | gemischt
contentWarning: false
sources: [] # [{ id, loc?, note? }]
relatedGlossary: ['tawusi-melek'] # Slugs aus glossary/
updated: 2026-07-26
reviewedBy: null # Name, sobald gegengelesen
openQuestions: ['…'] # erscheinen in der Belegspalte
gliederung: ['…'] # erscheint nur bei status: stub
rechercheauftrag: >-
  …
weiterfuehrend: ['religion/gottesbild-und-monotheismus']
bilder: [] # Bildnachweise, siehe unten
draft: false
---
```

**Bei `status: stub`** beschreibt der `lead`, _was die Seite behandeln
wird_ – er behauptet nichts (siehe DECISIONS.md, D-008). Sobald Inhalt
entsteht, wird er zur inhaltlichen Kurzfassung umgeschrieben.

---

## 5. Eine Quelle eintragen

```yaml
- id: kreyenbroek-1995 # Kleinbuchstaben, Ziffern, Bindestriche
  type:
    buch # buch|aufsatz|bericht|zeitung|webseite|
    # primärquelle|interview|video
  authors: ['Kreyenbroek, Philip G.']
  title: 'Yezidism – Its Background, Observances and Textual Tradition'
  container: null # Zeitschrift, Sammelband, Institution
  year: 1995
  publisher: 'Edwin Mellen Press'
  isbn: null # nie aus dem Gedächtnis ergänzen
  doi: null
  url: null
  accessed: null # bei Webquellen Pflicht
  language: en
  reliability: unklar # siehe unten
  verifiziert: false
  note: >-
    Einordnung: Standardwerk, parteiisch, ältere Auflage …
```

**Zwei Regeln erzwingt der Build:**

- Eine Webquelle (`url`) **muss** ein `accessed`-Datum tragen.
- Solange `verifiziert: false`, **muss** `reliability: unklar` gesetzt
  sein. `verifiziert: true` darf nur setzen, wer die Angaben am Original
  oder an einem verlässlichen Nachweis geprüft hat.

**Niemals erfinden:** Titel, ISBN, DOI, Seitenzahlen, URLs, Dokument-
nummern, Zitate.

---

## 6. Komponenten im Fließtext

Alle sind ohne Import verfügbar.

### Belege

```mdx
Nach heutigem Forschungsstand … <Cite id="kreyenbroek-1995" loc="S. 45" />
```

Die Ziffer vergibt der Build aus der Position in `sources`. Dieselbe
Quelle bekommt überall dieselbe Ziffer.

```mdx
<Belegluecke
  auftrag="Herkunft der Zuschreibung textlich belegen."
  hinweis="religionswissenschaftliche Fachliteratur"
/>
```

Als Block oder mit `inline` im Satz. Wird im Content-Report gezählt.

```mdx
<Unsicher grund="Die Datierung wird unterschiedlich angesetzt.">
  Die Gemeinschaft bildete sich im 12. Jahrhundert heraus,
</Unsicher>
…
```

Markiert die Stelle im Satz und verweist auf die Kontroversen-Seite.

### Erklären

```mdx
<Begriff id="qewl">Qewl</Begriff>
<KurmanciBegriff
  original="Tawûsî Melek"
  aussprache="ta-wu-SI me-LEK"
  bedeutung="…"
  varianten={['Melek Taus']}
  glossar="tawusi-melek"
/>
```

### Darstellen

```mdx
<Faktenbox
  titel="Kurzfakten"
  eintraege={[
    { label: 'Ort', wert: 'Laliş', beleg: 'Kreyenbroek 1995' },
    { label: 'Zahl', wert: null },
  ]}
/>

<Zitat quelle="Kreyenbroek 1995" fundstelle="S. 45" uebersetzung="…">
  …
</Zitat>

<Vergleichstabelle
  titel="Positionen"
  spalten={['Merkmal', 'A', 'B']}
  zeilen={[['Vertreten von', null, null]]}
/>

<Aufklappbox titel="Vertiefung" kennzeichnung="Forschungsstand">
  …
</Aufklappbox>
<Randglosse art="sprache">…</Randglosse>
<Inhaltshinweis />
<Bildplatzhalter gesucht="…" />
<Standdiagramm />
```

Alle Komponenten sind auf `/styleguide` in ihren Zuständen zu sehen.

---

## 7. Bilder

Ein Bild wird nur aufgenommen, wenn **alle** Angaben vorliegen:

```yaml
bilder:
  - datei: 'lalis-hof.avif' # liegt unter public/img/
    alt: 'Innenhof mit Steinmauern und Rundbögen'
    caption: '…'
    urheber: 'Vorname Nachname'
    lizenz: 'CC BY-SA 4.0'
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0/'
    quelle: 'Wikimedia Commons'
    jahr: 2019
```

Zulässig sind ausschließlich gemeinfreie, frei lizenzierte oder
ausdrücklich freigegebene Bilder. **KI-erzeugte Bilder realer Personen,
Orte oder historischer Ereignisse sind ausgeschlossen.** Liegt kein Bild
vor, steht `<Bildplatzhalter gesucht="…" />`.

Im Genozid-Bereich zusätzlich: keine identifizierbaren Opferfotos, keine
Bilder aus Täterpropaganda.

---

## 8. Prüfen

```bash
npm run check:content    # Inhalte: Pflichtfelder, Belege, Verweise
npm run check            # Typen
npm test                 # Unit-Tests
npm run build            # Bau + Suchindex + Berichte
npm run check:links      # alle Links im Bau (nach dem Bau)
npm run test:e2e         # Rauchtests und axe (nach dem Bau)
```

`npm run verify` führt die Kette bis zum Bau aus.

**Woran `check:content` scheitert:**

| Meldung                                                       | Ursache                                          |
| ------------------------------------------------------------- | ------------------------------------------------ |
| `status: 'belegt' ohne Quelle`                                | `sources` ist leer                               |
| `<Cite id="…"> verweist auf eine Quelle, die es nicht gibt`   | ID fehlt in `sources.yaml`                       |
| `<Cite id="…"> ist nicht im Frontmatter angemeldet`           | ID fehlt im Frontmatter der Seite                |
| `Glossarbegriff "…" hat keinen Eintrag`                       | Datei unter `glossary/de/` fehlt                 |
| `weiterfuehrend: "…" zeigt auf eine Seite, die es nicht gibt` | Tippfehler oder fehlende Seite                   |
| `Quelle "…": nicht am Original geprüft`                       | `verifiziert: false` mit `reliability != unklar` |
| `Webquelle ohne Abrufdatum`                                   | `url` ohne `accessed`                            |
| `Bereich "…" hat keine einzige Seite`                         | Bereich ohne Inhalt                              |

---

## 9. Eine neue Seite anlegen

1. Datei unter `src/content/articles/de/<bereich>/<slug>.mdx` anlegen.
2. Frontmatter aus Abschnitt 4 übernehmen, `order` vergeben.
3. Gliederung als `##`-Überschriften schreiben, je Abschnitt eine
   `<Belegluecke>` mit konkretem Auftrag.
4. `check:content` laufen lassen.

Navigation, Bereichsseite, Sitemap, RSS, Suchindex und OG-Bild entstehen
automatisch – es gibt keine Liste, die zusätzlich zu pflegen wäre.

**Das Gerüst neu erzeugen** (nur beim Aufbau nötig):

```bash
node scripts/generate-stubs.mjs          # überschreibt nichts
node scripts/generate-stubs.mjs --force  # überschreibt bestehende Dateien
```

Der Bauplan liegt in `scripts/plan/`. Wird eine Seite dort ergänzt,
erzeugt der Lauf sie; bestehende Dateien bleiben unangetastet.

---

## 10. Übersetzungen

Übersetzt wird **erst, wenn die deutsche Fassung `status: belegt`
erreicht hat.** Vorher würde eine Übersetzung einen Belegstand
weitertragen, den es nicht gibt.

Ablauf: Datei unter `src/content/articles/<sprache>/<bereich>/<slug>.mdx`
anlegen, `lang` setzen, denselben `slug` verwenden. Der Sprachumschalter
und `hreflang` erkennen die neue Fassung automatisch.

---

## 11. Was nie passieren darf

- Ein Satz, der eine Tatsache behauptet, ohne Beleg
- Eine Zahl ohne Herkunft, Stichjahr und Erhebungsmethode
- Ein erfundenes Zitat, eine erfundene ISBN, DOI, Seitenzahl oder URL
- Eine umstrittene Frage, die als geklärt dargestellt wird
- Eine Beleglücke, die stillschweigend gelöscht statt gefüllt wird
- Ein Bild ohne Urheber, Lizenz und Fundstelle
- Der Name einer überlebenden Person ohne dokumentierte öffentliche
  Selbstnennung
- Eine Rechts-, Asyl- oder Therapieberatung im eigenen Namen
