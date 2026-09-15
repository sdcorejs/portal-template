import type { Meta, StoryObj } from '@storybook/angular';
import { ConfirmWithDateComponent } from './with-date.component';
const meta: Meta<ConfirmWithDateComponent> = {
  title: 'Services/confirm/with-date',
  component: ConfirmWithDateComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<ConfirmWithDateComponent> = {};
