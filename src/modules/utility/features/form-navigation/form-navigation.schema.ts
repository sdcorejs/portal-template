import type { SdFormGenericSchema } from '@sdcorejs/angular/components/form-generic';

export function formNavigationSeed(): SdFormGenericSchema {
  return {
    navigation: { type: 'steps', linear: true },
    pages: [
      {
        id: 'details',
        label: 'Thông tin',
        icon: 'description',
        elements: [
          { id: 'project', key: 'project', type: 'textfield', label: 'Tên dự án', validation: { required: true, maxLength: 120 } },
          { id: 'amount', key: 'amount', type: 'number', label: 'Ngân sách (triệu)', validation: { required: true, min: 1, max: 500 } },
          { id: 'needsLegal', key: 'needsLegal', type: 'checkbox', label: 'Cần rà soát pháp lý' },
        ],
      },
      {
        id: 'approval',
        label: 'Phê duyệt',
        icon: 'fact_check',
        elements: [
          { id: 'approver', key: 'approver', type: 'textfield', label: 'Người phê duyệt', validation: { required: true, maxLength: 80 } },
          { id: 'note', key: 'note', type: 'textarea', label: 'Ghi chú đề nghị', validation: { maxLength: 300 } },
        ],
      },
      {
        id: 'legal',
        label: 'Pháp lý',
        icon: 'gavel',
        rules: { visible: { field: 'needsLegal', operator: 'EQUAL', data: true } },
        elements: [
          { id: 'legalNote', key: 'legalNote', type: 'textarea', label: 'Kết quả rà soát', validation: { required: true, maxLength: 300 } },
        ],
      },
      {
        id: 'review',
        label: 'Xác nhận',
        icon: 'send',
        elements: [{ id: 'sender', key: 'sender', type: 'textfield', label: 'Người gửi', validation: { required: true, maxLength: 80 } }],
      },
    ],
    validations: [
      {
        type: 'filter',
        filter: { field: 'amount', operator: 'GREATER_THAN', data: 100 },
        alert: 'warning',
        message: 'Ngân sách trên 100 triệu: kiểm tra phạm vi trước khi gửi.',
      },
    ],
  };
}

export const FORM_NAVIGATION_SAMPLE: Record<string, unknown> = {
  project: 'Nova workspace',
  amount: 120,
  needsLegal: false,
  approver: 'Linh (demo)',
  note: 'Đề nghị thử nghiệm không gian làm việc.',
  legalNote: 'Đã rà soát bản mẫu hư cấu.',
  sender: 'Minh (demo)',
};
