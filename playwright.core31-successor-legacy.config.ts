import { defineConfig } from '@playwright/test';
import base from './playwright.core31-built-portal-regression.config';
export default defineConfig({
  ...base,
  testIgnore: [
    ...(Array.isArray(base.testIgnore) ? base.testIgnore : [base.testIgnore!]),
    '**/core31-successor-operations.spec.ts',
    '**/core31-successor-files.spec.ts',
  ],
  outputDir: 'test-results/core31-successor-legacy',
  reporter: [['list'], ['json', { outputFile: 'docs/core31-successor-legacy-results.json' }]],
  use: { ...base.use, baseURL: 'http://127.0.0.1:2233' },
  webServer: { command: 'node scripts/serve-built-portal.mjs', url: 'http://127.0.0.1:2233', reuseExistingServer: false, timeout: 30000 },
});
