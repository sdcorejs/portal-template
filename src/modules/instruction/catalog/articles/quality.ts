import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Dùng HTML có ngữ nghĩa và điều khiển bằng bàn phím.', 'Kiểm tra trạng thái async, thông tin thay thế ảnh và table headers.'],
  prerequisites: 'Hiểu label, focus và nội dung động.',
  caption: 'Người dùng bàn phím → control có tên → focus rõ → thông báo live → dữ liệu table có caption và headers.',
  steps: [
    {
      title: 'Giữ ngữ nghĩa tương tác',
      text: 'Dùng button cho hành động, anchor cho điều hướng. Ảnh thông tin có alt mô tả; ảnh chỉ trang trí có alt rỗng, không phụ thuộc ảnh từ backend hay frontend.',
      file: 'component.html',
      code: '<button type="button" (click)="onSave()">Lưu</button>\n<a routerLink="/page">Xem page mẫu</a>\n<img src="/assets/instructions/quality/overview.svg" alt="Luồng kiểm tra accessibility" />\n<iframe title="Ví dụ component" src="/example"></iframe>',
      result: 'Tab tới được control; Enter/Space hoạt động theo ngữ nghĩa mặc định.',
    },
    {
      title: 'Đặt tên và phản hồi cho dữ liệu',
      text: 'Table dùng caption, th scope; thao tác async có aria-live. Code block cuộn riêng, không đẩy layout ngang.',
      file: 'component.html',
      code: '<table>\n  <caption>Khách hàng phụ trách</caption>\n  <thead><tr><th scope="col">Mã</th><th scope="col">Tên</th></tr></thead>\n</table>\n<p role="status" aria-live="polite">{{ message() }}</p>',
      result: 'Screen reader biết bảng nói về gì và nhận được kết quả thao tác.',
    },
  ],
  exercise: 'Dùng Tab tới nút Xác nhận chọn, nhấn Enter. Chuyển ví dụ trước/sau để xem cải thiện markup.',
  expected: 'Focus thấy rõ, trạng thái cập nhật trong vùng live; table có tên và header.',
  exampleCode: '// Review cả semantics và hành vi:\n// tên accessible, thứ tự Tab, focus return, loading, lỗi và retry.',
  pitfalls: [
    'Không dùng div click làm nút.',
    'Không thay nội dung chỉ bằng màu.',
    'Không mặc định mọi ảnh phải có alt dài: ảnh trang trí dùng alt="".',
  ],
  checklist: [
    'Có thể thao tác bằng bàn phím.',
    'Ảnh và iframe có tên phù hợp.',
    'Table có caption/headers.',
    'Loading/error được thông báo.',
  ],
  sources: [
    {
      title: 'Code quality và accessibility',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581856491',
    },
  ],
  related: ['spacing', 'typescript'],
  screenshot: {
    src: '/assets/instructions/quality/example.png',
    alt: 'Ảnh ví dụ HTML có caption, header bảng và nút xác nhận dùng được bằng bàn phím.',
  },
} satisfies ArticleText;
