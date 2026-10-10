import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'storybook.spec.ts',
  workers: 1,
  timeout: 60000,
  expect: { timeout: 15000 },
  reporter: [['list']],
  use: { baseURL: 'http://localhost:6006', channel: 'chrome', headless: true },
  webServer: {
    command: 'python -m http.server 6006 --bind 127.0.0.1 --directory storybook-static',
    url: 'http://localhost:6006/index.json',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
