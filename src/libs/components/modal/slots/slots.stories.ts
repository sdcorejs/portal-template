import type { Meta, StoryObj } from '@storybook/angular';
import { ModalSlotsComponent } from './slots.component';
const meta: Meta<ModalSlotsComponent> = {
  title: 'Components/modal/slots',
  component: ModalSlotsComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<ModalSlotsComponent> = {};
