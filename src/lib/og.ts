// fontkit hat in der Node-Variante keinen Default-Export – nur benannte.
// Die mitgelieferten Typen greifen nur für den CJS-Pfad, deshalb der
// lokale Typ in src/types/fontkit.d.ts.
import { create as fontkitCreate, type Font } from 'fontkit';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Erzeugt Open-Graph-Bilder zur Bauzeit.
 *
 * Warum so umständlich statt mit einer Rendering-Bibliothek: Ein
 * SVG-Text-Element würde beim Rastern die Schriften des Betriebssystems
 * brauchen – auf dem Bauserver liegen die nicht. Deshalb werden die
 * Buchstaben mit fontkit aus den lokal mitgelieferten Schriftdateien in
 * Pfade umgewandelt. Das Ergebnis ist auf jedem Rechner identisch und
 * deckt ê, î, û, ş, ç zuverlässig ab.
 */

const BREITE = 1200;
const HOEHE = 630;

const SCHRIFTEN = join(process.cwd(), 'public', 'fonts');

let displayLatin: Font | null = null;
let displayLatinExt: Font | null = null;
let utilityLatin: Font | null = null;
let utilityLatinExt: Font | null = null;

function ladeSchriften() {
  if (displayLatin) return;
  const oeffne = (datei: string) => fontkitCreate(readFileSync(join(SCHRIFTEN, datei))) as Font;
  displayLatin = oeffne('newsreader-latin-wght-normal.woff2');
  displayLatinExt = oeffne('newsreader-latin-ext-wght-normal.woff2');
  utilityLatin = oeffne('ibm-plex-sans-latin-wght-normal.woff2');
  utilityLatinExt = oeffne('ibm-plex-sans-latin-ext-wght-normal.woff2');
}

/** Wählt je Zeichen die Schriftdatei, die das Zeichen tatsächlich enthält. */
function fuerZeichen(zeichen: string, art: 'display' | 'utility'): Font {
  ladeSchriften();
  const basis = art === 'display' ? displayLatin! : utilityLatin!;
  const ext = art === 'display' ? displayLatinExt! : utilityLatinExt!;
  const cp = zeichen.codePointAt(0) ?? 32;
  return basis.hasGlyphForCodePoint(cp) ? basis : ext;
}

interface Glyphzeile {
  d: string;
  breite: number;
}

/**
 * Setzt einen Text in SVG-Pfade um. Rückgabe ist ein einzelner
 * `d`-String plus die Gesamtbreite in Pixeln.
 */
function textZuPfad(text: string, groesse: number, art: 'display' | 'utility'): Glyphzeile {
  ladeSchriften();
  let x = 0;
  const teile: string[] = [];

  for (const zeichen of [...text]) {
    const font = fuerZeichen(zeichen, art);
    const skala = groesse / font.unitsPerEm;
    const lauf = font.layout(zeichen);

    for (let i = 0; i < lauf.glyphs.length; i += 1) {
      const glyph = lauf.glyphs[i];
      const position = lauf.positions[i];
      if (!glyph || !position) continue;
      const d = glyph.path.toSVG();
      if (d) {
        // y wird gespiegelt, weil SVG nach unten wächst, Schriftkoordinaten nach oben.
        teile.push(
          `<path d="${d}" transform="translate(${(x + position.xOffset * skala).toFixed(2)} 0) scale(${skala.toFixed(5)} ${(-skala).toFixed(5)})"/>`,
        );
      }
      x += position.xAdvance * skala;
    }
  }

  return { d: teile.join(''), breite: x };
}

function breiteVon(text: string, groesse: number, art: 'display' | 'utility'): number {
  ladeSchriften();
  let x = 0;
  for (const zeichen of [...text]) {
    const font = fuerZeichen(zeichen, art);
    const skala = groesse / font.unitsPerEm;
    x += font.layout(zeichen).advanceWidth * skala;
  }
  return x;
}

/** Bricht einen Text auf eine maximale Zeilenbreite um. */
function umbrechen(
  text: string,
  groesse: number,
  maxBreite: number,
  art: 'display' | 'utility',
  maxZeilen = 4,
): string[] {
  const woerter = text.split(/\s+/).filter(Boolean);
  const zeilen: string[] = [];
  let aktuell = '';

  for (const wort of woerter) {
    const versuch = aktuell ? `${aktuell} ${wort}` : wort;
    if (breiteVon(versuch, groesse, art) <= maxBreite) {
      aktuell = versuch;
    } else {
      if (aktuell) zeilen.push(aktuell);
      aktuell = wort;
      if (zeilen.length === maxZeilen) break;
    }
  }
  if (aktuell && zeilen.length < maxZeilen) zeilen.push(aktuell);

  if (zeilen.length === maxZeilen && woerter.length > 0) {
    const letzte = zeilen[maxZeilen - 1] ?? '';
    const zusammen = zeilen.join(' ');
    if (zusammen.length < text.length) {
      zeilen[maxZeilen - 1] = letzte.replace(/\s*\S*$/, '') + ' …';
    }
  }

  return zeilen;
}

export interface OgOptionen {
  titel: string;
  /** Kennzeichnung über dem Titel, z. B. der Bereichsname. */
  eyebrow?: string | undefined;
  /** Fußzeile, üblicherweise der Portalname. */
  fuss?: string | undefined;
  /** Bearbeitungsstand, erscheint als kleine Marke. */
  status?: string | undefined;
}

/**
 * Baut das SVG. Gestaltung bewusst nüchtern und ohne Bildmaterial:
 * Kalksteinfläche, feine Rahmenlinie, Ockerbalken links, Text.
 * Keine religiösen Symbole, keine Fotos.
 */
function baueSvg({ titel, eyebrow, fuss, status }: OgOptionen): string {
  const rand = 72;
  const inhaltsbreite = BREITE - rand * 2 - 24;

  const titelGroesse = titel.length > 60 ? 58 : titel.length > 34 ? 68 : 80;
  const zeilen = umbrechen(titel, titelGroesse, inhaltsbreite, 'display', 4);

  const zeilenhoehe = titelGroesse * 1.16;
  const blockHoehe = zeilen.length * zeilenhoehe;
  const startY = (HOEHE - blockHoehe) / 2 + titelGroesse * 0.78;

  const teile: string[] = [];

  teile.push(`<rect width="${BREITE}" height="${HOEHE}" fill="#f6f2ea"/>`);
  // Ockerbalken links – dieselbe Rolle wie die Akzentlinie im Layout.
  teile.push(`<rect x="0" y="0" width="14" height="${HOEHE}" fill="#6b470d"/>`);
  teile.push(
    `<rect x="${rand - 24}" y="40" width="${BREITE - (rand - 24) - 40}" height="${HOEHE - 80}" fill="none" stroke="#ded5c3" stroke-width="2"/>`,
  );

  if (eyebrow) {
    const e = textZuPfad(eyebrow.toUpperCase(), 24, 'utility');
    teile.push(`<g fill="#544b41" transform="translate(${rand} 108)">${e.d}</g>`);
  }

  zeilen.forEach((zeile, i) => {
    const pfad = textZuPfad(zeile, titelGroesse, 'display');
    teile.push(
      `<g fill="#1f1b16" transform="translate(${rand} ${(startY + i * zeilenhoehe).toFixed(1)})">${pfad.d}</g>`,
    );
  });

  if (fuss) {
    const f = textZuPfad(fuss, 26, 'utility');
    teile.push(`<g fill="#544b41" transform="translate(${rand} ${HOEHE - 76})">${f.d}</g>`);
  }

  if (status) {
    const s = textZuPfad(status, 22, 'utility');
    const breite = s.breite + 32;
    teile.push(
      `<rect x="${BREITE - rand - breite}" y="${HOEHE - 106}" width="${breite}" height="42" fill="none" stroke="#7c7263" stroke-width="1.5" rx="2"/>`,
      `<g fill="#544b41" transform="translate(${BREITE - rand - breite + 16} ${HOEHE - 76})">${s.d}</g>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}" viewBox="0 0 ${BREITE} ${HOEHE}">${teile.join('')}</svg>`;
}

/** Erzeugt das fertige PNG. */
export async function ogBild(optionen: OgOptionen): Promise<Buffer> {
  const svg = baueSvg(optionen);
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
}
