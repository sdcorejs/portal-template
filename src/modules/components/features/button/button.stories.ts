import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonDemoComponent } from './button.component';
const meta: Meta<ButtonDemoComponent> = {
  title: 'Components/button',
  component: ButtonDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<ButtonDemoComponent> = {};
