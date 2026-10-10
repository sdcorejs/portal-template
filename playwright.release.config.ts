import { defineConfig } from '@playwright/test';

/** Complete Portal suite against one clean, built public-package installation. */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  testIgnore: ['**/storybook.spec.ts', '**/release-pages.spec.ts'],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60000,
  expect: { timeout: 15000 },
  outputDir: 'test-results/release-portal',
  reporter: [['list'], ['json', { outputFile: 'test-results/release-portal-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:2233',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/serve-built-portal.mjs',
    url: 'http://127.0.0.1:2233',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
