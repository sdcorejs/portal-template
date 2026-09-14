---
status: completed
feature: interactive-page-patterns
change_ref: interactive-page-patterns
owner: sdcorejs-angular
commit_policy: with-change
---
# Frontend architecture

Module Patterns belongs to portal-template; same shell/Core UI, no Core repository changes. Refines the component map reviewed in the design.

- Route host: group/variant and preview/guide/source; instantiates one feature demo per selection. Changing a dirty draft requires discard confirmation.
- Catalog: metadata only; source exporter copies actual TS/HTML/SCSS. No iframe or innerHTML demo execution.
- Six feature components plus composition component. Shared scorecards and query bar have inputs/outputs; query/store owned by page scope.
- Pure query function handles normalized status/search/region/sort before pagination. Metrics derive from entire dataset.
- Feature-local mock store owns 24 synthetic orders and session changes. No backend.
- Form editor owns reactive controls/line array and saving/errors; input mode/layout/initial, output saved/cancel. Reused by forms/drawers. Facts read-only.
- Drawer host owns open/mode/selected record; Core SdSideDrawer beforeClose checks editor dirty/saving; focus returns to opener.
- Table uses SdTable; sorted/filtered source changes reset paging/selection. Tree and line-item variants separate from data query.
- Compositions use scorecards/query/result presentation, meaningful layout boundaries, no API duplication.
- Invariants: one query owner; no invalid/duplicate save; errors preserve draft; all IDs stable; source paths exist; table scroll isolated; icon decorative.
- Validation: query tests, source catalog check, build, scoped lint, browser tests for all groups and responsive sizes.
