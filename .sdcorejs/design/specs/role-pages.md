---
artifact_id: design-role-pages-r1
artifact_kind: design-asset
owner: sdcorejs-design
owner_repository_id: github.com/sdcorejs/portal-template
owner_repository_role: portal
change_ref: role-pages
status: approved
commit_policy: with-change
source_request: "List Role và create/update, hai page riêng: ma trận CRUD/Other và table cha-con"
---

# Role pages — thiết kế đã duyệt

Người dùng duyệt ngày 2026-09-12 bằng “Duyệt” trên preview Role. Phạm vi được chấp thuận gồm tích hợp hai page độc lập vào Angular Pages; không yêu cầu thêm vòng phê duyệt. Bản triển khai và hướng dẫn tái sử dụng: `docs/role-pages.md`.

## Phạm vi đã xác nhận

Hai page mẫu **riêng trong Pages** (câu trả lời ngày 12/09/2026): Role · Ma trận quyền và Role · Quyền phân cấp. Cả hai có list, tạo và cập nhật Role. Mỗi module là một tab; title hiển thị số quyền đã chọn. Ma trận có CRUD và Other chứa nhiều checkbox. Kiểu còn lại là bảng cha–con.

Tiếp tục convention đã thống nhất: UI gán Role chỉ hiển thị nhóm G bằng tên nghiệp vụ; mã đúng MODULE_ENTITY_G_ACTION. Không cho end user chọn C/A riêng. Hai mẫu dùng cùng danh mục quyền và logic selection; giao diện riêng, dữ liệu phiên độc lập để so sánh.

## Visual direction và bằng chứng

Dùng kiểu enterprise portal hiện có: header ngắn; primary #005cca tương ứng màu hiện tại; hệ thống font của Portal khi tích hợp Core; bảng trong vùng cuộn, toolbar gần dữ liệu. SdSection body p-20; form gap-8 có vùng inline error; view gap-16. Header phải giữ Quay lại dạng text/link + arrow_back, Lưu có save icon. Chi tiết không có nút Tạo mới. Hình ảnh preview là HTML độc lập mô phỏng style, không phải bằng chứng đã tích hợp component Core.

Bằng chứng source hiện tại: src/modules/pages/features/list-standard, components/record-header.component.ts, components/unsaved-changes.guard.ts, reference/page-navigation.ts; Core 22.2.8 trong package.json. Không tạo palette, font hoặc package mới cho Angular.

## Screens và hành vi

### List
- Hai menu dưới Pages → List, một cho mỗi style.
- Bảng full height vùng làm việc; cột: mã Role hyperlink, tên/mô tả, modules, số quyền G, số người dùng, trạng thái badge, cập nhật.
- Tìm theo code/name và filter trạng thái qua quickSearch của Core khi tích hợp.
- Tạo mới ở header phải. Không có command “Xem chi tiết”.
- Hyperlink mã → detail (bổ sung chế độ xem theo convention Pages hiện có), Cập nhật → update.

### Create / Update / View
- Thông tin chung: mã, tên, trạng thái, mô tả. Candidate validation: code/name bắt buộc; code duy nhất trong phiên, dùng chữ in hoa/số/_/-; code readonly khi update. User count chỉ để xem.
- Header create: “Tạo vai trò”; update: “Cập nhật vai trò #ROLE-SALES”; view: “Chi tiết vai trò #ROLE-SALES”, mã primary, tên ở description, badge round.
- Panel Phân quyền: tổng nhóm G đã chọn và số module có quyền.
- Tabs: CRM, Bán hàng, Danh mục, Quản trị. Badge đếm G đã chọn, kể cả quyền đang bị filter ẩn.
- Đổi tab giữ nguyên lựa chọn. ArrowLeft/Right/Home/End hỗ trợ chuyển tab.
- Search entity/action để lọc chức năng. Chọn tất cả kết quả chỉ áp dụng tập quyền của các chức năng đang hiển thị; không bỏ quyền ẩn.
- “Chức năng đã có quyền” lọc entity có ít nhất một quyền được chọn. Trong entity vẫn hiển thị checkbox chưa chọn.
- Không tự động cấp VIEW khi chọn CREATE/UPDATE/Other nếu nghiệp vụ chưa quy định. Không tự suy C/A bằng string replacement.
- Có thể lưu Role chưa có quyền; chưa chốt quy tắc bắt buộc phải chọn quyền nên không tự chặn.

### Ma trận
Một entity mỗi hàng; Xem, Tạo, Cập nhật, Xóa mỗi ô một checkbox. Other chứa các action thực tế: Giao phụ trách, Nhập, Xuất, Duyệt, Chuyển đổi, v.v. Quyền không tồn tại hiển thị —. Hàng chọn tất cả entity và từng cột CRUD có checkbox tri-state. “Other” được giữ đúng tên theo yêu cầu, có nhãn bổ sung “Quyền khác”.

### Phân cấp
Trong tab module, entity là hàng cha; từng quyền G là hàng con. Bảng có tên chức năng/quyền, nhóm CRUD/Other, phạm vi chức năng và checkbox Cho phép. Parent checkbox có checked/unchecked/indeterminate; chọn cha chọn tất cả con, không phụ thuộc expand/collapse. Count cha selected/total.

### State, save và back
- Preview dùng sessionStorage riêng từng style, ngẫu nhiên loading 1–2 giây; fixture 6 Role, 4 modules, 13 entities.
- Lưu thành công → detail của record id; reload giữ quyền. Lưu lỗi không mất draft.
- Form dirty gồm info fields và tập quyền; Quay lại/chuyển menu cần bảo vệ draft. Angular dùng guard/router chuẩn khi tích hợp.
- Không xóa Role, gán user, hay tích hợp auth/permission backend thật trong phạm vi này.

## Route dự kiến

| Mẫu | List | Create | Detail / Update |
| --- | --- | --- | --- |
| Ma trận | /pages/list/roles-matrix | /pages/list/roles-matrix/create | /pages/list/roles-matrix/:id/detail và :id/update |
| Phân cấp | /pages/list/roles-tree | /pages/list/roles-tree/create | /pages/list/roles-tree/:id/detail và :id/update |

Preview HTML dùng query parameters riêng để review, không đăng ký giả các URL này trong Portal.

## Frontend architecture — candidate handoff

Target module Pages trong portal-template, không có repository Role bên ngoài.

- **RoleListPage**: route list, SdPage, SdTable, quick search/filter; map row → link, create action. Không chứa logic phân quyền.
- **RoleRecordPage**: route create/detail/update, load/save lifecycle, draft, status, header actions và canDeactivate.
- **RoleInformationForm**: code/name/status/description; control Core, validation và read-only.
- **RolePermissionEditor**: active module/search/selected-only; selected G IDs do parent draft sở hữu; tổng count; tab title/icon.
- **RolePermissionMatrix**: trình bày cột CRUD/Other, emit tập ID cần bật/tắt.
- **RolePermissionTree**: expand state và parent/child rows; cùng selection contract với matrix.
- **role-permissions.model.ts**: catalog Module/Entity/Group, typed Role record, label/action category; pure helpers tính scope, tri-state và count.
- **RoleSessionStore**: provider ở route/mẫu, lưu data phiên theo style. CRUD adapter riêng; không nhét Role vào DemoEntity chung vốn dùng field amount/lines.
- Reuse SdPage, SdSection, SdTable, SdCheckbox, SdInput/SdSelect, SdButton, SdBadge và public tab API sau khi đối chiếu declaration cài đặt. Reuse guard contract khi compatible.
- Menu entry: metadata role examples riêng hoặc hợp nhất navigation metadata theo discriminator. Không thêm Role vào PAGE_EXAMPLES.map nếu sẽ bị PageReferenceComponent cũ resolve nhầm pattern registry.
- Catalog: đăng ký hai mẫu Role cùng metadata/data contract và source bundle; giữ nguyên 12 mẫu cũ. Cần mở rộng discovery model một cách có chủ đích, không cast Role thành EntityKind khác.

Ownership: RoleRecordPage giữ draft/selected permission IDs; children chỉ emit thay đổi. Module tab/search/expand là UI state, không tính dirty. Store ghi dữ liệu sau save, không ghi trực tiếp khi tick. Quyền backend hiệu lực thuộc hệ thống thật, ngoài phạm vi demo.

## Acceptance cho tích hợp sau khi duyệt

1. Hai menu độc lập, deep-link create/id-detail/id-update, Refresh/Back không sai bản ghi.
2. List dùng Core, hyperlink mã, trạng thái badge và nội bộ table scroll.
3. Từng tab đếm đúng nhóm G, không đếm C/A, search không làm thay đổi tập đã chọn.
4. CRUD/Other nhiều checkbox; unsupported là —; all/row/column đúng scope, tri-state đúng.
5. Tree cha–con đồng bộ; collapse/expand không mất quyền.
6. Create/update save, validation, loading/error, reload/session và unsaved guard.
7. Keyboard/focus, responsive 390/1440; ma trận cuộn ngang trong container.
8. Lint/build/unit selection/store; E2E mỗi style, source catalog consistency và Pages regression.

## Kết quả preview

HTML editable: .sdcorejs/design/wireframes/role-pages/role-pages.html.
PNG: .sdcorejs/design/exports/png/role-pages/{role-list,role-matrix,role-tree,role-mobile}.png.
Đã kiểm tra bằng browser: Other, count tab, tri-state, lưu/reload, tree expand/collapse, validation, confirm bỏ draft, create và containment ở 390px. Cần kiểm chứng lại toàn bộ bằng Core thật sau triển khai; preview không chứng minh Angular runtime/guard/catalog.

Giới hạn preview: danh sách minh họa hiển thị toàn bộ các Role mẫu trong một trang; cột pagination sẽ dùng chức năng thật của Core khi tích hợp. Backend/auth production không thay đổi.
