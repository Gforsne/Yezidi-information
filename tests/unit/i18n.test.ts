import { describe, expect, it } from 'vitest';
import { ui } from '../../src/i18n/ui';
import { defaultLocale, dirOf, isLocale, localeMeta, locales } from '../../src/i18n/config';
import { alternateLinks, formatDate, isoDate, path, switchLocalePath, t } from '../../src/i18n/utils';

describe('Sprachkonfiguration', () => {
  it('kennt genau die vier vorgesehenen Sprachen', () => {
    expect([...locales]).toEqual(['de', 'en', 'ku', 'ar']);
  });

  it('führt Arabisch als RTL', () => {
    expect(dirOf('ar')).toBe('rtl');
    expect(dirOf('de')).toBe('ltr');
  });

  it('erkennt gültige Sprachkürzel', () => {
    expect(isLocale('ku')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it('hat für jede Sprache ein Endonym und eine BCP-47-Kennung', () => {
    for (const l of locales) {
      expect(localeMeta[l].endonym.length).toBeGreaterThan(1);
      expect(localeMeta[l].bcp47.length).toBeGreaterThan(1);
    }
  });
});

describe('Oberflächentexte', () => {
  it('Deutsch ist die vollständige Referenz', () => {
    expect(Object.keys(ui.de).length).toBeGreaterThan(80);
  });

  it('keine Sprache enthält Schlüssel, die es in Deutsch nicht gibt', () => {
    const referenz = new Set(Object.keys(ui.de));
    for (const l of locales) {
      const fremd = Object.keys(ui[l]).filter((k) => !referenz.has(k));
      expect({ sprache: l, fremd }).toEqual({ sprache: l, fremd: [] });
    }
  });

  it('fällt bei fehlender Übersetzung sichtbar auf Deutsch zurück', () => {
    // 'apparat.title' ist in ku bewusst nicht übersetzt.
    expect(t('ku', 'apparat.title')).toBe(ui.de['apparat.title']);
    expect(t('ku', 'nav.home')).toBe(ui.ku['nav.home']);
  });
});

describe('Pfadhilfen', () => {
  it('baut sprachpräfixierte Pfade', () => {
    expect(path('de', 'religion', 'tawusi-melek')).toBe('/de/religion/tawusi-melek');
    expect(path('ar')).toBe('/ar');
  });

  it('ignoriert leere Segmente', () => {
    expect(path('de', '', undefined, 'glossar')).toBe('/de/glossar');
  });

  it('tauscht das Sprachpräfix aus', () => {
    expect(switchLocalePath('/de/religion/qewl', 'ku')).toBe('/ku/religion/qewl');
    expect(switchLocalePath('/styleguide', 'en')).toBe('/en/styleguide');
  });

  it('erzeugt für jede Sprache eine Alternative', () => {
    const alt = alternateLinks('/de/geschichte');
    expect(alt).toHaveLength(locales.length);
    expect(alt.map((a) => a.href)).toContain('/ar/geschichte');
  });
});

describe('Datums- und Zahlformate', () => {
  it('formatiert Datumsangaben in der Sprache der Seite', () => {
    expect(formatDate('2026-08-03', 'de')).toContain('2026');
    expect(formatDate('2026-08-03', 'de')).toContain('August');
  });

  it('liefert bei ungültigem Datum keinen Absturz', () => {
    expect(formatDate('kein Datum', 'de')).toBe('—');
    expect(isoDate('kein Datum')).toBe('');
  });

  it('gibt ISO-Daten ohne Zeitanteil aus', () => {
    expect(isoDate(new Date('2014-08-03T12:00:00Z'))).toBe('2014-08-03');
  });

  it('nutzt Deutsch als Standardsprache', () => {
    expect(defaultLocale).toBe('de');
  });
});
