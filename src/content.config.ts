import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { sectionIds } from './lib/sections';

/* =====================================================================
   GEMEINSAME BAUSTEINE
   ===================================================================== */

export const langEnum = z.enum(['de', 'en', 'ku', 'ar']);
export const statusEnum = z.enum(['stub', 'entwurf', 'belegt', 'geprüft']);
export const confidenceEnum = z.enum(['gesichert', 'umstritten', 'unklar']);
export const perspektiveEnum = z.enum(['emisch', 'etisch', 'gemischt']);
export const sectionEnum = z.enum(sectionIds);

export const reliabilityEnum = z.enum([
  'wissenschaftlich',
  'institutionell',
  'journalistisch',
  'community',
  'unklar',
]);

export const sourceTypeEnum = z.enum([
  'buch',
  'aufsatz',
  'bericht',
  'zeitung',
  'webseite',
  'primärquelle',
  'interview',
  'video',
]);

/**
 * Verweis auf einen Eintrag der `sources`-Collection.
 * `loc` ist die Fundstelle (Seite, Kapitel, Minute), `note` eine
 * redaktionelle Einordnung des Belegs an genau dieser Stelle.
 */
export const sourceRef = z.object({
  id: z.string().min(1, 'Quellen-ID darf nicht leer sein'),
  loc: z.string().optional(),
  note: z.string().optional(),
});

/**
 * Bildnachweis. Ohne Urheber und Lizenz darf kein Bild ausgeliefert
 * werden (Leitplanke 10.7). Deshalb sind beide Felder Pflicht.
 */
export const bildnachweis = z.object({
  datei: z.string().min(1),
  alt: z.string().min(5, 'Alt-Text ist Pflicht und muss den Bildinhalt beschreiben'),
  caption: z.string().optional(),
  urheber: z.string().min(1, 'Urheber ist Pflicht'),
  lizenz: z.string().min(1, 'Lizenz ist Pflicht'),
  lizenzUrl: z.string().optional(),
  quelle: z.string().min(1, 'Herkunft/Quelle des Bildes ist Pflicht'),
  jahr: z.number().int().optional(),
});

/** Felder, die jeder redaktionelle Inhaltstyp trägt. */
const redaktionelleBasis = {
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug: nur Kleinbuchstaben, Ziffern und Bindestriche'),
  lang: langEnum.default('de'),
  status: statusEnum.default('stub'),
  confidence: confidenceEnum.default('unklar'),
  contentWarning: z.boolean().default(false),
  /**
   * Seitengenauer Text des Inhaltshinweises. Ohne Angabe gilt der
   * bereichsweite Standardtext. Zwei Hinweise auf einer Seite wären eine
   * Dopplung – deshalb steht der besondere Text hier und nicht im Rumpf.
   */
  contentWarningText: z.string().nullable().optional(),
  sources: z.array(sourceRef).default([]),
  relatedGlossary: z.array(z.string()).default([]),
  updated: z.coerce.date(),
  reviewedBy: z.string().nullable().default(null),
  openQuestions: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  bilder: z.array(bildnachweis).default([]),
};

/**
 * Build-Gate auf Schema-Ebene: Sobald eine Seite den Gerüst-Status
 * verlässt, braucht sie mindestens eine Quelle. Ohne diese Regel könnte
 * unbelegter Text als Tatsachenbehauptung erscheinen.
 */
function verlangeQuellenAbEntwurf<T extends z.ZodType>(schema: T): T {
  /*
    Die Rückgabe wird bewusst auf `T` zurückgeführt: `superRefine`
    liefert einen weiteren ZodType, dessen konkreter Ergebnistyp durch
    die Generik verloren ginge. Astro leitet die Typen der Collections
    aber genau daraus ab – ohne diese Rückführung wäre `entry.data`
    überall `any`. Die Prüfung selbst läuft unverändert zur Laufzeit.
  */
  return schema.superRefine((value, ctx) => {
    const v = value as { status?: string; sources?: unknown[] };
    if (v.status && v.status !== 'stub' && (v.sources?.length ?? 0) === 0) {
      ctx.addIssue({
        code: 'custom',
        message: `status: '${v.status}' verlangt mindestens eine Quelle in 'sources'. Entweder Quelle nachtragen oder status auf 'stub' zurücksetzen.`,
        path: ['sources'],
      });
    }
  }) as unknown as T;
}

/**
 * Eintrags-ID = Pfad relativ zum Collection-Ordner ohne Endung,
 * z. B. `de/religion/tawusi-melek-und-die-sieben-engel`.
 *
 * Die Voreinstellung des glob-Loaders erzeugt nur aus dem Dateinamen
 * einen Slug – dabei kollidieren `de/religion/overview` und
 * `en/religion/overview`. Der Sprachordner gehört deshalb in die ID.
 */
function idAusPfad({ entry }: { entry: string }): string {
  return entry.replace(/\.mdx?$/, '');
}

/* =====================================================================
   COLLECTIONS
   ===================================================================== */

const articles = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: '**/*.{md,mdx}',
    generateId: idAusPfad,
  }),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      ...redaktionelleBasis,
      /** 3–5 Sätze „In Kürze“. Bei Gerüsten: was die Seite behandeln wird. */
      lead: z.string().min(40, 'Der Lead braucht 3–5 Sätze.'),
      section: sectionEnum,
      /** Position innerhalb des Bereichs (Navigation, Sammelseite). */
      order: z.number().int().default(100),
      /**
       * Emisch = Selbstdarstellung der Gemeinschaft,
       * etisch = Forschungsstand von außen (Leitplanke 10.2).
       */
      perspektive: perspektiveEnum.default('gemischt'),
      /** Geplante Gliederung – erscheint bei Gerüsten sichtbar auf der Seite. */
      gliederung: z.array(z.string()).default([]),
      /** Konkreter Rechercheauftrag für diese Seite. */
      rechercheauftrag: z.string().nullable().optional(),
      /** Interne Querverweise auf andere Artikel (Pfade ohne Sprachpräfix). */
      weiterfuehrend: z.array(z.string()).default([]),
      /** Ausblenden aus Navigation und Suche, ohne die Datei zu löschen. */
      draft: z.boolean().default(false),
    }),
  ),
});

const persons = defineCollection({
  loader: glob({
    base: './src/content/persons',
    pattern: '**/*.{md,mdx}',
    generateId: idAusPfad,
  }),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      ...redaktionelleBasis,
      lead: z.string().min(40),
      /** Ansetzungsform des Namens in der Umschrift dieses Portals. */
      nameUmschrift: z.string().min(2),
      /** Weitere gängige Schreibweisen – einmalig genannt, nicht gewertet. */
      nameVarianten: z.array(z.string()).default([]),
      rolle: z.string().min(3),
      kategorie: z.enum([
        'religiöses-amt',
        'historisch',
        'aktivismus',
        'politik',
        'wissenschaft',
        'kunst',
        'überlebende',
      ]),
      geboren: z.string().nullable().default(null),
      gestorben: z.string().nullable().default(null),
      /**
       * Bei lebenden Personen gilt erhöhte Zurückhaltung (Leitplanke 10.13).
       * Das Flag steuert einen sichtbaren Hinweis und strengere Prüfungen.
       */
      lebend: z.boolean().default(false),
      wirkungsort: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
  ),
});

const places = defineCollection({
  loader: glob({
    base: './src/content/places',
    pattern: '**/*.{md,mdx}',
    generateId: idAusPfad,
  }),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      ...redaktionelleBasis,
      lead: z.string().min(40),
      nameUmschrift: z.string().min(2),
      nameVarianten: z.array(z.string()).default([]),
      art: z.enum([
        'heiligtum',
        'mezar',
        'siedlung',
        'lager',
        'gedenkort',
        'gemeindezentrum',
        'friedhof',
        'region',
      ]),
      land: z.string().min(2),
      region: z.string().nullable().optional(),
      /** [Längengrad, Breitengrad] – GeoJSON-Reihenfolge. */
      koordinaten: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]).nullable(),
      /** Genauigkeit der Verortung; „ungefähr“ wird auf der Karte gekennzeichnet. */
      koordinatenGenauigkeit: z.enum(['exakt', 'ungefähr', 'unbekannt']).default('unbekannt'),
      zustand: z
        .enum(['erhalten', 'beschädigt', 'zerstört', 'wiederaufgebaut', 'unbekannt'])
        .default('unbekannt'),
      kartenebene: z
        .array(z.enum(['siedlungsgebiete', 'heilige-orte', 'fluchtrouten', 'diaspora', 'gedenken']))
        .default([]),
      draft: z.boolean().default(false),
    }),
  ),
});

const festivals = defineCollection({
  loader: glob({
    base: './src/content/festivals',
    pattern: '**/*.{md,mdx}',
    generateId: idAusPfad,
  }),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      ...redaktionelleBasis,
      lead: z.string().min(40),
      nameKurmanci: z.string().min(2),
      nameDeutsch: z.string().nullable().optional(),
      nameVarianten: z.array(z.string()).default([]),
      /** Bezugssystem des Termins – zentrale Information, oft missverstanden. */
      kalendersystem: z
        .enum(['ostkirchlich-julianisch', 'gregorianisch', 'mondbezogen', 'unklar'])
        .default('unklar'),
      /** Beschreibung der Terminregel, KEIN erfundenes Datum. */
      terminregel: z.string().nullable().optional(),
      /** Ungefährer Monat im gregorianischen Kalender, für den Jahreskalender. */
      monatGregorianisch: z.number().int().min(1).max(12).nullable().default(null),
      dauerTage: z.number().int().min(1).nullable().default(null),
      beweglich: z.boolean().default(true),
      ort: z.array(z.string()).default([]),
      gliederung: z.array(z.string()).default([]),
      rechercheauftrag: z.string().nullable().optional(),
      order: z.number().int().default(100),
      draft: z.boolean().default(false),
    }),
  ),
});

const glossary = defineCollection({
  loader: glob({
    base: './src/content/glossary',
    pattern: '**/*.{md,mdx}',
    generateId: idAusPfad,
  }),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      title: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      lang: langEnum.default('de'),
      status: statusEnum.default('stub'),
      confidence: confidenceEnum.default('unklar'),
      contentWarning: z.boolean().default(false),
      sources: z.array(sourceRef).default([]),
      updated: z.coerce.date(),
      reviewedBy: z.string().nullable().default(null),
      openQuestions: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      /** Schreibung in der Hawar-Umschrift (verbindlich, STYLEGUIDE.md). */
      kurmanci: z.string().nullable().optional(),
      /** Arabische Schreibung, sofern belegt. */
      arabisch: z.string().nullable().optional(),
      /** Weitere im Deutschen gängige Schreibweisen. */
      varianten: z.array(z.string()).default([]),
      /** Aussprache in vereinfachter Lautschrift. */
      aussprache: z.string().nullable().optional(),
      /** Dateiname einer Audiodatei in /public/audio – noch nicht vorhanden. */
      audio: z.string().nullable().default(null),
      /** Einzeiler für Tooltip und Index. Muss ohne Kontext verständlich sein. */
      kurzdefinition: z.string().min(10),
      siehe: z.array(z.string()).default([]),
      kategorie: z
        .enum(['religion', 'gesellschaft', 'orte', 'feste', 'sprache', 'geschichte', 'recht'])
        .default('religion'),
      draft: z.boolean().default(false),
    }),
  ),
});

const sources = defineCollection({
  loader: file('src/content/sources/sources.yaml'),
  schema: z
    .object({
      id: z.string().regex(/^[a-z0-9-]+$/, 'Quellen-ID: Kleinbuchstaben, Ziffern, Bindestriche'),
      type: sourceTypeEnum,
      authors: z.array(z.string()).default([]),
      title: z.string().min(2),
      container: z.string().nullable().default(null),
      year: z.number().int().min(1).max(2100).nullable().default(null),
      publisher: z.string().nullable().default(null),
      isbn: z.string().nullable().default(null),
      doi: z.string().nullable().default(null),
      url: z.string().nullable().default(null),
      accessed: z.coerce.date().nullable().default(null),
      language: z.string().min(2),
      reliability: reliabilityEnum,
      note: z.string().nullable().default(null),
      /**
       * `false` markiert Quellen, deren bibliografische Angaben noch nicht
       * am Original oder an einem verlässlichen Nachweis geprüft wurden
       * (Recherche-Regel 4).
       */
      verifiziert: z.boolean().default(false),
      /**
       * `true` nur, wenn der Redaktion der Volltext tatsächlich vorlag.
       * Ohne dieses Flag darf die Quelle nicht mit <Cite> belegt werden –
       * check:content bricht sonst ab. Damit ist ausgeschlossen, dass eine
       * Aussage auf einen Titel gestützt wird, der nur aus einem Katalog
       * bekannt ist (Recherche-Regel 1 und 4).
       */
      volltextGeprueft: z.boolean().default(false),
    })
    .superRefine((v, ctx) => {
      if (v.url && !v.accessed) {
        ctx.addIssue({
          code: 'custom',
          message: 'Webquellen brauchen ein Abrufdatum (`accessed`).',
          path: ['accessed'],
        });
      }
      if (!v.verifiziert && v.reliability !== 'unklar') {
        ctx.addIssue({
          code: 'custom',
          message:
            "Nicht am Original geprüfte Quellen müssen reliability: 'unklar' tragen (Recherche-Regel 4).",
          path: ['reliability'],
        });
      }
    }),
});

const events = defineCollection({
  loader: file('src/content/events/events.yaml'),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(3),
    /** Freitextdatierung, z. B. „12. Jahrhundert“ oder „3. August 2014“. */
    datum: z.string().min(3),
    /** Sortierjahr. Negativ für v. Chr. */
    jahr: z.number().int(),
    jahrBis: z.number().int().nullable().default(null),
    datierungUnsicher: z.boolean().default(false),
    epoche: z.enum([
      'vorgeschichte',
      'mittelalter',
      'fruehe-neuzeit',
      'osmanisch',
      '19-jahrhundert',
      'weltkriege',
      'mandat-koenigreich',
      'baath',
      'nach-2003',
      'genozid-2014',
      'gegenwart',
    ]),
    thema: z.array(
      z.enum(['religion', 'verfolgung', 'politik', 'migration', 'recht', 'kultur', 'gesellschaft']),
    ),
    /** Kennzeichnet Ereignisse, die in der Firman-Erinnerung überliefert sind. */
    firman: z.boolean().default(false),
    zusammenfassung: z.string().min(20),
    ort: z.string().nullable().default(null),
    /** Verweis auf einen Artikel (Pfad ohne Sprachpräfix). */
    artikel: z.string().nullable().default(null),
    sources: z.array(sourceRef).default([]),
    confidence: confidenceEnum.default('unklar'),
    status: statusEnum.default('stub'),
    contentWarning: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: file('src/content/faq/faq.yaml'),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      frage: z.string().min(8),
      /** Kurze, belegbare Antwort. Bei Gerüsten: leer + openQuestions. */
      antwort: z.string().default(''),
      thema: sectionEnum,
      lang: langEnum.default('de'),
      status: statusEnum.default('stub'),
      confidence: confidenceEnum.default('unklar'),
      sources: z.array(sourceRef).default([]),
      weiterfuehrend: z.array(z.string()).default([]),
      openQuestions: z.array(z.string()).default([]),
      contentWarning: z.boolean().default(false),
      updated: z.coerce.date(),
    }),
  ),
});

const media = defineCollection({
  loader: file('src/content/media/media.yaml'),
  schema: z
    .object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string().min(3),
      typ: z.enum(['dokumentation', 'podcast', 'ausstellung', 'archiv', 'webseite', 'buchreihe']),
      urheber: z.string().min(2),
      jahr: z.number().int().nullable().default(null),
      sprache: z.string().min(2),
      /** Nur Verlinkung – nichts Fremdes wird eingebettet (Leitplanke 10.7). */
      url: z.string().nullable().default(null),
      dauer: z.string().nullable().default(null),
      beschreibung: z.string().min(20),
      thema: z.array(sectionEnum).default([]),
      contentWarning: z.boolean().default(false),
      /** Rechteklärung für eine Einbettung – bis dahin bleibt es beim Link. */
      rechteGeklaert: z.boolean().default(false),
      status: statusEnum.default('stub'),
      updated: z.coerce.date(),
    })
    .superRefine((v, ctx) => {
      if (v.rechteGeklaert && !v.url) {
        ctx.addIssue({
          code: 'custom',
          message: 'Ohne Fundstelle (`url`) kann keine Rechteklärung dokumentiert werden.',
          path: ['url'],
        });
      }
    }),
});

const recipes = defineCollection({
  loader: glob({
    base: './src/content/recipes',
    pattern: '**/*.{md,mdx}',
    generateId: idAusPfad,
  }),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      ...redaktionelleBasis,
      lead: z.string().min(40),
      nameKurmanci: z.string().nullable().optional(),
      anlass: z.array(z.string()).default([]),
      region: z.array(z.string()).default([]),
      /** Menge und Zutat getrennt, damit Umrechnung und Übersetzung möglich sind. */
      zutaten: z
        .array(z.object({ menge: z.string().optional(), zutat: z.string().min(1) }))
        .default([]),
      schritte: z.array(z.string()).default([]),
      /** Herkunft des Rezepts – Kochbuch, Interview, Vereinspublikation. */
      herkunftDesRezepts: z.string().nullable().optional(),
      draft: z.boolean().default(false),
    }),
  ),
});

const misconceptions = defineCollection({
  loader: glob({
    base: './src/content/misconceptions',
    pattern: '**/*.{md,mdx}',
    generateId: idAusPfad,
  }),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      ...redaktionelleBasis,
      lead: z.string().min(40),
      /** Die Falschbehauptung – neutral referiert, nie zugespitzt. */
      behauptung: z.string().min(10),
      /** Kurzfassung der Faktenlage; die Langfassung steht im Fließtext. */
      faktenlage: z.string().default(''),
      /** Warum die Behauptung entstanden ist und wem sie genützt hat. */
      hintergrund: z.string().default(''),
      verbreitung: z.enum(['historisch', 'gegenwärtig', 'beides']).default('beides'),
      order: z.number().int().default(100),
      gliederung: z.array(z.string()).default([]),
      rechercheauftrag: z.string().nullable().optional(),
      draft: z.boolean().default(false),
    }),
  ),
});

const teaching = defineCollection({
  loader: glob({
    base: './src/content/teaching',
    pattern: '**/*.{md,mdx}',
    generateId: idAusPfad,
  }),
  schema: verlangeQuellenAbEntwurf(
    z.object({
      ...redaktionelleBasis,
      lead: z.string().min(40),
      stufe: z.array(z.enum(['grundschule', 'sek-1', 'sek-2', 'erwachsenenbildung'])).default([]),
      fach: z.array(z.string()).default([]),
      umfang: z.string().nullable().optional(),
      /** Lernziele – didaktische Angabe, keine inhaltliche Behauptung. */
      lernziele: z.array(z.string()).default([]),
      /** Bezug zu Artikeln des Portals (Pfade ohne Sprachpräfix). */
      bezug: z.array(z.string()).default([]),
      materialtyp: z.enum(['arbeitsblatt', 'quellenauszug', 'unterrichtsvorschlag', 'kurzfassung']),
      order: z.number().int().default(100),
      gliederung: z.array(z.string()).default([]),
      rechercheauftrag: z.string().nullable().optional(),
      draft: z.boolean().default(false),
    }),
  ),
});

export const collections = {
  articles,
  persons,
  places,
  events,
  festivals,
  glossary,
  sources,
  faq,
  media,
  recipes,
  misconceptions,
  teaching,
};
