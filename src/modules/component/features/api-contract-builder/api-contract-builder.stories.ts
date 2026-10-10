import type { Meta, StoryObj } from '@storybook/angular';
import { ApiContractBuilderDemoComponent } from './api-contract-builder.component';
const meta: Meta<ApiContractBuilderDemoComponent> = {
  title: 'Components/api-contract-builder',
  component: ApiContractBuilderDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: 'Core UI. Hợp đồng có thể chỉnh sửa, kiểm tra lỗi, lưu bản chụp và xuất JSON trong phiên demo.' },
    },
  },
};
export default meta;
export const Playground: StoryObj<ApiContractBuilderDemoComponent> = {};
