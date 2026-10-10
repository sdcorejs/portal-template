import { defineConfig } from '@playwright/test';
import portalRegression from './playwright.core31-portal-regression.config';

// Replace the inherited dev server; defineConfig(base, overrides) combines server lists.
export default defineConfig({
  ...portalRegression,
  use: { ...portalRegression.use, baseURL: 'http://127.0.0.1:2233' },
  webServer: {
    command: 'node scripts/serve-built-portal.mjs',
    url: 'http://127.0.0.1:2233',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
