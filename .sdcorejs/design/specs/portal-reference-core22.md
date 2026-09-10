# Portal reference — design handoff

Spec: .sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md
Architecture: .sdcorejs/architecture/angular/2026-09-10-11-34-portal-reference-core22.md
Plan: .sdcorejs/plans/angular/2026-09-10-portal-reference-core22.md
Owner: github.com/sdcorejs/portal-template
Core: @sdcorejs/angular 22.2.7 (installed types + exact docs inspected)

## Direction
An operational reference library for developers and AI consumers. The page example gets the available width; Preview / Guide / Data / Source sit in tabs. Pattern selection is separate from operations in the example. No ornamental dashboard metrics.

Use the existing SdLayout navigation, Roboto and Material icons shipped by Core. Sales-platform informed identifier/status hierarchy, contextual drawers and section grouping; no source/data/brand colors copied.

## Token map
| Source | Role |
| --- | --- |
| Core assets/scss/sd-core.scss | utilities, fonts, reset and Material theme |
| --sd-surface / --sd-surface-muted | page and inset surfaces |
| --sd-text / --sd-text-secondary | primary and supporting text |
| --sd-primary / --sd-border | actions, focus and separators |
| T20M / T16M / T14R / T12R | page title, section, content and supporting copy |
| p-16 / p-24 / gap-8 / gap-16 / rounded-8 | consistent 4px rhythm |

## Composition and behavior
- List: SdPage header, one primary action, search/status/region, SdTable with identifiers on the left and numbers right. Stable rowKey. Table owns pagination/sort. A contextual detail preserves the mounted list.
- Overview: code/name/status promoted, SdView compact facts, long description across the section. Avoid repeating promoted identifiers in facts.
- Tabbed detail: profile / related data; preserve active tab until leaving that example.
- Forms: typed FormGroup; category is short; partner has meaningful groups; order has FormArray lines saved with the parent. Identifier create-only. Summary errors and recoverable failed saves.
- Drawers: SdSideDrawer supplies dialog semantics, focus trap and restoration. beforeClose checks dirty state; save / discard / keep editing are explicit choices. Footer stays available; duplicate submissions disabled.
- Each pattern starts an isolated deterministic demo session. No backend, auth or root singleton CRUD.

## Responsive and states
At wide desktop, 2-column facts/forms and master/detail 3:2. Below 900px, collapse to one column. At 390px, filters stack, drawer fits viewport and table scroll stays inside its region. Do not shrink labels or inputs to fit.
Preview supports data/loading/empty/no-results/error with recovery; error status uses an alert. Forms keep values on save failure. All controls retain visible labels, keyboard access and focus indicators.

## Self-critique
Distinguish the reference controls from the nested business example by borders and spacing. Avoid nesting decorative cards. A long title wraps; table text can use Core tooltips. Manual browser checks must confirm 1440/1024/390 widths, keyboard focus and drawer close behavior. Wireframes describe hierarchy only; real Core rendering is the final UI evidence.
