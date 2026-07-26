import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

/**
 * In manchen Umgebungen liegt bereits ein Chromium bereit, dessen
 * Build-Nummer nicht zu der von Playwright erwarteten passt. Statt einen
 * zweiten Browser herunterzuladen, wird dann der vorhandene benutzt.
 * Über PLAYWRIGHT_CHROMIUM_PATH lässt sich das überschreiben.
 */
const vorhandenesChromium =
  process.env['PLAYWRIGHT_CHROMIUM_PATH'] ??
  (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

const launchOptions = vorhandenesChromium ? { executablePath: vorhandenesChromium } : {};

/**
 * Die Tests laufen gegen das gebaute Verzeichnis, nicht gegen den
 * Entwicklungsserver: Nur dort existieren Suchindex, OG-Bilder und die
 * endgültigen Skript-Bündel. `npm run build` muss vorher gelaufen sein.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  // `exactOptionalPropertyTypes` erlaubt kein explizites undefined –
  // deshalb wird die Angabe nur in der CI überhaupt gesetzt.
  ...(process.env['CI'] ? { workers: 2 } : {}),
  // In der CI zusätzlich die GitHub-Annotationen, lokal nur die Liste.
  reporter: process.env['CI'] ? 'github' : 'list',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
    locale: 'de-DE',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions } },
    { name: 'mobile', use: { ...devices['Pixel 7'], launchOptions } },
  ],
  webServer: {
    command: 'npx astro preview --port 4321 --host 127.0.0.1',
    url: 'http://127.0.0.1:4321/de',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
