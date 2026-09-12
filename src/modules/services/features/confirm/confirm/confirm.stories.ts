import type { Meta, StoryObj } from '@storybook/angular';
import { ConfirmBasicComponent } from './confirm.component';
const meta: Meta<ConfirmBasicComponent> = {
  title: 'Services/confirm/confirm',
  component: ConfirmBasicComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<ConfirmBasicComponent> = {};
