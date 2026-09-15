import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Đặt tên output theo sự kiện, handler theo hành động xử lý.', 'Giữ kiểu dữ liệu và xử lý Promise rõ ràng.'],
  prerequisites: 'TypeScript 6 và signal APIs.',
  caption: 'Tên nghiệp vụ → kiểu rõ ràng → xử lý thành công/lỗi → state nhất quán.',
  steps: [
    {
      title: 'Đặt tên theo vai trò',
      text: 'Output dùng saved/selected; handler dùng onSave/onSelected. Boolean mô tả câu hỏi, collection dùng số nhiều.',
      file: 'customer-form.component.ts',
      code: 'readonly saved = output<Customer>();\nreadonly customers = signal<Customer[]>([]);\nreadonly isSaving = signal(false);\nonSave(): void { /* validate và lưu */ }',
      result: 'Đọc tên biết đó là dữ liệu, sự kiện hay handler; tránh output trùng native click/change.',
    },
    {
      title: 'Suy luận kiểu đúng chỗ',
      text: 'Object literal có kiểu suy luận, không mặc định là any. Khai báo type ở boundary và dùng satisfies để kiểm tra shape khi phù hợp.',
      file: 'customer.model.ts',
      code: "interface CreateCustomer { name: string; email: string; }\nconst draft = { name: 'Minh An', email: '' } satisfies CreateCustomer;\n// draft.name được suy luận là string.",
      result: 'Payload thiếu/sai trường bị compiler báo.',
    },
    {
      title: 'Kết thúc cả nhánh lỗi',
      text: 'finally luôn trả trạng thái pending; catch giữ lỗi để UI có thể retry.',
      file: 'customer.service consumer',
      code: "try {\n  isSaving.set(true);\n  await saveCustomer(payload);\n} catch {\n  error.set('Không thể lưu. Vui lòng thử lại.');\n} finally {\n  isSaving.set(false);\n}",
      result: 'Request lỗi không để form loading mãi hoặc báo thành công sai.',
    },
  ],
  exercise: 'Bật lỗi giả lập rồi lưu. Quan sát pending trở về false và sửa lỗi bằng cách thử lại.',
  expected: 'Thông báo success/error đúng nhánh. Không thể gửi lặp khi đang pending.',
  exampleCode:
    '// Ưu tiên scope nhỏ\nconst activeCustomers = customers.filter(customer => customer.active);\n// Dùng map khi cần mảng kết quả; forEach khi thực hiện side effect.',
  pitfalls: [
    'Không dùng any để né lỗi kiểu của API.',
    'Không đặt output onSave vì dễ lẫn với handler onSave.',
    'Không dùng length < 0 để kiểm tra mảng rỗng.',
  ],
  checklist: ['Tên nhất quán theo vai trò.', 'Kiểu ở API boundary.', 'Promise có đường xử lý lỗi.'],
  sources: [
    {
      title: 'Naming conventions',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581856504',
    },
    {
      title: 'Code quality',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581856491',
    },
  ],
  related: ['signals', 'quality'],
} satisfies ArticleText;
