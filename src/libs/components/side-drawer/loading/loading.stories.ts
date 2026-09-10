import type { Meta, StoryObj } from '@storybook/angular';
import { SideDrawerLoadingComponent } from './loading.component';
const meta: Meta<SideDrawerLoadingComponent> = {
  title: 'Components/side-drawer/loading',
  component: SideDrawerLoadingComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<SideDrawerLoadingComponent> = {};
