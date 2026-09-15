import type { Meta, StoryObj } from '@storybook/angular';
import { InputDemoComponent } from './input.component';
const meta: Meta<InputDemoComponent> = {
  title: 'Forms/input',
  component: InputDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<InputDemoComponent> = {};
