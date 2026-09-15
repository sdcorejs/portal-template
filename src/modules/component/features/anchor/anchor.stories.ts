import type { StoryObj } from '@storybook/angular';
import { anchorPlayground, AnchorPlaygroundArgs } from './anchor-playground';

export default { ...anchorPlayground, tags: ['autodocs'], title: 'Components/anchor' };
export const Playground: StoryObj<AnchorPlaygroundArgs> = {};
export const HiddenNavigation: StoryObj<AnchorPlaygroundArgs> = { args: { hideNav: true } };
