---
approval_hash: null
artifact_hash: "sha256:v1:43a23a91d2430f98785f8ad2a5346097bb79a3258a97aa0cdd9ca5adaf973a07"
artifact_id: "design-handoff:interactive-page-patterns"
artifact_kind: "design-handoff"
change_ref: "interactive-page-patterns"
contract_id: "interactive-page-patterns"
experience_scope: "portal-composition"
owner_module_id: null
owner_repository_id: "github.com/sdcorejs/portal-template"
owner_repository_role: "portal"
ownership_scope: "portal-composition"
parent_references: [{"approval_hash":"sha256:v1:9ddf1812cf140f8ea76a50240f8ac5422c662d361b3e064fc5c39304d6663019","artifact_id":"interactive-page-patterns-spec-r1","artifact_kind":"spec","repository_id":"github.com/sdcorejs/portal-template","revision":"532cef8090a44576e54eab88d7619c59817bf598"},{"approval_hash":"sha256:v1:0d88ebdfb679ba683df1625b0eda6d3167c9221277e03eabb26d752d539c681e","artifact_id":"interactive-page-patterns-plan-r1","artifact_kind":"plan","repository_id":"github.com/sdcorejs/portal-template","revision":"532cef8090a44576e54eab88d7619c59817bf598"}]
repository_relative_path: ".sdcorejs/design/specs/interactive-page-patterns.md"
requirement_id: "interactive-page-patterns"
schema_version: 1
source_revision: "532cef8090a44576e54eab88d7619c59817bf598"
stack_profile: "design"
supersedes: null
track: "design"
feature: "interactive-page-patterns"
status: "implemented"
owner: "sdcorejs-design"
commit_policy: "with-change"
source_spec: ".sdcorejs/specs/angular/2026-09-14-interactive-page-patterns.md"
source_plan: ".sdcorejs/plans/angular/2026-09-14-interactive-page-patterns.md"
editable_source_status: "available"
updatedAt: "2026-09-14T03:34:25.816Z"
---
# Design ledger — Module Patterns

Người dùng đã duyệt tiếp bước thực hiện qua yêu cầu “Implement giúp mình sau đó đẩy lên toàn bộ để mình check tiếp trên máy khác”. Spec/plan Angular lưu snapshot phạm vi 36 biến thể + 4 compositions từ thiết kế đã trình bày.

## Kết quả

- Sáu nhóm Header, Table, Score card, Button & câu chữ, Form trên page, Side drawer; nhóm thứ bảy ghép listing/cards/queue/overview.
- Score card có 9 mẫu, gồm icon-inline, icon-tile, icon-status, icon-filter.
- Angular chạy tại `/patterns`, source thật nằm ở `src/modules/patterns/`; mỗi nhóm hiển thị TS/HTML/SCSS và các dependency nội bộ từ manifest.
- Hướng dẫn sử dụng: `docs/patterns.md`; kiến trúc: `.sdcorejs/docs/architecture/2026-09-14-interactive-page-patterns.md`; kết quả kiểm tra Angular: `.sdcorejs/docs/angular/2026-09-14-interactive-page-patterns.md`.
- HTML/PNG dưới đây là thiết kế tham chiếu (generated-mockup), không phải bằng chứng build hoặc screenshot portal. Wireframe từng được kiểm tra ở 1440/768/390/320.
- Handoff validator đã kiểm tra parent spec/plan và hash: PASS. Handoff thiết kế không cấp quyền sửa production code; Angular implementation được thực hiện theo yêu cầu trực tiếp và plan Angular.

## Handoff và provenance

```json
{
  "component_mapping": [
    {
      "component": "SdTable",
      "evidence_refs": [
        {
          "path": "src/modules/pages/features/list-standard/list-standard.component.ts",
          "repository_id": "github.com/sdcorejs/portal-template",
          "revision": "532cef8090a44576e54eab88d7619c59817bf598"
        }
      ],
      "need": "Listing table",
      "status": "confirmed"
    },
    {
      "component": "ScorecardStripComponent",
      "evidence_refs": [],
      "need": "Interactive status filters",
      "status": "new"
    }
  ],
  "cross_repository_references": [],
  "design_system_reuse": {
    "evidence_refs": [
      {
        "path": "src/styles.scss",
        "repository_id": "github.com/sdcorejs/portal-template",
        "revision": "532cef8090a44576e54eab88d7619c59817bf598"
      },
      {
        "path": "src/styles/reference.scss",
        "repository_id": "github.com/sdcorejs/portal-template",
        "revision": "532cef8090a44576e54eab88d7619c59817bf598"
      }
    ],
    "inspected": true
  },
  "editable_source": {
    "artifact_hash": "sha256:v1:de200f8e6a85689b1f4251f8e61347b155b6c6d722174125eeea6c3caf47d359",
    "format": "html",
    "path": ".sdcorejs/design/wireframes/interactive-page-patterns/pattern-lab.html",
    "status": "available"
  },
  "metadata": {
    "approval_hash": null,
    "artifact_hash": "sha256:v1:43a23a91d2430f98785f8ad2a5346097bb79a3258a97aa0cdd9ca5adaf973a07",
    "artifact_id": "design-handoff:interactive-page-patterns",
    "artifact_kind": "design-handoff",
    "change_ref": "interactive-page-patterns",
    "contract_id": "interactive-page-patterns",
    "experience_scope": "portal-composition",
    "owner_module_id": null,
    "owner_repository_id": "github.com/sdcorejs/portal-template",
    "owner_repository_role": "portal",
    "ownership_scope": "portal-composition",
    "parent_references": [
      {
        "approval_hash": "sha256:v1:9ddf1812cf140f8ea76a50240f8ac5422c662d361b3e064fc5c39304d6663019",
        "artifact_id": "interactive-page-patterns-spec-r1",
        "artifact_kind": "spec",
        "repository_id": "github.com/sdcorejs/portal-template",
        "revision": "532cef8090a44576e54eab88d7619c59817bf598"
      },
      {
        "approval_hash": "sha256:v1:0d88ebdfb679ba683df1625b0eda6d3167c9221277e03eabb26d752d539c681e",
        "artifact_id": "interactive-page-patterns-plan-r1",
        "artifact_kind": "plan",
        "repository_id": "github.com/sdcorejs/portal-template",
        "revision": "532cef8090a44576e54eab88d7619c59817bf598"
      }
    ],
    "repository_relative_path": ".sdcorejs/design/specs/interactive-page-patterns.md",
    "requirement_id": "interactive-page-patterns",
    "schema_version": 1,
    "source_revision": "532cef8090a44576e54eab88d7619c59817bf598",
    "stack_profile": "design",
    "supersedes": null,
    "track": "design"
  },
  "product_screenshots": [],
  "production_code_paths": [],
  "responsive": {
    "desktop": true,
    "mobile": true,
    "notes": "36 variants including four icon scorecards checked at 1440/768/390/320. Icon filter Enter/Space/toggle and correct rows verified. SVG decorative and unfocusable.",
    "tablet": true
  },
  "static_exports": [
    {
      "classification": "generated-mockup",
      "path": ".sdcorejs/design/exports/png/interactive-page-patterns/pattern-lab.png",
      "sha256": "36ac9b9399f8816acd584171f1f088199a3a2a5bb309fe1279faf21551251017",
      "source_editable_artifact_hash": "sha256:v1:de200f8e6a85689b1f4251f8e61347b155b6c6d722174125eeea6c3caf47d359"
    },
    {
      "classification": "generated-mockup",
      "path": ".sdcorejs/design/exports/png/interactive-page-patterns/scorecard-icons.png",
      "sha256": "0f621c1dea0336d1361963b374417d6a4d6de86cd6eb3240e6f491e1a96e65a5",
      "source_editable_artifact_hash": "sha256:v1:de200f8e6a85689b1f4251f8e61347b155b6c6d722174125eeea6c3caf47d359"
    }
  ]
}
```

## Artifact context

```json
{
  "schema_version": 1,
  "change_ref": "interactive-page-patterns",
  "source_spec": ".sdcorejs/specs/angular/2026-09-14-interactive-page-patterns.md",
  "source_plan": ".sdcorejs/plans/angular/2026-09-14-interactive-page-patterns.md",
  "required_with_change": [
    {
      "path": ".sdcorejs/design/flows/interactive-page-patterns.md",
      "kind": "design-asset",
      "reason": "design flow written for this change"
    },
    {
      "path": ".sdcorejs/design/specs/interactive-page-patterns.md",
      "kind": "design-asset",
      "reason": "design spec written for this change"
    },
    {
      "path": ".sdcorejs/design/decisions/interactive-page-patterns.md",
      "kind": "design-asset",
      "reason": "design decisions written for this change"
    },
    {
      "path": ".sdcorejs/design/wireframes/interactive-page-patterns/pattern-lab.html",
      "kind": "design-asset",
      "reason": "editable wireframe source for this change"
    },
    {
      "path": ".sdcorejs/design/exports/png/interactive-page-patterns/pattern-lab.png",
      "kind": "design-asset",
      "reason": "durable generated export bound to the editable source hash"
    },
    {
      "path": ".sdcorejs/design/exports/png/interactive-page-patterns/scorecard-icons.png",
      "kind": "design-asset",
      "reason": "durable generated export bound to the editable source hash"
    },
    {
      "path": ".sdcorejs/docs/design/interactive-page-patterns.md",
      "kind": "design-handoff",
      "reason": "design traceability ledger written for this change"
    }
  ],
  "shared_owned": [],
  "conditional": [],
  "local_only": [
    {
      "path": ".sdcorejs/design/diagnostics/interactive-page-patterns/verify.cjs",
      "kind": "diagnostic",
      "reason": "generated design diagnostic outside an approved durable handoff"
    },
    {
      "path": ".sdcorejs/design/diagnostics/interactive-page-patterns/verify-library.cjs",
      "kind": "diagnostic",
      "reason": "generated design diagnostic outside an approved durable handoff"
    },
    {
      "path": ".sdcorejs/design/diagnostics/interactive-page-patterns/preview-server.cjs",
      "kind": "diagnostic",
      "reason": "generated design diagnostic outside an approved durable handoff"
    }
  ],
  "unrelated_observed": []
}
```
