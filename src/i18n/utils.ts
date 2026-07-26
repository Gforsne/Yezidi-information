import { defaultLocale, isLocale, localeMeta, locales, type Locale } from './config';
import { ui, type UIKey } from './ui';

type Dictionary = Partial<Record<UIKey, string>>;

const dictionaries: Record<Locale, Dictionary> = ui as unknown as Record<Locale, Dictionary>;

/**
 * Übersetzt einen Oberflächenschlüssel.
 * Fehlt der Schlüssel in der Zielsprache, wird auf Deutsch zurückgefallen –
 * bewusst sichtbar statt mit leerem Text (siehe DECISIONS.md, D-006).
 */
export function t(locale: Locale, key: UIKey): string {
  return dictionaries[locale][key] ?? dictionaries[defaultLocale][key] ?? key;
}

/** Gibt eine an die Sprache gebundene Übersetzungsfunktion zurück. */
export function useTranslations(locale: Locale) {
  return (key: UIKey): string => t(locale, key);
}

/** Liest die Sprache aus einem Pfad wie `/de/religion/…`. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : defaultLocale;
}

/** Liest die Sprache aus einer URL. */
export function localeFromUrl(url: URL): Locale {
  return localeFromPath(url.pathname);
}

/**
 * Baut einen sprachpräfixierten, absoluten Pfad.
 * `path('de', 'religion', 'tawusi-melek')` → `/de/religion/tawusi-melek`
 */
export function path(locale: Locale, ...segments: (string | undefined | null)[]): string {
  const parts = segments
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .flatMap((s) => s.split('/'))
    .filter(Boolean);
  return '/' + [locale, ...parts].join('/');
}

/** Ersetzt das Sprachpräfix eines bestehenden Pfades. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && isLocale(parts[0])) {
    parts[0] = target;
    return '/' + parts.join('/');
  }
  return '/' + [target, ...parts].join('/');
}

/** Alle Sprachvarianten eines Pfades – Grundlage für `hreflang`. */
export function alternateLinks(pathname: string): { locale: Locale; href: string; bcp47: string }[] {
  return locales.map((locale) => ({
    locale,
    href: switchLocalePath(pathname, locale),
    bcp47: localeMeta[locale].bcp47,
  }));
}

/** Datumsformatierung in der Sprache der Seite. */
export function formatDate(
  value: Date | string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(localeMeta[locale].bcp47, { ...options, timeZone: 'UTC' }).format(
    date,
  );
}

/** Maschinenlesbares ISO-Datum (für `<time datetime>` und JSON-LD). */
export function isoDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : (date.toISOString().split('T')[0] ?? '');
}

/** Zahlformatierung, u. a. für Bevölkerungsschätzungen. */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMeta[locale].bcp47).format(value);
}
