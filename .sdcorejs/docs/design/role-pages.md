---
artifact_id: design-handoff-role-pages-r1
artifact_kind: design-handoff
owner: sdcorejs-design
owner_repository_id: github.com/sdcorejs/portal-template
owner_repository_role: portal
change_ref: role-pages
status: approved
commit_policy: with-change
---

# Role pages — triển khai thiết kế đã duyệt

Người dùng chọn hai page riêng rồi duyệt preview ngày 2026-09-12. Thiết kế nguồn: `.sdcorejs/design/specs/role-pages.md`; preview HTML tại `.sdcorejs/design/wireframes/role-pages/role-pages.html` chỉ để đối chiếu. Bản tích hợp thực tế nằm trong Angular Portal 2208.

| Mẫu | List | Create | Detail / Update |
| --- | --- | --- | --- |
| Ma trận | /pages/list/roles-matrix | /pages/list/roles-matrix/create | /pages/list/roles-matrix/:id/detail và :id/update |
| Phân cấp | /pages/list/roles-tree | /pages/list/roles-tree/create | /pages/list/roles-tree/:id/detail và :id/update |

## Quyết định triển khai

- Hai menu dưới Pages → List, dùng chung catalog quyền và helpers; dữ liệu phiên độc lập.
- `RoleRecordPageComponent` sở hữu load theo route và canDeactivate; `RoleRecordEditorComponent` sở hữu form, draft, save và unsaved registration. Store provider theo route.
- `RolePermissionEditorComponent` sở hữu tab/filter; matrix và tree chỉ trình bày, emit phạm vi cần bật/tắt. Thay đổi UI state không làm dirty draft.
- Layout/header/form/list dùng Core 22.2.8. Checkbox mixed dùng `MatCheckbox` qua wrapper vì Core `SdCheckbox` chưa có input `indeterminate` công khai; dùng dependency Material và màu theme sẵn có.
- Form p20/gap8, ô mô tả 2 hàng; detail gap16. Bảng quyền cuộn nội bộ trên màn hẹp. Nhóm G hiển thị bằng tên nghiệp vụ; không chọn C/A.
- Catalog có 14 mẫu, giữ 12 mẫu cũ; Role có data contract riêng, không mở rộng DTO DemoEntity bằng dữ liệu vai trò.

Hướng dẫn consumer và giới hạn demo: `docs/role-pages.md`. Backend/auth thực tế không thuộc phạm vi; session adapter thay thế được bằng API. Không thêm dependency, không commit/push trong lượt này.

## Kiểm chứng

Nguồn kiểm tra: `e2e/roles.spec.ts`, `playwright.roles.config.ts`, `features/roles/data/role-permissions.spec.ts` và catalog tests. Bằng chứng build/lint/unit/browser cuối cùng ghi trong `docs/verification.md`. PNG Angular nằm tại `.sdcorejs/design/exports/png/role-pages/angular-*.png`; PNG `role-*.png` là preview đã duyệt trước tích hợp.
