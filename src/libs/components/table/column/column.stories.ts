import type { Meta, StoryObj } from '@storybook/angular';
import { TableColumnComponent } from './column.component';
const meta: Meta<TableColumnComponent> = {
  title: 'Components/table/column',
  component: TableColumnComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<TableColumnComponent> = {};
