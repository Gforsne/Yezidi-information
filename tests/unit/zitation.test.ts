import { describe, expect, it } from 'vitest';
import {
  belegAnker,
  belegapparat,
  belegquote,
  kurzbeleg,
  verlaesslichkeitRang,
  vollbeleg,
  zitatAnker,
  type Quelle,
} from '../../src/lib/zitation';

const buch: Quelle = {
  id: 'beispiel-1999',
  type: 'buch',
  authors: ['Muster, Alexandra', 'Beispiel, Bernd'],
  title: 'Ein Titel',
  container: null,
  year: 1999,
  publisher: 'Verlag',
  isbn: null,
  doi: null,
  url: null,
  accessed: null,
  language: 'de',
  reliability: 'wissenschaftlich',
  note: null,
  verifiziert: true,
};

describe('Kurzbeleg', () => {
  it('nennt bei zwei Autorinnen beide Nachnamen', () => {
    expect(kurzbeleg(buch)).toBe('Muster/Beispiel 1999');
  });

  it('hängt die Fundstelle an', () => {
    expect(kurzbeleg(buch, 'S. 45')).toBe('Muster/Beispiel 1999, S. 45');
  });

  it('kürzt ab drei Autorinnen mit „u. a.“', () => {
    expect(kurzbeleg({ ...buch, authors: ['A, A', 'B, B', 'C, C'] })).toBe('A u. a. 1999');
  });

  it('schreibt „o. J.“, wenn kein Jahr belegt ist', () => {
    expect(kurzbeleg({ ...buch, year: null })).toContain('o. J.');
  });

  it('schreibt „o. A.“, wenn keine Urheberschaft belegt ist', () => {
    expect(kurzbeleg({ ...buch, authors: [] })).toContain('o. A.');
  });
});

describe('Vollbeleg', () => {
  it('enthält Titel, Verlag und Jahr', () => {
    const text = vollbeleg(buch);
    expect(text).toContain('Ein Titel');
    expect(text).toContain('Verlag');
    expect(text).toContain('1999');
  });

  it('nennt bei Webquellen das Abrufdatum', () => {
    const text = vollbeleg({
      ...buch,
      type: 'webseite',
      url: 'https://example.org',
      accessed: new Date('2026-07-01'),
    });
    expect(text).toContain('abgerufen am');
  });
});

describe('Belegapparat', () => {
  const quellen = new Map<string, Quelle>([['beispiel-1999', buch]]);

  it('nummeriert in der Reihenfolge des Frontmatters', () => {
    const positionen = belegapparat(
      [{ id: 'beispiel-1999' }, { id: 'zweite-quelle' }],
      quellen,
    );
    expect(positionen.map((p) => p.nr)).toEqual([1, 2]);
  });

  it('gibt derselben Quelle nur eine Ziffer', () => {
    const positionen = belegapparat(
      [{ id: 'beispiel-1999' }, { id: 'beispiel-1999', loc: 'S. 2' }],
      quellen,
    );
    expect(positionen).toHaveLength(1);
  });

  it('meldet unbekannte Quellen als fehlend, statt sie zu verschlucken', () => {
    const positionen = belegapparat([{ id: 'gibts-nicht' }], quellen);
    expect(positionen[0]?.quelle).toBeUndefined();
  });
});

describe('Anker', () => {
  it('erzeugt stabile Sprungmarken', () => {
    expect(belegAnker('kreyenbroek-1995')).toBe('beleg-kreyenbroek-1995');
    expect(zitatAnker('kreyenbroek-1995', 3)).toBe('zitat-kreyenbroek-1995-3');
  });
});

describe('Belegquote', () => {
  it('ist null ohne Abschnitte', () => {
    expect(belegquote(0, 5, 0)).toBe(0);
  });

  it('rechnet Beleglücken gegen', () => {
    expect(belegquote(10, 10, 2)).toBe(80);
  });

  it('wird nie negativ', () => {
    expect(belegquote(4, 1, 9)).toBe(0);
  });

  it('deckelt bei 100 Prozent', () => {
    expect(belegquote(4, 40, 0)).toBe(100);
  });
});

describe('Quellenhierarchie', () => {
  it('setzt wissenschaftliche Quellen an die Spitze', () => {
    expect(verlaesslichkeitRang.wissenschaftlich).toBeLessThan(verlaesslichkeitRang.institutionell);
    expect(verlaesslichkeitRang.institutionell).toBeLessThan(verlaesslichkeitRang.journalistisch);
    expect(verlaesslichkeitRang.journalistisch).toBeLessThan(verlaesslichkeitRang.community);
    expect(verlaesslichkeitRang.community).toBeLessThan(verlaesslichkeitRang.unklar);
  });
});
