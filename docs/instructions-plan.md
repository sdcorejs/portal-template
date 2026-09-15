# Kế hoạch nội dung Instructions

Trạng thái: được người dùng duyệt ngày 2026-09-12 với yêu cầu “Duyệt kế hoạch, bắt đầu triển khai”. Đã triển khai TASK-001 đến TASK-008 tuần tự và kiểm chứng; kết quả, giới hạn và các lựa chọn triển khai ghi tại docs/verification.md.

Ngày: 2026-09-12. Phạm vi: module Instructions của portal-template, Angular 22.1.6 / @sdcorejs/angular 22.2.8. Mục tiêu phục vụ developer và consumer/AI bằng hướng dẫn có hình ảnh, code đã kiểm chứng và ví dụ có thao tác.

## 1. Yêu cầu đã thống nhất

- R-001: Instructions tổ chức thành 6 nhóm theo luồng phát triển.
- R-002: Mỗi trang có ảnh tổng quan đầu bài, trước phần hướng dẫn chi tiết.
- R-003: Hướng dẫn có ví dụ minh họa, kết quả mong đợi và UI dễ hiểu.
- R-004: Biên tập theo nguồn Confluence, đối chiếu phiên bản Core đang cài; dùng modules/features, standalone và URL hiện tại.
- R-005: Permission theo thứ tự MODULE → ENTITY → TYPE → ACTION. C là FE, A là BE, G gom các quyền kỹ thuật và được hiển thị cho end user để gán vào Role.
- R-006: Core UI đã được chủ thư viện public; hướng dẫn cài đặt và cấu hình không có bước cấp hoặc nhập khóa kích hoạt.
- INV-001: Không đưa Plop hoặc generator đã bỏ trở lại tài liệu/dependencies.
- INV-002: Giữ các page mẫu và các thay đổi đã review; hướng dẫn liên kết tới demo hiện có.
- INV-003: Không sửa Confluence, thư viện Core, sales-platform hoặc backend trong phạm vi kế hoạch.

## 2. Permission: quy ước bắt buộc

Mẫu mã: `<MODULE>_<ENTITY>_<TYPE>_<ACTION>`. Mã kỹ thuật dùng UPPER_SNAKE_CASE. MODULE, ENTITY và ACTION là các phần bắt buộc; TYPE nằm giữa ENTITY và ACTION theo ví dụ đã xác nhận. Không tự thêm quy ước field/scope nếu chưa chốt.

| Mã | Vai trò | Nơi sử dụng |
| --- | --- | --- |
| CRM_CUSTOMER_C_CREATE | Quyền FE | Kiểm tra quyền truy cập route và hiển thị/thao tác UI tạo khách hàng |
| CRM_CUSTOMER_A_CREATE | Quyền BE | Kiểm tra quyền gọi API tạo khách hàng ở backend |
| CRM_CUSTOMER_G_CREATE | Nhóm quyền nghiệp vụ | Gom hai quyền trên; là lựa chọn gán vào Role trên UI của end user |

```text
Role: Nhân viên kinh doanh
└── Tạo khách hàng                 CRM_CUSTOMER_G_CREATE
    ├── Quyền FE                  CRM_CUSTOMER_C_CREATE
    └── Quyền BE                  CRM_CUSTOMER_A_CREATE
```

UI quản lý Role dành cho end user hiển thị tên nghiệp vụ “Tạo khách hàng”, nhóm theo module/entity; không yêu cầu user chọn riêng FE và BE. Trong instructions dành cho developer, có thể mở phần “Quyền kỹ thuật” để xem G liên kết tới C/A như thế nào.

Ví dụ tương tác dự kiến: chọn/bỏ “Tạo khách hàng” cho một Role giả lập; quan sát tập quyền C/A hiệu lực, nút tạo và kết quả API giả lập thay đổi đồng bộ. Xóa nhóm khỏi Role phải loại quyền do nhóm đó cấp, nhưng không xóa quyền còn được cấp bởi nhóm khác. Mapping demo là dữ liệu cục bộ; cơ chế lưu trữ, cấp token và phân giải quyền ở production không thuộc phạm vi triển khai này. Backend vẫn tự kiểm tra A; trạng thái UI không thay thế việc kiểm tra đó.

Thay các ví dụ trước đây như SALES_CUSTOMER_VIEW, các biến thể dấu chấm/dấu hai chấm và dạng MODULE_TYPE_ENTITY_ACTION trên trang kiến trúc bằng convention mới. Nội dung Confluence dùng P/C không thống nhất sẽ được biên tập theo C cho FE, A cho BE và G cho nhóm quyền đã chốt.

## 3. Menu và nội dung 17 trang

Các route trong bảng là route đề xuất, dưới `/instruction`. Menu group và URL không cần giống tên thư mục vật lý; tái sử dụng feature hiện tại khi phù hợp.

| ID | Nhóm | Trang / route | Ảnh đầu bài | Ví dụ và kết quả người đọc nhìn thấy | Nguồn |
| --- | --- | --- | --- | --- | --- |
| I-01 | Bắt đầu | Tổng quan Portal & Core — `/getting-started/overview` | Bản đồ Portal, Storybook và Pages | Link đến ba bề mặt, giải thích tình huống sử dụng từng nơi | S-05 + repo |
| I-02 | Bắt đầu | Cài đặt và chạy dự án — `/getting-started/setup` | Chuỗi clone → dependencies → start → kết quả | Lệnh đúng scripts hiện tại; ảnh Portal/Storybook chạy thành công và cách nhận biết lỗi | S-05 + repo |
| I-03 | Kiến trúc & tích hợp | Module & Feature — `/architecture` | Portal → Configuration → Module → Feature | Đổi giữa cây thư mục mẫu và source hiện tại; theo dõi một entity | S-01 |
| I-04 | Kiến trúc & tích hợp | Routing & Public API — `/architecture/routing` | URL → lazy route → page; ranh giới index.ts | Chuyển list/create/detail/update với URL có ID; ví dụ import đúng/sai | S-01 |
| I-05 | Kiến trúc & tích hợp | Configuration & API — `/architecture/configuration` | Portal config → token → service → handler | Đổi host giả lập; xem request/response mô phỏng và trạng thái lỗi | S-01, S-04 |
| I-06 | Kiến trúc & tích hợp | Tích hợp module vào Portal — `/architecture/integration` | Module → alias → providers → routes → menu | Checklist từng bước và bộ file ngắn có liên kết; nêu rõ module local và Git submodule | S-04 |
| I-07 | Angular hiện đại | Dependency Injection — `/modern-angular/dependency-injection` | Provider → injector → consumer | So sánh constructor/inject; minh họa phạm vi provider bằng instance ID giả lập | S-03 |
| I-08 | Angular hiện đại | Signals & Component APIs — `/modern-angular/signals` | Input → state → computed → output → parent | Thay số lượng, xem tổng tiền; đổi input, phát output, two-way model và query kết quả | S-03 |
| I-09 | Phân quyền | Permission, Group & Role — `/authorization/model` | Role → G → C/A | Chọn “Tạo khách hàng” cho Role; hiển thị hai quyền hiệu lực trong phần giải thích cho dev | S-06 + R-005 |
| I-10 | Phân quyền | Menu, Route & Action — `/authorization/checks` | C ở UI/route; A ở API | Đổi vai trò giả lập, quan sát menu/nút; minh họa truy cập URL trực tiếp và API bị từ chối | S-06 + R-005 |
| I-11 | Phân quyền | Quyền dữ liệu & Assignment Context — `/authorization/data-scope` | User → nhiệm vụ → bản ghi thuộc phạm vi | Đổi người được giao và record giả lập; thấy dữ liệu hợp lệ/ngoài phạm vi | S-06 |
| I-12 | Coding Conventions | TypeScript & Naming — `/coding-convention/typescript` | Bản đồ tên entity/model/request/event | Đối chiếu trước/sau, input có kiểu, scope biến, async error handling | S-07, S-03 |
| I-13 | Coding Conventions | CSS/SCSS & UI Spacing — `/coding-convention/scss` | Form và view có chú thích padding/gap | Chuyển create/view, hiện lỗi validation; so sánh p-20 gap-8 và p-20 gap-16 | S-08 + review hiện tại |
| I-14 | Coding Conventions | Chất lượng code & Accessibility — `/coding-convention/quality` | Screenshot có chú thích điểm cần sửa | Ví dụ alt, iframe title, table headers, keyboard; code lỗi và kết quả sau sửa | S-09 |
| I-15 | Công cụ & cấu hình | Git & Submodules — `/tooling/git-submodules` | Repo cha → gitlink → repo con → branch/commit | Minh họa trạng thái đồng bộ và checklist trước lệnh; không chạy Git từ UI | S-02 + script hiện tại |
| I-16 | Công cụ & cấu hình | Theme & Design Tokens — `/custom-theme/guide` | Token → component → màn hình | Dùng lại công cụ theme, đổi màu và thấy UI tương ứng; có reset | S-05 + feature hiện tại |
| I-17 | Công cụ & cấu hình | Cấu hình Portal — `/portal-config` | Ba sidebar + sơ đồ cấu hình toàn cục | Dùng lại trang cấu hình: sidebar, ngôn ngữ, định dạng số, tab router | feature hiện tại |

Trang `/custom-theme/tool` tiếp tục được truy cập từ bài Theme. URL `/instroduction` được giữ hoặc chuyển hướng có chủ đích; presentation hiện tại cần được giữ truy cập qua liên kết trong bài Tổng quan để tránh mất nội dung đã có. Giữ các alias hiện tại và cập nhật tiêu đề/icon tab tương ứng.

## 4. Format bắt buộc cho mỗi bài

1. Header ngắn: tiêu đề, mô tả một dòng, phiên bản áp dụng.
2. Ảnh đầu bài: infographic SVG hoặc screenshot có chú thích, chỉ tóm tắt 3–6 ý. Có alt/caption, phóng to bằng thao tác bàn phím/chuột; không dùng một banner lặp cho tất cả bài.
3. Mục tiêu và điều kiện: khi nào dùng, kiến thức/cấu hình cần có.
4. Hướng dẫn: hành động → file/vị trí → code ngắn → kết quả mong đợi. Hình chi tiết đặt cạnh bước liên quan.
5. Ví dụ: preview hiện ngay, điều khiển có nhãn, code tương ứng, nút Reset. Tab chỉ dùng cho preview/code, không chia vụn cả nội dung bài.
6. Lỗi thường gặp: triệu chứng → nguyên nhân → cách sửa; phân biệt nguyên tắc chung và API theo phiên bản.
7. Checklist, bài liên quan, nguồn Confluence và trạng thái kiểm chứng code.

Desktop có mục lục bên phải; mobile dùng nút “Trong trang này”. Header và ảnh không chiếm toàn màn hình; ảnh nhiều chi tiết mở lớn được. Nội dung vẫn có giải thích bằng text. Code dài cuộn trong khối code, không làm tràn trang. Dùng typography/icon/token của Core; section p-20, form gap-8, view gap-16.

Ảnh sơ đồ kiến trúc/quy trình nên dùng SVG để chữ rõ và dễ cập nhật. Ảnh minh họa UI phải chụp từ demo đã chạy; không dùng ảnh dựng để chứng minh hành vi. Nguồn ảnh và phiên bản áp dụng được ghi cùng metadata bài.

## 5. Phạm vi code dự kiến và phần dùng lại

- EDIT `src/modules/instruction/routes.ts`: đăng ký các trang lazy-load, giữ URL cũ phù hợp và đặt redirect cụ thể.
- EDIT `src/app/components/main/main.component.ts`: chỉ phần menu Instructions, chuyển thành 6 nhóm; Pages vẫn ở vị trí đã review.
- CREATE `src/modules/instruction/catalog/instruction-registry.ts`: metadata ID/title/group/route/hero/source/related pages; không đưa toàn bộ nội dung hoặc dependency của các demo vào import eager của menu.
- CREATE `src/modules/instruction/components/instruction-article/`: bố cục bài, mục lục, ảnh phóng to và nguồn/bài liên quan dùng chung.
- CREATE `src/modules/instruction/components/instruction-example/`: khung preview/code/reset; từng demo sở hữu state và hành vi riêng.
- EDIT feature `architecture`, `coding-conventions`, `coding-conventions-typescript`, `custom-theme`, `portal-config`: dùng bố cục mới, sửa ví dụ theo convention đã xác nhận.
- CREATE các page còn thiếu dưới `src/modules/instruction/features/<feature>/pages/`. Feature mới dự kiến: getting-started, modern-angular, authorization, tooling; thêm page vào architecture khi cùng phạm vi.
- CREATE ảnh tại `src/assets/instructions/<article-id>/`, đặt tên theo nội dung; chỉ thêm ảnh thực sự dùng trong bài.
- EDIT `e2e/architecture.spec.ts`; CREATE `e2e/instructions.spec.ts` để kiểm tra menu/route, ảnh và demo; test logic mapping quyền đặt cùng feature authorization.
- EDIT README và docs/verification.md sau triển khai để phản ánh hướng dẫn đang chạy.

Dùng lại SdPage, SdSection, SdAnchor, SdCodeEditor, controls của Core và quy tắc SdTabComponent hiện tại sau khi đối chiếu API cài đặt. Không thêm CMS/Markdown engine, package mới hoặc backend cho thư viện hướng dẫn. Mock demo nằm ở phạm vi page, có reset, không dùng dữ liệu production và không đổi cấu hình phân quyền thật của Portal.

## 6. Thứ tự thực hiện dự kiến

| Task | Nội dung | Phụ thuộc | Kết quả review |
| --- | --- | --- | --- |
| TASK-001 | Đối chiếu 9 nguồn với Core và convention hiện tại; lập danh sách ví dụ cần sửa | Quy ước đã chốt | Mapping nguồn → bài; các quyết định chưa rõ được nêu cụ thể |
| TASK-002 | Chốt thiết kế dùng chung và biên tập hai bài mẫu I-03/I-08; thiết kế ảnh và control demo | TASK-001 | Preview hai bài có ảnh đầu trang và nội dung đại diện |
| TASK-003 | Xây bố cục dùng chung, registry và hai trang mẫu chạy thật | Review TASK-002 | Ảnh phóng to, TOC, code copy, reset; demo Signals thực sự thay đổi UI |
| TASK-004 | Hoàn thành Bắt đầu và Kiến trúc & tích hợp; cập nhật URL/public API | TASK-003 | I-01 đến I-06; không mất URL và demo đang có |
| TASK-005 | Hoàn thành Angular hiện đại và Phân quyền, có mapping G → C/A | TASK-003 | I-07 đến I-11; Role UI chỉ chọn quyền nghiệp vụ G |
| TASK-006 | Biên tập conventions và cấu hình/công cụ; dùng lại các tool hiện tại | TASK-003 | I-12 đến I-17; không còn khuyến nghị/code legacy chưa kiểm chứng |
| TASK-007 | Tích hợp 6 nhóm menu, liên kết bài trước/sau và nguồn; cập nhật tài liệu | TASK-004, TASK-005, TASK-006 | 17 bài truy cập đầy đủ; không có menu rỗng hoặc link chết |
| TASK-008 | Kiểm chứng nội dung, build/lint, demo, keyboard và responsive | TASK-007 | Báo cáo coverage theo các AC bên dưới và ảnh review |

Triển khai tuần tự trong repo hiện tại. Các file menu/routes/registry chỉ được chỉnh sau khi đã đối chiếu working tree để giữ các thay đổi từ phiên review trước. Không commit, push hoặc cài dependency trong phạm vi bản kế hoạch này.

## 7. Acceptance và kiểm chứng

| ID | Yêu cầu | Kết quả mong đợi | Kiểm chứng |
| --- | --- | --- | --- |
| AC-001 | R-001 | 6 nhóm, 17 bài; refresh/deep link/Back hoạt động | E2E menu/route; kiểm tra registry không trùng ID/route |
| AC-002 | R-002 | Mọi bài có ảnh đúng chủ đề trước hướng dẫn; ảnh tải được, có alt/caption và mở lớn | E2E ảnh + review trực quan desktop/mobile |
| AC-003 | R-003 | Mỗi bài có ví dụ và checklist; demo tương tác thay đổi kết quả và Reset về mặc định | E2E từng hành vi đại diện; đối chiếu text/code với preview |
| AC-004 | R-004 | Code runnable đúng Core 22.2.8, đúng modules/features/route; có trace nguồn | Lint/build/typecheck; rà nguồn và snippets trước công bố |
| AC-005 | R-005 | Mã đúng thứ tự MODULE_ENTITY_TYPE_ACTION; Role chỉ chọn G; G_CREATE cấp C_CREATE và A_CREATE | Unit mapping/thu hồi và E2E role simulator |
| AC-006 | R-003 | Keyboard dùng được menu, TOC, zoom, code/reset; không tràn ngang trang ở 390px và 1440px | Browser keyboard và responsive |
| AC-007 | INV-001, INV-002 | Không có hướng dẫn Plop; các Pages và công cụ hiện tại vẫn truy cập được | Tìm tham chiếu runtime + regression các route bị tác động |

Hướng kiểm chứng đề xuất: viết UI rồi kiểm tra theo hành vi; logic phân giải nhóm quyền có unit test độc lập. Chạy npm run lint, npm run build và E2E tập trung Instructions. Chạy lại nhóm regression khác khi source dùng chung/menu/router bị ảnh hưởng; không dùng ảnh mockup thay bằng chứng UI chạy thật.

## 8. Các điểm biên tập phải xử lý

- Package cũ @sd-angular/core, ví dụ NgModule và src/libs: đối chiếu rồi chuyển sang API/version và modules/features hiện tại.
- Permission: R-005 thay thế các ví dụ P/C và thứ tự mã mâu thuẫn trong nguồn; G là lựa chọn nghiệp vụ cho end user.
- TypeScript: nguồn kiến trúc dùng DTO nhưng bài naming đề xuất tên entity; ưu tiên tên trong repo cho ví dụ, nêu khác biệt trước khi ban hành convention rộng hơn.
- CSS: không sao chép khuyến nghị override sâu thành mặc định; kiểm tra API công khai, token và scope style hiện tại.
- Accessibility: xác định alt từ ý nghĩa của ảnh, không từ nơi dữ liệu ảnh được trả về; kiểm chứng các ví dụ semantic HTML.
- Git sync: mô tả đúng script repo, điều kiện working tree và branch; không tự chạy script hoặc mặc định mọi dự án đều có submodule.
- Lệnh và host trong ví dụ dùng placeholder rõ ràng; không sao chép URL hạ tầng, tài khoản hoặc dữ liệu nội bộ không cần thiết từ nguồn.

## 9. Nguồn đã đọc

Nguồn được đọc qua phiên Confluence trên máy ngày 2026-09-12; không chỉnh sửa nguồn. Nội dung viết mới là phần biên tập theo repo hiện tại, không sao chép nguyên bài.

- S-01: [Cấu trúc & Convention Thư viện Angular](https://onemount.atlassian.net/wiki/spaces/om/pages/2581497955)
- S-02: [Đồng bộ Code Tự động — Parent Repo & Submodules](https://onemount.atlassian.net/wiki/spaces/om/pages/3747184643)
- S-03: [Modern Angular — Signals & inject](https://onemount.atlassian.net/wiki/spaces/om/pages/3746889913)
- S-04: [Tích hợp Thư viện vào Portal](https://onemount.atlassian.net/wiki/spaces/om/pages/3749315006)
- S-05: [Internal UI Component Library](https://onemount.atlassian.net/wiki/spaces/om/pages/3756754126)
- S-06: [Kiến trúc Phân quyền Back Office](https://onemount.atlassian.net/wiki/spaces/om/pages/2581922132)
- S-07: [Coding Conventions — Tổng quan](https://onemount.atlassian.net/wiki/spaces/om/pages/2581856504)
- S-08: [CSS/SCSS](https://onemount.atlassian.net/wiki/spaces/om/pages/2581922118)
- S-09: [SonarQube Fix](https://onemount.atlassian.net/wiki/spaces/om/pages/2581856491)
