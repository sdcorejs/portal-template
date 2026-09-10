# Record header, actions và URL — 2026-09-10

Lượt sửa mới nhất theo yêu cầu người dùng. Các phần bên dưới là bằng chứng lịch sử.

- Header detail dùng RecordHeaderComponent: Chi tiết + loại hồ sơ + #code màu primary, tên ở description, status badge round. Bỏ Tạo mới khỏi detail. Quay lại dùng type text và arrow_back; Cập nhật có icon edit.
- Header create/update có Quay lại và Lưu với icon save; bỏ diễn giải dấu bắt buộc, bỏ nút Hủy và nhóm action cuối form. Drawer dùng cùng quy ước qua sdHeaderLeft/sdHeaderRight; khóa action khi đang chuyển màn/lưu.
- Mỗi URL gốc có /create, /:id/detail, /:id/update. ID là data ID độc lập mã hiển thị. Link code có href thật. PageNavigation yêu cầu Angular Router chuyển trạng thái; PageReference đọc param, load đúng record, không reset list instance khi đổi view.
- Route matcher dùng cùng route config và runGuardsAndResolvers always; canDeactivate bảo vệ thay đổi params và browser Back. Form được tạo lại khi mode/ID đổi. Save thành công đi đến detail của ID vừa lưu; ID không có trong session hiển thị lỗi thay vì lấy hồ sơ khác.
- Catalog có recordRoutes cho cả 12 mẫu; README và guide ghi tiêu chuẩn URL/header/actions cho consumer/AI.

| Kiểm tra | Kết quả |
| --- | --- |
| Unit | 28/28 PASS, portal-record-unit.log |
| Lint | PASS, portal-record-lint-final.log |
| Portal build | PASS, portal-record-build-final.log |
| Catalog export/test/check | PASS 2/2, JSON/source/guide đồng bộ |
| URL detail/create/update, save/reload, browser Back và missing ID | 11 case có bằng chứng PASS: 7 ở portal-record-e2e.log và 4 ở portal-record-targeted.log |
| Link 6 màn, session CRUD, list filter return, line totals, drawer dirty/focus, mobile header | 12/12 PASS, portal-record-regression.log |
| Cuộn cuối form trên mobile 320/390 px vẫn thấy nút Lưu | 2/2 PASS bổ sung, portal-record-header-scroll.log |
| Review trực quan | Screenshot desktop detail/create và mobile detail/create 320/390 px |

Không tính lượt lỗi là pass: một case form-simple timeout với thời gian log bất thường rồi chạy lại đạt; thao tác Back liên tiếp ở drawer trong lúc view đang chuyển được sửa bằng disable theo operation, đồng thời test chờ nội dung detail sẵn sàng. Lỗi soạn test trung gian được sửa trước lượt chạy xác minh. Không chạy lại toàn bộ Storybook; runtime stories không thay đổi, chỉ đồng bộ source/catalog tĩnh.

Fingerprint source/config/test (347 file): b255288756b11c9e62bf4f6e1fcb5da1864e48808caec7ceaaea3c51895930fc. Logs tại %TEMP%. Approved spec/plan giữ nguyên; không đổi Core/dependencies, không commit/push/deploy.

---

# Hyperlink và status badge — 2026-09-10

Lượt sửa mới nhất theo hai yêu cầu của người dùng. Bằng chứng phía dưới thuộc các lượt trước.

- Bỏ command xem chi tiết trên 4 list và 2 list mở drawer. Cột code dùng ng-template sdTableCellDef, hyperlink có focus visible và kích hoạt bằng Enter. Drawer khôi phục focus về hyperlink khi đóng.
- Cột values trạng thái dùng Core useBadge: tag cho khách hàng/liên hệ, round cho đơn hàng/danh mục, icon cho sản phẩm/yêu cầu hỗ trợ. Tất cả dùng chung ánh xạ title/color/icon; không dựa riêng vào màu.
- Portal build PASS; lint PASS. 11 kịch bản E2E có bằng chứng PASS: 3 bộ lọc trong portal-links-e2e.log và 8 link/badge/detail/drawer/selection trong portal-links-verified.log. Review screenshot đủ ba type.
- Lượt E2E đầu có selector has bị scope nhầm từ root table nên không tìm thấy dòng để kiểm tra badge; đã sửa locator tương đối, chạy lại 8/8 đạt. Không sửa hành vi ứng dụng để né assertion.
- Catalog test/check PASS 2/2; source, guide, public catalog đồng bộ. Storybook runtime không rebuild trong lượt này, chỉ cập nhật source/catalog tĩnh. Unit 28/28 là bằng chứng của lượt trước; không chạy lại cho thay đổi trình bày này.

Fingerprint source/config/test (343 file): cd2f3f81a83b9afc3ca6ebbc7b7250b8132dfe2e37c06ca60c59f5f36aa608d0. Log %TEMP%: portal-links-build-final.log, portal-links-lint.log, portal-links-e2e.log, portal-links-verified.log. Không commit/push/deploy.

---

# List/detail — đối chiếu sales-platform, 2026-09-10

Lượt sửa mới nhất theo yêu cầu người dùng. Các mục bên dưới là bằng chứng lịch sử của phiên bản trước.

- Tham khảo read-only các màn listing XNĐK/HĐMB và detail HĐMB trong portal-sales-platform. Header list chỉ giữ tiêu đề/hành động; vùng list chiếm 100% chiều cao, bảng cuộn nội bộ và paginator ở đáy.
- Khách hàng: quickSearch từ khóa + dropdown. Đơn hàng: quickSearch + externalFilters + score card. Sản phẩm: externalFilters và cây cha/con. Yêu cầu hỗ trợ: quickSearch + score card + master–detail.
- Core 22.2.7 local chỉ tự xử lý column filter/quickSearch. Đơn hàng và sản phẩm dùng server option với adapter session nhận paging request chuẩn, áp dụng FilterUtilities.match, sort và paging; loading truy vấn ngẫu nhiên 1000–2000 ms. Cây giữ cha của dòng con khớp để thể hiện ngữ cảnh.
- Option của list giữ identity khi dữ liệu đổi; reload nguồn qua API public để giữ filter sau lưu/duyệt. Score card tính toàn bộ dữ liệu phiên. Detail gom tên/mã/trạng thái trên header, dùng tab có label/icon.

| Kiểm tra | Kết quả |
| --- | --- |
| Portal build và lint cuối lượt | PASS, exit 0 |
| Unit | 28/28 PASS, portal-list-unit-isolated.log |
| Catalog test/check | 2/2 PASS; source bundle chứa adapter |
| Quick search, external kết hợp, external-only, 3 detail, filter khi quay lại, selection/sort/duyệt | 8/8 PASS, portal-list-adapter-tests.log |
| Chiều cao desktop 1280×720/mobile 390×844, 6 loại list | 12 trường hợp có bằng chứng PASS qua các lượt; 4 trường hợp order/tree chạy lại sau adapter đều PASS, portal-list-height-final.log |
| Review UI | Màn order desktop/mobile và detail tabbed qua UI/screenshot |

Các lỗi trung gian đã được xử lý: test paginator của tree khi chỉ có 5 nhóm; test click vào trigger bị floating label che (click bề mặt mat-form-field bằng pointer, không force); externalFilters chưa áp dụng vào local source; option bị tạo lại làm mất filter. Unit test gọi setQuery cũ được thay bằng kiểm tra identity của option; Chrome ping timeout ở lượt chạy đồng thời, chạy lại riêng đạt 28/28.

Storybook runtime không build lại trong lượt này; 50 story PASS thuộc lượt trước. Chỉ đồng bộ catalog/source tĩnh vào storybook-static. Portal dist được build mới. Không sửa Core/node_modules, dependencies hoặc sales-platform; không commit/push/deploy.

Fingerprint source/config/test hiện tại (341 file): f2109c4a5ed01c055dfa608724c67fbf61bc7e97b3b07bf27368ae7e848e31f7. Log nằm tại %TEMP%; bản approved spec/plan giữ nguyên.

---

# UI corrections — phản hồi ngày 2026-09-10

Đây là lượt sửa theo yêu cầu mới của người dùng; kết quả phía dưới mục “Báo cáo trước thay đổi” chỉ là lịch sử, không xác nhận phiên bản hiện tại.

- Bổ sung wrapper padding cho 166 section thiếu khoảng cách; bỏ CSS config-item/demo-page-body bị lặp ở các demo. Input được kiểm tra bằng UI thật; control dùng hết chiều rộng panel.
- Xóa module Patterns (14 file), routes, menu, alias. Pages ở cuối menu, hai nhóm List/Detail với 12 màn nghiệp vụ; URL cũ chuyển hướng.
- Bỏ giao diện Preview/Guide/Data/Source khỏi Pages. Catalog/source vẫn là tài liệu tĩnh cho consumer/AI.
- Session repository theo loại hồ sơ; create/update và duyệt tập chọn ghi sessionStorage. Reload/điều hướng dùng lại dữ liệu. Delay ngẫu nhiên 1000–2000 ms cho tải/mở/tạo/lưu/duyệt; filter/sort trên dữ liệu trong bộ nhớ.
- Sidebar config dùng union public Core 22.2.7, hỗ trợ version 1/2/3. 53 route component đăng ký tên/icon bằng SdTabComponent; tab chi tiết có label/icon theo nội dung.
- Review bố cục: bỏ khung lồng nhau của panel cấu hình, thống nhất padding 20px/16px mobile, điều chỉnh độ rộng cột và vùng bảng. Giữ theme và thành phần Core; không sửa node_modules.

Kiểm chứng hiện tại:

| Kiểm tra | Kết quả |
| --- | --- |
| Portal build | PASS |
| Storybook static build | PASS, 50 story |
| Lint | PASS |
| Unit | PASS, 24/24 (chạy lại riêng sau một lượt Chrome ping timeout) |
| Catalog export/test/check | PASS, 2/2; metadata route và source bundle đồng bộ |
| Portal E2E | 25/28 đạt lượt đầu; 3 case đã sửa đạt ở lượt targeted (session CRUD, tổng dòng hàng, sidebar V1); sidebar V2/V3 cũng chạy lại đạt |
| Tab-router title/icon | PASS sau sửa selector để tách icon nội dung khỏi icon đóng tab |
| Storybook render | PASS, Forms/input và toàn bộ 50 story; không có runtime exception |
| Responsive | PASS 320/390/768/1024/1440 px |

Các lượt lỗi được giữ trong log: duplicate live-status (đã bỏ aria-live ở wrapper), test đọc session trước async save hoàn tất (đổi sang chờ màn detail), selector sidebar V1 và icon đóng/nội dung. Test route cũ được thay bằng kiểm tra đầy đủ 12 route có guard cùng redirect tương thích. Không coi log thất bại là pass.

Fingerprint hiện tại (338 source/config/test files): f6d6a720d21979927b19934f77b262791e1f7e1a686976e9266cbba0f0fb73f2. Bộ spec/plan đã duyệt trước đó giữ nguyên; yêu cầu sửa của người dùng là nguồn cho hành vi Pages mới. Log tại %TEMP%: portal-feedback-unit-final.log, portal-feedback-lint-final.log, portal-feedback-build-final.log, portal-feedback-storybook-build.log, portal-feedback-e2e.log, portal-feedback-targeted.log, portal-feedback-storybook-tests.log.

Không thay dependencies hoặc sales-platform. Không commit/push. Browser zoom 200% vẫn chưa được xác minh; responsive test không thay thế kiểm tra zoom.

Kiểm tra bổ sung: loading dùng inert bảo vệ nội dung nhưng làm mất activeElement trước khi Core mở drawer. Hai drawer ghi nhớ nút kích hoạt trước async wait và phục hồi focus khi sdClosed; CASE-DRAWER chạy lại đạt (portal-feedback-focus-fixed.log). ESLint hai component đạt; build portal chạy lại sau sửa. Unit store và 50 story không phụ thuộc vào thay đổi focus này. Gói source tĩnh Storybook được đồng bộ lại từ exporter sau sửa drawer; runtime stories không đổi.

## Báo cáo trước thay đổi

# Verification — Portal Core 22.2.7

Ngày kiểm tra: 2026-09-10. Owner: portal-template. Base HEAD: 4f8d01818005dd7a5925dc6d46e7bfefb271242f; thay đổi hiện ở working tree, chưa commit/push/deploy.

Approved plan: ../.sdcorejs/plans/angular/2026-09-10-portal-reference-core22.md

Plan approval hash: sha256:v1:b9af48e96cb99c7a32d2b56aca4f3bb9d71f3668ef11229720124beff4134024

Source fingerprint (SHA-256): c52e105b8cbbfea01d40363b2dd6216331bcce366d2976a8163324a60d2a89f2. Fingerprint lấy path + NUL + bytes + NUL của 351 file đã sắp xếp thuộc src/, .storybook/, scripts/, e2e/, package manifests, angular/tsconfig và Playwright config. Docs/build outputs không nằm trong fingerprint.

## Môi trường và kết quả

Windows; Node 24.19.0; Chrome Headless 152; Core chính xác 22.2.7; Angular 22.1.6; CLI/build 22.1.7; TypeScript 6.0.3; Storybook 10.6.0; Playwright 1.63.0.

| Kiểm tra | Kết quả |
| --- | --- |
| npm ci trong thư mục mới từ hai manifest/lockfile của repo | PASS, exit 0; không force/legacy-peer-deps |
| npm ls --all --json | PASS, exit 0; không invalid peer |
| npm run check:toolchain | PASS |
| npm test -- --watch=false --browsers=ChromeHeadless | PASS, 21 test |
| npm run test:catalog | PASS, 2 test |
| npm run check:catalog | PASS; JSON, source bundle và guide khớp registry |
| npm run lint | PASS, exit 0 |
| npm run build | PASS, exit 0 |
| npm run build-storybook | PASS, exit 0; static index có 50 story |
| npm run test:e2e | Lượt toàn bộ: 30 PASS / 1 FAIL trong test CASE-CREATE; sau sửa đồng bộ test, CASE-CREATE PASS 3/3 lượt. Tổng cộng 31 kịch bản có bằng chứng pass qua các lượt, gồm render 50 story; chưa chạy lại toàn bộ suite sau sửa test. |
| npm audit --json | 10 moderate; 0 high/critical |

Các lượt sửa lỗi trước không được tính là pass: lỗi selector của test drawer, toolbar co chiều rộng, routing CanDeactivate và một lượt bị HMR reload giữa lúc nhập form đã được xử lý/kiểm tra lại. Một lượt Karma bị disconnect khi thay global fake clock; test cleanup chuyển sang timer thực có giới hạn, và bộ 21 test sau đó đạt. Test không được mô tả là toàn bộ đã làm RED-first: fixture có bằng chứng RED→GREEN; một số regression tests được bổ sung sau implementation.

## Đối chiếu acceptance criteria

| Tiêu chí / logical case | Bằng chứng thực thi |
| --- | --- |
| AC-001 / case-ac-001 | Clean lockfile install; exact toolchain check; dependency tree; portal build |
| AC-002 / case-ac-002 | Static Storybook build; CASE-STORYBOOK-ALL đối chiếu live index với DEMO_INVENTORY; 47 source entries, 50 story |
| AC-003 / case-ac-003 | Component playgrounds; DataStates/ReferenceTabs/ReadOnlyFields; service harness lifecycle/reset tests; local upload adapter |
| AC-004 / case-ac-004 | CASE-REFLOW 1440/1024/768/390/320 kiểm tra bounds field và overflow; xem UI thật desktop/mobile/drawer |
| AC-005 / case-ac-005 | 12 CASE-PATTERN routes; catalog uniqueness; CASE-CREATE/BACK và drawer flows; legacy route registrations preserved |
| AC-006 / case-ac-006 | CASE-TAB-STATE giữ filter qua Guide/Source/Preview; CASE-LIST-RETURN; per-instance DemoHost |
| AC-007 / case-ac-007 | Query tests; CASE-SELECTION giữ ID sau sort, reset selection khi page/filter đổi; list-return |
| AC-008 / case-ac-008 | CASE-SAVE/CREATE/LINES/DIRTY-NAV/DRAWER-DIRTY; store validation, duplicate/stale update, immutable code; create→update không tạo trùng |
| AC-009 / case-ac-009 | 30 record/domain, deterministic fixture/reset; CASE-STATE và reflow; mixed-length names, large amounts, missing optional fields |
| AC-010 / case-ac-010 | Pure registry; 2 exporter tests; check:catalog; guide + source bundle and live catalog |
| AC-011 / case-ac-011 | Keyboard drawer open/close, focus restore; manual Tab loop; reduced-motion drawer test; primary button contrast 6.46:1. **Browser zoom 200% chưa xác minh**: shortcut của in-app browser không đổi zoom; không coi viewport test là bằng chứng zoom thật. |
| AC-012 / case-ac-012 | Build/lint/unit; 12 route smoke + 50 story render; Vietnamese number display; Pages dùng outlet chuẩn, tùy chọn tab router còn cho các demo khác |

Các browser test mang tag case-ac-xxx tương ứng để chạy bằng selector trong plan. Tags là nhóm bằng chứng, không biến một smoke assertion thành kiểm thử mọi nhánh của component. Chưa tuyên bố chứng nhận WCAG hoặc bao phủ toàn bộ API của Core.

## Review và sửa lỗi

Read-only review đối chiếu kiến trúc đã duyệt: route/reference điều phối; pure registry tách Angular loaders; store theo scope component; các vùng facts, related records, grouped fields và line editor dùng lại được; stories dùng component thật và cấu hình UI chung. Tài liệu/source catalog không chứa runtime function hoặc phụ thuộc bootstrap app.

Các sửa đã xác minh: Core 22 public type imports và section/drawer API; permission PUBLIC cho demo routes/menu; Pages dùng router outlet chuẩn để guard nhận đúng instance; guard không bỏ qua khi thiếu component; form cancel/back có hành vi ở cả page độc lập và embedded; store save giữ ID sau create; line add/remove đánh dấu dirty trước phát event; drawer tránh lặp page header; nút primary dùng fill/primary; loading harness dọn đúng target và timer khi unmount; Storybook storySort dùng literal inline để manager tạo index; cấu hình playground xếp nhãn/field theo chiều dọc, kiểm tra lại trên Docs canvas. CASE-CREATE chờ success mới sau mỗi save và tôn trọng Core click throttle 300ms; chạy lặp 3 lần đạt. Source bundle bổ sung src/styles/reference.scss.

Rà soát phạm vi: 240 file thay đổi, không có file ngoài kế hoạch; mọi path của plan đã tồn tại. git diff --check đạt sau dọn trailing whitespace. Approved artifact/hash được giữ nguyên và execution preflight vẫn hợp lệ.

Credential-pattern scan trên diff không tìm thấy private key/token mới theo các mẫu được kiểm tra. Đây là scan có giới hạn, không phải cam kết quét mọi loại secret. Không đổi sales-platform, package Core, môi trường/auth credentials, hoặc Node hệ thống.

## Cảnh báo và giới hạn

- Initial portal bundle khoảng 2.14 MB, vượt warning budget 500 kB nhưng dưới ngưỡng lỗi; giữ nguyên budgets. Page-builder legacy khoảng 7.25 kB SCSS, vượt warning 4 kB. Có cảnh báo unused standalone imports/CommonJS từ demo/dependency graph.
- 10 moderate trong dependency graph gồm uuid/qs và chuỗi phụ thuộc Core/exceljs hoặc Storybook/dev-server. Không áp forced downgrade Storybook hay override major transitive để che audit.
- Dữ liệu và save là phiên cục bộ; không có backend/auth production. Bulk action minh họa tập chọn, không thực hiện nghiệp vụ cập nhật hàng loạt.
- Kiểm tra browser bằng Chrome; zoom 200% còn là bước UAT thủ công. Rủi ro này được ghi rõ, không đánh dấu toàn bộ accessibility acceptance đã hoàn tất.
- Working tree nằm trên main; không phát hành verdict cho commit/merge/push. Không có Git handoff hoặc publication trong phạm vi lượt này.

## Tái hiện

Dùng các lệnh ở README. E2E ghi HTML report ở playwright-report/ và screenshots/traces trong test-results/ (đều ignored); rerun sẽ thay report trước đó. Docs/wireframes dưới .sdcorejs/design/ là handoff thiết kế; screenshots browser test mới là bằng chứng UI chạy thật.

Log kiểm tra tại %TEMP%: portal-unit-final21.log, portal-e2e-completion.log (30 pass/1 fail trước sửa test), portal-create-final.log (3 pass sau sửa), portal-lint-close.log, portal-build-close.log, portal-storybook-final.log. Chỉnh sau unit/full E2E là CSS, exporter stylesheet và đồng bộ test; không đổi logic save/store.
