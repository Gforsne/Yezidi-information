# Entscheidungen

Fortlaufendes Protokoll. Jede Entscheidung nennt die Lage, die Wahl und
den Grund. Wo eine Annahme getroffen wurde, weil eine Rückfrage den Aufbau
blockiert hätte, steht das ausdrücklich dabei.

Format: **D-nnn — Titel** · _Stand_ · Entscheidung · Begründung · ggf. Folgen

---

## Stack und Aufbau

### D-001 — Astro 7 mit Content Layer

_2026-07-26 · gesetzt durch die Vorgabe, Version gewählt_

Astro 7.1.3 mit der Content-Layer-API (`loader: glob(...)`), TypeScript im
Modus `strictest` mit zusätzlich `noUncheckedIndexedAccess` und
`exactOptionalPropertyTypes`.

Die Vorgabe nennt „aktuelle Version“. Astro 7 hat gegenüber 5 zwei
relevante Änderungen: `markdown.remarkPlugins` ist zugunsten von
`markdown.processor: unified({...})` veraltet, und `z` sollte aus
`astro/zod` statt aus `astro:content` importiert werden. Beides ist
umgesetzt.

### D-002 — `.astro` darf nicht aus `tsconfig.json` ausgeschlossen werden

_2026-07-26_

Der erste Entwurf schloss `.astro` als Build-Artefakt aus. Folge: `astro
check` meldete 100 Fehler, weil `entry.data` überall zu `any` zerfiel –
die generierten Collection-Typen liegen in `.astro/content.d.ts`. Der
Ordner ist jetzt eingeschlossen; der Grund steht als Kommentar in der
Konfiguration, damit ihn niemand „aufräumt“.

### D-003 — Zod-Verfeinerung muss ihren Typ zurückgeben

_2026-07-26_

`verlangeQuellenAbEntwurf()` hängt eine `superRefine`-Prüfung an ein
Schema. Ohne Rückführung auf den ursprünglichen Typ (`as unknown as T`)
verliert Astro die Typinformation der Collection. Die Prüfung läuft
unverändert zur Laufzeit; nur der statische Typ wird erhalten.

### D-004 — Tailwind nur als Utility-Schicht

_2026-07-26_

Farben, Schriften und Abstände stehen als CSS-Custom-Properties in
`tokens.css` und werden über `@theme inline` in Tailwinds Theme
gespiegelt. Es gibt **keine** `dark:`-Varianten: Der dunkle Modus entsteht
vollständig über semantische Tokens. Sonst gäbe es zwei Farbwahrheiten,
die auseinanderlaufen.

### D-005 — Interaktivität ohne UI-Framework

_2026-07-26_

Die Vorgabe nennt `client:visible` / `client:idle`. Diese Direktiven
gelten für Framework-Komponenten; das Projekt braucht keine. Stattdessen:
Astro-`<script>`-Blöcke (Module, standardmäßig `defer`) und bei MapLibre
ein `IntersectionObserver` mit dynamischem Import – funktional dasselbe wie
`client:visible`, ohne React oder Vue als Abhängigkeit. Jede so
angereicherte Komponente funktioniert ohne JavaScript als lesbarer
Fallback; drei Playwright-Tests laufen ausdrücklich mit abgeschaltetem
JavaScript.

---

## Sprache und Inhalt

### D-006 — Sichtbarer Sprach-Rückfall statt leerer Oberfläche

_2026-07-26_

Fehlt ein Oberflächentext in `ku` oder `ar`, wird auf Deutsch
zurückgefallen statt einen leeren String auszugeben. Ein sichtbar
deutscher Text ist ehrlicher als eine Lücke und zeigt zugleich, wo
Übersetzung fehlt. Der Sprachumschalter markiert unvollständige Sprachen
mit einem Punkt.

### D-007 — Alle vier Sprachrouten sind begehbar, ohne Inhalte zu erfinden

_2026-07-26_

Die deutsche Fassung bedient alle vier Sprachrouten, solange keine
Übersetzung existiert. Ein englischer Stub existiert ausschließlich unter
`/en/`. `hreflang` und Sprachumschalter verweisen deshalb **nur auf
tatsächlich vorhandene Fassungen**; fehlt eine Übersetzung, führt der
Umschalter auf die Startseite der Zielsprache und sagt das über
`title` und Screenreader-Text.

### D-008 — Der Lead eines Gerüsts beschreibt die Seite, statt zu behaupten

_2026-07-26 · Annahme, dokumentiert_

Das Schema verlangt einen Lead von 3–5 Sätzen. Bei `status: stub` gibt es
aber noch keinen belegten Inhalt. Gewählt: Der Lead beschreibt, **was die
Seite behandeln wird** („Diese Seite wird … darstellen“). Das ist
Meta-Text über das Portal, keine Sachaussage über die Êzîdî, und braucht
deshalb keinen Beleg. Damit bleibt die Regel „kein Satz ohne Quelle“
unverletzt.

### D-009 — Glossar-Kurzdefinitionen nennen im Gerüst nur den Themenbereich

_2026-07-26 · Annahme, dokumentiert_

Eine inhaltliche Kurzdefinition wäre eine unbelegte Behauptung. Gerüst-
Einträge tragen deshalb: „Begriff aus dem Bereich …; die Definition ist
noch nicht belegt.“ Der Tooltip sagt damit die Wahrheit über seinen
eigenen Zustand.

### D-010 — Bibliografische Angaben gelten als ungeprüft, bis sie geprüft sind

_2026-07-26_

Das Schema erzwingt: Wer `verifiziert: false` trägt, muss
`reliability: 'unklar'` tragen. Die fünf angelegten Quellen sind
einschlägige Werke, ihre Angaben (Auflage, ISBN, Seitenzählung,
Dokumentnummer) sind aber nicht am Original geprüft. Sie stehen deshalb
sämtlich als „ungeprüft“ und erscheinen im Quellenverzeichnis so
gekennzeichnet.

### D-011 — Karte ohne fremden Kachelserver

_2026-07-26_

Die Vorgabe verlangt MapLibre mit freien Vektor-Tiles, zugleich aber
lokale Assets und keine Drittdienste. Beides zusammen ist mit einem
externen Kachelserver nicht zu haben. Gewählt: In der Voreinstellung wird
**kein** fremder Server kontaktiert; die Karte zeichnet ein Gradnetz und
die Ortspunkte aus dem eigenen Ortsverzeichnis. Über
`PUBLIC_MAP_STYLE_URL` können Betreibende eine Hintergrundkarte einbinden
und müssen dann auf deren Datenschutzbedingungen hinweisen. Die
Ortsliste unter der Karte ist immer sichtbar und trägt dieselben Daten.

### D-012 — Fluchtrouten werden nicht gezeichnet

_2026-07-26_

Die Kartenebene „Fluchtbewegungen“ ist angelegt, aber leer. Eine
gezeichnete Route ohne institutionellen Beleg wäre eine kartografische
Behauptung über einen politisch aufgeladenen Sachverhalt. Sie wird erst
aufgenommen, wenn sie belegt ist; die Ebenenerklärung sagt das
ausdrücklich.

### D-013 — Ungefähre Koordinaten, ausdrücklich gekennzeichnet

_2026-07-26 · Annahme, dokumentiert_

Damit Karte und Ortsverzeichnis überhaupt etwas zeigen, tragen sechs Orte
grobe Georeferenzen. Alle sind als `koordinatenGenauigkeit: 'ungefähr'`
markiert und führen die Prüfung gegen einen amtlichen Geodatensatz als
offene Frage. Der Alternativentwurf – gar keine Koordinaten – hätte Karte
und Ortsverzeichnis unprüfbar gemacht.

### D-014 — Keine Remote-Bilder, keine KI-Bilder

_2026-07-26_

`astro.config.mjs` erlaubt bewusst keine Remote-Bildmuster. Bilder werden
nur lokal ausgeliefert und brauchen im Schema Urheber, Lizenz und
Fundstelle – ohne diese Angaben bricht der Build ab. KI-erzeugte Bilder
realer Personen, Orte oder Ereignisse sind ausgeschlossen; wo kein Bild
vorliegt, steht eine gestaltete Leerfläche.

---

## Belegapparat

### D-015 — Belegziffern entstehen zur Bauzeit, nicht zur Laufzeit

_2026-07-26_

Eine Astro-Komponente kennt den Seitenkontext nicht, in dem sie steht;
eine Registry im Modulscope wäre bei parallelem Rendern unzuverlässig.
Gewählt: das remark-Plugin `src/lib/remark-zitate.mjs`. Es sieht
Frontmatter und Dokument einer einzelnen Datei und vergibt die Ziffern
deterministisch – ohne JavaScript im Browser und ohne geteilten Zustand.

**Regel:** Die Ziffer ist die Position der Quellen-ID in `sources` im
Frontmatter. Dieselbe Quelle bekommt an jeder Fundstelle dieselbe Ziffer.
Eine zitierte Quelle, die nicht im Frontmatter steht, erscheint sichtbar
als Fehler und lässt `check:content` fehlschlagen.

### D-016 — MDX-Komponenten werden zentral eingehängt

_2026-07-26_

Autorinnen und Autoren schreiben `<Cite id="…" />` ohne Import; die
Komponenten kommen über `<Content components={mdxKomponenten} />` aus
`src/components/mdx.ts`. So kann keine Datei eine abweichende
Cite-Implementierung einbinden.

### D-017 — Prüfskripte lesen die Inhalte selbst

_2026-07-26_

`check:content` liest Frontmatter und Rumpf direkt von der Platte, statt
über `astro:content` zu gehen. Ein Prüfskript, das den Build braucht,
prüft zu spät – es soll gerade dann laufen, wenn der Build scheitert.

### D-018 — Berichte werden mitversioniert

_2026-07-26_

`content-report.md` und `RESEARCH-BRIEF.md` werden bei jedem Bau neu
erzeugt und liegen im Repository. So ist der Belegstand in der
Versionsgeschichte nachvollziehbar, ohne dass jemand den Bau ausführen
muss.

---

## Gestaltung

### D-019 — Signature-Element ist die Belegspalte, nicht die Zeitleiste

_2026-07-26_

Begründung ausführlich in `DESIGN.md`, Abschnitt 4. Kurz: Die Belegspalte
erscheint auf jeder Inhaltsseite und kodiert das redaktionelle Prinzip;
eine dramatisierte Firman-Zeitleiste hätte eine Sicherheit behauptet, die
die Quellen nicht hergeben.

### D-020 — Standdiagramm ohne Hierarchie

_2026-07-26_

Mirîd, Şêx und Pîr erscheinen als drei gleich große Kreise auf einer
Linie, verbunden durch eine gestrichelte Waagerechte, ohne Pfeile. Eine
Pyramide oder ein Organigramm würde eine Rangordnung behaupten, die so
nicht gemeint ist.

### D-021 — Bildmarke ohne religiöse Symbolik

_2026-07-26_

Zirkumflex über drei Steinschichten. Kein Pfau, kein Sancak, keine
Kegeldachform. Begründung in `DESIGN.md`, Abschnitt 2.

### D-022 — Schriftwahl und aktive Glyphenprüfung

_2026-07-26_

Newsreader, Source Serif 4, IBM Plex Sans, IBM Plex Sans Arabic – alle
unter SIL Open Font License, alle lokal. Die Vorgabe verlangt eine aktive
Prüfung der Abdeckung; sie läuft als Test mit fontkit über die
Schriftdateien und prüft **ê î û ş ç** samt Großbuchstaben sowie das
arabische Grundalphabet. `ş` und `Ş` liegen im Subset `latin-ext`, die
übrigen in `latin` – geprüft wird deshalb die Vereinigung.

---

## Betrieb

### D-023 — OG-Bilder aus Schriftpfaden statt aus Systemschriften

_2026-07-26_

Ein SVG mit `<text>` bräuchte beim Rastern die Schriften des Bauservers –
dort liegen sie nicht, und ê î û ş ç fielen auf Ersatzglyphen zurück.
Gewählt: fontkit setzt die Buchstaben in SVG-Pfade um, sharp rastert. Das
Ergebnis ist auf jedem Rechner identisch. 114 Bilder entstehen beim Bau.

### D-024 — Eigene Wurzelseite statt Astros Weiterleitung

_2026-07-26_

`redirectToDefaultLocale` ist abgeschaltet. Astros Standardseite hätte nur
nach `/de/` geleitet; unter `/` steht stattdessen eine echte, ohne
JavaScript und ohne Weiterleitung benutzbare Sprachauswahl für alle vier
Sprachen.

### D-025 — Suchindex fehlt im Entwicklungsserver, und die Seite sagt das

_2026-07-26_

Pagefind erzeugt seinen Index erst beim Produktionsbau. Statt eine kaputte
Suche vorzutäuschen, meldet die Suchseite den fehlenden Index im Klartext
und verweist auf Bereichsübersicht und Glossar.

### D-026 — Playwright nutzt ein vorhandenes Chromium, wenn die Version abweicht

_2026-07-26_

In manchen Umgebungen liegt ein Chromium mit abweichender Build-Nummer
bereit. `playwright.config.ts` benutzt es dann, statt einen zweiten
Browser herunterzuladen; über `PLAYWRIGHT_CHROMIUM_PATH` überschreibbar.

### D-027 — Statistik bleibt ausgebaut

_2026-07-26_

Die Vorgabe erlaubt ein abschaltbares Statistikmodul, standardmäßig
deaktiviert. Es ist **gar nicht erst eingebaut**: Ein nicht vorhandenes
Modul kann nicht versehentlich aktiviert werden, und die
Datenschutzerklärung kann ohne Einschränkung sagen, dass nichts erhoben
wird. Wird es später gebraucht, ist es eine bewusste Ergänzung mit eigener
Prüfung.

### D-028 — MapLibre-Worker wird lokal ausgeliefert

_2026-07-27_

MapLibre bestimmt die Adresse seines Web Workers zur Laufzeit als
Nachbardatei des eigenen Moduls. Nach dem Bündeln liegt dort nichts: Der
Worker wurde mit 404 quittiert, und die Karte zeichnete weder Gradnetz
noch Punkte — **ohne einen Fehler zu melden**. Canvas, Bedienelemente und
Maßstab sahen dabei normal aus, der ursprüngliche Rauchtest lief grün.

`scripts/copy-map-worker.mjs` kopiert `maplibre-gl-worker.mjs` samt der
benötigten Nachbardatei `maplibre-gl-shared.mjs` bei jedem `dev` und
`build` nach `public/vendor/maplibre/`; `setWorkerUrl()` bekommt die
Adresse ausdrücklich gesagt. Die Kopien sind aus der Versionierung
ausgenommen, damit sie nicht von der installierten Version abweichen.

Der Rauchtest prüft jetzt, dass der Worker läuft und keine Anfrage mit
einem Fehlercode beantwortet wird — nicht mehr nur, dass ein Canvas
entsteht.

### D-029 — `public/` gehört nicht in die Typprüfung

_2026-07-27_

Die kopierten Fremddateien lösten Hinweise in `astro check` aus. `public/`
enthält ausschließlich statische Auslieferung und wird deshalb aus
`tsconfig.json` ausgeschlossen.

### D-030 — Belegen darf nur, wer den Volltext hatte

_2026-07-27_

Beim Aufbau der Quellenbasis wurde ein Unterschied sichtbar, den das
Schema bis dahin nicht abbilden konnte: Bibliografische Angaben lassen
sich an einem Katalognachweis prüfen, ohne dass man das Buch je gesehen
hat. Genau daraus entsteht der häufigste Recherchefehler – ein Titel
wirkt geprüft, und eine Aussage wird ihm zugeschrieben, obwohl niemand
nachgelesen hat, ob sie dort steht.

Die Quellen tragen deshalb zwei getrennte Flags:

- `verifiziert` — Titel, Jahr, Verlag, ISBN sind an einem verlässlichen
  Nachweis geprüft.
- `volltextGeprueft` — der Text lag der Redaktion tatsächlich vor.

`check:content` bricht ab, sobald ein `<Cite>` auf eine Quelle ohne
`volltextGeprueft: true` zeigt. Standardwerke wie Kreyenbroek 1995 stehen
damit weiterhin im Quellenverzeichnis – als Literaturhinweis mit
geprüften Angaben, aber ohne Belegziffer, bis jemand sie beschafft.

Wo eine gelesene Quelle eine ungelesene referiert, wird die gelesene
zitiert und die Weitergabe im Text benannt („referiert bei …“). Das ist
umständlicher als ein direkter Verweis und dafür wahr.

### D-031 — Der Content-Report beschreibt den jeweils aktuellen Stand

_2026-07-27_

Die Kurzfassung des Reports erklärte eine Belegquote nahe null als
Sollzustand. Das stimmte, solange nichts recherchiert war; sobald erste
Bereiche fertig sind, wäre derselbe Satz eine Beschönigung. Der
Einordnungssatz wird jetzt aus dem Bearbeitungsstand erzeugt.

---

## Offene Punkte, die keine Gestaltungsfrage sind

Diese Punkte lassen sich nicht durch eine Entscheidung schließen; sie
brauchen eine Antwort von außen und stehen in `RESEARCH-BRIEF.md` unter
„Zwingend zu klären“:

- Trägerschaft, Finanzierung und presserechtliche Verantwortung
- Meldeweg für Korrekturhinweise (E-Mail, Formular, Repository-Issue)
- Verbindliche Absprache mit Vertretungen der Gemeinschaft darüber,
  welche religiösen Inhalte veröffentlicht werden dürfen
- Prüfung der Rechtsseiten (Impressum, Datenschutz, Barrierefreiheit)
- Wer den dokumentierten Screenreader-Durchgang durchführt
