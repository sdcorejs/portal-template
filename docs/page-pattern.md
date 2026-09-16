# Page patterns — Core 22.2.8

Generated from the pattern registry. Demo data is synthetic and scoped to one mounted reference; replace the service boundary for production.

## Role / Ma trận quyền — roles-matrix

Quản lý vai trò và gán quyền nhóm theo module bằng ma trận CRUD và Other.

- Phù hợp: So sánh nhanh CRUD theo chức năng; các hành động bổ sung nằm trong Other.
- Không phù hợp: Cần cấp quyền người dùng thực hoặc thực thi phân quyền backend.
- Shape: permission-matrix; container: page
- Route: /page/role/matrix
- Create: /page/role/matrix/create
- Detail: /page/role/matrix/:id/detail
- Update: /page/role/matrix/:id/update
- Source: src/modules/page/features/role/pages/role-list-page.component.ts, src/modules/page/features/role/pages/role-record-editor.component.ts, src/modules/page/features/role/components/role-permission-editor.component.ts, src/modules/page/features/role/components/permission-matrix.component.ts, src/modules/page/features/role/data/role-session.store.ts
- Fields: code, name, status

## Role / Quyền phân cấp — roles-tree

Quản lý vai trò và gán quyền nhóm theo module bằng bảng cha–con.

- Phù hợp: Duyệt nhiều quyền với tên dài; cần thu gọn hoặc mở rộng từng chức năng.
- Không phù hợp: Cần cấp quyền người dùng thực hoặc thực thi phân quyền backend.
- Shape: permission-tree; container: page
- Route: /page/role/tree
- Create: /page/role/tree/create
- Detail: /page/role/tree/:id/detail
- Update: /page/role/tree/:id/update
- Source: src/modules/page/features/role/pages/role-list-page.component.ts, src/modules/page/features/role/pages/role-record-editor.component.ts, src/modules/page/features/role/components/role-permission-editor.component.ts, src/modules/page/features/role/components/permission-tree.component.ts, src/modules/page/features/role/data/role-session.store.ts
- Fields: code, name, status

## List / Standard — list-standard

Tra cứu khách hàng bằng quickSearch, từ khóa và trạng thái trên một hàng gọn.

- Phù hợp: Tra cứu khách hàng bằng quickSearch, từ khóa và trạng thái trên một hàng gọn.
- Không phù hợp: Dữ liệu phân cấp sâu; nhiều thao tác phụ thuộc quan hệ.
- Shape: flat; container: page
- Route: /page/company
- Create: /page/company/create
- Detail: /page/company/:id/detail
- Update: /page/company/:id/update
- Source: src/modules/page/components/status-badge.ts, src/modules/page/features/list-standard/list-standard.component.ts, src/modules/page/features/list-standard/list-standard.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## List / Advanced filter — list-advanced-filter

Quản lý đơn hàng với quickSearch, externalFilters và score card theo dữ liệu phiên.

- Phù hợp: Quản lý đơn hàng với quickSearch, externalFilters và score card theo dữ liệu phiên.
- Không phù hợp: Danh sách rất ngắn chỉ cần tìm nhanh.
- Shape: filterable; container: page
- Route: /page/order
- Create: /page/order/create
- Detail: /page/order/:id/detail
- Update: /page/order/:id/update
- Source: src/modules/page/components/status-badge.ts, src/modules/page/data/table-query.ts, src/modules/page/features/list-advanced-filter/list-advanced-filter.component.ts, src/modules/page/features/list-advanced-filter/list-advanced-filter.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## List / Grouped tree — list-grouped-tree

Tra cứu danh mục phân cấp với externalFilters của Core.

- Phù hợp: Tra cứu danh mục phân cấp với externalFilters của Core.
- Không phù hợp: Mạng quan hệ nhiều-nhiều hoặc dữ liệu không có cha/con.
- Shape: hierarchical; container: page
- Route: /page/product
- Create: /page/product/create
- Detail: /page/product/:id/detail
- Update: /page/product/:id/update
- Source: src/modules/page/components/status-badge.ts, src/modules/page/data/table-query.ts, src/modules/page/features/list-grouped-tree/list-grouped-tree.component.ts, src/modules/page/features/list-grouped-tree/list-grouped-tree.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## List / Master–Detail — list-master-detail

Xử lý yêu cầu với quickSearch, score card và vùng chi tiết độc lập bên cạnh.

- Phù hợp: Xử lý yêu cầu với quickSearch, score card và vùng chi tiết độc lập bên cạnh.
- Không phù hợp: Biểu mẫu dài cần không gian làm việc riêng.
- Shape: sequential; container: page
- Route: /page/ticket
- Create: /page/ticket/create
- Detail: /page/ticket/:id/detail
- Update: /page/ticket/:id/update
- Source: src/modules/page/components/status-badge.ts, src/modules/page/features/list-master-detail/list-master-detail.component.ts, src/modules/page/features/list-master-detail/list-master-detail.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## Detail / Overview — detail-overview

Xem thông tin chính và một vài nhóm thuộc tính.

- Phù hợp: Xem thông tin chính và một vài nhóm thuộc tính.
- Không phù hợp: Có nhiều bảng liên quan cần tách tab.
- Shape: flat; container: page
- Route: /page/customer
- Create: /page/customer/create
- Detail: /page/customer/:id/detail
- Update: /page/customer/:id/update
- Source: src/modules/page/features/detail-overview/detail-overview.component.ts, src/modules/page/features/detail-overview/detail-overview.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## Detail / Tabbed — detail-tabbed

Tách nhóm nội dung và dữ liệu liên quan theo tác vụ đọc.

- Phù hợp: Tách nhóm nội dung và dữ liệu liên quan theo tác vụ đọc.
- Không phù hợp: Người dùng cần đối chiếu mọi trường cùng lúc.
- Shape: relational; container: page
- Route: /page/contract
- Create: /page/contract/create
- Detail: /page/contract/:id/detail
- Update: /page/contract/:id/update
- Source: src/modules/page/features/detail-tabbed/detail-tabbed.component.ts, src/modules/page/features/detail-tabbed/detail-tabbed.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## Detail / Related records — detail-related-records

Đọc bản ghi chính cùng các dòng hàng để đối chiếu.

- Phù hợp: Đọc bản ghi chính cùng các dòng hàng để đối chiếu.
- Không phù hợp: Child records có nghiệp vụ hoàn toàn độc lập.
- Shape: parent-lines; container: page
- Route: /page/order/related-record
- Create: /page/order/related-record/create
- Detail: /page/order/related-record/:id/detail
- Update: /page/order/related-record/:id/update
- Source: src/modules/page/features/detail-related-records/detail-related-records.component.ts, src/modules/page/features/detail-related-records/detail-related-records.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## Form / Simple — form-simple

Nhập nhanh một nhóm trường có cùng ý nghĩa.

- Phù hợp: Nhập nhanh một nhóm trường có cùng ý nghĩa.
- Không phù hợp: Thông tin có nhiều nhóm hoặc dòng con.
- Shape: flat; container: page
- Route: /page/category
- Create: /page/category/create
- Detail: /page/category/:id/detail
- Update: /page/category/:id/update
- Source: src/modules/page/features/form-simple/form-simple.component.ts, src/modules/page/features/form-simple/form-simple.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## Form / Sections — form-sections

Chia nhóm trường theo nội dung và thứ tự làm việc.

- Phù hợp: Chia nhóm trường theo nội dung và thứ tự làm việc.
- Không phù hợp: Thao tác chỉ có một hoặc hai trường đơn giản.
- Shape: sectioned; container: page
- Route: /page/partner
- Create: /page/partner/create
- Detail: /page/partner/:id/detail
- Update: /page/partner/:id/update
- Source: src/modules/page/features/form-sections/form-sections.component.ts, src/modules/page/features/form-sections/form-sections.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## Form / Line items — form-line-items

Lưu header và các dòng con trong một giao dịch.

- Phù hợp: Lưu header và các dòng con trong một giao dịch.
- Không phù hợp: Dòng con có vòng đời hoặc API lưu độc lập.
- Shape: parent-lines; container: page
- Route: /page/order/line-item
- Create: /page/order/line-item/create
- Detail: /page/order/line-item/:id/detail
- Update: /page/order/line-item/:id/update
- Source: src/modules/page/features/form-line-items/form-line-items.component.ts, src/modules/page/features/form-line-items/form-line-items.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts
- Fields: code, name, status

## Drawer / Compact — drawer-compact

Xem và sửa ngắn tại danh sách, giữ ngữ cảnh phía sau.

- Phù hợp: Xem và sửa ngắn tại danh sách, giữ ngữ cảnh phía sau.
- Không phù hợp: Chỉnh sửa dài hoặc cần URL làm việc riêng.
- Shape: flat; container: side-drawer
- Route: /page/category/side-drawer
- Create: /page/category/side-drawer/create
- Detail: /page/category/side-drawer/:id/detail
- Update: /page/category/side-drawer/:id/update
- Source: src/modules/page/components/status-badge.ts, src/modules/page/features/drawer-compact/drawer-compact.component.ts, src/modules/page/features/drawer-compact/drawer-compact.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts, src/modules/page/features/drawer-pattern-base.ts
- Fields: code, name, status

## Drawer / Sections — drawer-sections

Chỉnh sửa vài nhóm thông tin trong ngữ cảnh danh sách.

- Phù hợp: Chỉnh sửa vài nhóm thông tin trong ngữ cảnh danh sách.
- Không phù hợp: Nhiều quan hệ hoặc bảng lồng nhau làm drawer quá dài.
- Shape: sectioned; container: side-drawer
- Route: /page/contact
- Create: /page/contact/create
- Detail: /page/contact/:id/detail
- Update: /page/contact/:id/update
- Source: src/modules/page/components/status-badge.ts, src/modules/page/features/drawer-sections/drawer-sections.component.ts, src/modules/page/features/drawer-sections/drawer-sections.component.html, src/modules/page/reference/page-navigation.ts, src/modules/page/components/record-header.component.ts, src/modules/page/features/drawer-pattern-base.ts
- Fields: code, name, status
