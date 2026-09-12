import type { Meta, StoryObj } from '@storybook/angular';
import { UploadFileDemoComponent } from './upload-file.component';
const meta: Meta<UploadFileDemoComponent> = {
  title: 'Components/upload-file',
  component: UploadFileDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<UploadFileDemoComponent> = {};
