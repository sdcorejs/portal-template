import type { Meta, StoryObj } from '@storybook/angular';
import { QueryBarFieldsComponent } from './fields.component';
const meta: Meta<QueryBarFieldsComponent> = {
  title: 'Components/query-bar/fields',
  component: QueryBarFieldsComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<QueryBarFieldsComponent> = {};
