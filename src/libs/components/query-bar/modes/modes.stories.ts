import type { Meta, StoryObj } from '@storybook/angular';
import { QueryBarModesComponent } from './modes.component';
const meta: Meta<QueryBarModesComponent> = {
  title: 'Components/query-bar/modes',
  component: QueryBarModesComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<QueryBarModesComponent> = {};
