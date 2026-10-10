import { defineConfig } from '@playwright/test';
import candidate from './playwright.core31-candidate.config';

export default defineConfig(candidate, {
  testMatch: ['core31-candidate.spec.ts', 'core31-touch-fix.spec.ts'],
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
});
