import type { Meta, StoryObj } from '@storybook/angular';
import { SideDrawerBasicComponent } from './basic.component';
const meta: Meta<SideDrawerBasicComponent> = {
  title: 'Components/side-drawer/basic',
  component: SideDrawerBasicComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<SideDrawerBasicComponent> = {};
