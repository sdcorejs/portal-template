import type { Meta, StoryObj } from '@storybook/angular';
import { QueryBuilderDemoComponent } from './query-builder.component';
const meta: Meta<QueryBuilderDemoComponent> = {
  title: 'Components/query-builder',
  component: QueryBuilderDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: 'Core UI. AND/OR, nhóm lồng nhau, so sánh trường, ngày, truy vấn dữ liệu và hành động có hoàn tác.' },
    },
  },
};
export default meta;
export const Playground: StoryObj<QueryBuilderDemoComponent> = {};
