import type { Meta, StoryObj } from '@storybook/angular';
import { ChipDemoComponent } from './chip.component';
const meta: Meta<ChipDemoComponent> = {
  title: 'Forms/chip',
  component: ChipDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<ChipDemoComponent> = {};
