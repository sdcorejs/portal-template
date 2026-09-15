import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Khởi động đúng toolchain và nhận biết server đã sẵn sàng.', 'Phân biệt lỗi môi trường với lỗi ứng dụng.'],
  prerequisites: 'Git, npm và Node thuộc engines của package.json: ^22.22.3, ^24.15.0 hoặc ^26.0.0.',
  caption: 'Checkout → cài theo lockfile → chạy hai server độc lập → kiểm tra trang và build.',
  steps: [
    {
      title: 'Cài từ lockfile',
      text: 'Clone repo rồi dùng npm ci trong thư mục portal-template. Lockfile giữ phiên bản đã kiểm chứng.',
      file: 'package.json / package-lock.json',
      code: 'git clone https://github.com/sdcorejs/portal-template.git\ncd portal-template\nnode --version\nnpm ci\nnpm run check:toolchain',
      result: 'Lệnh kiểm tra toolchain thành công; @sdcorejs/angular được khóa ở 22.2.8.',
    },
    {
      title: 'Mở Portal và Storybook',
      text: 'Chạy hai terminal. Đợi thông báo sẵn sàng trước khi mở trình duyệt.',
      file: 'package.json',
      code: 'npm start\n# Terminal thứ hai\nnpm run storybook',
      result: 'Portal: http://localhost:2208; Storybook: http://localhost:6006.',
    },
    {
      title: 'Kiểm tra thay đổi',
      text: 'Build dev và lint trước khi bàn giao. Nếu port bận, xác định tiến trình đang sở hữu port trước khi dừng.',
      file: 'package.json',
      code: 'npm run build\nnpm run lint\nnpm run check:catalog',
      result: 'Build/lint hoàn tất. Warning và lỗi phải được đọc riêng; warning không đồng nghĩa build thất bại.',
    },
  ],
  exercise: 'Đánh dấu các bước bạn đã hoàn tất. Đây là checklist cục bộ, không chạy lệnh trên máy.',
  expected: 'Hoàn thành 3 bước sẽ mở liên kết review Portal và Storybook.',
  exampleCode:
    '// package.json — các entry hiện có\n"start": "ng serve --port 2208",\n"storybook": "ng run portal-template:storybook",\n"build": "ng build --configuration=dev"',
  pitfalls: [
    'Node không thỏa engines có thể khiến CLI không chạy; đổi đúng runtime trước npm ci.',
    'Không xóa lockfile để xử lý tùy tiện lỗi dependency.',
    'Core UI công khai; không có bước cấp khóa kích hoạt.',
  ],
  checklist: ['Toolchain hợp lệ.', 'Portal và Storybook truy cập được.', 'Build dev và lint đã chạy.'],
  sources: [
    {
      title: 'Core UI — bắt đầu',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3756754126',
    },
  ],
  related: ['overview', 'integration'],
  screenshot: {
    src: '/assets/instructions/setup/portal-running.png',
    alt: 'Portal đang chạy với danh sách khách hàng, hyperlink mã và badge trạng thái.',
  },
} satisfies ArticleText;
