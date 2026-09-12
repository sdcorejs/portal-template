import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Giữ kiểm tra quyền ở menu, route, action và API.', 'Hiểu rằng ẩn nút không phải cơ chế bảo vệ dữ liệu.'],
  prerequisites: 'Đã đọc Permission, Group & Role. Các kết quả API ở đây được mô phỏng trong browser.',
  caption: 'Quyền C quyết định menu/route/button; request vượt giao diện vẫn phải được backend kiểm tra A.',
  steps: [
    {
      title: 'Kiểm tra C trong UI và route',
      text: 'Các điểm hiển thị và guard dùng cùng effective permissions. Direct URL phải đi qua guard.',
      file: 'module routes / page template',
      code: "const canCreate = effectivePermissions.includes('CRM_CUSTOMER_C_CREATE');\n// Menu và nút tạo dùng canCreate.\n// Guard route create kiểm tra lại quyền C tương ứng.",
      result: 'Bỏ nhóm tạo làm mất nút tạo, đồng thời chặn đường dẫn create trực tiếp.',
    },
    {
      title: 'Kiểm tra A ở server',
      text: 'Server đọc principal đã xác thực và quyền A; không tin danh sách quyền do browser gửi lên.',
      file: 'backend authorization boundary',
      code: "// Pseudocode tại server\nrequirePermission(principal, 'CRM_CUSTOMER_A_CREATE');\nvalidatePayload(request.body);\nreturn customerService.create(request.body);",
      result: 'Request thiếu quyền A trả forbidden ngay cả khi gọi ngoài UI.',
    },
  ],
  exercise:
    'Đổi nhóm quyền của Role, thử URL trực tiếp và gọi API giả lập. Bật tình huống “UI đã cũ” để thấy vì sao backend cần kiểm tra lại.',
  expected: 'API giả lập từ chối khi BE đã thu hồi quyền, kể cả khi nút trên UI còn hiển thị.',
  exampleCode:
    "// Demo only — không phải guard production\nconst routeAllowed = effective.has('CRM_CUSTOMER_C_CREATE');\nconst apiAllowed = serverEffective.has('CRM_CUSTOMER_A_CREATE');",
  pitfalls: ['Frontend không thể bảo vệ API bằng hidden/disabled.', 'Token/quyền đã cũ cần cơ chế refresh hoặc xử lý 403.'],
  checklist: ['Menu/action kiểm tra C.', 'Direct route được guard.', 'Backend kiểm tra A độc lập.'],
  sources: [
    {
      title: 'Áp dụng phân quyền',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581922132',
    },
  ],
  related: ['permission-model', 'data-scope'],
} satisfies ArticleText;
