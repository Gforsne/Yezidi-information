import { describe, expect, it } from 'vitest';
import remarkZitate from '../../src/lib/remark-zitate.mjs';

/**
 * Der Belegapparat funktioniert nur, wenn die Nummerierung zur Bauzeit
 * stimmt. Diese Tests bauen einen minimalen MDX-Baum nach, statt den
 * ganzen Markdown-Prozessor zu starten – geprüft wird die Regel, nicht
 * das Fremdwerkzeug.
 */

interface Attr {
  type: string;
  name: string;
  value: string;
}
interface Knoten {
  type: string;
  name?: string;
  depth?: number;
  attributes?: Attr[];
  children?: Knoten[];
}

function cite(id: string): Knoten {
  return {
    type: 'mdxJsxTextElement',
    name: 'Cite',
    attributes: [{ type: 'mdxJsxAttribute', name: 'id', value: id }],
  };
}

function lauf(baum: Knoten, sources: { id: string }[]) {
  const file = { data: { astro: { frontmatter: { sources } as Record<string, unknown> } } };
  remarkZitate()(baum, file);
  return file.data.astro.frontmatter;
}

function nrVon(knoten: Knoten): string | undefined {
  return knoten.attributes?.find((a) => a.name === 'nr')?.value;
}

describe('remark-zitate', () => {
  it('vergibt Ziffern nach der Reihenfolge im Frontmatter', () => {
    const a = cite('quelle-b');
    const b = cite('quelle-a');
    const baum: Knoten = { type: 'root', children: [a, b] };
    lauf(baum, [{ id: 'quelle-a' }, { id: 'quelle-b' }]);
    expect(nrVon(b)).toBe('1');
    expect(nrVon(a)).toBe('2');
  });

  it('gibt derselben Quelle an jeder Fundstelle dieselbe Ziffer', () => {
    const a = cite('quelle-a');
    const b = cite('quelle-a');
    const baum: Knoten = { type: 'root', children: [a, b] };
    lauf(baum, [{ id: 'quelle-a' }]);
    expect(nrVon(a)).toBe('1');
    expect(nrVon(b)).toBe('1');
  });

  it('markiert nicht angemeldete Quellen mit 0 und meldet sie', () => {
    const a = cite('unbekannt');
    const baum: Knoten = { type: 'root', children: [a] };
    const fm = lauf(baum, [{ id: 'quelle-a' }]);
    expect(nrVon(a)).toBe('0');
    expect(fm['_zitatFehler']).toEqual(['unbekannt']);
  });

  it('zählt Abschnitte, Beleglücken und Unsicherheiten', () => {
    const baum: Knoten = {
      type: 'root',
      children: [
        { type: 'heading', depth: 2 },
        { type: 'heading', depth: 3 },
        { type: 'heading', depth: 2 },
        { type: 'mdxJsxFlowElement', name: 'Belegluecke' },
        { type: 'mdxJsxFlowElement', name: 'Belegluecke' },
        { type: 'mdxJsxTextElement', name: 'Unsicher' },
      ],
    };
    const fm = lauf(baum, []);
    expect(fm['_abschnitte']).toBe(2);
    expect(fm['_belegluecken']).toBe(2);
    expect(fm['_unsicher']).toBe(1);
  });

  it('läuft ohne Frontmatter durch, ohne zu werfen', () => {
    const baum: Knoten = { type: 'root', children: [cite('x')] };
    expect(() => remarkZitate()(baum, { data: {} })).not.toThrow();
  });

  it('sammelt die tatsächlich zitierten Quellen-IDs', () => {
    const baum: Knoten = { type: 'root', children: [cite('a'), cite('a'), cite('b')] };
    const fm = lauf(baum, [{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    expect(fm['_zitierteIds']).toEqual(['a', 'b']);
    expect(fm['_zitate']).toBe(3);
  });
});
