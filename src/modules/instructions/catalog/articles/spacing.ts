import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Áp dụng mật độ form và view đã thống nhất.', 'Giữ inline error, giảm khoảng trống thừa bằng layout bên ngoài.'],
  prerequisites: 'Core SdSection, SdInput và utility spacing đang có trong Portal.',
  caption: 'Body 20 px. Form create/update: hàng cách 8 px, vẫn dành vùng inline error. View: hàng cách 16 px.',
  steps: [
    {
      title: 'Form nhập liệu',
      text: 'Đặt p-20 gap-8 trên wrapper nội dung body của sd-section. Không bật hideInlineError để bù khoảng cách.',
      file: 'customer-form.component.html',
      code: '<sd-section title="Thông tin công ty">\n  <div class="p-20 d-flex flex-column gap-8">\n    <sd-input label="Tên công ty" [(model)]="name" required />\n    <sd-input label="Email" [(model)]="email" />\n  </div>\n</sd-section>',
      result: 'Các hàng gần nhau nhưng lỗi không đè lên hàng kế tiếp.',
    },
    {
      title: 'Màn xem dữ liệu',
      text: 'Dùng gap-16 và label/value dễ quét. CSS của feature có prefix riêng; chỉ override nội bộ Core khi có lý do kiểm chứng.',
      file: 'customer-detail.component.scss',
      code: '.c-customer-facts {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  padding: 20px;\n  gap: 16px;\n}\n@media (max-width: 600px) {\n  .c-customer-facts { grid-template-columns: 1fr; }\n}',
      result: 'Màn hẹp xuống một cột, không có scrollbar ngang toàn trang.',
    },
  ],
  exercise: 'Chuyển Nhập liệu/Xem chi tiết. Xóa tên và bấm kiểm tra để hiển thị lỗi.',
  expected: 'Form gap8, view gap16, cả hai padding20. Inline error còn chỗ hiển thị.',
  exampleCode: '// Form: p-20 gap-8\n// View: p-20 gap-16\n// Không cộng thêm padding của card lồng nhau vào body.',
  pitfalls: ['Không tăng gap để bù cho wrapper bị thiếu padding.', 'Không lạm dụng ::ng-deep hoặc selector rộng ảnh hưởng toàn Portal.'],
  checklist: ['Padding body20.', 'Form gap8, viewgap16.', 'Kiểm tra lỗi và mobile.'],
  sources: [
    {
      title: 'CSS/SCSS conventions',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581922118',
    },
  ],
  related: ['quality', 'theme'],
  screenshot: {
    src: '/assets/instructions/spacing/example.png',
    alt: 'Ảnh demo Core thật: body padding 20 px, form gap 8 px và vùng inline error được giữ.',
  },
} satisfies ArticleText;
