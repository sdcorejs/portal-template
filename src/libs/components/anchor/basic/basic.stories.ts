import type { Meta, StoryObj } from '@storybook/angular';
import { AnchorBasicComponent } from './basic.component';
const meta: Meta<AnchorBasicComponent> = {
  title: 'Components/anchor/basic',
  component: AnchorBasicComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<AnchorBasicComponent> = {};
