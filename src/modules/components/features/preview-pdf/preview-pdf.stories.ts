import type { Meta, StoryObj } from '@storybook/angular';
import { PreviewPdfDemoComponent } from './preview-pdf.component';
const meta: Meta<PreviewPdfDemoComponent> = {
  title: 'Components/preview-pdf',
  component: PreviewPdfDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<PreviewPdfDemoComponent> = {};
