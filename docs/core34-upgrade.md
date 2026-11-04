# Core 22.3.4, deployment images and round badges

Portal now pins `@sdcorejs/angular@22.3.4` and `@sdcorejs/utils@1.3.1` (the utils version required by Core). Angular remains 22.1.6. The public npm tarball matches its SRI and every clean-installed package file. npm provenance binds its SHA-512 digest to source `db7f86079ec737f8f48f54daf9779fdc231a861a`, tag `v3.4`, and the publisher run recorded in [the artifact](core31-release-artifact.json).

Instructions diagrams used `/assets/...`, which bypassed the `/portal-template/` base href on GitHub Pages. Diagrams, zoomed copies, five reference screenshots and the sample accessibility snippet now use `assets/...`, letting the document base resolve the asset on both root and subpath deployments. The screenshots remain labeled with their original capture version.

Badge playground types come from Core's public `SD_BADGE_TYPE_OPTIONS`: icon, round, tag, solid, dot and pair. Pair exposes its label; dot/icon expose pulse. Generated example code follows those controls. Page and Pattern status badges use round consistently, including table cells, drawers, permission trees and collection/score examples. Published pattern source snapshots and catalog capabilities match the runtime examples.

The Core upgrade also widens the ChipCalendar demo model to `SdChipCalendarValue[]` and narrows the field union in the Workspace snapshot test. Instructions use the accessible heading now supplied by Core's SdPage, avoiding duplicate level-one headings. Explorer tests use the new per-file accessible Move name; Builder reordering opens the page action menu; operator tests select menuitemradio options by their label; tab metadata is checked with two tabs because Core hides the single-tab bar. The coverage generator no longer carries passing results from a different Core version into the current inventory.

## Validation

Local validation on a clean install:

- Public Core bytes/SRI, all 566 installed files, source identity and peer compatibility: pass.
- Toolchain, Angular template type checking, ESLint, catalog/pattern/coverage consistency: pass.
- Generator tests: 4 pass; Angular unit tests: 57 pass.
- Pages build under `/portal-template/`: pass.
- Deployment regression: all 17 lesson diagrams, their zoom views, five screenshots and links, all six Badge types with pair/pulse controls, and six page listing/drawer badge variants: pass.
- Existing Pages journeys at 1440, 390 and 320 pixels: pass.
- Badge regression stability: 10 consecutive runs pass after waiting for the old dropdown panel to leave the DOM before reopening it.

The Storybook build and rendering of all 62 stories pass locally. The full Portal suite and Storybook rendering remain CI gates before merge. Deployment is confirmed from the exact merged commit and its Pages workflow, separately from local checks.
