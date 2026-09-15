import type { Meta, StoryObj } from '@storybook/angular';
import { SideDrawerCustomComponent } from './custom.component';
const meta: Meta<SideDrawerCustomComponent> = {
  title: 'Components/side-drawer/custom',
  component: SideDrawerCustomComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<SideDrawerCustomComponent> = {};
