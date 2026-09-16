import { defineConfig } from '@playwright/test';
import base from './playwright.instructions.config';
export default defineConfig(base, {
  testMatch: ['roles.spec.ts', 'record-routes.spec.ts', 'page-entry.spec.ts', 'page-url.spec.ts'],
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/roles', open: 'never' }]],
});
