import type { Meta, StoryObj } from '@storybook/angular';
import { TableFilterComponent } from './filter.component';
const meta: Meta<TableFilterComponent> = {
  title: 'Components/table/filter',
  component: TableFilterComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<TableFilterComponent> = {};
