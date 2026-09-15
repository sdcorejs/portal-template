import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxDemoComponent } from './checkbox.component';
const meta: Meta<CheckboxDemoComponent> = {
  title: 'Forms/checkbox',
  component: CheckboxDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<CheckboxDemoComponent> = {};
