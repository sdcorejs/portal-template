import type { Meta, StoryObj } from '@storybook/angular';
import { SdView } from '@sdcorejs/angular/components/view';
import { SectionItemDemoComponent } from './section-item.component';
const meta: Meta<SectionItemDemoComponent> = {
  title: 'Components/section/section-item',
  component: SectionItemDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<SectionItemDemoComponent> = {};

export const ReadOnlyFields = {
  render: () => ({
    moduleMetadata: { imports: [SdView] },
    template:
      '<div class="p-24 d-flex flex-column gap-16"><sd-view label="Mã hồ sơ" display="CUS-0001" /><sd-view label="Tên khách hàng" display="Công ty Minh An" /><sd-view label="Thông tin chưa có" [display]="null" /></div>',
  }),
  parameters: { docs: { description: { story: 'SdView là primitive nhãn–giá trị trong các detail page; giá trị thiếu hiển thị --.' } } },
};
