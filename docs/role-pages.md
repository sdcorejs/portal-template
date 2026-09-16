# Mẫu quản lý vai trò

Hai ví dụ riêng ngay trong menu **Page** dùng Core UI 22.2.12. Mỗi ví dụ mở danh sách trước; tạo mới, chi tiết và cập nhật được điều hướng từ danh sách:

| Mẫu | URL danh sách | Cách gán quyền |
| --- | --- | --- |
| Role · Ma trận quyền | `/page/role/matrix` | Mỗi chức năng một hàng; cột Xem/Tạo/Cập nhật/Xóa và Other chứa nhiều quyền |
| Role · Quyền phân cấp | `/page/role/tree` | Chức năng là hàng cha, từng quyền là hàng con có thể thu gọn |

Mỗi mẫu có `/create`, `/:id/detail`, `/:id/update`. Mã ở cột đầu dẫn đến detail; nút Cập nhật mở form. Header có Quay lại dạng text kèm mũi tên và Lưu kèm icon. Không có Tạo mới ở detail.

Danh mục gồm 4 module, 13 chức năng và 6 vai trò giả lập. Tab module đếm số quyền đã chọn, gồm cả quyền đang bị bộ lọc ẩn. Checkbox chỉ cấp nhóm `MODULE_ENTITY_G_ACTION`; UI dùng tên nghiệp vụ. Quyền C/A và việc thực thi quyền ở backend thuộc hệ thống consumer.

Chọn tất cả/cột/hàng chỉ thay đổi quyền thuộc chức năng đang hiển thị. Trạng thái chọn một phần được thể hiện bằng dấu gạch. Thay đổi tab, tìm kiếm, lọc đã có quyền hoặc thu gọn không làm mất lựa chọn. Quyền không áp dụng hiển thị `—`; không tự động thêm VIEW khi chọn quyền khác.

Mỗi mẫu có dữ liệu độc lập ở `sessionStorage`, key `portal-pages:roles:v1:matrix` hoặc `portal-pages:roles:v1:tree`. Tải/lưu giả lập trễ ngẫu nhiên 1–2 giây; lưu thành công mở detail và dữ liệu tồn tại khi refresh trong phiên. Lỗi lưu giữ nguyên draft. Core unsaved-change service bảo vệ điều hướng và refresh khi có thay đổi.

Mã/tên bắt buộc, mã duy nhất trong từng mẫu và chỉ gồm chữ hoa, số, `_`, `-` (tối đa 40 ký tự). Mã readonly khi cập nhật. Tên tối đa 120, mô tả tối đa 400 ký tự. Cho phép lưu vai trò chưa có quyền.

## Mã nguồn để tái sử dụng

`src/modules/page/features/role/` tách `pages/`, `components/`, `data/`:

- `RoleListPageComponent`: bảng Core và điều hướng.
- `RoleRecordPageComponent`: load route và guard; `RoleRecordEditorComponent`: form, draft, lưu.
- `RolePermissionEditorComponent`: module tabs, bộ lọc và tổng quyền.
- `PermissionMatrixComponent`: dùng `SdTable`, `sdTableTitleDef` cho chọn cả cột và `sdTableCellDef` cho chọn từng quyền CRUD/Other.
- `PermissionTreeComponent`: dùng `SdTable` với `tree.loadType: 'static'`; Core xử lý bung/thu hàng cha, checkbox dùng chung helpers để giữ phạm vi quyền.
- `RoleSessionStore`: adapter giả lập, validation và lưu phiên; thay boundary này bằng API khi tích hợp.

Core 22.2.8 chưa công bố input `indeterminate` ở `SdCheckbox`. `PermissionCheckComponent` dùng `MatCheckbox` từ dependency Angular Material hiện có để hỗ trợ mixed state và bàn phím, nhận màu từ theme Core. Không thêm package hoặc truy cập nội bộ Core.

Hai mẫu được đăng ký trong catalog và source bundle. Chạy `npm run export:catalog` sau khi sửa nguồn, `npm run check:catalog` để kiểm tra đồng bộ. Browser regression dành cho Role và URL các page cũ: `npx playwright test --config playwright.roles.config.ts` (chỉ cần Portal 2208).
