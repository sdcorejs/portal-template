import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  testMatch: ['core31-candidate.spec.ts', 'core31-touch-fix.spec.ts'],
  grep: /candidate local font|Explorer no-actions|Explorer mobile selection|candidate Explorer and Form|Form mobile native|touch containment/,
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 15000 },
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    baseURL: 'http://127.0.0.1:2232',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node node_modules/@angular/cli/bin/ng.js serve --host 127.0.0.1 --port 2232 --poll 1000',
    url: 'http://127.0.0.1:2232',
    timeout: 240000,
    reuseExistingServer: true,
  },
});
