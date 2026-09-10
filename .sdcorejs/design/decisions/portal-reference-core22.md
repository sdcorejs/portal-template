# Settled design decisions

Spec: .sdcorejs/specs/angular/2026-09-10-11-27-portal-reference-core22.md
Architecture: .sdcorejs/architecture/angular/2026-09-10-11-34-portal-reference-core22.md
Plan: .sdcorejs/plans/angular/2026-09-10-portal-reference-core22.md
Owner: github.com/sdcorejs/portal-template
Core: @sdcorejs/angular 22.2.7 (installed types + exact docs inspected)

- Layout 1 approved: full-width preview and documentation tabs. No further layout-choice gate.
- Existing Core shell and tokens remain the design foundation; resize composition according to content.
- The synthetic eight-domain corpus demonstrates distinct information shapes rather than making every entity use all patterns.
- Child components own meaningful regions: facts, related rows, grouped form fields and order-line editing.
- Utilities handle spacing; custom SCSS is limited to responsive composition, reference frame and focus protection.
