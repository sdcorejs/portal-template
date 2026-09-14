---
approval_source: "user-request-to-implement-reviewed-design-and-push"
approved_at: "2026-09-14T02:58:21.620Z"
approved_by: "user"
artifact_id: "interactive-page-patterns-spec-r1"
artifact_kind: "spec"
change_ref: "interactive-page-patterns"
commit_policy: "with-change"
contract_id: "interactive-page-patterns"
owner: "sdcorejs-angular"
owner_module_id: null
owner_repository_id: "github.com/sdcorejs/portal-template"
owner_repository_role: "portal"
parent_references: []
parent_repository_id: null
repository_relative_path: ".sdcorejs/specs/angular/2026-09-14-interactive-page-patterns.md"
requirement_id: "interactive-page-patterns"
schema_version: 1
source_revision: "532cef8090a44576e54eab88d7619c59817bf598"
stack_profile: "core-ui-angular"
supersedes: null
track: "angular"
approval_hash: "sha256:v1:9ddf1812cf140f8ea76a50240f8ac5422c662d361b3e064fc5c39304d6663019"
---
# Phạm vi thực hiện đã xác nhận

Người dùng yêu cầu “Implement giúp mình sau đó đẩy lên toàn bộ để mình check tiếp trên máy khác” sau khi đã xem bản 36 biến thể. Đây là tiếp tục thực hiện thiết kế, quy tắc và trình tự đã trình bày trong cuộc trao đổi. Các chữ draft/chờ duyệt trong trích dẫn dưới đây ghi lại trạng thái trước yêu cầu thực hiện; không tạo một đợt xin duyệt mới.

# Module Patterns — Tiêu chuẩn giao diện và code tham khảo

## Trạng thái

Bản exploratory draft theo yêu cầu ngày 13/09/2026, đã chỉnh theo yêu cầu tiếp theo: đưa bộ tiêu chuẩn vào module **Patterns**, bao gồm header, table, score card, câu chữ button, form page và side drawer create/update/detail. Vị trí module và sáu nhóm là yêu cầu trực tiếp; danh sách biến thể chi tiết là đề xuất. Chưa có approved spec/plan cho phần mở rộng này. Phần code Angular trong portal là đầu ra bắt buộc của công việc, chưa được thay thế bởi HTML hay tài liệu.

[Mở bản mẫu tương tác](../wireframes/interactive-page-patterns/pattern-lab.html) · [Định hướng](../decisions/interactive-page-patterns.md) · [Luồng](../flows/interactive-page-patterns.md)

## Module và hệ thống điều hướng

Module đích: `src/modules/patterns/` (new, chưa triển khai). Route gốc `/patterns`; sidebar Patterns cùng cấp Pages/Components/Forms/Instructions. Mặc định mở `/patterns/headers`.

Mỗi trang có: tên nhóm/mục đích → danh sách biến thể → preview rộng → quy tắc sử dụng → source thật. Source Angular cuối cùng gồm imports, TS/HTML/SCSS và data/query liên quan; không dùng snippet rút gọn thay cho code chạy. Prototype hiện hiển thị markup thật và ghi rõ source HTML wireframe, không tự nhận là Angular.

| Nhóm | Route | Biến thể đề xuất |
| --- | --- | --- |
| Header | `/patterns/headers` | Title đơn; title + mô tả; detail có back; title + status; nhóm actions; create/update |
| Table | `/patterns/tables` | Tra cứu cơ bản; quick search + filter; selection + bulk; phân cấp; dòng liên quan; loading/empty/no-results/error |
| Score card | `/patterns/scorecards` | Metric chỉ đọc; icon cạnh nhãn; icon trong nền màu; icon trạng thái; icon + click-filter; count để filter; progress; so sánh hai kỳ; compact |
| Button & câu chữ | `/patterns/buttons` | CRUD; search/filter; workflow; nguy hiểm; pending/error/retry |
| Form trên page | `/patterns/forms` | Một cột; hai cột; sections; header + dòng hàng; detail label/value |
| Side drawer | `/patterns/drawers` | Create; update; detail; nhiều section; dirty-close |
| Ghép thành page | `/patterns/compositions` | Listing scorecards; card grid; work queue; overview |

36 biến thể nền tảng và 4 mẫu phối hợp. Score card có 9 biến thể, gồm 4 mẫu sử dụng icon được bổ sung theo yêu cầu. Các page nghiệp vụ hiện có trong Pages tiếp tục làm ví dụ tổng thể; phần thêm mới này thuộc Patterns. Components/Forms tiếp tục demo API riêng lẻ của Core; Patterns giải thích cách dùng chúng trong ngữ cảnh.

## Header, button, form và drawer

### Header

- Title là tên nhiệm vụ/entity, không nhét toàn bộ metadata vào heading. Mô tả tối đa một câu ngắn giải thích phạm vi, không lặp title.
- Detail có back và mã/tên hồ sơ. Back phục hồi query và vị trí, không mặc định đi browser history sang domain ngoài.
- Status cùng hàng title nhưng wrap khi hẹp; nhãn status không chỉ biểu diễn bằng màu.
- Header có một primary action. Create/update dùng tên thao tác; lưu đặt một nơi thống nhất (footer nếu form dài), không tạo hai primary CTA độc lập.
- Khi tích hợp, dùng slots của SdPageComponent và record-header tương thích. Wireframe dùng header HTML thuần.

### Câu chữ và hierarchy của button

| Ngữ cảnh | Primary | Secondary | Pending |
| --- | --- | --- | --- |
| Create | Tạo liên hệ / Tạo đơn hàng | Hủy | Đang tạo… |
| Update | Lưu thay đổi | Hủy | Đang lưu… |
| Detail | Chỉnh sửa | Đóng / Quay lại danh sách | Không áp dụng |
| Filter có submit | Áp dụng bộ lọc | Xóa bộ lọc | Đang tải… |
| Workflow | Gửi duyệt / Duyệt đơn hàng | Từ chối khi phù hợp | Đang xử lý… |
| Xác nhận xóa | Xóa đơn hàng | Giữ lại | Đang xóa… |

Nhãn phải phản ánh đúng hành vi. Live search không cần thêm nút Tìm kiếm dư thừa. Nút chỉ icon phải có accessible name. Action nguy hiểm tách primary thông thường và xác nhận bằng tên đối tượng/hậu quả. Chặn double-submit; lỗi giữ input và cho retry. Prototype button nguy hiểm chỉ minh họa câu chữ xác nhận, không xóa record thật.

### Form page

One-column cho thông tin ngắn; two-column chỉ cho trường ngắn; description/note chiếm cả dòng. Sections chia theo ý nghĩa, không chia đều máy móc. Header + line items có thêm/xóa dòng, quantity/unitPrice hợp lệ và tổng tính lại. Detail hiển thị label/value thay vì input disabled.

Create/update dùng cùng cấu trúc và validation; update prefill, dirty so sánh với snapshot. Validation hiển thị cạnh trường; summary dẫn tới lỗi đầu tiên khi nhiều section. Lưu thành công cập nhật mock store của phiên; lưu lỗi giữ input. Prototype page form chỉ thử layout, validation và phản hồi lưu; persistence minh họa đầy đủ ở drawer. Không coi page form prototype là CRUD hoàn chỉnh.

### Side drawer

Create: input rỗng, Tạo liên hệ/Hủy. Update: prefill đúng record, Lưu thay đổi/Hủy. Detail: label/value, Chỉnh sửa/Đóng; không có Lưu. Cùng header/body/footer, body scroll riêng, footer luôn nhìn thấy. Drawer 480–640px gọn; 640–800px cho vài nhóm; mobile toàn chiều rộng khả dụng.

Đóng bằng X/Đóng/Hủy/Escape đi qua cùng guard. Pristine đóng ngay và trả focus. Dirty hỏi Tiếp tục chỉnh sửa/Bỏ thay đổi; không mất input. Saving khóa gửi lặp và đóng; save error giữ input, retry không tạo duplicate. Lưu thành công cập nhật mock record và danh sách liên quan. Record phức tạp hoặc nhiều tab ưu tiên page.

## Component map cho module Patterns

| Thành phần dự kiến | Vai trò/state | Reuse và ranh giới |
| --- | --- | --- |
| `patterns/routes.ts`, `patterns/index.ts` | Lazy routes và public entry | Theo cấu trúc modules hiện có |
| `patterns/catalog/pattern-catalog.ts` | ID, nhóm, route, use/avoid, source paths | Metadata tĩnh; không runtime render theo prompt |
| `patterns/components/pattern-preview/` | Preview, rules, source tabs | Dùng chung presentation, không sở hữu form/query state |
| `patterns/features/headers/` | Biến thể header | Core SdPageComponent/record-header làm nguồn tham chiếu |
| `patterns/features/tables/` | Biến thể table/query/selection | SdTable; xác minh filter API đúng version trước code |
| `patterns/features/scorecards/` | Count/metric/progress/comparison | Presentation inputs + selection output; dữ liệu và query ở host |
| `patterns/features/buttons/` | Câu chữ/hierarchy/async states | SdButton, confirm service hiện có |
| `patterns/features/forms/` | Layout form, field validation, draft | Reactive forms/Core inputs; feature-local editor |
| `patterns/features/drawers/` | Mode, opener focus, beforeClose, saving | SdSideDrawer/unsaved changes; reuse form/facts cùng feature |
| `patterns/features/compositions/` | Ghép các pattern thành màn | Query/session scope theo page; không một monolith đa mode |

Tất cả path mới là `new/candidate`, chưa ghi source. Main sidebar ở `src/app/components/main/main.component.ts`; route host ở `src/app/app.routes.ts`. Không quảng bá component lên Core package chỉ để làm demo. Bộ source/catalog riêng của Patterns không thay đổi schema Pages nếu không cần.

## Bằng chứng hiện trạng

- `src/modules/pages/features/list-standard/list-standard.component.ts`: `ListPatternBase`, `DemoSessionStore`, `SdTable`, quick search code/name, external filters, duyệt tập chọn.
- `features/list-advanced-filter/list-advanced-filter.component.html`: score card hiện là `dl/div`, chưa có event hay selected state.
- `catalog/page-examples.ts`, `pattern-registry.ts`, `pattern-loaders.ts`, `routes.ts`: 12 pattern gốc và hai mẫu role. Dùng registry để hướng dẫn/chọn mẫu.
- `reference/page-reference.component.ts`: khởi tạo session và điều hướng record. Không tự thêm dashboard vào PAGE_EXAMPLES nếu khiến nó bị coi là detail và redirect sang record.
- `src/styles.scss`, `src/styles/reference.scss`: Core theme và CSS variables đã có. API table áp filter từ bên ngoài chưa xác minh; không bịa tên method.
- Shell/core và docs cũ là nguồn tương thích, không phải approval cho phạm vi mới.

## Mẫu phối hợp bên trong Patterns

| ID / route dự kiến | Bố cục và nhiệm vụ | Tương tác bắt buộc |
| --- | --- | --- |
| `list-scorecards` · `/patterns/compositions/list-scorecards` | Đơn hàng: KPI → quick search → filter chips → bảng | Click card, AND search/khu vực, reset, sort, pagination, mở detail |
| `list-card-grid` · `/patterns/compositions/list-card-grid` | Hồ sơ đối tác: nhận diện theo card; metadata ngắn, không ép so sánh nhiều cột | Search, trạng thái, khu vực, sort, pagination, mở drawer/detail |
| `list-work-queue` · `/patterns/compositions/list-work-queue` | Hàng đợi ba giai đoạn Chờ xử lý/Đang xử lý/Hoàn tất | Search, mở record, đổi trạng thái có feedback, chống double-submit |
| `overview-operations` · `/patterns/compositions/overview-operations` | Tổng quan vận hành: tổng số/giá trị/tiến độ → phân bố → danh sách cần chú ý | Metric/drill-down mở listing đúng filter; không thêm thư viện chart |

Wireframe dùng cùng bộ 24 đơn hàng tổng hợp để đối chiếu kết quả giữa bố cục. Khi tích hợp, card-grid dùng fixture đối tác riêng phù hợp ý nghĩa card; các test semantics dùng ID ổn định. Bốn mẫu mới bổ sung cho list/tree/master-detail/detail/form/drawer hiện có, không nhân bản mọi CRUD.

## Hợp đồng score card

### Mẫu sử dụng icon

| ID | Cấu trúc | Tình huống |
| --- | --- | --- |
| `icon-inline` | Icon outline 20–24px cạnh nhãn, giá trị bên dưới | Card gọn, nhận diện chỉ số nhanh |
| `icon-tile` | Icon 24px trong ô nền 44px ở góc phải; nhãn/giá trị ở trái | Tổng quan nhiều nhóm chỉ số |
| `icon-status` | Clock / processing / check, nền và chữ theo trạng thái | Phân biệt bước xử lý, có mô tả ngắn |
| `icon-filter` | Icon + count + selected indicator trong một button | Click/Enter/Space lọc bảng ví dụ; chọn lại về Tất cả |

Icon không thay nhãn; icon decorative dùng `aria-hidden=true` và không nhận focus. Chỉ button card nhận focus/click. Count/selection không phụ thuộc màu; metric chỉ đọc không có hover biểu thị thao tác. Ô nền dùng màu nhạt, stroke đủ tương phản; giá trị là thông tin nổi bật nhất. Desktop ba card chỉ số hoặc bốn card lọc; tablet hai cột; mobile một cột cho nhóm metric icon, nhóm filter theo responsive scorecards hiện có.

Wireframe dùng SVG outline nội tuyến không tải font/package mới. Angular cuối cùng tái sử dụng hệ icon có sẵn của Core/Material theo API đã kiểm chứng, không mang bộ icon song song vào portal. Icon gợi ý: receipt/orders, customers, payments, schedule, sync, check_circle; tên export cụ thể vẫn cần kiểm tra đúng package version.

1. Ba biến thể: **count filter** (số bản ghi theo trạng thái, có click), **metric** (giá trị tiền, không tương tác nếu không có drill-down thật), **progress** (hoàn tất/tổng, phần trăm có mẫu số rõ).
2. Count filter gồm Tất cả, Chờ xử lý, Đang xử lý, Hoàn tất. Một lựa chọn tại một thời điểm; chọn lại card đang chọn về Tất cả. Dùng button + aria-pressed, hỗ trợ Enter/Space. Màu + dấu chọn + dòng “Đang lọc” cùng biểu thị lựa chọn.
3. Count lấy từ toàn bộ dataset của session, trước search/khu vực và trước pagination. Ghi rõ “Thống kê toàn bộ … bản ghi”. Nhãn kết quả bên dưới thể hiện số sau lọc. Không làm count biến mất khi chọn card.
4. Card có count 0 vẫn chọn được để minh họa no-results. Empty dataset thì count=0, progress=0%, không chia cho 0. Loading hiển thị skeleton/placeholder; error không hiển thị 0 như dữ liệu thật.
5. Prototype có thể cập nhật trạng thái qua queue; count và progress phải tính lại từ cùng dataset.

## Hợp đồng query

`visible = records.filter(status).filter(normalizedSearch).filter(region)` rồi sort ổn định theo ID phụ, cuối cùng mới paginate. Search code/tên, trim, không phân biệt hoa thường/dấu tiếng Việt. Kết hợp điều kiện AND. Search không sửa record gốc.

Đổi status/search/region/sort/pageSize → pageIndex=0, xóa selection current-page. Chips có thể xóa từng điều kiện, “Xóa bộ lọc” trả về mặc định. Sort đổi chiều, pagination không mất filter. Detail đóng giữ query và trang; đổi pattern/reset demo mới reset có chủ ý. Một store query sở hữu state, không duy trì hai bộ filter ở toolbar riêng và SdTable.

## Implementation component map

Các path `confirmed` dưới đây tương đối với `src/modules/pages/`, là nguồn tái sử dụng đã đọc. Các path `new` là tên gợi ý của mẫu phối hợp, đặt dưới `src/modules/patterns/features/compositions/` theo component map module ở trên khi lập plan. `candidate` là API chưa kiểm chứng.

| Vùng | Component/path | Quyết định | State owner | Trạng thái |
| --- | --- | --- | --- | --- |
| Shell/header | SdPageComponent; shell hiện tại | reuse | app shell | confirmed |
| Dữ liệu demo | `data/demo-session.store.ts`, `data/models.ts` | extend khi phù hợp | session theo route | confirmed |
| Score cards | `features/interactive-patterns/components/scorecard-strip.component.*` | create_feature_local | input counts, output status | new |
| Query toolbar | `features/interactive-patterns/components/pattern-query-bar.component.*` | create_feature_local, Core inputs | store query của page | new |
| Query logic | `features/interactive-patterns/data/pattern-query.ts` | pure function dùng trong query store | không state | new |
| Listing | `features/list-scorecards/list-scorecards.component.*` | compose, reuse SdTable | route page/query store | new |
| Card results | `features/list-card-grid/list-card-grid.component.*` + card collection | create_feature_local | route query, output open | new |
| Queue | `features/list-work-queue/list-work-queue.component.*` + queue column | create_feature_local | route store; pending theo record | new |
| Overview | `features/overview-operations/overview-operations.component.*` | compose metric + breakdown | session metrics | new |
| Record detail/edit | `reference/page-navigation.ts`, detail/form/drawer hiện tại | reuse | navigation/session/form | confirmed |
| Table external filtering | SdTable option/filter API | inspect installed declarations before implementation | table hoặc query adapter duy nhất | candidate |
| Catalog/source | `catalog/*`, export script | extend registry; source thật | metadata tĩnh | confirmed |

Không export feature components ra package Core. Không sửa Core repository. Không tạo backend, auth hay quyền nghiệp vụ mới.

## Data and interaction map

| Component | Receives | Emits | Data source | Loading/error owner |
| --- | --- | --- | --- | --- |
| Scorecard strip | counts, selected status, loading | selectStatus | metrics toàn session | page/session |
| Query bar | search, region, chips | changeQuery, clearFilter | query store | page |
| Result table/grid | sorted page, total, selection | open, sort, paginate, select | query selector | page/session |
| Queue column | records, status, pending IDs | open, transition | session | page; lỗi theo record |
| Overview | totals, breakdown, attention list | drillDown(status) | cùng fixture/session | page |
| Detail/drawer | recordId | close/save | session record | existing editor/store |

## States và accessibility

| State | Kết quả |
| --- | --- |
| data | Hiển thị record, counts nhất quán |
| loading | Placeholder giữ chiều cao; busy; không thao tác dữ liệu chưa sẵn sàng |
| empty | “Chưa có dữ liệu mẫu”; khôi phục dataset, không nhầm với không khớp query |
| no-results | “Không có kết quả phù hợp”; query vẫn còn và có nút xóa lọc |
| error | Message + thử lại; retry giữ filter |
| permission-denied | Thông báo giới hạn truy cập; không hiển thị dữ liệu, không giả lập auth thật |
| saving/success/error | Nút pending disabled, kết quả aria-live; lỗi giữ record/form |

Native button/link, labels đầy đủ, focus ring 2px, table headers, số căn phải, status không chỉ dùng màu, polite live region cho result count. Dialog Escape/close trả focus về opener. Không dùng div click được hay drag-only. Layout 1440/1024/768/390/320; cuộn ngang chỉ trong table region, card-grid xuống một cột, queue xếp dọc. Header/search wrap, zoom 200%, không hide dữ liệu cần hành động.

## Tiêu chí nghiệm thu đề xuất

| ID | Kết quả cần kiểm chứng |
| --- | --- |
| IP-01 | Click card pending chỉ còn pending; Enter/Space tương đương click; toggle về Tất cả |
| IP-02 | Status + search + region cho giao tập đúng; search không dấu; tổng card không đổi theo query |
| IP-03 | Sort/filter/pageSize reset page và selection; pagination hiển thị đúng tập không trùng/lọt |
| IP-04 | Count=0 và dataset=[] không crash; no-results có reset; error retry giữ query |
| IP-05 | Mở/đóng detail giữ search/filter/page/focus; không mất dữ liệu khi save lỗi |
| IP-06 | Queue transition đổi đúng một record, cập nhật metrics, không gửi lặp, có success/error |
| IP-07 | Overview drill-down tới listing có filter đúng, chỉ số có đơn vị/phạm vi, không bịa trend |
| IP-08 | Bốn pattern có route/menu/catalog/source chính xác; tab source trỏ file thật, copy có imports |
| IP-09 | Build và lint phần thay đổi; unit test query + browser test người dùng; responsive và keyboard |
| IP-10 | Sidebar Patterns và sáu route nền tảng, 36 biến thể có use/avoid/source chính xác; Pages hiện có vẫn truy cập được |
| IP-11 | Header title/detail/status/description/actions/editing không mất title hoặc che actions ở mobile |
| IP-12 | Button label đúng mode; disabled khi pending, retry sau lỗi; xác nhận nguy hiểm ghi đối tượng và hậu quả |
| IP-13 | Form one/two-column/sections/lines/readonly, validation và tổng dòng đúng, lỗi lưu giữ input |
| IP-14 | Drawer create/update/detail, prefill, save/retry, dirty-close, focus return, body scroll/footer ổn định |
| IP-15 | Selection current-page + indeterminate + bulk; tree expand/collapse; reset query xóa selection |
| IP-16 | Bốn mẫu scorecard icon; icon decorative không nhận focus, metric không có hành động giả, card filter Enter/Space/toggle đúng tập bản ghi; responsive 320–1440 |

## Trình tự code để thực hiện sau khi duyệt

1. Chốt spec/plan/architecture phạm vi mới từ bản này, không sửa approved snapshot cũ.
2. Đồng bộ dependencies theo lockfile bằng runtime tương thích: node_modules local hiện còn Core 20.0.1 trong khi package.json/lockfile yêu cầu 22.2.8. Không dùng API package cũ làm bằng chứng cho bản mới.
3. Tạo module Patterns, routes/menu/catalog/preview shell; implement header/button/scorecard rồi table/query/selection theo Core đúng version.
4. Implement form/editor/facts và drawer create/update/detail; sau đó ghép listing/card-grid/queue/overview bằng feature-local components.
5. Hoàn thiện source TS/HTML/SCSS thực tế; không iframe HTML wireframe vào portal để thay mã mẫu. Route Patterns độc lập, không rơi vào record redirect của Pages. Kiểm tra metadata/source không drift.
6. Build, query tests, browser test tương tác, responsive/keyboard. Báo kết quả và điểm chưa kiểm chứng; không deploy/commit tự động.

## Open decision

Người dùng đã xác định module Patterns, sáu nhóm và yêu cầu thêm scorecard có icon. Bản 36 biến thể và bốn composition là phạm vi chi tiết đang đề xuất trước Angular integration. Dùng dữ liệu mock; không cần backend thật.
