import type { StorybookConfig } from '@storybook/angular';
const config: StorybookConfig = {
  stories: ['../src/libs/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/angular', options: {} },
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
};
export default config;
