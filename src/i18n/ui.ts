import type { Locale } from './config';

/**
 * Oberflächentexte.
 *
 * `de` ist die Referenz und vollständig. Jede andere Sprache darf Lücken
 * haben; fehlende Schlüssel fallen auf `de` zurück (siehe `t()` in
 * ./utils.ts). Der Test tests/unit/i18n.test.ts stellt sicher, dass keine
 * Sprache Schlüssel enthält, die es in `de` nicht gibt.
 */

export const ui = {
  de: {
    'site.name': 'Êzîdî-Wissensportal',
    'site.tagline': 'Religion, Geschichte, Kultur und Gegenwart der Êzîdî',
    'site.description':
      'Ein belegtes, frei zugängliches Wissensportal über die Êzîdî – ihre Religion, Geschichte, Gesellschaftsordnung, Sprache, Verfolgungsgeschichte und Gegenwart.',

    'nav.main': 'Hauptnavigation',
    'nav.menu': 'Menü',
    'nav.open': 'Menü öffnen',
    'nav.close': 'Menü schließen',
    'nav.breadcrumb': 'Sie befinden sich hier',
    'nav.sections': 'Bereiche',
    'nav.tools': 'Nachschlagen',
    'nav.meta': 'Über das Projekt',
    'nav.home': 'Startseite',
    'nav.skipToContent': 'Direkt zum Inhalt',
    'nav.skipToNav': 'Direkt zur Navigation',
    'nav.skipToSearch': 'Direkt zur Suche',
    'nav.inThisSection': 'In diesem Bereich',
    'nav.toc': 'Auf dieser Seite',
    'nav.tocToggle': 'Inhaltsverzeichnis anzeigen',
    'nav.readingProgress': 'Lesefortschritt',

    'lang.switch': 'Sprache wechseln',
    'lang.current': 'Aktuelle Sprache',
    'lang.notTranslated': 'Diese Seite liegt noch nicht in dieser Sprache vor.',
    'lang.fallbackNotice':
      'Die Oberfläche dieser Sprache ist erst teilweise übersetzt. Nicht übersetzte Elemente erscheinen auf Deutsch.',

    'theme.toggle': 'Farbschema wechseln',
    'theme.light': 'Helles Schema',
    'theme.dark': 'Dunkles Schema',
    'theme.system': 'Systemeinstellung',

    'search.label': 'Suche',
    'search.open': 'Suche öffnen',
    'search.placeholder': 'Begriff, Ort, Person, Jahr …',
    'search.submit': 'Suchen',
    'search.results': 'Treffer',
    'search.noResults': 'Keine Treffer.',
    'search.noJs':
      'Die Volltextsuche benötigt JavaScript. Ohne JavaScript führen das Glossar, die Bereichsübersicht und die Sitemap zum Ziel.',
    'search.hint': 'Die Suche läuft vollständig im Browser. Es werden keine Suchbegriffe übertragen.',

    'status.stub': 'Gerüst',
    'status.entwurf': 'Entwurf',
    'status.belegt': 'Belegt',
    'status.geprüft': 'Geprüft',
    'status.label': 'Bearbeitungsstand',
    'status.stub.help':
      'Diese Seite ist ein Gerüst: Gliederung und Rechercheauftrag stehen, der Inhalt fehlt noch.',
    'status.entwurf.help': 'Entwurfsfassung – Aussagen sind noch nicht vollständig belegt.',
    'status.belegt.help': 'Alle Aussagen dieser Seite sind mit Quellen belegt.',
    'status.geprüft.help':
      'Belegt und zusätzlich fachlich oder von Angehörigen der Gemeinschaft gegengelesen.',

    'confidence.label': 'Sicherheit der Darstellung',
    'confidence.gesichert': 'Forschungsstand gesichert',
    'confidence.umstritten': 'In der Forschung umstritten',
    'confidence.unklar': 'Quellenlage unklar',

    'article.lead': 'In Kürze',
    'article.updated': 'Zuletzt aktualisiert',
    'article.reviewedBy': 'Gegengelesen von',
    'article.notReviewed': 'noch nicht gegengelesen',
    'article.openQuestions': 'Offene Recherchefragen',
    'article.openQuestionsHelp':
      'Diese Punkte sind bewusst offen ausgewiesen, statt sie zu überschreiben.',
    'article.sources': 'Quellen',
    'article.relatedGlossary': 'Begriffe auf dieser Seite',
    'article.readMore': 'Weiterlesen',
    'article.related': 'Weiterführend',
    'article.reportError': 'Fehler melden',
    'article.reportErrorLong': 'Auf dieser Seite einen Fehler melden',
    'article.perspective': 'Perspektive',
    'article.perspective.emisch': 'Selbstdarstellung der Gemeinschaft',
    'article.perspective.etisch': 'Forschungsstand von außen',
    'article.perspective.gemischt': 'beide Perspektiven, jeweils gekennzeichnet',
    'article.printNote': 'Abgerufen am',
    'article.section': 'Bereich',
    'article.readingTime': 'Lesezeit',
    'article.minutes': 'Min.',

    'apparat.title': 'Belegspalte',
    'apparat.help':
      'Hier laufen Belege, Unsicherheiten und Belegzeichen zur nebenstehenden Textstelle mit.',
    'apparat.empty': 'Für diesen Abschnitt sind noch keine Belege hinterlegt.',
    'apparat.gap': 'Beleglücke',
    'apparat.gapHelp': 'Für diese Passage fehlt noch ein Beleg.',
    'apparat.uncertain': 'Umstritten',
    'apparat.uncertainHelp': 'Zu dieser Aussage stehen sich unterschiedliche Positionen gegenüber.',
    'apparat.toControversies': 'Zur Kontroversen-Seite',

    'cite.source': 'Quelle',
    'cite.toSource': 'Zum Quellennachweis',
    'cite.backToText': 'Zurück zum Text',
    'cite.reliability': 'Verlässlichkeit',
    'cite.accessed': 'abgerufen am',
    'cite.language': 'Sprache',
    'cite.type': 'Art der Quelle',

    'sources.title': 'Quellenverzeichnis',
    'sources.filterType': 'Art',
    'sources.filterLanguage': 'Sprache',
    'sources.filterReliability': 'Verlässlichkeit',
    'sources.all': 'alle',
    'sources.count': 'Einträge',
    'sources.principle': 'Quellenprinzip',

    'glossary.title': 'Glossar',
    'glossary.jumpTo': 'Zum Buchstaben',
    'glossary.term': 'Begriff',
    'glossary.kurmanci': 'Kurmancî',
    'glossary.transcription': 'Umschrift',
    'glossary.pronunciation': 'Aussprache',
    'glossary.meaning': 'Bedeutung',
    'glossary.alsoWritten': 'Auch geschrieben',
    'glossary.seeAlso': 'Siehe auch',
    'glossary.usedOn': 'Erklärt auf',
    'glossary.openEntry': 'Glossareintrag öffnen',
    'glossary.noAudio': 'Aussprachedatei liegt noch nicht vor.',

    'timeline.title': 'Zeitleiste',
    'timeline.filterEpoch': 'Epoche',
    'timeline.filterTopic': 'Thema',
    'timeline.filterReset': 'Filter zurücksetzen',
    'timeline.entries': 'Einträge',
    'timeline.noEntries': 'Keine Einträge für diese Auswahl.',
    'timeline.dateUncertain': 'Datierung unsicher',
    'timeline.firmanMark': 'Firman-Erinnerung',

    'map.title': 'Karte',
    'map.layers': 'Ebenen',
    'map.noJs':
      'Die interaktive Karte benötigt JavaScript. Unten stehen dieselben Orte als Liste mit Koordinaten.',
    'map.listFallback': 'Orte als Liste',
    'map.attribution': 'Kartendaten',

    'calendar.title': 'Festkalender',
    'calendar.month': 'Monat',
    'calendar.movable': 'beweglicher Termin',
    'calendar.system': 'Kalendersystem',
    'calendar.noDate': 'Termin noch nicht hinterlegt',

    'cw.title': 'Inhaltshinweis',
    'cw.genocide':
      'Dieser Bereich behandelt Massengewalt, Verschleppung und sexualisierte Gewalt. Die Darstellung verzichtet auf Gewaltdetails, Opferfotos und Täterpropaganda.',
    'cw.show': 'Inhalt anzeigen',
    'cw.help': 'Hinweis vor dem Weiterlesen',

    'facts.title': 'Kurzfakten',
    'facts.estimate': 'Schätzung',
    'facts.asOf': 'Stand',
    'facts.method': 'Erhebung',

    'person.born': 'geboren',
    'person.died': 'gestorben',
    'person.role': 'Funktion',
    'person.living': 'lebende Person – Darstellung bewusst zurückhaltend',

    'place.coordinates': 'Koordinaten',
    'place.region': 'Region',
    'place.condition': 'Zustand',
    'place.type': 'Art des Ortes',

    'media.type': 'Format',
    'media.duration': 'Dauer',
    'media.external': 'Externer Link',
    'media.externalNote': 'Führt zu einem fremden Angebot. Es werden keine Inhalte eingebettet.',

    'image.credit': 'Bildnachweis',
    'image.license': 'Lizenz',
    'image.missing': 'Für diese Stelle liegt noch kein rechtlich geklärtes Bild vor.',
    'image.missingHelp':
      'Statt eines beliebigen oder KI-erzeugten Bildes steht hier bewusst eine gestaltete Leerfläche.',

    'misconception.claim': 'Behauptung',
    'misconception.facts': 'Faktenlage',
    'misconception.background': 'Warum die Behauptung entstand',

    'teaching.level': 'Altersstufe',
    'teaching.subject': 'Fach',
    'teaching.duration': 'Umfang',
    'teaching.download': 'Material öffnen',

    'recipe.occasion': 'Anlass',
    'recipe.region': 'Region',
    'recipe.ingredients': 'Zutaten',
    'recipe.steps': 'Zubereitung',

    'faq.title': 'Häufige Fragen',
    'faq.byTopic': 'Nach Thema',

    'footer.legal': 'Rechtliches',
    'footer.project': 'Projekt',
    'footer.contact': 'Kontakt',
    'footer.sourcePrinciple':
      'Jede inhaltliche Aussage dieses Portals ist mit einer Quelle belegt oder als offene Frage gekennzeichnet.',
    'footer.noTracking':
      'Keine Tracker, keine Cookies, keine externen Dienste. Deshalb gibt es hier auch kein Cookie-Banner.',
    'footer.license': 'Texte unter CC BY-SA 4.0, sofern nicht anders angegeben.',

    'error.404.title': 'Diese Seite gibt es nicht',
    'error.404.text':
      'Die aufgerufene Adresse führt ins Leere. Suchen Sie im Volltext oder steigen Sie über die Bereiche ein.',
    'error.404.toStart': 'Zur Startseite',

    'general.more': 'Mehr',
    'general.all': 'Alle',
    'general.overview': 'Überblick',
    'general.pages': 'Seiten',
    'general.of': 'von',
    'general.new': 'Neu',
    'general.updated': 'Aktualisiert',
    'general.expand': 'Aufklappen',
    'general.collapse': 'Zuklappen',
    'general.close': 'Schließen',
    'general.scrollTableHint': 'Tabelle seitlich scrollbar',
    'general.externalLink': 'Externer Link',
    'general.toTop': 'Nach oben',
  },

  en: {
    'site.name': 'Êzîdî Knowledge Portal',
    'site.tagline': 'Religion, history, culture and present of the Êzîdî',
    'site.description':
      'A sourced, freely accessible knowledge portal about the Êzîdî – their religion, history, social order, language, persecution and present.',

    'nav.main': 'Main navigation',
    'nav.menu': 'Menu',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',
    'nav.breadcrumb': 'You are here',
    'nav.sections': 'Sections',
    'nav.tools': 'Reference',
    'nav.meta': 'About the project',
    'nav.home': 'Home',
    'nav.skipToContent': 'Skip to content',
    'nav.skipToNav': 'Skip to navigation',
    'nav.skipToSearch': 'Skip to search',
    'nav.inThisSection': 'In this section',
    'nav.toc': 'On this page',
    'nav.tocToggle': 'Show table of contents',
    'nav.readingProgress': 'Reading progress',

    'lang.switch': 'Change language',
    'lang.current': 'Current language',
    'lang.notTranslated': 'This page is not available in this language yet.',
    'lang.fallbackNotice':
      'The interface for this language is only partly translated. Untranslated elements appear in German.',

    'theme.toggle': 'Change colour scheme',
    'theme.light': 'Light scheme',
    'theme.dark': 'Dark scheme',
    'theme.system': 'System setting',

    'search.label': 'Search',
    'search.open': 'Open search',
    'search.placeholder': 'Term, place, person, year …',
    'search.submit': 'Search',
    'search.results': 'Results',
    'search.noResults': 'No results.',
    'search.noJs':
      'Full-text search requires JavaScript. Without it, the glossary, section overviews and the sitemap will get you there.',
    'search.hint': 'Search runs entirely in your browser. No query is transmitted.',

    'status.stub': 'Outline',
    'status.entwurf': 'Draft',
    'status.belegt': 'Sourced',
    'status.geprüft': 'Reviewed',
    'status.label': 'Editorial status',

    'article.lead': 'In brief',
    'article.updated': 'Last updated',
    'article.openQuestions': 'Open research questions',
    'article.sources': 'Sources',
    'article.related': 'Further reading',
    'article.reportError': 'Report an error',
    'article.section': 'Section',
    'article.readingTime': 'Reading time',
    'article.minutes': 'min',

    'apparat.title': 'Source column',
    'apparat.gap': 'Missing source',
    'apparat.uncertain': 'Contested',

    'cite.source': 'Source',
    'cite.accessed': 'accessed',
    'cite.language': 'Language',

    'sources.title': 'Bibliography',
    'glossary.title': 'Glossary',
    'timeline.title': 'Timeline',
    'map.title': 'Map',
    'calendar.title': 'Festival calendar',
    'cw.title': 'Content note',
    'faq.title': 'Frequently asked questions',

    'footer.legal': 'Legal',
    'footer.project': 'Project',
    'footer.contact': 'Contact',
    'footer.noTracking':
      'No trackers, no cookies, no third-party services. That is why there is no cookie banner here.',

    'error.404.title': 'This page does not exist',
    'error.404.toStart': 'To the home page',

    'general.more': 'More',
    'general.all': 'All',
    'general.overview': 'Overview',
    'general.close': 'Close',
    'general.toTop': 'Back to top',
  },

  ku: {
    'site.name': 'Portala Zanînê ya Êzîdiyan',
    'site.tagline': 'Ol, dîrok, çand û îro ya Êzîdiyan',
    'nav.home': 'Destpêk',
    'nav.sections': 'Beş',
    'nav.menu': 'Menû',
    'lang.switch': 'Ziman biguhêre',
    'search.label': 'Lêgerîn',
    'glossary.title': 'Ferheng',
    'timeline.title': 'Rêzeya demê',
    'map.title': 'Nexşe',
    'article.sources': 'Çavkanî',
    'general.toTop': 'Bo jor',
  },

  ar: {
    'site.name': 'بوابة المعرفة الإيزيدية',
    'site.tagline': 'الدين والتاريخ والثقافة والحاضر لدى الإيزيديين',
    'nav.home': 'الصفحة الرئيسية',
    'nav.sections': 'الأقسام',
    'nav.menu': 'القائمة',
    'lang.switch': 'تغيير اللغة',
    'search.label': 'بحث',
    'glossary.title': 'مسرد المصطلحات',
    'timeline.title': 'الخط الزمني',
    'map.title': 'خريطة',
    'article.sources': 'المصادر',
    'general.toTop': 'إلى الأعلى',
  },
} as const satisfies Record<Locale, Partial<Record<string, string>>>;

export type UIKey = keyof (typeof ui)['de'];
