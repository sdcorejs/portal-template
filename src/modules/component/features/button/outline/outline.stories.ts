import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonOutlineDemoComponent } from './outline.component';
const meta: Meta<ButtonOutlineDemoComponent> = {
  title: 'Components/button/outline',
  component: ButtonOutlineDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core UI. Outline, loading/error/retry, disabled và Confirm có hủy/xác nhận/validation.' } },
  },
};
export default meta;
export const Playground: StoryObj<ButtonOutlineDemoComponent> = {};
