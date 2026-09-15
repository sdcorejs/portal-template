import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Thử sidebar version1/2/3 và cấu hình số/ngôn ngữ/tab.', 'Biết cấu hình lưu localStorage và cần reload để host áp dụng.'],
  prerequisites: 'Các thay đổi dưới đây áp dụng cho Portal trên trình duyệt hiện tại.',
  caption: 'Cấu hình form → localStorage → reload → host nhận sidebar, format, language và tab-router.',
  steps: [
    {
      title: 'Chọn bố cục điều hướng',
      text: 'Sidebar1 nhóm biểu tượng; Sidebar2 điều hướng hai tầng; Sidebar3 menu thu gọn. Thử với số lượng menu thực tế.',
      file: 'src/app/configurations/portal-config.ts',
      code: 'sidebarVersion: 1 | 2 | 3\nuseTabRouter: boolean',
      result: 'Sau Lưu & Tải lại, sidebar phản ánh lựa chọn mới.',
    },
    {
      title: 'Lưu cấu hình và review',
      text: 'Format số và language được truyền vào SD_CORE_CONFIGURATION. Core UI công khai, không có cấu hình khóa kích hoạt.',
      file: 'src/app/reference-providers.ts',
      code: '{ provide: SD_CORE_CONFIGURATION,\n  useValue: { format: { number: portalConfig.numberFormat }, language: portalConfig.language }\n}',
      result: 'Reload và mở lại trang vẫn thấy cấu hình đã lưu. Khôi phục mặc định có xác nhận.',
    },
  ],
  exercise: 'Thay Sidebar hoặc format số, bấm Lưu & Tải lại. Dùng Khôi phục mặc định để hoàn tác toàn bộ cấu hình.',
  expected: 'Form giữ lựa chọn qua reload; host hiển thị sidebar đúng version. Cấu hình không đồng bộ sang thiết bị khác.',
  exampleCode: 'const config = loadPortalConfig();\nsavePortalConfig({ ...config, sidebarVersion: 2 });\n// Host áp dụng sau reload.',
  pitfalls: [
    'Đây là cấu hình local của browser, không phải setting server.',
    'Pages dùng RouterOutlet thật cho draft/guard dù tab-router bật.',
  ],
  checklist: ['Kiểm tra đủ 3sidebar.', 'Thử số/ngôn ngữ.', 'Xác nhận setting còn sau reload.'],
  sources: [
    {
      title: 'Core UI — cấu hình host',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3756754126',
    },
  ],
  related: ['theme', 'overview'],
  screenshot: {
    src: '/assets/instructions/portal-config/example.png',
    alt: 'Ảnh form cấu hình Portal thật: sidebar, định dạng số, ngôn ngữ và tab-router.',
  },
} satisfies ArticleText;
