# Reference flows

Spec: .sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md
Architecture: .sdcorejs/architecture/angular/2026-09-10-11-34-portal-reference-core22.md
Plan: .sdcorejs/plans/angular/2026-09-10-portal-reference-core22.md
Owner: github.com/sdcorejs/portal-template
Core: @sdcorejs/angular 22.2.7 (installed types + exact docs inspected)

1. Pages → choose named pattern → Preview → manipulate realistic seed.
2. Preview → Guide/Data/Source → Preview retains the same component and draft.
3. List → select record → detail → edit → validate/save → updated detail/list, query retained.
4. Create → invalid submit → errors → correct → save; failed save retains draft for retry.
5. Dirty form/drawer → leave → Save / Discard / Keep editing; save failure blocks leaving.
6. Change pattern or reset → resolve dirty changes → fresh deterministic session.
7. Source and public catalog provide the same stable pattern IDs, Core version and dependencies.
