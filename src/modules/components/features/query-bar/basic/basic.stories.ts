import type { Meta, StoryObj } from '@storybook/angular';
import { QueryBarBasicComponent } from './basic.component';
const meta: Meta<QueryBarBasicComponent> = {
  title: 'Components/query-bar/basic',
  component: QueryBarBasicComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<QueryBarBasicComponent> = {};
