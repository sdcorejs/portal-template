import type { Meta, StoryObj } from '@storybook/angular';
import { NotifyDemoComponent } from './notify.component';
const meta: Meta<NotifyDemoComponent> = {
  title: 'Services/notify',
  component: NotifyDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<NotifyDemoComponent> = {};
