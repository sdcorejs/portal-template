import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  testMatch: 'patterns.spec.ts',
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  reporter: [['list']],
  outputDir: 'test-results/patterns',
  use: {
    baseURL: 'http://localhost:2208',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: { command: 'npm start', url: 'http://localhost:2208', reuseExistingServer: true, timeout: 240000 },
});
