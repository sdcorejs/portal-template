import type { ArticleText } from '../instruction-content';
export default {
  goals: [
    'Phân biệt provider dùng chung ở cha và provider cục bộ ở component.',
    'Gọi inject trong injection context, tránh khởi tạo service bằng new.',
  ],
  prerequisites: 'Hiểu standalone component và dependency provider.',
  caption: 'Hai consumer dưới cùng injector dùng chung instance; consumer có provider riêng nhận instance khác.',
  steps: [
    {
      title: 'Chọn owner của trạng thái',
      text: 'State toàn ứng dụng dùng root khi thực sự cần. State một phiên thao tác có thể đặt tại route/component.',
      file: 'features/modern-angular/di-demo.component.ts',
      code: '@Injectable()\nclass SessionCounter { count = signal(0); }\n@Component({ providers: [SessionCounter], /* ... */ })\nclass CounterScope {\n  readonly counter = inject(SessionCounter);\n}',
      result: 'Các consumer con thừa hưởng provider gần nhất, không nhất thiết provider root.',
    },
    {
      title: 'Inject trong context hợp lệ',
      text: 'Field initializer hoặc constructor là injection context. Handler click dùng instance đã inject từ trước.',
      file: 'component.ts',
      code: 'readonly counter = inject(SessionCounter);\nonIncrement() { this.counter.count.update(value => value + 1); }',
      result: 'Không gọi inject() tùy tiện trong callback chạy muộn; tránh NG0203.',
    },
  ],
  exercise: 'Tăng bộ đếm ở Shared A: Shared B đổi theo. Local giữ giá trị riêng. Dựng lại scope sẽ cấp instance mới.',
  expected: 'A và B có cùng instance ID, Local có ID khác. Đây là Angular DI thật, không phải nhãn giả lập.',
  exampleCode:
    '@Component({ providers: [SessionCounter] })\nclass LocalCounter extends CounterConsumer {}\n// Provider gần consumer nhất thắng.',
  pitfalls: [
    'providers trên component tạo scope theo instance component.',
    'providedIn root không mặc nhiên phù hợp với draft của từng màn.',
  ],
  checklist: ['Xác định lifetime của state.', 'Không gọi inject ngoài context.', 'Không phụ thuộc service khởi tạo thủ công.'],
  sources: [
    {
      title: 'Angular inject và signal APIs',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/3746889913',
    },
  ],
  related: ['configuration', 'signals'],
} satisfies ArticleText;
