import type { ArticleText } from '../instruction-content';
export default {
  goals: ['Đặt mã theo MODULE → ENTITY → TYPE → ACTION.', 'Chỉ hiển thị nhóm G cho người dùng gán vào Role.'],
  prerequisites: 'Phân biệt kiểm tra FE (C) với kiểm tra BE (A).',
  caption: 'Role “Kinh doanh” → nhóm CRM_CUSTOMER_G_CREATE → CRM_CUSTOMER_C_CREATE và CRM_CUSTOMER_A_CREATE.',
  steps: [
    {
      title: 'Định nghĩa quyền kỹ thuật',
      text: 'Module, entity, type và action là các phần bắt buộc. Dùng C cho FE, A cho BE.',
      file: 'authorization/permission.model.ts',
      code: 'CRM_CUSTOMER_C_CREATE // FE\nCRM_CUSTOMER_A_CREATE // BE\nCRM_CUSTOMER_G_CREATE // Nhóm nghiệp vụ',
      result: 'Tên quyền có thể đọc theo cùng một thứ tự, không dùng mã kiểu action/entity đảo vị trí.',
    },
    {
      title: 'Gom quyền thành nhóm nghiệp vụ',
      text: 'Role editor chỉ cho chọn nhóm G bằng nhãn dễ hiểu. Mapping C/A dành cho developer hoặc hệ thống.',
      file: 'authorization/permission.model.ts',
      code: "{\n  code: 'CRM_CUSTOMER_G_CREATE',\n  label: 'Tạo khách hàng',\n  permissions: ['CRM_CUSTOMER_C_CREATE', 'CRM_CUSTOMER_A_CREATE']\n}",
      result: 'Người dùng chọn “Tạo khách hàng” mà không phải biết FE hay BE.',
    },
    {
      title: 'Tính lại tập quyền khi thay đổi Role',
      text: 'Lấy hợp các quyền của mọi nhóm còn được gán. Không xóa trực tiếp quyền C/A khi bỏ một nhóm.',
      file: 'authorization/permission.model.ts',
      code: 'return [...new Set(groups\n  .filter(group => selected.includes(group.code))\n  .flatMap(group => group.permissions))];',
      result: 'Quyền dùng chung vẫn tồn tại nếu nhóm khác còn cấp nó.',
    },
  ],
  exercise: 'Gán “Tạo khách hàng” và “Tạo đơn hàng kèm khách hàng”, rồi bỏ nhóm thứ nhất. Mở mapping kỹ thuật để quan sát.',
  expected: 'Quyền tạo khách hàng vẫn tồn tại khi nhóm tạo đơn hàng còn cấp; bỏ cả hai mới mất quyền.',
  exampleCode:
    "const assignedGroups = ['CRM_CUSTOMER_G_CREATE'];\n// Role UI chỉ lưu group codes. Backend xác thực mapping và phát effective permissions.",
  pitfalls: [
    'Không hiển thị hai checkbox FE/BE trong Role editor cho end user.',
    'G không thay thế việc kiểm tra A tại backend.',
    'Không tự suy mã bằng replace G thành C/A; nhóm có thể chứa nhiều quyền.',
  ],
  checklist: ['Đúng thứ tự MODULE_ENTITY_TYPE_ACTION.', 'UI gán Role chỉ có nhóm G.', 'Quyền giao nhau được hợp nhất đúng.'],
  sources: [
    {
      title: 'Permission, group và role — áp dụng quy ước đã thống nhất',
      url: 'https://onemount.atlassian.net/wiki/spaces/om/pages/2581922132',
    },
  ],
  related: ['permission-checks', 'data-scope'],
} satisfies ArticleText;
