import type { Meta, StoryObj } from '@storybook/angular';
import { SectionHeaderSlotsComponent } from './header-slots.component';
const meta: Meta<SectionHeaderSlotsComponent> = {
  title: 'Components/section/header-slots',
  component: SectionHeaderSlotsComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<SectionHeaderSlotsComponent> = {};
