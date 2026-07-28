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

### D-032 — Prettier fasst die Inhalte nicht mehr an

_2026-07-27_

In MDX gilt ein JSX-Element am Zeilenanfang als Block, nicht als Teil des
Absatzes. Prettier bricht Zeilen um und schiebt dabei `<Cite>` an den
Zeilenanfang. Die Folge ist im Quelltext unsichtbar und im gebauten HTML
eindeutig: Der Beleg rutscht aus dem `<p>` heraus, die Belegziffer steht
allein hinter dem Absatz, und vor ihr klafft eine Lücke. Innerhalb von
Komponenten-Kindern hilft auch `proseWrap: "preserve"` nicht.

`src/content/**/*.mdx` steht deshalb in `.prettierignore`. Für Fließtext
war der Gewinn ohnehin gering. Die strukturelle Prüfung übernimmt
`check:content`: Beginnt eine Zeile mit `<Cite>`, `<Begriff>` oder
`<KurmanciBegriff>`, bricht der Build ab.

Die übrigen Dateitypen – Astro, TypeScript, YAML, Markdown ohne JSX –
formatiert Prettier unverändert.

### D-033 — Zwei Barrierefreiheitsfehler, die erst mit Inhalt sichtbar wurden

_2026-07-27_

Solange alle Artikel Gerüste waren, enthielt keine geprüfte Route einen
Beleg oder einen Glossarverweis. Mit den ersten belegten Seiten meldete
axe zwei echte Verstöße:

- `<Begriff id="…" />` ohne Kindtext erzeugte einen Link ohne
  zugänglichen Namen. Die Komponente setzt jetzt den Titel des
  Glossareintrags ein, wenn kein Kindtext angegeben ist. Das ist zugleich
  die bequemere Schreibweise im Fließtext.
- Die Belegziffern unterschieden sich allein durch ihre Farbe vom
  Fließtext (WCAG 1.4.1). Sie tragen jetzt eine feine Unterstreichung –
  am Linkelement selbst, nicht am `<sup>`, weil Prüfwerkzeuge die
  Auszeichnung des Links lesen.

Beides zeigt, wie wenig eine Prüfung wert ist, die auf leeren Seiten
läuft. Der Rauchtest prüft jetzt zusätzlich, dass eine Artikelseite
tatsächlich Belegziffern enthält.

---

### D-034 — Projektseiten belegen nichts, weil sie nichts behaupten

_2026-07-27_

Die Seiten im Bereich `meta` beschreiben das Projekt selbst: Arbeitsweise,
Datenschutz, Barrierefreiheit, Impressum. Sie stellen keine Behauptung
über die Êzîdî auf und können deshalb nichts belegen. Die Belegpflicht ab
Status „Entwurf“ gilt für sie nicht – im Zod-Schema und in
`check:content` steht dieselbe Ausnahme, damit sie nicht auseinanderlaufen.

Im Content-Report zählt der Bereich nicht in die Belegquote; in der
Bereichstabelle steht dort „–“ statt „0 %“. Andernfalls hätte eine
vollständig geschriebene Datenschutzerklärung die Quote des ganzen
Portals gedrückt.

Die Ausnahme ist eng gefasst: Sobald eine Projektseite doch eine
Tatsachenbehauptung aufstellt, steht eine Quelle in `sources`, und die
`<Cite>`-Prüfung greift wie überall.

### D-035 — Überschriften dürfen keine Belege verschlucken

_2026-07-27_

Der Reparaturlauf, der Inline-Komponenten an die vorherige Zeile hängt,
hatte auf einer Seite eine Überschrift mit dem folgenden Absatz
verschmolzen. Sichtbar war das nur im gebauten HTML. `check:content`
prüft jetzt beide Richtungen: Keine Zeile darf mit `<Cite>`, `<Begriff>`
oder `<KurmanciBegriff>` beginnen – und keine Überschrift darf eine
dieser Komponenten enthalten.

Der Reparaturlauf selbst rührt Zeilen nach einer Überschrift oder nach
einer Leerzeile nicht mehr an, sondern meldet sie zur Prüfung von Hand.

### D-036 — Die Mediathek verzeichnet nur, was gelesen wurde

_2026-07-27_

In der Mediathek stehen fünf Verweise: das Themenheft von _Kurdish
Studies_, die Hamburger Gesamtdarstellung, die Handreichung des RAA
Brandenburg, der Bericht der UN-Untersuchungskommission und der
Bundestagsantrag von 2023. Alle fünf sind frei zugänglich und lagen der
Redaktion im Volltext vor; ihre Adressen stammen aus dem geprüften
Quellenverzeichnis, nicht aus der Erinnerung.

Filme, Podcasts und Tonaufnahmen fehlen. Für sie müssten Nutzungsrechte
geklärt sein und – bei Aufnahmen von Überlebenden – die Zustimmung der
Abgebildeten. Ein Verweis ist eine Weiterverbreitung; das gilt auch dann,
wenn nichts eingebettet wird.

### D-037 — Der Gerüst-Test hängt am Impressum

_2026-07-27_

Ein Rauchtest prüfte, dass Gerüstseiten als solche gekennzeichnet sind –
an einer inhaltlichen Seite. Mit jedem Recherchefortschritt schlug er
fehl und musste umgehängt werden. Er steht jetzt auf `/de/meta/impressum`:
Diese Seite bleibt ein Gerüst, bis die Trägerschaft feststeht, und lässt
sich nicht wegrecherchieren.

---

### D-038 — Übersetzungen treten an die Stelle der deutschen Fassung

_2026-07-27_

Bisher bediente jede deutsche Seite alle vier Sprachrouten, und
Übersetzungen hätten mit ihr um dieselbe Adresse gestritten. Die Route
gruppiert Einträge jetzt nach Bereich und Slug: Ausgeliefert wird die
Fassung in der angeforderten Sprache, sonst die deutsche. Damit kann eine
Übersetzung ohne weitere Änderung an ihre Stelle treten.

Wird die deutsche Fassung ausgeliefert, obwohl eine andere Sprache
angefordert war, steht das jetzt sichtbar über dem Text – in der
angeforderten Sprache. Ein stiller Rückfall wäre eine Zumutung: Wer
`/ar/…` aufruft und Deutsch bekommt, soll erfahren, warum.

Übersetzt ist bislang die zentrale Einstiegsseite ins Englische. Die
Regel bleibt: Übersetzt wird erst, was auf Deutsch belegt ist. Für
Kurmancî und Arabisch kommt eine zweite Bedingung hinzu, die die
Redaktion nicht selbst erfüllen kann – die Prüfung der religiösen
Terminologie durch Sprecherinnen und Sprecher aus der Gemeinschaft. Eine
selbst angefertigte kurmancî Fassung religiöser Begriffe wäre genau die
Art von Fehler, gegen die dieses Portal ansonsten anschreibt.

Die drei englischen Platzhalterseiten mit dem erfundenen Slug „overview“
sind entfallen. Ihre Aufgabe – den Übersetzungsstand sichtbar zu machen –
erfüllt jetzt der Sprachhinweis auf jeder betroffenen Seite.

---

### D-039 — Sieben neue Volltexte, und was sie klären

_2026-07-28_

Beschafft und im Volltext gelesen: das Plenarprotokoll der Bundestagssitzung
vom 19. Januar 2023, die Entschließung des Europäischen Parlaments vom 4. Februar 2016, der sechste und siebte UNITAD-Bericht an den
Sicherheitsrat, zwei Antworten der Bundesregierung auf Kleine Anfragen zur
Asylstatistik und ein Gesetzentwurf zum Aufenthaltsrecht.

Damit ließen sich sieben Entwurfsseiten schließen und zwei Fehler beheben:

- Das Beschlussdatum des Bundestages war bislang mit dem Datum der
  Drucksache angegeben. Beschlossen wurde am **19.** Januar 2023, und zwar
  einstimmig – belegt im Wortlaut der Sitzungsleitung.
- Auf der Seite zu den Anschlägen von 2007 stand die Gleichsetzung von
  al-Qahtaniya und Gire Zer als Tatsache, während der zugehörige
  Glossareintrag festhielt, dass sie unbelegt ist. Beide Seiten sagen jetzt
  dasselbe.

Eine Feststellung ist ausdrücklich **nicht** übernommen worden: Der sechste
UNITAD-Bericht enthält keine förmliche Völkermordfeststellung, sondern
beschreibt das Falldossier. Die Feststellung steht im siebten Bericht. Das
Portal belegt deshalb mit dem siebten – auch wenn der sechste in
Zusammenfassungen häufig dafür angeführt wird.

### D-040 — Parteiliche Dokumente werden zugeschrieben, nicht referiert

_2026-07-28_

Ein Gesetzentwurf einer Fraktion ist eine gute Quelle für die Position der
Antragsteller und für Tatsachen, die sie belegen können – und keine
Fachdarstellung. Die Zahlen daraus (Schutzquote 2023, Bilanz des
baden-württembergischen Sonderkontingents, Abschiebestopps einzelner Länder)
stehen im Portal ausdrücklich als Angaben der antragstellenden Fraktion.

Dasselbe gilt innerhalb der Antworten auf Kleine Anfragen: Belegfähig sind
die Antworten der Bundesregierung, nicht die Vorbemerkung der Fragesteller.
Der Unterschied ist in den Quellennotizen festgehalten, damit spätere
Bearbeitungen ihn nicht übersehen.

---

### D-041 — Eine Sammlung aus der Gemeinschaft ist eine Quelle eigener Art

_2026-07-28_

Der Redaktion wurde ein 975-seitiger Band zur Verfügung gestellt: T'êmûrê Meso
(Teimuraz Avdoev), _Newşe Dînê Êzîdiyan_, 2020, eine dreisprachig betitelte
Zusammenstellung êzîdîscher heiliger Texte in vierzehn Teilen. Er ist im
Volltext gelesen und als `avdoev-2020-newse` aufgenommen worden. Drei
Entscheidungen dazu:

**`reliability: community`, nicht `wissenschaftlich`.** Der Band ist keine
kritische Edition. Er nennt kein Herausgeberkollegium, keinen textkritischen
Apparat und keine Aufnahmeprotokolle; sein Vorwort beschreibt ausdrücklich eine
Vereinheitlichung der Dialekte „soweit möglich“. Gerade dieser Eingriff tilgt
die regionale Varianz, die die Forschung als Merkmal der mündlichen
Überlieferung behandelt. Das macht den Band nicht wertlos – es macht ihn zu
einer anderen Art von Zeugnis.

**`verifiziert: true` trotz fehlender Verlagsangaben.** Autor, Titel und Jahr
stehen auf dem Titelblatt und sind dort geprüft. Verlag, Ort und ISBN fehlen,
weil der Band kein Impressum enthält – nicht, weil sie ungeprüft wären. Sie
bleiben deshalb `null`, wie es der Kopf von `sources.yaml` vorsieht. Der Hinweis
auf einen Weiterverbreiter in den Dateimetadaten steht in der Quellennotiz.

**Was der Band belegt und was nicht.** Belegfähig ist, was er selbst bezeugt:
dass diese Texte in dieser Form gesammelt und gedruckt wurden, und was sein
Vorwort über die Entstehung sagt. Daraus stammt die Auskunft, die dieses Portal
an mehreren Stellen als offene Frage geführt hat – wer das Schreibverbot wann
aufhob (Mîr Tahsin Beg und der Geistliche Rat, 1980er Jahre). Nicht belegfähig
ist der Inhalt der Texte als Aussage über die Lehre: Die Kitêba Celwe und die
Meshefa Reş stehen als Teile XII und XIII im Band, obwohl die Forschung sie als
unecht erwiesen hat. Die Seite dazu hält beides nebeneinander und löst es nicht
auf. Ein Abdruck belegt einen Gebrauch, keine Haltung – und schon gar nicht die
Haltung „der Gemeinschaft“, die aus einem einzelnen Band nicht folgt.

### D-042 — Hochgeladene Quellendateien gehören nicht ins Repository

_2026-07-28_

Der Band kam als PDF im Repository selbst an. Fremdes Material mit eigenen
Lizenzbedingungen gehört dort nicht hin; dafür gibt es das ignorierte
Verzeichnis `quellen/`. Die Datei ist aus der Versionierung entfernt worden,
die Arbeitskopie liegt in `quellen/avdoev-2020-newse.pdf`. Damit sich das nicht
wiederholt, ignoriert `.gitignore` jetzt PDF-Dateien im Wurzelverzeichnis.

Das gilt nur für die Versionierung, nicht für den Weg: Eine Datei ins
Repository zu legen ist ein völlig brauchbarer Weg, der Redaktion eine Quelle
zu übergeben.

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
- Wer die kurmancî und arabischen Übersetzungen anfertigt und die
  religiöse Terminologie darin prüft
