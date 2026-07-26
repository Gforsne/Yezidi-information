import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { ui } from '../i18n/ui';
import { sectionById } from '../lib/sections';
import { path } from '../i18n/utils';

/**
 * RSS-Feed über neue und aktualisierte Inhalte.
 *
 * Der Feed nennt im Titel den Bearbeitungsstand mit. Wer ihn abonniert,
 * soll sehen können, ob eine Seite neu als Gerüst angelegt oder
 * tatsächlich belegt wurde – sonst wäre er im Aufbaustadium wertlos.
 */
export const GET: APIRoute = async (context) => {
  const [artikel, feste, missverstaendnisse] = await Promise.all([
    getCollection('articles'),
    getCollection('festivals'),
    getCollection('misconceptions'),
  ]);

  const statusText: Record<string, string> = {
    stub: 'Gerüst',
    entwurf: 'Entwurf',
    belegt: 'belegt',
    geprüft: 'geprüft',
  };

  type Eintrag = { title: string; description: string; link: string; pubDate: Date };
  const eintraege: Eintrag[] = [];

  for (const a of artikel) {
    if (a.data.lang !== 'de' || a.data.draft) continue;
    eintraege.push({
      title: `${a.data.title} (${statusText[a.data.status]})`,
      description: a.data.lead,
      link: path('de', sectionById[a.data.section].slug, a.data.slug),
      pubDate: a.data.updated,
    });
  }
  for (const f of feste) {
    if (f.data.lang !== 'de' || f.data.draft) continue;
    eintraege.push({
      title: `${f.data.title} (${statusText[f.data.status]})`,
      description: f.data.lead,
      link: path('de', 'feste', f.data.slug),
      pubDate: f.data.updated,
    });
  }
  for (const m of missverstaendnisse) {
    if (m.data.lang !== 'de' || m.data.draft) continue;
    eintraege.push({
      title: `${m.data.title} (${statusText[m.data.status]})`,
      description: m.data.lead,
      link: path('de', 'missverstaendnisse', m.data.slug),
      pubDate: m.data.updated,
    });
  }

  eintraege.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: ui.de['site.name'],
    description: ui.de['site.description'],
    site: context.site ?? 'https://ezidi-portal.example',
    items: eintraege.slice(0, 50),
    customData: '<language>de-DE</language>',
  });
};
