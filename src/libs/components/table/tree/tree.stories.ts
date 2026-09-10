import type { Meta, StoryObj } from '@storybook/angular';
import { TableTreeComponent } from './tree.component';
const meta: Meta<TableTreeComponent> = {
  title: 'Components/table/tree',
  component: TableTreeComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<TableTreeComponent> = {};
