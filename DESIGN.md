# Design

Dieses Dokument hält den Gestaltungsplan fest, die Selbstkritik daran und
die Regeln, die daraus folgen. Es ist verbindlich: Was hier steht, gilt für
neue Komponenten genauso wie für bestehende.

---

## 1. Haltung

Das Portal ist ein **Archiv**, kein Kampagnenauftritt. Daraus folgt alles
Weitere:

- **Würdevoll und ruhig.** Keine dramatisierende Bildsprache, keine
  Krisenästhetik, keine emotionalisierenden Effekte. Der Gegenstand trägt
  genug Gewicht; die Gestaltung muss ihm keines hinzufügen.
- **Dokumentarisch.** Die Seite zeigt, worauf sie sich stützt, und macht
  sichtbar, wo sie nichts weiß. Der Quellenapparat ist nicht Beiwerk,
  sondern Hauptelement.
- **Keine Folklore.** Kein „Ethno-Look“, keine Ornamenttapeten, keine
  Musterflächen aus Teppichmotiven.
- **Keine Zweckentfremdung religiöser Symbolik.** Tawûsî Melek, der Sancak
  und die Sakralarchitektur erscheinen nicht als Dekor, nicht im Logo,
  nicht als Hintergrund, nicht als Aufzählungszeichen.

---

## 2. Herleitung der Formensprache

Abgeleitet wird aus der **Materialität**, nicht aus der Ikonografie.

| Beobachtung                        | Abstraktion                                            | Wo sie auftaucht                 |
| ---------------------------------- | ------------------------------------------------------ | -------------------------------- |
| Kalkstein: warmes, helles Gestein  | Fläche ist kein reines Weiß, sondern warmes Papier     | `--c-surface`, alle Grundflächen |
| Schattenraum im Inneren von Bauten | Schrift ist kein reines Schwarz, sondern warmes Dunkel | `--c-text`                       |
| Messing, Sonnenlicht auf Stein     | ein einziger warmer Akzent, sparsam                    | Links, Akzentlinien              |
| Textilindigo                       | eine zweite, kühle Farbe für den Apparat               | Belegspalte, Zitate, Quellen     |
| Krapprot                           | gedecktes Warnrot, nie Alarmrot                        | Inhaltshinweis, Umstrittenes     |
| Quellwasser (Kaniya Sipî)          | ruhiger, kühler Hinweiston                             | Info, „geprüft“                  |

**Das Zeichen.** Die Bildmarke ist ein Zirkumflex über drei Steinschichten.
Der Zirkumflex ist das charakteristische diakritische Zeichen der
Kurmancî-Orthografie (ê î û) – die Marke kodiert damit _Sprache und
Archiv_, nicht Glauben. Die drei Schichten sind eine Schichtung, keine
Bauform.

**Die Rippenstruktur.** Die Zeitachse der Zeitleiste ist als feine
Rippenlinie gezeichnet – eine abstrahierte Anlehnung an die gerippte
Kegelform der Heiligtümer. Sie erscheint **ausschließlich dort** und
ausschließlich als Achse, nie als Muster, nie als Rahmen, nie als Textur.

---

## 3. Selbstkritik gegen den KI-Standardlook

Vor der Umsetzung geprüft, was ein generischer Entwurf getan hätte – und
was hier stattdessen gilt.

| Standardmuster                             | Warum es hier nicht passt                                          | Entscheidung                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Inter (oder System-Sans) für alles         | Austauschbar; ein Nachschlagewerk braucht Lesetypografie           | Serifenschrift im Fließtext (Source Serif 4), Sans nur für Daten und Bedienelemente              |
| Violett-blauer Verlauf im Hero             | Verlaufsflächen sind reine Dekoration und tragen keine Information | Keine Verläufe. Der Hero ist Text auf Fläche                                                     |
| Abgerundete Karten mit weichem Schatten    | Erzeugt App-Anmutung, nicht Archiv                                 | Radien 1–6 px, Trennung über Linien statt Schatten                                               |
| Emoji oder bunte Icons als Rubrikzeichen   | Verniedlicht einen Gegenstand, der Verfolgung einschließt          | Keine Emoji. Rubriken tragen Wortmarken, keine Piktogramme                                       |
| Große Zahlen als „Stats“ im Hero           | Suggeriert Sicherheit, die nicht besteht                           | Zahlen erscheinen nur mit Herkunft, Stichjahr und Methode – oder als sichtbare Leerstelle        |
| Stock-Fotografie zur „Atmosphäre“          | Bebilderung ohne Rechteklärung und ohne Bezug                      | Wo kein rechtlich geklärtes Bild vorliegt, steht eine gestaltete Leerfläche mit Rechercheauftrag |
| Dark Mode als Invertierung                 | Invertiertes Warmgrau wird kalt und schmutzig                      | Der dunkle Modus ist eigenständig gestimmt und eigens auf Kontrast gemessen                      |
| Animierte Zähler, Parallax, Scroll-Effekte | Im Genozid-Bereich unangemessen, überall unnötig                   | Bewegung ist auf Zustandswechsel beschränkt; im Genozid-Bereich vollständig gesperrt             |
| „Skeleton Loader“ und Ladeanimationen      | Es gibt nichts nachzuladen – die Seiten sind statisch              | Keine                                                                                            |

**Was übrig bleibt und die Seite trägt:** Zeilenlänge, Kontrast, ein
einziger Akzent, sichtbare Struktur, und ein Element, das es sonst nirgends
gibt – die Belegspalte.

---

## 4. Signature-Element: die mitlaufende Belegspalte

**Was es ist.** Neben jedem Artikel läuft auf breiten Schirmen eine
zweite, schmalere Spalte mit: Bearbeitungsstand, Sicherheit der
Darstellung, Perspektive (emisch/etisch), letzter Aktualisierung, der
Belegquote als Zahl und Balken, der Zahl markierter Beleglücken, der
schwächsten Quelle der Seite, den offenen Recherchefragen und dem
vollständigen Quellenverzeichnis der Seite.

**Warum genau dieses Element.** Der Kern dieses Projekts ist eine
Behauptung über die eigene Arbeitsweise: _Kein Satz ohne Beleg, jede Lücke
sichtbar._ Ein Fußnotenapparat am Seitenende kann diese Behauptung nicht
tragen – er wird überblättert. Die Belegspalte macht den Belegzustand zum
dauerhaft sichtbaren Teil des Leseerlebnisses. Wer eine Seite liest, sieht
im selben Blickfeld, worauf sie sich stützt und wo sie leer ist.

**Warum nicht die Zeitleiste.** Eine Zeitleiste, die die Firman-Erinnerung
visuell trägt, wäre das naheliegende Signature-Element gewesen. Dagegen
sprach: Sie erscheint auf genau einer Seite, und sie müsste eine
Erinnerungsfigur visuell verdichten, deren Historizität selbst umstritten
ist. Eine starke Grafik hätte hier eine Sicherheit behauptet, die die
Quellen nicht hergeben. Die Zeitleiste ist deshalb sachlich gestaltet, die
Firman-Kennzeichnung ist eine Markierung – kein visuelles Motiv.

**Verhalten.**

- ≥ 88 rem: drei Spalten – Bereichsnavigation, Text, Belegspalte
- 68–88 rem: zwei Spalten – Text, Belegspalte
- < 68 rem: die Belegspalte rückt unter den Text, mit Linie abgesetzt
- Im Druck wandert sie in den Lesefluss (siehe `print.css`)
- Sie enthält **kein JavaScript**

---

## 5. Farbe

Sechs benannte Rohfarbfamilien, daraus semantische Tokens. Alle Werte sind
gemessen, nicht geschätzt: `tests/unit/kontrast.test.ts` liest
`tokens.css`, rechnet die Kontrastverhältnisse nach und schlägt fehl,
sobald ein Wert unter die Vorgabe fällt.

| Familie          | Bedeutung                          |
| ---------------- | ---------------------------------- |
| `--p-kalk-*`     | Kalkstein – Flächen                |
| `--p-schiefer-*` | Schattenraum – Schrift, Linien     |
| `--p-ocker-*`    | Messing, Sonnenlicht – Akzent      |
| `--p-indigo-*`   | Textilindigo – Belegapparat        |
| `--p-krapp-*`    | Krapprot – Warnung, Inhaltshinweis |
| `--p-wasser-*`   | Quellwasser – ruhiger Hinweis      |

**Gemessene Verhältnisse (helles Schema, auf `--c-surface`)**

| Token               | Verhältnis | Stufe |
| ------------------- | ---------: | ----- |
| `--c-text`          |    15,33:1 | AAA   |
| `--c-text-muted`    |     7,65:1 | AAA   |
| `--c-text-faint`    |     5,26:1 | AA    |
| `--c-accent`        |     7,43:1 | AAA   |
| `--c-apparat`       |     9,16:1 | AAA   |
| `--c-warn`          |     7,88:1 | AAA   |
| `--c-border-strong` |     4,23:1 | ≥ 3:1 |
| `--c-focus`         |     7,51:1 | ≥ 3:1 |

**Dunkles Schema** („Nachtstein“): warmes Anthrazit statt Blaugrau, Ocker
angehoben, Indigo zu Dämmerungsblau aufgehellt. Fließtext 14,53:1 (AAA),
alle übrigen Werte ebenfalls geprüft. Es ist ausdrücklich **keine**
Invertierung – ein eigener Test stellt das sicher.

**Regel: Farbe ist nie das einzige Unterscheidungsmerkmal.** Jede farblich
codierte Information trägt zusätzlich Form, Text oder Symbol:
Statusbadges einen unterschiedlich gefüllten Punkt, Firman-Einträge eine
gedrehte Raute, unübersetzte Sprachen einen Durchstrich, umstrittene
Aussagen eine Wellenlinie und ein Wort, Links im Fließtext eine
Unterstreichung.

---

## 6. Typografie

| Rolle     | Familie                            | Begründung                                                    |
| --------- | ---------------------------------- | ------------------------------------------------------------- |
| Display   | **Newsreader** (variabel, OFL)     | Redaktioneller Charakter, hoher Kontrast in großen Graden     |
| Fließtext | **Source Serif 4** (variabel, OFL) | Für längeres Lesen am Bildschirm entworfen                    |
| Utility   | **IBM Plex Sans** (variabel, OFL)  | Nüchtern, institutionell, klar von Inter unterscheidbar       |
| Arabisch  | **IBM Plex Sans Arabic** (OFL)     | Passt metrisch zur Utility-Schrift, deckt die `/ar/`-Route ab |

**Alle Schriften liegen lokal** unter `public/fonts` (woff2,
`font-display: swap`). Keine Google-Fonts-CDN, kein externer Request.

**Geprüfte Abdeckung.** `tests/unit/schriften.test.ts` öffnet die
Schriftdateien mit fontkit und prüft, dass **ê î û ş ç** und ihre
Großbuchstaben in allen drei lateinischen Familien vorhanden sind – über
die Vereinigung der Subsets `latin` und `latin-ext`, weil `ş` und `Ş` im
zweiten liegen. Für Arabisch wird das Grundalphabet geprüft. Der Test
schlägt fehl, sobald eine Schriftdatei getauscht wird und ein Zeichen
fehlt.

**Lesetypografie.** Zeilenlänge 68 Zeichen (`--measure`), Zeilenhöhe 1,68,
Silbentrennung aktiv, `text-wrap: pretty` im Fließtext und `balance` in
Überschriften. Fließtext 17 px als Grundgröße.

---

## 7. Raum, Form, Bewegung

- **Abstände**: feste Leiter `--s-1` … `--s-10`, keine Zwischenwerte.
- **Radien**: 1–6 px. Karten und Felder sind Rechtecke mit gebrochener
  Kante, keine Pillenformen.
- **Trennung** erfolgt über Linien (`--c-border`), nicht über Schatten.
  Schatten gibt es nur bei Überlagerungen (Mega-Menü, Tooltip).
- **Bewegung**: `--dur-fast` 90 ms, `--dur-base` 160 ms, ausschließlich
  für Zustandswechsel. `prefers-reduced-motion` wird respektiert. Im
  Bereich `[data-bereich='genozid']` sind Animation und Übergang global
  abgeschaltet.
- **Nummerierungen und Eyebrows** nur, wo sie Information tragen: die
  laufende Nummer in der Bereichsnavigation zeigt die Position innerhalb
  des Bereichs; das Eyebrow über einer Überschrift nennt den Bereich.

---

## 8. Sichtbare Leerstellen

Eine gestalterische Kernentscheidung: **Fehlendes wird gestaltet, nicht
versteckt.**

| Fehlt                     | Darstellung                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Beleg für einen Abschnitt | `<Belegluecke>` – gestrichelter Rahmen, Rechercheauftrag im Klartext                   |
| Wert in einer Faktenbox   | kursives „noch nicht belegt“ mit gestrichelter Unterlegung                             |
| Bild                      | gestaltete Leerfläche mit festem Seitenverhältnis, gesuchtem Motiv und Lizenzbedingung |
| Aussprachedatei           | Notenzeichen mit Gedankenstrich, gestrichelt unterlegt                                 |
| Termin eines Festes       | „Terminregel noch nicht belegt“ statt eines geschätzten Datums                         |
| Koordinate                | ausdrücklich als „ungefähr“ gekennzeichnet                                             |

Der Grund ist nicht Ästhetik, sondern Redlichkeit: Ein Gerüst, das wie ein
fertiger Artikel aussieht, ist eine Falschaussage über den eigenen Stand.

---

## 9. Druck

Ein eigenes Stylesheet macht jede Seite zitierfähig auf Papier: Die
Belegspalte wandert in den Lesefluss, externe Links bekommen ihre URL
hinter den Text, Aufklappboxen sind geöffnet, interaktive Bereiche
entfallen, und jede Seite trägt einen Druckvermerk mit Titel, Adresse,
Abrufdatum und Bearbeitungsstand.

---

## 10. Was bewusst fehlt

- **Keine `dark:`-Varianten von Tailwind.** Der dunkle Modus entsteht
  vollständig über semantische Tokens; es gibt keine zweite Farbwahrheit.
- **Kein Cookie-Banner**, weil es nichts einzuwilligen gibt.
- **Keine Ladebalken, keine Skeletons.** Die Seiten sind statisch.
- **Keine Karten-Kacheln von fremden Servern** in der Voreinstellung.
- **Kein Logo mit Symbolcharakter**, das als Zeichen der Gemeinschaft
  missverstanden werden könnte.
