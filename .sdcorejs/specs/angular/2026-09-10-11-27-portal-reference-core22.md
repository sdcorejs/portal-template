---
acceptance_criteria_count: 12
approval_source: "explicit-user-choice"
approved_at: "2026-09-10T04:28:07.935Z"
approved_by: "user"
artifact_id: "spec-portal-reference-core22-r1"
artifact_kind: "spec"
change_control: {"change_reason":null,"revision":1,"supersedes":null}
change_ref: "portal-reference-core22"
commit_policy: "with-change"
contract_id: "portal-reference-core22"
execution_host_repository_id: "github.com/sdcorejs/portal-template"
manual_criteria_count: 5
owner: "sdcorejs-spec"
owner_module_id: null
owner_repository_id: "github.com/sdcorejs/portal-template"
owner_repository_role: "portal"
parent_references: []
parent_repository_id: null
profile_confidence: "high"
redaction_applied: true
repository_relative_path: ".sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md"
requirement_id: "portal-reference-core22"
schema_version: 1
sourceDraftPath: ".sdcorejs/docs/angular/2026-09-10-11-22-portal-reference-core22-spec.md"
source_plan: "none"
source_revision: "4f8d01818005dd7a5925dc6d46e7bfefb271242f"
source_spec: "none"
stack_profile: "core-ui-angular"
supersedes: null
target_root_kind: "target-project"
track: "angular"
approval_hash: "sha256:v1:0e2aa4f9c75d4684529518d14c71f23f03054757dcea67bb5d0a30d93f52fe1b"
---
# Portal reference Core 22.2.7 — Đặc tả đã duyệt

> Người dùng duyệt toàn bộ bản dự thảo bằng phản hồi “duyệt”. Các nhãn “đề xuất/chờ duyệt” trong phần trích nguyên văn dưới đây phản ánh thời điểm soạn; phạm vi và mặc định đã được xác nhận. Snapshot bất biến.

## Nội dung đã duyệt (nguyên văn)

# Đặc tả — Portal reference với Core 22.2.7

## Vấn đề và mục tiêu

Consumer và AI cần xem, thử và chọn được cách trình bày một module/entity theo cấu trúc dữ liệu thực tế. Portal phải cung cấp component, form, service và page mẫu nhất quán, có tên ổn định, source tham khảo và tiêu chí chọn mẫu. Mẫu phải hữu ích khi chuyển sang một domain khác, không phụ thuộc nghiệp vụ sales-platform.

Đây là bản dự thảo để duyệt phạm vi. Người dùng đã xác nhận Core `22.2.7`, nguồn tham khảo sales-platform và bố cục 1 cho Pages. Số lượng mẫu, phạm vi Storybook và các mặc định dưới đây là đề xuất của bản dự thảo, chưa phải quyết định được duyệt.

## Bằng chứng hiện trạng

- `package.json`: Angular 20.3.x, `@sdcorejs/angular ^20.0.1`, npm lockfile; chưa có Storybook.
- `src/app/app.routes.ts`: Components, Forms, Services, Utilities, Instructions và Patterns; có `patterns/list/base` và `patterns/page-builder`.
- `src/main.ts`, `src/app/configurations/*`: bootstrap standalone, shell và cấu hình locale/format; các auth guard hiện là demo.
- Metadata npm đã kiểm tra: Core `22.2.7` yêu cầu Angular/Material 22 và Node `^22.22.3 || ^24.15.0 || ^26.0.0`. Runtime shell hiện là Node `22.14.0`, chưa đáp ứng.
- Metadata `@storybook/angular@10.6.0` cho phép Angular `>=18 <23`; đây là ứng viên, cần kiểm chứng build tích hợp trước khi chốt trong plan.
- Tài liệu Core đúng phiên bản đã truy xuất: `https://sdcorejs.github.io/sdcorejs-angular/docs/22.2.7/index.json`. API chỉ được coi là xác minh sau khi đối chiếu package/source đúng phiên bản.
- Sales-platform ở `C:/Users/nghiatt15_onemount/Documents/mag/portal-sales-platform`, dùng `@sd-angular/core ^19.0.33`. Tham khảo source list khách hàng, detail chính sách chiết khấu/khoản phải thu, form đại lý và drawer cấu hình. Các nhận xét hiện dựa trên source, chưa phải kiểm chứng giao diện chạy thực tế.

## Yêu cầu

- R-001 — Nâng portal lên Core chính xác `22.2.7`, đồng bộ framework/toolchain tương thích.
- R-002 — Cung cấp Storybook cho Components, Forms và Services, có ví dụ tương tác và tài liệu sử dụng.
- R-003 — Đồng nhất shell, layout và quy tắc UI/UX; tham khảo sales-platform và điều chỉnh theo Core hiện tại.
- R-004 — Có mục Pages với các loại list, detail/create/update dạng page và side-drawer, đặt tên rõ ràng.
- R-005 — Mỗi mẫu giúp consumer/AI chọn và tái sử dụng theo dữ liệu module/entity, có dữ liệu mẫu cân đối và hướng dẫn lựa chọn.

## Quyết định đã xác nhận

- D-001 — Core đích: `@sdcorejs/angular@22.2.7`; nguồn: phản hồi trực tiếp của người dùng.
- D-002 — Tham khảo sales-platform tại máy local; tái thiết kế theo Core hiện tại được phép. Sales-platform chỉ là nguồn tham khảo, portal-template là nơi triển khai.
- D-003 — Pages dùng bố cục 1: preview rộng, tài liệu đặt ở tab. Phản hồi `1` chọn phương án có nhãn `1. Preview rộng · Hướng dẫn ở tab`; không suy diễn thành chấp thuận phối hợp hai bố cục.

## Phạm vi đề xuất để duyệt

### Nền tảng và migration

Pin Core `22.2.7`, nâng Angular/Material/CDK và build/lint/test tooling theo peer dependencies đã kiểm chứng; cập nhật lockfile và tài liệu runtime. Dùng runtime tương thích cho dự án, ưu tiên runtime sẵn có hoặc runtime biệt lập; không thay Node hệ thống như một tác dụng phụ. Không dùng `--force`/`--legacy-peer-deps` để che lỗi tương thích.

Sửa imports, providers, stylesheet và API cũ trong các demo bị ảnh hưởng. Giữ khả năng cấu hình ngôn ngữ, number format và tab router. Routes cũ được giữ hoặc redirect rõ ràng sang mẫu tương đương; `patterns/page-builder` vẫn truy cập được, không tự biến thành công cụ sinh page mới.

### Storybook và các demo

Storybook là công cụ chạy/build riêng trong cùng repository. Portal là điểm duyệt tài liệu/page mẫu. Hai nơi chia sẻ ví dụ, fixtures và theme khi có thể; không duy trì hai bản logic demo khác nhau.

Phạm vi ban đầu bao phủ mọi demo hiện có trong Components, Forms, Services. Các UI primitive mới dùng trong Pages phải có story tương ứng. Không mặc định bao phủ toàn bộ exported API của Core 22.2.7; lập bảng inventory `covered / not-applicable / deferred` và nêu rõ phần chưa bao phủ.

- Components: button, avatar, badge, upload, drawer, table, preview image/PDF, splitter, query bar, modal, section, anchor và các biến thể hiện có.
- Forms: input, number, select, textarea, date/datetime, chip/calendar, radio, checkbox, switch và validation.
- Services: notify, loading, confirm và các biến thể nhập dữ liệu; bổ sung demo unsaved changes khi sử dụng trong page/drawer mẫu.
- Mỗi nhóm có overview, import/source thực tế, input/output hoặc method, trường hợp sử dụng và trạng thái áp dụng. Controls chỉ xuất hiện cho thuộc tính hỗ trợ tương tác.
- Service stories dùng harness tương tác, hiển thị kết quả/cancel/error rõ ràng; reset state giữa các story. Upload/PDF dùng asset giả lập trong dự án, không yêu cầu backend hoặc thông tin đăng nhập thật.
- Layout demo thống nhất vùng tiêu đề, preview, controls, tài liệu; Controls có thể nằm dưới preview. Không áp bố cục 2 cho các nhóm này khi người dùng chưa chọn.

### Danh mục Pages — 12 mẫu gốc đề xuất

| Tên hiển thị / patternId | Khi dùng | Dữ liệu minh họa |
| --- | --- | --- |
| List / Standard — `list-standard` | Bản ghi phẳng, tra cứu và so sánh theo cột | Khách hàng doanh nghiệp |
| List / Advanced filter — `list-advanced-filter` | Nhiều điều kiện lọc và thao tác trên tập chọn | Đơn hàng |
| List / Grouped tree — `list-grouped-tree` | Dữ liệu cha/con cần hiển thị phân cấp | Nhóm hàng và sản phẩm |
| List / Master–Detail — `list-master-detail` | Xem liên tiếp nhiều hồ sơ, cần giữ vị trí danh sách | Yêu cầu hỗ trợ |
| Detail / Overview — `detail-overview` | Thông tin chính và các nhóm thuộc tính ngắn | Khách hàng |
| Detail / Tabbed — `detail-tabbed` | Nhiều nhóm thông tin và dữ liệu liên quan | Hợp đồng |
| Detail / Related records — `detail-related-records` | Một bản ghi chính kèm bảng dòng chi tiết | Đơn hàng và sản phẩm |
| Form / Simple — `form-simple` | Một nhóm trường nhập ngắn | Danh mục |
| Form / Sections — `form-sections` | Nhiều nhóm thông tin, cần thứ tự đọc rõ | Đối tác |
| Form / Line items — `form-line-items` | Header và tập dòng con có tổng hợp số liệu | Đơn hàng |
| Drawer / Compact — `drawer-compact` | Detail/create/update ngắn, giữ ngữ cảnh list | Danh mục |
| Drawer / Sections — `drawer-sections` | Detail/create/update có vài nhóm trường | Liên hệ |

Ba mẫu Form có cả create/update; hai mẫu Drawer có cả detail/create/update. Đây là 12 pattern gốc, không tính mỗi trạng thái là một mẫu độc lập. Detail page có hành động chuyển sang form update tương ứng. Không ép mọi entity dùng đủ các pattern.

### Quy tắc layout và tương tác

Pages có tab `Preview`, `Hướng dẫn`, `Dữ liệu`, `Source`. Preview chiếm chiều rộng vùng nội dung; cho phép mở route demo trực tiếp để đánh giá bố cục thật, tránh lồng nhiều lớp shell/header. Chuyển tab tài liệu không xóa query hoặc form đang nhập; chuyển mẫu/reset thì khôi phục fixture một cách có chủ ý.

Shell, header, breadcrumb, table toolbar, section, form footer và drawer dùng cùng token/type/spacing/icon family của Core. Không tạo một hệ component song song. Màu thương hiệu nâu của sales-platform và CSS override nội bộ từ Core cũ không được sao chép mặc định.

- List: header gọn; tên entity và primary action rõ; filter summary; số căn phải; định danh dễ nhận; giá trị dài có cách đọc đầy đủ; khu vực cuộn bảng tách khỏi page overflow.
- Detail: mã/tên/trạng thái ở header; thuộc tính ngắn trình bày label/value; nội dung dài chiếm chiều rộng cần thiết. Chọn tỷ lệ section theo dữ liệu thay vì mặc định ba cột bằng nhau.
- Form: chia nhóm có ý nghĩa; chiều rộng nhập liệu theo loại dữ liệu; create/update dùng cùng quy tắc validation. Giữ dữ liệu khi lưu thất bại, ngăn gửi lặp trong lúc pending.
- Drawer: thao tác ngắn, header/body/footer nhất quán; detail dùng facts phù hợp, create/update dùng form. Đóng drawer khôi phục focus về phần tử đã mở; dữ liệu dirty có lưu/bỏ thay đổi/tiếp tục chỉnh sửa.
- Mobile: header/actions wrap có thứ tự; sections xếp một cột; drawer toàn chiều rộng khả dụng; bảng giữ các cột cần so sánh trong vùng cuộn riêng. Không ép mọi table thành card.

### Dữ liệu mẫu và lựa chọn cho AI

Fixtures tổng hợp, có ID ổn định, dữ liệu ngắn/dài, số tiền và trạng thái đa dạng. Mỗi list có tối thiểu 24 bản ghi, đủ kiểm tra phân trang và lọc; cây có ít nhất hai cấp. Có cấu hình trạng thái data/loading/empty/no-results/error phù hợp, reset về seed xác định. Không lấy bản ghi khách hàng thật từ sales-platform.

Mỗi pattern có ID, tên, route, mục đích, `dataShape`, mật độ, kiểu container, trường bắt buộc cho demo, relationship/interaction, tiêu chí phù hợp/không phù hợp, component sử dụng, source path và Core version. Xuất catalog JSON tĩnh cùng tài liệu Markdown để consumer/AI tra cứu. JSON và tài liệu phải xuất từ cùng registry hoặc có kiểm tra đồng nhất; không đặt metadata kỹ thuật chiếm diện tích preview.

Guide phải giải thích cách chọn theo đặc điểm dữ liệu và công việc, ví dụ dữ liệu phẳng → Standard, cha/con → Grouped tree, đọc tuần tự → Master–Detail, nhiều quan hệ → Tabbed/Related records, chỉnh sửa ngắn tại list → Drawer. Không dùng số trường đơn thuần làm quyết định duy nhất.

## Giả định và mặc định đang đề xuất

- A-001 — Demo hoạt động với dữ liệu giả lập cục bộ, không cần backend thật. Căn cứ: mục tiêu thư viện tham khảo và cấu hình auth demo hiện tại; cần điều chỉnh nếu người dùng muốn kết nối backend.
- A-002 — Tiếng Việt là nội dung mặc định; identifiers/routes/pattern IDs tiếng Anh. Giữ cài đặt locale hiện có; dịch đầy đủ mọi trang sang ngôn ngữ thứ hai không thuộc đợt này.
- A-003 — Phạm vi Storybook là các demo hiện có và primitive bổ sung cho 12 pattern; chưa phải cam kết bao phủ mọi Core export.

Các giả định này là đề xuất không cản trở việc duyệt bản dự thảo; phải được xác nhận bằng việc duyệt phạm vi hoặc sửa lại trước khi lập plan.

## Phân loại architecture gate

Required: `major-dependency`, `state-data-ownership`, `public-api-contract`. Angular 20 → 22 và Storybook thay đổi nền build; fixtures/state phải được chia sẻ có kiểm soát giữa portal và stories; catalog JSON trở thành giao diện tham khảo cho consumer/AI. Sau khi duyệt spec, cần chốt ranh giới shell/demo/catalog/data và cấu trúc catalog trước plan; chưa author architecture trong đặc tả này.

## Kiến trúc đề xuất và vùng mã liên quan

Owner duy nhất của thay đổi là portal-template. Sales-platform và package Core là nguồn tham khảo/phụ thuộc. Shell điều phối navigation và cấu hình toàn cục. Demo container sở hữu query/form/overlay state; fixture store theo phạm vi demo. Các story sử dụng demo presentation và provider giả lập độc lập. Catalog chỉ mô tả mẫu, không tự chạy AI hoặc quyết định render runtime theo prompt.

| Vùng hiện có hoặc ứng viên | Vai trò |
| --- | --- |
| `package.json`, `package-lock.json`, `angular.json`, `tsconfig*.json` | Dependency/build/test migration |
| `src/main.ts`, `src/app/configurations/`, `src/app/app.routes.ts` | Bootstrap, shell, cấu hình và route |
| `src/styles.scss` | Theme và layout dùng chung |
| `src/libs/components/`, `src/libs/forms/`, `src/libs/services/` | Demo hiện có và stories |
| `src/libs/patterns/` | Tương thích và di chuyển mẫu cũ khi phù hợp |
| `src/libs/pages/` (ứng viên mới) | Catalog và 12 pattern |
| `.storybook/` (ứng viên mới) | Storybook config/providers/theme |
| `public/` và tài liệu dự án | Fixtures assets, catalog JSON và hướng dẫn |

Đây là các vùng sở hữu để đánh giá phạm vi, không phải thứ tự thực hiện. Component tree và file paths mới sẽ chốt bằng design/architecture/plan dựa trên Core source.

## Tiêu chí nghiệm thu

| ID | Yêu cầu | Hành vi và kết quả mong đợi | Kiểm chứng |
| --- | --- | --- | --- |
| AC-001 | R-001 | Cài từ lockfile bằng runtime tương thích; Core resolve chính xác 22.2.7; peer dependencies hợp lệ; portal build thành công | Automated |
| AC-002 | R-002 | Storybook chạy và build static; inventory bao phủ mọi demo hiện có của ba nhóm và primitive mới dùng trong Pages | Automated |
| AC-003 | R-002 | Story có controls/API/source và trạng thái áp dụng; notify/loading/confirm thể hiện kết quả, hủy, reset; không gọi backend thật | Automated + manual |
| AC-004 | R-003 | Tiêu đề, actions, tokens, sections, bảng, form và drawer nhất quán; desktop 1440/1024, tablet 768, mobile 390/320 không che nội dung cần thao tác | Manual |
| AC-005 | R-004 | Có đủ 12 pattern với ID/route duy nhất; ba Form có create/update, hai Drawer có detail/create/update; route cũ còn đích hợp lệ | Automated |
| AC-006 | R-004 | Pages dùng preview rộng và tab tài liệu; chuyển tab giữ query/form; mở demo trực tiếp không lồng shell thừa | Automated + manual |
| AC-007 | R-004, R-005 | Search/filter/sort/pagination trả đúng fixture; selection scope chỉ current page, giữ theo ID khi sort, reset khi đổi page/filter | Automated |
| AC-008 | R-004, R-005 | Create/update thật trên store demo; validation đúng; lưu lỗi giữ dữ liệu; hủy dirty giữ hoặc bỏ đúng lựa chọn; detail cập nhật theo kết quả lưu | Automated |
| AC-009 | R-005 | Có tối thiểu 24 bản ghi/list, seed/reset xác định; loading/empty/no-results/error; nội dung dài, số lớn và trường thiếu không làm vỡ bố cục | Automated + manual |
| AC-010 | R-005 | Catalog JSON và guide khớp 12 pattern, route/source tồn tại, có tiêu chí chọn và giới hạn; ví dụ mapping cấu trúc dữ liệu có thể đọc mà không chạy app | Automated |
| AC-011 | R-003, R-004 | Keyboard mở/đóng drawer, focus restore, tab order, tên control và error message rõ; kiểm tra zoom 200%, contrast và reduced motion ở UI thật | Automated + manual |
| AC-012 | R-001, R-003 | Locale/number format/tab router hiện có vẫn hoạt động; build/lint/test liên quan đạt; không có runtime error trên demo smoke routes | Automated |

## Kiểm chứng và rủi ro

Đề xuất kiểm tra giao diện sau khi dựng; test-first cho logic query, validators, store, mapping catalog và bảo vệ thay đổi chưa lưu. Dùng scripts hiện có `npm run build`, `npm run lint`, `npm test -- --watch=false`; plan xác nhận runner sau migration. Bổ sung lệnh Storybook dev/build và browser smoke có tên cụ thể trong plan. Không tạo test chỉ lặp lại markup.

- Core API/theme thay đổi: kiểm tra tài liệu đúng phiên bản và source package; đối chiếu từng nhóm demo, không khẳng định tương thích từ docs đơn thuần.
- Runtime Node hiện tại không đủ: dùng runtime tương thích đã kiểm tra; nếu chưa có, chuẩn bị phương án cài biệt lập trước thực thi.
- Storybook và portal khác provider/lifecycle: dùng cấu hình dùng chung có kiểm soát, reset fixtures và kiểm thử state isolation.
- Source sales-platform có CSS tác động nội bộ Core cũ: học cách tổ chức thông tin, xác minh API mới; không sao chép override vào theme mới.
- Phạm vi rộng: đề nghị chia thành các phần delivery có thể kiểm chứng riêng trong plan: nền tảng, Storybook/layout, Pages/catalog. Không giảm số mẫu âm thầm.

## Ngoài phạm vi

Không sửa repository sales-platform hay thư viện Core; không triển khai backend, SSO thật, engine AI tự sinh page, publish npm hoặc deploy site. Không thêm dashboard/chart/kanban/wizard hay tính năng nghiệp vụ sales-platform ngoài 12 mẫu đã nêu. Cập nhật generator Plop chỉ khi thay đổi hiện tại làm generator không còn compile; mở rộng generator theo catalog để đợt sau.

## Tự rà soát và trạng thái duyệt

Đã đối chiếu version, route inventory, bootstrap và các source tham khảo; có tiêu chí cho từng yêu cầu, phân biệt quyết định người dùng với đề xuất. Các phần cần bằng chứng runtime được ghi trong acceptance, không coi preview là ảnh của Core thật. Chưa thay dependencies, source production hay chạy build/test ứng dụng ở giai đoạn đặc tả.

Chờ người dùng duyệt hoặc chỉnh phạm vi dự thảo. Việc chọn bố cục `1` không được tính là duyệt đặc tả hay plan.

## Quyết định tại lần duyệt

- Duyệt nguyên trạng phạm vi 12 mẫu, Storybook, layout, catalog và 12 tiêu chí nghiệm thu.
- Xác nhận A-001, A-002, A-003; giữ bố cục 1 cho Pages.
- Chưa duyệt architecture hoặc plan; không cho phép suy diễn thành triển khai ngay.

## Nguồn quy trình

`sdcorejs-spec` từ bộ skill sdcorejs-agent commit ac820d7.

## Context đã duyệt

```json
{
  "spec_context": {
    "source": "sdcorejs-spec",
    "contract_id": "portal-reference-core22",
    "requirement_id": "portal-reference-core22",
    "artifact_kind": "spec",
    "owner_repository_id": "github.com/sdcorejs/portal-template",
    "owner_repository_role": "portal",
    "owner_module_id": null,
    "execution_host_repository_id": "github.com/sdcorejs/portal-template",
    "target_root": "portal-template",
    "target_root_kind": "target-project",
    "track": "angular",
    "stack_profile": "core-ui-angular",
    "profile_confidence": "high",
    "profile_evidence": [
      "package.json",
      "angular.json",
      "src/main.ts"
    ],
    "source_requirement_context": "Yêu cầu và lựa chọn của người dùng trong cuộc trò chuyện hiện tại",
    "approved_spec_path": ".sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md",
    "acceptance_criteria_count": 12,
    "manual_criteria_count": 5,
    "redaction_applied": true,
    "coverage_approach": "tdd",
    "coverage_note": "Đề xuất test-first cho logic; UI verification sau implementation; cần xác nhận cùng spec.",
    "approval": {
      "approved": true,
      "approved_at": "2026-09-10T04:28:07.935Z",
      "approval_source": "explicit-user-choice"
    },
    "change_control": {
      "revision": 1,
      "supersedes": null,
      "change_reason": null
    },
    "architecture_gate": {
      "valid": true,
      "required": true,
      "status": "required",
      "signals": [
        "major-dependency",
        "public-api-contract",
        "state-data-ownership"
      ],
      "bypass": null,
      "rationale": "Angular 20 lên 22, tích hợp Storybook, chia sẻ state fixtures và catalog JSON cho consumer/AI.",
      "blockers": [],
      "blocker_messages": []
    },
    "decision_coverage": {
      "schema_version": 1,
      "revision": 2,
      "records": [
        {
          "id": "R-001",
          "type": "requirement",
          "statement": "Nâng portal lên Core chính xác `22.2.7`, đồng bộ framework/toolchain tương thích.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": []
        },
        {
          "id": "R-002",
          "type": "requirement",
          "statement": "Cung cấp Storybook cho Components, Forms và Services, có ví dụ tương tác và tài liệu sử dụng.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": []
        },
        {
          "id": "R-003",
          "type": "requirement",
          "statement": "Đồng nhất shell, layout và quy tắc UI/UX; tham khảo sales-platform và điều chỉnh theo Core hiện tại.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": []
        },
        {
          "id": "R-004",
          "type": "requirement",
          "statement": "Có mục Pages với các loại list, detail/create/update dạng page và side-drawer, đặt tên rõ ràng.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": []
        },
        {
          "id": "R-005",
          "type": "requirement",
          "statement": "Mỗi mẫu giúp consumer/AI chọn và tái sử dụng theo dữ liệu module/entity, có dữ liệu mẫu cân đối và hướng dẫn lựa chọn.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": []
        },
        {
          "id": "AC-001",
          "type": "acceptance-criterion",
          "statement": "Cài từ lockfile bằng runtime tương thích; Core resolve chính xác 22.2.7; peer dependencies hợp lệ; portal build thành công",
          "behavior": "Cài từ lockfile bằng runtime tương thích; Core resolve chính xác 22.2.7; peer dependencies hợp lệ; portal build thành công",
          "expected_result": "Cài từ lockfile bằng runtime tương thích; Core resolve chính xác 22.2.7; peer dependencies hợp lệ; portal build thành công",
          "verification_kind": "automated",
          "blocking": true,
          "requirement_refs": [
            "R-001"
          ],
          "task_refs": []
        },
        {
          "id": "AC-002",
          "type": "acceptance-criterion",
          "statement": "Storybook chạy và build static; inventory bao phủ mọi demo hiện có của ba nhóm và primitive mới dùng trong Pages",
          "behavior": "Storybook chạy và build static; inventory bao phủ mọi demo hiện có của ba nhóm và primitive mới dùng trong Pages",
          "expected_result": "Storybook chạy và build static; inventory bao phủ mọi demo hiện có của ba nhóm và primitive mới dùng trong Pages",
          "verification_kind": "automated",
          "blocking": true,
          "requirement_refs": [
            "R-002"
          ],
          "task_refs": []
        },
        {
          "id": "AC-003",
          "type": "acceptance-criterion",
          "statement": "Story có controls/API/source và trạng thái áp dụng; notify/loading/confirm thể hiện kết quả, hủy, reset; không gọi backend thật",
          "behavior": "Story có controls/API/source và trạng thái áp dụng; notify/loading/confirm thể hiện kết quả, hủy, reset; không gọi backend thật",
          "expected_result": "Story có controls/API/source và trạng thái áp dụng; notify/loading/confirm thể hiện kết quả, hủy, reset; không gọi backend thật",
          "verification_kind": "manual",
          "blocking": true,
          "requirement_refs": [
            "R-002"
          ],
          "task_refs": []
        },
        {
          "id": "AC-004",
          "type": "acceptance-criterion",
          "statement": "Tiêu đề, actions, tokens, sections, bảng, form và drawer nhất quán; desktop 1440/1024, tablet 768, mobile 390/320 không che nội dung cần thao tác",
          "behavior": "Tiêu đề, actions, tokens, sections, bảng, form và drawer nhất quán; desktop 1440/1024, tablet 768, mobile 390/320 không che nội dung cần thao tác",
          "expected_result": "Tiêu đề, actions, tokens, sections, bảng, form và drawer nhất quán; desktop 1440/1024, tablet 768, mobile 390/320 không che nội dung cần thao tác",
          "verification_kind": "manual",
          "blocking": true,
          "requirement_refs": [
            "R-003"
          ],
          "task_refs": []
        },
        {
          "id": "AC-005",
          "type": "acceptance-criterion",
          "statement": "Có đủ 12 pattern với ID/route duy nhất; ba Form có create/update, hai Drawer có detail/create/update; route cũ còn đích hợp lệ",
          "behavior": "Có đủ 12 pattern với ID/route duy nhất; ba Form có create/update, hai Drawer có detail/create/update; route cũ còn đích hợp lệ",
          "expected_result": "Có đủ 12 pattern với ID/route duy nhất; ba Form có create/update, hai Drawer có detail/create/update; route cũ còn đích hợp lệ",
          "verification_kind": "automated",
          "blocking": true,
          "requirement_refs": [
            "R-004"
          ],
          "task_refs": []
        },
        {
          "id": "AC-006",
          "type": "acceptance-criterion",
          "statement": "Pages dùng preview rộng và tab tài liệu; chuyển tab giữ query/form; mở demo trực tiếp không lồng shell thừa",
          "behavior": "Pages dùng preview rộng và tab tài liệu; chuyển tab giữ query/form; mở demo trực tiếp không lồng shell thừa",
          "expected_result": "Pages dùng preview rộng và tab tài liệu; chuyển tab giữ query/form; mở demo trực tiếp không lồng shell thừa",
          "verification_kind": "manual",
          "blocking": true,
          "requirement_refs": [
            "R-004"
          ],
          "task_refs": []
        },
        {
          "id": "AC-007",
          "type": "acceptance-criterion",
          "statement": "Search/filter/sort/pagination trả đúng fixture; selection scope chỉ current page, giữ theo ID khi sort, reset khi đổi page/filter",
          "behavior": "Search/filter/sort/pagination trả đúng fixture; selection scope chỉ current page, giữ theo ID khi sort, reset khi đổi page/filter",
          "expected_result": "Search/filter/sort/pagination trả đúng fixture; selection scope chỉ current page, giữ theo ID khi sort, reset khi đổi page/filter",
          "verification_kind": "automated",
          "blocking": true,
          "requirement_refs": [
            "R-004",
            "R-005"
          ],
          "task_refs": []
        },
        {
          "id": "AC-008",
          "type": "acceptance-criterion",
          "statement": "Create/update thật trên store demo; validation đúng; lưu lỗi giữ dữ liệu; hủy dirty giữ hoặc bỏ đúng lựa chọn; detail cập nhật theo kết quả lưu",
          "behavior": "Create/update thật trên store demo; validation đúng; lưu lỗi giữ dữ liệu; hủy dirty giữ hoặc bỏ đúng lựa chọn; detail cập nhật theo kết quả lưu",
          "expected_result": "Create/update thật trên store demo; validation đúng; lưu lỗi giữ dữ liệu; hủy dirty giữ hoặc bỏ đúng lựa chọn; detail cập nhật theo kết quả lưu",
          "verification_kind": "automated",
          "blocking": true,
          "requirement_refs": [
            "R-004",
            "R-005"
          ],
          "task_refs": []
        },
        {
          "id": "AC-009",
          "type": "acceptance-criterion",
          "statement": "Có tối thiểu 24 bản ghi/list, seed/reset xác định; loading/empty/no-results/error; nội dung dài, số lớn và trường thiếu không làm vỡ bố cục",
          "behavior": "Có tối thiểu 24 bản ghi/list, seed/reset xác định; loading/empty/no-results/error; nội dung dài, số lớn và trường thiếu không làm vỡ bố cục",
          "expected_result": "Có tối thiểu 24 bản ghi/list, seed/reset xác định; loading/empty/no-results/error; nội dung dài, số lớn và trường thiếu không làm vỡ bố cục",
          "verification_kind": "manual",
          "blocking": true,
          "requirement_refs": [
            "R-005"
          ],
          "task_refs": []
        },
        {
          "id": "AC-010",
          "type": "acceptance-criterion",
          "statement": "Catalog JSON và guide khớp 12 pattern, route/source tồn tại, có tiêu chí chọn và giới hạn; ví dụ mapping cấu trúc dữ liệu có thể đọc mà không chạy app",
          "behavior": "Catalog JSON và guide khớp 12 pattern, route/source tồn tại, có tiêu chí chọn và giới hạn; ví dụ mapping cấu trúc dữ liệu có thể đọc mà không chạy app",
          "expected_result": "Catalog JSON và guide khớp 12 pattern, route/source tồn tại, có tiêu chí chọn và giới hạn; ví dụ mapping cấu trúc dữ liệu có thể đọc mà không chạy app",
          "verification_kind": "automated",
          "blocking": true,
          "requirement_refs": [
            "R-005"
          ],
          "task_refs": []
        },
        {
          "id": "AC-011",
          "type": "acceptance-criterion",
          "statement": "Keyboard mở/đóng drawer, focus restore, tab order, tên control và error message rõ; kiểm tra zoom 200%, contrast và reduced motion ở UI thật",
          "behavior": "Keyboard mở/đóng drawer, focus restore, tab order, tên control và error message rõ; kiểm tra zoom 200%, contrast và reduced motion ở UI thật",
          "expected_result": "Keyboard mở/đóng drawer, focus restore, tab order, tên control và error message rõ; kiểm tra zoom 200%, contrast và reduced motion ở UI thật",
          "verification_kind": "manual",
          "blocking": true,
          "requirement_refs": [
            "R-003",
            "R-004"
          ],
          "task_refs": []
        },
        {
          "id": "AC-012",
          "type": "acceptance-criterion",
          "statement": "Locale/number format/tab router hiện có vẫn hoạt động; build/lint/test liên quan đạt; không có runtime error trên demo smoke routes",
          "behavior": "Locale/number format/tab router hiện có vẫn hoạt động; build/lint/test liên quan đạt; không có runtime error trên demo smoke routes",
          "expected_result": "Locale/number format/tab router hiện có vẫn hoạt động; build/lint/test liên quan đạt; không có runtime error trên demo smoke routes",
          "verification_kind": "automated",
          "blocking": true,
          "requirement_refs": [
            "R-001",
            "R-003"
          ],
          "task_refs": []
        },
        {
          "id": "A-001",
          "type": "assumption",
          "statement": "Demo hoạt động với dữ liệu giả lập cục bộ, không cần backend thật. Căn cứ: mục tiêu thư viện tham khảo và cấu hình auth demo hiện tại; cần điều chỉnh nếu người dùng muốn kết nối backend.",
          "source": "inferred",
          "confidence": "high",
          "status": "confirmed",
          "blocking": false,
          "evidence_refs": [
            "user-request",
            "package.json",
            "src/app/configurations/auth.configuration.ts",
            "user-spec-approval-2026-09-10"
          ],
          "consequence_if_wrong": "Điều chỉnh phạm vi và tiêu chí tương ứng trước plan.",
          "validation_method": "Người dùng duyệt hoặc sửa phạm vi đặc tả.",
          "owner": "sdcorejs-spec"
        },
        {
          "id": "A-002",
          "type": "assumption",
          "statement": "Tiếng Việt là nội dung mặc định; identifiers/routes/pattern IDs tiếng Anh. Giữ cài đặt locale hiện có; dịch đầy đủ mọi trang sang ngôn ngữ thứ hai không thuộc đợt này.",
          "source": "inferred",
          "confidence": "high",
          "status": "confirmed",
          "blocking": false,
          "evidence_refs": [
            "user-request",
            "package.json",
            "src/app/configurations/auth.configuration.ts",
            "user-spec-approval-2026-09-10"
          ],
          "consequence_if_wrong": "Điều chỉnh phạm vi và tiêu chí tương ứng trước plan.",
          "validation_method": "Người dùng duyệt hoặc sửa phạm vi đặc tả.",
          "owner": "sdcorejs-spec"
        },
        {
          "id": "A-003",
          "type": "assumption",
          "statement": "Phạm vi Storybook là các demo hiện có và primitive bổ sung cho 12 pattern; chưa phải cam kết bao phủ mọi Core export.",
          "source": "inferred",
          "confidence": "high",
          "status": "confirmed",
          "blocking": false,
          "evidence_refs": [
            "user-request",
            "package.json",
            "src/app/configurations/auth.configuration.ts",
            "user-spec-approval-2026-09-10"
          ],
          "consequence_if_wrong": "Điều chỉnh phạm vi và tiêu chí tương ứng trước plan.",
          "validation_method": "Người dùng duyệt hoặc sửa phạm vi đặc tả.",
          "owner": "sdcorejs-spec"
        },
        {
          "id": "D-001",
          "type": "decision",
          "statement": "Core đích: `@sdcorejs/angular@22.2.7`; nguồn: phản hồi trực tiếp của người dùng.",
          "question": "Phiên bản Core đích?",
          "selected_value": "22.2.7",
          "source": "explicit-user",
          "status": "approved",
          "blocking": true,
          "scope": "repository",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "rationale": "Core đích: `@sdcorejs/angular@22.2.7`; nguồn: phản hồi trực tiếp của người dùng.",
          "supersedes": null,
          "revisit_condition": null,
          "convention_impact": {
            "candidate": false,
            "category": null
          },
          "downstream_refs": [
            "R-001",
            "AC-001"
          ],
          "task_refs": []
        },
        {
          "id": "D-002",
          "type": "decision",
          "statement": "Tham khảo sales-platform tại máy local; tái thiết kế theo Core hiện tại được phép. Sales-platform chỉ là nguồn tham khảo, portal-template là nơi triển khai.",
          "question": "Nguồn tham khảo và phạm vi redesign?",
          "selected_value": "sales-platform tham khảo; portal-template triển khai",
          "source": "explicit-user",
          "status": "approved",
          "blocking": true,
          "scope": "repository",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "rationale": "Tham khảo sales-platform tại máy local; tái thiết kế theo Core hiện tại được phép. Sales-platform chỉ là nguồn tham khảo, portal-template là nơi triển khai.",
          "supersedes": null,
          "revisit_condition": null,
          "convention_impact": {
            "candidate": false,
            "category": null
          },
          "downstream_refs": [
            "R-003",
            "AC-004"
          ],
          "task_refs": []
        },
        {
          "id": "D-003",
          "type": "decision",
          "statement": "Pages dùng bố cục 1: preview rộng, tài liệu đặt ở tab. Phản hồi `1` chọn phương án có nhãn `1. Preview rộng · Hướng dẫn ở tab`; không suy diễn thành chấp thuận phối hợp hai bố cục.",
          "question": "Bố cục Pages?",
          "selected_value": "Preview rộng, hướng dẫn ở tab",
          "source": "explicit-user",
          "status": "approved",
          "blocking": true,
          "scope": "repository",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "rationale": "Pages dùng bố cục 1: preview rộng, tài liệu đặt ở tab. Phản hồi `1` chọn phương án có nhãn `1. Preview rộng · Hướng dẫn ở tab`; không suy diễn thành chấp thuận phối hợp hai bố cục.",
          "supersedes": null,
          "revisit_condition": null,
          "convention_impact": {
            "candidate": false,
            "category": null
          },
          "downstream_refs": [
            "R-004",
            "AC-006"
          ],
          "task_refs": []
        }
      ],
      "history": [
        {
          "revision": 1,
          "active": [
            {
              "id": "R-001",
              "type": "requirement"
            },
            {
              "id": "R-002",
              "type": "requirement"
            },
            {
              "id": "R-003",
              "type": "requirement"
            },
            {
              "id": "R-004",
              "type": "requirement"
            },
            {
              "id": "R-005",
              "type": "requirement"
            },
            {
              "id": "AC-001",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-002",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-003",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-004",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-005",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-006",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-007",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-008",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-009",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-010",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-011",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-012",
              "type": "acceptance-criterion"
            },
            {
              "id": "A-001",
              "type": "assumption"
            },
            {
              "id": "A-002",
              "type": "assumption"
            },
            {
              "id": "A-003",
              "type": "assumption"
            },
            {
              "id": "D-001",
              "type": "decision"
            },
            {
              "id": "D-002",
              "type": "decision"
            },
            {
              "id": "D-003",
              "type": "decision"
            }
          ],
          "tombstones": []
        },
        {
          "revision": 2,
          "active": [
            {
              "id": "R-001",
              "type": "requirement"
            },
            {
              "id": "R-002",
              "type": "requirement"
            },
            {
              "id": "R-003",
              "type": "requirement"
            },
            {
              "id": "R-004",
              "type": "requirement"
            },
            {
              "id": "R-005",
              "type": "requirement"
            },
            {
              "id": "AC-001",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-002",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-003",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-004",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-005",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-006",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-007",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-008",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-009",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-010",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-011",
              "type": "acceptance-criterion"
            },
            {
              "id": "AC-012",
              "type": "acceptance-criterion"
            },
            {
              "id": "A-001",
              "type": "assumption"
            },
            {
              "id": "A-002",
              "type": "assumption"
            },
            {
              "id": "A-003",
              "type": "assumption"
            },
            {
              "id": "D-001",
              "type": "decision"
            },
            {
              "id": "D-002",
              "type": "decision"
            },
            {
              "id": "D-003",
              "type": "decision"
            }
          ],
          "tombstones": []
        }
      ]
    },
    "goal_backward_review": {
      "schema_version": 1,
      "mode": "sdcorejs-plan:goal-backward",
      "stage": "spec",
      "future_gaps": [
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-001.task_refs",
          "record_id": "AC-001",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-002.task_refs",
          "record_id": "AC-002",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-003.task_refs",
          "record_id": "AC-003",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-004.task_refs",
          "record_id": "AC-004",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-005.task_refs",
          "record_id": "AC-005",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-006.task_refs",
          "record_id": "AC-006",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-007.task_refs",
          "record_id": "AC-007",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-008.task_refs",
          "record_id": "AC-008",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-009.task_refs",
          "record_id": "AC-009",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-010.task_refs",
          "record_id": "AC-010",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-011.task_refs",
          "record_id": "AC-011",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "AC_PLAN_COVERAGE_MISSING",
          "path": "records.AC-012.task_refs",
          "record_id": "AC-012",
          "message": "an acceptance criterion must map to at least one planned task"
        },
        {
          "code": "REQUIREMENT_PLAN_COVERAGE_MISSING",
          "path": "records.R-001.task_refs",
          "record_id": "R-001",
          "message": "a requirement must map to at least one planned task"
        },
        {
          "code": "REQUIREMENT_PLAN_COVERAGE_MISSING",
          "path": "records.R-002.task_refs",
          "record_id": "R-002",
          "message": "a requirement must map to at least one planned task"
        },
        {
          "code": "REQUIREMENT_PLAN_COVERAGE_MISSING",
          "path": "records.R-003.task_refs",
          "record_id": "R-003",
          "message": "a requirement must map to at least one planned task"
        },
        {
          "code": "REQUIREMENT_PLAN_COVERAGE_MISSING",
          "path": "records.R-004.task_refs",
          "record_id": "R-004",
          "message": "a requirement must map to at least one planned task"
        },
        {
          "code": "REQUIREMENT_PLAN_COVERAGE_MISSING",
          "path": "records.R-005.task_refs",
          "record_id": "R-005",
          "message": "a requirement must map to at least one planned task"
        }
      ]
    }
  }
}
```
