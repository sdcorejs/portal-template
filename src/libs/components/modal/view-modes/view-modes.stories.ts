import type { Meta, StoryObj } from '@storybook/angular';
import { ModalViewModesComponent } from './view-modes.component';
const meta: Meta<ModalViewModesComponent> = {
  title: 'Components/modal/view-modes',
  component: ModalViewModesComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<ModalViewModesComponent> = {};
