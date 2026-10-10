import { defineConfig } from '@playwright/test';
import candidate from './playwright.core31-candidate.config';

export default defineConfig(candidate, {
  testMatch: '**/*.spec.ts',
  testIgnore: [
    '**/core31-candidate.spec.ts',
    '**/core31-touch-fix.spec.ts',
    '**/core31.spec.ts',
    '**/workspace.spec.ts',
    '**/storybook.spec.ts',
  ],
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
});
