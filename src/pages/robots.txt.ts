import type { APIRoute } from 'astro';

/**
 * robots.txt.
 *
 * Der interne Styleguide und die Suchseite werden ausgeschlossen: Beide
 * sind Werkzeuge, keine Inhalte, und würden Suchergebnisse verwässern.
 */
export const GET: APIRoute = ({ site }) => {
  const basis = site?.href.replace(/\/$/, '') ?? '';
  const text = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /styleguide',
    'Disallow: /de/suche',
    'Disallow: /en/suche',
    'Disallow: /ku/suche',
    'Disallow: /ar/suche',
    'Disallow: /og/',
    '',
    `Sitemap: ${basis}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
