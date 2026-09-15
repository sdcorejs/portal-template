import type { Meta, StoryObj } from '@storybook/angular';
import { InputNumberDemoComponent } from './input-number.component';
const meta: Meta<InputNumberDemoComponent> = {
  title: 'Forms/input-number',
  component: InputNumberDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<InputNumberDemoComponent> = {};
