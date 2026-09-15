import type { Meta, StoryObj } from '@storybook/angular';
import { SideDrawerAdvancedComponent } from './advanced.component';
const meta: Meta<SideDrawerAdvancedComponent> = {
  title: 'Components/side-drawer/advanced',
  component: SideDrawerAdvancedComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<SideDrawerAdvancedComponent> = {};
