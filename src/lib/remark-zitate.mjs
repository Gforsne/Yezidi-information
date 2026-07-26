import { visit } from 'unist-util-visit';

/**
 * remark-zitate
 * ---------------------------------------------------------------------
 * Vergibt die hochgestellten Belegziffern zur Bauzeit.
 *
 * Warum als Plugin und nicht in der Komponente: Eine Astro-Komponente
 * kennt den Seitenkontext nicht, in dem sie steht. Eine gemeinsame
 * Registry im Modulscope wäre bei parallelem Rendern unzuverlässig.
 * Das Plugin dagegen sieht Frontmatter und Dokument einer einzelnen
 * Datei – die Nummerierung ist damit deterministisch, ohne JavaScript
 * im Browser und ohne geteilten Zustand.
 *
 * Regel: Die Ziffer ist die Position der Quellen-ID in `sources` im
 * Frontmatter. Dieselbe Quelle bekommt an jeder Fundstelle dieselbe
 * Ziffer – so, wie es in einem gedruckten Apparat üblich ist.
 *
 * Nebenprodukte im Frontmatter (für Belegquote und content-report.md):
 *   _zitate        Anzahl der <Cite>-Vorkommen
 *   _zitierteIds   tatsächlich zitierte Quellen-IDs
 *   _belegluecken  Anzahl der <Belegluecke>-Markierungen
 *   _unsicher      Anzahl der <Unsicher>-Markierungen
 *   _abschnitte    Anzahl der H2-Abschnitte
 *   _zitatFehler   Quellen-IDs, die nicht im Frontmatter stehen
 */

const JSX_TYPES = new Set(['mdxJsxFlowElement', 'mdxJsxTextElement']);

function attrWert(node, name) {
  const attr = node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
  if (!attr) return undefined;
  if (typeof attr.value === 'string') return attr.value;
  // Ausdrucksattribute wie id={foo} werden bewusst nicht aufgelöst.
  return undefined;
}

function setzeAttr(node, name, wert) {
  node.attributes = node.attributes ?? [];
  const vorhanden = node.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
  if (vorhanden) {
    vorhanden.value = wert;
    return;
  }
  node.attributes.push({ type: 'mdxJsxAttribute', name, value: wert });
}

export default function remarkZitate() {
  return function transformer(tree, file) {
    const frontmatter = file.data?.astro?.frontmatter;
    if (!frontmatter) return;

    const quellen = Array.isArray(frontmatter.sources) ? frontmatter.sources : [];
    const reihenfolge = new Map();
    quellen.forEach((q, i) => {
      const id = typeof q === 'string' ? q : q?.id;
      if (id && !reihenfolge.has(id)) reihenfolge.set(id, reihenfolge.size + 1);
    });

    let zitate = 0;
    let belegluecken = 0;
    let unsicher = 0;
    let abschnitte = 0;
    const zitierteIds = new Set();
    const zitatFehler = new Set();

    visit(tree, (node) => {
      if (node.type === 'heading' && node.depth === 2) abschnitte += 1;
      if (!JSX_TYPES.has(node.type)) return;

      switch (node.name) {
        case 'Cite': {
          zitate += 1;
          const id = attrWert(node, 'id');
          if (!id) {
            setzeAttr(node, 'nr', '0');
            zitatFehler.add('(ohne id)');
            break;
          }
          zitierteIds.add(id);
          const nr = reihenfolge.get(id);
          if (nr === undefined) {
            // Nicht im Frontmatter angemeldet: sichtbar machen statt still schlucken.
            setzeAttr(node, 'nr', '0');
            zitatFehler.add(id);
          } else {
            setzeAttr(node, 'nr', String(nr));
          }
          break;
        }
        case 'Belegluecke':
          belegluecken += 1;
          break;
        case 'Unsicher':
          unsicher += 1;
          break;
        default:
          break;
      }
    });

    frontmatter._zitate = zitate;
    frontmatter._zitierteIds = [...zitierteIds];
    frontmatter._belegluecken = belegluecken;
    frontmatter._unsicher = unsicher;
    frontmatter._abschnitte = abschnitte;
    frontmatter._zitatFehler = [...zitatFehler];
  };
}
