import { defineConfig } from '@playwright/test';

const onlineUrl = process.env['PORTAL_RELEASE_URL'];
export default defineConfig({
  testDir: './e2e',
  testMatch: 'release-pages.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 180000,
  expect: { timeout: 15000 },
  outputDir: 'test-results/release-pages',
  reporter: [['list'], ['json', { outputFile: 'test-results/release-pages-results.json' }]],
  use: { baseURL: onlineUrl ?? 'http://127.0.0.1:2233/portal-template/', channel: 'chrome', headless: true, trace: 'retain-on-failure' },
  webServer: onlineUrl
    ? undefined
    : {
        command: 'node scripts/serve-built-portal.mjs',
        env: { PORTAL_BASE_PATH: '/portal-template/' },
        url: 'http://127.0.0.1:2233/portal-template/',
        reuseExistingServer: false,
        timeout: 30000,
      },
});
