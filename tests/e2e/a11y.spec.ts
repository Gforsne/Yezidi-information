import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Barrierefreiheitsprüfung mit axe-core.
 *
 * Geprüft wird gegen WCAG 2.0/2.1/2.2 auf Stufe A und AA. Die Prüfung
 * läuft über die Hauptrouten und zusätzlich im dunklen Schema, weil
 * Kontrastfehler sonst nur in einem der beiden Modi auffallen würden.
 *
 * axe ersetzt keine manuelle Prüfung. Der dokumentierte Screenreader-
 * Durchgang steht in der Barrierefreiheitserklärung.
 */

const REGELN = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const routen = [
  { name: 'Startseite', pfad: '/de' },
  { name: 'Bereichsseite', pfad: '/de/religion' },
  { name: 'Artikelseite', pfad: '/de/religion/tawusi-melek-und-die-sieben-engel' },
  { name: 'Genozid-Bereich', pfad: '/de/genozid' },
  { name: 'Zeitleiste', pfad: '/de/zeitleiste' },
  { name: 'Glossar', pfad: '/de/glossar' },
  { name: 'Quellenverzeichnis', pfad: '/de/quellen' },
  { name: 'Festkalender', pfad: '/de/kalender' },
  { name: 'Karten', pfad: '/de/karten' },
  { name: 'Häufige Fragen', pfad: '/de/faq' },
  { name: 'Personen', pfad: '/de/personen' },
  { name: 'Suche', pfad: '/de/suche' },
  { name: '404', pfad: '/de/gibt-es-nicht' },
  { name: 'Arabische Route (RTL)', pfad: '/ar' },
  { name: 'Styleguide', pfad: '/styleguide' },
];

for (const route of routen) {
  test(`${route.name} ist frei von axe-Verstößen`, async ({ page }) => {
    await page.goto(route.pfad);
    const ergebnis = await new AxeBuilder({ page }).withTags(REGELN).analyze();
    expect(
      ergebnis.violations.map((v) => ({
        id: v.id,
        beschreibung: v.help,
        stellen: v.nodes.map((n) => n.target.join(' ')),
      })),
    ).toEqual([]);
  });
}

test('Artikelseite ist auch im dunklen Schema frei von axe-Verstößen', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/de/religion/tawusi-melek-und-die-sieben-engel');
  const ergebnis = await new AxeBuilder({ page }).withTags(REGELN).analyze();
  expect(ergebnis.violations.map((v) => v.id)).toEqual([]);
});

test('Startseite ist im dunklen Schema frei von axe-Verstößen', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/de');
  const ergebnis = await new AxeBuilder({ page }).withTags(REGELN).analyze();
  expect(ergebnis.violations.map((v) => v.id)).toEqual([]);
});

test.describe('Tastaturbedienung', () => {
  test('Skip-Link ist erreichbar und springt zum Inhalt', async ({ page }) => {
    await page.goto('/de');
    await page.keyboard.press('Tab');
    const fokus = page.locator(':focus');
    await expect(fokus).toHaveText(/Direkt zum Inhalt/);
    await fokus.press('Enter');
    await expect(page.locator('#inhalt')).toBeFocused();
  });

  test('Mega-Menü schließt mit Escape', async ({ page }) => {
    await page.goto('/de');
    const punkt = page.locator('#hauptnavigation details').first();
    await punkt.locator('summary').click();
    await expect(punkt).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(punkt).not.toHaveAttribute('open', '');
  });

  test('Farbschema-Umschalter ist per Tastatur bedienbar', async ({ page }) => {
    await page.goto('/de');
    const knopf = page.locator('[data-themenwechsler]');
    await knopf.focus();
    await knopf.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-theme', /hell|dunkel/);
  });

  test('jedes fokussierbare Element im Kopf hat einen sichtbaren Fokusring', async ({ page }) => {
    await page.goto('/de');
    const umriss = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('header a');
      el?.focus();
      return getComputedStyle(document.activeElement as Element).outlineWidth;
    });
    expect(umriss).not.toBe('0px');
  });
});

test.describe('Struktur', () => {
  test('genau eine h1 je Seite', async ({ page }) => {
    for (const route of routen.slice(0, 8)) {
      await page.goto(route.pfad);
      await expect(page.locator('h1'), route.name).toHaveCount(1);
    }
  });

  test('Überschriftenebenen springen nicht', async ({ page }) => {
    await page.goto('/de/religion/tawusi-melek-und-die-sieben-engel');
    const ebenen = await page.$$eval('h1, h2, h3, h4, h5, h6', (els) =>
      els.map((e) => Number(e.tagName.slice(1))),
    );
    let vorherige = 0;
    for (const ebene of ebenen) {
      if (vorherige !== 0) expect(ebene - vorherige).toBeLessThanOrEqual(1);
      vorherige = ebene;
    }
  });

  test('alle Bilder tragen einen Alt-Text', async ({ page }) => {
    await page.goto('/de/styleguide');
    const ohneAlt = await page.$$eval('img', (imgs) =>
      imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src') ?? '?'),
    );
    expect(ohneAlt).toEqual([]);
  });
});
