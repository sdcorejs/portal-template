import { defineConfig } from '@playwright/test';
import candidate from './playwright.core31-candidate.config';
export default defineConfig({
  ...candidate,
  testMatch: ['core31-successor-operations.spec.ts', 'core31-successor-files.spec.ts'],
  outputDir: 'test-results/core31-successor',
  reporter: [['list'], ['json', { outputFile: 'docs/core31-successor-browser-results.json' }]],
  use: { ...candidate.use, baseURL: 'http://127.0.0.1:2233' },
  webServer: { command: 'node scripts/serve-built-portal.mjs', url: 'http://127.0.0.1:2233', reuseExistingServer: false, timeout: 30000 },
});
