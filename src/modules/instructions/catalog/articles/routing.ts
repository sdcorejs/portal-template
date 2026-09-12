import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Ánh xạ từng hành động vào một URL có thể mở trực tiếp.', 'Lazy-load qua public entry và khai báo guard ở ranh giới phù hợp.'],
  prerequisites: 'Đã đọc Module & Feature. Demo dùng dữ liệu session của Pages hiện có.',
  caption: 'Module route → entity route → list/create/:id/detail/:id/update. URL mang hành động và định danh bản ghi.',
  steps: [
    {
      title: 'Định nghĩa route entity',
      text: 'List dùng path rỗng. Create không cần id; detail và update bắt buộc có id. Các tên component dưới đây là blueprint.',
      file: 'modules/crm/features/customer/routes.ts',
      code: "export const customerRoutes: Routes = [\n  { path: '', loadComponent: () => import('./pages/list.component').then(m => m.ListComponent) },\n  { path: 'create', loadComponent: () => import('./pages/create.component').then(m => m.CreateComponent) },\n  { path: ':id/detail', loadComponent: () => import('./pages/detail.component').then(m => m.DetailComponent) },\n  { path: ':id/update', loadComponent: () => import('./pages/update.component').then(m => m.UpdateComponent) },\n];",
      result: 'Refresh URL detail vẫn đọc đúng id. Service trả not-found nếu id không tồn tại.',
    },
    {
      title: 'Công bố entry và lazy-load',
      text: 'Feature routes nằm bên trong module; Portal chỉ biết public export. Module guard kiểm tra truy cập, action guard kiểm tra C tương ứng.',
      file: 'modules/crm/index.ts / app.routes.ts',
      code: "// index.ts\nexport { crmRoutes } from './routes';\n// Portal\n{ path: 'crm', loadChildren: () => import('@crm').then(m => m.crmRoutes) }",
      result: 'Màn chưa mở không bị eager import vào bundle chính.',
    },
  ],
  exercise: 'Chọn List, Create, Detail hoặc Update và mở URL tạo ra.',
  expected: 'Link mở đúng hành động của customer-1; create không có id.',
  exampleCode:
    "// Lấy id của route trong component\nreadonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');\n// Với component được tái sử dụng qua nhiều id, subscribe paramMap hoặc dùng toSignal.",
  pitfalls: [
    'Ẩn menu không chặn việc nhập URL trực tiếp.',
    'Không dùng query mode=create thay cho route hành động đã thống nhất.',
    'Không import component từ features của module khác vào Portal.',
  ],
  checklist: ['Mở trực tiếp URL được.', 'Id không tồn tại được xử lý.', 'Route create không bị wildcard nuốt.'],
  sources: [
    {
      title: 'Route và public API',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581497955',
    },
  ],
  related: ['architecture', 'permission-checks'],
} satisfies ArticleText;
