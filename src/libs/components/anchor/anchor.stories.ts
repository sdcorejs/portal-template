import type { Meta, StoryObj } from '@storybook/angular';
import { AnchorBasicComponent } from './basic/basic.component';
import { SdTab, SdTabGroup } from '@sdcorejs/angular/components/tab';
const meta: Meta<AnchorBasicComponent> = {
  title: 'Components/anchor',
  component: AnchorBasicComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.7. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<AnchorBasicComponent> = {};

export const ReferenceTabs = {
  render: () => ({
    moduleMetadata: { imports: [SdTab, SdTabGroup] },
    template:
      '<div class="p-24"><sd-tab-group [preserveContent]="true"><sd-tab label="Preview"><p class="p-24">Không gian trải nghiệm page mẫu.</p></sd-tab><sd-tab label="Guide"><p class="p-24">Tiêu chí chọn bố cục và dữ liệu phù hợp.</p></sd-tab><sd-tab label="Data"><p class="p-24">Dữ liệu tổng hợp của phiên.</p></sd-tab><sd-tab label="Source"><p class="p-24">Mã nguồn có thể dùng lại.</p></sd-tab></sd-tab-group></div>',
  }),
  parameters: {
    docs: { description: { story: 'SdTabGroup và SdTab cho phần Preview/Guide/Data/Source. preserveContent giữ instance khi đổi tab.' } },
  },
};
