/**
 * Bereiche (Sektionen) des Portals – die oberste Ebene der
 * Informationsarchitektur aus Abschnitt 5 der Projektvorgabe.
 *
 * Diese Datei ist die einzige Wahrheit für Bereichs-Slugs, Reihenfolge
 * und Bereichs-Metadaten. Die Seitenliste je Bereich wird NICHT hier
 * gepflegt, sondern aus der `articles`-Collection abgeleitet
 * (src/lib/navigation.ts) – so kann eine Seite nicht in der Navigation
 * stehen, ohne dass es sie als Inhalt gibt.
 *
 * Die `intro`-Texte beschreiben, was ein Bereich enthält. Sie sind
 * Meta-Text über das Portal, keine inhaltlichen Aussagen über die Êzîdî,
 * und brauchen deshalb keinen Quellenbeleg.
 */

export const sectionIds = [
  'ueberblick',
  'religion',
  'gesellschaft',
  'heilige-orte',
  'feste',
  'sprache',
  'geschichte',
  'genozid',
  'gegenwart',
  'missverstaendnisse',
  'kultur',
  'personen',
  'wissenschaft',
  'vermittlung',
  'meta',
] as const;

export type SectionId = (typeof sectionIds)[number];

/** Gruppen für das Mega-Menü. */
export type NavGroup = 'wissen' | 'geschichte' | 'gegenwart' | 'nachschlagen' | 'projekt';

export interface SectionDef {
  readonly id: SectionId;
  /** URL-Segment unterhalb des Sprachpräfixes. */
  readonly slug: string;
  readonly title: string;
  /** Kurzcharakterisierung für Menü und Bereichskarten. */
  readonly kurz: string;
  /** Einleitung der Sammelseite. Beschreibt den Bereich, behauptet nichts. */
  readonly intro: string;
  readonly group: NavGroup;
  readonly order: number;
  /** Bereichsweiter Inhaltshinweis (Abschnitt 5.9). */
  readonly contentWarning?: boolean;
  /** Bereiche, auf die die Sammelseite unter „Weiterführend“ verweist. */
  readonly weiterfuehrend: readonly SectionId[];
}

export const sections: readonly SectionDef[] = [
  {
    id: 'ueberblick',
    slug: 'ueberblick',
    title: 'Überblick',
    kurz: 'Einstieg: Wer sind die Êzîdî, wie nennen sie sich, wo leben sie?',
    intro:
      'Der Überblick bündelt die Fragen, die am Anfang jeder Beschäftigung mit den Êzîdî stehen: Wie bezeichnet sich die Gemeinschaft selbst, welche Fremdbezeichnungen sind im Deutschen verbreitet, wie verhalten sich religiöse und ethnische Zugehörigkeit zueinander, und wo leben Êzîdî heute. Die Seiten dieses Bereichs sind als Einstieg gedacht und verweisen für jede Einzelfrage in die vertiefenden Bereiche.',
    group: 'wissen',
    order: 1,
    weiterfuehrend: ['religion', 'geschichte', 'missverstaendnisse'],
  },
  {
    id: 'religion',
    slug: 'religion',
    title: 'Religion und Glaube',
    kurz: 'Gottesbild, Tawûsî Melek, Überlieferung, Praxis, Forschungsdebatten.',
    intro:
      'Dieser Bereich stellt die Glaubensvorstellungen und die religiöse Praxis dar. Er trennt dabei durchgehend zwischen der Selbstdarstellung der Gemeinschaft und dem religionswissenschaftlichen Forschungsstand. Wo Wissensbestände innerhalb der Gemeinschaft nur bestimmten Gruppen zugänglich sind, wird das benannt und nicht durch Spekulation gefüllt.',
    group: 'wissen',
    order: 2,
    weiterfuehrend: ['gesellschaft', 'feste', 'missverstaendnisse'],
  },
  {
    id: 'gesellschaft',
    slug: 'gesellschaft',
    title: 'Gesellschaftsordnung',
    kurz: 'Stände, Ämter, Heiratsregeln, Institutionen, Rolle von Frauen.',
    intro:
      'Die êzîdîsche Gesellschaftsordnung verbindet religiöse Ämter, Verwandtschaftsstrukturen und soziale Bündnisse. Dieser Bereich beschreibt ihre Bestandteile, ihre Begründungen aus der Gemeinschaft heraus und die Debatten, die gegenwärtig darüber geführt werden – besonders in der Diaspora.',
    group: 'wissen',
    order: 3,
    weiterfuehrend: ['religion', 'gegenwart', 'personen'],
  },
  {
    id: 'heilige-orte',
    slug: 'heilige-orte',
    title: 'Heilige Orte',
    kurz: 'Laliş, Heiligtümer in Şingal und Şêxan, Sakralarchitektur, Diaspora.',
    intro:
      'Heilige Orte sind für die êzîdîsche Religionspraxis zentral. Der Bereich beschreibt Laliş als Hauptheiligtum, weitere Heiligtümer und Mezar in den Siedlungsgebieten, die Bauformen der Sakralarchitektur sowie Stätten in Armenien, Georgien und der Diaspora. Eigene Seiten dokumentieren Zerstörungen seit 2014 und den Stand des Wiederaufbaus.',
    group: 'wissen',
    order: 4,
    weiterfuehrend: ['religion', 'feste', 'genozid'],
  },
  {
    id: 'feste',
    slug: 'feste',
    title: 'Feste, Kalender und Riten',
    kurz: 'Jahresfeste, Fastenzeiten, Prozessionen, Riten des Lebenszyklus.',
    intro:
      'Das êzîdîsche Festjahr folgt einem eigenen Kalender, dessen Termine sich nicht deckungsgleich in den gregorianischen Kalender übertragen lassen. Dieser Bereich behandelt die Feste einzeln, erklärt die Kalendersysteme und ihre Umrechnung und stellt die Riten des Lebenszyklus dar.',
    group: 'wissen',
    order: 5,
    weiterfuehrend: ['religion', 'heilige-orte', 'kultur'],
  },
  {
    id: 'sprache',
    slug: 'sprache',
    title: 'Sprache und Namen',
    kurz: 'Kurmancî, religiöse Sprachschichten, Umschrift, Namenkunde.',
    intro:
      'Sprache ist für die êzîdîsche Überlieferung mehr als ein Verständigungsmittel: Die religiösen Texte sind mündlich in Kurmancî überliefert. Dieser Bereich behandelt die Stellung der Sprache, ihre Schriftsysteme, die auf diesem Portal verbindlich verwendete Umschrift sowie Namen- und Stammesbezeichnungen.',
    group: 'wissen',
    order: 6,
    weiterfuehrend: ['religion', 'kultur', 'vermittlung'],
  },
  {
    id: 'geschichte',
    slug: 'geschichte',
    title: 'Geschichte',
    kurz: 'Von der Ursprungsdebatte über die osmanische Zeit bis nach 2003.',
    intro:
      'Die Geschichte der Êzîdî ist über weite Strecken eine Geschichte von Herrschaftsverhältnissen, Verfolgung und Erinnerung. Dieser Bereich stellt sie chronologisch dar, kennzeichnet umstrittene Datierungen als umstritten und verweist für die Ereignisse ab August 2014 auf den eigenen Bereich zum Genozid.',
    group: 'geschichte',
    order: 7,
    weiterfuehrend: ['genozid', 'ueberblick', 'wissenschaft'],
  },
  {
    id: 'genozid',
    slug: 'genozid',
    title: 'Genozid 2014 und Verfolgung',
    kurz: 'Ablauf, völkerrechtliche Einordnung, Anerkennungen, Aufarbeitung.',
    intro:
      'Dieser Bereich dokumentiert die Verbrechen des sogenannten Islamischen Staates an den Êzîdî ab August 2014, ihre völkerrechtliche Einordnung, die Anerkennungen als Völkermord und den Stand der Aufarbeitung. Die Darstellung verzichtet ausnahmslos auf Gewaltdetails, identifizierbare Opferfotos und Täterpropaganda; sie nennt keine Namen von Überlebenden sexualisierter Gewalt ohne dokumentierte öffentliche Selbstnennung.',
    group: 'geschichte',
    order: 8,
    contentWarning: true,
    weiterfuehrend: ['geschichte', 'gegenwart', 'wissenschaft'],
  },
  {
    id: 'gegenwart',
    slug: 'gegenwart',
    title: 'Gegenwart und Diaspora',
    kurz: 'Lage in Irak, Syrien, Kaukasus – und die Diaspora in Deutschland.',
    intro:
      'Wo leben Êzîdî heute, unter welchen rechtlichen und sozialen Bedingungen, und welche Debatten prägen die Gemeinschaft? Der Bereich behandelt die Lage in den Herkunftsregionen und die Diaspora mit einem Schwerpunkt auf Deutschland. Er ersetzt keine Rechts-, Asyl- oder Therapieberatung, sondern verweist auf qualifizierte Stellen.',
    group: 'gegenwart',
    order: 9,
    weiterfuehrend: ['genozid', 'gesellschaft', 'vermittlung'],
  },
  {
    id: 'missverstaendnisse',
    slug: 'missverstaendnisse',
    title: 'Missverständnisse und Desinformation',
    kurz: 'Behauptung, Faktenlage, Quelle, Entstehungsgeschichte.',
    intro:
      'Über die Êzîdî kursieren seit Jahrhunderten Falschbehauptungen, die als Rechtfertigung von Verfolgung gedient haben und bis heute wirken. Jeder Eintrag folgt demselben Muster: Behauptung, Faktenlage, Quelle und die Frage, warum die Behauptung entstanden ist.',
    group: 'wissen',
    order: 10,
    weiterfuehrend: ['religion', 'geschichte', 'wissenschaft'],
  },
  {
    id: 'kultur',
    slug: 'kultur',
    title: 'Kultur',
    kurz: 'Musik, Tanz, Tracht, Küche, Handwerk, Literatur, Gegenwartskunst.',
    intro:
      'Kultur wird hier nicht als Folklore behandelt, sondern als lebendige Praxis mit religiösen, regionalen und diasporischen Ausprägungen. Der Bereich umfasst Musik und Tanz, Kleidung, Küche, Handwerk, Erzählungen sowie zeitgenössische Kunst, Film und Fotografie aus der Community.',
    group: 'gegenwart',
    order: 11,
    weiterfuehrend: ['feste', 'sprache', 'personen'],
  },
  {
    id: 'personen',
    slug: 'personen',
    title: 'Personen',
    kurz: 'Würdenträger, historische Persönlichkeiten, Aktivistinnen, Forschende.',
    intro:
      'Ein Verzeichnis von Personen, die für die Geschichte und Gegenwart der Êzîdî öffentlich relevant sind. Aufgenommen werden ausschließlich belegte, öffentlich relevante Informationen. Bei lebenden Personen ist die Darstellung bewusst zurückhaltend; Privates bleibt außen vor, Zitate werden nie sinngemäß rekonstruiert.',
    group: 'gegenwart',
    order: 12,
    weiterfuehrend: ['geschichte', 'gesellschaft', 'kultur'],
  },
  {
    id: 'wissenschaft',
    slug: 'wissenschaft',
    title: 'Wissenschaft und Quellen',
    kurz: 'Forschungsüberblick, Bibliografie, Archive, offene Kontroversen.',
    intro:
      'Dieser Bereich macht die Grundlage des Portals sichtbar: welche Forschung es gibt, welche Quellen benutzt werden, wie verlässlich sie sind und wo die Forschung selbst uneins ist. Er enthält den Forschungsüberblick, die kommentierte Bibliografie, Hinweise auf Primärquellen und Archive sowie eine eigene Seite zu offenen Kontroversen.',
    group: 'nachschlagen',
    order: 13,
    weiterfuehrend: ['vermittlung', 'geschichte', 'religion'],
  },
  {
    id: 'vermittlung',
    slug: 'vermittlung',
    title: 'Wissen und Vermittlung',
    kurz: 'Glossar, FAQ, Zeitleiste, Karten, Unterrichtsmaterial, Anlaufstellen.',
    intro:
      'Werkzeuge zum Nachschlagen und Weitergeben: Glossar, häufige Fragen, die filterbare Zeitleiste, Kartensammlung, Material für Schule und Unterricht, eine Mediathek mit Verweisen sowie Hinweise auf Beratungs- und Hilfsangebote.',
    group: 'nachschlagen',
    order: 14,
    weiterfuehrend: ['wissenschaft', 'ueberblick', 'gegenwart'],
  },
  {
    id: 'meta',
    slug: 'meta',
    title: 'Über dieses Projekt',
    kurz: 'Redaktionelle Grundsätze, Mitwirken, Changelog, Rechtliches.',
    intro:
      'Wie dieses Portal arbeitet, wie mit Unsicherheit und Korrekturen umgegangen wird, wie man mitwirkt und Fehler meldet – dazu die rechtlich erforderlichen Seiten und das Änderungsprotokoll der Inhalte.',
    group: 'projekt',
    order: 15,
    weiterfuehrend: ['wissenschaft', 'vermittlung'],
  },
] as const;

export const sectionById: Record<SectionId, SectionDef> = Object.fromEntries(
  sections.map((s) => [s.id, s]),
) as Record<SectionId, SectionDef>;

export function getSection(id: string): SectionDef | undefined {
  return sectionById[id as SectionId];
}

export const navGroups: { id: NavGroup; title: string }[] = [
  { id: 'wissen', title: 'Grundlagen' },
  { id: 'geschichte', title: 'Geschichte und Verfolgung' },
  { id: 'gegenwart', title: 'Gegenwart, Kultur, Personen' },
  { id: 'nachschlagen', title: 'Nachschlagen und Vermitteln' },
  { id: 'projekt', title: 'Projekt' },
];

/**
 * Werkzeugseiten, die keiner Artikel-Collection entstammen, aber in
 * Navigation, Sitemap und Link-Prüfung auftauchen müssen.
 */
export interface ToolPage {
  readonly slug: string;
  readonly title: string;
  readonly kurz: string;
  readonly group: NavGroup;
}

export const toolPages: readonly ToolPage[] = [
  {
    slug: 'glossar',
    title: 'Glossar',
    kurz: 'Alle Begriffe alphabetisch, mit Kurmancî-Original und Aussprache.',
    group: 'nachschlagen',
  },
  {
    slug: 'quellen',
    title: 'Quellenverzeichnis',
    kurz: 'Vollständige Bibliografie, filterbar nach Art, Sprache, Verlässlichkeit.',
    group: 'nachschlagen',
  },
  {
    slug: 'zeitleiste',
    title: 'Zeitleiste',
    kurz: 'Die gesamte Geschichte, filterbar nach Epoche und Thema.',
    group: 'nachschlagen',
  },
  {
    slug: 'kalender',
    title: 'Festkalender',
    kurz: 'Das Festjahr im Überblick, mit Kalendersystem und Umrechnung.',
    group: 'nachschlagen',
  },
  {
    slug: 'karten',
    title: 'Karten',
    kurz: 'Siedlungsgebiete, heilige Orte, Fluchtbewegungen, Diaspora.',
    group: 'nachschlagen',
  },
  {
    slug: 'faq',
    title: 'Häufige Fragen',
    kurz: 'Kurze Antworten mit Beleg, nach Themen sortiert.',
    group: 'nachschlagen',
  },
  {
    slug: 'unterricht',
    title: 'Schule und Unterricht',
    kurz: 'Arbeitsblätter, Quellenauszüge, Unterrichtsvorschläge.',
    group: 'nachschlagen',
  },
  {
    slug: 'mediathek',
    title: 'Mediathek',
    kurz: 'Dokumentationen, Podcasts, Ausstellungen – verlinkt, nicht eingebettet.',
    group: 'nachschlagen',
  },
  {
    slug: 'rezepte',
    title: 'Rezepte',
    kurz: 'Speisen mit Anlass, Region und Einordnung.',
    group: 'gegenwart',
  },
  {
    slug: 'orte',
    title: 'Ortsverzeichnis',
    kurz: 'Heiligtümer, Siedlungen und Gedenkorte mit Koordinaten.',
    group: 'wissen',
  },
  {
    slug: 'suche',
    title: 'Suche',
    kurz: 'Volltextsuche über alle Inhalte – läuft vollständig im Browser.',
    group: 'nachschlagen',
  },
  {
    slug: 'aenderungen',
    title: 'Änderungsprotokoll',
    kurz: 'Was wann geändert, ergänzt oder korrigiert wurde.',
    group: 'projekt',
  },
];

export const toolPageBySlug: Record<string, ToolPage> = Object.fromEntries(
  toolPages.map((p) => [p.slug, p]),
);
