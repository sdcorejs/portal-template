import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Đưa host qua token thay vì import environment trong module.', 'Tách trạng thái loading, thành công và lỗi trong luồng API.'],
  prerequisites: 'Hiểu DI. Demo dưới đây không gửi request ra mạng.',
  caption: 'Portal cấp config → InjectionToken → entity service → API boundary → kết quả hoặc lỗi cho page.',
  steps: [
    {
      title: 'Khai báo hợp đồng đầu vào',
      text: 'Interface chỉ chứa phần module cần; Portal quyết định giá trị triển khai.',
      file: 'modules/crm/configurations/crm.configuration.ts',
      code: "import { InjectionToken } from '@angular/core';\nexport interface CrmConfiguration { apiHost: string; }\nexport const CRM_CONFIGURATION = new InjectionToken<CrmConfiguration>('CRM_CONFIGURATION');",
      result: 'Module có thể được host bởi Portal khác mà không sửa service.',
    },
    {
      title: 'Inject vào service',
      text: 'HttpClient được cung cấp tại host. Xử lý trạng thái ở page và lỗi nghiệp vụ ở lớp thích hợp; không nuốt lỗi thành success.',
      file: 'modules/crm/features/customer/services/customer.service.ts',
      code: 'readonly config = inject(CRM_CONFIGURATION);\nreadonly http = inject(HttpClient);\nlist() {\n  return this.http.get<Customer[]>(`${this.config.apiHost}/customers`);\n}',
      result: 'Service trả dữ liệu có kiểu. UI có nhánh loading, empty, error và retry.',
    },
  ],
  exercise: 'Chọn môi trường giả lập, bật lỗi nếu muốn rồi gửi request. Loading kéo dài ngẫu nhiên 1–2 giây.',
  expected: 'Host hiển thị đúng môi trường. Lỗi 503 có thể thử lại; không xuất hiện success khi lỗi.',
  exampleCode:
    "// Portal providers — giá trị ví dụ, không phải host thật\n{ provide: CRM_CONFIGURATION, useValue: { apiHost: '/mock/crm' } }",
  pitfalls: [
    'Không log access token hay thông tin nhạy cảm vào lỗi.',
    'Khóa nút khi đang gửi để tránh request trùng.',
    'Demo mô phỏng không thay thế interceptor và kiểm tra backend thật.',
  ],
  checklist: ['Host đi qua config.', 'Có pending và error.', 'Có thể retry sau lỗi.'],
  sources: [
    {
      title: 'Configuration và API handler',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581497955',
    },
  ],
  related: ['di', 'integration'],
} satisfies ArticleText;
