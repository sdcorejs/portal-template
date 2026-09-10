---
schema_version: 1
artifact_id: "draft-plan-portal-reference-core22-r1"
artifact_kind: "execution-doc"
contract_id: "portal-reference-core22"
requirement_id: "portal-reference-core22"
change_ref: "portal-reference-core22"
source_spec: ".sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md"
source_plan: "none"
commit_policy: "with-change"
owner: "sdcorejs-plan"
owner_repository_id: "github.com/sdcorejs/portal-template"
owner_repository_role: "portal"
owner_module_id: null
track: "angular"
stack_profile: "core-ui-angular"
source_revision: "4f8d01818005dd7a5925dc6d46e7bfefb271242f"
status: "draft"
approved_at: null
revision: 1
---
# Kế hoạch — Portal reference Core 22.2.7

## Phạm vi và đầu vào

Triển khai đặc tả và kiến trúc đã duyệt: Core 22.2.7, Storybook Components/Forms/Services, layout Pages 1, 12 pattern và catalog v1. Giữ nguyên các lựa chọn thiết kế; không có backend/AI runtime hay deploy.

- Spec: `.sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md`; hash `sha256:v1:0e2aa4f9c75d4684529518d14c71f23f03054757dcea67bb5d0a30d93f52fe1b`.
- Architecture: `.sdcorejs/architecture/angular/2026-09-10-11-34-portal-reference-core22.md`; hash `sha256:v1:1c5a00e534631b22aa87483e568668f17d88b02a55c977a3b52b42ece5a2d14d`.
- Owner/Git root: `github.com/sdcorejs/portal-template`, `portal-template`. Thực thi tuần tự, không subagent.
- Tổng: 10 task / 4 phase; 202 file hiện có, 156 file dự kiến tạo (gồm 46 story cho demo hiện có). Danh sách chính xác ở cuối.

## Runtime và dependency

Node hệ thống 22.14.0 không đủ. Đã kiểm tra runtime Codex Node 24.19.0 đáp ứng Core. Dùng đường dẫn runtime được discover trong session và process-only PATH; không lưu đường dẫn máy cá nhân vào repo. Node requirement trong README là portable.

| Nhóm | Version dự kiến đã kiểm tra registry |
| --- | --- |
| Core | 22.2.7, pin exact |
| Angular runtime/compiler + Material/CDK/adapter | 22.1.6 |
| CLI/build và devkit cho Storybook | 22.1.7 |
| TypeScript | 6.0.3 (compiler yêu cầu >=6.0 <6.1) |
| angular-eslint / typescript-eslint | 22.5.0 / 8.70.0 |
| Storybook/angular/addon-docs | 10.6.0 |
| Playwright | 1.63.0 |

Kiểm tra peer matrix khi install; không ép resolver. Thay patch trong cùng family chỉ khi bằng chứng compatibility bắt buộc và ghi delta; thay major hoặc phạm vi quay lại plan. Giữ Karma/Jasmine, không thêm Vitest khi chưa cần.

## Trước khi viết source

Kiểm tra branch/HEAD, staged/unstaged diffstat, untracked files và scope. Hiện chỉ có artifact cùng thay đổi trong .sdcorejs. Tôn trọng dirty files mới; không reset/stash tự động. Thực hiện trong checkout riêng nếu có người/task khác sửa cùng vùng; không đổi Git root hay branch của task khác. Đối chiếu docs và package source đúng 22.2.7 trước dùng API.

D-004 diễn đạt lại boundary đã duyệt trong architecture: đây là demo local, không có server authorization contract. Validation map dùng boundary none, không coi UI disabled là bằng chứng phân quyền.

## Frontend architecture plan

- Giữ standalone, HTML/SCSS riêng, signals/OnPush và lazy route conventions hiện có.
- MainComponent → PageReference → DemoHost → pattern container; detail dùng EntityFacts/RelatedRecords, form dùng FormSections/LineItemEditor.
- Query/selection ở list; draft/errors ở form; entity trong per-session store; theme/locale ở host. Store scope route cha hoặc demo instance, không singleton.
- Storybook tái dùng demo implementation; providers/theme từ nguồn chung, không import main.ts/auth interceptor.
- Catalog thuần và loader map riêng; export không nạp Angular runtime.
- Chỉ export pagesRoutes và contracts có consumer thật; feature children private. Không tạo wrapper một field hoặc facade thừa.
- Colocated tests cho query, CRUD, form/dirty, route/tab/provider scope; browser tests cho flow và UI thật.

## Phase 1 — Nền tảng và design handoff

### 1. TASK-001 — Runtime, dependency và build/test tooling

Dùng Node 24.19.0 đã có trong Codex bằng PATH của process. Pin Core 22.2.7; Angular/Material 22.1.6; CLI/build/devkit 22.1.7; TS 6.0.3; angular-eslint 22.5.0; typescript-eslint 8.70.0; Storybook/angular/addon-docs 10.6.0; Playwright 1.63.0. Giữ Karma/Jasmine khi tương thích; không đổi test framework ngoài migration bắt buộc. Khai báo scripts mới trước các task tạo implementation. Giữ configurations/budgets; sửa asset references bị thiếu theo public/source thực tế. Đổi providers/API thuộc task sở hữu tương ứng. Nếu compiler còn lỗi ở demo cũ, ghi rõ và xử lý TASK-004 trước khi kết luận build đạt.

- Phụ thuộc: Không.
- Tiêu chí: AC-001, AC-012.
- Kiểm chứng: Installed Core exact + peer tree hợp lệ; toolchain script kiểm tra runtime/version; build sau migration đạt.

### 2. TASK-002 — Handoff thiết kế theo bố cục đã chọn

Dùng sdcorejs-design. Hoàn thiện token/source map, hierarchy list/detail/form/drawer, states, desktop/tablet/mobile, focus/dirty. 4 wireframe HTML editable phản ánh layout 1, không mở lại lựa chọn. Handoff liên kết approved spec/architecture/plan; nhận xét từ sales-platform là source reference, không ảnh UI thật. Không thêm renderer dependency hay tạo PNG nếu không cần.

- Phụ thuộc: TASK-001.
- Tiêu chí: AC-004, AC-006, AC-011.
- Kiểm chứng: Handoff/wireframes đủ 4 screen families, API reuse được đối chiếu Core 22.2.7 và component map không có boundary mơ hồ.

### 5. TASK-005 — Fixture, query, form logic và session store

Viết test RED thật cho search/filter/sort/page/selection, CRUD, validation, totals và reset. Sau đó viết typed models và fixture factory xác định tối thiểu 24 bản ghi/list; hierarchical 2 cấp; hỗ trợ short/long/null/large values. Store scope demo session, không global singleton; query/helper pure. Simulated failure/latency controlled, cancel khi destroy. Mutation không đổi seed; tạo instance mới không kế thừa dữ liệu story khác.

- Phụ thuộc: TASK-001.
- Tiêu chí: AC-007, AC-008, AC-009.
- Kiểm chứng: Đối chiếu expected IDs và totals, dirty/pending/retry, reset seed; unit và DI isolation tests GREEN.

## Phase 2 — Layout chung và Storybook

### 3. TASK-003 — Shell, reference layout và route integration

Giữ Core sd-layout và locale/number-format/tab-router. Tạo PageReference với tab Preview/Hướng dẫn/Dữ liệu/Source; tạo lazy preview một lần, ẩn mà không destroy khi đổi tab. DemoHost sở hữu provider phiên; route demo đứng trước :patternId. Wrapper không import Storybook. Main menus đăng ký Pages; không hardcode 12 metadata ở nhiều nơi. TDD cho tab survival/route precedence; template/style theo handoff. Hoàn thiện generic shell/host trước; đăng ký concrete loader/routes sau khi TASK-006/007/008 có file đích, giữ đúng owner TASK-003 và kiểm tra tích hợp trước TASK-009. Không tạo route import tới file chưa tồn tại hoặc coi lỗi import là TDD RED.

- Phụ thuộc: TASK-001, TASK-002, TASK-005.
- Tiêu chí: AC-004, AC-005, AC-006, AC-012.
- Kiểm chứng: Router integration không mất state hoặc lồng shell; settings cũ hoạt động; focus và resize có kiểm chứng browser.

### 4. TASK-004 — Migration demo và Storybook đầy đủ inventory

Migrate exports/inputs/providers theo published Core source. Mọi demo route thuộc Components/Forms/Services có story; tái dùng component hiện có, chuyển sang inputs/events có chủ ý khi cần controls. Dùng applicationConfig/moduleMetadata đúng scope; harness reset và destroy thật, không bootstrap main.ts hoặc auth interceptor. Providers và theme cùng nguồn TASK-003. Inventory đánh dấu coverage rõ, utilities/instructions/patterns cũ chỉ sửa để compile/giữ route. Services có confirm result/cancel, loading teardown, notify variants, unsaved changes; data/asset giả lập. Kiểm tra story isolation trước logic mới.

- Phụ thuộc: TASK-001, TASK-002, TASK-003.
- Tiêu chí: AC-001, AC-002, AC-003, AC-012.
- Kiểm chứng: Storybook dev/static build đạt; inventory story match demo source; component/service tương tác đúng và không gọi backend thật.

## Phase 3 — Dữ liệu, catalog và 12 pattern

### 6. TASK-006 — Registry, catalog v1 và source export

Viết schema/ID/paths/loader parity tests RED, rồi metadata thuần cho 12 IDs. Export JSON và Markdown deterministic; source snippets đọc từ file allowlisted thật, escape, không absolute path/secrets/functions. Node exporter dùng TS strip types cho metadata nếu phù hợp, không import Angular. Registry validates aliases/relatedPatterns and variants. CHECK phải phát hiện generated drift mà không tự ghi.

- Phụ thuộc: TASK-001, TASK-005.
- Tiêu chí: AC-005, AC-010.
- Kiểm chứng: 12 pattern ID duy nhất; routes/sources/loaders hợp lệ; exports reproducible; source/docs không drift.

### 7. TASK-007 — Bốn List và ba Detail pattern

Các route container riêng cho 7 pattern; Core table/query/section/read-state đã kiểm chứng. EntityFacts là read-only region dùng chung giữa detail cần cùng semantics; RelatedRecords sở hữu bảng con, không mutation entity. Master-detail giữ selected ID và focus; tree cần real hierarchy; filter/sort/page kiểm chứng ID, không giả lập chỉ thay nhãn. Test query orchestration trước behavior, visual sau render.

- Phụ thuộc: TASK-002, TASK-003, TASK-005, TASK-006.
- Tiêu chí: AC-004, AC-005, AC-007, AC-009.
- Kiểm chứng: Cả 7 pattern có hành vi và state thật, không 7 bản copy cùng table; grouped/tree/master-detail/related layouts phù hợp dữ liệu.

### 8. TASK-008 — Ba Form và hai Drawer pattern

TDD validation/dirty/save-error/repeated submit/totals và selected ID update. FormSections nhận cùng form owner; LineItemEditor có FormArray/subcontract, không sao chép entity. Form Simple/Sections/Line items đủ create/update; Drawer Compact/Sections đủ detail/create/update, facts khác form edit. Dùng Core unsaved-changes nếu API đúng; guard phối hợp route/tab-router/reset và close. Focus restore, keyboard, cancel pending, mobile width.

- Phụ thuộc: TASK-002, TASK-003, TASK-005, TASK-006, TASK-007.
- Tiêu chí: AC-004, AC-005, AC-008, AC-011.
- Kiểm chứng: Lưu tạo/sửa phản ánh vào store/list, dirty outcomes đúng, failures giữ draft, line totals nhất quán; focus/keyboard integration tests.

## Phase 4 — Kiểm chứng và bàn giao

### 9. TASK-009 — Browser verification và accessibility

Dùng Playwright Chromium và browser có sẵn; chỉ tải browser bundle nếu runtime thiếu, không install hệ thống. Test flow thực tế cả portal/Storybook, all registered demo smoke, no console errors, intercept ngoài localhost để chứng minh demo không cần backend. Viewports 1440/1024/768/390/320, zoom 200%, keyboard/focus/dirty/mobile. Contrast đo trên computed style và kiểm tra rendered; không chỉ screenshot snapshot. Kết quả manual/UAT được ghi đúng là MANUAL, không đổi thành automated pass.

- Phụ thuộc: TASK-004, TASK-007, TASK-008.
- Tiêu chí: AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009, AC-011, AC-012.
- Kiểm chứng: Browser journeys pass và visual review có evidence hiện tại; báo lỗi và quay về đúng task owner sửa, rerun affected checks.

### 10. TASK-010 — Tài liệu và gate bàn giao

Ghi hướng dẫn runtime/start/build/Storybook, lựa chọn pattern, reset và giới hạn demo, kết quả kiểm chứng thật. sdcorejs-test → read-only review → repair finding cần thiết theo owner → affected tests → code-documentation → UI verification → docs/catalog closure → verify-before-done → branch-ready read-only. Không chạy simplify tự động, không tạo memories/conventions ngoài authority, không commit/push/deploy. Nếu docs/source thay sau test phải chạy lại kiểm tra ảnh hưởng trước branch-ready.

- Phụ thuộc: TASK-009, TASK-006.
- Tiêu chí: AC-001, AC-002, AC-004, AC-005, AC-006, AC-008, AC-009, AC-010, AC-011, AC-012.
- Kiểm chứng: Handoff chỉ khi build/lint/test/catalog/storybook/browser hiện tại đạt hoặc báo blocker rõ; không ghi thêm sau final branch-ready.

## Commands và evidence

Các script mới dưới đây là thay đổi nằm trong TASK-001, chưa tồn tại trước triển khai; command_source trong validation map là project-doc cho tới khi có package.json tương ứng. Mọi lệnh chạy ở root portal-template bằng runtime đã chọn.

| Script mới | Nội dung dự kiến |
| --- | --- |
| check:toolchain | `node scripts/check-toolchain.mjs` |
| storybook | `ng run portal-template:storybook` |
| build-storybook | `ng run portal-template:build-storybook` |
| export:catalog | `node scripts/export-page-catalog.mjs` |
| check:catalog | `node scripts/export-page-catalog.mjs --check` |
| test:catalog | `node --test scripts/export-page-catalog.test.mjs` |
| test:e2e | `playwright test` |

Chạy RED → GREEN cho logic trong TASK-005/006/007/008; lỗi RED phải do thiếu behavior, không do import/compiler chết. Sau migration/integration chạy build, lint, unit, Storybook build, catalog check và browser. AC-004/011 còn review trực quan và owner acknowledgement; không gắn PASS tự động cho phần manual. CASE IDs xuất hiện trong test titles hoặc verification evidence; không fake case bằng một dòng log.

| Acceptance | Task sở hữu bằng chứng | Command chính |
| --- | --- | --- |
| AC-001 | TASK-001, TASK-004, TASK-009, TASK-010 | `npm run check:toolchain` |
| AC-002 | TASK-004, TASK-009, TASK-010 | `npm run build-storybook` |
| AC-003 | TASK-004, TASK-009 | `npm run test:e2e -- --grep case-ac-003` |
| AC-004 | TASK-002, TASK-003, TASK-007, TASK-008, TASK-009, TASK-010 | Review UI thật + acknowledgement |
| AC-005 | TASK-003, TASK-006, TASK-007, TASK-008, TASK-009, TASK-010 | `npm run test:e2e -- --grep case-ac-005` |
| AC-006 | TASK-002, TASK-003, TASK-009, TASK-010 | `npm run test:e2e -- --grep case-ac-006` |
| AC-007 | TASK-005, TASK-007, TASK-009 | `npm test -- --watch=false --browsers=ChromeHeadless --include=src/libs/pages/data/query.spec.ts` |
| AC-008 | TASK-005, TASK-008, TASK-009, TASK-010 | `npm test -- --watch=false --browsers=ChromeHeadless --include=src/libs/pages/patterns/form-patterns.spec.ts` |
| AC-009 | TASK-005, TASK-007, TASK-009, TASK-010 | `npm run test:e2e -- --grep case-ac-009` |
| AC-010 | TASK-006, TASK-010 | `npm run check:catalog` |
| AC-011 | TASK-002, TASK-008, TASK-009, TASK-010 | Review UI thật + acknowledgement |
| AC-012 | TASK-001, TASK-003, TASK-004, TASK-009, TASK-010 | `npm run test:e2e -- --grep case-ac-012` |

Map là kế hoạch kiểm chứng, chưa phải test đã chạy. Approval identity của decision coverage được tạo sau khi người dùng duyệt plan; không giả lập hash approval để vượt validator.

## Write scope và artifact closure

Mỗi file có đúng một task owner trong inventory; sửa lỗi quay lại owner đó. Allowed paths là inventory chính xác. Build/cache/node_modules/browser report là generated local-only, không source. Catalog JSON và guide sinh ra được giao cùng change. Approved snapshots, env values, Git internals và repo sales-platform/Core bị cấm sửa.

Handoff design dùng resolver canonical .sdcorejs/design và ledger .sdcorejs/docs/design. Markdown/source documentation được duyệt trong plan; không tự ghi memories/conventions/session tracker. Repair thêm file ngoài inventory cần nêu path và lý do trước khi thay đổi plan. Không ghi sau final branch-ready; nếu sửa thì verify lại.

## File inventory

<details><summary>Danh sách CREATE/EDIT theo task và owner</summary>

| Task | Thao tác | File |
| --- | --- | --- |
| TASK-001 | EDIT | `.gitignore` |
| TASK-001 | EDIT | `angular.json` |
| TASK-001 | EDIT | `eslint.config.js` |
| TASK-001 | EDIT | `package-lock.json` |
| TASK-001 | EDIT | `package.json` |
| TASK-001 | CREATE | `scripts/check-toolchain.mjs` |
| TASK-001 | EDIT | `tsconfig.app.json` |
| TASK-001 | EDIT | `tsconfig.json` |
| TASK-001 | EDIT | `tsconfig.spec.json` |
| TASK-002 | CREATE | `.sdcorejs/design/decisions/portal-reference-core22.md` |
| TASK-002 | CREATE | `.sdcorejs/design/flows/portal-reference-core22.md` |
| TASK-002 | CREATE | `.sdcorejs/design/specs/portal-reference-core22.md` |
| TASK-002 | CREATE | `.sdcorejs/design/wireframes/portal-reference-core22/detail-tabbed.html` |
| TASK-002 | CREATE | `.sdcorejs/design/wireframes/portal-reference-core22/drawer-compact.html` |
| TASK-002 | CREATE | `.sdcorejs/design/wireframes/portal-reference-core22/form-sections.html` |
| TASK-002 | CREATE | `.sdcorejs/design/wireframes/portal-reference-core22/list-standard.html` |
| TASK-002 | CREATE | `.sdcorejs/docs/design/portal-reference-core22.md` |
| TASK-003 | EDIT | `src/app/app.routes.ts` |
| TASK-003 | EDIT | `src/app/components/main/main.component.html` |
| TASK-003 | EDIT | `src/app/components/main/main.component.ts` |
| TASK-003 | EDIT | `src/app/configurations/auth.configuration.ts` |
| TASK-003 | EDIT | `src/app/configurations/index.ts` |
| TASK-003 | EDIT | `src/app/configurations/layout.configuration.ts` |
| TASK-003 | EDIT | `src/app/configurations/permission.configuration.ts` |
| TASK-003 | EDIT | `src/app/configurations/portal-config.ts` |
| TASK-003 | CREATE | `src/app/reference-providers.ts` |
| TASK-003 | CREATE | `src/libs/pages/index.ts` |
| TASK-003 | CREATE | `src/libs/pages/reference/demo-host.component.html` |
| TASK-003 | CREATE | `src/libs/pages/reference/demo-host.component.scss` |
| TASK-003 | CREATE | `src/libs/pages/reference/demo-host.component.spec.ts` |
| TASK-003 | CREATE | `src/libs/pages/reference/demo-host.component.ts` |
| TASK-003 | CREATE | `src/libs/pages/reference/page-reference.component.html` |
| TASK-003 | CREATE | `src/libs/pages/reference/page-reference.component.scss` |
| TASK-003 | CREATE | `src/libs/pages/reference/page-reference.component.spec.ts` |
| TASK-003 | CREATE | `src/libs/pages/reference/page-reference.component.ts` |
| TASK-003 | CREATE | `src/libs/pages/routes.ts` |
| TASK-003 | EDIT | `src/main.ts` |
| TASK-003 | EDIT | `src/styles.scss` |
| TASK-003 | CREATE | `src/styles/reference.scss` |
| TASK-004 | CREATE | `.storybook/main.ts` |
| TASK-004 | CREATE | `.storybook/preview.ts` |
| TASK-004 | CREATE | `.storybook/tsconfig.json` |
| TASK-004 | EDIT | `src/libs/components/anchor/anchor.component.ts` |
| TASK-004 | CREATE | `src/libs/components/anchor/anchor.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/anchor/basic/basic.component.html` |
| TASK-004 | EDIT | `src/libs/components/anchor/basic/basic.component.scss` |
| TASK-004 | EDIT | `src/libs/components/anchor/basic/basic.component.ts` |
| TASK-004 | CREATE | `src/libs/components/anchor/basic/basic.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/anchor/with-section/with-section.component.html` |
| TASK-004 | EDIT | `src/libs/components/anchor/with-section/with-section.component.scss` |
| TASK-004 | EDIT | `src/libs/components/anchor/with-section/with-section.component.ts` |
| TASK-004 | CREATE | `src/libs/components/anchor/with-section/with-section.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/avatar/avatar.component.html` |
| TASK-004 | EDIT | `src/libs/components/avatar/avatar.component.scss` |
| TASK-004 | EDIT | `src/libs/components/avatar/avatar.component.ts` |
| TASK-004 | CREATE | `src/libs/components/avatar/avatar.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/badge/badge.component.html` |
| TASK-004 | EDIT | `src/libs/components/badge/badge.component.scss` |
| TASK-004 | EDIT | `src/libs/components/badge/badge.component.ts` |
| TASK-004 | CREATE | `src/libs/components/badge/badge.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/button/button.component.html` |
| TASK-004 | EDIT | `src/libs/components/button/button.component.scss` |
| TASK-004 | EDIT | `src/libs/components/button/button.component.ts` |
| TASK-004 | CREATE | `src/libs/components/button/button.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/index.ts` |
| TASK-004 | EDIT | `src/libs/components/modal/basic/basic.component.html` |
| TASK-004 | EDIT | `src/libs/components/modal/basic/basic.component.scss` |
| TASK-004 | EDIT | `src/libs/components/modal/basic/basic.component.ts` |
| TASK-004 | CREATE | `src/libs/components/modal/basic/basic.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/modal/slots/slots.component.html` |
| TASK-004 | EDIT | `src/libs/components/modal/slots/slots.component.scss` |
| TASK-004 | EDIT | `src/libs/components/modal/slots/slots.component.ts` |
| TASK-004 | CREATE | `src/libs/components/modal/slots/slots.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/modal/view-modes/view-modes.component.html` |
| TASK-004 | EDIT | `src/libs/components/modal/view-modes/view-modes.component.scss` |
| TASK-004 | EDIT | `src/libs/components/modal/view-modes/view-modes.component.ts` |
| TASK-004 | CREATE | `src/libs/components/modal/view-modes/view-modes.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/preview-image/preview-image.component.html` |
| TASK-004 | EDIT | `src/libs/components/preview-image/preview-image.component.scss` |
| TASK-004 | EDIT | `src/libs/components/preview-image/preview-image.component.ts` |
| TASK-004 | CREATE | `src/libs/components/preview-image/preview-image.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/preview-pdf/preview-pdf.component.html` |
| TASK-004 | EDIT | `src/libs/components/preview-pdf/preview-pdf.component.scss` |
| TASK-004 | EDIT | `src/libs/components/preview-pdf/preview-pdf.component.ts` |
| TASK-004 | CREATE | `src/libs/components/preview-pdf/preview-pdf.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/query-bar/basic/basic.component.html` |
| TASK-004 | EDIT | `src/libs/components/query-bar/basic/basic.component.scss` |
| TASK-004 | EDIT | `src/libs/components/query-bar/basic/basic.component.ts` |
| TASK-004 | CREATE | `src/libs/components/query-bar/basic/basic.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/query-bar/fields/fields.component.html` |
| TASK-004 | EDIT | `src/libs/components/query-bar/fields/fields.component.scss` |
| TASK-004 | EDIT | `src/libs/components/query-bar/fields/fields.component.ts` |
| TASK-004 | CREATE | `src/libs/components/query-bar/fields/fields.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/query-bar/modes/modes.component.html` |
| TASK-004 | EDIT | `src/libs/components/query-bar/modes/modes.component.scss` |
| TASK-004 | EDIT | `src/libs/components/query-bar/modes/modes.component.ts` |
| TASK-004 | CREATE | `src/libs/components/query-bar/modes/modes.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/routes.ts` |
| TASK-004 | EDIT | `src/libs/components/section/basic/basic.component.html` |
| TASK-004 | EDIT | `src/libs/components/section/basic/basic.component.scss` |
| TASK-004 | EDIT | `src/libs/components/section/basic/basic.component.ts` |
| TASK-004 | CREATE | `src/libs/components/section/basic/basic.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/section/header-slots/header-slots.component.html` |
| TASK-004 | EDIT | `src/libs/components/section/header-slots/header-slots.component.scss` |
| TASK-004 | EDIT | `src/libs/components/section/header-slots/header-slots.component.ts` |
| TASK-004 | CREATE | `src/libs/components/section/header-slots/header-slots.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/section/section-item/section-item.component.html` |
| TASK-004 | EDIT | `src/libs/components/section/section-item/section-item.component.scss` |
| TASK-004 | EDIT | `src/libs/components/section/section-item/section-item.component.ts` |
| TASK-004 | CREATE | `src/libs/components/section/section-item/section-item.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/advanced/advanced.component.html` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/advanced/advanced.component.scss` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/advanced/advanced.component.ts` |
| TASK-004 | CREATE | `src/libs/components/side-drawer/advanced/advanced.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/basic/basic.component.html` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/basic/basic.component.scss` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/basic/basic.component.ts` |
| TASK-004 | CREATE | `src/libs/components/side-drawer/basic/basic.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/custom/custom.component.html` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/custom/custom.component.scss` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/custom/custom.component.ts` |
| TASK-004 | CREATE | `src/libs/components/side-drawer/custom/custom.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/loading/loading.component.html` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/loading/loading.component.scss` |
| TASK-004 | EDIT | `src/libs/components/side-drawer/loading/loading.component.ts` |
| TASK-004 | CREATE | `src/libs/components/side-drawer/loading/loading.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/splitter/splitter.component.html` |
| TASK-004 | EDIT | `src/libs/components/splitter/splitter.component.scss` |
| TASK-004 | EDIT | `src/libs/components/splitter/splitter.component.ts` |
| TASK-004 | CREATE | `src/libs/components/splitter/splitter.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/table/basic/basic.component.html` |
| TASK-004 | EDIT | `src/libs/components/table/basic/basic.component.scss` |
| TASK-004 | EDIT | `src/libs/components/table/basic/basic.component.ts` |
| TASK-004 | CREATE | `src/libs/components/table/basic/basic.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/table/column/column.component.html` |
| TASK-004 | EDIT | `src/libs/components/table/column/column.component.scss` |
| TASK-004 | EDIT | `src/libs/components/table/column/column.component.ts` |
| TASK-004 | CREATE | `src/libs/components/table/column/column.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/table/filter/filter.component.html` |
| TASK-004 | EDIT | `src/libs/components/table/filter/filter.component.scss` |
| TASK-004 | EDIT | `src/libs/components/table/filter/filter.component.ts` |
| TASK-004 | CREATE | `src/libs/components/table/filter/filter.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/table/index-column/index-column.component.html` |
| TASK-004 | EDIT | `src/libs/components/table/index-column/index-column.component.scss` |
| TASK-004 | EDIT | `src/libs/components/table/index-column/index-column.component.ts` |
| TASK-004 | CREATE | `src/libs/components/table/index-column/index-column.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/table/tree/tree.component.html` |
| TASK-004 | EDIT | `src/libs/components/table/tree/tree.component.scss` |
| TASK-004 | EDIT | `src/libs/components/table/tree/tree.component.ts` |
| TASK-004 | CREATE | `src/libs/components/table/tree/tree.stories.ts` |
| TASK-004 | EDIT | `src/libs/components/upload-file/upload-file.component.html` |
| TASK-004 | EDIT | `src/libs/components/upload-file/upload-file.component.scss` |
| TASK-004 | EDIT | `src/libs/components/upload-file/upload-file.component.ts` |
| TASK-004 | CREATE | `src/libs/components/upload-file/upload-file.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/checkbox/checkbox.component.html` |
| TASK-004 | EDIT | `src/libs/forms/checkbox/checkbox.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/checkbox/checkbox.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/checkbox/checkbox.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/chip-calendar/chip-calendar.component.html` |
| TASK-004 | EDIT | `src/libs/forms/chip-calendar/chip-calendar.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/chip-calendar/chip-calendar.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/chip-calendar/chip-calendar.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/chip/chip.component.html` |
| TASK-004 | EDIT | `src/libs/forms/chip/chip.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/chip/chip.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/chip/chip.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/date/date.component.html` |
| TASK-004 | EDIT | `src/libs/forms/date/date.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/date/date.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/date/date.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/datetime/datetime.component.html` |
| TASK-004 | EDIT | `src/libs/forms/datetime/datetime.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/datetime/datetime.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/datetime/datetime.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/index.ts` |
| TASK-004 | EDIT | `src/libs/forms/input-number/input-number.component.html` |
| TASK-004 | EDIT | `src/libs/forms/input-number/input-number.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/input-number/input-number.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/input-number/input-number.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/input/input.component.html` |
| TASK-004 | EDIT | `src/libs/forms/input/input.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/input/input.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/input/input.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/radio/radio.component.html` |
| TASK-004 | EDIT | `src/libs/forms/radio/radio.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/radio/radio.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/radio/radio.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/routes.ts` |
| TASK-004 | EDIT | `src/libs/forms/select/select.component.html` |
| TASK-004 | EDIT | `src/libs/forms/select/select.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/select/select.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/select/select.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/switch/switch.component.html` |
| TASK-004 | EDIT | `src/libs/forms/switch/switch.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/switch/switch.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/switch/switch.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/textarea/textarea.component.html` |
| TASK-004 | EDIT | `src/libs/forms/textarea/textarea.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/textarea/textarea.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/textarea/textarea.stories.ts` |
| TASK-004 | EDIT | `src/libs/forms/validation/validation.component.html` |
| TASK-004 | EDIT | `src/libs/forms/validation/validation.component.scss` |
| TASK-004 | EDIT | `src/libs/forms/validation/validation.component.ts` |
| TASK-004 | CREATE | `src/libs/forms/validation/validation.stories.ts` |
| TASK-004 | EDIT | `src/libs/instructions/coding-conventions-typescript/coding-conventions-typescript.component.ts` |
| TASK-004 | EDIT | `src/libs/instructions/coding-conventions/coding-conventions.component.ts` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/custom-theme.component.html` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/custom-theme.component.scss` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/custom-theme.component.ts` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/guide/guide.component.html` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/guide/guide.component.scss` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/guide/guide.component.ts` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/tool/tool.component.html` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/tool/tool.component.scss` |
| TASK-004 | EDIT | `src/libs/instructions/custom-theme/tool/tool.component.ts` |
| TASK-004 | EDIT | `src/libs/instructions/index.ts` |
| TASK-004 | EDIT | `src/libs/instructions/instroduction/instroduction.component.html` |
| TASK-004 | EDIT | `src/libs/instructions/instroduction/instroduction.component.scss` |
| TASK-004 | EDIT | `src/libs/instructions/instroduction/instroduction.component.ts` |
| TASK-004 | EDIT | `src/libs/instructions/portal-config/portal-config.component.html` |
| TASK-004 | EDIT | `src/libs/instructions/portal-config/portal-config.component.scss` |
| TASK-004 | EDIT | `src/libs/instructions/portal-config/portal-config.component.ts` |
| TASK-004 | EDIT | `src/libs/instructions/routes.ts` |
| TASK-004 | EDIT | `src/libs/patterns/index.ts` |
| TASK-004 | EDIT | `src/libs/patterns/list/base/base.component.html` |
| TASK-004 | EDIT | `src/libs/patterns/list/base/base.component.scss` |
| TASK-004 | EDIT | `src/libs/patterns/list/base/base.component.ts` |
| TASK-004 | EDIT | `src/libs/patterns/page-builder/page-builder.component.html` |
| TASK-004 | EDIT | `src/libs/patterns/page-builder/page-builder.component.scss` |
| TASK-004 | EDIT | `src/libs/patterns/page-builder/page-builder.component.ts` |
| TASK-004 | EDIT | `src/libs/patterns/routes.ts` |
| TASK-004 | EDIT | `src/libs/patterns/shared/demo-button/demo-button.component.html` |
| TASK-004 | EDIT | `src/libs/patterns/shared/demo-button/demo-button.component.scss` |
| TASK-004 | EDIT | `src/libs/patterns/shared/demo-button/demo-button.component.ts` |
| TASK-004 | EDIT | `src/libs/patterns/shared/demo-table/demo-table.component.html` |
| TASK-004 | EDIT | `src/libs/patterns/shared/demo-table/demo-table.component.scss` |
| TASK-004 | EDIT | `src/libs/patterns/shared/demo-table/demo-table.component.ts` |
| TASK-004 | EDIT | `src/libs/services/confirm/confirm/confirm.component.html` |
| TASK-004 | EDIT | `src/libs/services/confirm/confirm/confirm.component.scss` |
| TASK-004 | EDIT | `src/libs/services/confirm/confirm/confirm.component.ts` |
| TASK-004 | CREATE | `src/libs/services/confirm/confirm/confirm.stories.ts` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-date/with-date.component.html` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-date/with-date.component.scss` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-date/with-date.component.ts` |
| TASK-004 | CREATE | `src/libs/services/confirm/with-date/with-date.stories.ts` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-input/with-input.component.html` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-input/with-input.component.scss` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-input/with-input.component.ts` |
| TASK-004 | CREATE | `src/libs/services/confirm/with-input/with-input.stories.ts` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-radio/with-radio.component.html` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-radio/with-radio.component.scss` |
| TASK-004 | EDIT | `src/libs/services/confirm/with-radio/with-radio.component.ts` |
| TASK-004 | CREATE | `src/libs/services/confirm/with-radio/with-radio.stories.ts` |
| TASK-004 | EDIT | `src/libs/services/index.ts` |
| TASK-004 | EDIT | `src/libs/services/loading/loading.component.html` |
| TASK-004 | EDIT | `src/libs/services/loading/loading.component.scss` |
| TASK-004 | EDIT | `src/libs/services/loading/loading.component.ts` |
| TASK-004 | CREATE | `src/libs/services/loading/loading.stories.ts` |
| TASK-004 | EDIT | `src/libs/services/notify/notify.component.html` |
| TASK-004 | EDIT | `src/libs/services/notify/notify.component.scss` |
| TASK-004 | EDIT | `src/libs/services/notify/notify.component.ts` |
| TASK-004 | CREATE | `src/libs/services/notify/notify.stories.ts` |
| TASK-004 | EDIT | `src/libs/services/routes.ts` |
| TASK-004 | CREATE | `src/libs/services/unsaved-changes/unsaved-changes.component.ts` |
| TASK-004 | CREATE | `src/libs/services/unsaved-changes/unsaved-changes.stories.ts` |
| TASK-004 | CREATE | `src/libs/shared/demo-harness.spec.ts` |
| TASK-004 | CREATE | `src/libs/shared/demo-harness.ts` |
| TASK-004 | CREATE | `src/libs/shared/demo-inventory.ts` |
| TASK-004 | EDIT | `src/libs/utilities/icons/icons.component.html` |
| TASK-004 | EDIT | `src/libs/utilities/icons/icons.component.scss` |
| TASK-004 | EDIT | `src/libs/utilities/icons/icons.component.ts` |
| TASK-004 | EDIT | `src/libs/utilities/index.ts` |
| TASK-004 | EDIT | `src/libs/utilities/routes.ts` |
| TASK-004 | EDIT | `src/libs/utilities/tooltip/tooltip.component.html` |
| TASK-004 | EDIT | `src/libs/utilities/tooltip/tooltip.component.scss` |
| TASK-004 | EDIT | `src/libs/utilities/tooltip/tooltip.component.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/demo-session.store.spec.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/demo-session.store.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/demo-state.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/fixture-factories.spec.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/fixture-factories.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/models.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/query.spec.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/query.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/validators.spec.ts` |
| TASK-005 | CREATE | `src/libs/pages/data/validators.ts` |
| TASK-006 | CREATE | `docs/page-patterns.md` |
| TASK-006 | CREATE | `public/catalog/page-pattern-sources.v1.json` |
| TASK-006 | CREATE | `public/catalog/page-patterns.v1.json` |
| TASK-006 | CREATE | `scripts/export-page-catalog.mjs` |
| TASK-006 | CREATE | `scripts/export-page-catalog.test.mjs` |
| TASK-006 | CREATE | `src/libs/pages/catalog/pattern-loaders.ts` |
| TASK-006 | CREATE | `src/libs/pages/catalog/pattern-registry.spec.ts` |
| TASK-006 | CREATE | `src/libs/pages/catalog/pattern-registry.ts` |
| TASK-006 | CREATE | `src/libs/pages/catalog/pattern.model.ts` |
| TASK-007 | CREATE | `src/libs/pages/components/entity-facts.component.html` |
| TASK-007 | CREATE | `src/libs/pages/components/entity-facts.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/components/entity-facts.component.ts` |
| TASK-007 | CREATE | `src/libs/pages/components/related-records.component.html` |
| TASK-007 | CREATE | `src/libs/pages/components/related-records.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/components/related-records.component.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-overview/detail-overview.component.html` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-overview/detail-overview.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-overview/detail-overview.component.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-patterns.spec.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-related-records/detail-related-records.component.html` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-related-records/detail-related-records.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-related-records/detail-related-records.component.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.html` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.html` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.html` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-master-detail/list-master-detail.component.html` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-master-detail/list-master-detail.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-master-detail/list-master-detail.component.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-patterns.spec.ts` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-standard/list-standard.component.html` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-standard/list-standard.component.scss` |
| TASK-007 | CREATE | `src/libs/pages/patterns/list-standard/list-standard.component.ts` |
| TASK-008 | CREATE | `src/libs/pages/components/entity-form-sections.component.html` |
| TASK-008 | CREATE | `src/libs/pages/components/entity-form-sections.component.scss` |
| TASK-008 | CREATE | `src/libs/pages/components/entity-form-sections.component.ts` |
| TASK-008 | CREATE | `src/libs/pages/components/line-item-editor.component.html` |
| TASK-008 | CREATE | `src/libs/pages/components/line-item-editor.component.scss` |
| TASK-008 | CREATE | `src/libs/pages/components/line-item-editor.component.spec.ts` |
| TASK-008 | CREATE | `src/libs/pages/components/line-item-editor.component.ts` |
| TASK-008 | CREATE | `src/libs/pages/components/unsaved-changes.guard.ts` |
| TASK-008 | CREATE | `src/libs/pages/patterns/drawer-compact/drawer-compact.component.html` |
| TASK-008 | CREATE | `src/libs/pages/patterns/drawer-compact/drawer-compact.component.scss` |
| TASK-008 | CREATE | `src/libs/pages/patterns/drawer-compact/drawer-compact.component.ts` |
| TASK-008 | CREATE | `src/libs/pages/patterns/drawer-patterns.spec.ts` |
| TASK-008 | CREATE | `src/libs/pages/patterns/drawer-sections/drawer-sections.component.html` |
| TASK-008 | CREATE | `src/libs/pages/patterns/drawer-sections/drawer-sections.component.scss` |
| TASK-008 | CREATE | `src/libs/pages/patterns/drawer-sections/drawer-sections.component.ts` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-line-items/form-line-items.component.html` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-line-items/form-line-items.component.scss` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-line-items/form-line-items.component.ts` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-patterns.spec.ts` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-sections/form-sections.component.html` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-sections/form-sections.component.scss` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-sections/form-sections.component.ts` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-simple/form-simple.component.html` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-simple/form-simple.component.scss` |
| TASK-008 | CREATE | `src/libs/pages/patterns/form-simple/form-simple.component.ts` |
| TASK-009 | CREATE | `e2e/accessibility.spec.ts` |
| TASK-009 | CREATE | `e2e/helpers/demo-fixtures.ts` |
| TASK-009 | CREATE | `e2e/pages.spec.ts` |
| TASK-009 | CREATE | `e2e/portal-reference.spec.ts` |
| TASK-009 | CREATE | `e2e/storybook.spec.ts` |
| TASK-009 | CREATE | `playwright.config.ts` |
| TASK-010 | EDIT | `README.md` |
| TASK-010 | CREATE | `docs/storybook.md` |
| TASK-010 | CREATE | `docs/verification.md` |

</details>

## Self-review

Parent spec/architecture đã verify hash và owner. Goal-backward kiểm tra coverage R/AC/D/INV → task/path/evidence; không thiếu đường dẫn, duplicate owner hoặc dependency cycle. Validation map kiểm tra cấu trúc, chỉ còn identity ký sau approval. Không coi đây là bằng chứng implementation/build.

## Trạng thái

Chờ duyệt plan để lưu snapshot và bắt đầu execute-plan. Người dùng đã duyệt spec/architecture; plan chưa được duyệt.

<details><summary>Context máy đọc</summary>

```json
{
  "plan_context": {
    "schema_version": 2,
    "source": "sdcorejs-plan",
    "contract_id": "portal-reference-core22",
    "requirement_id": "portal-reference-core22",
    "approved_spec_path": ".sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md",
    "approved_spec_hash": "sha256:v1:0e2aa4f9c75d4684529518d14c71f23f03054757dcea67bb5d0a30d93f52fe1b",
    "approved_spec_reference": {
      "repository_id": "github.com/sdcorejs/portal-template",
      "artifact_id": "spec-portal-reference-core22-r1",
      "artifact_kind": "spec",
      "revision": "4f8d01818005dd7a5925dc6d46e7bfefb271242f",
      "approval_hash": "sha256:v1:0e2aa4f9c75d4684529518d14c71f23f03054757dcea67bb5d0a30d93f52fe1b",
      "repository_relative_path": ".sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md"
    },
    "approved_architecture_path": ".sdcorejs/architecture/angular/2026-09-10-11-34-portal-reference-core22.md",
    "approved_architecture_hash": "sha256:v1:1c5a00e534631b22aa87483e568668f17d88b02a55c977a3b52b42ece5a2d14d",
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
    "architecture_context": {
      "schema_version": 1,
      "source": "sdcorejs-architecture",
      "contract_id": "portal-reference-core22",
      "requirement_id": "R-001",
      "approved_spec_reference": {
        "repository_id": "github.com/sdcorejs/portal-template",
        "artifact_id": "spec-portal-reference-core22-r1",
        "artifact_kind": "spec",
        "revision": "4f8d01818005dd7a5925dc6d46e7bfefb271242f",
        "approval_hash": "sha256:v1:0e2aa4f9c75d4684529518d14c71f23f03054757dcea67bb5d0a30d93f52fe1b"
      },
      "owner_repository_id": "github.com/sdcorejs/portal-template",
      "owner_module_id": null,
      "execution_host_repository_id": "github.com/sdcorejs/portal-template",
      "integration_owner_repository_id": "github.com/sdcorejs/portal-template",
      "trigger": {
        "required": true,
        "signals": [
          "major-dependency",
          "public-api-contract",
          "state-data-ownership"
        ],
        "rationale": "Angular 20 lên 22, tích hợp Storybook, chia sẻ state fixtures và catalog JSON cho consumer/AI."
      },
      "invariants": [
        {
          "id": "INV-001",
          "statement": "Portal và Storybook dùng Core 22.2.7, theme cùng nguồn, runtime hợp lệ",
          "scope": "portal-composition",
          "owner": "github.com/sdcorejs/portal-template",
          "rationale": "Bảo đảm đặc tả được triển khai nhất quán giữa các host và pattern.",
          "verification_method": "Lockfile/peer check; build portal và Storybook; đối chiếu theme",
          "requirement_refs": [
            "R-001",
            "R-002"
          ],
          "decision_refs": [
            "D-001"
          ]
        },
        {
          "id": "INV-002",
          "statement": "Demo không phụ thuộc host, auth thật hoặc state mutable global",
          "scope": "portal-composition",
          "owner": "github.com/sdcorejs/portal-template",
          "rationale": "Bảo đảm đặc tả được triển khai nhất quán giữa các host và pattern.",
          "verification_method": "Import-boundary check; hai instance và hai story không ảnh hưởng nhau",
          "requirement_refs": [
            "R-002",
            "R-004"
          ],
          "decision_refs": [
            "D-002"
          ]
        },
        {
          "id": "INV-003",
          "statement": "Mỗi query/form/entity có một owner; tab không mất draft, rời/reset được kiểm soát",
          "scope": "portal-composition",
          "owner": "github.com/sdcorejs/portal-template",
          "rationale": "Bảo đảm đặc tả được triển khai nhất quán giữa các host và pattern.",
          "verification_method": "Query/dirty/focus/route tests; reset và mutation scenarios",
          "requirement_refs": [
            "R-004",
            "R-005"
          ],
          "decision_refs": [
            "D-003"
          ]
        },
        {
          "id": "INV-004",
          "statement": "Catalog JSON/guide/navigation cùng metadata, có đủ 12 ID và source/route hợp lệ",
          "scope": "portal-composition",
          "owner": "github.com/sdcorejs/portal-template",
          "rationale": "Bảo đảm đặc tả được triển khai nhất quán giữa các host và pattern.",
          "verification_method": "Schema/ID/route/source consistency test; export reproducible",
          "requirement_refs": [
            "R-005"
          ],
          "decision_refs": [
            "D-003"
          ]
        },
        {
          "id": "INV-005",
          "statement": "Pages giữ bố cục 1; component reuse và hierarchy dùng Core thật",
          "scope": "portal-composition",
          "owner": "github.com/sdcorejs/portal-template",
          "rationale": "Bảo đảm đặc tả được triển khai nhất quán giữa các host và pattern.",
          "verification_method": "UI check desktop/mobile/zoom; kiểm tra header lồng và preview width",
          "requirement_refs": [
            "R-003",
            "R-004"
          ],
          "decision_refs": [
            "D-002",
            "D-003"
          ]
        },
        {
          "id": "INV-006",
          "statement": "Sales-platform chỉ là tham khảo; fixtures tổng hợp và data access không gọi backend thật",
          "scope": "portal-composition",
          "owner": "github.com/sdcorejs/portal-template",
          "rationale": "Bảo đảm đặc tả được triển khai nhất quán giữa các host và pattern.",
          "verification_method": "Kiểm tra import/source, request interception tests và story isolation",
          "requirement_refs": [
            "R-002",
            "R-003",
            "R-005"
          ],
          "decision_refs": [
            "D-002"
          ]
        }
      ],
      "boundaries": [
        {
          "id": "BOUNDARY-001",
          "statement": "Portal shell và reference wrapper sở hữu navigation, không sở hữu entity/form state.",
          "invariant_refs": [
            "INV-002",
            "INV-003",
            "INV-005"
          ]
        },
        {
          "id": "BOUNDARY-002",
          "statement": "Stories dùng demo standalone, không import application bootstrap.",
          "invariant_refs": [
            "INV-001",
            "INV-002"
          ]
        },
        {
          "id": "BOUNDARY-003",
          "statement": "Metadata thuần tách khỏi Angular loaders và runtime store.",
          "invariant_refs": [
            "INV-004"
          ]
        }
      ],
      "dependency_directions": [
        {
          "from": "Portal và Storybook",
          "to": "Demo presentation, Core 22.2.7 và shared theme",
          "rationale": "Một nguồn implementation, toolchain major tương thích.",
          "invariant_refs": [
            "INV-001",
            "INV-002"
          ]
        },
        {
          "from": "Demo container",
          "to": "Session store và pure fixture/query/validation functions",
          "rationale": "Isolate state theo instance; tránh global mutable entity.",
          "invariant_refs": [
            "INV-002",
            "INV-003"
          ]
        },
        {
          "from": "Reference view và export builder",
          "to": "Pure catalog metadata",
          "rationale": "Một nguồn JSON/Markdown; metadata không kéo Angular vào exporter.",
          "invariant_refs": [
            "INV-004"
          ]
        }
      ],
      "data_state_owners": [
        {
          "subject": "Entity và mutation trong demo session",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner": "Demo session provider theo instance/route cha",
          "lifecycle": "Seed khi vào demo, reset có chủ ý, destroy khi rời demo.",
          "invariant_refs": [
            "INV-002",
            "INV-003"
          ]
        },
        {
          "subject": "Query/selection và form draft",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner": "List/form container",
          "lifecycle": "Tab giữ state; đổi pattern giải quyết dirty; selection current page.",
          "invariant_refs": [
            "INV-003"
          ]
        },
        {
          "subject": "Locale/format và theme",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner": "Host configuration và shared theme source",
          "lifecycle": "Portal settings tồn tại theo cơ chế cũ; story settings độc lập.",
          "invariant_refs": [
            "INV-001"
          ]
        }
      ],
      "public_contracts": [
        {
          "id": "CONTRACT-001",
          "kind": "api",
          "statement": "Catalog static v1: envelope schemaVersion/coreVersion/patterns; pure metadata là nguồn JSON, Markdown và navigation.",
          "owner": "github.com/sdcorejs/portal-template",
          "compatibility": "Add optional fields giữ v1; breaking change bump schema major; stable pattern IDs.",
          "migration": "Contract mới v1 chưa có consumer cũ. Thay ID cần alias/deprecation; không phát sinh API server.",
          "invariant_refs": [
            "INV-004"
          ]
        }
      ],
      "security_trust_boundaries": [
        {
          "id": "TRUST-001",
          "statement": "Demo fixtures tổng hợp, stories không đăng ký auth interceptor hay gọi backend thật; source preview escape và không lộ absolute local path.",
          "invariant_refs": [
            "INV-002",
            "INV-006"
          ]
        }
      ],
      "cross_repository_integration": [],
      "adopted_decision_refs": [
        "D-001",
        "D-002",
        "D-003"
      ],
      "deferred_decision_refs": [],
      "assumption_refs": [
        "A-001",
        "A-002",
        "A-003"
      ],
      "validation_obligations": [
        {
          "id": "VAL-001",
          "expected_proof": "Lockfile/peer check; build portal và Storybook; đối chiếu theme",
          "owner": "github.com/sdcorejs/portal-template",
          "invariant_refs": [
            "INV-001"
          ],
          "acceptance_criterion_refs": [
            "AC-001",
            "AC-002",
            "AC-012"
          ]
        },
        {
          "id": "VAL-002",
          "expected_proof": "Import-boundary check; hai instance và hai story không ảnh hưởng nhau",
          "owner": "github.com/sdcorejs/portal-template",
          "invariant_refs": [
            "INV-002"
          ],
          "acceptance_criterion_refs": [
            "AC-003",
            "AC-009"
          ]
        },
        {
          "id": "VAL-003",
          "expected_proof": "Query/dirty/focus/route tests; reset và mutation scenarios",
          "owner": "github.com/sdcorejs/portal-template",
          "invariant_refs": [
            "INV-003"
          ],
          "acceptance_criterion_refs": [
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-011"
          ]
        },
        {
          "id": "VAL-004",
          "expected_proof": "Schema/ID/route/source consistency test; export reproducible",
          "owner": "github.com/sdcorejs/portal-template",
          "invariant_refs": [
            "INV-004"
          ],
          "acceptance_criterion_refs": [
            "AC-005",
            "AC-010"
          ]
        },
        {
          "id": "VAL-005",
          "expected_proof": "UI check desktop/mobile/zoom; kiểm tra header lồng và preview width",
          "owner": "github.com/sdcorejs/portal-template",
          "invariant_refs": [
            "INV-005"
          ],
          "acceptance_criterion_refs": [
            "AC-004",
            "AC-006",
            "AC-011"
          ]
        },
        {
          "id": "VAL-006",
          "expected_proof": "Kiểm tra import/source, request interception tests và story isolation",
          "owner": "github.com/sdcorejs/portal-template",
          "invariant_refs": [
            "INV-006"
          ],
          "acceptance_criterion_refs": [
            "AC-003",
            "AC-009"
          ]
        }
      ],
      "profile_sections": {
        "frontend_architecture_ref": {
          "reference": "plan_context.frontend_architecture",
          "conformance_invariant_refs": [
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "agent_architecture_ref": null
      },
      "change_control": {
        "revision": 1,
        "supersedes": null
      },
      "approved_architecture_path": ".sdcorejs/architecture/angular/2026-09-10-11-34-portal-reference-core22.md",
      "approved_architecture_hash": "sha256:v1:1c5a00e534631b22aa87483e568668f17d88b02a55c977a3b52b42ece5a2d14d"
    },
    "decision_coverage": {
      "schema_version": 1,
      "revision": 4,
      "records": [
        {
          "id": "R-001",
          "type": "requirement",
          "statement": "Nâng portal lên Core chính xác `22.2.7`, đồng bộ framework/toolchain tương thích.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": [
            "TASK-001",
            "TASK-003",
            "TASK-004",
            "TASK-009",
            "TASK-010"
          ]
        },
        {
          "id": "R-002",
          "type": "requirement",
          "statement": "Cung cấp Storybook cho Components, Forms và Services, có ví dụ tương tác và tài liệu sử dụng.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": [
            "TASK-004",
            "TASK-009",
            "TASK-010"
          ]
        },
        {
          "id": "R-003",
          "type": "requirement",
          "statement": "Đồng nhất shell, layout và quy tắc UI/UX; tham khảo sales-platform và điều chỉnh theo Core hiện tại.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": [
            "TASK-002",
            "TASK-003",
            "TASK-004",
            "TASK-007",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ]
        },
        {
          "id": "R-004",
          "type": "requirement",
          "statement": "Có mục Pages với các loại list, detail/create/update dạng page và side-drawer, đặt tên rõ ràng.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": [
            "TASK-002",
            "TASK-003",
            "TASK-005",
            "TASK-006",
            "TASK-007",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ]
        },
        {
          "id": "R-005",
          "type": "requirement",
          "statement": "Mỗi mẫu giúp consumer/AI chọn và tái sử dụng theo dữ liệu module/entity, có dữ liệu mẫu cân đối và hướng dẫn lựa chọn.",
          "source": "explicit-user",
          "status": "active",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner_module_id": null,
          "task_refs": [
            "TASK-005",
            "TASK-006",
            "TASK-007",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ]
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
          "task_refs": [
            "TASK-001",
            "TASK-004",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-001",
            "EVIDENCE-004",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-004",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-004",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-004",
            "TASK-009"
          ],
          "evidence_refs": [
            "EVIDENCE-004",
            "EVIDENCE-009"
          ]
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
          "task_refs": [
            "TASK-002",
            "TASK-003",
            "TASK-007",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-002",
            "EVIDENCE-003",
            "EVIDENCE-007",
            "EVIDENCE-008",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-003",
            "TASK-006",
            "TASK-007",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-003",
            "EVIDENCE-006",
            "EVIDENCE-007",
            "EVIDENCE-008",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-002",
            "TASK-003",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-002",
            "EVIDENCE-003",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-005",
            "TASK-007",
            "TASK-009"
          ],
          "evidence_refs": [
            "EVIDENCE-005",
            "EVIDENCE-007",
            "EVIDENCE-009"
          ]
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
          "task_refs": [
            "TASK-005",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-005",
            "EVIDENCE-008",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-005",
            "TASK-007",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-005",
            "EVIDENCE-007",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-006",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-006",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-002",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-002",
            "EVIDENCE-008",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "task_refs": [
            "TASK-001",
            "TASK-003",
            "TASK-004",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-001",
            "EVIDENCE-003",
            "EVIDENCE-004",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
          "owner": "sdcorejs-spec",
          "task_refs": [
            "TASK-005",
            "TASK-006"
          ]
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
          "owner": "sdcorejs-spec",
          "task_refs": [
            "TASK-005",
            "TASK-006"
          ]
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
          "owner": "sdcorejs-spec",
          "task_refs": [
            "TASK-005",
            "TASK-006"
          ]
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
          "task_refs": [
            "TASK-001"
          ]
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
          "task_refs": [
            "TASK-002"
          ]
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
          "task_refs": [
            "TASK-002",
            "TASK-003"
          ]
        },
        {
          "id": "D-004",
          "type": "decision",
          "statement": "Validation scope là demo cục bộ; không có server authorization contract.",
          "question": "Có authorization boundary phải kiểm chứng bằng server denial không?",
          "selected_value": "none — demo local, không bổ sung auth/backend",
          "source": "approved-architecture",
          "status": "approved",
          "blocking": true,
          "scope": "repository",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "rationale": "Architecture đã duyệt giới hạn fixtures local và không gọi backend thật.",
          "supersedes": null,
          "revisit_condition": "Nếu phạm vi bổ sung backend/auth thật thì phải duyệt lại spec/architecture và validation boundary.",
          "convention_impact": {
            "candidate": false,
            "category": null
          },
          "downstream_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ],
          "validation_boundary": {
            "kind": "none",
            "source_refs": [
              "R-001",
              "R-002",
              "R-003",
              "R-004",
              "R-005",
              "AC-001",
              "AC-002",
              "AC-003",
              "AC-004",
              "AC-005",
              "AC-006",
              "AC-007",
              "AC-008",
              "AC-009",
              "AC-010",
              "AC-011",
              "AC-012",
              "INV-001",
              "INV-002",
              "INV-003",
              "INV-004",
              "INV-005",
              "INV-006"
            ]
          },
          "task_refs": [
            "TASK-009"
          ]
        },
        {
          "id": "INV-001",
          "type": "invariant",
          "statement": "Portal và Storybook dùng Core 22.2.7, theme cùng nguồn, runtime hợp lệ",
          "protected_refs": [
            "R-001",
            "R-002",
            "AC-001",
            "AC-002",
            "AC-012"
          ],
          "task_refs": [
            "TASK-001",
            "TASK-003",
            "TASK-004",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-001",
            "EVIDENCE-003",
            "EVIDENCE-004",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
        },
        {
          "id": "INV-002",
          "type": "invariant",
          "statement": "Demo không phụ thuộc host, auth thật hoặc state mutable global",
          "protected_refs": [
            "R-002",
            "R-004",
            "AC-003",
            "AC-009"
          ],
          "task_refs": [
            "TASK-004",
            "TASK-005",
            "TASK-007",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-004",
            "EVIDENCE-005",
            "EVIDENCE-007",
            "EVIDENCE-008",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
        },
        {
          "id": "INV-003",
          "type": "invariant",
          "statement": "Mỗi query/form/entity có một owner; tab không mất draft, rời/reset được kiểm soát",
          "protected_refs": [
            "R-004",
            "R-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-011"
          ],
          "task_refs": [
            "TASK-003",
            "TASK-005",
            "TASK-007",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-003",
            "EVIDENCE-005",
            "EVIDENCE-007",
            "EVIDENCE-008",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
        },
        {
          "id": "INV-004",
          "type": "invariant",
          "statement": "Catalog JSON/guide/navigation cùng metadata, có đủ 12 ID và source/route hợp lệ",
          "protected_refs": [
            "R-005",
            "AC-005",
            "AC-010"
          ],
          "task_refs": [
            "TASK-006",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-006",
            "EVIDENCE-010"
          ]
        },
        {
          "id": "INV-005",
          "type": "invariant",
          "statement": "Pages giữ bố cục 1; component reuse và hierarchy dùng Core thật",
          "protected_refs": [
            "R-003",
            "R-004",
            "AC-004",
            "AC-006",
            "AC-011"
          ],
          "task_refs": [
            "TASK-002",
            "TASK-003",
            "TASK-007",
            "TASK-008",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-002",
            "EVIDENCE-003",
            "EVIDENCE-007",
            "EVIDENCE-008",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
        },
        {
          "id": "INV-006",
          "type": "invariant",
          "statement": "Sales-platform chỉ là tham khảo; fixtures tổng hợp và data access không gọi backend thật",
          "protected_refs": [
            "R-002",
            "R-003",
            "R-005",
            "AC-003",
            "AC-009"
          ],
          "task_refs": [
            "TASK-004",
            "TASK-005",
            "TASK-009",
            "TASK-010"
          ],
          "evidence_refs": [
            "EVIDENCE-004",
            "EVIDENCE-005",
            "EVIDENCE-009",
            "EVIDENCE-010"
          ]
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
        },
        {
          "revision": 3,
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
            },
            {
              "id": "INV-001",
              "type": "invariant"
            },
            {
              "id": "INV-002",
              "type": "invariant"
            },
            {
              "id": "INV-003",
              "type": "invariant"
            },
            {
              "id": "INV-004",
              "type": "invariant"
            },
            {
              "id": "INV-005",
              "type": "invariant"
            },
            {
              "id": "INV-006",
              "type": "invariant"
            }
          ],
          "tombstones": []
        },
        {
          "revision": 4,
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
            },
            {
              "id": "D-004",
              "type": "decision"
            },
            {
              "id": "INV-001",
              "type": "invariant"
            },
            {
              "id": "INV-002",
              "type": "invariant"
            },
            {
              "id": "INV-003",
              "type": "invariant"
            },
            {
              "id": "INV-004",
              "type": "invariant"
            },
            {
              "id": "INV-005",
              "type": "invariant"
            },
            {
              "id": "INV-006",
              "type": "invariant"
            }
          ],
          "tombstones": []
        }
      ]
    },
    "goal_backward_review": {
      "schema_version": 1,
      "mode": "sdcorejs-plan:goal-backward",
      "decision_coverage": {
        "schema_version": 1,
        "revision": 4,
        "records": [
          {
            "id": "R-001",
            "type": "requirement",
            "statement": "Nâng portal lên Core chính xác `22.2.7`, đồng bộ framework/toolchain tương thích.",
            "source": "explicit-user",
            "status": "active",
            "owner_repository_id": "github.com/sdcorejs/portal-template",
            "owner_module_id": null,
            "task_refs": [
              "TASK-001",
              "TASK-003",
              "TASK-004",
              "TASK-009",
              "TASK-010"
            ]
          },
          {
            "id": "R-002",
            "type": "requirement",
            "statement": "Cung cấp Storybook cho Components, Forms và Services, có ví dụ tương tác và tài liệu sử dụng.",
            "source": "explicit-user",
            "status": "active",
            "owner_repository_id": "github.com/sdcorejs/portal-template",
            "owner_module_id": null,
            "task_refs": [
              "TASK-004",
              "TASK-009",
              "TASK-010"
            ]
          },
          {
            "id": "R-003",
            "type": "requirement",
            "statement": "Đồng nhất shell, layout và quy tắc UI/UX; tham khảo sales-platform và điều chỉnh theo Core hiện tại.",
            "source": "explicit-user",
            "status": "active",
            "owner_repository_id": "github.com/sdcorejs/portal-template",
            "owner_module_id": null,
            "task_refs": [
              "TASK-002",
              "TASK-003",
              "TASK-004",
              "TASK-007",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ]
          },
          {
            "id": "R-004",
            "type": "requirement",
            "statement": "Có mục Pages với các loại list, detail/create/update dạng page và side-drawer, đặt tên rõ ràng.",
            "source": "explicit-user",
            "status": "active",
            "owner_repository_id": "github.com/sdcorejs/portal-template",
            "owner_module_id": null,
            "task_refs": [
              "TASK-002",
              "TASK-003",
              "TASK-005",
              "TASK-006",
              "TASK-007",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ]
          },
          {
            "id": "R-005",
            "type": "requirement",
            "statement": "Mỗi mẫu giúp consumer/AI chọn và tái sử dụng theo dữ liệu module/entity, có dữ liệu mẫu cân đối và hướng dẫn lựa chọn.",
            "source": "explicit-user",
            "status": "active",
            "owner_repository_id": "github.com/sdcorejs/portal-template",
            "owner_module_id": null,
            "task_refs": [
              "TASK-005",
              "TASK-006",
              "TASK-007",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ]
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
            "task_refs": [
              "TASK-001",
              "TASK-004",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-001",
              "EVIDENCE-004",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-004",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-004",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-004",
              "TASK-009"
            ],
            "evidence_refs": [
              "EVIDENCE-004",
              "EVIDENCE-009"
            ]
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
            "task_refs": [
              "TASK-002",
              "TASK-003",
              "TASK-007",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-002",
              "EVIDENCE-003",
              "EVIDENCE-007",
              "EVIDENCE-008",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-003",
              "TASK-006",
              "TASK-007",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-003",
              "EVIDENCE-006",
              "EVIDENCE-007",
              "EVIDENCE-008",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-002",
              "TASK-003",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-002",
              "EVIDENCE-003",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-005",
              "TASK-007",
              "TASK-009"
            ],
            "evidence_refs": [
              "EVIDENCE-005",
              "EVIDENCE-007",
              "EVIDENCE-009"
            ]
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
            "task_refs": [
              "TASK-005",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-005",
              "EVIDENCE-008",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-005",
              "TASK-007",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-005",
              "EVIDENCE-007",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-006",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-006",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-002",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-002",
              "EVIDENCE-008",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "task_refs": [
              "TASK-001",
              "TASK-003",
              "TASK-004",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-001",
              "EVIDENCE-003",
              "EVIDENCE-004",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
            "owner": "sdcorejs-spec",
            "task_refs": [
              "TASK-005",
              "TASK-006"
            ]
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
            "owner": "sdcorejs-spec",
            "task_refs": [
              "TASK-005",
              "TASK-006"
            ]
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
            "owner": "sdcorejs-spec",
            "task_refs": [
              "TASK-005",
              "TASK-006"
            ]
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
            "task_refs": [
              "TASK-001"
            ]
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
            "task_refs": [
              "TASK-002"
            ]
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
            "task_refs": [
              "TASK-002",
              "TASK-003"
            ]
          },
          {
            "id": "D-004",
            "type": "decision",
            "statement": "Validation scope là demo cục bộ; không có server authorization contract.",
            "question": "Có authorization boundary phải kiểm chứng bằng server denial không?",
            "selected_value": "none — demo local, không bổ sung auth/backend",
            "source": "approved-architecture",
            "status": "approved",
            "blocking": true,
            "scope": "repository",
            "owner_repository_id": "github.com/sdcorejs/portal-template",
            "rationale": "Architecture đã duyệt giới hạn fixtures local và không gọi backend thật.",
            "supersedes": null,
            "revisit_condition": "Nếu phạm vi bổ sung backend/auth thật thì phải duyệt lại spec/architecture và validation boundary.",
            "convention_impact": {
              "candidate": false,
              "category": null
            },
            "downstream_refs": [
              "R-001",
              "R-002",
              "R-003",
              "R-004",
              "R-005",
              "AC-001",
              "AC-002",
              "AC-003",
              "AC-004",
              "AC-005",
              "AC-006",
              "AC-007",
              "AC-008",
              "AC-009",
              "AC-010",
              "AC-011",
              "AC-012",
              "INV-001",
              "INV-002",
              "INV-003",
              "INV-004",
              "INV-005",
              "INV-006"
            ],
            "validation_boundary": {
              "kind": "none",
              "source_refs": [
                "R-001",
                "R-002",
                "R-003",
                "R-004",
                "R-005",
                "AC-001",
                "AC-002",
                "AC-003",
                "AC-004",
                "AC-005",
                "AC-006",
                "AC-007",
                "AC-008",
                "AC-009",
                "AC-010",
                "AC-011",
                "AC-012",
                "INV-001",
                "INV-002",
                "INV-003",
                "INV-004",
                "INV-005",
                "INV-006"
              ]
            },
            "task_refs": [
              "TASK-009"
            ]
          },
          {
            "id": "INV-001",
            "type": "invariant",
            "statement": "Portal và Storybook dùng Core 22.2.7, theme cùng nguồn, runtime hợp lệ",
            "protected_refs": [
              "R-001",
              "R-002",
              "AC-001",
              "AC-002",
              "AC-012"
            ],
            "task_refs": [
              "TASK-001",
              "TASK-003",
              "TASK-004",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-001",
              "EVIDENCE-003",
              "EVIDENCE-004",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
          },
          {
            "id": "INV-002",
            "type": "invariant",
            "statement": "Demo không phụ thuộc host, auth thật hoặc state mutable global",
            "protected_refs": [
              "R-002",
              "R-004",
              "AC-003",
              "AC-009"
            ],
            "task_refs": [
              "TASK-004",
              "TASK-005",
              "TASK-007",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-004",
              "EVIDENCE-005",
              "EVIDENCE-007",
              "EVIDENCE-008",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
          },
          {
            "id": "INV-003",
            "type": "invariant",
            "statement": "Mỗi query/form/entity có một owner; tab không mất draft, rời/reset được kiểm soát",
            "protected_refs": [
              "R-004",
              "R-005",
              "AC-006",
              "AC-007",
              "AC-008",
              "AC-011"
            ],
            "task_refs": [
              "TASK-003",
              "TASK-005",
              "TASK-007",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-003",
              "EVIDENCE-005",
              "EVIDENCE-007",
              "EVIDENCE-008",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
          },
          {
            "id": "INV-004",
            "type": "invariant",
            "statement": "Catalog JSON/guide/navigation cùng metadata, có đủ 12 ID và source/route hợp lệ",
            "protected_refs": [
              "R-005",
              "AC-005",
              "AC-010"
            ],
            "task_refs": [
              "TASK-006",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-006",
              "EVIDENCE-010"
            ]
          },
          {
            "id": "INV-005",
            "type": "invariant",
            "statement": "Pages giữ bố cục 1; component reuse và hierarchy dùng Core thật",
            "protected_refs": [
              "R-003",
              "R-004",
              "AC-004",
              "AC-006",
              "AC-011"
            ],
            "task_refs": [
              "TASK-002",
              "TASK-003",
              "TASK-007",
              "TASK-008",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-002",
              "EVIDENCE-003",
              "EVIDENCE-007",
              "EVIDENCE-008",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
          },
          {
            "id": "INV-006",
            "type": "invariant",
            "statement": "Sales-platform chỉ là tham khảo; fixtures tổng hợp và data access không gọi backend thật",
            "protected_refs": [
              "R-002",
              "R-003",
              "R-005",
              "AC-003",
              "AC-009"
            ],
            "task_refs": [
              "TASK-004",
              "TASK-005",
              "TASK-009",
              "TASK-010"
            ],
            "evidence_refs": [
              "EVIDENCE-004",
              "EVIDENCE-005",
              "EVIDENCE-009",
              "EVIDENCE-010"
            ]
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
          },
          {
            "revision": 3,
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
              },
              {
                "id": "INV-001",
                "type": "invariant"
              },
              {
                "id": "INV-002",
                "type": "invariant"
              },
              {
                "id": "INV-003",
                "type": "invariant"
              },
              {
                "id": "INV-004",
                "type": "invariant"
              },
              {
                "id": "INV-005",
                "type": "invariant"
              },
              {
                "id": "INV-006",
                "type": "invariant"
              }
            ],
            "tombstones": []
          },
          {
            "revision": 4,
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
              },
              {
                "id": "D-004",
                "type": "decision"
              },
              {
                "id": "INV-001",
                "type": "invariant"
              },
              {
                "id": "INV-002",
                "type": "invariant"
              },
              {
                "id": "INV-003",
                "type": "invariant"
              },
              {
                "id": "INV-004",
                "type": "invariant"
              },
              {
                "id": "INV-005",
                "type": "invariant"
              },
              {
                "id": "INV-006",
                "type": "invariant"
              }
            ],
            "tombstones": []
          }
        ]
      },
      "goals": [
        {
          "id": "G-001",
          "statement": "Core22 và demo reference dùng chung ổn định",
          "task_refs": [
            "TASK-001",
            "TASK-002",
            "TASK-003",
            "TASK-004"
          ]
        },
        {
          "id": "G-002",
          "statement": "12 mẫu có dữ liệu và tiêu chí chọn cho consumer/AI",
          "task_refs": [
            "TASK-005",
            "TASK-006",
            "TASK-007",
            "TASK-008"
          ]
        },
        {
          "id": "G-003",
          "statement": "Kiểm chứng và hướng dẫn có thể tái lập",
          "task_refs": [
            "TASK-009",
            "TASK-010"
          ]
        }
      ],
      "tasks": [
        {
          "id": "TASK-001",
          "title": "Runtime, dependency và build/test tooling",
          "phase": 1,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [],
          "planned_paths": [
            ".gitignore",
            "angular.json",
            "eslint.config.js",
            "package-lock.json",
            "package.json",
            "scripts/check-toolchain.mjs",
            "tsconfig.app.json",
            "tsconfig.json",
            "tsconfig.spec.json"
          ],
          "justification_refs": [
            "R-001",
            "D-001"
          ],
          "enforces_invariant_refs": [
            "INV-001"
          ],
          "acceptance_refs": [
            "AC-001",
            "AC-012"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-001",
              "record_refs": [
                "R-001",
                "D-001",
                "AC-001",
                "AC-012",
                "INV-001"
              ],
              "expected_proof": "Installed Core exact + peer tree hợp lệ; toolchain script kiểm tra runtime/version; build sau migration đạt."
            }
          ],
          "work": "Dùng Node 24.19.0 đã có trong Codex bằng PATH của process. Pin Core 22.2.7; Angular/Material 22.1.6; CLI/build/devkit 22.1.7; TS 6.0.3; angular-eslint 22.5.0; typescript-eslint 8.70.0; Storybook/angular/addon-docs 10.6.0; Playwright 1.63.0. Giữ Karma/Jasmine khi tương thích; không đổi test framework ngoài migration bắt buộc. Khai báo scripts mới trước các task tạo implementation. Giữ configurations/budgets; sửa asset references bị thiếu theo public/source thực tế. Đổi providers/API thuộc task sở hữu tương ứng. Nếu compiler còn lỗi ở demo cũ, ghi rõ và xử lý TASK-004 trước khi kết luận build đạt.",
          "proof": "Installed Core exact + peer tree hợp lệ; toolchain script kiểm tra runtime/version; build sau migration đạt."
        },
        {
          "id": "TASK-002",
          "title": "Handoff thiết kế theo bố cục đã chọn",
          "phase": 1,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-001"
          ],
          "planned_paths": [
            ".sdcorejs/design/decisions/portal-reference-core22.md",
            ".sdcorejs/design/flows/portal-reference-core22.md",
            ".sdcorejs/design/specs/portal-reference-core22.md",
            ".sdcorejs/design/wireframes/portal-reference-core22/detail-tabbed.html",
            ".sdcorejs/design/wireframes/portal-reference-core22/drawer-compact.html",
            ".sdcorejs/design/wireframes/portal-reference-core22/form-sections.html",
            ".sdcorejs/design/wireframes/portal-reference-core22/list-standard.html",
            ".sdcorejs/docs/design/portal-reference-core22.md"
          ],
          "justification_refs": [
            "R-003",
            "R-004",
            "D-002",
            "D-003"
          ],
          "enforces_invariant_refs": [
            "INV-005"
          ],
          "acceptance_refs": [
            "AC-004",
            "AC-006",
            "AC-011"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-002",
              "record_refs": [
                "R-003",
                "R-004",
                "D-002",
                "D-003",
                "AC-004",
                "AC-006",
                "AC-011",
                "INV-005"
              ],
              "expected_proof": "Handoff/wireframes đủ 4 screen families, API reuse được đối chiếu Core 22.2.7 và component map không có boundary mơ hồ."
            }
          ],
          "work": "Dùng sdcorejs-design. Hoàn thiện token/source map, hierarchy list/detail/form/drawer, states, desktop/tablet/mobile, focus/dirty. 4 wireframe HTML editable phản ánh layout 1, không mở lại lựa chọn. Handoff liên kết approved spec/architecture/plan; nhận xét từ sales-platform là source reference, không ảnh UI thật. Không thêm renderer dependency hay tạo PNG nếu không cần.",
          "proof": "Handoff/wireframes đủ 4 screen families, API reuse được đối chiếu Core 22.2.7 và component map không có boundary mơ hồ."
        },
        {
          "id": "TASK-003",
          "title": "Shell, reference layout và route integration",
          "phase": 2,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-001",
            "TASK-002",
            "TASK-005"
          ],
          "planned_paths": [
            "src/app/app.routes.ts",
            "src/app/components/main/main.component.html",
            "src/app/components/main/main.component.ts",
            "src/app/configurations/auth.configuration.ts",
            "src/app/configurations/index.ts",
            "src/app/configurations/layout.configuration.ts",
            "src/app/configurations/permission.configuration.ts",
            "src/app/configurations/portal-config.ts",
            "src/app/reference-providers.ts",
            "src/libs/pages/index.ts",
            "src/libs/pages/reference/demo-host.component.html",
            "src/libs/pages/reference/demo-host.component.scss",
            "src/libs/pages/reference/demo-host.component.spec.ts",
            "src/libs/pages/reference/demo-host.component.ts",
            "src/libs/pages/reference/page-reference.component.html",
            "src/libs/pages/reference/page-reference.component.scss",
            "src/libs/pages/reference/page-reference.component.spec.ts",
            "src/libs/pages/reference/page-reference.component.ts",
            "src/libs/pages/routes.ts",
            "src/main.ts",
            "src/styles.scss",
            "src/styles/reference.scss"
          ],
          "justification_refs": [
            "R-001",
            "R-003",
            "R-004",
            "D-003"
          ],
          "enforces_invariant_refs": [
            "INV-001",
            "INV-003",
            "INV-005"
          ],
          "acceptance_refs": [
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-012"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-003",
              "record_refs": [
                "R-001",
                "R-003",
                "R-004",
                "D-003",
                "AC-004",
                "AC-005",
                "AC-006",
                "AC-012",
                "INV-001",
                "INV-003",
                "INV-005"
              ],
              "expected_proof": "Router integration không mất state hoặc lồng shell; settings cũ hoạt động; focus và resize có kiểm chứng browser."
            }
          ],
          "work": "Giữ Core sd-layout và locale/number-format/tab-router. Tạo PageReference với tab Preview/Hướng dẫn/Dữ liệu/Source; tạo lazy preview một lần, ẩn mà không destroy khi đổi tab. DemoHost sở hữu provider phiên; route demo đứng trước :patternId. Wrapper không import Storybook. Main menus đăng ký Pages; không hardcode 12 metadata ở nhiều nơi. TDD cho tab survival/route precedence; template/style theo handoff. Hoàn thiện generic shell/host trước; đăng ký concrete loader/routes sau khi TASK-006/007/008 có file đích, giữ đúng owner TASK-003 và kiểm tra tích hợp trước TASK-009. Không tạo route import tới file chưa tồn tại hoặc coi lỗi import là TDD RED.",
          "proof": "Router integration không mất state hoặc lồng shell; settings cũ hoạt động; focus và resize có kiểm chứng browser."
        },
        {
          "id": "TASK-004",
          "title": "Migration demo và Storybook đầy đủ inventory",
          "phase": 2,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-001",
            "TASK-002",
            "TASK-003"
          ],
          "planned_paths": [
            ".storybook/main.ts",
            ".storybook/preview.ts",
            ".storybook/tsconfig.json",
            "src/libs/components/anchor/anchor.component.ts",
            "src/libs/components/anchor/anchor.stories.ts",
            "src/libs/components/anchor/basic/basic.component.html",
            "src/libs/components/anchor/basic/basic.component.scss",
            "src/libs/components/anchor/basic/basic.component.ts",
            "src/libs/components/anchor/basic/basic.stories.ts",
            "src/libs/components/anchor/with-section/with-section.component.html",
            "src/libs/components/anchor/with-section/with-section.component.scss",
            "src/libs/components/anchor/with-section/with-section.component.ts",
            "src/libs/components/anchor/with-section/with-section.stories.ts",
            "src/libs/components/avatar/avatar.component.html",
            "src/libs/components/avatar/avatar.component.scss",
            "src/libs/components/avatar/avatar.component.ts",
            "src/libs/components/avatar/avatar.stories.ts",
            "src/libs/components/badge/badge.component.html",
            "src/libs/components/badge/badge.component.scss",
            "src/libs/components/badge/badge.component.ts",
            "src/libs/components/badge/badge.stories.ts",
            "src/libs/components/button/button.component.html",
            "src/libs/components/button/button.component.scss",
            "src/libs/components/button/button.component.ts",
            "src/libs/components/button/button.stories.ts",
            "src/libs/components/index.ts",
            "src/libs/components/modal/basic/basic.component.html",
            "src/libs/components/modal/basic/basic.component.scss",
            "src/libs/components/modal/basic/basic.component.ts",
            "src/libs/components/modal/basic/basic.stories.ts",
            "src/libs/components/modal/slots/slots.component.html",
            "src/libs/components/modal/slots/slots.component.scss",
            "src/libs/components/modal/slots/slots.component.ts",
            "src/libs/components/modal/slots/slots.stories.ts",
            "src/libs/components/modal/view-modes/view-modes.component.html",
            "src/libs/components/modal/view-modes/view-modes.component.scss",
            "src/libs/components/modal/view-modes/view-modes.component.ts",
            "src/libs/components/modal/view-modes/view-modes.stories.ts",
            "src/libs/components/preview-image/preview-image.component.html",
            "src/libs/components/preview-image/preview-image.component.scss",
            "src/libs/components/preview-image/preview-image.component.ts",
            "src/libs/components/preview-image/preview-image.stories.ts",
            "src/libs/components/preview-pdf/preview-pdf.component.html",
            "src/libs/components/preview-pdf/preview-pdf.component.scss",
            "src/libs/components/preview-pdf/preview-pdf.component.ts",
            "src/libs/components/preview-pdf/preview-pdf.stories.ts",
            "src/libs/components/query-bar/basic/basic.component.html",
            "src/libs/components/query-bar/basic/basic.component.scss",
            "src/libs/components/query-bar/basic/basic.component.ts",
            "src/libs/components/query-bar/basic/basic.stories.ts",
            "src/libs/components/query-bar/fields/fields.component.html",
            "src/libs/components/query-bar/fields/fields.component.scss",
            "src/libs/components/query-bar/fields/fields.component.ts",
            "src/libs/components/query-bar/fields/fields.stories.ts",
            "src/libs/components/query-bar/modes/modes.component.html",
            "src/libs/components/query-bar/modes/modes.component.scss",
            "src/libs/components/query-bar/modes/modes.component.ts",
            "src/libs/components/query-bar/modes/modes.stories.ts",
            "src/libs/components/routes.ts",
            "src/libs/components/section/basic/basic.component.html",
            "src/libs/components/section/basic/basic.component.scss",
            "src/libs/components/section/basic/basic.component.ts",
            "src/libs/components/section/basic/basic.stories.ts",
            "src/libs/components/section/header-slots/header-slots.component.html",
            "src/libs/components/section/header-slots/header-slots.component.scss",
            "src/libs/components/section/header-slots/header-slots.component.ts",
            "src/libs/components/section/header-slots/header-slots.stories.ts",
            "src/libs/components/section/section-item/section-item.component.html",
            "src/libs/components/section/section-item/section-item.component.scss",
            "src/libs/components/section/section-item/section-item.component.ts",
            "src/libs/components/section/section-item/section-item.stories.ts",
            "src/libs/components/side-drawer/advanced/advanced.component.html",
            "src/libs/components/side-drawer/advanced/advanced.component.scss",
            "src/libs/components/side-drawer/advanced/advanced.component.ts",
            "src/libs/components/side-drawer/advanced/advanced.stories.ts",
            "src/libs/components/side-drawer/basic/basic.component.html",
            "src/libs/components/side-drawer/basic/basic.component.scss",
            "src/libs/components/side-drawer/basic/basic.component.ts",
            "src/libs/components/side-drawer/basic/basic.stories.ts",
            "src/libs/components/side-drawer/custom/custom.component.html",
            "src/libs/components/side-drawer/custom/custom.component.scss",
            "src/libs/components/side-drawer/custom/custom.component.ts",
            "src/libs/components/side-drawer/custom/custom.stories.ts",
            "src/libs/components/side-drawer/loading/loading.component.html",
            "src/libs/components/side-drawer/loading/loading.component.scss",
            "src/libs/components/side-drawer/loading/loading.component.ts",
            "src/libs/components/side-drawer/loading/loading.stories.ts",
            "src/libs/components/splitter/splitter.component.html",
            "src/libs/components/splitter/splitter.component.scss",
            "src/libs/components/splitter/splitter.component.ts",
            "src/libs/components/splitter/splitter.stories.ts",
            "src/libs/components/table/basic/basic.component.html",
            "src/libs/components/table/basic/basic.component.scss",
            "src/libs/components/table/basic/basic.component.ts",
            "src/libs/components/table/basic/basic.stories.ts",
            "src/libs/components/table/column/column.component.html",
            "src/libs/components/table/column/column.component.scss",
            "src/libs/components/table/column/column.component.ts",
            "src/libs/components/table/column/column.stories.ts",
            "src/libs/components/table/filter/filter.component.html",
            "src/libs/components/table/filter/filter.component.scss",
            "src/libs/components/table/filter/filter.component.ts",
            "src/libs/components/table/filter/filter.stories.ts",
            "src/libs/components/table/index-column/index-column.component.html",
            "src/libs/components/table/index-column/index-column.component.scss",
            "src/libs/components/table/index-column/index-column.component.ts",
            "src/libs/components/table/index-column/index-column.stories.ts",
            "src/libs/components/table/tree/tree.component.html",
            "src/libs/components/table/tree/tree.component.scss",
            "src/libs/components/table/tree/tree.component.ts",
            "src/libs/components/table/tree/tree.stories.ts",
            "src/libs/components/upload-file/upload-file.component.html",
            "src/libs/components/upload-file/upload-file.component.scss",
            "src/libs/components/upload-file/upload-file.component.ts",
            "src/libs/components/upload-file/upload-file.stories.ts",
            "src/libs/forms/checkbox/checkbox.component.html",
            "src/libs/forms/checkbox/checkbox.component.scss",
            "src/libs/forms/checkbox/checkbox.component.ts",
            "src/libs/forms/checkbox/checkbox.stories.ts",
            "src/libs/forms/chip-calendar/chip-calendar.component.html",
            "src/libs/forms/chip-calendar/chip-calendar.component.scss",
            "src/libs/forms/chip-calendar/chip-calendar.component.ts",
            "src/libs/forms/chip-calendar/chip-calendar.stories.ts",
            "src/libs/forms/chip/chip.component.html",
            "src/libs/forms/chip/chip.component.scss",
            "src/libs/forms/chip/chip.component.ts",
            "src/libs/forms/chip/chip.stories.ts",
            "src/libs/forms/date/date.component.html",
            "src/libs/forms/date/date.component.scss",
            "src/libs/forms/date/date.component.ts",
            "src/libs/forms/date/date.stories.ts",
            "src/libs/forms/datetime/datetime.component.html",
            "src/libs/forms/datetime/datetime.component.scss",
            "src/libs/forms/datetime/datetime.component.ts",
            "src/libs/forms/datetime/datetime.stories.ts",
            "src/libs/forms/index.ts",
            "src/libs/forms/input-number/input-number.component.html",
            "src/libs/forms/input-number/input-number.component.scss",
            "src/libs/forms/input-number/input-number.component.ts",
            "src/libs/forms/input-number/input-number.stories.ts",
            "src/libs/forms/input/input.component.html",
            "src/libs/forms/input/input.component.scss",
            "src/libs/forms/input/input.component.ts",
            "src/libs/forms/input/input.stories.ts",
            "src/libs/forms/radio/radio.component.html",
            "src/libs/forms/radio/radio.component.scss",
            "src/libs/forms/radio/radio.component.ts",
            "src/libs/forms/radio/radio.stories.ts",
            "src/libs/forms/routes.ts",
            "src/libs/forms/select/select.component.html",
            "src/libs/forms/select/select.component.scss",
            "src/libs/forms/select/select.component.ts",
            "src/libs/forms/select/select.stories.ts",
            "src/libs/forms/switch/switch.component.html",
            "src/libs/forms/switch/switch.component.scss",
            "src/libs/forms/switch/switch.component.ts",
            "src/libs/forms/switch/switch.stories.ts",
            "src/libs/forms/textarea/textarea.component.html",
            "src/libs/forms/textarea/textarea.component.scss",
            "src/libs/forms/textarea/textarea.component.ts",
            "src/libs/forms/textarea/textarea.stories.ts",
            "src/libs/forms/validation/validation.component.html",
            "src/libs/forms/validation/validation.component.scss",
            "src/libs/forms/validation/validation.component.ts",
            "src/libs/forms/validation/validation.stories.ts",
            "src/libs/instructions/coding-conventions-typescript/coding-conventions-typescript.component.ts",
            "src/libs/instructions/coding-conventions/coding-conventions.component.ts",
            "src/libs/instructions/custom-theme/custom-theme.component.html",
            "src/libs/instructions/custom-theme/custom-theme.component.scss",
            "src/libs/instructions/custom-theme/custom-theme.component.ts",
            "src/libs/instructions/custom-theme/guide/guide.component.html",
            "src/libs/instructions/custom-theme/guide/guide.component.scss",
            "src/libs/instructions/custom-theme/guide/guide.component.ts",
            "src/libs/instructions/custom-theme/tool/tool.component.html",
            "src/libs/instructions/custom-theme/tool/tool.component.scss",
            "src/libs/instructions/custom-theme/tool/tool.component.ts",
            "src/libs/instructions/index.ts",
            "src/libs/instructions/instroduction/instroduction.component.html",
            "src/libs/instructions/instroduction/instroduction.component.scss",
            "src/libs/instructions/instroduction/instroduction.component.ts",
            "src/libs/instructions/portal-config/portal-config.component.html",
            "src/libs/instructions/portal-config/portal-config.component.scss",
            "src/libs/instructions/portal-config/portal-config.component.ts",
            "src/libs/instructions/routes.ts",
            "src/libs/patterns/index.ts",
            "src/libs/patterns/list/base/base.component.html",
            "src/libs/patterns/list/base/base.component.scss",
            "src/libs/patterns/list/base/base.component.ts",
            "src/libs/patterns/page-builder/page-builder.component.html",
            "src/libs/patterns/page-builder/page-builder.component.scss",
            "src/libs/patterns/page-builder/page-builder.component.ts",
            "src/libs/patterns/routes.ts",
            "src/libs/patterns/shared/demo-button/demo-button.component.html",
            "src/libs/patterns/shared/demo-button/demo-button.component.scss",
            "src/libs/patterns/shared/demo-button/demo-button.component.ts",
            "src/libs/patterns/shared/demo-table/demo-table.component.html",
            "src/libs/patterns/shared/demo-table/demo-table.component.scss",
            "src/libs/patterns/shared/demo-table/demo-table.component.ts",
            "src/libs/services/confirm/confirm/confirm.component.html",
            "src/libs/services/confirm/confirm/confirm.component.scss",
            "src/libs/services/confirm/confirm/confirm.component.ts",
            "src/libs/services/confirm/confirm/confirm.stories.ts",
            "src/libs/services/confirm/with-date/with-date.component.html",
            "src/libs/services/confirm/with-date/with-date.component.scss",
            "src/libs/services/confirm/with-date/with-date.component.ts",
            "src/libs/services/confirm/with-date/with-date.stories.ts",
            "src/libs/services/confirm/with-input/with-input.component.html",
            "src/libs/services/confirm/with-input/with-input.component.scss",
            "src/libs/services/confirm/with-input/with-input.component.ts",
            "src/libs/services/confirm/with-input/with-input.stories.ts",
            "src/libs/services/confirm/with-radio/with-radio.component.html",
            "src/libs/services/confirm/with-radio/with-radio.component.scss",
            "src/libs/services/confirm/with-radio/with-radio.component.ts",
            "src/libs/services/confirm/with-radio/with-radio.stories.ts",
            "src/libs/services/index.ts",
            "src/libs/services/loading/loading.component.html",
            "src/libs/services/loading/loading.component.scss",
            "src/libs/services/loading/loading.component.ts",
            "src/libs/services/loading/loading.stories.ts",
            "src/libs/services/notify/notify.component.html",
            "src/libs/services/notify/notify.component.scss",
            "src/libs/services/notify/notify.component.ts",
            "src/libs/services/notify/notify.stories.ts",
            "src/libs/services/routes.ts",
            "src/libs/services/unsaved-changes/unsaved-changes.component.ts",
            "src/libs/services/unsaved-changes/unsaved-changes.stories.ts",
            "src/libs/shared/demo-harness.spec.ts",
            "src/libs/shared/demo-harness.ts",
            "src/libs/shared/demo-inventory.ts",
            "src/libs/utilities/icons/icons.component.html",
            "src/libs/utilities/icons/icons.component.scss",
            "src/libs/utilities/icons/icons.component.ts",
            "src/libs/utilities/index.ts",
            "src/libs/utilities/routes.ts",
            "src/libs/utilities/tooltip/tooltip.component.html",
            "src/libs/utilities/tooltip/tooltip.component.scss",
            "src/libs/utilities/tooltip/tooltip.component.ts"
          ],
          "justification_refs": [
            "R-001",
            "R-002",
            "R-003"
          ],
          "enforces_invariant_refs": [
            "INV-001",
            "INV-002",
            "INV-006"
          ],
          "acceptance_refs": [
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-012"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-004",
              "record_refs": [
                "R-001",
                "R-002",
                "R-003",
                "AC-001",
                "AC-002",
                "AC-003",
                "AC-012",
                "INV-001",
                "INV-002",
                "INV-006"
              ],
              "expected_proof": "Storybook dev/static build đạt; inventory story match demo source; component/service tương tác đúng và không gọi backend thật."
            }
          ],
          "work": "Migrate exports/inputs/providers theo published Core source. Mọi demo route thuộc Components/Forms/Services có story; tái dùng component hiện có, chuyển sang inputs/events có chủ ý khi cần controls. Dùng applicationConfig/moduleMetadata đúng scope; harness reset và destroy thật, không bootstrap main.ts hoặc auth interceptor. Providers và theme cùng nguồn TASK-003. Inventory đánh dấu coverage rõ, utilities/instructions/patterns cũ chỉ sửa để compile/giữ route. Services có confirm result/cancel, loading teardown, notify variants, unsaved changes; data/asset giả lập. Kiểm tra story isolation trước logic mới.",
          "proof": "Storybook dev/static build đạt; inventory story match demo source; component/service tương tác đúng và không gọi backend thật."
        },
        {
          "id": "TASK-005",
          "title": "Fixture, query, form logic và session store",
          "phase": 1,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-001"
          ],
          "planned_paths": [
            "src/libs/pages/data/demo-session.store.spec.ts",
            "src/libs/pages/data/demo-session.store.ts",
            "src/libs/pages/data/demo-state.ts",
            "src/libs/pages/data/fixture-factories.spec.ts",
            "src/libs/pages/data/fixture-factories.ts",
            "src/libs/pages/data/models.ts",
            "src/libs/pages/data/query.spec.ts",
            "src/libs/pages/data/query.ts",
            "src/libs/pages/data/validators.spec.ts",
            "src/libs/pages/data/validators.ts"
          ],
          "justification_refs": [
            "R-004",
            "R-005"
          ],
          "enforces_invariant_refs": [
            "INV-002",
            "INV-003",
            "INV-006"
          ],
          "acceptance_refs": [
            "AC-007",
            "AC-008",
            "AC-009"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-005",
              "record_refs": [
                "R-004",
                "R-005",
                "AC-007",
                "AC-008",
                "AC-009",
                "INV-002",
                "INV-003",
                "INV-006"
              ],
              "expected_proof": "Đối chiếu expected IDs và totals, dirty/pending/retry, reset seed; unit và DI isolation tests GREEN."
            }
          ],
          "work": "Viết test RED thật cho search/filter/sort/page/selection, CRUD, validation, totals và reset. Sau đó viết typed models và fixture factory xác định tối thiểu 24 bản ghi/list; hierarchical 2 cấp; hỗ trợ short/long/null/large values. Store scope demo session, không global singleton; query/helper pure. Simulated failure/latency controlled, cancel khi destroy. Mutation không đổi seed; tạo instance mới không kế thừa dữ liệu story khác.",
          "proof": "Đối chiếu expected IDs và totals, dirty/pending/retry, reset seed; unit và DI isolation tests GREEN."
        },
        {
          "id": "TASK-006",
          "title": "Registry, catalog v1 và source export",
          "phase": 3,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-001",
            "TASK-005"
          ],
          "planned_paths": [
            "docs/page-patterns.md",
            "public/catalog/page-pattern-sources.v1.json",
            "public/catalog/page-patterns.v1.json",
            "scripts/export-page-catalog.mjs",
            "scripts/export-page-catalog.test.mjs",
            "src/libs/pages/catalog/pattern-loaders.ts",
            "src/libs/pages/catalog/pattern-registry.spec.ts",
            "src/libs/pages/catalog/pattern-registry.ts",
            "src/libs/pages/catalog/pattern.model.ts"
          ],
          "justification_refs": [
            "R-004",
            "R-005"
          ],
          "enforces_invariant_refs": [
            "INV-004"
          ],
          "acceptance_refs": [
            "AC-005",
            "AC-010"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-006",
              "record_refs": [
                "R-004",
                "R-005",
                "AC-005",
                "AC-010",
                "INV-004"
              ],
              "expected_proof": "12 pattern ID duy nhất; routes/sources/loaders hợp lệ; exports reproducible; source/docs không drift."
            }
          ],
          "work": "Viết schema/ID/paths/loader parity tests RED, rồi metadata thuần cho 12 IDs. Export JSON và Markdown deterministic; source snippets đọc từ file allowlisted thật, escape, không absolute path/secrets/functions. Node exporter dùng TS strip types cho metadata nếu phù hợp, không import Angular. Registry validates aliases/relatedPatterns and variants. CHECK phải phát hiện generated drift mà không tự ghi.",
          "proof": "12 pattern ID duy nhất; routes/sources/loaders hợp lệ; exports reproducible; source/docs không drift."
        },
        {
          "id": "TASK-007",
          "title": "Bốn List và ba Detail pattern",
          "phase": 3,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-002",
            "TASK-003",
            "TASK-005",
            "TASK-006"
          ],
          "planned_paths": [
            "src/libs/pages/components/entity-facts.component.html",
            "src/libs/pages/components/entity-facts.component.scss",
            "src/libs/pages/components/entity-facts.component.ts",
            "src/libs/pages/components/related-records.component.html",
            "src/libs/pages/components/related-records.component.scss",
            "src/libs/pages/components/related-records.component.ts",
            "src/libs/pages/patterns/detail-overview/detail-overview.component.html",
            "src/libs/pages/patterns/detail-overview/detail-overview.component.scss",
            "src/libs/pages/patterns/detail-overview/detail-overview.component.ts",
            "src/libs/pages/patterns/detail-patterns.spec.ts",
            "src/libs/pages/patterns/detail-related-records/detail-related-records.component.html",
            "src/libs/pages/patterns/detail-related-records/detail-related-records.component.scss",
            "src/libs/pages/patterns/detail-related-records/detail-related-records.component.ts",
            "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.html",
            "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.scss",
            "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.ts",
            "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.html",
            "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.scss",
            "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.ts",
            "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.html",
            "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.scss",
            "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.ts",
            "src/libs/pages/patterns/list-master-detail/list-master-detail.component.html",
            "src/libs/pages/patterns/list-master-detail/list-master-detail.component.scss",
            "src/libs/pages/patterns/list-master-detail/list-master-detail.component.ts",
            "src/libs/pages/patterns/list-patterns.spec.ts",
            "src/libs/pages/patterns/list-standard/list-standard.component.html",
            "src/libs/pages/patterns/list-standard/list-standard.component.scss",
            "src/libs/pages/patterns/list-standard/list-standard.component.ts"
          ],
          "justification_refs": [
            "R-003",
            "R-004",
            "R-005"
          ],
          "enforces_invariant_refs": [
            "INV-002",
            "INV-003",
            "INV-005"
          ],
          "acceptance_refs": [
            "AC-004",
            "AC-005",
            "AC-007",
            "AC-009"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-007",
              "record_refs": [
                "R-003",
                "R-004",
                "R-005",
                "AC-004",
                "AC-005",
                "AC-007",
                "AC-009",
                "INV-002",
                "INV-003",
                "INV-005"
              ],
              "expected_proof": "Cả 7 pattern có hành vi và state thật, không 7 bản copy cùng table; grouped/tree/master-detail/related layouts phù hợp dữ liệu."
            }
          ],
          "work": "Các route container riêng cho 7 pattern; Core table/query/section/read-state đã kiểm chứng. EntityFacts là read-only region dùng chung giữa detail cần cùng semantics; RelatedRecords sở hữu bảng con, không mutation entity. Master-detail giữ selected ID và focus; tree cần real hierarchy; filter/sort/page kiểm chứng ID, không giả lập chỉ thay nhãn. Test query orchestration trước behavior, visual sau render.",
          "proof": "Cả 7 pattern có hành vi và state thật, không 7 bản copy cùng table; grouped/tree/master-detail/related layouts phù hợp dữ liệu."
        },
        {
          "id": "TASK-008",
          "title": "Ba Form và hai Drawer pattern",
          "phase": 3,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-002",
            "TASK-003",
            "TASK-005",
            "TASK-006",
            "TASK-007"
          ],
          "planned_paths": [
            "src/libs/pages/components/entity-form-sections.component.html",
            "src/libs/pages/components/entity-form-sections.component.scss",
            "src/libs/pages/components/entity-form-sections.component.ts",
            "src/libs/pages/components/line-item-editor.component.html",
            "src/libs/pages/components/line-item-editor.component.scss",
            "src/libs/pages/components/line-item-editor.component.spec.ts",
            "src/libs/pages/components/line-item-editor.component.ts",
            "src/libs/pages/components/unsaved-changes.guard.ts",
            "src/libs/pages/patterns/drawer-compact/drawer-compact.component.html",
            "src/libs/pages/patterns/drawer-compact/drawer-compact.component.scss",
            "src/libs/pages/patterns/drawer-compact/drawer-compact.component.ts",
            "src/libs/pages/patterns/drawer-patterns.spec.ts",
            "src/libs/pages/patterns/drawer-sections/drawer-sections.component.html",
            "src/libs/pages/patterns/drawer-sections/drawer-sections.component.scss",
            "src/libs/pages/patterns/drawer-sections/drawer-sections.component.ts",
            "src/libs/pages/patterns/form-line-items/form-line-items.component.html",
            "src/libs/pages/patterns/form-line-items/form-line-items.component.scss",
            "src/libs/pages/patterns/form-line-items/form-line-items.component.ts",
            "src/libs/pages/patterns/form-patterns.spec.ts",
            "src/libs/pages/patterns/form-sections/form-sections.component.html",
            "src/libs/pages/patterns/form-sections/form-sections.component.scss",
            "src/libs/pages/patterns/form-sections/form-sections.component.ts",
            "src/libs/pages/patterns/form-simple/form-simple.component.html",
            "src/libs/pages/patterns/form-simple/form-simple.component.scss",
            "src/libs/pages/patterns/form-simple/form-simple.component.ts"
          ],
          "justification_refs": [
            "R-003",
            "R-004",
            "R-005"
          ],
          "enforces_invariant_refs": [
            "INV-002",
            "INV-003",
            "INV-005"
          ],
          "acceptance_refs": [
            "AC-004",
            "AC-005",
            "AC-008",
            "AC-011"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-008",
              "record_refs": [
                "R-003",
                "R-004",
                "R-005",
                "AC-004",
                "AC-005",
                "AC-008",
                "AC-011",
                "INV-002",
                "INV-003",
                "INV-005"
              ],
              "expected_proof": "Lưu tạo/sửa phản ánh vào store/list, dirty outcomes đúng, failures giữ draft, line totals nhất quán; focus/keyboard integration tests."
            }
          ],
          "work": "TDD validation/dirty/save-error/repeated submit/totals và selected ID update. FormSections nhận cùng form owner; LineItemEditor có FormArray/subcontract, không sao chép entity. Form Simple/Sections/Line items đủ create/update; Drawer Compact/Sections đủ detail/create/update, facts khác form edit. Dùng Core unsaved-changes nếu API đúng; guard phối hợp route/tab-router/reset và close. Focus restore, keyboard, cancel pending, mobile width.",
          "proof": "Lưu tạo/sửa phản ánh vào store/list, dirty outcomes đúng, failures giữ draft, line totals nhất quán; focus/keyboard integration tests."
        },
        {
          "id": "TASK-009",
          "title": "Browser verification và accessibility",
          "phase": 4,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-004",
            "TASK-007",
            "TASK-008"
          ],
          "planned_paths": [
            "e2e/accessibility.spec.ts",
            "e2e/helpers/demo-fixtures.ts",
            "e2e/pages.spec.ts",
            "e2e/portal-reference.spec.ts",
            "e2e/storybook.spec.ts",
            "playwright.config.ts"
          ],
          "justification_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "D-004"
          ],
          "enforces_invariant_refs": [
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-005",
            "INV-006"
          ],
          "acceptance_refs": [
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-011",
            "AC-012"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-009",
              "record_refs": [
                "R-001",
                "R-002",
                "R-003",
                "R-004",
                "R-005",
                "D-004",
                "AC-001",
                "AC-002",
                "AC-003",
                "AC-004",
                "AC-005",
                "AC-006",
                "AC-007",
                "AC-008",
                "AC-009",
                "AC-011",
                "AC-012",
                "INV-001",
                "INV-002",
                "INV-003",
                "INV-005",
                "INV-006"
              ],
              "expected_proof": "Browser journeys pass và visual review có evidence hiện tại; báo lỗi và quay về đúng task owner sửa, rerun affected checks."
            }
          ],
          "work": "Dùng Playwright Chromium và browser có sẵn; chỉ tải browser bundle nếu runtime thiếu, không install hệ thống. Test flow thực tế cả portal/Storybook, all registered demo smoke, no console errors, intercept ngoài localhost để chứng minh demo không cần backend. Viewports 1440/1024/768/390/320, zoom 200%, keyboard/focus/dirty/mobile. Contrast đo trên computed style và kiểm tra rendered; không chỉ screenshot snapshot. Kết quả manual/UAT được ghi đúng là MANUAL, không đổi thành automated pass.",
          "proof": "Browser journeys pass và visual review có evidence hiện tại; báo lỗi và quay về đúng task owner sửa, rerun affected checks."
        },
        {
          "id": "TASK-010",
          "title": "Tài liệu và gate bàn giao",
          "phase": 4,
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_root": "C:/Users/nghiatt15_onemount/Documents/sdcorejs/portal-template",
          "dependencies": [
            "TASK-009",
            "TASK-006"
          ],
          "planned_paths": [
            "README.md",
            "docs/storybook.md",
            "docs/verification.md"
          ],
          "justification_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005"
          ],
          "enforces_invariant_refs": [
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ],
          "acceptance_refs": [
            "AC-001",
            "AC-002",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012"
          ],
          "planned_evidence": [
            {
              "id": "EVIDENCE-010",
              "record_refs": [
                "R-001",
                "R-002",
                "R-003",
                "R-004",
                "R-005",
                "AC-001",
                "AC-002",
                "AC-004",
                "AC-005",
                "AC-006",
                "AC-008",
                "AC-009",
                "AC-010",
                "AC-011",
                "AC-012",
                "INV-001",
                "INV-002",
                "INV-003",
                "INV-004",
                "INV-005",
                "INV-006"
              ],
              "expected_proof": "Handoff chỉ khi build/lint/test/catalog/storybook/browser hiện tại đạt hoặc báo blocker rõ; không ghi thêm sau final branch-ready."
            }
          ],
          "work": "Ghi hướng dẫn runtime/start/build/Storybook, lựa chọn pattern, reset và giới hạn demo, kết quả kiểm chứng thật. sdcorejs-test → read-only review → repair finding cần thiết theo owner → affected tests → code-documentation → UI verification → docs/catalog closure → verify-before-done → branch-ready read-only. Không chạy simplify tự động, không tạo memories/conventions ngoài authority, không commit/push/deploy. Nếu docs/source thay sau test phải chạy lại kiểm tra ảnh hưởng trước branch-ready.",
          "proof": "Handoff chỉ khi build/lint/test/catalog/storybook/browser hiện tại đạt hoặc báo blocker rõ; không ghi thêm sau final branch-ready."
        }
      ],
      "repository_inventory": {
        "repositories": [
          {
            "repository_id": "github.com/sdcorejs/portal-template",
            "existing_paths": [
              ".gitignore",
              "README.md",
              "angular.json",
              "eslint.config.js",
              "package-lock.json",
              "package.json",
              "src/app/app.routes.ts",
              "src/app/components/main/main.component.html",
              "src/app/components/main/main.component.ts",
              "src/app/configurations/auth.configuration.ts",
              "src/app/configurations/index.ts",
              "src/app/configurations/layout.configuration.ts",
              "src/app/configurations/permission.configuration.ts",
              "src/app/configurations/portal-config.ts",
              "src/libs/components/anchor/anchor.component.ts",
              "src/libs/components/anchor/basic/basic.component.html",
              "src/libs/components/anchor/basic/basic.component.scss",
              "src/libs/components/anchor/basic/basic.component.ts",
              "src/libs/components/anchor/with-section/with-section.component.html",
              "src/libs/components/anchor/with-section/with-section.component.scss",
              "src/libs/components/anchor/with-section/with-section.component.ts",
              "src/libs/components/avatar/avatar.component.html",
              "src/libs/components/avatar/avatar.component.scss",
              "src/libs/components/avatar/avatar.component.ts",
              "src/libs/components/badge/badge.component.html",
              "src/libs/components/badge/badge.component.scss",
              "src/libs/components/badge/badge.component.ts",
              "src/libs/components/button/button.component.html",
              "src/libs/components/button/button.component.scss",
              "src/libs/components/button/button.component.ts",
              "src/libs/components/index.ts",
              "src/libs/components/modal/basic/basic.component.html",
              "src/libs/components/modal/basic/basic.component.scss",
              "src/libs/components/modal/basic/basic.component.ts",
              "src/libs/components/modal/slots/slots.component.html",
              "src/libs/components/modal/slots/slots.component.scss",
              "src/libs/components/modal/slots/slots.component.ts",
              "src/libs/components/modal/view-modes/view-modes.component.html",
              "src/libs/components/modal/view-modes/view-modes.component.scss",
              "src/libs/components/modal/view-modes/view-modes.component.ts",
              "src/libs/components/preview-image/preview-image.component.html",
              "src/libs/components/preview-image/preview-image.component.scss",
              "src/libs/components/preview-image/preview-image.component.ts",
              "src/libs/components/preview-pdf/preview-pdf.component.html",
              "src/libs/components/preview-pdf/preview-pdf.component.scss",
              "src/libs/components/preview-pdf/preview-pdf.component.ts",
              "src/libs/components/query-bar/basic/basic.component.html",
              "src/libs/components/query-bar/basic/basic.component.scss",
              "src/libs/components/query-bar/basic/basic.component.ts",
              "src/libs/components/query-bar/fields/fields.component.html",
              "src/libs/components/query-bar/fields/fields.component.scss",
              "src/libs/components/query-bar/fields/fields.component.ts",
              "src/libs/components/query-bar/modes/modes.component.html",
              "src/libs/components/query-bar/modes/modes.component.scss",
              "src/libs/components/query-bar/modes/modes.component.ts",
              "src/libs/components/routes.ts",
              "src/libs/components/section/basic/basic.component.html",
              "src/libs/components/section/basic/basic.component.scss",
              "src/libs/components/section/basic/basic.component.ts",
              "src/libs/components/section/header-slots/header-slots.component.html",
              "src/libs/components/section/header-slots/header-slots.component.scss",
              "src/libs/components/section/header-slots/header-slots.component.ts",
              "src/libs/components/section/section-item/section-item.component.html",
              "src/libs/components/section/section-item/section-item.component.scss",
              "src/libs/components/section/section-item/section-item.component.ts",
              "src/libs/components/side-drawer/advanced/advanced.component.html",
              "src/libs/components/side-drawer/advanced/advanced.component.scss",
              "src/libs/components/side-drawer/advanced/advanced.component.ts",
              "src/libs/components/side-drawer/basic/basic.component.html",
              "src/libs/components/side-drawer/basic/basic.component.scss",
              "src/libs/components/side-drawer/basic/basic.component.ts",
              "src/libs/components/side-drawer/custom/custom.component.html",
              "src/libs/components/side-drawer/custom/custom.component.scss",
              "src/libs/components/side-drawer/custom/custom.component.ts",
              "src/libs/components/side-drawer/loading/loading.component.html",
              "src/libs/components/side-drawer/loading/loading.component.scss",
              "src/libs/components/side-drawer/loading/loading.component.ts",
              "src/libs/components/splitter/splitter.component.html",
              "src/libs/components/splitter/splitter.component.scss",
              "src/libs/components/splitter/splitter.component.ts",
              "src/libs/components/table/basic/basic.component.html",
              "src/libs/components/table/basic/basic.component.scss",
              "src/libs/components/table/basic/basic.component.ts",
              "src/libs/components/table/column/column.component.html",
              "src/libs/components/table/column/column.component.scss",
              "src/libs/components/table/column/column.component.ts",
              "src/libs/components/table/filter/filter.component.html",
              "src/libs/components/table/filter/filter.component.scss",
              "src/libs/components/table/filter/filter.component.ts",
              "src/libs/components/table/index-column/index-column.component.html",
              "src/libs/components/table/index-column/index-column.component.scss",
              "src/libs/components/table/index-column/index-column.component.ts",
              "src/libs/components/table/tree/tree.component.html",
              "src/libs/components/table/tree/tree.component.scss",
              "src/libs/components/table/tree/tree.component.ts",
              "src/libs/components/upload-file/upload-file.component.html",
              "src/libs/components/upload-file/upload-file.component.scss",
              "src/libs/components/upload-file/upload-file.component.ts",
              "src/libs/forms/checkbox/checkbox.component.html",
              "src/libs/forms/checkbox/checkbox.component.scss",
              "src/libs/forms/checkbox/checkbox.component.ts",
              "src/libs/forms/chip-calendar/chip-calendar.component.html",
              "src/libs/forms/chip-calendar/chip-calendar.component.scss",
              "src/libs/forms/chip-calendar/chip-calendar.component.ts",
              "src/libs/forms/chip/chip.component.html",
              "src/libs/forms/chip/chip.component.scss",
              "src/libs/forms/chip/chip.component.ts",
              "src/libs/forms/date/date.component.html",
              "src/libs/forms/date/date.component.scss",
              "src/libs/forms/date/date.component.ts",
              "src/libs/forms/datetime/datetime.component.html",
              "src/libs/forms/datetime/datetime.component.scss",
              "src/libs/forms/datetime/datetime.component.ts",
              "src/libs/forms/index.ts",
              "src/libs/forms/input-number/input-number.component.html",
              "src/libs/forms/input-number/input-number.component.scss",
              "src/libs/forms/input-number/input-number.component.ts",
              "src/libs/forms/input/input.component.html",
              "src/libs/forms/input/input.component.scss",
              "src/libs/forms/input/input.component.ts",
              "src/libs/forms/radio/radio.component.html",
              "src/libs/forms/radio/radio.component.scss",
              "src/libs/forms/radio/radio.component.ts",
              "src/libs/forms/routes.ts",
              "src/libs/forms/select/select.component.html",
              "src/libs/forms/select/select.component.scss",
              "src/libs/forms/select/select.component.ts",
              "src/libs/forms/switch/switch.component.html",
              "src/libs/forms/switch/switch.component.scss",
              "src/libs/forms/switch/switch.component.ts",
              "src/libs/forms/textarea/textarea.component.html",
              "src/libs/forms/textarea/textarea.component.scss",
              "src/libs/forms/textarea/textarea.component.ts",
              "src/libs/forms/validation/validation.component.html",
              "src/libs/forms/validation/validation.component.scss",
              "src/libs/forms/validation/validation.component.ts",
              "src/libs/instructions/coding-conventions-typescript/coding-conventions-typescript.component.ts",
              "src/libs/instructions/coding-conventions/coding-conventions.component.ts",
              "src/libs/instructions/custom-theme/custom-theme.component.html",
              "src/libs/instructions/custom-theme/custom-theme.component.scss",
              "src/libs/instructions/custom-theme/custom-theme.component.ts",
              "src/libs/instructions/custom-theme/guide/guide.component.html",
              "src/libs/instructions/custom-theme/guide/guide.component.scss",
              "src/libs/instructions/custom-theme/guide/guide.component.ts",
              "src/libs/instructions/custom-theme/tool/tool.component.html",
              "src/libs/instructions/custom-theme/tool/tool.component.scss",
              "src/libs/instructions/custom-theme/tool/tool.component.ts",
              "src/libs/instructions/index.ts",
              "src/libs/instructions/instroduction/instroduction.component.html",
              "src/libs/instructions/instroduction/instroduction.component.scss",
              "src/libs/instructions/instroduction/instroduction.component.ts",
              "src/libs/instructions/portal-config/portal-config.component.html",
              "src/libs/instructions/portal-config/portal-config.component.scss",
              "src/libs/instructions/portal-config/portal-config.component.ts",
              "src/libs/instructions/routes.ts",
              "src/libs/patterns/index.ts",
              "src/libs/patterns/list/base/base.component.html",
              "src/libs/patterns/list/base/base.component.scss",
              "src/libs/patterns/list/base/base.component.ts",
              "src/libs/patterns/page-builder/page-builder.component.html",
              "src/libs/patterns/page-builder/page-builder.component.scss",
              "src/libs/patterns/page-builder/page-builder.component.ts",
              "src/libs/patterns/routes.ts",
              "src/libs/patterns/shared/demo-button/demo-button.component.html",
              "src/libs/patterns/shared/demo-button/demo-button.component.scss",
              "src/libs/patterns/shared/demo-button/demo-button.component.ts",
              "src/libs/patterns/shared/demo-table/demo-table.component.html",
              "src/libs/patterns/shared/demo-table/demo-table.component.scss",
              "src/libs/patterns/shared/demo-table/demo-table.component.ts",
              "src/libs/services/confirm/confirm/confirm.component.html",
              "src/libs/services/confirm/confirm/confirm.component.scss",
              "src/libs/services/confirm/confirm/confirm.component.ts",
              "src/libs/services/confirm/with-date/with-date.component.html",
              "src/libs/services/confirm/with-date/with-date.component.scss",
              "src/libs/services/confirm/with-date/with-date.component.ts",
              "src/libs/services/confirm/with-input/with-input.component.html",
              "src/libs/services/confirm/with-input/with-input.component.scss",
              "src/libs/services/confirm/with-input/with-input.component.ts",
              "src/libs/services/confirm/with-radio/with-radio.component.html",
              "src/libs/services/confirm/with-radio/with-radio.component.scss",
              "src/libs/services/confirm/with-radio/with-radio.component.ts",
              "src/libs/services/index.ts",
              "src/libs/services/loading/loading.component.html",
              "src/libs/services/loading/loading.component.scss",
              "src/libs/services/loading/loading.component.ts",
              "src/libs/services/notify/notify.component.html",
              "src/libs/services/notify/notify.component.scss",
              "src/libs/services/notify/notify.component.ts",
              "src/libs/services/routes.ts",
              "src/libs/utilities/icons/icons.component.html",
              "src/libs/utilities/icons/icons.component.scss",
              "src/libs/utilities/icons/icons.component.ts",
              "src/libs/utilities/index.ts",
              "src/libs/utilities/routes.ts",
              "src/libs/utilities/tooltip/tooltip.component.html",
              "src/libs/utilities/tooltip/tooltip.component.scss",
              "src/libs/utilities/tooltip/tooltip.component.ts",
              "src/main.ts",
              "src/styles.scss",
              "tsconfig.app.json",
              "tsconfig.json",
              "tsconfig.spec.json"
            ],
            "intended_new_paths": [
              {
                "path": "scripts/check-toolchain.mjs",
                "owner_task_id": "TASK-001"
              },
              {
                "path": ".sdcorejs/design/decisions/portal-reference-core22.md",
                "owner_task_id": "TASK-002"
              },
              {
                "path": ".sdcorejs/design/flows/portal-reference-core22.md",
                "owner_task_id": "TASK-002"
              },
              {
                "path": ".sdcorejs/design/specs/portal-reference-core22.md",
                "owner_task_id": "TASK-002"
              },
              {
                "path": ".sdcorejs/design/wireframes/portal-reference-core22/detail-tabbed.html",
                "owner_task_id": "TASK-002"
              },
              {
                "path": ".sdcorejs/design/wireframes/portal-reference-core22/drawer-compact.html",
                "owner_task_id": "TASK-002"
              },
              {
                "path": ".sdcorejs/design/wireframes/portal-reference-core22/form-sections.html",
                "owner_task_id": "TASK-002"
              },
              {
                "path": ".sdcorejs/design/wireframes/portal-reference-core22/list-standard.html",
                "owner_task_id": "TASK-002"
              },
              {
                "path": ".sdcorejs/docs/design/portal-reference-core22.md",
                "owner_task_id": "TASK-002"
              },
              {
                "path": "src/app/reference-providers.ts",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/index.ts",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/reference/demo-host.component.html",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/reference/demo-host.component.scss",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/reference/demo-host.component.spec.ts",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/reference/demo-host.component.ts",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/reference/page-reference.component.html",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/reference/page-reference.component.scss",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/reference/page-reference.component.spec.ts",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/reference/page-reference.component.ts",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/libs/pages/routes.ts",
                "owner_task_id": "TASK-003"
              },
              {
                "path": "src/styles/reference.scss",
                "owner_task_id": "TASK-003"
              },
              {
                "path": ".storybook/main.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": ".storybook/preview.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": ".storybook/tsconfig.json",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/anchor/anchor.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/anchor/basic/basic.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/anchor/with-section/with-section.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/avatar/avatar.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/badge/badge.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/button/button.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/modal/basic/basic.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/modal/slots/slots.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/modal/view-modes/view-modes.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/preview-image/preview-image.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/preview-pdf/preview-pdf.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/query-bar/basic/basic.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/query-bar/fields/fields.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/query-bar/modes/modes.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/section/basic/basic.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/section/header-slots/header-slots.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/section/section-item/section-item.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/side-drawer/advanced/advanced.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/side-drawer/basic/basic.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/side-drawer/custom/custom.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/side-drawer/loading/loading.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/splitter/splitter.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/table/basic/basic.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/table/column/column.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/table/filter/filter.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/table/index-column/index-column.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/table/tree/tree.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/components/upload-file/upload-file.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/checkbox/checkbox.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/chip-calendar/chip-calendar.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/chip/chip.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/date/date.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/datetime/datetime.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/input-number/input-number.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/input/input.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/radio/radio.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/select/select.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/switch/switch.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/textarea/textarea.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/forms/validation/validation.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/services/confirm/confirm/confirm.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/services/confirm/with-date/with-date.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/services/confirm/with-input/with-input.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/services/confirm/with-radio/with-radio.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/services/loading/loading.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/services/notify/notify.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/services/unsaved-changes/unsaved-changes.component.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/services/unsaved-changes/unsaved-changes.stories.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/shared/demo-harness.spec.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/shared/demo-harness.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/shared/demo-inventory.ts",
                "owner_task_id": "TASK-004"
              },
              {
                "path": "src/libs/pages/data/demo-session.store.spec.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/demo-session.store.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/demo-state.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/fixture-factories.spec.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/fixture-factories.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/models.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/query.spec.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/query.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/validators.spec.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "src/libs/pages/data/validators.ts",
                "owner_task_id": "TASK-005"
              },
              {
                "path": "docs/page-patterns.md",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "public/catalog/page-pattern-sources.v1.json",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "public/catalog/page-patterns.v1.json",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "scripts/export-page-catalog.mjs",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "scripts/export-page-catalog.test.mjs",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "src/libs/pages/catalog/pattern-loaders.ts",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "src/libs/pages/catalog/pattern-registry.spec.ts",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "src/libs/pages/catalog/pattern-registry.ts",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "src/libs/pages/catalog/pattern.model.ts",
                "owner_task_id": "TASK-006"
              },
              {
                "path": "src/libs/pages/components/entity-facts.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/components/entity-facts.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/components/entity-facts.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/components/related-records.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/components/related-records.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/components/related-records.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-overview/detail-overview.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-overview/detail-overview.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-overview/detail-overview.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-patterns.spec.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-related-records/detail-related-records.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-related-records/detail-related-records.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-related-records/detail-related-records.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-master-detail/list-master-detail.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-master-detail/list-master-detail.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-master-detail/list-master-detail.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-patterns.spec.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-standard/list-standard.component.html",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-standard/list-standard.component.scss",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/patterns/list-standard/list-standard.component.ts",
                "owner_task_id": "TASK-007"
              },
              {
                "path": "src/libs/pages/components/entity-form-sections.component.html",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/components/entity-form-sections.component.scss",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/components/entity-form-sections.component.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/components/line-item-editor.component.html",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/components/line-item-editor.component.scss",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/components/line-item-editor.component.spec.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/components/line-item-editor.component.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/components/unsaved-changes.guard.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/drawer-compact/drawer-compact.component.html",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/drawer-compact/drawer-compact.component.scss",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/drawer-compact/drawer-compact.component.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/drawer-patterns.spec.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/drawer-sections/drawer-sections.component.html",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/drawer-sections/drawer-sections.component.scss",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/drawer-sections/drawer-sections.component.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-line-items/form-line-items.component.html",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-line-items/form-line-items.component.scss",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-line-items/form-line-items.component.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-patterns.spec.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-sections/form-sections.component.html",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-sections/form-sections.component.scss",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-sections/form-sections.component.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-simple/form-simple.component.html",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-simple/form-simple.component.scss",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "src/libs/pages/patterns/form-simple/form-simple.component.ts",
                "owner_task_id": "TASK-008"
              },
              {
                "path": "e2e/accessibility.spec.ts",
                "owner_task_id": "TASK-009"
              },
              {
                "path": "e2e/helpers/demo-fixtures.ts",
                "owner_task_id": "TASK-009"
              },
              {
                "path": "e2e/pages.spec.ts",
                "owner_task_id": "TASK-009"
              },
              {
                "path": "e2e/portal-reference.spec.ts",
                "owner_task_id": "TASK-009"
              },
              {
                "path": "e2e/storybook.spec.ts",
                "owner_task_id": "TASK-009"
              },
              {
                "path": "playwright.config.ts",
                "owner_task_id": "TASK-009"
              },
              {
                "path": "docs/storybook.md",
                "owner_task_id": "TASK-010"
              },
              {
                "path": "docs/verification.md",
                "owner_task_id": "TASK-010"
              }
            ]
          }
        ]
      },
      "critique_history": [
        {
          "round": 1,
          "checker_version": "sdcorejs-plan:goal-backward:v1",
          "blockers": [],
          "resolved_blockers": [],
          "unresolved_blockers": []
        }
      ]
    },
    "validation_map": [
      {
        "requirement_id": "R-001",
        "acceptance_criterion_id": "AC-001",
        "invariant_refs": [
          "INV-001"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "integration"
        ],
        "case_ids": [
          "case-ac-001"
        ],
        "planned_command": "npm run check:toolchain",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "UNIT",
        "automation": "automated",
        "expected_proof": "Cài từ lockfile bằng runtime tương thích; Core resolve chính xác 22.2.7; peer dependencies hợp lệ; portal build thành công",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-001",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-002",
        "acceptance_criterion_id": "AC-002",
        "invariant_refs": [
          "INV-001",
          "INV-002",
          "INV-006"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "integration"
        ],
        "case_ids": [
          "case-ac-002"
        ],
        "planned_command": "npm run build-storybook",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "UNIT",
        "automation": "automated",
        "expected_proof": "Storybook chạy và build static; inventory bao phủ mọi demo hiện có của ba nhóm và primitive mới dùng trong Pages",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-001",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-002",
        "acceptance_criterion_id": "AC-003",
        "invariant_refs": [
          "INV-001",
          "INV-002",
          "INV-006"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "browser-e2e"
        ],
        "case_ids": [
          "case-ac-003"
        ],
        "planned_command": "npm run test:e2e -- --grep case-ac-003",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "FULL_E2E",
        "automation": "automated",
        "expected_proof": "Story có controls/API/source và trạng thái áp dụng; notify/loading/confirm thể hiện kết quả, hủy, reset; không gọi backend thật",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-001",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-003",
        "acceptance_criterion_id": "AC-004",
        "invariant_refs": [
          "INV-005",
          "INV-006"
        ],
        "risk": "UI/keyboard regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "uat",
          "ui-evidence-capture"
        ],
        "case_ids": [
          "case-ac-004"
        ],
        "planned_command": null,
        "command_source": "manual",
        "cwd": ".",
        "evidence_class": "SUPPLEMENTAL_SMOKE",
        "automation": "manual",
        "expected_proof": "Tiêu đề, actions, tokens, sections, bảng, form và drawer nhất quán; desktop 1440/1024, tablet 768, mobile 390/320 không che nội dung cần thao tác",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-002",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": "Cần kiểm tra UI thật và owner acknowledgement, bổ sung cho browser assertions.",
        "owner": "sdcorejs-test",
        "acknowledgement_required": true,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-004",
        "acceptance_criterion_id": "AC-005",
        "invariant_refs": [
          "INV-002",
          "INV-003",
          "INV-004",
          "INV-005"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "browser-e2e"
        ],
        "case_ids": [
          "case-ac-005"
        ],
        "planned_command": "npm run test:e2e -- --grep case-ac-005",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "FULL_E2E",
        "automation": "automated",
        "expected_proof": "Có đủ 12 pattern với ID/route duy nhất; ba Form có create/update, hai Drawer có detail/create/update; route cũ còn đích hợp lệ",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-002",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-006",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-004",
        "acceptance_criterion_id": "AC-006",
        "invariant_refs": [
          "INV-002",
          "INV-003",
          "INV-005"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "browser-e2e"
        ],
        "case_ids": [
          "case-ac-006"
        ],
        "planned_command": "npm run test:e2e -- --grep case-ac-006",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "FULL_E2E",
        "automation": "automated",
        "expected_proof": "Pages dùng preview rộng và tab tài liệu; chuyển tab giữ query/form; mở demo trực tiếp không lồng shell thừa",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-002",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-004",
        "acceptance_criterion_id": "AC-007",
        "invariant_refs": [
          "INV-002",
          "INV-003",
          "INV-005"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "unit",
          "component"
        ],
        "case_ids": [
          "case-ac-007"
        ],
        "planned_command": "npm test -- --watch=false --browsers=ChromeHeadless --include=src/libs/pages/data/query.spec.ts",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "UNIT",
        "automation": "automated",
        "expected_proof": "Search/filter/sort/pagination trả đúng fixture; selection scope chỉ current page, giữ theo ID khi sort, reset khi đổi page/filter",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-002",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-004",
        "acceptance_criterion_id": "AC-008",
        "invariant_refs": [
          "INV-002",
          "INV-003",
          "INV-005"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "unit",
          "component"
        ],
        "case_ids": [
          "case-ac-008"
        ],
        "planned_command": "npm test -- --watch=false --browsers=ChromeHeadless --include=src/libs/pages/patterns/form-patterns.spec.ts",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "UNIT",
        "automation": "automated",
        "expected_proof": "Create/update thật trên store demo; validation đúng; lưu lỗi giữ dữ liệu; hủy dirty giữ hoặc bỏ đúng lựa chọn; detail cập nhật theo kết quả lưu",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-002",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-005",
        "acceptance_criterion_id": "AC-009",
        "invariant_refs": [
          "INV-002",
          "INV-003",
          "INV-004",
          "INV-006"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "browser-e2e"
        ],
        "case_ids": [
          "case-ac-009"
        ],
        "planned_command": "npm run test:e2e -- --grep case-ac-009",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "FULL_E2E",
        "automation": "automated",
        "expected_proof": "Có tối thiểu 24 bản ghi/list, seed/reset xác định; loading/empty/no-results/error; nội dung dài, số lớn và trường thiếu không làm vỡ bố cục",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-006",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-005",
        "acceptance_criterion_id": "AC-010",
        "invariant_refs": [
          "INV-003",
          "INV-004",
          "INV-006"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "integration"
        ],
        "case_ids": [
          "case-ac-010"
        ],
        "planned_command": "npm run check:catalog",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "UNIT",
        "automation": "automated",
        "expected_proof": "Catalog JSON và guide khớp 12 pattern, route/source tồn tại, có tiêu chí chọn và giới hạn; ví dụ mapping cấu trúc dữ liệu có thể đọc mà không chạy app",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-006",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-003",
        "acceptance_criterion_id": "AC-011",
        "invariant_refs": [
          "INV-003",
          "INV-005",
          "INV-006"
        ],
        "risk": "UI/keyboard regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "uat",
          "ui-evidence-capture"
        ],
        "case_ids": [
          "case-ac-011"
        ],
        "planned_command": null,
        "command_source": "manual",
        "cwd": ".",
        "evidence_class": "SUPPLEMENTAL_SMOKE",
        "automation": "manual",
        "expected_proof": "Keyboard mở/đóng drawer, focus restore, tab order, tên control và error message rõ; kiểm tra zoom 200%, contrast và reduced motion ở UI thật",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-002",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-005",
          "EVIDENCE-007",
          "EVIDENCE-008",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": "Cần kiểm tra UI thật và owner acknowledgement, bổ sung cho browser assertions.",
        "owner": "sdcorejs-test",
        "acknowledgement_required": true,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      },
      {
        "requirement_id": "R-001",
        "acceptance_criterion_id": "AC-012",
        "invariant_refs": [
          "INV-001"
        ],
        "risk": "Behavior/integration regression",
        "boundary": {
          "kind": "none",
          "approval_ref": "D-004",
          "source_refs": [
            "R-001",
            "R-002",
            "R-003",
            "R-004",
            "R-005",
            "AC-001",
            "AC-002",
            "AC-003",
            "AC-004",
            "AC-005",
            "AC-006",
            "AC-007",
            "AC-008",
            "AC-009",
            "AC-010",
            "AC-011",
            "AC-012",
            "INV-001",
            "INV-002",
            "INV-003",
            "INV-004",
            "INV-005",
            "INV-006"
          ]
        },
        "authorization_boundary": false,
        "levels": [
          "browser-e2e"
        ],
        "case_ids": [
          "case-ac-012"
        ],
        "planned_command": "npm run test:e2e -- --grep case-ac-012",
        "command_source": "project-doc",
        "cwd": ".",
        "evidence_class": "FULL_E2E",
        "automation": "automated",
        "expected_proof": "Locale/number format/tab router hiện có vẫn hoạt động; build/lint/test liên quan đạt; không có runtime error trên demo smoke routes",
        "status": "covered",
        "evidence_refs": [
          "EVIDENCE-001",
          "EVIDENCE-003",
          "EVIDENCE-004",
          "EVIDENCE-009",
          "EVIDENCE-010"
        ],
        "rationale": null,
        "owner": null,
        "acknowledgement_required": false,
        "module_e2e": false,
        "module_id": null,
        "owner_repository_id": null
      }
    ],
    "approved_plan_path": null,
    "approved_plan_hash": null,
    "target_root": "portal-template",
    "target_root_kind": "target-project",
    "owner_repository_id": "github.com/sdcorejs/portal-template",
    "owner_repository_role": "portal",
    "owner_module_id": null,
    "execution_host_repository_id": "github.com/sdcorejs/portal-template",
    "integration_owner_repository_id": "github.com/sdcorejs/portal-template",
    "track": "angular",
    "stack_profile": "core-ui-angular",
    "task_count": 10,
    "phase_count": 4,
    "allowed_paths": [
      ".gitignore",
      "angular.json",
      "eslint.config.js",
      "package-lock.json",
      "package.json",
      "scripts/check-toolchain.mjs",
      "tsconfig.app.json",
      "tsconfig.json",
      "tsconfig.spec.json",
      ".sdcorejs/design/decisions/portal-reference-core22.md",
      ".sdcorejs/design/flows/portal-reference-core22.md",
      ".sdcorejs/design/specs/portal-reference-core22.md",
      ".sdcorejs/design/wireframes/portal-reference-core22/detail-tabbed.html",
      ".sdcorejs/design/wireframes/portal-reference-core22/drawer-compact.html",
      ".sdcorejs/design/wireframes/portal-reference-core22/form-sections.html",
      ".sdcorejs/design/wireframes/portal-reference-core22/list-standard.html",
      ".sdcorejs/docs/design/portal-reference-core22.md",
      "src/app/app.routes.ts",
      "src/app/components/main/main.component.html",
      "src/app/components/main/main.component.ts",
      "src/app/configurations/auth.configuration.ts",
      "src/app/configurations/index.ts",
      "src/app/configurations/layout.configuration.ts",
      "src/app/configurations/permission.configuration.ts",
      "src/app/configurations/portal-config.ts",
      "src/app/reference-providers.ts",
      "src/libs/pages/index.ts",
      "src/libs/pages/reference/demo-host.component.html",
      "src/libs/pages/reference/demo-host.component.scss",
      "src/libs/pages/reference/demo-host.component.spec.ts",
      "src/libs/pages/reference/demo-host.component.ts",
      "src/libs/pages/reference/page-reference.component.html",
      "src/libs/pages/reference/page-reference.component.scss",
      "src/libs/pages/reference/page-reference.component.spec.ts",
      "src/libs/pages/reference/page-reference.component.ts",
      "src/libs/pages/routes.ts",
      "src/main.ts",
      "src/styles.scss",
      "src/styles/reference.scss",
      ".storybook/main.ts",
      ".storybook/preview.ts",
      ".storybook/tsconfig.json",
      "src/libs/components/anchor/anchor.component.ts",
      "src/libs/components/anchor/anchor.stories.ts",
      "src/libs/components/anchor/basic/basic.component.html",
      "src/libs/components/anchor/basic/basic.component.scss",
      "src/libs/components/anchor/basic/basic.component.ts",
      "src/libs/components/anchor/basic/basic.stories.ts",
      "src/libs/components/anchor/with-section/with-section.component.html",
      "src/libs/components/anchor/with-section/with-section.component.scss",
      "src/libs/components/anchor/with-section/with-section.component.ts",
      "src/libs/components/anchor/with-section/with-section.stories.ts",
      "src/libs/components/avatar/avatar.component.html",
      "src/libs/components/avatar/avatar.component.scss",
      "src/libs/components/avatar/avatar.component.ts",
      "src/libs/components/avatar/avatar.stories.ts",
      "src/libs/components/badge/badge.component.html",
      "src/libs/components/badge/badge.component.scss",
      "src/libs/components/badge/badge.component.ts",
      "src/libs/components/badge/badge.stories.ts",
      "src/libs/components/button/button.component.html",
      "src/libs/components/button/button.component.scss",
      "src/libs/components/button/button.component.ts",
      "src/libs/components/button/button.stories.ts",
      "src/libs/components/index.ts",
      "src/libs/components/modal/basic/basic.component.html",
      "src/libs/components/modal/basic/basic.component.scss",
      "src/libs/components/modal/basic/basic.component.ts",
      "src/libs/components/modal/basic/basic.stories.ts",
      "src/libs/components/modal/slots/slots.component.html",
      "src/libs/components/modal/slots/slots.component.scss",
      "src/libs/components/modal/slots/slots.component.ts",
      "src/libs/components/modal/slots/slots.stories.ts",
      "src/libs/components/modal/view-modes/view-modes.component.html",
      "src/libs/components/modal/view-modes/view-modes.component.scss",
      "src/libs/components/modal/view-modes/view-modes.component.ts",
      "src/libs/components/modal/view-modes/view-modes.stories.ts",
      "src/libs/components/preview-image/preview-image.component.html",
      "src/libs/components/preview-image/preview-image.component.scss",
      "src/libs/components/preview-image/preview-image.component.ts",
      "src/libs/components/preview-image/preview-image.stories.ts",
      "src/libs/components/preview-pdf/preview-pdf.component.html",
      "src/libs/components/preview-pdf/preview-pdf.component.scss",
      "src/libs/components/preview-pdf/preview-pdf.component.ts",
      "src/libs/components/preview-pdf/preview-pdf.stories.ts",
      "src/libs/components/query-bar/basic/basic.component.html",
      "src/libs/components/query-bar/basic/basic.component.scss",
      "src/libs/components/query-bar/basic/basic.component.ts",
      "src/libs/components/query-bar/basic/basic.stories.ts",
      "src/libs/components/query-bar/fields/fields.component.html",
      "src/libs/components/query-bar/fields/fields.component.scss",
      "src/libs/components/query-bar/fields/fields.component.ts",
      "src/libs/components/query-bar/fields/fields.stories.ts",
      "src/libs/components/query-bar/modes/modes.component.html",
      "src/libs/components/query-bar/modes/modes.component.scss",
      "src/libs/components/query-bar/modes/modes.component.ts",
      "src/libs/components/query-bar/modes/modes.stories.ts",
      "src/libs/components/routes.ts",
      "src/libs/components/section/basic/basic.component.html",
      "src/libs/components/section/basic/basic.component.scss",
      "src/libs/components/section/basic/basic.component.ts",
      "src/libs/components/section/basic/basic.stories.ts",
      "src/libs/components/section/header-slots/header-slots.component.html",
      "src/libs/components/section/header-slots/header-slots.component.scss",
      "src/libs/components/section/header-slots/header-slots.component.ts",
      "src/libs/components/section/header-slots/header-slots.stories.ts",
      "src/libs/components/section/section-item/section-item.component.html",
      "src/libs/components/section/section-item/section-item.component.scss",
      "src/libs/components/section/section-item/section-item.component.ts",
      "src/libs/components/section/section-item/section-item.stories.ts",
      "src/libs/components/side-drawer/advanced/advanced.component.html",
      "src/libs/components/side-drawer/advanced/advanced.component.scss",
      "src/libs/components/side-drawer/advanced/advanced.component.ts",
      "src/libs/components/side-drawer/advanced/advanced.stories.ts",
      "src/libs/components/side-drawer/basic/basic.component.html",
      "src/libs/components/side-drawer/basic/basic.component.scss",
      "src/libs/components/side-drawer/basic/basic.component.ts",
      "src/libs/components/side-drawer/basic/basic.stories.ts",
      "src/libs/components/side-drawer/custom/custom.component.html",
      "src/libs/components/side-drawer/custom/custom.component.scss",
      "src/libs/components/side-drawer/custom/custom.component.ts",
      "src/libs/components/side-drawer/custom/custom.stories.ts",
      "src/libs/components/side-drawer/loading/loading.component.html",
      "src/libs/components/side-drawer/loading/loading.component.scss",
      "src/libs/components/side-drawer/loading/loading.component.ts",
      "src/libs/components/side-drawer/loading/loading.stories.ts",
      "src/libs/components/splitter/splitter.component.html",
      "src/libs/components/splitter/splitter.component.scss",
      "src/libs/components/splitter/splitter.component.ts",
      "src/libs/components/splitter/splitter.stories.ts",
      "src/libs/components/table/basic/basic.component.html",
      "src/libs/components/table/basic/basic.component.scss",
      "src/libs/components/table/basic/basic.component.ts",
      "src/libs/components/table/basic/basic.stories.ts",
      "src/libs/components/table/column/column.component.html",
      "src/libs/components/table/column/column.component.scss",
      "src/libs/components/table/column/column.component.ts",
      "src/libs/components/table/column/column.stories.ts",
      "src/libs/components/table/filter/filter.component.html",
      "src/libs/components/table/filter/filter.component.scss",
      "src/libs/components/table/filter/filter.component.ts",
      "src/libs/components/table/filter/filter.stories.ts",
      "src/libs/components/table/index-column/index-column.component.html",
      "src/libs/components/table/index-column/index-column.component.scss",
      "src/libs/components/table/index-column/index-column.component.ts",
      "src/libs/components/table/index-column/index-column.stories.ts",
      "src/libs/components/table/tree/tree.component.html",
      "src/libs/components/table/tree/tree.component.scss",
      "src/libs/components/table/tree/tree.component.ts",
      "src/libs/components/table/tree/tree.stories.ts",
      "src/libs/components/upload-file/upload-file.component.html",
      "src/libs/components/upload-file/upload-file.component.scss",
      "src/libs/components/upload-file/upload-file.component.ts",
      "src/libs/components/upload-file/upload-file.stories.ts",
      "src/libs/forms/checkbox/checkbox.component.html",
      "src/libs/forms/checkbox/checkbox.component.scss",
      "src/libs/forms/checkbox/checkbox.component.ts",
      "src/libs/forms/checkbox/checkbox.stories.ts",
      "src/libs/forms/chip-calendar/chip-calendar.component.html",
      "src/libs/forms/chip-calendar/chip-calendar.component.scss",
      "src/libs/forms/chip-calendar/chip-calendar.component.ts",
      "src/libs/forms/chip-calendar/chip-calendar.stories.ts",
      "src/libs/forms/chip/chip.component.html",
      "src/libs/forms/chip/chip.component.scss",
      "src/libs/forms/chip/chip.component.ts",
      "src/libs/forms/chip/chip.stories.ts",
      "src/libs/forms/date/date.component.html",
      "src/libs/forms/date/date.component.scss",
      "src/libs/forms/date/date.component.ts",
      "src/libs/forms/date/date.stories.ts",
      "src/libs/forms/datetime/datetime.component.html",
      "src/libs/forms/datetime/datetime.component.scss",
      "src/libs/forms/datetime/datetime.component.ts",
      "src/libs/forms/datetime/datetime.stories.ts",
      "src/libs/forms/index.ts",
      "src/libs/forms/input-number/input-number.component.html",
      "src/libs/forms/input-number/input-number.component.scss",
      "src/libs/forms/input-number/input-number.component.ts",
      "src/libs/forms/input-number/input-number.stories.ts",
      "src/libs/forms/input/input.component.html",
      "src/libs/forms/input/input.component.scss",
      "src/libs/forms/input/input.component.ts",
      "src/libs/forms/input/input.stories.ts",
      "src/libs/forms/radio/radio.component.html",
      "src/libs/forms/radio/radio.component.scss",
      "src/libs/forms/radio/radio.component.ts",
      "src/libs/forms/radio/radio.stories.ts",
      "src/libs/forms/routes.ts",
      "src/libs/forms/select/select.component.html",
      "src/libs/forms/select/select.component.scss",
      "src/libs/forms/select/select.component.ts",
      "src/libs/forms/select/select.stories.ts",
      "src/libs/forms/switch/switch.component.html",
      "src/libs/forms/switch/switch.component.scss",
      "src/libs/forms/switch/switch.component.ts",
      "src/libs/forms/switch/switch.stories.ts",
      "src/libs/forms/textarea/textarea.component.html",
      "src/libs/forms/textarea/textarea.component.scss",
      "src/libs/forms/textarea/textarea.component.ts",
      "src/libs/forms/textarea/textarea.stories.ts",
      "src/libs/forms/validation/validation.component.html",
      "src/libs/forms/validation/validation.component.scss",
      "src/libs/forms/validation/validation.component.ts",
      "src/libs/forms/validation/validation.stories.ts",
      "src/libs/instructions/coding-conventions-typescript/coding-conventions-typescript.component.ts",
      "src/libs/instructions/coding-conventions/coding-conventions.component.ts",
      "src/libs/instructions/custom-theme/custom-theme.component.html",
      "src/libs/instructions/custom-theme/custom-theme.component.scss",
      "src/libs/instructions/custom-theme/custom-theme.component.ts",
      "src/libs/instructions/custom-theme/guide/guide.component.html",
      "src/libs/instructions/custom-theme/guide/guide.component.scss",
      "src/libs/instructions/custom-theme/guide/guide.component.ts",
      "src/libs/instructions/custom-theme/tool/tool.component.html",
      "src/libs/instructions/custom-theme/tool/tool.component.scss",
      "src/libs/instructions/custom-theme/tool/tool.component.ts",
      "src/libs/instructions/index.ts",
      "src/libs/instructions/instroduction/instroduction.component.html",
      "src/libs/instructions/instroduction/instroduction.component.scss",
      "src/libs/instructions/instroduction/instroduction.component.ts",
      "src/libs/instructions/portal-config/portal-config.component.html",
      "src/libs/instructions/portal-config/portal-config.component.scss",
      "src/libs/instructions/portal-config/portal-config.component.ts",
      "src/libs/instructions/routes.ts",
      "src/libs/patterns/index.ts",
      "src/libs/patterns/list/base/base.component.html",
      "src/libs/patterns/list/base/base.component.scss",
      "src/libs/patterns/list/base/base.component.ts",
      "src/libs/patterns/page-builder/page-builder.component.html",
      "src/libs/patterns/page-builder/page-builder.component.scss",
      "src/libs/patterns/page-builder/page-builder.component.ts",
      "src/libs/patterns/routes.ts",
      "src/libs/patterns/shared/demo-button/demo-button.component.html",
      "src/libs/patterns/shared/demo-button/demo-button.component.scss",
      "src/libs/patterns/shared/demo-button/demo-button.component.ts",
      "src/libs/patterns/shared/demo-table/demo-table.component.html",
      "src/libs/patterns/shared/demo-table/demo-table.component.scss",
      "src/libs/patterns/shared/demo-table/demo-table.component.ts",
      "src/libs/services/confirm/confirm/confirm.component.html",
      "src/libs/services/confirm/confirm/confirm.component.scss",
      "src/libs/services/confirm/confirm/confirm.component.ts",
      "src/libs/services/confirm/confirm/confirm.stories.ts",
      "src/libs/services/confirm/with-date/with-date.component.html",
      "src/libs/services/confirm/with-date/with-date.component.scss",
      "src/libs/services/confirm/with-date/with-date.component.ts",
      "src/libs/services/confirm/with-date/with-date.stories.ts",
      "src/libs/services/confirm/with-input/with-input.component.html",
      "src/libs/services/confirm/with-input/with-input.component.scss",
      "src/libs/services/confirm/with-input/with-input.component.ts",
      "src/libs/services/confirm/with-input/with-input.stories.ts",
      "src/libs/services/confirm/with-radio/with-radio.component.html",
      "src/libs/services/confirm/with-radio/with-radio.component.scss",
      "src/libs/services/confirm/with-radio/with-radio.component.ts",
      "src/libs/services/confirm/with-radio/with-radio.stories.ts",
      "src/libs/services/index.ts",
      "src/libs/services/loading/loading.component.html",
      "src/libs/services/loading/loading.component.scss",
      "src/libs/services/loading/loading.component.ts",
      "src/libs/services/loading/loading.stories.ts",
      "src/libs/services/notify/notify.component.html",
      "src/libs/services/notify/notify.component.scss",
      "src/libs/services/notify/notify.component.ts",
      "src/libs/services/notify/notify.stories.ts",
      "src/libs/services/routes.ts",
      "src/libs/services/unsaved-changes/unsaved-changes.component.ts",
      "src/libs/services/unsaved-changes/unsaved-changes.stories.ts",
      "src/libs/shared/demo-harness.spec.ts",
      "src/libs/shared/demo-harness.ts",
      "src/libs/shared/demo-inventory.ts",
      "src/libs/utilities/icons/icons.component.html",
      "src/libs/utilities/icons/icons.component.scss",
      "src/libs/utilities/icons/icons.component.ts",
      "src/libs/utilities/index.ts",
      "src/libs/utilities/routes.ts",
      "src/libs/utilities/tooltip/tooltip.component.html",
      "src/libs/utilities/tooltip/tooltip.component.scss",
      "src/libs/utilities/tooltip/tooltip.component.ts",
      "src/libs/pages/data/demo-session.store.spec.ts",
      "src/libs/pages/data/demo-session.store.ts",
      "src/libs/pages/data/demo-state.ts",
      "src/libs/pages/data/fixture-factories.spec.ts",
      "src/libs/pages/data/fixture-factories.ts",
      "src/libs/pages/data/models.ts",
      "src/libs/pages/data/query.spec.ts",
      "src/libs/pages/data/query.ts",
      "src/libs/pages/data/validators.spec.ts",
      "src/libs/pages/data/validators.ts",
      "docs/page-patterns.md",
      "public/catalog/page-pattern-sources.v1.json",
      "public/catalog/page-patterns.v1.json",
      "scripts/export-page-catalog.mjs",
      "scripts/export-page-catalog.test.mjs",
      "src/libs/pages/catalog/pattern-loaders.ts",
      "src/libs/pages/catalog/pattern-registry.spec.ts",
      "src/libs/pages/catalog/pattern-registry.ts",
      "src/libs/pages/catalog/pattern.model.ts",
      "src/libs/pages/components/entity-facts.component.html",
      "src/libs/pages/components/entity-facts.component.scss",
      "src/libs/pages/components/entity-facts.component.ts",
      "src/libs/pages/components/related-records.component.html",
      "src/libs/pages/components/related-records.component.scss",
      "src/libs/pages/components/related-records.component.ts",
      "src/libs/pages/patterns/detail-overview/detail-overview.component.html",
      "src/libs/pages/patterns/detail-overview/detail-overview.component.scss",
      "src/libs/pages/patterns/detail-overview/detail-overview.component.ts",
      "src/libs/pages/patterns/detail-patterns.spec.ts",
      "src/libs/pages/patterns/detail-related-records/detail-related-records.component.html",
      "src/libs/pages/patterns/detail-related-records/detail-related-records.component.scss",
      "src/libs/pages/patterns/detail-related-records/detail-related-records.component.ts",
      "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.html",
      "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.scss",
      "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.ts",
      "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.html",
      "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.scss",
      "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.ts",
      "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.html",
      "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.scss",
      "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.ts",
      "src/libs/pages/patterns/list-master-detail/list-master-detail.component.html",
      "src/libs/pages/patterns/list-master-detail/list-master-detail.component.scss",
      "src/libs/pages/patterns/list-master-detail/list-master-detail.component.ts",
      "src/libs/pages/patterns/list-patterns.spec.ts",
      "src/libs/pages/patterns/list-standard/list-standard.component.html",
      "src/libs/pages/patterns/list-standard/list-standard.component.scss",
      "src/libs/pages/patterns/list-standard/list-standard.component.ts",
      "src/libs/pages/components/entity-form-sections.component.html",
      "src/libs/pages/components/entity-form-sections.component.scss",
      "src/libs/pages/components/entity-form-sections.component.ts",
      "src/libs/pages/components/line-item-editor.component.html",
      "src/libs/pages/components/line-item-editor.component.scss",
      "src/libs/pages/components/line-item-editor.component.spec.ts",
      "src/libs/pages/components/line-item-editor.component.ts",
      "src/libs/pages/components/unsaved-changes.guard.ts",
      "src/libs/pages/patterns/drawer-compact/drawer-compact.component.html",
      "src/libs/pages/patterns/drawer-compact/drawer-compact.component.scss",
      "src/libs/pages/patterns/drawer-compact/drawer-compact.component.ts",
      "src/libs/pages/patterns/drawer-patterns.spec.ts",
      "src/libs/pages/patterns/drawer-sections/drawer-sections.component.html",
      "src/libs/pages/patterns/drawer-sections/drawer-sections.component.scss",
      "src/libs/pages/patterns/drawer-sections/drawer-sections.component.ts",
      "src/libs/pages/patterns/form-line-items/form-line-items.component.html",
      "src/libs/pages/patterns/form-line-items/form-line-items.component.scss",
      "src/libs/pages/patterns/form-line-items/form-line-items.component.ts",
      "src/libs/pages/patterns/form-patterns.spec.ts",
      "src/libs/pages/patterns/form-sections/form-sections.component.html",
      "src/libs/pages/patterns/form-sections/form-sections.component.scss",
      "src/libs/pages/patterns/form-sections/form-sections.component.ts",
      "src/libs/pages/patterns/form-simple/form-simple.component.html",
      "src/libs/pages/patterns/form-simple/form-simple.component.scss",
      "src/libs/pages/patterns/form-simple/form-simple.component.ts",
      "e2e/accessibility.spec.ts",
      "e2e/helpers/demo-fixtures.ts",
      "e2e/pages.spec.ts",
      "e2e/portal-reference.spec.ts",
      "e2e/storybook.spec.ts",
      "playwright.config.ts",
      "README.md",
      "docs/storybook.md",
      "docs/verification.md"
    ],
    "prohibited_paths": [
      ".git/**",
      ".env*",
      "src/environments/**",
      ".sdcorejs/specs/**",
      ".sdcorejs/architecture/**",
      ".sdcorejs/plans/**",
      ".sdcorejs/conventions/**"
    ],
    "generated_artifacts": [
      "node_modules/**",
      ".angular/**",
      "dist/**",
      "storybook-static/**",
      "test-results/**",
      "playwright-report/**",
      "coverage/**",
      "public/catalog/page-patterns.v1.json",
      "public/catalog/page-pattern-sources.v1.json",
      "docs/page-patterns.md"
    ],
    "docs_artifacts": [
      ".sdcorejs/design/decisions/portal-reference-core22.md",
      ".sdcorejs/design/flows/portal-reference-core22.md",
      ".sdcorejs/design/specs/portal-reference-core22.md",
      ".sdcorejs/design/wireframes/portal-reference-core22/detail-tabbed.html",
      ".sdcorejs/design/wireframes/portal-reference-core22/drawer-compact.html",
      ".sdcorejs/design/wireframes/portal-reference-core22/form-sections.html",
      ".sdcorejs/design/wireframes/portal-reference-core22/list-standard.html",
      ".sdcorejs/docs/design/portal-reference-core22.md",
      "docs/page-patterns.md",
      "README.md",
      "docs/storybook.md",
      "docs/verification.md"
    ],
    "dependency_changes": {
      "required": true,
      "packages": [
        "@sdcorejs/angular",
        "@angular/*",
        "@angular-devkit/*",
        "typescript",
        "angular-eslint",
        "typescript-eslint",
        "storybook",
        "@storybook/angular",
        "@storybook/addon-docs",
        "@playwright/test"
      ],
      "approval_required": true
    },
    "env_changes": {
      "required": false,
      "files": [],
      "approval_required": false,
      "note": "Process-only PATH/runtime; no machine-global or persisted env writes"
    },
    "migration_changes": {
      "required": true,
      "description": "Angular20/Core20 to Angular22/Core22.2.7, compatible API/provider/theme migration",
      "approval_required": true
    },
    "frontend_architecture": {
      "required": true,
      "conformance_invariant_refs": [
        "INV-001",
        "INV-002",
        "INV-003",
        "INV-004",
        "INV-005",
        "INV-006"
      ],
      "not_applicable_reason": null,
      "project_conventions": {
        "component_style": "Angular standalone + separate HTML/SCSS; signals, OnPush in existing demos",
        "folder_convention": "src/libs/<category>/<demo>, lazy routes.ts and explicit index.ts",
        "state_convention": "signals/local component state; add per-demo provider for related CRUD flows",
        "service_data_access_convention": "Core services; demo local fixture/query functions; no real backend",
        "registration_provider_convention": "bootstrapApplication + provider tokens; loadChildren/loadComponent",
        "public_api_barrel_convention": "category routes exported, feature children private",
        "test_convention": "Karma/Jasmine configured, no existing spec files discovered; add colocated behavior tests and Playwright E2E",
        "evidence_inspected": [
          "src/main.ts",
          "src/app/components/main/main.component.html",
          "src/libs/components/button/button.component.ts",
          "src/libs/patterns/list/base/base.component.ts",
          "angular.json",
          "tsconfig.json"
        ]
      },
      "component_tree": [
        {
          "symbol": "MainComponent",
          "path": "src/app/components/main/main.component.ts",
          "children": [
            "PageReferenceComponent",
            "Legacy demo routes"
          ]
        },
        {
          "symbol": "PageReferenceComponent",
          "path": "src/libs/pages/reference/page-reference.component.ts",
          "children": [
            "DemoHostComponent",
            "Guide/Data/Source tabs"
          ]
        },
        {
          "symbol": "DemoHostComponent",
          "path": "src/libs/pages/reference/demo-host.component.ts",
          "children": [
            "list-standard",
            "list-advanced-filter",
            "list-grouped-tree",
            "list-master-detail",
            "detail-overview",
            "detail-tabbed",
            "detail-related-records",
            "form-simple",
            "form-sections",
            "form-line-items",
            "drawer-compact",
            "drawer-sections"
          ],
          "provider": "DemoSessionStore — per instance or route-parent scope"
        },
        {
          "symbol": "Detail containers",
          "children": [
            "EntityFactsComponent",
            "RelatedRecordsComponent",
            "Core sections/tabs"
          ]
        },
        {
          "symbol": "Form/drawer containers",
          "children": [
            "EntityFormSectionsComponent",
            "LineItemEditorComponent",
            "Core form controls/side drawer"
          ]
        }
      ],
      "reuse_decisions": [
        {
          "need": "Shell",
          "candidate": "MainComponent + Core sd-layout",
          "decision": "extend",
          "reason": "Giữ tab router và settings"
        },
        {
          "need": "UI primitives",
          "candidate": "@sdcorejs/angular@22.2.7 exports/source",
          "decision": "reuse",
          "reason": "Xác minh exact API trước edit, không clone Core"
        },
        {
          "need": "Demo stories",
          "candidate": "existing src/libs demo components",
          "decision": "extend",
          "reason": "Cùng implementation, thêm typed controls/reset khi cần"
        },
        {
          "need": "Shared fact/line item regions",
          "candidate": "none",
          "decision": "create_feature_local",
          "reason": "Cohesive regions, nhiều pattern dùng cùng semantics"
        },
        {
          "need": "Field labels/simple wrappers",
          "candidate": "inline templates",
          "decision": "keep_inline",
          "reason": "Không wrapper một control chỉ để giảm dòng"
        }
      ],
      "file_decisions": [
        {
          "path": "src/app/app.routes.ts",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/app/components/main/main.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/app/components/main/main.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/app/configurations/auth.configuration.ts",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/app/configurations/index.ts",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/app/configurations/layout.configuration.ts",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/app/configurations/permission.configuration.ts",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/app/configurations/portal-config.ts",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/app/reference-providers.ts",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/index.ts",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/reference/demo-host.component.html",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/reference/demo-host.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/reference/demo-host.component.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/reference/demo-host.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/reference/page-reference.component.html",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/reference/page-reference.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/reference/page-reference.component.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/reference/page-reference.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/pages/routes.ts",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/main.ts",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/styles.scss",
          "decision": "extend",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/styles/reference.scss",
          "decision": "create",
          "owner_task_id": "TASK-003",
          "reason": "Shell, reference layout và route integration"
        },
        {
          "path": "src/libs/components/anchor/anchor.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/anchor.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/basic/basic.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/basic/basic.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/basic/basic.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/basic/basic.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/with-section/with-section.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/with-section/with-section.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/with-section/with-section.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/anchor/with-section/with-section.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/avatar/avatar.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/avatar/avatar.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/avatar/avatar.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/avatar/avatar.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/badge/badge.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/badge/badge.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/badge/badge.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/badge/badge.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/button/button.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/button/button.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/button/button.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/button/button.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/index.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/basic/basic.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/basic/basic.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/basic/basic.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/basic/basic.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/slots/slots.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/slots/slots.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/slots/slots.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/slots/slots.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/view-modes/view-modes.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/view-modes/view-modes.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/view-modes/view-modes.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/modal/view-modes/view-modes.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/preview-image/preview-image.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/preview-image/preview-image.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/preview-image/preview-image.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/preview-image/preview-image.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/preview-pdf/preview-pdf.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/preview-pdf/preview-pdf.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/preview-pdf/preview-pdf.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/preview-pdf/preview-pdf.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/basic/basic.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/basic/basic.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/basic/basic.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/basic/basic.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/fields/fields.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/fields/fields.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/fields/fields.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/fields/fields.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/modes/modes.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/modes/modes.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/modes/modes.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/query-bar/modes/modes.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/routes.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/basic/basic.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/basic/basic.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/basic/basic.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/basic/basic.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/header-slots/header-slots.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/header-slots/header-slots.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/header-slots/header-slots.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/header-slots/header-slots.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/section-item/section-item.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/section-item/section-item.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/section-item/section-item.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/section/section-item/section-item.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/advanced/advanced.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/advanced/advanced.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/advanced/advanced.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/advanced/advanced.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/basic/basic.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/basic/basic.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/basic/basic.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/basic/basic.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/custom/custom.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/custom/custom.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/custom/custom.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/custom/custom.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/loading/loading.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/loading/loading.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/loading/loading.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/side-drawer/loading/loading.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/splitter/splitter.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/splitter/splitter.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/splitter/splitter.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/splitter/splitter.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/basic/basic.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/basic/basic.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/basic/basic.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/basic/basic.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/column/column.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/column/column.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/column/column.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/column/column.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/filter/filter.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/filter/filter.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/filter/filter.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/filter/filter.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/index-column/index-column.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/index-column/index-column.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/index-column/index-column.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/index-column/index-column.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/tree/tree.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/tree/tree.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/tree/tree.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/table/tree/tree.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/upload-file/upload-file.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/upload-file/upload-file.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/upload-file/upload-file.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/components/upload-file/upload-file.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/checkbox/checkbox.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/checkbox/checkbox.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/checkbox/checkbox.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/checkbox/checkbox.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/chip-calendar/chip-calendar.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/chip-calendar/chip-calendar.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/chip-calendar/chip-calendar.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/chip-calendar/chip-calendar.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/chip/chip.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/chip/chip.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/chip/chip.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/chip/chip.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/date/date.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/date/date.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/date/date.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/date/date.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/datetime/datetime.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/datetime/datetime.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/datetime/datetime.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/datetime/datetime.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/index.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/input-number/input-number.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/input-number/input-number.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/input-number/input-number.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/input-number/input-number.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/input/input.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/input/input.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/input/input.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/input/input.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/radio/radio.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/radio/radio.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/radio/radio.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/radio/radio.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/routes.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/select/select.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/select/select.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/select/select.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/select/select.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/switch/switch.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/switch/switch.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/switch/switch.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/switch/switch.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/textarea/textarea.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/textarea/textarea.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/textarea/textarea.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/textarea/textarea.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/validation/validation.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/validation/validation.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/validation/validation.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/forms/validation/validation.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/coding-conventions-typescript/coding-conventions-typescript.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/coding-conventions/coding-conventions.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/custom-theme.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/custom-theme.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/custom-theme.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/guide/guide.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/guide/guide.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/guide/guide.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/tool/tool.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/tool/tool.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/custom-theme/tool/tool.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/index.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/instroduction/instroduction.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/instroduction/instroduction.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/instroduction/instroduction.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/portal-config/portal-config.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/portal-config/portal-config.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/portal-config/portal-config.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/instructions/routes.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/index.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/list/base/base.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/list/base/base.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/list/base/base.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/page-builder/page-builder.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/page-builder/page-builder.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/page-builder/page-builder.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/routes.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/shared/demo-button/demo-button.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/shared/demo-button/demo-button.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/shared/demo-button/demo-button.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/shared/demo-table/demo-table.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/shared/demo-table/demo-table.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/patterns/shared/demo-table/demo-table.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/confirm/confirm.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/confirm/confirm.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/confirm/confirm.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/confirm/confirm.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-date/with-date.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-date/with-date.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-date/with-date.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-date/with-date.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-input/with-input.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-input/with-input.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-input/with-input.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-input/with-input.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-radio/with-radio.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-radio/with-radio.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-radio/with-radio.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/confirm/with-radio/with-radio.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/index.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/loading/loading.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/loading/loading.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/loading/loading.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/loading/loading.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/notify/notify.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/notify/notify.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/notify/notify.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/notify/notify.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/routes.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/unsaved-changes/unsaved-changes.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/services/unsaved-changes/unsaved-changes.stories.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/shared/demo-harness.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/shared/demo-harness.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/shared/demo-inventory.ts",
          "decision": "create",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/utilities/icons/icons.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/utilities/icons/icons.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/utilities/icons/icons.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/utilities/index.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/utilities/routes.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/utilities/tooltip/tooltip.component.html",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/utilities/tooltip/tooltip.component.scss",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/utilities/tooltip/tooltip.component.ts",
          "decision": "extend",
          "owner_task_id": "TASK-004",
          "reason": "Migration demo và Storybook đầy đủ inventory"
        },
        {
          "path": "src/libs/pages/data/demo-session.store.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/demo-session.store.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/demo-state.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/fixture-factories.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/fixture-factories.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/models.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/query.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/query.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/validators.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/data/validators.ts",
          "decision": "create",
          "owner_task_id": "TASK-005",
          "reason": "Fixture, query, form logic và session store"
        },
        {
          "path": "src/libs/pages/catalog/pattern-loaders.ts",
          "decision": "create",
          "owner_task_id": "TASK-006",
          "reason": "Registry, catalog v1 và source export"
        },
        {
          "path": "src/libs/pages/catalog/pattern-registry.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-006",
          "reason": "Registry, catalog v1 và source export"
        },
        {
          "path": "src/libs/pages/catalog/pattern-registry.ts",
          "decision": "create",
          "owner_task_id": "TASK-006",
          "reason": "Registry, catalog v1 và source export"
        },
        {
          "path": "src/libs/pages/catalog/pattern.model.ts",
          "decision": "create",
          "owner_task_id": "TASK-006",
          "reason": "Registry, catalog v1 và source export"
        },
        {
          "path": "src/libs/pages/components/entity-facts.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/components/entity-facts.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/components/entity-facts.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/components/related-records.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/components/related-records.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/components/related-records.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-overview/detail-overview.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-overview/detail-overview.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-overview/detail-overview.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-patterns.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-related-records/detail-related-records.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-related-records/detail-related-records.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-related-records/detail-related-records.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-master-detail/list-master-detail.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-master-detail/list-master-detail.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-master-detail/list-master-detail.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-patterns.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-standard/list-standard.component.html",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-standard/list-standard.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/patterns/list-standard/list-standard.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-007",
          "reason": "Bốn List và ba Detail pattern"
        },
        {
          "path": "src/libs/pages/components/entity-form-sections.component.html",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/components/entity-form-sections.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/components/entity-form-sections.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/components/line-item-editor.component.html",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/components/line-item-editor.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/components/line-item-editor.component.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/components/line-item-editor.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/components/unsaved-changes.guard.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/drawer-compact/drawer-compact.component.html",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/drawer-compact/drawer-compact.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/drawer-compact/drawer-compact.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/drawer-patterns.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/drawer-sections/drawer-sections.component.html",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/drawer-sections/drawer-sections.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/drawer-sections/drawer-sections.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-line-items/form-line-items.component.html",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-line-items/form-line-items.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-line-items/form-line-items.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-patterns.spec.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-sections/form-sections.component.html",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-sections/form-sections.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-sections/form-sections.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-simple/form-simple.component.html",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-simple/form-simple.component.scss",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        },
        {
          "path": "src/libs/pages/patterns/form-simple/form-simple.component.ts",
          "decision": "create",
          "owner_task_id": "TASK-008",
          "reason": "Ba Form và hai Drawer pattern"
        }
      ],
      "state_owners": [
        {
          "subject": "Entity và mutation trong demo session",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner": "Demo session provider theo instance/route cha",
          "lifecycle": "Seed khi vào demo, reset có chủ ý, destroy khi rời demo.",
          "invariant_refs": [
            "INV-002",
            "INV-003"
          ]
        },
        {
          "subject": "Query/selection và form draft",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner": "List/form container",
          "lifecycle": "Tab giữ state; đổi pattern giải quyết dirty; selection current page.",
          "invariant_refs": [
            "INV-003"
          ]
        },
        {
          "subject": "Locale/format và theme",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "owner": "Host configuration và shared theme source",
          "lifecycle": "Portal settings tồn tại theo cơ chế cũ; story settings độc lập.",
          "invariant_refs": [
            "INV-001"
          ]
        }
      ],
      "service_boundaries": [
        {
          "symbol": "DemoSessionStore",
          "scope": "route",
          "reason": "List/detail/create/update cùng session; story host riêng instance"
        },
        {
          "symbol": "query/validators/fixture factories",
          "scope": "pure_function",
          "reason": "Không lifecycle mutable toàn cục"
        },
        {
          "symbol": "UnsavedChangesGuard + overlay coordinator",
          "scope": "component",
          "reason": "Form owner và opener phối hợp close/route dirty"
        }
      ],
      "data_flow": [
        "Host -> pattern container -> session store -> pure query/fixture -> typed view models",
        "Form -> validated save -> store -> list/detail derive",
        "Registry -> reference/JSON/Markdown; loader map chỉ Angular side"
      ],
      "declarations_and_registration": [
        "Standalone children imported by their parent; never NgModule declarations",
        "Pages routes exported through src/libs/pages/index.ts to src/app/app.routes.ts",
        "Storybook decorators configure Core providers without main.ts",
        "Static demo route precedes :patternId; parent provider survives child flow"
      ],
      "public_exports": [
        "pagesRoutes only for application registration",
        "Pure catalog model/registry for exporter and tests",
        "Feature-private pages/children are not global exports"
      ],
      "remaining_contract": "Task-owned file inventory, state table in approved architecture, TDD logic and browser/manual verification below. No additional facade/library dependency without demonstrated need."
    },
    "agent_architecture": {
      "required": false,
      "conformance_invariant_refs": [],
      "not_applicable_reason": "Catalog reference for AI consumers; no application AI agent"
    },
    "execution_policy": "sequential",
    "parallel_candidates": {
      "allowed": false,
      "units": [],
      "shared_files": [
        {
          "path": "package.json",
          "owner_task_id": "TASK-001",
          "strategy": "Single task owner; repairs return to owner"
        },
        {
          "path": "package-lock.json",
          "owner_task_id": "TASK-001",
          "strategy": "Single task owner; repairs return to owner"
        },
        {
          "path": "angular.json",
          "owner_task_id": "TASK-001",
          "strategy": "Single task owner; repairs return to owner"
        },
        {
          "path": "src/main.ts",
          "owner_task_id": "TASK-003",
          "strategy": "Single task owner; repairs return to owner"
        },
        {
          "path": "src/app/app.routes.ts",
          "owner_task_id": "TASK-003",
          "strategy": "Single task owner; repairs return to owner"
        },
        {
          "path": "src/styles.scss",
          "owner_task_id": "TASK-003",
          "strategy": "Single task owner; repairs return to owner"
        }
      ]
    },
    "dependency_order": [
      "TASK-001",
      "TASK-002",
      "TASK-005",
      "TASK-003",
      "TASK-004",
      "TASK-006",
      "TASK-007",
      "TASK-008",
      "TASK-009",
      "TASK-010"
    ],
    "gitlink_updates_in_scope": false,
    "repository_plan": {
      "schema_version": 1,
      "integration_owner_repository_id": "github.com/sdcorejs/portal-template",
      "dependency_order": [
        "TASK-001",
        "TASK-002",
        "TASK-005",
        "TASK-003",
        "TASK-004",
        "TASK-006",
        "TASK-007",
        "TASK-008",
        "TASK-009",
        "TASK-010"
      ],
      "repositories": [
        {
          "repository_id": "github.com/sdcorejs/portal-template",
          "role": "portal",
          "module_id": null,
          "available": true,
          "writable": true
        }
      ],
      "steps": [
        {
          "id": "TASK-001",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [],
          "allowed_paths": [
            ".gitignore",
            "angular.json",
            "eslint.config.js",
            "package-lock.json",
            "package.json",
            "scripts/check-toolchain.mjs",
            "tsconfig.app.json",
            "tsconfig.json",
            "tsconfig.spec.json"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-002",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-001"
          ],
          "allowed_paths": [
            ".sdcorejs/design/decisions/portal-reference-core22.md",
            ".sdcorejs/design/flows/portal-reference-core22.md",
            ".sdcorejs/design/specs/portal-reference-core22.md",
            ".sdcorejs/design/wireframes/portal-reference-core22/detail-tabbed.html",
            ".sdcorejs/design/wireframes/portal-reference-core22/drawer-compact.html",
            ".sdcorejs/design/wireframes/portal-reference-core22/form-sections.html",
            ".sdcorejs/design/wireframes/portal-reference-core22/list-standard.html",
            ".sdcorejs/docs/design/portal-reference-core22.md"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-003",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-001",
            "TASK-002",
            "TASK-005"
          ],
          "allowed_paths": [
            "src/app/app.routes.ts",
            "src/app/components/main/main.component.html",
            "src/app/components/main/main.component.ts",
            "src/app/configurations/auth.configuration.ts",
            "src/app/configurations/index.ts",
            "src/app/configurations/layout.configuration.ts",
            "src/app/configurations/permission.configuration.ts",
            "src/app/configurations/portal-config.ts",
            "src/app/reference-providers.ts",
            "src/libs/pages/index.ts",
            "src/libs/pages/reference/demo-host.component.html",
            "src/libs/pages/reference/demo-host.component.scss",
            "src/libs/pages/reference/demo-host.component.spec.ts",
            "src/libs/pages/reference/demo-host.component.ts",
            "src/libs/pages/reference/page-reference.component.html",
            "src/libs/pages/reference/page-reference.component.scss",
            "src/libs/pages/reference/page-reference.component.spec.ts",
            "src/libs/pages/reference/page-reference.component.ts",
            "src/libs/pages/routes.ts",
            "src/main.ts",
            "src/styles.scss",
            "src/styles/reference.scss"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-004",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-001",
            "TASK-002",
            "TASK-003"
          ],
          "allowed_paths": [
            ".storybook/main.ts",
            ".storybook/preview.ts",
            ".storybook/tsconfig.json",
            "src/libs/components/anchor/anchor.component.ts",
            "src/libs/components/anchor/anchor.stories.ts",
            "src/libs/components/anchor/basic/basic.component.html",
            "src/libs/components/anchor/basic/basic.component.scss",
            "src/libs/components/anchor/basic/basic.component.ts",
            "src/libs/components/anchor/basic/basic.stories.ts",
            "src/libs/components/anchor/with-section/with-section.component.html",
            "src/libs/components/anchor/with-section/with-section.component.scss",
            "src/libs/components/anchor/with-section/with-section.component.ts",
            "src/libs/components/anchor/with-section/with-section.stories.ts",
            "src/libs/components/avatar/avatar.component.html",
            "src/libs/components/avatar/avatar.component.scss",
            "src/libs/components/avatar/avatar.component.ts",
            "src/libs/components/avatar/avatar.stories.ts",
            "src/libs/components/badge/badge.component.html",
            "src/libs/components/badge/badge.component.scss",
            "src/libs/components/badge/badge.component.ts",
            "src/libs/components/badge/badge.stories.ts",
            "src/libs/components/button/button.component.html",
            "src/libs/components/button/button.component.scss",
            "src/libs/components/button/button.component.ts",
            "src/libs/components/button/button.stories.ts",
            "src/libs/components/index.ts",
            "src/libs/components/modal/basic/basic.component.html",
            "src/libs/components/modal/basic/basic.component.scss",
            "src/libs/components/modal/basic/basic.component.ts",
            "src/libs/components/modal/basic/basic.stories.ts",
            "src/libs/components/modal/slots/slots.component.html",
            "src/libs/components/modal/slots/slots.component.scss",
            "src/libs/components/modal/slots/slots.component.ts",
            "src/libs/components/modal/slots/slots.stories.ts",
            "src/libs/components/modal/view-modes/view-modes.component.html",
            "src/libs/components/modal/view-modes/view-modes.component.scss",
            "src/libs/components/modal/view-modes/view-modes.component.ts",
            "src/libs/components/modal/view-modes/view-modes.stories.ts",
            "src/libs/components/preview-image/preview-image.component.html",
            "src/libs/components/preview-image/preview-image.component.scss",
            "src/libs/components/preview-image/preview-image.component.ts",
            "src/libs/components/preview-image/preview-image.stories.ts",
            "src/libs/components/preview-pdf/preview-pdf.component.html",
            "src/libs/components/preview-pdf/preview-pdf.component.scss",
            "src/libs/components/preview-pdf/preview-pdf.component.ts",
            "src/libs/components/preview-pdf/preview-pdf.stories.ts",
            "src/libs/components/query-bar/basic/basic.component.html",
            "src/libs/components/query-bar/basic/basic.component.scss",
            "src/libs/components/query-bar/basic/basic.component.ts",
            "src/libs/components/query-bar/basic/basic.stories.ts",
            "src/libs/components/query-bar/fields/fields.component.html",
            "src/libs/components/query-bar/fields/fields.component.scss",
            "src/libs/components/query-bar/fields/fields.component.ts",
            "src/libs/components/query-bar/fields/fields.stories.ts",
            "src/libs/components/query-bar/modes/modes.component.html",
            "src/libs/components/query-bar/modes/modes.component.scss",
            "src/libs/components/query-bar/modes/modes.component.ts",
            "src/libs/components/query-bar/modes/modes.stories.ts",
            "src/libs/components/routes.ts",
            "src/libs/components/section/basic/basic.component.html",
            "src/libs/components/section/basic/basic.component.scss",
            "src/libs/components/section/basic/basic.component.ts",
            "src/libs/components/section/basic/basic.stories.ts",
            "src/libs/components/section/header-slots/header-slots.component.html",
            "src/libs/components/section/header-slots/header-slots.component.scss",
            "src/libs/components/section/header-slots/header-slots.component.ts",
            "src/libs/components/section/header-slots/header-slots.stories.ts",
            "src/libs/components/section/section-item/section-item.component.html",
            "src/libs/components/section/section-item/section-item.component.scss",
            "src/libs/components/section/section-item/section-item.component.ts",
            "src/libs/components/section/section-item/section-item.stories.ts",
            "src/libs/components/side-drawer/advanced/advanced.component.html",
            "src/libs/components/side-drawer/advanced/advanced.component.scss",
            "src/libs/components/side-drawer/advanced/advanced.component.ts",
            "src/libs/components/side-drawer/advanced/advanced.stories.ts",
            "src/libs/components/side-drawer/basic/basic.component.html",
            "src/libs/components/side-drawer/basic/basic.component.scss",
            "src/libs/components/side-drawer/basic/basic.component.ts",
            "src/libs/components/side-drawer/basic/basic.stories.ts",
            "src/libs/components/side-drawer/custom/custom.component.html",
            "src/libs/components/side-drawer/custom/custom.component.scss",
            "src/libs/components/side-drawer/custom/custom.component.ts",
            "src/libs/components/side-drawer/custom/custom.stories.ts",
            "src/libs/components/side-drawer/loading/loading.component.html",
            "src/libs/components/side-drawer/loading/loading.component.scss",
            "src/libs/components/side-drawer/loading/loading.component.ts",
            "src/libs/components/side-drawer/loading/loading.stories.ts",
            "src/libs/components/splitter/splitter.component.html",
            "src/libs/components/splitter/splitter.component.scss",
            "src/libs/components/splitter/splitter.component.ts",
            "src/libs/components/splitter/splitter.stories.ts",
            "src/libs/components/table/basic/basic.component.html",
            "src/libs/components/table/basic/basic.component.scss",
            "src/libs/components/table/basic/basic.component.ts",
            "src/libs/components/table/basic/basic.stories.ts",
            "src/libs/components/table/column/column.component.html",
            "src/libs/components/table/column/column.component.scss",
            "src/libs/components/table/column/column.component.ts",
            "src/libs/components/table/column/column.stories.ts",
            "src/libs/components/table/filter/filter.component.html",
            "src/libs/components/table/filter/filter.component.scss",
            "src/libs/components/table/filter/filter.component.ts",
            "src/libs/components/table/filter/filter.stories.ts",
            "src/libs/components/table/index-column/index-column.component.html",
            "src/libs/components/table/index-column/index-column.component.scss",
            "src/libs/components/table/index-column/index-column.component.ts",
            "src/libs/components/table/index-column/index-column.stories.ts",
            "src/libs/components/table/tree/tree.component.html",
            "src/libs/components/table/tree/tree.component.scss",
            "src/libs/components/table/tree/tree.component.ts",
            "src/libs/components/table/tree/tree.stories.ts",
            "src/libs/components/upload-file/upload-file.component.html",
            "src/libs/components/upload-file/upload-file.component.scss",
            "src/libs/components/upload-file/upload-file.component.ts",
            "src/libs/components/upload-file/upload-file.stories.ts",
            "src/libs/forms/checkbox/checkbox.component.html",
            "src/libs/forms/checkbox/checkbox.component.scss",
            "src/libs/forms/checkbox/checkbox.component.ts",
            "src/libs/forms/checkbox/checkbox.stories.ts",
            "src/libs/forms/chip-calendar/chip-calendar.component.html",
            "src/libs/forms/chip-calendar/chip-calendar.component.scss",
            "src/libs/forms/chip-calendar/chip-calendar.component.ts",
            "src/libs/forms/chip-calendar/chip-calendar.stories.ts",
            "src/libs/forms/chip/chip.component.html",
            "src/libs/forms/chip/chip.component.scss",
            "src/libs/forms/chip/chip.component.ts",
            "src/libs/forms/chip/chip.stories.ts",
            "src/libs/forms/date/date.component.html",
            "src/libs/forms/date/date.component.scss",
            "src/libs/forms/date/date.component.ts",
            "src/libs/forms/date/date.stories.ts",
            "src/libs/forms/datetime/datetime.component.html",
            "src/libs/forms/datetime/datetime.component.scss",
            "src/libs/forms/datetime/datetime.component.ts",
            "src/libs/forms/datetime/datetime.stories.ts",
            "src/libs/forms/index.ts",
            "src/libs/forms/input-number/input-number.component.html",
            "src/libs/forms/input-number/input-number.component.scss",
            "src/libs/forms/input-number/input-number.component.ts",
            "src/libs/forms/input-number/input-number.stories.ts",
            "src/libs/forms/input/input.component.html",
            "src/libs/forms/input/input.component.scss",
            "src/libs/forms/input/input.component.ts",
            "src/libs/forms/input/input.stories.ts",
            "src/libs/forms/radio/radio.component.html",
            "src/libs/forms/radio/radio.component.scss",
            "src/libs/forms/radio/radio.component.ts",
            "src/libs/forms/radio/radio.stories.ts",
            "src/libs/forms/routes.ts",
            "src/libs/forms/select/select.component.html",
            "src/libs/forms/select/select.component.scss",
            "src/libs/forms/select/select.component.ts",
            "src/libs/forms/select/select.stories.ts",
            "src/libs/forms/switch/switch.component.html",
            "src/libs/forms/switch/switch.component.scss",
            "src/libs/forms/switch/switch.component.ts",
            "src/libs/forms/switch/switch.stories.ts",
            "src/libs/forms/textarea/textarea.component.html",
            "src/libs/forms/textarea/textarea.component.scss",
            "src/libs/forms/textarea/textarea.component.ts",
            "src/libs/forms/textarea/textarea.stories.ts",
            "src/libs/forms/validation/validation.component.html",
            "src/libs/forms/validation/validation.component.scss",
            "src/libs/forms/validation/validation.component.ts",
            "src/libs/forms/validation/validation.stories.ts",
            "src/libs/instructions/coding-conventions-typescript/coding-conventions-typescript.component.ts",
            "src/libs/instructions/coding-conventions/coding-conventions.component.ts",
            "src/libs/instructions/custom-theme/custom-theme.component.html",
            "src/libs/instructions/custom-theme/custom-theme.component.scss",
            "src/libs/instructions/custom-theme/custom-theme.component.ts",
            "src/libs/instructions/custom-theme/guide/guide.component.html",
            "src/libs/instructions/custom-theme/guide/guide.component.scss",
            "src/libs/instructions/custom-theme/guide/guide.component.ts",
            "src/libs/instructions/custom-theme/tool/tool.component.html",
            "src/libs/instructions/custom-theme/tool/tool.component.scss",
            "src/libs/instructions/custom-theme/tool/tool.component.ts",
            "src/libs/instructions/index.ts",
            "src/libs/instructions/instroduction/instroduction.component.html",
            "src/libs/instructions/instroduction/instroduction.component.scss",
            "src/libs/instructions/instroduction/instroduction.component.ts",
            "src/libs/instructions/portal-config/portal-config.component.html",
            "src/libs/instructions/portal-config/portal-config.component.scss",
            "src/libs/instructions/portal-config/portal-config.component.ts",
            "src/libs/instructions/routes.ts",
            "src/libs/patterns/index.ts",
            "src/libs/patterns/list/base/base.component.html",
            "src/libs/patterns/list/base/base.component.scss",
            "src/libs/patterns/list/base/base.component.ts",
            "src/libs/patterns/page-builder/page-builder.component.html",
            "src/libs/patterns/page-builder/page-builder.component.scss",
            "src/libs/patterns/page-builder/page-builder.component.ts",
            "src/libs/patterns/routes.ts",
            "src/libs/patterns/shared/demo-button/demo-button.component.html",
            "src/libs/patterns/shared/demo-button/demo-button.component.scss",
            "src/libs/patterns/shared/demo-button/demo-button.component.ts",
            "src/libs/patterns/shared/demo-table/demo-table.component.html",
            "src/libs/patterns/shared/demo-table/demo-table.component.scss",
            "src/libs/patterns/shared/demo-table/demo-table.component.ts",
            "src/libs/services/confirm/confirm/confirm.component.html",
            "src/libs/services/confirm/confirm/confirm.component.scss",
            "src/libs/services/confirm/confirm/confirm.component.ts",
            "src/libs/services/confirm/confirm/confirm.stories.ts",
            "src/libs/services/confirm/with-date/with-date.component.html",
            "src/libs/services/confirm/with-date/with-date.component.scss",
            "src/libs/services/confirm/with-date/with-date.component.ts",
            "src/libs/services/confirm/with-date/with-date.stories.ts",
            "src/libs/services/confirm/with-input/with-input.component.html",
            "src/libs/services/confirm/with-input/with-input.component.scss",
            "src/libs/services/confirm/with-input/with-input.component.ts",
            "src/libs/services/confirm/with-input/with-input.stories.ts",
            "src/libs/services/confirm/with-radio/with-radio.component.html",
            "src/libs/services/confirm/with-radio/with-radio.component.scss",
            "src/libs/services/confirm/with-radio/with-radio.component.ts",
            "src/libs/services/confirm/with-radio/with-radio.stories.ts",
            "src/libs/services/index.ts",
            "src/libs/services/loading/loading.component.html",
            "src/libs/services/loading/loading.component.scss",
            "src/libs/services/loading/loading.component.ts",
            "src/libs/services/loading/loading.stories.ts",
            "src/libs/services/notify/notify.component.html",
            "src/libs/services/notify/notify.component.scss",
            "src/libs/services/notify/notify.component.ts",
            "src/libs/services/notify/notify.stories.ts",
            "src/libs/services/routes.ts",
            "src/libs/services/unsaved-changes/unsaved-changes.component.ts",
            "src/libs/services/unsaved-changes/unsaved-changes.stories.ts",
            "src/libs/shared/demo-harness.spec.ts",
            "src/libs/shared/demo-harness.ts",
            "src/libs/shared/demo-inventory.ts",
            "src/libs/utilities/icons/icons.component.html",
            "src/libs/utilities/icons/icons.component.scss",
            "src/libs/utilities/icons/icons.component.ts",
            "src/libs/utilities/index.ts",
            "src/libs/utilities/routes.ts",
            "src/libs/utilities/tooltip/tooltip.component.html",
            "src/libs/utilities/tooltip/tooltip.component.scss",
            "src/libs/utilities/tooltip/tooltip.component.ts"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-005",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-001"
          ],
          "allowed_paths": [
            "src/libs/pages/data/demo-session.store.spec.ts",
            "src/libs/pages/data/demo-session.store.ts",
            "src/libs/pages/data/demo-state.ts",
            "src/libs/pages/data/fixture-factories.spec.ts",
            "src/libs/pages/data/fixture-factories.ts",
            "src/libs/pages/data/models.ts",
            "src/libs/pages/data/query.spec.ts",
            "src/libs/pages/data/query.ts",
            "src/libs/pages/data/validators.spec.ts",
            "src/libs/pages/data/validators.ts"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-006",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-001",
            "TASK-005"
          ],
          "allowed_paths": [
            "docs/page-patterns.md",
            "public/catalog/page-pattern-sources.v1.json",
            "public/catalog/page-patterns.v1.json",
            "scripts/export-page-catalog.mjs",
            "scripts/export-page-catalog.test.mjs",
            "src/libs/pages/catalog/pattern-loaders.ts",
            "src/libs/pages/catalog/pattern-registry.spec.ts",
            "src/libs/pages/catalog/pattern-registry.ts",
            "src/libs/pages/catalog/pattern.model.ts"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-007",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-002",
            "TASK-003",
            "TASK-005",
            "TASK-006"
          ],
          "allowed_paths": [
            "src/libs/pages/components/entity-facts.component.html",
            "src/libs/pages/components/entity-facts.component.scss",
            "src/libs/pages/components/entity-facts.component.ts",
            "src/libs/pages/components/related-records.component.html",
            "src/libs/pages/components/related-records.component.scss",
            "src/libs/pages/components/related-records.component.ts",
            "src/libs/pages/patterns/detail-overview/detail-overview.component.html",
            "src/libs/pages/patterns/detail-overview/detail-overview.component.scss",
            "src/libs/pages/patterns/detail-overview/detail-overview.component.ts",
            "src/libs/pages/patterns/detail-patterns.spec.ts",
            "src/libs/pages/patterns/detail-related-records/detail-related-records.component.html",
            "src/libs/pages/patterns/detail-related-records/detail-related-records.component.scss",
            "src/libs/pages/patterns/detail-related-records/detail-related-records.component.ts",
            "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.html",
            "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.scss",
            "src/libs/pages/patterns/detail-tabbed/detail-tabbed.component.ts",
            "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.html",
            "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.scss",
            "src/libs/pages/patterns/list-advanced-filter/list-advanced-filter.component.ts",
            "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.html",
            "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.scss",
            "src/libs/pages/patterns/list-grouped-tree/list-grouped-tree.component.ts",
            "src/libs/pages/patterns/list-master-detail/list-master-detail.component.html",
            "src/libs/pages/patterns/list-master-detail/list-master-detail.component.scss",
            "src/libs/pages/patterns/list-master-detail/list-master-detail.component.ts",
            "src/libs/pages/patterns/list-patterns.spec.ts",
            "src/libs/pages/patterns/list-standard/list-standard.component.html",
            "src/libs/pages/patterns/list-standard/list-standard.component.scss",
            "src/libs/pages/patterns/list-standard/list-standard.component.ts"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-008",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-002",
            "TASK-003",
            "TASK-005",
            "TASK-006",
            "TASK-007"
          ],
          "allowed_paths": [
            "src/libs/pages/components/entity-form-sections.component.html",
            "src/libs/pages/components/entity-form-sections.component.scss",
            "src/libs/pages/components/entity-form-sections.component.ts",
            "src/libs/pages/components/line-item-editor.component.html",
            "src/libs/pages/components/line-item-editor.component.scss",
            "src/libs/pages/components/line-item-editor.component.spec.ts",
            "src/libs/pages/components/line-item-editor.component.ts",
            "src/libs/pages/components/unsaved-changes.guard.ts",
            "src/libs/pages/patterns/drawer-compact/drawer-compact.component.html",
            "src/libs/pages/patterns/drawer-compact/drawer-compact.component.scss",
            "src/libs/pages/patterns/drawer-compact/drawer-compact.component.ts",
            "src/libs/pages/patterns/drawer-patterns.spec.ts",
            "src/libs/pages/patterns/drawer-sections/drawer-sections.component.html",
            "src/libs/pages/patterns/drawer-sections/drawer-sections.component.scss",
            "src/libs/pages/patterns/drawer-sections/drawer-sections.component.ts",
            "src/libs/pages/patterns/form-line-items/form-line-items.component.html",
            "src/libs/pages/patterns/form-line-items/form-line-items.component.scss",
            "src/libs/pages/patterns/form-line-items/form-line-items.component.ts",
            "src/libs/pages/patterns/form-patterns.spec.ts",
            "src/libs/pages/patterns/form-sections/form-sections.component.html",
            "src/libs/pages/patterns/form-sections/form-sections.component.scss",
            "src/libs/pages/patterns/form-sections/form-sections.component.ts",
            "src/libs/pages/patterns/form-simple/form-simple.component.html",
            "src/libs/pages/patterns/form-simple/form-simple.component.scss",
            "src/libs/pages/patterns/form-simple/form-simple.component.ts"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-009",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-004",
            "TASK-007",
            "TASK-008"
          ],
          "allowed_paths": [
            "e2e/accessibility.spec.ts",
            "e2e/helpers/demo-fixtures.ts",
            "e2e/pages.spec.ts",
            "e2e/portal-reference.spec.ts",
            "e2e/storybook.spec.ts",
            "playwright.config.ts"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        },
        {
          "id": "TASK-010",
          "action": "EDIT",
          "owner_repository_id": "github.com/sdcorejs/portal-template",
          "git_roots": [
            "github.com/sdcorejs/portal-template"
          ],
          "semantic_scope": "portal-composition",
          "depends_on": [
            "TASK-009",
            "TASK-006"
          ],
          "allowed_paths": [
            "README.md",
            "docs/storybook.md",
            "docs/verification.md"
          ],
          "prohibited_paths": [
            ".git/**",
            ".env*",
            "src/environments/**",
            ".sdcorejs/specs/**",
            ".sdcorejs/architecture/**",
            ".sdcorejs/plans/**",
            ".sdcorejs/conventions/**"
          ]
        }
      ],
      "gitlink_updates_in_scope": false
    },
    "verification_strategy": {
      "package_manager": "npm",
      "commands_planned": [
        "npm run check:toolchain",
        "npm run build",
        "npm run lint",
        "npm test -- --watch=false --browsers=ChromeHeadless",
        "npm run build-storybook",
        "npm run test:catalog",
        "npm run check:catalog",
        "npm run test:e2e"
      ],
      "commands_skipped": [
        {
          "command": "deploy/publish/push",
          "reason": "Ngoài phạm vi đã duyệt"
        }
      ],
      "new_scripts": {
        "check:toolchain": "node scripts/check-toolchain.mjs",
        "storybook": "ng run portal-template:storybook",
        "build-storybook": "ng run portal-template:build-storybook",
        "export:catalog": "node scripts/export-page-catalog.mjs",
        "check:catalog": "node scripts/export-page-catalog.mjs --check",
        "test:catalog": "node --test scripts/export-page-catalog.test.mjs",
        "test:e2e": "playwright test"
      },
      "checks": "Unit/component logic + catalog validation + browser real routes/Storybook + manual visual/accessibility; không coi planned là executed"
    },
    "finish_tail": {
      "docs_before_final_branch_ready": true,
      "verify_before_done": true,
      "branch_ready_final_gate": true,
      "no_writes_after_branch_ready": true,
      "simplify": "not-requested",
      "code_documentation": "automatic on touched sources",
      "conventions_and_memories": "no new persistent writes without existing authority"
    },
    "approval": {
      "approved": false,
      "approved_at": null
    },
    "change_control": {
      "revision": 1,
      "supersedes": null,
      "change_reason": null
    },
    "self_review": {
      "goal_backward_valid": true,
      "architecture_draft_handoff_valid": true,
      "validation_map_shape_valid": true,
      "validation_map_approval_identity_pending": true,
      "implementation_tests": "not-run"
    }
  }
}
```

</details>
