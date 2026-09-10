import type { Meta, StoryObj } from '@storybook/angular';
import { AnchorWithSectionComponent } from './with-section.component';
const meta: Meta<AnchorWithSectionComponent> = {
  title: 'Components/anchor/with-section',
  component: AnchorWithSectionComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<AnchorWithSectionComponent> = {};
