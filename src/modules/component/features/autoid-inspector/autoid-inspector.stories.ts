import type { Meta, StoryObj } from '@storybook/angular';
import { AutoidInspectorDemoComponent } from './autoid-inspector.component';

const meta: Meta<AutoidInspectorDemoComponent> = {
  title: 'Components/autoid-inspector',
  component: AutoidInspectorDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Core UI. Kiểm tra ID trùng/thiếu trên vùng mẫu và xuất JSON cục bộ. Scoped duplicate/missing ID audit and local JSON export; no E2E generator host.',
      },
    },
  },
};
export default meta;
export const Playground: StoryObj<AutoidInspectorDemoComponent> = {};
