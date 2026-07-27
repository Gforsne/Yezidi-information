/**
 * Bauplan der Bereiche „Überblick“ und „Religion und Glaube“.
 *
 * Zur Lesart der Felder siehe scripts/plan/index.mjs.
 *
 * WICHTIG: `lead` beschreibt, was die Seite behandeln WIRD. Er ist
 * Meta-Text über das Portal und enthält keine Sachaussage über die
 * Êzîdî – solche Aussagen entstehen erst in der Recherchephase und
 * brauchen dann einen Beleg.
 */

export const ueberblick = [
  {
    s: 'ueberblick',
    slug: 'wer-sind-die-ezidi',
    t: 'Wer sind die Êzîdî?',
    o: 10,
    lead: 'Diese Seite wird einen zusammenhängenden Einstieg in rund zehn Minuten Lesezeit geben: Selbstbezeichnung, Religion, Siedlungsgebiete, Sprache, Gesellschaftsordnung und Verfolgungsgeschichte im Überblick. Sie verweist für jede Einzelfrage auf die vertiefenden Bereiche, statt sie hier verkürzt zu beantworten. Fachbegriffe werden beim ersten Auftreten erklärt und im Glossar verlinkt. Wo Angaben umstritten sind, wird das an Ort und Stelle gekennzeichnet.',
    tags: ['einstieg', 'überblick', 'grundlagen'],
    p: 'gemischt',
    g: ['ezidi', 'ezidiyati', 'kurmanci', 'lalis'],
    w: [
      'ueberblick/selbstbezeichnung-und-fremdbezeichnungen',
      'religion/gottesbild-und-monotheismus',
      'geschichte/vorgeschichte-und-ursprungsdebatte',
    ],
    auftrag:
      'Einen belegten Überblickstext erarbeiten, der ohne Vorwissen lesbar ist und jede Aussage mit einer Quelle der obersten beiden Verlässlichkeitsstufen stützt. Keine Zahl ohne Herkunft, Stichjahr und Erhebungsmethode.',
    gl: [
      [
        'Selbstbezeichnung und Bezeichnung der Religion',
        ['Êzîdî und Êzîdiyatî', 'Deutsche Schreibweisen'],
        'Belegen, wie sich die Gemeinschaft selbst bezeichnet und welche Bezeichnung für die Religion gebräuchlich ist. Emische Quellen ausdrücklich als solche kennzeichnen.',
      ],
      [
        'Wo Êzîdî leben',
        ['Herkunftsregionen', 'Diaspora'],
        'Siedlungsschwerpunkte mit Quelle und Stichjahr belegen. Bevölkerungszahlen nur als Spanne mehrerer Schätzungen darstellen.',
      ],
      [
        'Religion in Grundzügen',
        ['Gottesbild', 'Tawûsî Melek', 'Mündliche Überlieferung'],
        'Nur so viel darstellen, wie ohne Vertiefung tragfähig ist, und konsequent auf den Religionsbereich verweisen. Nichtöffentliche Wissensbestände nicht rekonstruieren.',
      ],
      [
        'Gesellschaftsordnung in Grundzügen',
        ['Die drei Stände', 'Heiratsregeln'],
        'Die Grundzüge belegen und dabei jede Formulierung vermeiden, die eine Rangordnung der Stände behauptet.',
      ],
      [
        'Sprache',
        [],
        'Stellung des Kurmancî für die religiöse Überlieferung belegen; Verhältnis zu weiteren Sprachvarietäten darstellen.',
      ],
      [
        'Verfolgungsgeschichte in Grundzügen',
        ['Die Firman-Erinnerung', 'Der Genozid ab 2014'],
        'Knapp, ohne Gewaltdetails, mit Verweis auf den Genozid-Bereich. Zahlen nur mit institutioneller Quelle.',
      ],
      [
        'Häufige Missverständnisse',
        [],
        'Die drei verbreitetsten Falschbehauptungen benennen und auf den Bereich Missverständnisse verweisen.',
      ],
    ],
    q: [
      'Welche deutschsprachige Überblicksdarstellung eignet sich als Leitquelle, ohne veraltet zu sein?',
      'Welche Selbstdarstellungen êzîdîscher Organisationen sind als emische Quelle zitierfähig und wie werden sie gekennzeichnet?',
      'Welche Formulierung für „Religion und/oder ethnische Gruppe“ ist neutral, ohne eine der Positionen zu bevorzugen?',
    ],
  },
  {
    s: 'ueberblick',
    slug: 'selbstbezeichnung-und-fremdbezeichnungen',
    t: 'Selbstbezeichnung und Fremdbezeichnungen',
    o: 20,
    lead: 'Diese Seite wird darstellen, wie sich die Gemeinschaft selbst bezeichnet und welche Fremdbezeichnungen im Deutschen und in anderen Sprachen verbreitet sind. Sie erklärt Herkunft und Verwendungskontext der Schreibweisen Êzîdî, Jesiden, Eziden und Yeziden, ohne eine davon zu bewerten. Außerdem begründet sie, welche Schreibung dieses Portal verwendet und warum. Abweichende Schreibweisen werden einmalig in Klammern genannt.',
    tags: ['sprache', 'selbstbezeichnung', 'terminologie'],
    p: 'gemischt',
    g: ['ezidi', 'ezidiyati', 'hawar-alphabet'],
    w: ['sprache/schriftsysteme-und-transkription', 'ueberblick/religion-ethnie-oder-beides'],
    auftrag:
      'Herkunft und Verwendung der Bezeichnungen belegt darstellen. Etymologische Herleitungen nur mit sprachwissenschaftlicher Quelle und als konkurrierende Thesen, nicht als Tatsache.',
    gl: [
      [
        'Die Selbstbezeichnung Êzîdî',
        ['Aussprache und Schreibung', 'Verwendung im Singular und Plural'],
        'Belegen, wie die Selbstbezeichnung lautet und geschrieben wird. Aussprachehinweis in der Portal-Umschrift ergänzen.',
      ],
      [
        'Êzîdiyatî als Bezeichnung der Religion',
        [],
        'Belegen, seit wann und in welchen Kontexten der Begriff verwendet wird.',
      ],
      [
        'Herleitungen des Namens',
        [
          'Bezug auf Sultan Êzî',
          'Bezug auf altiranische Wortwurzeln',
          'Bezug auf den Kalifen Yazīd',
        ],
        'Die konkurrierenden Herleitungen jeweils mit Vertreterinnen und Vertretern sowie Kritik darstellen. Keine als gesichert ausgeben; `confidence: umstritten` setzen.',
      ],
      [
        'Deutsche Schreibweisen',
        ['Jesiden', 'Eziden', 'Yeziden'],
        'Belegen, in welchen Zusammenhängen welche Schreibung üblich ist – Behörden, Medien, Wissenschaft, Selbstorganisationen. Keine Bewertung.',
      ],
      [
        'Bezeichnungen in anderen Sprachen',
        ['Arabisch', 'Türkisch', 'Kurdisch', 'Englisch'],
        'Übliche Schreibungen mit Sprachkennzeichnung belegen.',
      ],
      [
        'Die Schreibweise auf diesem Portal',
        [],
        'Die Konvention aus STYLEGUIDE.md wiedergeben und begründen. Reiner Meta-Text, kein Belegbedarf.',
      ],
    ],
    q: [
      'Welche sprachwissenschaftliche Arbeit stellt die Etymologie-Debatte am gründlichsten dar?',
      'Wie äußern sich êzîdîsche Dachverbände in Deutschland zur bevorzugten Schreibweise, und seit wann?',
      'Gibt es einen dokumentierten Wandel im Behördendeutsch (z. B. BAMF, Statistisches Bundesamt)?',
    ],
  },
  {
    s: 'ueberblick',
    slug: 'religion-ethnie-oder-beides',
    t: 'Religion, Ethnie oder beides?',
    o: 30,
    lead: 'Diese Seite wird die verschiedenen Positionen zur Frage darstellen, ob das Êzîdîtum als Religion, als ethnische Zugehörigkeit oder als beides zu verstehen ist. Sie stellt Selbstverständnisse innerhalb der Gemeinschaft, Positionen der Forschung und die politische Dimension der Frage nebeneinander. Das Portal bezieht dabei ausdrücklich keine Position. Die Darstellung macht kenntlich, wer welche Auffassung vertritt und in welchem Kontext.',
    tags: ['identität', 'kontrovers', 'politik'],
    p: 'gemischt',
    cw: false,
    conf: 'umstritten',
    g: ['ezidi', 'esiret'],
    w: [
      'gegenwart/generationenwandel-und-identitaet',
      'wissenschaft/offene-fragen-und-kontroversen',
    ],
    auftrag:
      'Mindestens drei Positionen mit benannten Vertreterinnen und Vertretern darstellen, jeweils mit Quelle. Die politische Aufladung der Frage benennen, ohne Partei zu ergreifen.',
    gl: [
      [
        'Warum die Frage gestellt wird',
        [],
        'Belegen, in welchen Zusammenhängen die Frage praktisch relevant wird – Asylverfahren, Minderheitenschutz, Zensus, Selbstorganisation.',
      ],
      [
        'Positionen innerhalb der Gemeinschaft',
        [
          'Positionen von Dachverbänden',
          'Positionen religiöser Institutionen',
          'Unterschiede in der Diaspora',
        ],
        'Emische Positionen mit Quelle und Datum wiedergeben, ausdrücklich als Selbstdarstellung gekennzeichnet.',
      ],
      [
        'Positionen der Forschung',
        [],
        'Forschungspositionen mit Vertreterinnen, Vertretern und Gegenargumenten darstellen.',
      ],
      [
        'Die politische Dimension',
        ['Verhältnis zu kurdischen Akteuren', 'Verhältnis zu irakischen Institutionen'],
        'Positionen der Akteure referieren, nicht bewerten. Keine Aussage über die Richtigkeit einer politischen Zuordnung.',
      ],
      [
        'Was das für die Darstellung auf diesem Portal bedeutet',
        [],
        'Redaktionelle Konsequenz beschreiben. Meta-Text.',
      ],
    ],
    q: [
      'Welche Positionspapiere êzîdîscher Organisationen liegen schriftlich und datierbar vor?',
      'Wie hat sich die Position in der Forschung seit den 1990er Jahren verschoben?',
      'Welche rechtliche Einordnung nehmen deutsche Behörden vor und auf welcher Grundlage?',
    ],
  },
  {
    s: 'ueberblick',
    slug: 'verbreitung-und-bevoelkerungszahlen',
    t: 'Verbreitung und Bevölkerungszahlen',
    o: 40,
    lead: 'Diese Seite wird darstellen, wo Êzîdî heute leben und welche Schätzungen zur Bevölkerungsgröße vorliegen. Sie stellt mehrere Schätzungen mit Herkunft, Stichjahr und Erhebungsmethode nebeneinander, statt eine Zahl als gesichert auszugeben. Ausdrücklich behandelt wird, warum verlässliche Zahlen fehlen und weshalb Angaben teils erheblich voneinander abweichen. Karten und Tabellen ergänzen die Darstellung.',
    tags: ['demografie', 'zahlen', 'diaspora'],
    p: 'etisch',
    conf: 'umstritten',
    g: ['singal', 'sexan', 'diaspora'],
    w: ['gegenwart/diaspora-weltweit', 'gegenwart/diaspora-in-deutschland'],
    auftrag:
      'Für jede Region mindestens zwei unabhängige Schätzungen mit Stichjahr und Methode erheben. Keine Einzelzahl ohne Spanne. Zensusdaten und ihre bekannten Verzerrungen gesondert behandeln.',
    gl: [
      [
        'Warum es keine gesicherten Zahlen gibt',
        ['Fehlende oder umstrittene Zensusdaten', 'Auswirkungen von Flucht und Vertreibung'],
        'Belegen, welche Erhebungen es gibt und warum sie als unzuverlässig gelten.',
      ],
      [
        'Irak',
        ['Şingal', 'Şêxan', 'Autonome Region Kurdistan', 'Lager für Binnenvertriebene'],
        'Schätzungen mit Quelle, Stichjahr und Methode nebeneinanderstellen.',
      ],
      [
        'Syrien, Türkei, Kaukasus und Russland',
        [],
        'Für jedes Land mindestens eine institutionelle Quelle mit Stichjahr suchen.',
      ],
      [
        'Europa',
        ['Deutschland', 'Weitere europäische Länder'],
        'Siehe Bereich Gegenwart; hier nur Zahlen mit Herkunft.',
      ],
      [
        'Nordamerika, Australien und weitere',
        [],
        'Schätzungen belegen oder als unbelegt kennzeichnen.',
      ],
      [
        'Wie die Zahlen zu lesen sind',
        [],
        'Methodische Einordnung: Was Schätzungen leisten und was nicht. Meta-Text mit Verweis auf Fachliteratur.',
      ],
    ],
    q: [
      'Welche Zahlen nennen UN-Stellen, und auf welche Primärerhebung stützen sie sich?',
      'Gibt es eine wissenschaftliche Arbeit, die die Schätzverfahren methodisch vergleicht?',
      'Welche Zahlen nennen êzîdîsche Dachverbände, und wie kommen sie zustande?',
    ],
  },
];

export const religion = [
  {
    s: 'religion',
    slug: 'gottesbild-und-monotheismus',
    t: 'Gottesbild und Monotheismus',
    o: 10,
    lead: 'Diese Seite wird das êzîdîsche Gottesbild darstellen, wie es in der Überlieferung und in der Selbstdarstellung der Gemeinschaft beschrieben wird. Sie behandelt die Frage des Monotheismus, die Bezeichnungen für Gott und das Verhältnis Gottes zur geschaffenen Welt. Religionswissenschaftliche Einordnungen werden getrennt von der emischen Darstellung ausgewiesen. Wo Aussagen strittig sind, stehen die Positionen nebeneinander.',
    tags: ['glaube', 'theologie', 'grundlagen'],
    p: 'gemischt',
    g: ['xwede', 'tawusi-melek', 'qewl'],
    w: ['religion/tawusi-melek-und-die-sieben-engel', 'religion/schoepfung-und-kosmologie'],
    auftrag:
      'Das Gottesbild anhand religionswissenschaftlicher Standardliteratur und veröffentlichter Selbstdarstellungen belegen. Keine Ableitungen aus nicht veröffentlichten religiösen Texten.',
    gl: [
      [
        'Bezeichnungen für Gott',
        ['Xwedê', 'Weitere Bezeichnungen'],
        'Belegte Bezeichnungen mit Umschrift und Bedeutung erfassen.',
      ],
      [
        'Gott und Schöpfung',
        [],
        'Darstellung belegen; Verhältnis zur Kosmologie-Seite klären, um Dopplungen zu vermeiden.',
      ],
      [
        'Die Frage des Monotheismus',
        ['Emische Darstellung', 'Religionswissenschaftliche Einordnung'],
        'Beide Ebenen getrennt darstellen und die Trennung kenntlich machen.',
      ],
      [
        'Gottesbild in der mündlichen Überlieferung',
        [],
        'Nur veröffentlichte und übersetzte Qewl heranziehen; Übersetzerinnen und Übersetzer nennen.',
      ],
      [
        'Abgrenzung zu Zuschreibungen von außen',
        [],
        'Auf den Bereich Missverständnisse verweisen; hier nur belegen, welche Zuschreibungen es gibt.',
      ],
    ],
    q: [
      'Welche veröffentlichten Qewl-Übersetzungen sind wissenschaftlich anerkannt?',
      'Wie unterscheiden sich Darstellungen êzîdîscher Geistlicher von religionswissenschaftlichen Beschreibungen?',
    ],
  },
  {
    s: 'religion',
    slug: 'tawusi-melek-und-die-sieben-engel',
    t: 'Tawûsî Melek und die sieben Engel',
    o: 20,
    lead: 'Diese Seite wird Tawûsî Melek und die Vorstellung der sieben Engel darstellen: Rolle, Bedeutung in der Überlieferung, ikonografische Darstellung und die Verbindung zum Heft Sirr. Sie behandelt außerdem, wie die Figur von außen missverstanden und zur Verfolgungslegitimation umgedeutet wurde. Die richtigstellende Darstellung steht im Bereich Missverständnisse und wird von hier verlinkt. Nichtöffentliche religiöse Wissensbestände werden nicht rekonstruiert.',
    tags: ['glaube', 'tawusi-melek', 'ikonografie'],
    p: 'gemischt',
    g: ['tawusi-melek', 'heft-sirr', 'sancak'],
    w: ['missverstaendnisse/teufelsanbetung-vorwurf', 'religion/schoepfung-und-kosmologie'],
    auftrag:
      'Rolle und Bedeutung anhand wissenschaftlicher Literatur und veröffentlichter Selbstdarstellungen belegen. Ikonografie nur anhand publizierter Abbildungen mit geklärten Rechten beschreiben.',
    gl: [
      ['Bezeichnung und Umschrift', [], 'Schreibweisen und Aussprache belegen.'],
      [
        'Rolle in der Überlieferung',
        ['Verhältnis zu Gott', 'Verhältnis zu den weiteren Engeln'],
        'Ausschließlich anhand veröffentlichter Quellen darstellen.',
      ],
      [
        'Die sieben Engel (Heft Sirr)',
        [],
        'Benennungen und Zuordnungen belegen; Abweichungen zwischen Quellen benennen.',
      ],
      [
        'Ikonografie und Sancak',
        ['Darstellungsformen', 'Verwendung im Ritus'],
        'Beschreibung anhand von Fachliteratur; keine dekorative Verwendung der Symbolik im Layout.',
      ],
      [
        'Umdeutungen von außen',
        [],
        'Knapp benennen und auf die richtigstellende Seite verweisen. Keine Wiedergabe polemischer Formulierungen.',
      ],
    ],
    q: [
      'Welche Fachliteratur beschreibt die Ikonografie belastbar und mit Abbildungsnachweisen?',
      'Welche Abbildungen stehen unter freier Lizenz zur Verfügung – und ist ihre Veröffentlichung aus Sicht der Gemeinschaft angemessen?',
      'Wie gehen êzîdîsche Institutionen mit der Veröffentlichung von Sancak-Abbildungen um?',
    ],
  },
  {
    s: 'religion',
    slug: 'schoepfung-und-kosmologie',
    t: 'Schöpfungsvorstellung und Kosmologie',
    o: 30,
    lead: 'Diese Seite wird die überlieferten Vorstellungen von Schöpfung und Weltordnung darstellen. Sie folgt dabei den veröffentlichten religiösen Texten und ihrer wissenschaftlichen Bearbeitung. Unterschiedliche Überlieferungsvarianten werden nebeneinandergestellt, statt zu einer Fassung geglättet zu werden. Wo die Quellenlage dünn ist, wird das ausgewiesen.',
    tags: ['glaube', 'kosmologie', 'überlieferung'],
    p: 'gemischt',
    g: ['qewl', 'tawusi-melek'],
    w: ['religion/muendliche-ueberlieferung-qewl-und-beyt', 'religion/gottesbild-und-monotheismus'],
    auftrag:
      'Schöpfungsvorstellungen anhand veröffentlichter Qewl-Übersetzungen und Sekundärliteratur belegen. Varianten dokumentieren.',
    gl: [
      [
        'Überlieferte Schöpfungserzählungen',
        ['Varianten der Überlieferung'],
        'Mindestens zwei Fassungen mit Quelle gegenüberstellen.',
      ],
      [
        'Weltbild und Ordnung der Welt',
        [],
        'Nur belegte Angaben; keine Systematisierung, die die Quellen nicht hergeben.',
      ],
      [
        'Zeitvorstellungen',
        [],
        'Belegen, sofern Quellen vorliegen; sonst als offene Frage führen.',
      ],
      ['Forschungsstand', [], 'Kontroversen benennen und auf die Kontroversen-Seite verweisen.'],
    ],
    q: [
      'Welche Qewl-Editionen enthalten Schöpfungserzählungen in überprüfbarer Übersetzung?',
      'Wie erklärt die Forschung die Varianten – regional, ständisch, überlieferungsbedingt?',
    ],
  },
  {
    s: 'religion',
    slug: 'seele-jenseits-reinkarnation',
    t: 'Seelenlehre, Jenseits und Reinkarnationsvorstellungen',
    o: 40,
    lead: 'Diese Seite wird die überlieferten Vorstellungen von Seele, Tod und Weiterexistenz darstellen. Dazu gehören Jenseitsvorstellungen und die in der Literatur beschriebenen Reinkarnationsvorstellungen. Die Darstellung unterscheidet, was aus veröffentlichten religiösen Texten stammt, was Forschung interpretiert und was von außen zugeschrieben wurde. Regionale und ständische Unterschiede werden benannt, soweit belegbar.',
    tags: ['glaube', 'jenseits', 'seele'],
    p: 'gemischt',
    g: ['birayeaxrete'],
    w: ['feste/lebenszyklus-riten', 'gesellschaft/jenseitsgeschwister'],
    auftrag:
      'Belegte Darstellung erarbeiten; insbesondere die in der Literatur verwendeten Begriffe präzise und in Originalsprache mit Umschrift erfassen.',
    gl: [
      ['Vorstellungen von der Seele', [], 'Begriffe und Konzepte mit Quelle belegen.'],
      ['Tod und Bestattung', [], 'Kurz halten und auf die Riten-Seite verweisen.'],
      [
        'Weiterexistenz und Wiedergeburt',
        ['Darstellung in der Überlieferung', 'Forschungsdiskussion'],
        'Emische und etische Ebene trennen.',
      ],
      ['Jenseitsgeschwister', [], 'Auf die eigene Seite im Gesellschaftsbereich verweisen.'],
    ],
    q: [
      'Welche Begriffe verwenden die Quellen für Seele und Wiedergeburt, und wie werden sie übersetzt?',
      'Gibt es dokumentierte regionale Unterschiede in den Vorstellungen?',
    ],
  },
  {
    s: 'religion',
    slug: 'muendliche-ueberlieferung-qewl-und-beyt',
    t: 'Mündliche Überlieferung: Qewl, Beyt, Şehbêrî, Duʿa',
    o: 50,
    lead: 'Diese Seite wird die Gattungen der mündlichen religiösen Überlieferung darstellen: Form, Vortragssituation, Träger der Überlieferung und Bewahrung. Sie behandelt außerdem die Projekte zur Aufzeichnung und Verschriftlichung sowie die Debatten, die damit verbunden sind. Die Darstellung stützt sich auf publizierte Sammlungen und deren wissenschaftliche Bearbeitung. Nicht veröffentlichte Texte werden nicht wiedergegeben.',
    tags: ['überlieferung', 'qewl', 'sprache', 'musik'],
    p: 'gemischt',
    g: ['qewl', 'beyt', 'qewwal', 'sehberi'],
    w: ['sprache/kurmanci-und-ezdiki', 'kultur/musik', 'religion/mishefa-res-und-kiteba-cilwe'],
    auftrag:
      'Gattungen anhand der Fachliteratur unterscheiden und belegen. Bei jeder Gattung angeben, wer sie vorträgt und in welchem Zusammenhang.',
    gl: [
      ['Qewl', ['Form und Aufbau', 'Vortrag'], 'Definition und Merkmale belegen.'],
      ['Beyt', [], 'Abgrenzung zum Qewl belegen.'],
      ['Şehbêrî und weitere Gattungen', [], 'Belegen oder als offene Frage führen.'],
      ['Duʿa und Segensformeln', [], 'Nur veröffentlichte Formeln behandeln.'],
      [
        'Trägerinnen und Träger der Überlieferung',
        ['Qewwal', 'Weitere Rollen'],
        'Auf die Ämterseite verweisen; hier nur der Bezug zur Überlieferung.',
      ],
      [
        'Aufzeichnung und Verschriftlichung',
        ['Sammlungsprojekte', 'Debatten um Veröffentlichung'],
        'Projekte mit Jahr und Trägerschaft belegen. Die Debatte um Zugänglichkeit ausgewogen darstellen.',
      ],
    ],
    q: [
      'Welche Sammlungen sind publiziert, in welcher Sprache und mit welcher editorischen Qualität?',
      'Welche Positionen gibt es innerhalb der Gemeinschaft zur Veröffentlichung religiöser Texte?',
      'Welche Aufnahmen sind rechtlich frei zugänglich und dürfen verlinkt werden?',
    ],
  },
  {
    s: 'religion',
    slug: 'mishefa-res-und-kiteba-cilwe',
    t: 'Mishefa Reş und Kitêba Cilwe',
    o: 60,
    lead: 'Diese Seite wird die beiden Texte darstellen, die als êzîdîsche Schriften bezeichnet werden: ihren Inhalt in Grundzügen, ihre Überlieferungsgeschichte und vor allem die wissenschaftliche Debatte um ihre Echtheit. Die Echtheitsfrage wird als offene Kontroverse dargestellt, mit den vertretenen Positionen und ihren Begründungen. Es wird kenntlich gemacht, welche Rolle die Texte in der Gemeinschaft selbst spielen. Aussagen über den Inhalt stützen sich ausschließlich auf publizierte Editionen.',
    tags: ['schriften', 'kontrovers', 'forschung'],
    p: 'etisch',
    conf: 'umstritten',
    g: ['mishefa-res', 'kiteba-cilwe'],
    w: [
      'wissenschaft/offene-fragen-und-kontroversen',
      'religion/muendliche-ueberlieferung-qewl-und-beyt',
    ],
    auftrag:
      'Die Echtheitsdebatte mit benannten Positionen, Argumenten und Gegenargumenten darstellen. Keine Entscheidung treffen. `confidence: umstritten` beibehalten.',
    gl: [
      [
        'Was die Texte sind',
        ['Mishefa Reş', 'Kitêba Cilwe'],
        'Inhaltliche Grundzüge nur nach publizierten Editionen.',
      ],
      [
        'Überlieferungsgeschichte',
        ['Erste bekannte Handschriften', 'Publikationsgeschichte'],
        'Belegen, wann und durch wen die Texte bekannt wurden.',
      ],
      [
        'Die Echtheitsdebatte',
        [
          'Argumente für Authentizität',
          'Argumente für spätere Entstehung',
          'Vermittelnde Positionen',
        ],
        'Jede Position mit mindestens einer namentlich zugeordneten Quelle belegen.',
      ],
      [
        'Bedeutung in der Gemeinschaft',
        [],
        'Emische Einschätzungen mit Quelle und als solche gekennzeichnet.',
      ],
    ],
    q: [
      'Welche Editionen und Übersetzungen gelten als maßgeblich?',
      'Welche Argumente führt die Forschung für eine Entstehung im 19./20. Jahrhundert an?',
      'Wie positionieren sich êzîdîsche Geistliche und Verbände zu den Texten?',
    ],
  },
  {
    s: 'religion',
    slug: 'religioese-praxis-im-alltag',
    t: 'Religiöse Praxis im Alltag',
    o: 70,
    lead: 'Diese Seite wird die alltägliche religiöse Praxis darstellen: Gebet und Gebetszeiten, Gebetsrichtung, Reinheitsvorstellungen und Segensformeln. Regionale Unterschiede und Unterschiede zwischen Herkunftsregionen und Diaspora werden ausgewiesen. Die Darstellung bleibt bei dem, was veröffentlicht und belegbar ist, und verzichtet auf Rekonstruktionen. Sie vermeidet jede exotisierende Beschreibung.',
    tags: ['praxis', 'gebet', 'alltag'],
    p: 'gemischt',
    g: ['dua', 'roj'],
    w: ['religion/speise-und-verhaltensregeln', 'feste/lebenszyklus-riten'],
    auftrag:
      'Praxis anhand von Feldforschungsliteratur und Selbstdarstellungen belegen. Unterschiede zwischen Regionen ausdrücklich benennen.',
    gl: [
      [
        'Gebet',
        ['Gebetszeiten', 'Gebetsrichtung'],
        'Belegen; Abweichungen zwischen Quellen benennen.',
      ],
      ['Reinheitsvorstellungen', [], 'Sachlich und ohne Wertung darstellen; nur belegte Angaben.'],
      [
        'Segensformeln und Anrufungen',
        [],
        'Nur veröffentlichte Formeln, mit Umschrift und Übersetzung.',
      ],
      ['Praxis in der Diaspora', [], 'Veränderungen belegen, etwa durch qualitative Studien.'],
    ],
    q: [
      'Welche ethnografischen Arbeiten beschreiben die Alltagspraxis in den Herkunftsregionen?',
      'Welche Studien gibt es zur religiösen Praxis in der deutschen Diaspora?',
    ],
  },
  {
    s: 'religion',
    slug: 'speise-und-verhaltensregeln',
    t: 'Speise- und Verhaltensregeln',
    o: 80,
    lead: 'Diese Seite wird die überlieferten Speise- und Verhaltensregeln sachlich darstellen, einschließlich regionaler Unterschiede und des Umgangs damit in der Gegenwart. Sie ordnet ein, welche Regeln von welchen Gruppen als verbindlich betrachtet werden. Die Darstellung verzichtet auf jede spöttische oder sensationalisierende Zuspitzung. Wo Zuschreibungen von außen existieren, werden sie als solche gekennzeichnet.',
    tags: ['praxis', 'tabu', 'alltag'],
    p: 'gemischt',
    g: [],
    w: ['kultur/kueche-und-speisen', 'missverstaendnisse/weitere-falschbehauptungen'],
    auftrag:
      'Regeln belegen und die Verbindlichkeit differenziert darstellen. Zuschreibungen von außen klar von belegter Praxis trennen.',
    gl: [
      [
        'Speiseregeln',
        ['Regional unterschiedliche Praxis'],
        'Belegen; keine Verallgemeinerung ohne Quelle.',
      ],
      [
        'Verhaltensregeln und Tabus',
        [],
        'Nur belegte Angaben; Begründungen aus der Gemeinschaft als emisch kennzeichnen.',
      ],
      ['Begründungen in der Überlieferung', [], 'Nach veröffentlichten Quellen darstellen.'],
      ['Umgang in der Gegenwart', [], 'Veränderungen und Debatten mit Quelle belegen.'],
      ['Zuschreibungen von außen', [], 'Auf den Bereich Missverständnisse verweisen.'],
    ],
    q: [
      'Welche Regeln sind in der Literatur übereinstimmend belegt, welche nur in Einzelquellen?',
      'Wie beschreiben êzîdîsche Institutionen selbst die Verbindlichkeit dieser Regeln?',
    ],
  },
  {
    s: 'religion',
    slug: 'verhaeltnis-zu-anderen-religionen',
    t: 'Verhältnis zu anderen Religionen',
    o: 90,
    lead: 'Diese Seite wird das historische und gegenwärtige Verhältnis zu benachbarten Religionsgemeinschaften darstellen. Behandelt werden gegenseitige Wahrnehmung, Berührungspunkte in Praxis und Recht sowie die Auswirkungen von Herrschaftsverhältnissen. Die Darstellung bleibt beschreibend und bewertet keine Religionsgemeinschaft. Konflikte werden als historische Sachverhalte mit Quellen dargestellt, nicht als Wesensaussagen.',
    tags: ['religionsvergleich', 'geschichte', 'gesellschaft'],
    p: 'etisch',
    g: [],
    w: ['religion/ursprungshypothesen', 'geschichte/osmanische-zeit'],
    auftrag:
      'Beziehungen historisch differenziert und belegt darstellen. Keine pauschalen Aussagen über Religionsgemeinschaften.',
    gl: [
      [
        'Rechtliche Stellung unter islamischer Herrschaft',
        [],
        'Belegen; auf die Geschichtsseiten verweisen.',
      ],
      [
        'Berührungspunkte in der religiösen Praxis',
        [],
        'Nur belegte Beispiele; keine Ableitung von Abhängigkeiten.',
      ],
      ['Christliche Gemeinschaften der Region', [], 'Historische Beziehungen belegen.'],
      ['Gegenwärtige Beziehungen', [], 'Mit Stand-Datum belegen.'],
    ],
    q: [
      'Welche rechtshistorische Literatur beschreibt die Stellung der Êzîdî unter osmanischem Recht?',
      'Welche Arbeiten untersuchen Nachbarschaftsbeziehungen empirisch statt normativ?',
    ],
  },
  {
    s: 'religion',
    slug: 'ursprungshypothesen',
    t: 'Religionswissenschaftliche Hypothesen zu den Ursprüngen',
    o: 100,
    lead: 'Diese Seite wird die konkurrierenden Hypothesen zur Entstehung des Êzîdîtums darstellen – unter anderem altiranische, mesopotamische und sufische Einflüsse. Jede These wird mit ihren Vertreterinnen und Vertretern, ihren Argumenten und der Kritik daran wiedergegeben. Keine These wird als Tatsache dargestellt. Die Seite ordnet außerdem ein, warum die Frage methodisch schwierig ist.',
    tags: ['forschung', 'kontrovers', 'ursprung'],
    p: 'etisch',
    conf: 'umstritten',
    g: [],
    w: [
      'geschichte/vorgeschichte-und-ursprungsdebatte',
      'wissenschaft/offene-fragen-und-kontroversen',
    ],
    auftrag:
      'Mindestens drei Hypothesen mit namentlich zugeordneten Vertretungen und Kritik darstellen. Methodische Grenzen der Ursprungsforschung benennen.',
    gl: [
      [
        'Warum die Frage methodisch schwierig ist',
        [],
        'Quellenlage und Methodenprobleme belegt darstellen.',
      ],
      ['Altiranische Bezüge', ['Argumente', 'Kritik'], 'Vertretungen namentlich benennen.'],
      ['Mesopotamische Bezüge', ['Argumente', 'Kritik'], 'Vertretungen namentlich benennen.'],
      [
        'Sufische Bezüge und die Adawiyya',
        ['Argumente', 'Kritik'],
        'Bezug zur Geschichtsseite herstellen.',
      ],
      ['Positionen aus der Gemeinschaft', [], 'Emische Positionen gesondert und gekennzeichnet.'],
    ],
    q: [
      'Welche Forschungsüberblicke fassen die Debatte zusammen, ohne selbst Position zu beziehen?',
      'Welche archäologischen oder textlichen Belege werden jeweils angeführt?',
    ],
  },
];
