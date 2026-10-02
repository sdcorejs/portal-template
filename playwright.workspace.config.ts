import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'workspace.spec.ts',
  timeout: 60000,
  expect: { timeout: 15000 },
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-workspace-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:2218',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node node_modules/@angular/cli/bin/ng.js serve --port 2218 --host 127.0.0.1',
    url: 'http://127.0.0.1:2218',
    reuseExistingServer: true,
    timeout: 240000,
  },
});
