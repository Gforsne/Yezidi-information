// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkZitate from './src/lib/remark-zitate.mjs';

/**
 * Basis-URL der Produktionsinstanz.
 * Wird für Canonicals, hreflang, Sitemap, RSS und OG-Bilder gebraucht.
 * Über die Umgebungsvariable SITE_URL überschreibbar (siehe README.md).
 */
const site = process.env.SITE_URL ?? 'https://ezidi-portal.example';

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'ku', 'ar'],
    routing: {
      prefixDefaultLocale: true,
      // Astros eigene Weiterleitungsseite wird nicht erzeugt: Unter `/`
      // steht eine echte Sprachauswahl (src/pages/index.astro), die alle
      // vier Sprachen anbietet statt nur nach /de/ zu springen.
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: { de: 'de-DE', en: 'en', ku: 'ku', ar: 'ar' },
      },
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],
  markdown: {
    // Ab Astro 7 wird die remark/rehype-Kette über `processor` übergeben.
    processor: unified({
      remarkPlugins: [remarkZitate],
      // Typografische Ersetzungen sind für einen deutschsprachigen
      // Fließtext erwünscht (Gedankenstrich, Anführungszeichen).
      smartypants: true,
      gfm: true,
    }),
    // Syntaxhervorhebung: In diesem Portal steht kaum Code; das
    // Doppel-Theme deckt beide Farbschemata ohne zusätzliches CSS ab.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },
  image: {
    // Nur lokale Bilder – bewusst keine Remote-Patterns (siehe DECISIONS.md, D-014).
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0,
    },
  },
});
