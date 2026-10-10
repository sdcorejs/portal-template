import type { Meta, StoryObj } from '@storybook/angular';
import { ImportExcelDemoComponent } from './import-excel.component';

const meta: Meta<ImportExcelDemoComponent> = {
  title: 'Components/import-excel',
  component: ImportExcelDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Core UI. Nhập Excel cục bộ, xác thực và cảnh báo tài sản hư cấu. Local Excel import, validation and warning review for fictional assets.',
      },
    },
  },
};
export default meta;
export const Playground: StoryObj<ImportExcelDemoComponent> = {};
