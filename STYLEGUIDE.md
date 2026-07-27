# Sprach- und Schreibstyleguide

Verbindlich für alle Inhalte des Portals. Wo dieser Styleguide von einer
Quelle abweicht, gilt der Styleguide für den laufenden Text – die Quelle
wird im Beleg unverändert zitiert.

---

## 1. Umschrift: Hawar-Alphabet

**Verbindlich ist die Hawar-Schreibung des Kurmancî.** Sie ist die
verbreitetste lateinische Schreibung des Kurmancî und wird in der
Fachliteratur wie in Selbstdarstellungen benutzt.

Die für dieses Portal wichtigen Sonderzeichen:

| Zeichen | Lautwert (vereinfacht)             | Beispiel            |
| ------- | ---------------------------------- | ------------------- |
| `ê`     | geschlossenes e, etwa wie in „See“ | Ê**z**îdî, Ş**ê**x  |
| `î`     | langes i                           | Êz**î**dî, P**î**r  |
| `û`     | langes u                           | Taw**û**sî          |
| `ş`     | sch                                | **Ş**ingal, **Ş**êx |
| `ç`     | tsch                               | **Ç**arşema         |
| `x`     | Reibelaut wie in „Bach“            | Şê**x**an           |

Alle vier Textschriften des Portals decken diese Zeichen ab; das wird
automatisiert geprüft (`tests/unit/schriften.test.ts`).

**Regel für abweichende Schreibweisen:** Beim ersten Auftreten eines
Begriffs auf einer Seite dürfen ein bis zwei gängige deutsche Varianten
**einmalig in Klammern** genannt werden. Danach gilt durchgehend die
Hawar-Form.

> Laliş (deutsch auch Lalisch) … — danach nur noch „Laliş“.

Die Varianten gehören zusätzlich in das Feld `varianten` des
Glossareintrags, damit die Suche sie findet.

---

## 2. Selbstbezeichnung vor Fremdbezeichnung

- Im laufenden Text: **Êzîdî** (Singular und Plural), **Êzîdiyatî** für die
  Religion.
- Die deutschen Formen _Jesiden_, _Eziden_, _Yeziden_ werden **erklärt,
  nicht gewertet**. Sie stehen dort, wo über die Bezeichnungen gesprochen
  wird, und in Zitaten.
- Adjektivisch: **êzîdîsch**.
- Nicht: „die Yeziden-Religion“, „Jesidentum“ als Standardbegriff,
  „Sekte“, „Naturreligion“.

---

## 3. Emisch und etisch trennen

Jede Aussage muss erkennbar machen, woher sie stammt. Drei Ebenen, drei
Formulierungsmuster:

| Ebene                                              | Muster                                                                             | Beispiel                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Emisch** – Selbstdarstellung der Gemeinschaft    | „Nach der Darstellung von X …“, „In der Überlieferung heißt es …“                  | „Der Geistliche Rat beschreibt seine Aufgabe als …“ |
| **Etisch** – Forschung von außen                   | „Die Forschung beschreibt …“, „Nach Y …“                                           | „Kreyenbroek ordnet die Texte als … ein.“           |
| **Zuschreibung** – Außenperspektive, oft feindlich | „Von außen wurde behauptet …“, „Reiseberichte des 19. Jahrhunderts stellten … dar“ | siehe Bereich Missverständnisse                     |

Das Frontmatter-Feld `perspektive` (`emisch` / `etisch` / `gemischt`)
kennzeichnet den Schwerpunkt der Seite und erscheint in der Belegspalte.
Es ersetzt **nicht** die Kennzeichnung im Satz.

---

## 4. Umstrittenes als umstritten

Sobald zwei belastbare Quellen sich widersprechen:

1. Beide Positionen darstellen, jeweils mit benannter Vertretung.
2. Die Differenz ausdrücklich benennen („Uneinigkeit besteht darüber, ob …“).
3. `confidence: 'umstritten'` im Frontmatter setzen.
4. Die strittige Stelle im Text mit `<Unsicher grund="…">` markieren.
5. Einen Eintrag auf `/de/wissenschaft/offene-fragen-und-kontroversen`
   anlegen und von dort verlinken.

Nicht zulässig: eine Position referieren und die andere in einer Fußnote
verstecken; „umstritten“ schreiben, ohne zu sagen, wer was vertritt.

---

## 5. Zahlen

Keine Zahl ohne **Herkunft, Stichjahr und Erhebungsmethode**.

> Falsch: „Weltweit leben etwa eine Million Êzîdî.“
>
> Richtig: „Die Schätzungen gehen auseinander: X nennt für das Jahr 20XX
> … (Erhebung: …), Y für dasselbe Jahr … (Erhebung: …).“

Bei Bevölkerungszahlen werden **mehrere Schätzungen nebeneinandergestellt**,
nie eine einzelne als Tatsache. Opferzahlen erscheinen als Spanne mit
Quelle. In Faktenboxen bleibt das Feld leer und wird als „noch nicht
belegt“ gesetzt, solange die Angabe fehlt.

---

## 6. Sprache im Genozid-Bereich

Nicht verhandelbar:

- **Keine Gewaltdetails.** Beschrieben wird, _dass_ und _in welchem
  Umfang_ etwas dokumentiert ist – nicht _wie_.
- **Keine Namen von Überlebenden sexualisierter Gewalt** ohne
  dokumentierte öffentliche Selbstnennung.
- **Keine identifizierbaren Opferfotos**, keine Bilder aus
  Täterpropaganda, keine Wiedergabe von Täterrhetorik im Wortlaut.
- **Keine reißerische Sprache.** Keine Steigerungsadjektive
  („grausam“, „brutal“, „unfassbar“), keine rhetorischen Fragen, keine
  Ausrufezeichen.
- **Täter sachlich benennen**, ohne Selbstbezeichnungen zu übernehmen:
  „der sogenannte Islamische Staat“.
- Jede Seite des Bereichs trägt `contentWarning: true`.
- Am Ende von Seiten zu Gewalt und Verfolgung steht ein Verweis auf
  Beratungs- und Hilfsangebote.

---

## 7. Politische Zurückhaltung

Das Portal bezieht in Konflikten zwischen Regierungen, Parteien und
bewaffneten Gruppen **keine Position**. Positionen der Akteure werden
referiert, mit Datum und Quelle, ohne Bewertung.

- Keine Wertungen wie „zu Recht“, „völlig unzureichend“, „verdient“.
- Bei Gebiets- und Zuständigkeitsfragen die Positionen aller beteiligten
  Akteure nennen.
- Ortsnamen in der Hawar-Form, gängige Alternativen einmalig in Klammern
  (Şingal / Sindschar / Sinjar) – ohne daraus eine politische Aussage zu
  machen.

---

## 8. Religiöse Sensibilität

- Es gibt Wissensbestände, die innerhalb der Gemeinschaft nur bestimmten
  Gruppen zugänglich sind. **Nicht rekonstruieren, nicht spekulieren.**
- Nur veröffentlichte und übersetzte religiöse Texte werden zitiert;
  Übersetzerin oder Übersetzer werden genannt.
- Keine ironische, folkloristische oder exotisierende Sprache.
  Kein „mystisch“, „geheimnisumwoben“, „archaisch“.
- Im Zweifel: **weniger schreiben** und auf Selbstdarstellungen der
  Gemeinschaft verweisen.

---

## 9. Personen

- Nur belegte, öffentlich relevante Informationen.
- Keine Privatdetails (Wohnort, Familienverhältnisse, Gesundheit).
- **Keine erfundenen oder sinngemäß rekonstruierten Zitate.** Ein Zitat
  steht nur im nachweisbaren Wortlaut, mit Fundstelle.
- Bei lebenden Personen (`lebend: true`) gilt erhöhte Zurückhaltung; die
  Seite zeigt das sichtbar an.

---

## 10. Deutsche Schreibkonventionen

- **Anführungszeichen**: „…“ im Deutschen, ‚…‘ für Zitat im Zitat und für
  Wortbedeutungen (`Xwedê ‚Gott‘`).
- **Gedankenstrich**: Halbgeviert mit Leerzeichen – so.
- **Auslassung**: … mit Leerzeichen davor.
- **Datum**: „3. August 2014“ im Fließtext, ISO im Frontmatter.
- **Jahreszahlen**: „im Jahr 2014“, nicht „2014 wurde“ am Satzanfang.
- **Abkürzungen** im Fließtext vermeiden; „unter anderem“ statt „u. a.“,
  außer in Belegen und Tabellen.
- **Geschlechtergerechte Sprache**: Paarform oder neutrale Formulierung
  („Forschende“, „Wissenschaftlerinnen und Wissenschaftler“). Keine
  Sonderzeichen im Wortinneren – sie stören Screenreader und die
  Silbentrennung.
- **Fachbegriffe** beim ersten Auftreten erklären und mit `<Begriff>` auf
  das Glossar verlinken.

---

## 11. Überschriften und Aufbau

- Genau eine `h1` je Seite (setzt das Layout).
- Im MDX beginnt die Gliederung bei `##`.
- Überschriften sind **Aussagen oder Gegenstände**, keine Fragen und keine
  Werbetexte: „Die Zählung der 73 Firman“, nicht „Was steckt hinter den
  73 Firman?“.
- Keine Ebene überspringen.
- Jeder größere Artikel folgt dem Aufbau: **Lead („In Kürze“) → Hauptteil
  → Vertiefung/Forschungsstand → Quellen**.

---

## 12. Wortliste

| Nicht                              | Sondern                                                       |
| ---------------------------------- | ------------------------------------------------------------- |
| Jesiden (im laufenden Text)        | Êzîdî                                                         |
| Sekte, Naturreligion, Kult         | Religionsgemeinschaft, Glaubensgemeinschaft                   |
| Teufelsanbeter (unkommentiert)     | nur im Bereich Missverständnisse, als referierte Zuschreibung |
| Stamm (unreflektiert)              | Eşîret, im Text erklärt                                       |
| Kaste                              | Stand                                                         |
| heiliges Buch                      | die zugeschriebenen Schriften (Echtheit umstritten)           |
| Massaker, Blutbad                  | dokumentierte Massentötungen                                  |
| Flüchtlingswelle, Flüchtlingsstrom | Fluchtbewegung, Zahl der Geflüchteten                         |
| IS-Kämpfer als „Krieger“           | Angehörige des sogenannten Islamischen Staates                |
| Wiedergeburt (ohne Einordnung)     | in der Literatur beschriebene Reinkarnationsvorstellungen     |
