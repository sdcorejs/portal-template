# Portal Template — Core 22.2.8

Portal Angular gồm thư viện Components/Forms/Services, 14 page nghiệp vụ tương tác và 17 bài Instructions để developer/consumer/AI tham khảo.

## Instructions — 6 nhóm, 17 bài

Mở [Instructions](http://localhost:2208/instructions/getting-started/overview). Mỗi bài có sơ đồ đầu trang (phóng to được), mục tiêu, các bước với file/code/kết quả, ví dụ tương tác mặc định, Reset, code copy, checklist và nguồn Confluence.

| Nhóm | Bài viết |
| --- | --- |
| Bắt đầu | Tổng quan Portal & Core; Cài đặt và chạy dự án |
| Kiến trúc & tích hợp | Module & Feature; Routing & Public API; Configuration & API; Tích hợp module vào Portal |
| Angular hiện đại | Dependency Injection; Signals & Component APIs |
| Phân quyền | Permission, Group & Role; Menu, Route & Action; Quyền dữ liệu & Assignment Context |
| Coding Conventions | TypeScript & Naming; CSS/SCSS & UI Spacing; Chất lượng code & Accessibility |
| Công cụ & cấu hình | Git & Submodules; Theme & Design Tokens; Cấu hình Portal |

Permission bắt buộc theo `MODULE_ENTITY_TYPE_ACTION`: `CRM_CUSTOMER_C_CREATE` (FE), `CRM_CUSTOMER_A_CREATE` (BE), `CRM_CUSTOMER_G_CREATE` (nhóm nghiệp vụ). UI gán Role chỉ chọn nhóm G với nhãn nghiệp vụ. Demo phân giải hợp quyền, giữ quyền giao nhau khi bỏ một nhóm và kiểm tra assignment theo user/record. Các tình huống API/quyền/Git được ghi rõ là mô phỏng; DI và signal APIs là Angular thật.

Core UI công khai; không có bước cấp khóa kích hoạt. Công cụ palette tại `/instructions/custom-theme/tool` và bài trình bày `/instructions/instroduction` được giữ lại. Cấu hình Portal lưu localStorage và áp dụng sau reload; Reset ví dụ chỉ bỏ draft, “Khôi phục mặc định” mới xóa cấu hình đã lưu.

Nội dung và navigation metadata nằm ở `src/modules/instructions/catalog`; mỗi bài có loader riêng, demo nằm trong `features`, shell nằm trong `components`. Registry không import demo. 17 SVG cùng ảnh UI thực tế nằm trong `src/assets/instructions`. Khi thêm bài, cập nhật registry, article/loader và asset; không hard-code thêm một cây menu khác.

Kiểm tra Instructions và các route liên quan, chỉ cần dev server Portal:

```sh
npx playwright test --config playwright.instructions.config.ts
```

Phạm vi kế hoạch và nguồn: [instructions-plan.md](docs/instructions-plan.md). Kết quả chạy thực tế: [verification.md](docs/verification.md).



## Chạy dự án

Dùng Node **24.15+** (đã kiểm tra với 24.19.0), hoặc Node 22.22.3+. Node 22.14 và Node 18 không phù hợp Angular 22. Các phiên bản chính được pin trong package.json và package-lock.json: Core 22.2.8, Angular 22.1.6, CLI 22.1.7, TypeScript 6.0.3, Storybook 10.6.0.

```sh
npm ci
npm run check:toolchain
npm start
```

Mở [Pages](http://localhost:2208/pages). Server mặc định chạy cổng **2208**. Trong terminal khác:

```sh
npm run storybook
```

Mở [Storybook](http://localhost:6006). Portal và Storybook cùng dùng component demo, theme, locale và định dạng số từ src/app/reference-providers.ts.

## Dùng Pages

Pages nằm cuối menu và gồm hai nhóm **List** và **Detail**. Chọn menu con để vào thẳng màn nghiệp vụ; Pages không có thanh Preview/Guide/Data/Source.

- List: khách hàng, đơn hàng, sản phẩm phân cấp, yêu cầu hỗ trợ theo bố cục master–detail.
- Detail: hồ sơ khách hàng, hợp đồng, đơn hàng, danh mục, đối tác và hai ví dụ drawer. Tạo mới từ list hoặc URL create; cập nhật từ detail tương ứng.

Dữ liệu tổng hợp mô phỏng nghiệp vụ gồm 8 loại, 30 bản ghi ban đầu/loại. Dữ liệu đã lưu dùng sessionStorage với key portal-pages:v1:{kind}; còn sau reload và điều hướng trong cùng tab, không dùng backend. Storybook vẫn dùng store độc lập. Tải dữ liệu, mở/tạo hồ sơ, lưu và duyệt đơn hàng có loading ngẫu nhiên 1–2 giây. Tìm kiếm/lọc/sắp xếp dùng dữ liệu của phiên hiện tại. Nội dung chưa lưu được bảo vệ bằng xác nhận trước khi rời form/drawer.

Pages dùng router outlet chuẩn để guard nhận đúng instance. Các demo Components/Forms/Services vẫn hỗ trợ tab-router và đã đăng ký tên/icon qua SdTabComponent. Trong **Instructions → Cấu hình Portal**, chọn sidebar version 1/2/3 và bấm **Lưu & Tải lại** để áp dụng; lựa chọn lưu ở localStorage.

Module Patterns cũ đã được gỡ khỏi source, routes, menu và alias. Các URL Pages cũ được chuyển hướng sang /pages/list/{id} hoặc /pages/detail/{id}.

## Tiêu chuẩn create / detail / update

Mỗi ví dụ giữ cùng một URL gốc; trạng thái màn và ID bản ghi nằm trong path. Ví dụ khách hàng:

| Trạng thái | URL |
| --- | --- |
| List | `/pages/list/list-standard` |
| Create | `/pages/list/list-standard/create` |
| Detail | `/pages/list/list-standard/customer-1/detail` |
| Update | `/pages/list/list-standard/customer-1/update` |

`:id` là ID dữ liệu (`customer-1`), độc lập với mã hiển thị (`CUS-0001`). Create chưa có ID; sau lưu thành công chuyển đến `/:id/detail` của bản ghi vừa tạo. Các mẫu detail, form và drawer áp dụng cùng hậu tố, chẳng hạn `/pages/detail/form-simple/create` và `/pages/detail/drawer-compact/category-1/update`. URL gốc của mẫu detail/form chuyển đến URL detail của bản ghi đầu tiên; ID không tồn tại hiển thị lỗi, không lấy bản ghi khác thay thế.

Header detail: **Chi tiết công ty #CUS-0001**, mã màu primary, tên công ty ở dòng description, badge trạng thái round. Detail chỉ có **Quay lại** và **Cập nhật**. Header create/update chỉ có **Quay lại** (type text, icon arrow_back) và **Lưu** (icon save); không có nút Hủy hoặc diễn giải dấu bắt buộc dưới form. Drawer sử dụng cùng header/action qua các slot public của Core.

URL là nguồn trạng thái qua Angular Router và PageNavigation, không dùng Location.go để đổi URL giả. Cùng route instance được giữ để bảo toàn bộ lọc list; runGuardsAndResolvers always và canDeactivate bảo vệ cả đổi ID/view lẫn browser Back. Form được tạo lại khi ID/view đổi. Lưu lỗi hoặc validation lỗi giữ nguyên URL và bản nháp; lưu thành công về detail. Link mã có href thật để mở trực tiếp hoặc mở tab khác.

## Khoảng cách trong page mẫu

Thân sd-section dùng p-20. Create/update giữ inline error của Core và dùng gap-8 giữa các control/hàng; lưới nhiều cột dùng row-sm gap-y-8 để không cộng gap ngang vào chiều rộng cột. Detail dùng gap-y-16 giữa các hàng thông tin. Áp dụng cùng quy ước cho page và side drawer; tránh thêm margin cuối cột làm khoảng cách bị cộng dồn.

## Bố cục list và bộ lọc Core

List dùng trọn chiều cao vùng làm việc: header chỉ có tiêu đề/hành động, bảng cuộn nội bộ và phân trang ở đáy. Các mẫu tham khảo bố cục XNĐK/HĐMB của sales-platform và dùng API Core 22.2.8 đang cài.

| Màn | Bộ lọc | Score card |
| --- | --- | --- |
| Khách hàng | quickSearch: từ khóa + dropdown trạng thái | Không |
| Đơn hàng | quickSearch + externalFilters: trạng thái/khu vực | Tổng, chờ xử lý, đang hoạt động |
| Sản phẩm phân cấp | externalFilters: tên/trạng thái/khu vực | Không |
| Yêu cầu hỗ trợ | quickSearch + dropdown trạng thái; master–detail | Tổng, chờ xử lý, đang hoạt động |

Quick search và bộ lọc tên sản phẩm áp dụng từ khóa khi Enter; dropdown áp dụng ngay. Các bộ lọc kết hợp AND. Score card thể hiện toàn bộ dữ liệu phiên, cập nhật sau lưu/duyệt và không đổi theo từ khóa. Bảng giữ filter khi mở rồi quay lại từ detail và sau khi lưu/duyệt. Đơn hàng và sản phẩm dùng `type: server` với adapter session nhận paging request chuẩn của Core; mỗi lần truy vấn có loading ngẫu nhiên 1–2 giây. Adapter áp dụng filter/sort/paging bằng dữ liệu trong phiên. Bảng cây giữ dòng cha làm ngữ cảnh cho các dòng con khớp bộ lọc. Các list local áp dụng quickSearch ngay trong bộ nhớ.

Các bảng list và các list mở drawer dùng `sdTableCellDef="code"` để hiển thị hyperlink ở cột mã; nhấn liên kết để mở hồ sơ, không có command xem chi tiết ở cuối hàng. Cột trạng thái `values` dùng `useBadge` của Core: khách hàng `tag`, đơn hàng `round`, sản phẩm/yêu cầu hỗ trợ `icon`; hai drawer dùng `round` và `tag`. Màu và icon biểu đạt cùng một trạng thái trên tất cả màn.

## Chọn mẫu bằng dữ liệu

Đọc [catalog guide](docs/page-patterns.md), [catalog JSON](public/catalog/page-patterns.v1.json) và [source bundle](public/catalog/page-pattern-sources.v1.json). Metadata có ID, route, Core version, shape, fields, relationships, suitableWhen/avoidWhen, components chính, trạng thái và source. Bundle chứa cả base classes, components con, service của Pages và src/styles/reference.scss. Import stylesheet này cùng theme Core khi dùng lại các mẫu.

Ví dụ: dữ liệu phẳng có mã/tên/trạng thái → list-standard; dữ liệu parentId → list-grouped-tree; header + lines[] cần tổng tiền → form-line-items và detail-related-records; thao tác ngắn cần giữ danh sách → drawer-compact. Thay DTO, validation và service demo theo hợp đồng module; không suy ra quyền hoặc API từ fixture.

Sau khi sửa pattern/registry, chạy npm run export:catalog. Catalog được đọc mà không bootstrap Angular. npm run check:catalog phát hiện source/guide đã cũ.

Hai mẫu Role tại `/pages/list/roles-matrix` và `/pages/list/roles-tree` minh họa gán quyền theo tab module bằng ma trận CRUD/Other hoặc bảng cha–con. Xem [hướng dẫn Role](docs/role-pages.md) để tái sử dụng component, store và quy tắc chọn quyền.

## Kiểm tra và build

```sh
npm run lint
npm test -- --watch=false --browsers=ChromeHeadless
npm run test:catalog
npm run check:catalog
npm run test:e2e
npm run build
npm run build-storybook
```

Browser test dùng Google Chrome qua Playwright channel chrome; cài Chrome trên máy chạy test. Playwright tự khởi động hoặc dùng lại portal:2208 và Storybook:6006. Static Storybook ở storybook-static/, portal build ở dist/. Các target dev/qc/uat/prod hiện có giữ nguyên cấu hình môi trường và budget.

Xem [Storybook inventory](docs/storybook.md) và [bằng chứng kiểm tra](docs/verification.md).

## Kiến trúc module / feature

Trang **Instructions → Kiến trúc & tích hợp → Module & Feature** tại `/instructions/architecture` có infographic và cây thư mục chuyển giữa blueprint nghiệp vụ/source hiện tại. Routing, cấu hình, tích hợp và phân quyền có bài riêng với liên kết liên quan.

```text
src/
├── app/                     # Host: menu, layout, cấu hình
├── modules/                 # Trước đây là src/libs
│   └── <module>/
│       ├── features/        # Entity hoặc nhóm demo
│       │   └── <entity>/
│       │       ├── pages/
│       │       ├── components/
│       │       ├── services/  # <entity>.model.ts + <entity>.service.ts
│       │       └── routes.ts
│       ├── configurations/
│       ├── services/        # Dùng chung trong module
│       ├── guards/
│       ├── routes.ts
│       └── index.ts         # Public API
└── shared/                  # Demo inventory và Storybook helpers
```

Các nhóm demo Components, Forms, Instructions, Services, Utilities nằm trong `features/` của module tương ứng. Pages đổi `patterns/` thành `features/`; `components`, `data`, `catalog`, `reference` giữ ở cấp module vì dùng chung giữa các mẫu. Chỉ tạo các thư mục tùy chọn khi có nội dung. URL Portal và ID Storybook được giữ nguyên.

Khi tạo module/entity, tham khảo cây thư mục và các page mẫu hiện có. Entity routes dùng `''`, `create`, `:id/detail`, `:id/update`. Module công bố cấu hình và routes qua `index.ts`; Portal không deep import feature.
