import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Tách quyền hành động khỏi phạm vi dữ liệu.', 'Kiểm tra assignment theo người dùng, tác vụ và bản ghi ở server.'],
  prerequisites: 'Biết permission C/A. Không mở rộng quy ước mã quyền bằng suffix scope.',
  caption: 'User + quyền action + assignment context → bản ghi được phép. Có quyền action không đồng nghĩa xem được mọi bản ghi.',
  steps: [
    {
      title: 'Xác định quan hệ cấp quyền',
      text: 'Ví dụ mô phỏng: user xem hồ sơ mình sở hữu hoặc hồ sơ được giao tác vụ đang mở. Quy tắc thật cần thống nhất theo domain.',
      file: 'authorization/assignment-context.ts',
      code: "interface Assignment {\n  userId: string;\n  recordId: string;\n  task: 'review';\n  active: boolean;\n}",
      result: 'Assignment có record cụ thể và trạng thái; không cấp quyền toàn bộ entity chỉ vì một tác vụ.',
    },
    {
      title: 'Kết hợp action và scope',
      text: 'Server kiểm tra cả hai điều kiện trên mỗi request; list và detail phải áp dụng cùng chính sách.',
      file: 'backend policy — pseudocode',
      code: "allowed = hasPermission(user, 'CRM_CUSTOMER_A_VIEW')\n  && (record.ownerId === user.id || hasActiveAssignment(user.id, record.id));",
      result: 'Bỏ quyền VIEW chặn cả hồ sơ sở hữu. Assignment hết hiệu lực không còn mở rộng scope.',
    },
  ],
  exercise: 'Chuyển giữa Lan và Minh, bật/tắt quyền xem và assignment. Thử mở trực tiếp hồ sơ ngoài phạm vi.',
  expected: 'Danh sách chỉ có bản ghi đúng scope; truy cập trực tiếp ngoài phạm vi bị từ chối.',
  exampleCode:
    '// Policy minh họa, cần triển khai và kiểm chứng ở backend thật.\ncanView = hasView && (isOwner || isAssigned);\n// Không tin ownerId hoặc assignment từ payload do client tự khai.',
  pitfalls: [
    'Chỉ lọc list ở FE vẫn lộ dữ liệu qua API/detail.',
    'Không lưu quyền toàn cục từ một task riêng.',
    'Assignment hết hạn phải được thu hồi theo nguồn dữ liệu server.',
  ],
  checklist: ['List/detail dùng cùng policy.', 'Có kiểm thử hết assignment.', 'Có kiểm thử thiếu action dù đúng owner.'],
  sources: [
    {
      title: 'Data permission và Assignment Context',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581922132',
    },
  ],
  related: ['permission-model', 'permission-checks'],
} satisfies ArticleText;
