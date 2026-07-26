import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ogBild, type OgOptionen } from '../../lib/og';
import { sections, sectionById } from '../../lib/sections';
import { ui } from '../../i18n/ui';

/**
 * Statisch erzeugte Open-Graph-Bilder.
 *
 * Es wird je Inhaltsseite genau ein Bild gebaut – auf Deutsch, weil die
 * Inhalte deutschsprachig sind. Die Sprachrouten teilen sich dieses Bild,
 * solange keine Übersetzung existiert.
 */

const statusText: Record<string, string> = {
  stub: 'Gerüst',
  entwurf: 'Entwurf',
  belegt: 'Belegt',
  geprüft: 'Geprüft',
};

export async function getStaticPaths() {
  const [artikel, feste, missverstaendnisse] = await Promise.all([
    getCollection('articles'),
    getCollection('festivals'),
    getCollection('misconceptions'),
  ]);

  const pfade: { params: { slug: string }; props: OgOptionen }[] = [
    {
      params: { slug: 'standard' },
      props: {
        titel: ui.de['site.tagline'],
        eyebrow: 'Êzîdî-Wissensportal',
        fuss: 'Belegt, offen über Lücken, ohne Tracker',
      },
    },
  ];

  for (const s of sections) {
    pfade.push({
      params: { slug: `bereich-${s.slug}` },
      props: {
        titel: s.title,
        eyebrow: 'Bereich',
        fuss: ui.de['site.name'],
      },
    });
  }

  for (const a of artikel) {
    if (a.data.lang !== 'de' || a.data.draft) continue;
    pfade.push({
      params: { slug: `artikel/${a.data.section}/${a.data.slug}` },
      props: {
        titel: a.data.title,
        eyebrow: sectionById[a.data.section].title,
        fuss: ui.de['site.name'],
        ...(statusText[a.data.status] ? { status: statusText[a.data.status] as string } : {}),
      },
    });
  }

  for (const f of feste) {
    if (f.data.lang !== 'de' || f.data.draft) continue;
    pfade.push({
      params: { slug: `artikel/feste/${f.data.slug}` },
      props: {
        titel: f.data.title,
        eyebrow: 'Feste, Kalender und Riten',
        fuss: ui.de['site.name'],
        ...(statusText[f.data.status] ? { status: statusText[f.data.status] as string } : {}),
      },
    });
  }

  for (const m of missverstaendnisse) {
    if (m.data.lang !== 'de' || m.data.draft) continue;
    pfade.push({
      params: { slug: `artikel/missverstaendnisse/${m.data.slug}` },
      props: {
        titel: m.data.title,
        eyebrow: 'Missverständnisse und Desinformation',
        fuss: ui.de['site.name'],
        ...(statusText[m.data.status] ? { status: statusText[m.data.status] as string } : {}),
      },
    });
  }

  return pfade;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await ogBild(props as OgOptionen);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
