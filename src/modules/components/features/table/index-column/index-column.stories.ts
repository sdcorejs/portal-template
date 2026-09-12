import type { Meta, StoryObj } from '@storybook/angular';
import { TableIndexColumnComponent } from './index-column.component';
const meta: Meta<TableIndexColumnComponent> = {
  title: 'Components/table/index-column',
  component: TableIndexColumnComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<TableIndexColumnComponent> = {};
