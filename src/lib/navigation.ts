import { getCollection } from 'astro:content';
import type { Locale } from '../i18n/config';
import { defaultLocale } from '../i18n/config';
import { path } from '../i18n/utils';
import { sections, toolPages, type SectionDef, type SectionId } from './sections';

export interface NavPage {
  readonly slug: string;
  readonly title: string;
  readonly href: string;
  readonly status: 'stub' | 'entwurf' | 'belegt' | 'geprüft';
  readonly contentWarning: boolean;
  readonly order: number;
  readonly kurz: string;
  /** Aus welcher Collection der Eintrag stammt – für Icons und Filter. */
  readonly typ: 'artikel' | 'fest' | 'missverstaendnis';
}

export interface NavSection extends SectionDef {
  readonly href: string;
  readonly pages: readonly NavPage[];
}

/**
 * Kürzt einen Lead auf eine Zeile für Karten und Menüs.
 * Schneidet an der Satzgrenze, damit kein halber Satz entsteht.
 */
function ersterSatz(text: string, maxLen = 160): string {
  const trimmed = text.trim();
  const ende = trimmed.search(/[.!?](\s|$)/);
  const satz = ende > 0 ? trimmed.slice(0, ende + 1) : trimmed;
  return satz.length > maxLen ? satz.slice(0, maxLen - 1).trimEnd() + '…' : satz;
}

/**
 * Baut den Navigationsbaum aus den Inhalten – nicht aus einer separaten
 * Liste. So kann kein Menüpunkt existieren, hinter dem keine Seite liegt,
 * und keine Seite unauffindbar bleiben.
 *
 * Fehlt eine Sprache noch, wird auf Deutsch zurückgefallen, damit die
 * Navigation in allen vier Sprachrouten vollständig ist.
 */
export async function getNavTree(locale: Locale): Promise<NavSection[]> {
  const [artikel, feste, missverstaendnisse] = await Promise.all([
    getCollection('articles'),
    getCollection('festivals'),
    getCollection('misconceptions'),
  ]);

  const alle: (NavPage & { section: SectionId })[] = [];

  const nimm = <T extends { data: Record<string, unknown> }>(
    eintraege: T[],
    section: (e: T) => SectionId,
    typ: NavPage['typ'],
  ) => {
    for (const e of eintraege) {
      const d = e.data as {
        lang: Locale;
        draft?: boolean;
        slug: string;
        title: string;
        lead: string;
        status: NavPage['status'];
        contentWarning: boolean;
        order?: number;
      };
      if (d.draft) continue;
      if (d.lang !== locale && !(d.lang === defaultLocale && locale !== defaultLocale)) continue;
      const sec = section(e);
      alle.push({
        slug: d.slug,
        title: d.title,
        href: path(locale, sections.find((s) => s.id === sec)?.slug ?? sec, d.slug),
        status: d.status,
        contentWarning: d.contentWarning,
        order: d.order ?? 100,
        kurz: ersterSatz(d.lead),
        typ,
        section: sec,
      });
    }
  };

  nimm(artikel, (e) => (e.data as { section: SectionId }).section, 'artikel');
  nimm(feste, () => 'feste', 'fest');
  nimm(missverstaendnisse, () => 'missverstaendnisse', 'missverstaendnis');

  // Bei Sprach-Fallback keine Dubletten: pro Bereich+Slug nur ein Eintrag.
  const gesehen = new Set<string>();
  const eindeutig = alle.filter((p) => {
    const key = `${p.section}/${p.slug}`;
    if (gesehen.has(key)) return false;
    gesehen.add(key);
    return true;
  });

  return sections
    .map((s) => ({
      ...s,
      href: path(locale, s.slug),
      pages: eindeutig
        .filter((p) => p.section === s.id)
        .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'de')),
    }))
    .sort((a, b) => a.order - b.order);
}

/** Werkzeugseiten mit sprachabhängigen Links. */
export function getToolLinks(locale: Locale) {
  return toolPages.map((p) => ({ ...p, href: path(locale, p.slug) }));
}

export interface Crumb {
  readonly label: string;
  readonly href?: string | undefined;
}

/** Brotkrumenpfad für eine Seite. Der letzte Eintrag ist nie verlinkt. */
export function buildBreadcrumb(
  locale: Locale,
  homeLabel: string,
  trail: { label: string; slug?: string }[],
): Crumb[] {
  const crumbs: Crumb[] = [{ label: homeLabel, href: path(locale) }];
  let acc = '';
  trail.forEach((item, i) => {
    if (item.slug) acc = acc ? `${acc}/${item.slug}` : item.slug;
    const letzter = i === trail.length - 1;
    crumbs.push({ label: item.label, href: letzter || !item.slug ? undefined : path(locale, acc) });
  });
  return crumbs;
}
