import type { Meta, StoryObj } from '@storybook/angular';
import { ImageEditorDemoComponent } from './image-editor.component';

const meta: Meta<ImageEditorDemoComponent> = {
  title: 'Components/image-editor',
  component: ImageEditorDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Core UI. Cắt, xoay, lịch sử chỉnh sửa và xuất PNG cục bộ. Native crop, rotation, edit history and local PNG export.',
      },
    },
  },
};
export default meta;
export const Playground: StoryObj<ImageEditorDemoComponent> = {};
