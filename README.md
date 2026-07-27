# Êzîdî-Wissensportal

Ein deutschsprachiges Wissensportal über die Êzîdî – Religion, Geschichte,
Gesellschaftsordnung, Sprache, Verfolgungsgeschichte und Gegenwart.

**Stand: Das Gerüst steht, die inhaltliche Recherche hat noch nicht
begonnen.** Alle 162 Seiten existieren als Route mit vollständigem Layout,
Gliederung, Rechercheauftrag und offenen Fragen. Es steht bewusst kein
vorläufiger Text darin, der wie gesichertes Wissen aussehen könnte.

---

## In fünf Schritten starten

```bash
# 1. Voraussetzung: Node >= 22.12
node --version

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten  →  http://localhost:4321
npm run dev

# 4. Produktionsbau (erzeugt auch Suchindex, OG-Bilder und Berichte)
npm run build

# 5. Ergebnis lokal ansehen  →  http://localhost:4321
npm run preview
```

Die Volltextsuche funktioniert erst nach `npm run build`; im
Entwicklungsserver sagt die Suchseite das ausdrücklich.

---

## Was das Portal ausmacht

**Der Belegapparat ist das Hauptelement, nicht das Beiwerk.** Neben jedem
Artikel läuft eine Belegspalte mit: Bearbeitungsstand, Sicherheit der
Darstellung, Perspektive (Selbstdarstellung oder Forschung), Belegquote,
Zahl der markierten Beleglücken, schwächster Quelle der Seite, offenen
Recherchefragen und dem Quellenverzeichnis. Sie kommt ohne JavaScript aus.

**Der Build bricht ab, wenn Belege fehlen.** `npm run check:content` prüft
unter anderem: Pflichtfelder, Belegpflicht ab `status != 'stub'`,
zitierte Quellen-IDs, Glossarbezüge, interne Verweise, Bildnachweise,
Abrufdaten bei Webquellen und ungeprüfte bibliografische Angaben.

**Keine Tracker, keine Cookies, keine Drittdienste.** Schriften, Suchindex
und Kartendaten liegen lokal. Deshalb gibt es kein Cookie-Banner – und die
Datenschutzerklärung kann das ohne Einschränkung sagen.

**Barrierefreiheit ist geprüft, nicht behauptet.** 160 Playwright-Tests
auf Desktop und Mobil, darunter axe-Prüfungen auf 17 Routen in beiden
Farbschemata. Kontrastwerte werden gegen die Token-Datei nachgerechnet,
Glyphenabdeckung für ê î û ş ç und Arabisch gegen die Schriftdateien.

---

## Befehle

| Befehl                            | Wirkung                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                     | Entwicklungsserver                                               |
| `npm run build`                   | Bau + Pagefind-Index + `content-report.md` + `RESEARCH-BRIEF.md` |
| `npm run preview`                 | gebautes Verzeichnis lokal ausliefern                            |
| `npm run check`                   | `astro check` (Typen)                                            |
| `npm run check:content`           | Inhalte prüfen – **das Build-Gate**                              |
| `npm run check:links`             | alle internen Links und Sprungmarken im Bau                      |
| `npm run report:content`          | Berichte neu erzeugen, ohne zu bauen                             |
| `npm test`                        | Unit-Tests (Kontrast, Schriften, i18n, Zitation)                 |
| `npm run test:e2e`                | Playwright: Rauchtests und Barrierefreiheit                      |
| `npm run lint` / `npm run format` | ESLint / Prettier                                                |
| `npm run verify`                  | Inhalte + Typen + Lint + Tests + Bau                             |

---

## Aufbau

```
src/
  components/
    ui/          Kopf, Fuß, Navigation, Brotkrume, Inhaltsverzeichnis …
    content/     Belegapparat, Faktenbox, Zitat, Glossarverweis …
    spezial/     Zeitleiste, Karte, Jahreskalender, Standdiagramm, Glossarindex
    mdx.ts       Komponenten, die in MDX ohne Import verfügbar sind
  layouts/       BaseLayout (Grundgerüst), ArtikelLayout, SeitenLayout
  pages/[lang]/  alle Routen, sprachpräfixiert
  content/       die Inhalte (siehe CONTENT-GUIDE.md)
  i18n/          Sprachkonfiguration, Oberflächentexte, Pfadhilfen
  lib/           Bereiche, Navigation, Zitation, OG-Bilder, remark-Plugin
  styles/        tokens.css, typography.css, global.css, print.css
scripts/
  plan/          Bauplan des Gerüsts
  generate-stubs.mjs   erzeugt die Inhaltsgerüste
  check-content.ts     Build-Gate
  build-report.ts      Content-Report und Research-Brief
  link-check.ts        Linkprüfung im Bau
tests/
  unit/          Vitest
  e2e/           Playwright und axe-core
public/fonts/    lokal gehostete Schriften samt Lizenzen
```

**Begleitende Dokumente**

| Datei               | Inhalt                                                     |
| ------------------- | ---------------------------------------------------------- |
| `DESIGN.md`         | Gestaltungsplan, Selbstkritik, Farb- und Schriftbegründung |
| `DECISIONS.md`      | alle getroffenen Entscheidungen mit Begründung             |
| `STYLEGUIDE.md`     | Umschrift, Terminologie, redaktionelle Sprachregeln        |
| `CONTENT-GUIDE.md`  | wie Inhalte angelegt und gepflegt werden                   |
| `RESEARCH-BRIEF.md` | jede offene Recherchefrage mit Seitenzuordnung             |
| `content-report.md` | Belegquote je Bereich, automatisch erzeugt                 |

---

## Sprachen

`/de/` ist die Primärsprache und vollständig. `/en/`, `/ku/` und `/ar/`
existieren als vollständige Routen mit Sprachumschalter; die arabische
Route ist RTL. Solange keine Übersetzung vorliegt, bedient die deutsche
Fassung alle Routen – `hreflang` und Sprachumschalter verweisen dabei nur
auf tatsächlich vorhandene Fassungen und sagen es, wenn eine fehlt.

Übersetzt wird erst, wenn die deutsche Fassung `status: belegt` erreicht
hat.

---

## Betrieb und Deployment

Statischer Export – `npm run build` erzeugt `dist/`, das jeder Webserver
und jeder Static-Host ausliefern kann.

**Umgebungsvariablen**

| Variable                   | Zweck                                                                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`                 | Produktionsadresse. Steuert Canonical, hreflang, Sitemap, RSS und OG-Bilder. **Vor der Veröffentlichung setzen.**                                          |
| `PUBLIC_MAP_STYLE_URL`     | optionale Hintergrundkarte für MapLibre. Ohne Angabe wird kein fremder Server kontaktiert. Wird sie gesetzt, muss die Datenschutzerklärung ergänzt werden. |
| `PLAYWRIGHT_CHROMIUM_PATH` | vorhandenes Chromium für die Tests                                                                                                                         |

**Netlify**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
[build.environment]
  NODE_VERSION = "22"
```

**Cloudflare Pages** — Build `npm run build`, Ausgabe `dist`,
`NODE_VERSION=22`.

**Vercel** — Framework „Astro“, Ausgabe `dist`, Node 22.

**Eigener Server** — `dist/` ausliefern. Empfohlen: `404.html` als
Fehlerseite eintragen, `Cache-Control: immutable` für `/_astro/`,
`/fonts/` und `/og/`.

**Vor der ersten Veröffentlichung zwingend:**

1. `SITE_URL` setzen.
2. Impressum, Datenschutzerklärung und Barrierefreiheitserklärung
   ausfüllen und rechtlich prüfen lassen – sie sind Platzhalter.
3. Meldeweg für Korrekturhinweise einrichten.
4. `RESEARCH-BRIEF.md`, Abschnitt „Zwingend zu klären“, abarbeiten.

---

## Mitwirken

Inhaltliche Beiträge folgen `CONTENT-GUIDE.md` und `STYLEGUIDE.md`.
Vor jedem Commit:

```bash
npm run verify
```

Nicht verhandelbar sind die redaktionellen Leitplanken: Selbstbezeichnung
vor Fremdbezeichnung, Trennung von Selbstdarstellung und Forschung,
Umstrittenes als umstritten, politische Zurückhaltung, religiöse
Sensibilität, Opferschutz, strikte Bildrechte, keine Rechts- oder
Therapieberatung.

---

## Lizenz

- **Inhalte**: CC BY-SA 4.0, sofern nicht anders angegeben.
- **Schriften**: SIL Open Font License 1.1 (Lizenztexte in
  `public/fonts/`).
- **Quellcode**: noch festzulegen – siehe `RESEARCH-BRIEF.md`.
