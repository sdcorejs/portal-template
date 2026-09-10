import type { Meta, StoryObj } from '@storybook/angular';
import { TableBasicComponent } from './basic.component';
const meta: Meta<TableBasicComponent> = {
  title: 'Components/table/basic',
  component: TableBasicComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<TableBasicComponent> = {};
