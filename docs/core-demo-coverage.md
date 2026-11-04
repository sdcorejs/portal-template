# Core demo source inventory

Exact public dependency and installed Core: **22.3.4** (Angular 22). Registry integrity and producer source identity are in [release artifact](core31-release-artifact.json). Historical version-bound results are in [release validation](core31-release-validation.json); results from a different Core version are not carried forward.

AST import declarations in src/modules/**/*.component.ts matched to installed secondary exports; source presence is not a demonstrated workflow. Explicit successor registry binds seven routes to actual native component selectors and authored browser journeys; current execution/visual acceptance is reported separately, never inferred from imports. Snippets, stories and test imports are excluded. Helpers are classified separately.

43 component secondary exports; 38 have actual source imports. 7 explicitly registered interaction demos; 31 further imports have no seven-route-specific audit. Source imports, route presence and passing behavior are separate counts. ModalResizable is interactive UI; ckeditor-styles is a CSS helper.

| Entry | Inventory status | Use cases | Public desktop evidence | Public mobile evidence |
|---|---|---|---|---|
| components/anchor | source present | Jump to sections; section-linked anchors | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/api-contract-builder | source present | Edit/view/disabled; valid/invalid/empty; snapshot; canonical JSON export | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/audit-diff | source present | Before/after approval and schema history | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/autoid-inspector | interactive demo registered | Scoped local fixture audit, duplicate/missing IDs, highlight, local export; optional native panel | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/avatar | source present | Sizes, fallback, initials | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/badge | source present | Status tones and shapes | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/breadcrumb | source present | Manual trail, navigation, current-page semantics | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/button | source present | Tones, loading, error/retry, disabled, confirmation, keyboard | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/card | source present | Filter queue by status | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/ckeditor-styles | supporting entry | Stylesheet integration helper; no interactive screen | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/code-editor | source present | Read-only source and JSON; editable form schema | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/data-state | source present | Loading, empty, error/retry and success | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/editor | gap | Pending: rich content editing | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/editor-engine | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/file-explorer | source present | Folders, search, paging, preview; typed metadata, selection actions, native/API move, cancellation and retry | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/form-generic | source present | Builder to same schema to Render and validated submission; tabs/steps, model gates and conditional pages | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/highlight | source present | Search term highlighted in result names; plain text rendering | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/history | source present | Local actions and audit chronology | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/image-editor | interactive demo registered | Local PNG source, load failure/retry, native crop/rotate/history, local Blob preview/export | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/import-excel | interactive demo registered | Native local workbook chooser/parse, invalid/warning rows, corrected synchronous session acceptance | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/inform | source present | Workspace guidance; consumer form errors and warnings | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/job-progress | source present | Local upload progress | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/kanban | interactive demo registered | Native ordered board, search/menu/keyboard and confirmed local async moves, failure/reset/read-only | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/mini-editor | gap | Pending: inline rich text | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/modal | source present | Slots and view modes | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/modal-resizable | interactive demo registered | Interactive nonmodal docked component: compare two records, local note validation/save/retry, narrow single panel | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/operator | source present | Change quick-budget comparison and hand off to Query Builder | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/org-chart | interactive demo registered | Fictional project teams, native collapse/custom-node detail, loading/error/empty/disabled preview | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/preview | source present | Image/PDF and local document preview | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/query-bar | source present | Fields, modes and saved filters | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/query-builder | source present | AND/OR, nesting, fields, date, search, sort, selection, confirm/undo, empty/error/retry | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/quick-action | source present | Contained undo after local project pause | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/section | source present | Headers and section-item label; itemLeft including conditional empty projection | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/side-drawer | source present | Record details, preview and keyboard close | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/splitter | source present | Resizable panes | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/stepper | source present | Request steps and validation | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/tab | source present | Interactive tabs | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/tab-router | source present | Routed component demos | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/table | source present | Filter/sort, row actions, selection actions, desktop and mobile cards | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/tree | interactive demo registered | Standalone lazy catalogue, native keyboard expansion, loaded-descendant selection, root/child retry | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/upload-file | source present | Local validation, progress, removal and Explorer handoff | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/view | source present | Media/view composition | Not individually recorded on this public pin | Not individually recorded on this public pin |
| components/window | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/autocomplete | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/checkbox | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/chip | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/chip-calendar | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/date | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/date-range | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/datetime | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/directives | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/entity-picker | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/inline-text | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/input | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/input-color | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/input-number | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/label | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/models | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/radio | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/segmented | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/select | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/switch | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/textarea | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/time | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/time-range | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| forms/tree-select | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/api | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/cache | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/confirm | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/date-time | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/excel | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/loading | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/notify | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/persistence | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/storage | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/task | gap | Pending functional demo | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/unsaved-changes | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |
| services/viewport | source present | Existing form/service demo; source links below | Not individually recorded on this public pin | Not individually recorded on this public pin |

Exact source paths are in [core-demo-coverage.json](core-demo-coverage.json). A missing per-entry record does not imply a broken legacy demo.

## Interactive workflows

Kanban, Tree, OrgChart, ModalResizable, ImportExcel, ImageEditor and AutoIdInspector are bound to native selectors and browser journeys in [demo registry](core31-successor-demo-registry.json). Explorer metadata/move, Form Builder to Render navigation/schema handoff, Contract/Query/Outline and the linked workspace remain part of the full consumer suite. See [release guide](core31-release.md).

Editor and MiniEditor remain on hold for a separate licensing decision. Additional forms/services remain visible gaps; no paid license or remote integration is assumed.
