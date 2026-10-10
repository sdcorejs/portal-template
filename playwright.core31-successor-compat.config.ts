import { defineConfig } from '@playwright/test';
import base from './playwright.core31-compat.config';
export default defineConfig({
  ...base,
  outputDir: 'test-results/core31-successor-compat',
  reporter: [['list'], ['json', { outputFile: 'docs/core31-successor-compat-results.json' }]],
  use: { ...base.use, baseURL: 'http://127.0.0.1:2233' },
  webServer: { command: 'node scripts/serve-built-portal.mjs', url: 'http://127.0.0.1:2233', reuseExistingServer: false, timeout: 30000 },
});
