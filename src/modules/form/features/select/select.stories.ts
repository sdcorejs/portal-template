import type { Meta, StoryObj } from '@storybook/angular';
import { SelectDemoComponent } from './select.component';
const meta: Meta<SelectDemoComponent> = {
  title: 'Forms/select',
  component: SelectDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<SelectDemoComponent> = {};
