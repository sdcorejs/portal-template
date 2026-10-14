import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: [
    'feedback.spec.ts',
    'file-explorer-actions.spec.ts',
    'core31.spec.ts',
    'core31-candidate.spec.ts',
    'core31-touch-fix.spec.ts',
  ],
  workers: 1,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['json', { outputFile: 'test-results/feedback-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:2232',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node node_modules/@angular/cli/bin/ng.js serve --port 2232 --host 127.0.0.1 --poll=1000',
    url: 'http://127.0.0.1:2232',
    reuseExistingServer: true,
    timeout: 240000,
  },
});
