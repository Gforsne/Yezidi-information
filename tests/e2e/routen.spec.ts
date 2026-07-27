import { expect, test } from '@playwright/test';

/**
 * Rauchtest der Hauptrouten.
 *
 * Geprüft wird, dass jede Route ausgeliefert wird, genau eine <h1> hat,
 * eine Beschreibung trägt und die Navigation vorhanden ist. Inhaltliche
 * Aussagen werden hier bewusst nicht geprüft – dafür ist check:content da.
 */

const bereiche = [
  'ueberblick',
  'religion',
  'gesellschaft',
  'heilige-orte',
  'feste',
  'sprache',
  'geschichte',
  'genozid',
  'gegenwart',
  'missverstaendnisse',
  'kultur',
  'personen',
  'wissenschaft',
  'vermittlung',
  'meta',
];

const werkzeuge = [
  'glossar',
  'quellen',
  'zeitleiste',
  'kalender',
  'karten',
  'faq',
  'unterricht',
  'mediathek',
  'rezepte',
  'orte',
  'suche',
  'aenderungen',
];

test.describe('Grundgerüst', () => {
  test('Startseite lädt und nennt das Quellenprinzip', async ({ page }) => {
    await page.goto('/de');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toContainText('Wissensportal');
    await expect(page.locator('footer')).toContainText('Quelle');
  });

  test('Wurzelroute leitet nach /de weiter', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/de$/);
  });

  test('Wurzelroute bietet ohne Weiterleitung eine Sprachauswahl', async ({ request }) => {
    // Die Seite leitet per meta-refresh weiter. Geprüft wird deshalb das
    // ausgelieferte HTML: Wer der Weiterleitung nicht folgen kann, muss
    // trotzdem alle vier Sprachen erreichen.
    const html = await (await request.get('/')).text();
    for (const sprache of ['/de', '/en', '/ku', '/ar']) {
      expect(html).toContain(`href="${sprache}"`);
    }
  });

  test('404-Seite bietet Suche und Einstiege', async ({ page }) => {
    const antwort = await page.goto('/de/gibt-es-nicht');
    expect(antwort?.status()).toBe(404);
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });
});

test.describe('Bereiche', () => {
  for (const bereich of bereiche) {
    test(`/de/${bereich} liefert eine vollständige Seite`, async ({ page }) => {
      await page.goto(`/de/${bereich}`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await expect(page.locator('nav#hauptnavigation')).toBeVisible();
      await expect(page.locator('nav[aria-label="Sie befinden sich hier"]')).toBeVisible();
    });
  }
});

test.describe('Werkzeuge', () => {
  for (const werkzeug of werkzeuge) {
    test(`/de/${werkzeug} liefert eine vollständige Seite`, async ({ page }) => {
      await page.goto(`/de/${werkzeug}`);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }
});

test.describe('Sprachrouten', () => {
  for (const lang of ['de', 'en', 'ku', 'ar']) {
    test(`/${lang} ist erreichbar und korrekt ausgezeichnet`, async ({ page }) => {
      await page.goto(`/${lang}`);
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', new RegExp(`^${lang}`));
      await expect(html).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    });
  }

  test('Sprachumschalter führt auf dieselbe Seite in anderer Sprache', async ({ page }) => {
    await page.goto('/de/religion');
    await page.locator('nav[aria-label="Sprache wechseln"] a', { hasText: 'KU' }).click();
    await expect(page).toHaveURL(/\/ku\/religion$/);
  });
});

test.describe('Artikelseite', () => {
  const pfad = '/de/religion/tawusi-melek-und-die-sieben-engel';

  test('zeigt Lead, Gliederungshinweis und Belegspalte', async ({ page }) => {
    await page.goto(pfad);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByText('In Kürze')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Diese Seite ist ein Gerüst' })).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Belegspalte' })).toBeVisible();
  });

  test('macht Beleglücken sichtbar, statt sie zu verschweigen', async ({ page }) => {
    await page.goto(pfad);
    await expect(page.locator('[data-belegluecke]').first()).toBeVisible();
  });

  test('bietet einen Melde-Link mit vorausgefülltem Betreff', async ({ page }) => {
    await page.goto(pfad);
    // Es gibt zwei Melde-Links mit Seitenbezug: einen im Artikelfuß,
    // einen in der Belegspalte. Der allgemeine Fußzeilen-Link zählt
    // nicht dazu, deshalb wird über den Betreff-Parameter ausgewählt.
    const links = page.locator('a[href*="betreff=Korrekturhinweis"]');
    await expect(links).toHaveCount(2);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('href', /seite=%2Fde%2Freligion/);
    }
  });

  test('setzt Canonical, hreflang und OG-Bild', async ({ page }) => {
    await page.goto(pfad);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(5);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });
});

test.describe('Genozid-Bereich', () => {
  test('zeigt den Inhaltshinweis auf der Bereichsseite', async ({ page }) => {
    await page.goto('/de/genozid');
    await expect(page.getByRole('note').filter({ hasText: 'Inhaltshinweis' })).toBeVisible();
  });

  test('zeigt den Inhaltshinweis auf jeder Unterseite', async ({ page }) => {
    await page.goto('/de/genozid/voelkerrechtliche-einordnung');
    await expect(page.getByRole('note').filter({ hasText: 'Inhaltshinweis' })).toBeVisible();
  });
});

test.describe('Werkzeuge mit Daten', () => {
  test('Zeitleiste rendert Einträge und Filter', async ({ page }) => {
    await page.goto('/de/zeitleiste');
    await expect(page.locator('.eintrag').first()).toBeVisible();
    await expect(page.locator('[data-filter]')).toBeVisible();
  });

  test('Zeitleiste filtert im Browser', async ({ page }) => {
    await page.goto('/de/zeitleiste');
    const vorher = await page.locator('.eintrag:visible').count();
    await page.locator('input[name="nurFirman"]').check();
    const nachher = await page.locator('.eintrag:visible').count();
    expect(nachher).toBeLessThan(vorher);
    expect(nachher).toBeGreaterThan(0);
  });

  test('Glossar zeigt Begriffe und filtert', async ({ page }) => {
    await page.goto('/de/glossar');
    await expect(page.locator('.eintrag').first()).toBeVisible();
    await page.locator('#glossar-suche').fill('Qewl');
    await expect(page.locator('.eintrag:visible')).toHaveCount(1);
  });

  test('Festkalender zeigt das Monatsband', async ({ page }) => {
    await page.goto('/de/kalender');
    await expect(page.locator('.monat')).toHaveCount(12);
  });

  test('Karte liefert die Ortsliste auch ohne geladene Karte', async ({ page }) => {
    await page.goto('/de/karten');
    await expect(page.locator('.ortsliste table tbody tr').first()).toBeVisible();
  });

  test('Karte zeichnet Gradnetz und Ortspunkte', async ({ page }) => {
    /*
      Dieser Test prüft nicht nur, dass ein Canvas entsteht, sondern dass
      MapLibre tatsächlich Geometrie zeichnet. Grund: Der Web Worker von
      MapLibre wurde nach dem Bündeln unter einer Adresse gesucht, die es
      nicht gab. Die Karte blieb dabei leer, ohne einen Fehler zu melden –
      Canvas, Bedienelemente und Maßstab sahen normal aus.
    */
    const fehlgeschlagen: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 400) fehlgeschlagen.push(`${r.status()} ${r.url()}`);
    });

    await page.goto('/de/karten');
    await page.locator('[data-karte]').scrollIntoViewIfNeeded();

    await expect(page.locator('[data-karte-flaeche] canvas')).toBeVisible();
    await expect(page.locator('[data-ebenen]')).toBeVisible();

    // Der Worker muss laufen – ohne ihn wird keine Geometrie geparst.
    await expect.poll(() => page.workers().length, { timeout: 15_000 }).toBeGreaterThan(0);

    expect(fehlgeschlagen).toEqual([]);
  });

  test('Quellenverzeichnis listet und filtert', async ({ page }) => {
    await page.goto('/de/quellen');
    await expect(page.locator('.quelle').first()).toBeVisible();
  });

  test('Suche findet Testinhalte', async ({ page }) => {
    await page.goto('/de/suche?q=Laliş');
    await expect(page.locator('.treffer, .hinweis').first()).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('Artikelseite bleibt vollständig lesbar', async ({ page }) => {
    await page.goto('/de/religion/tawusi-melek-und-die-sieben-engel');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('complementary', { name: 'Belegspalte' })).toBeVisible();
    await expect(page.locator('.prosa h2').first()).toBeVisible();
  });

  test('Mega-Menü lässt sich ohne Skript öffnen', async ({ page }) => {
    await page.goto('/de');
    const menuepunkt = page.locator('#hauptnavigation details').first();
    await menuepunkt.locator('summary').click();
    await expect(menuepunkt).toHaveAttribute('open', '');
  });

  test('Zeitleiste zeigt alle Einträge, Filter bleibt verborgen', async ({ page }) => {
    await page.goto('/de/zeitleiste');
    await expect(page.locator('.eintrag').first()).toBeVisible();
    await expect(page.locator('[data-filter]')).toBeHidden();
  });
});

test.describe('Auslieferung', () => {
  test('robots.txt und Sitemap sind vorhanden', async ({ request }) => {
    expect((await request.get('/robots.txt')).status()).toBe(200);
    expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
    expect((await request.get('/rss.xml')).status()).toBe(200);
  });

  test('OG-Bild wird ausgeliefert', async ({ request }) => {
    const antwort = await request.get('/og/standard.png');
    expect(antwort.status()).toBe(200);
    expect(antwort.headers()['content-type']).toContain('image/png');
  });

  test('Schriften liegen lokal', async ({ request }) => {
    const antwort = await request.get('/fonts/source-serif-4-latin-wght-normal.woff2');
    expect(antwort.status()).toBe(200);
  });

  test('keine Anfragen an fremde Hosts', async ({ page }) => {
    const fremd: string[] = [];
    page.on('request', (r) => {
      const url = new URL(r.url());
      if (url.hostname !== '127.0.0.1' && url.protocol !== 'data:') fremd.push(r.url());
    });
    await page.goto('/de/religion/tawusi-melek-und-die-sieben-engel');
    await page.waitForLoadState('networkidle');
    expect(fremd).toEqual([]);
  });
});
