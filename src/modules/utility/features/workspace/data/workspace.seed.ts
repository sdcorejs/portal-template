import type { SdFormGenericSchema } from '@sdcorejs/angular/components/form-generic';
import type { Color } from '@sdcorejs/utils/models';

export const WORKSPACE_SCHEMA: SdFormGenericSchema = {
  pages: [
    {
      id: 'request',
      label: 'Đề nghị triển khai',
      elements: [
        {
          id: 'project',
          key: 'project',
          type: 'textfield',
          label: 'Tên dự án',
          placeholder: 'Ví dụ: Không gian làm việc Nova',
          validation: { required: true, maxLength: 120 },
          layout: { span: { desktop: 8, mobile: 12 } },
        },
        {
          id: 'team',
          key: 'team',
          type: 'select',
          label: 'Nhóm phụ trách',
          validation: { required: true },
          layout: { span: { desktop: 4 } },
          options: {
            source: 'static',
            items: [
              { value: 'operations', label: 'Vận hành' },
              { value: 'product', label: 'Sản phẩm' },
              { value: 'design', label: 'Thiết kế' },
            ],
          },
        },
        {
          id: 'budget',
          type: 'group',
          label: 'Phạm vi & ngân sách',
          icon: 'payments',
          elements: [
            {
              id: 'service',
              key: 'service',
              type: 'radio',
              label: 'Loại đề nghị',
              direction: 'row',
              defaultValue: 'workspace',
              layout: { span: { desktop: 12 } },
              options: {
                source: 'static',
                items: [
                  { value: 'workspace', label: 'Không gian làm việc' },
                  { value: 'event', label: 'Sự kiện' },
                  { value: 'equipment', label: 'Thiết bị' },
                ],
              },
            },
            {
              id: 'amount',
              key: 'amount',
              type: 'number',
              subtype: 'currency',
              currency: 'VND',
              label: 'Ngân sách đề nghị',
              validation: { required: true, min: 100000, max: 500000000 },
              layout: { span: { desktop: 6 } },
            },
            { id: 'date', key: 'date', type: 'datetime', subtype: 'date', label: 'Ngày dự kiến', layout: { span: { desktop: 6 } } },
            { id: 'urgent', key: 'urgent', type: 'checkbox', label: 'Cần xử lý gấp', layout: { newRow: true } },
            {
              id: 'reason',
              key: 'reason',
              type: 'textarea',
              label: 'Lý do cần xử lý gấp',
              helperText: 'Chỉ xuất hiện khi bạn chọn xử lý gấp.',
              rules: {
                visible: { field: 'urgent', operator: 'EQUAL', data: true },
                required: { field: 'urgent', operator: 'EQUAL', data: true },
              },
              validation: { maxLength: 500 },
              layout: { newRow: true },
            },
          ],
        },
        {
          id: 'tags',
          key: 'tags',
          type: 'chip-string',
          label: 'Nhãn theo dõi',
          helperText: 'Nhập nhãn rồi Enter.',
          validation: { maxItems: 5 },
        },
      ],
    },
  ],
  validations: [
    {
      type: 'filter',
      filter: { field: 'amount', operator: 'GREATER_THAN', data: 100000000 },
      alert: 'warning',
      message: 'Ngân sách trên 100 triệu: hãy kiểm tra phạm vi trước khi gửi.',
    },
  ],
};

export const WORKSPACE_STATUSES: { id: string; name: string; color: Color; icon: string }[] = [
  { id: 'pending', name: 'Chờ duyệt', color: 'warning', icon: 'hourglass_empty' },
  { id: 'approved', name: 'Đã duyệt', color: 'success', icon: 'check_circle' },
  { id: 'returned', name: 'Cần bổ sung', color: 'error', icon: 'edit_note' },
];
export const WORKSPACE_TEAMS = [
  { id: 'operations', name: 'Vận hành' },
  { id: 'product', name: 'Sản phẩm' },
  { id: 'design', name: 'Thiết kế' },
];
export const WORKSPACE_SAMPLE_VALUE: Record<string, unknown> = {
  project: 'Không gian làm việc Nova',
  team: 'operations',
  service: 'workspace',
  amount: 12500000,
  date: '2026-11-16',
  urgent: false,
  tags: ['Thử nghiệm', 'Quý IV'],
};
