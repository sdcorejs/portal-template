import type { ArticleText } from '../instruction-content';
export default {
  goals: [
    'Phân biệt tài liệu Instructions, API playground trong Storybook và các Pages mô phỏng nghiệp vụ.',
    'Chọn mẫu list/detail/create/update phù hợp trước khi tạo feature.',
  ],
  prerequisites: 'Đã mở Portal. Core UI công khai, không cần bước kích hoạt.',
  caption:
    'Portal cung cấp layout và điều hướng. Instructions giải thích cách xây dựng; Storybook cô lập component; Pages ghép component thành luồng nghiệp vụ.',
  steps: [
    {
      title: 'Chọn bề mặt tham khảo',
      text: 'Bắt đầu từ Instructions để hiểu quy ước; mở Storybook khi cần thử input/output riêng lẻ.',
      file: 'package.json',
      code: 'npm start\nnpm run storybook',
      result: 'Portal ở :2208; Storybook ở :6006, là hai dev server của cùng repo.',
    },
    {
      title: 'Chọn page theo dữ liệu',
      text: 'Dùng list chuẩn cho bảng dữ liệu; thử quick search, external filters hoặc score card khi nghiệp vụ cần.',
      file: 'src/modules/page/catalog',
      code: '/page/list/list-standard\n/pages/list/list-standard/customer-1/detail\n/pages/list/list-standard/create',
      result: 'Cột mã dẫn đến chi tiết; tạo mới và cập nhật có URL riêng.',
    },
  ],
  exercise: 'Chọn mục tiêu để thấy gợi ý, rồi mở bề mặt tương ứng.',
  expected: 'Mỗi lựa chọn dẫn đến đúng nơi: học quy ước, thử API hoặc trải nghiệm luồng bản ghi.',
  exampleCode:
    "// app.routes.ts — public entry của module\n{ path: 'pages', loadChildren: () => import('../modules/page').then(m => m.pageRoutes) }",
  pitfalls: [
    'Storybook cần dev server riêng; mở link khi server chưa chạy sẽ không có nội dung.',
    'Dữ liệu Pages là dữ liệu mô phỏng trong sessionStorage, không phải backend.',
  ],
  checklist: ['Biết nơi tra API component.', 'Đã thử một luồng list → detail → update.'],
  sources: [
    {
      title: 'Core UI — tổng quan',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3756754126',
    },
  ],
  related: ['setup', 'architecture'],
} satisfies ArticleText;
