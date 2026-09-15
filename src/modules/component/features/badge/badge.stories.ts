import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeDemoComponent } from './badge.component';
const meta: Meta<BadgeDemoComponent> = {
  title: 'Components/badge',
  component: BadgeDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<BadgeDemoComponent> = {};
