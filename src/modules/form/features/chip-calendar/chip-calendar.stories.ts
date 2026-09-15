import type { Meta, StoryObj } from '@storybook/angular';
import { ChipCalendarDemoComponent } from './chip-calendar.component';
const meta: Meta<ChipCalendarDemoComponent> = {
  title: 'Forms/chip-calendar',
  component: ChipCalendarDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<ChipCalendarDemoComponent> = {};
