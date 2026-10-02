# Portal Template · Workspace hồ sơ · Core UI 22.3

## Bản bàn giao

Checkout: `C:\Users\Admin\Documents\Codex\2026-10-02\task-5\portal-template`.
Branch: `codex/core-ui-22-3-playground`, thay đổi chưa commit. Base: `main` tại `2b9e562efe7979b5a5ea910afbf6e097f39360a0`, origin `git@github.com:sdcorejs/portal-template.git`.

Bản gốc ở `C:\Users\Admin\Documents\sdcorejs\portal-template` được giữ nguyên, gồm `.sdcorejs/design/diagnostics/` đang untracked. Không push, PR, merge, deploy, chỉnh auth/security, backend hay dùng Devin.

Pin `@sdcorejs/angular` **22.3.0** và `@sdcorejs/utils` **1.2.5**, giữ Angular **22.1.6**, CLI/build **22.1.7**, TypeScript **6.0.3**. Core yêu cầu utils 1.2.5; dùng chung một bản tránh xung đột type Filter. Peer Angular `^22.0.0` tương thích. Node kiểm chứng **24.19.0**, Chrome Headless **154** trên Annie.

Đã đối chiếu [docs công khai 22.3.0](https://sdcorejs.github.io/sdcorejs-angular/docs/22.3.0/index.json), package npm và source tag `v3.0`, SHA `c9d8469061f9d54a05dd33e99684b9101989404c`. Không nâng Angular major.

## Cách vọc

Chạy `npm ci`, `npm run check:toolchain`, `npm start`. Mở **Utility → Workspace hồ sơ** hoặc `http://localhost:2208/utility/workspace`.

Trên checkout Annie đã cài dependencies và có Node 24 portable, chạy trực tiếp:

```powershell
Set-Location 'C:\Users\Admin\Documents\Codex\2026-10-02\task-5\portal-template'
& '..\runtime\node.exe' 'node_modules\@angular\cli\bin\ng.js' serve --port 2208
```

| Màn | Component thực tế | Thao tác |
| --- | --- | --- |
| `/utility/workspace/queue` | Table, Card/Group, Side Drawer, Form Render, Data State | 24 hồ sơ giả lập; lọc trạng thái, tìm mã/tên bằng Enter, sort cột, paging, chọn hồ sơ pending và duyệt hàng loạt, duyệt riêng; drawer dùng schema lúc gửi; loading/empty/error/retry |
| `/utility/workspace/files` | File Explorer | Cây thư mục/breadcrumb, List/Grid, tìm trong folder, tạo folder, upload/transfer, ảnh SVG preview, text fallback/download, read-only, mô phỏng lỗi/retry, folder trống |
| `/utility/workspace/designer` | Form Builder | Chọn field sửa nhãn/rule/required/layout; palette, Desktop/Tablet/Mobile, undo/redo, Preview/Schema của Core; xuất JSON draft; Áp dụng bản mới hoặc khôi phục draft mẫu |
| `/utility/workspace/request` | Form Render, Upload File, Stepper | Dùng chính schema đã áp dụng; điền mẫu, validation field/form, checkbox gấp mở lý do bắt buộc, đính kèm tối đa 3 file, review read-only, lỗi gửi một lần/thử lại; hồ sơ mới xuất hiện trong queue |
| `/utility/workspace/activity` | History, Audit Diff, Job Progress | Lịch sử thật từ thao tác; before/after duyệt và version/field-count khi publish; export JSON snapshot theo lô, progress, cancel, fail/retry, download chỉ bật khi hoàn tất |

Luồng gợi ý: sửa nhãn trong Designer → **Áp dụng biểu mẫu** → **Thử nhập liệu** → điền mẫu/chọn xử lý gấp → upload brief TXT → review → thử lỗi rồi gửi lại → mở queue duyệt → Activity xem diff và xuất JSON.

File hỗ trợ TXT/JSON/CSV/PDF/PNG/JPG/JPEG/WEBP/SVG, tối đa 5 MB/file. Tất cả bản ghi, file và draft nằm trong bộ nhớ phiên trình duyệt. **Reset workspace** có confirm và khôi phục 24 hồ sơ, 3 file seed, schema v1; reload trang khởi tạo phiên mới. Không có request lưu dữ liệu ra backend. JSON/file tải xuống là dữ liệu của phiên thật.

## Kiến trúc và giới hạn

Feature mới nằm dưới `src/modules/utility/features/workspace/`; lazy route giữ một `WorkspaceStore` dùng chung cho năm màn. Store sở hữu seed, published/draft schema, request snapshots, Blob và lịch sử. Component chỉ sở hữu trạng thái UI, công việc export và navigation. Scoped `SD_UPLOAD_FILE_CONFIGURATION` cũng phục vụ field upload thêm qua Form Builder, dùng cùng kho file cục bộ.

Publish clone draft sang schema đã áp dụng; hồ sơ cũ giữ clone schema/data lúc gửi, nên đổi form không đổi hồ sơ cũ. Table giữ option ổn định và dùng public `reload()` khi dataset/status thay đổi, giữ search/sort. Upload và submit kiểm tra generation khi reset; export dùng AbortController, hủy khi rời màn; object URL được thu hồi khi reset/store destroy. Hai bộ đếm file và hồ sơ độc lập. Upload batch kiểm tra toàn bộ file trước khi ghi.

Sử dụng standalone, OnPush, signals, public secondary entry points, Core layout/style và menu hiện có. Workspace dùng RouterOutlet thường để state và schema handoff theo một parent route. Không tạo shell mới. Route aliases `/utility/file-explorer`, `/utility/form-builder`, `/utility/form-render` trỏ về workspace.

Renderer 22.3.0 đọc page đầu của schema; playground theo giới hạn công khai đó. Seed dùng tám field cùng group, conditional rules và form warning. Checkbox “required” của renderer không phải xác nhận bắt buộc; luồng mẫu dùng required text/select/number/conditional reason. File Explorer không có callback rename/move/delete trong API release này; playground không dựng API giả. TXT/JSON/CSV hiện có metadata + download, preview trực quan đã kiểm chứng bằng SVG. Đây là demo memory-only, không cung cấp persistence hay upload server.

## Coverage và phần còn lại

Đo bằng **direct import entry point trong source**, đối chiếu 39 mục `components/*` của index docs 22.3.0: **20 trước → 25 sau**. File [core-ui-22.3-inventory.json](core-ui-22.3-inventory.json) ghi từng mục before/after. Đây là số nhóm docs/entry point, không phải số class hay tỷ lệ kiểm thử toàn thư viện.

Năm nhóm mới: **File Explorer, Form Generic (Builder + Render), History, Audit Diff, Job Progress**. Table và Upload File vốn có gallery; nay tích hợp vào luồng hồ sơ với hành động và handoff thật. Card, Stepper, Side Drawer, Data State cũng được dùng theo tình huống nghiệp vụ.

14 nhóm chưa có direct demo: API Contract Builder, AutoId Inspector, Breadcrumb, CKEditor Styles, Editor, Highlight, Image Editor, Import Excel, Mini Editor, Operator, Org Chart, Query Builder, Quick Action, Tree. Breadcrumb/Tree/Query Builder có thể được Core dùng bên trong nhưng không tính đã có demo trực tiếp. Gợi ý đợt tiếp theo: Import Excel cho nhập hồ sơ và Org Chart/Tree cho tổ chức; API Contract Builder tách thành playground kỹ thuật riêng.

## Kiểm chứng

| Command | Kết quả |
| --- | --- |
| `npm run check:toolchain`; `npm ls @sdcorejs/angular @sdcorejs/utils @angular/core --depth=1` | Pass; exact versions/peer deduped |
| `ngc -p tsconfig.app.json --rootDir src` | Pass; TS6 cần rootDir tường minh khi chạy compiler độc lập; có warning unused import từ mẫu cũ |
| `npm test -- --watch=false --browsers=ChromeHeadless` | **45/45 pass**, gồm 6 contract test workspace |
| `npm run check:catalog`; `npm run test:catalog` | Pass; 2/2 tests, generated metadata/source current |
| `npm run check:pattern`; `npm run test:pattern` | Pass; 2/2 tests |
| `npm run build` | Pass với configuration `dev` và prebuild export Pattern; CommonJS/budget warnings của dependency/sample có sẵn |
| `npm run test:e2e:workspace` | **7/7 pass**, Chrome một worker, desktop 1440×1000 và mobile 390×844 |
| `npm run test:e2e:pattern -- --grep 'Stepper:'` | **3/3 pass** sau sửa quantity; chạy cùng tests bằng config kiểm chứng port 2218 trỏ đúng isolated checkout, một worker |
| ESLint các source thay đổi | Pass, 0 lỗi/0 warning |
| `npm run lint` toàn repo | **Pass**, 0 lỗi/0 warning; đã sửa duy nhất dòng quantity Stepper bằng `$event === null || $event === undefined`, giữ nguyên hành vi của `== null` |

Sáu store tests kiểm tra reset/seed isolation, schema snapshot, submit failure/attachments và mã tuần tự, pending-only approval/diff, file constraints/atomic batch/folder duplication, abort và reset trong thao tác async. Đã chạy RED trước rồi GREEN.

Bảy browser tests kiểm tra: queue search/status/retry/drawer/keyboard Escape; conditional validation/upload/fail/retry/submit; file upload/folder/search/preview/download/Grid/empty/read-only/retry; sửa nhãn/publish/renderer handoff; export cancel/fail/retry/download; sort/selection/approval/reset; mobile table cards/file browser/stacked form và không overflow ngang trang. Tất cả test đều assert không có console error/runtime exception; Table reload sau render để required input đã được gắn. Core Button chống double click 300 ms; test nhập bàn phím thực tế giữa hai lần thử validation.

Đã sửa fixture unit Page cũ để toàn suite chạy được: thêm `provideRouter([])` cho constructor cần ActivatedRoute; sửa count catalog 14→15 và route 12→13 theo registry/routes hiện có. Không đổi runtime Page. Catalog và guide generated được đồng bộ release 22.3.0. Chưa chạy toàn bộ e2e gallery/Storybook hay production configuration; bằng chứng browser gồm workspace và các luồng Stepper liên quan.

## Hoàn tất lint Stepper

Dòng quantity trong `src/modules/pattern/features/stepper/stepper.component.html` trước đó dùng `== null` để nhận cả null và undefined. Bản sửa dùng `$event === null || $event === undefined ? '' : '' + $event`: null/undefined vẫn thành chuỗi rỗng, 0 vẫn thành `'0'`, số dương vẫn thành chuỗi số. Không tắt rule hay đổi phần khác của template.

Test repeated rows trong `e2e/pattern.spec.ts` bổ sung xóa quantity, blur/validate rồi nhập lại 1; các thao tác thêm/xóa dòng và chuyển review vẫn được kiểm chứng. Toàn repo lint, typecheck, 45 unit tests và dev build đã được chạy lại sau sửa. **3/3 browser test Stepper pass** (validation/draft restoration; async duplicate code/table selection; optional/business branch/repeated rows). Kết quả được ghi cùng inventory thay đổi; bằng chứng workspace 7/7 trước đó và 11 ảnh QA được giữ nguyên.

[core-ui-change-inventory.json](core-ui-change-inventory.json) ghi chính xác danh sách file thay đổi so với base, scope sửa lint và bằng chứng kiểm tra. Inventory component 20→25/39 và 11 ảnh QA trước được giữ nguyên.

## Ảnh QA

Ảnh thật từ Playwright, đã xem bằng công cụ đọc ảnh; drawer preview chờ animation kết thúc trước khi chụp.

- [Queue desktop](screenshots/workspace-queue-desktop.png)
- [Files desktop](screenshots/workspace-files-desktop.png), [preview](screenshots/workspace-files-preview-desktop.png), [empty/read-only](screenshots/workspace-files-empty-desktop.png)
- [Designer đã đổi nhãn](screenshots/workspace-designer-desktop.png)
- [Audit Diff](screenshots/workspace-activity-desktop.png), [Job Progress hoàn tất](screenshots/workspace-export-desktop.png)
- [Queue mobile](screenshots/workspace-queue-mobile.png), [table cards](screenshots/workspace-table-mobile.png), [files mobile](screenshots/workspace-files-mobile.png), [request mobile](screenshots/workspace-request-mobile.png)

Mã nguồn, test, docs, inventory và ảnh nằm trong checkout/patch bàn giao; Node portable chỉ dùng kiểm chứng trên Annie, không nằm trong code patch.
