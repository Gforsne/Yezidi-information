import Aufklappbox from './content/Aufklappbox.astro';
import Belegluecke from './content/Belegluecke.astro';
import Begriff from './content/Begriff.astro';
import Bildergalerie from './content/Bildergalerie.astro';
import Bildplatzhalter from './content/Bildplatzhalter.astro';
import Cite from './content/Cite.astro';
import Faktenbox from './content/Faktenbox.astro';
import Inhaltshinweis from './content/Inhaltshinweis.astro';
import KurmanciBegriff from './content/KurmanciBegriff.astro';
import Randglosse from './content/Randglosse.astro';
import Standdiagramm from './spezial/Standdiagramm.astro';
import Unsicher from './content/Unsicher.astro';
import Vergleichstabelle from './content/Vergleichstabelle.astro';
import Zitat from './content/Zitat.astro';

/**
 * Komponenten, die in MDX-Inhalten ohne Import benutzt werden dürfen.
 *
 * Sie werden beim Rendern über `<Content components={mdxKomponenten} />`
 * eingehängt. Autorinnen und Autoren schreiben also einfach
 * `<Cite id="…" />`, ohne sich um Importpfade zu kümmern – und es kann
 * keine Datei geben, die eine andere Cite-Implementierung einbindet.
 *
 * Wird hier etwas ergänzt, gehört es zusätzlich in CONTENT-GUIDE.md und
 * auf die Styleguide-Seite.
 */
export const mdxKomponenten = {
  Aufklappbox,
  Belegluecke,
  Begriff,
  Bildergalerie,
  Bildplatzhalter,
  Cite,
  Faktenbox,
  Inhaltshinweis,
  KurmanciBegriff,
  Randglosse,
  Standdiagramm,
  Unsicher,
  Vergleichstabelle,
  Zitat,
};

export type MdxKomponentenName = keyof typeof mdxKomponenten;
