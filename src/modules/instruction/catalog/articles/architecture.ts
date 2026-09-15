import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Tổ chức domain trong modules/<module>/features/<entity>.', 'Giữ module độc lập với environment và cấu trúc bên trong Portal.'],
  prerequisites: 'Hiểu component standalone và route lazy-load.',
  caption:
    'Portal sở hữu layout/auth. Configuration là hợp đồng đầu vào. Module công bố public API; mỗi feature sở hữu dữ liệu và màn hình của entity.',
  steps: [
    {
      title: 'Đặt code ở đúng scope',
      text: 'Entity giữ pages, components, services riêng; module giữ code dùng chung cho nhiều entity. Không tạo thư mục rỗng chỉ để đủ sơ đồ.',
      file: 'src/modules/crm/features/customer',
      code: 'customer/\n  pages/\n  components/\n  services/\n    customer.model.ts\n    customer.service.ts\n  routes.ts',
      result: 'Đọc cây thư mục có thể biết ai sở hữu model, service và màn hình.',
    },
    {
      title: 'Giữ ranh giới module',
      text: 'Portal chỉ import từ index.ts; host/API được cấp qua InjectionToken. Module không import environment của Portal.',
      file: 'src/modules/crm/index.ts',
      code: "export { crmRoutes } from './routes';\nexport { CRM_CONFIGURATION } from './configurations/crm.configuration';\nexport type { CrmConfiguration } from './configurations/crm.configuration';",
      result: 'Public API nhỏ và có chủ đích; thay đổi nội bộ feature không làm Portal phải sửa import.',
    },
  ],
  exercise: 'Chuyển giữa blueprint module nghiệp vụ và cây source hiện tại. Theo dõi vị trí service của customer.',
  expected: 'Blueprint có customer.service.ts trong feature; source hiện tại chứa các module tham khảo và shared demo.',
  exampleCode: "// Từ Portal\nimport { crmRoutes, CRM_CONFIGURATION } from '@crm';\n// Tránh deep import từ Portal vào feature nội bộ.",
  pitfalls: [
    'Standalone không có nghĩa mọi service phải providedIn root.',
    'Không mang auth/environment của Portal vào module nghiệp vụ.',
    'Tên module crm trong blueprint là ví dụ, không phải module đang tồn tại trong repo.',
  ],
  checklist: ['Entity nằm trong features.', 'Cấu hình đi qua token.', 'Portal sử dụng public entry.'],
  sources: [
    {
      title: 'Kiến trúc module Angular',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581497955',
    },
  ],
  related: ['routing', 'configuration', 'integration'],
} satisfies ArticleText;
