import { defineConfig } from '@playwright/test';
import storybook from './playwright.core31-storybook.config';

/** Keep every suite's reports so later checks cannot remove earlier evidence. */
export default defineConfig({
  ...storybook,
  retries: 0,
  outputDir: 'test-results/release-storybook',
  reporter: [['list'], ['json', { outputFile: 'test-results/release-storybook-results.json' }]],
});
