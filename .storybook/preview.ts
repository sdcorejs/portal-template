import { applicationConfig, type Preview } from '@storybook/angular';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideReferenceUi } from '../src/app/reference-providers';
const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideRouter([], withDisabledInitialNavigation()), provideHttpClient(), provideAnimations(), ...provideReferenceUi()],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    options: { storySort: { order: ['Components', 'Forms', 'Services', 'Pages'] } },
  },
};
export default preview;
