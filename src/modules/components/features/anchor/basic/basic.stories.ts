import type { StoryObj } from '@storybook/angular';
import { anchorPlayground, AnchorPlaygroundArgs } from '../anchor-playground';

export default { ...anchorPlayground, tags: ['autodocs'], title: 'Components/anchor/basic' };
export const Playground: StoryObj<AnchorPlaygroundArgs> = {};
