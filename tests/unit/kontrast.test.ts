import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Kontrastprüfung direkt an den Design-Tokens.
 *
 * Der Test liest tokens.css und rechnet die Werte nach, statt eine
 * Liste zu pflegen, die neben der CSS-Datei veraltet. Wird eine Farbe
 * geändert, fällt der Test sofort auf.
 */

const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

/** Löst eine Kette von var()-Verweisen bis zum Hex-Wert auf. */
function hexWert(token: string, block: string): string {
  const muster = new RegExp(`${token}:\\s*([^;]+);`);
  const treffer = muster.exec(block);
  if (!treffer) throw new Error(`Token ${token} nicht gefunden.`);
  const wert = (treffer[1] ?? '').trim();
  if (wert.startsWith('#')) return wert;
  const verweis = /var\((--[a-z0-9-]+)\)/.exec(wert);
  if (verweis?.[1]) return hexWert(verweis[1], css);
  throw new Error(`Token ${token} löst nicht zu einem Hex-Wert auf: ${wert}`);
}

function luminanz(hex: string): number {
  const kanal = (i: number) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * kanal(1) + 0.7152 * kanal(3) + 0.0722 * kanal(5);
}

function verhaeltnis(a: string, b: string): number {
  const la = luminanz(a);
  const lb = luminanz(b);
  const [hoch, tief] = la > lb ? [la, lb] : [lb, la];
  return (hoch + 0.05) / (tief + 0.05);
}

/** Der Block des dunklen Schemas – dort gelten eigene Werte. */
const dunkelBlock = css.slice(css.indexOf(":root[data-theme='dunkel']"));

describe('Farbkontraste (helles Schema)', () => {
  const flaeche = hexWert('--c-surface', css);

  it.each([
    ['--c-text', 7],
    ['--c-text-muted', 7],
    ['--c-accent', 7],
    ['--c-apparat', 7],
    ['--c-warn', 7],
  ])('%s erreicht mindestens %s:1', (token, min) => {
    expect(verhaeltnis(hexWert(token, css), flaeche)).toBeGreaterThanOrEqual(min);
  });

  it('Beiwerk erreicht mindestens AA (4.5:1)', () => {
    expect(verhaeltnis(hexWert('--c-text-faint', css), flaeche)).toBeGreaterThanOrEqual(4.5);
  });

  it('Bedienelement-Grenzen und Fokus erreichen mindestens 3:1', () => {
    expect(verhaeltnis(hexWert('--c-border-strong', css), flaeche)).toBeGreaterThanOrEqual(3);
    expect(verhaeltnis(hexWert('--c-focus', css), flaeche)).toBeGreaterThanOrEqual(3);
  });
});

describe('Farbkontraste (dunkles Schema)', () => {
  const flaeche = hexWert('--c-surface', dunkelBlock);

  it.each([
    ['--c-text', 7],
    ['--c-text-muted', 7],
    ['--c-accent', 7],
    ['--c-apparat', 7],
    ['--c-warn', 7],
  ])('%s erreicht mindestens %s:1', (token, min) => {
    expect(verhaeltnis(hexWert(token, dunkelBlock), flaeche)).toBeGreaterThanOrEqual(min);
  });

  it('Bedienelement-Grenzen und Fokus erreichen mindestens 3:1', () => {
    expect(verhaeltnis(hexWert('--c-border-strong', dunkelBlock), flaeche)).toBeGreaterThanOrEqual(
      3,
    );
    expect(verhaeltnis(hexWert('--c-focus', dunkelBlock), flaeche)).toBeGreaterThanOrEqual(3);
  });

  it('ist keine bloße Invertierung des hellen Schemas', () => {
    // Wäre der dunkle Modus invertiert, hätten Fläche und Text exakt
    // getauschte Werte. Genau das soll hier nicht der Fall sein.
    expect(hexWert('--c-surface', dunkelBlock)).not.toBe(hexWert('--c-text', css));
    expect(hexWert('--c-text', dunkelBlock)).not.toBe(hexWert('--c-surface', css));
  });
});
