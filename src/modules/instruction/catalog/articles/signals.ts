import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Sử dụng input, output, model và computed đúng vai trò.', 'Query có thể chưa có phần tử; kiểm tra trước khi focus.'],
  prerequisites: 'Angular 22. Ví dụ dùng signal APIs thực tế.',
  caption: 'Parent truyền đơn giá qua input; child giữ quantity bằng model; computed tính tổng; output báo thêm hàng về parent.',
  steps: [
    {
      title: 'Khai báo dữ liệu và sự kiện',
      text: 'InputSignal chỉ đọc từ phía child. model hỗ trợ cập nhật hai chiều. output là emitter, không phải Signal.',
      file: 'features/modern-angular/signals-demo.component.ts',
      code: 'readonly unitPrice = input.required<number>();\nreadonly quantity = model(1);\nreadonly total = computed(() => this.unitPrice() * this.quantity());\nreadonly added = output<number>();',
      result: 'Thay quantity hoặc đơn giá làm total thay đổi tự động.',
    },
    {
      title: 'Kết nối parent và child',
      text: 'Parent nhận output để phản hồi nghiệp vụ. Query DOM có thể undefined khi phần tử chưa render.',
      file: 'signals-demo.component.ts',
      code: '<app-order-line [unitPrice]="price()" [(quantity)]="quantity" (added)="onAdded($event)" />\n// Trong child:\nreadonly quantityInput = viewChild<ElementRef<HTMLInputElement>>(\'quantityInput\');\nfocusQuantity() { this.quantityInput()?.nativeElement.focus(); }',
      result: 'Nút focus đưa bàn phím vào quantity; output cập nhật thông báo parent.',
    },
  ],
  exercise: 'Đổi đơn giá, tăng số lượng, bấm Thêm hàng rồi Focus số lượng. Reset trả cả parent và child về mặc định.',
  expected: 'Total luôn bằng đơn giá × quantity. Parent nhận đúng tổng tại thời điểm bấm.',
  exampleCode:
    'readonly price = signal(120000);\nreadonly quantity = signal(1);\nreadonly lastAdded = signal<number | null>(null);\nonAdded(total: number) { this.lastAdded.set(total); }',
  pitfalls: [
    'Không dùng effect để đồng bộ một giá trị có thể tính bằng computed.',
    'viewChild/viewChildren là signal query; vẫn cần xử lý khi view chưa có phần tử.',
    'Không sửa object input tại chỗ để kỳ vọng signal tự nhận thay đổi.',
  ],
  checklist: ['Giá trị dẫn xuất dùng computed.', 'Sự kiện nghiệp vụ dùng output.', 'Query có guard khi truy cập.'],
  sources: [
    {
      title: 'Angular component APIs',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3746889913',
    },
  ],
  related: ['di', 'typescript'],
  screenshot: {
    src: '/assets/instructions/signals/example.png',
    alt: 'Ảnh demo Angular thật: parent truyền đơn giá, child tính tổng và phát sự kiện thêm hàng.',
  },
} satisfies ArticleText;
