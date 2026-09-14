---
allowed_paths: ["src/modules/patterns/**","src/app/app.routes.ts","src/app/components/main/main.component.ts","scripts/**","public/patterns-source.json","package.json","e2e/patterns.spec.ts","playwright.patterns.config.ts","docs/patterns.md",".sdcorejs/**"]
approval_source: "user-request-to-implement-reviewed-design-and-push"
approved_at: "2026-09-14T02:58:21.620Z"
approved_by: "user"
artifact_id: "interactive-page-patterns-plan-r1"
artifact_kind: "plan"
change_ref: "interactive-page-patterns"
commit_policy: "with-change"
contract_id: "interactive-page-patterns"
owner: "sdcorejs-angular"
owner_module_id: null
owner_repository_id: "github.com/sdcorejs/portal-template"
owner_repository_role: "portal"
parent_references: [{"approval_hash":"sha256:v1:9ddf1812cf140f8ea76a50240f8ac5422c662d361b3e064fc5c39304d6663019","artifact_id":"interactive-page-patterns-spec-r1","artifact_kind":"spec","repository_id":"github.com/sdcorejs/portal-template","revision":"532cef8090a44576e54eab88d7619c59817bf598"}]
parent_repository_id: null
prohibited_paths: [".env","node_modules/**"]
repository_relative_path: ".sdcorejs/plans/angular/2026-09-14-interactive-page-patterns.md"
requirement_id: "interactive-page-patterns"
schema_version: 1
source_revision: "532cef8090a44576e54eab88d7619c59817bf598"
stack_profile: "core-ui-angular"
supersedes: null
track: "angular"
approval_hash: "sha256:v1:0d88ebdfb679ba683df1625b0eda6d3167c9221277e03eabb26d752d539c681e"
---
# Thực hiện thiết kế Patterns đã trình bày

Người dùng yêu cầu implement và push sau vòng thiết kế 36 biến thể. Trình tự và component map kế thừa phần Trình tự code trong spec, không mở rộng nghiệp vụ.

1. Cài đúng lockfile, Core 22.2.8.
2. Module Patterns, catalog/preview/routes/menu/source thật.
3. Header/button/scorecard 9 biến thể; table/query/selection.
4. Form editor/facts và drawer CRUD/dirty/save/error/focus.
5. Ghép listing/cards/queue/overview, scorecard filters và query kết hợp.
6. Build/lint/source checks/browser tests/review. Commit các source/design/docs có liên quan và push nhánh hiện tại.

Frontend architecture: .sdcorejs/docs/architecture/2026-09-14-interactive-page-patterns.md. Exclude diagnostics, caches, node_modules và dist.
