import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Tích hợp module nội bộ hoặc Git submodule qua cùng public API.', 'Kiểm tra đủ alias, provider, route và menu.'],
  prerequisites: 'Module đã export routes và configuration token. Repo này hiện không có .gitmodules.',
  caption: 'Source local/submodule → alias → provider → lazy route → menu. Hai cách lưu source cùng tuân theo public contract.',
  steps: [
    {
      title: 'Khai báo alias theo source',
      text: 'Dùng modules cho code nghiệp vụ. Với submodule, thống nhất repository và branch trước khi thêm; không chạy lệnh demo từ UI.',
      file: 'tsconfig.json',
      code: '"paths": {\n  "@crm": ["./src/modules/crm/index.ts"]\n}',
      result: '@crm trỏ tới public entry. Không tạo alias khuyến khích deep import feature.',
    },
    {
      title: 'Cấp cấu hình và route',
      text: 'Cung cấp token tại route host để module con thừa hưởng đúng scope.',
      file: 'app/app.routes.ts',
      code: "{ path: 'crm',\n  providers: [{ provide: CRM_CONFIGURATION, useValue: { apiHost: '/api/crm' } }],\n  loadChildren: () => import('@crm').then(m => m.crmRoutes)\n}",
      result: 'Module resolve được token khi truy cập route.',
    },
    {
      title: 'Thêm menu phù hợp quyền',
      text: 'Menu giữ URL nhất quán với route. Quyền C điều khiển menu; người quản trị gán nhóm G cho Role.',
      file: 'app/components/main/main.component.ts',
      code: "{ title: 'Khách hàng', path: '/crm/customer', permission: 'CRM_CUSTOMER_C_VIEW' }",
      result: 'Menu hiện khi có quyền C; guard vẫn kiểm tra URL trực tiếp.',
    },
  ],
  exercise: 'Chọn nguồn module và hoàn tất các điểm tích hợp để xem phần còn thiếu.',
  expected: 'Chỉ khi đủ source, alias, provider, route và menu mới đạt trạng thái sẵn sàng review.',
  exampleCode:
    '// Trường hợp module là Git submodule — thực hiện thủ công sau khi xác nhận repo\n// git submodule add <repository-url> src/modules/crm\n// Repo hiện tại không cần lệnh này để khởi động.',
  pitfalls: [
    'Có menu chưa có nghĩa route đã được đăng ký.',
    'Thiếu provider gây NullInjectorError.',
    'Không tự thêm submodule khi module chỉ là thư mục local.',
  ],
  checklist: ['Alias resolve public entry.', 'Provider ở scope phù hợp.', 'URL trực tiếp và menu đều hoạt động.'],
  sources: [
    {
      title: 'Tích hợp module vào Portal',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3749315006',
    },
  ],
  related: ['architecture', 'git', 'permission-model'],
} satisfies ArticleText;
