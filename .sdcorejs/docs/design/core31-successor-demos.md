---
artifact_id: core31-successor-design-handoff
artifact_kind: design-handoff
change_ref: core31-successor-demos
source_spec: none
source_plan: none
commit_policy: with-change
owner: portal-integration
---

# Core 3.1 successor demo implementation

Authority: parent delegation explicitly approved Kanban, standalone Tree, OrgChart, ModalResizable, ImportExcel, ImageEditor and AutoIdInspector; fictional local fixtures, VI/EN, TDD, independent Sol review. User asked to continue until complete while asleep. This task uses that controlling scope; no formal workflow approval graph was supplied (NOT_RUN), and this document does not fabricate one.

Owner: portal-template isolated codex/core-3-1-demo-successor based on 02ee106772c3996eab47d550630f33343d9a9aa3 plus immutable 113-file accepted patch a44caa8c262a3bcc20847d4697c9691d2c897f16389c552e77edf88b8eb1fe51. Original, released, accepted candidate and existing dirty work preserved. Angular22.1.6 / declared Core22.3.0 / private installed exact touch-fix candidate22.2.15 sha faf0d45cbc4710cd94f8678ae4593b3d60247d0bc326ed276ce9fc34b9cd8d4c.

Screen map: /component/kanban (Harbor operational queue); /component/tree (standalone service catalogue, async roots/children, selection); /component/org-chart (fictional teams and detail handoff); /component/modal-resizable (two local project inspectors and compare); /component/import-excel (local asset workbook validation/accept); /component/image-editor (local fictional asset image edit/export); /component/autoid-inspector (scoped control audit and local export). Each reuses Core native component, existing SdPage shell and shared locale/reset chrome.

Frontend architecture completed: feature-local route components own seed and scenario state. Root owns routes/menu/catalog/coverage, shared DemoLabFrameComponent owns only VI/EN controls and reset event, shared SCSS owns existing surface/spacing/responsive tokens. Feature components compose real Core controls rather than reproducing primitives. No data-access service since all operations are fictional session-local fixtures. One root writer for shared files, Sol owns import/image/autoid feature folders and file E2E, independent Sol reviewer authors no source.

Interactions and states: small local async delays expose loading and cancellation; error fixtures with retry; empty and disabled/read-only controls; stable IDs; focusable native buttons; responsive wrapping and explicit native chart/board scroll region. Text derives from I18nService.language(), switching with reload:false. Native ModalResizable hardcoded Vietnamese titles and OrgChart English toggle labels cannot be localized through public API; disclose rather than patch DOM/library.

Visual direction: existing Portal Core surfaces/typography/tokens, compact lab cards, actionable local status, 2-column desktop with single-column mobile at <=800px. No new typography, marketing shell or design system. Fixture domain/names are implementation assumptions inferred from requested playground.

TDD and validation: 7 new happy-flow browser tests first prove missing demos against accepted identical baseline build, with successful sd-layout boot; then implement. Add meaningful scenario/cancel/reset/locale/mobile assertions. Final sequential artifact guard, generators, lint, ngc, unit, optimized app build, Storybook and complete old+new browser gates with one Chrome worker and two Angular workers. Screenshot review and immutable final-patch reconstruction/independent review are pending final gates; no publish/push/PR/upload or backend/auth change.

Coverage ledger separates source import presence, explicitly routed native demo and browser evidence. ModalResizable is interactive UI; ckeditor-styles is CSS helper. Editor/MiniEditor hold pending separate licensing decision; additional forms/services remain listed gaps.

Release note: This is a historical implementation record. Public release acceptance is recorded separately in [release guide](../../../docs/core31-release.md). Prior private-runtime results are not public-package verification.
