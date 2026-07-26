/**
 * Typen für den Node-Einstiegspunkt von fontkit.
 *
 * fontkit liefert Typdeklarationen mit, TypeScript löst über die
 * `exports`-Zuordnung aber die Browser-Variante auf, für die keine
 * Deklaration existiert. Hier stehen genau die Teile, die dieses Projekt
 * benutzt: Glyphenabdeckung prüfen und Text in SVG-Pfade umsetzen.
 */
declare module 'fontkit' {
  export interface Glyph {
    readonly path: { toSVG(): string };
    readonly advanceWidth: number;
  }

  export interface GlyphPosition {
    xAdvance: number;
    yAdvance: number;
    xOffset: number;
    yOffset: number;
  }

  export interface GlyphRun {
    readonly glyphs: Glyph[];
    readonly positions: GlyphPosition[];
    readonly advanceWidth: number;
  }

  export interface Font {
    readonly familyName: string;
    readonly unitsPerEm: number;
    readonly numGlyphs: number;
    hasGlyphForCodePoint(codePoint: number): boolean;
    layout(text: string): GlyphRun;
  }

  export function create(buffer: Buffer | Uint8Array): Font;
  export function openSync(pfad: string): Font;
}
