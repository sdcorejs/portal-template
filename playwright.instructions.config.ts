import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  testMatch: ['instructions.spec.ts', 'architecture.spec.ts', 'portal-reference.spec.ts', 'record-routes.spec.ts'],
  timeout: 60000,
  expect: { timeout: 20000 },
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/instructions', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:2208',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: { command: 'npm start', url: 'http://localhost:2208', reuseExistingServer: true, timeout: 240000 },
});
