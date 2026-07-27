/**
 * Sprachkonfiguration des Portals.
 *
 * Primärsprache ist Deutsch. Englisch existiert als vollständiges
 * Oberflächengerüst mit Inhalts-Stubs. Kurmancî und Arabisch sind als
 * Routen, Oberfläche und Sprachumschalter vollständig angelegt; ihre
 * Inhalte werden gemäß Recherche-Regel 9 erst übersetzt, wenn die
 * deutsche Fassung `status: 'belegt'` erreicht hat.
 */

export const locales = ['de', 'en', 'ku', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export interface LocaleMeta {
  /** Bezeichnung in der Sprache selbst (Endonym) – so steht sie im Umschalter. */
  readonly endonym: string;
  /** Deutsche Bezeichnung, für Screenreader-Beschriftungen der DE-Oberfläche. */
  readonly deutsch: string;
  /** Schreibrichtung. */
  readonly dir: 'ltr' | 'rtl';
  /** BCP-47-Kennung für `lang`, `hreflang` und Datumsformatierung. */
  readonly bcp47: string;
  /**
   * Ausbaustand der Oberfläche. `stub` bedeutet: Route und Navigation
   * existieren, Oberflächentexte fallen teilweise auf Deutsch zurück.
   */
  readonly status: 'vollstaendig' | 'gerüst' | 'stub';
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  de: {
    endonym: 'Deutsch',
    deutsch: 'Deutsch',
    dir: 'ltr',
    bcp47: 'de-DE',
    status: 'vollstaendig',
  },
  en: { endonym: 'English', deutsch: 'Englisch', dir: 'ltr', bcp47: 'en', status: 'gerüst' },
  ku: { endonym: 'Kurmancî', deutsch: 'Kurmancî', dir: 'ltr', bcp47: 'ku', status: 'stub' },
  ar: { endonym: 'العربية', deutsch: 'Arabisch', dir: 'rtl', bcp47: 'ar', status: 'stub' },
};

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): 'ltr' | 'rtl' {
  return localeMeta[locale].dir;
}
