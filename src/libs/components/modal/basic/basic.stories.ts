import type { Meta, StoryObj } from '@storybook/angular';
import { ModalBasicComponent } from './basic.component';
const meta: Meta<ModalBasicComponent> = {
  title: 'Components/modal/basic',
  component: ModalBasicComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<ModalBasicComponent> = {};
