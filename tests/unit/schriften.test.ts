import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { create as fontkitCreate, type Font } from 'fontkit';

/**
 * Aktive Prüfung der Glyphenabdeckung.
 *
 * Vorgabe aus Abschnitt 7: vollständige Unterstützung für ê, î, û, ş, ç
 * sowie arabische Schrift. Weil die Zeichen auf zwei Subsets verteilt
 * sind (latin und latin-ext), wird die Vereinigung geprüft.
 */

const SCHRIFTEN = join(process.cwd(), 'public', 'fonts');
const oeffne = (datei: string) => fontkitCreate(readFileSync(join(SCHRIFTEN, datei))) as Font;

const KURMANCI = [...'êîûşçÊÎÛŞÇ'];
const ARABISCH = [...'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'];

const familien: Record<string, string[]> = {
  Newsreader: ['newsreader-latin-wght-normal.woff2', 'newsreader-latin-ext-wght-normal.woff2'],
  'Source Serif 4': [
    'source-serif-4-latin-wght-normal.woff2',
    'source-serif-4-latin-ext-wght-normal.woff2',
  ],
  'IBM Plex Sans': [
    'ibm-plex-sans-latin-wght-normal.woff2',
    'ibm-plex-sans-latin-ext-wght-normal.woff2',
  ],
};

describe('Kurmancî-Sonderzeichen', () => {
  for (const [name, dateien] of Object.entries(familien)) {
    it(`${name} deckt ê î û ş ç in beiden Schreibungen ab`, () => {
      const fonts = dateien.map(oeffne);
      const fehlend = KURMANCI.filter(
        (z) => !fonts.some((f) => f.hasGlyphForCodePoint(z.codePointAt(0) ?? 0)),
      );
      expect(fehlend).toEqual([]);
    });
  }
});

describe('Arabische Schrift', () => {
  it('IBM Plex Sans Arabic deckt das Grundalphabet ab', () => {
    const font = oeffne('ibm-plex-sans-arabic-arabic-400-normal.woff2');
    const fehlend = ARABISCH.filter((z) => !font.hasGlyphForCodePoint(z.codePointAt(0) ?? 0));
    expect(fehlend).toEqual([]);
  });
});

describe('Auslieferung', () => {
  it('alle im Stylesheet referenzierten Schriftdateien existieren', () => {
    const css = readFileSync(join(process.cwd(), 'src/styles/typography.css'), 'utf8');
    const referenzen = [...css.matchAll(/url\('\/fonts\/([^']+)'\)/g)].map((m) => m[1] ?? '');
    expect(referenzen.length).toBeGreaterThan(0);
    for (const datei of new Set(referenzen)) {
      expect(() => readFileSync(join(SCHRIFTEN, datei))).not.toThrow();
    }
  });
});
