import type { Meta, StoryObj } from '@storybook/angular';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { LoadingDemoComponent } from './loading.component';
const meta: Meta<LoadingDemoComponent> = {
  title: 'Services/loading',
  component: LoadingDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Core 22.2.8. Ví dụ tương tác dùng chung với portal; thay đổi cấu hình trực tiếp trong preview.' } },
  },
};
export default meta;
export const Playground: StoryObj<LoadingDemoComponent> = {};

export const DataStates = {
  args: { state: 'loading', title: 'Trạng thái dữ liệu', message: 'Dữ liệu tổng hợp để tham khảo bố cục.' },
  argTypes: {
    state: { control: 'select', options: ['loading', 'empty', 'error'] },
    title: { control: 'text' },
    message: { control: 'text' },
  },
  render: (args: Record<string, unknown>) => ({
    props: args,
    moduleMetadata: { imports: [SdDataState] },
    template: '<div class="p-24"><sd-data-state [state]="state" [title]="title" [message]="message" /></div>',
  }),
  parameters: {
    docs: {
      description: { story: 'SdDataState dùng trong Pages: loading, empty và error. No-results là empty với thông báo theo ngữ cảnh.' },
    },
  },
};
