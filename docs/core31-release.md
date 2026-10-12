# Core UI playground release

Public dependency: `@sdcorejs/angular@22.3.1`, producer source `629ab5ff475c307b8d19a393a6fdc967139ed3a2` / tag `v3.1`. Registry bytes, SRI, seven fonts and clean-installed package/peers are verified in [release artifact](core31-release-artifact.json). Local public consumer acceptance passed all 18 gates: 57 unit cases, four generator cases, 231 Portal browser cases, all 62 stories through two browser cases and three Pages viewport journeys. Sol independently reviewed the runtime and actual captures. [Validation](core31-release-validation.json) binds these local results to the runtime fingerprint. PR/current-SHA CI and online deployed-SHA acceptance are separate release steps. Previous candidate results remain local historical evidence.

All fixtures are fictional. Actions and uploaded files stay in the browser session; Reset restores the example. The app keeps Angular 22 and the existing Portal shell, tokens and navigation.

## Explore the linked screens

| Menu / route | Meaningful flow |
|---|---|
| Utility → Workspace hồ sơ / `/utility/workspace` | Filter and select Table records; upload/preview files; edit a Form Builder schema, apply that same schema to Form Render, submit and review local history. |
| Component → File Explorer / `/component/file-explorer` | Typed metadata, custom columns, selection commands and native/API move through one local pipeline, confirmation, cancellation and retry. The previous `/utility/explorer-candidate` link redirects here. |
| Utility → Form Navigation / `/utility/form-navigation` | Builder schema handoff to Render, tabs/steps, validation and conditional page/model membership. |
| Component → API Contract Builder | Edit/validate a contract, retain a snapshot and export canonical JSON. No API request or secret value is required. |
| Component → Query Builder | AND/OR, nested conditions, dates and field comparison; search/sort/select Table results, confirm actions and undo. |
| Component → Button / `/component/button` | Basic properties plus Outline & Confirm examples: loading, error/retry, disabled buttons and required confirmation reason. The previous `/component/button/outline` link redirects here. ConfirmService examples remain under Service. |
| `/component/kanban` | Search and inspect the operational queue; move with native keyboard/menu or local confirmed async action, fail/retry and reset. |
| `/component/tree` | Lazy root/child loading, native keyboard expansion, loaded-descendant selection and retry. |
| `/component/org-chart` | Collapse fictional teams and open node details; loading/error/empty/disabled scenarios. |
| `/component/modal-resizable` | Compare two record panels, validate and save local notes; one panel on narrow screens. Width changes remount; height changes retain draft/save state. |
| `/component/import-excel` | Parse a local workbook with two header rows, review errors/warnings and accept corrected assets into the session. |
| `/component/image-editor` | Load/retry a fictional image, crop/rotate, undo/redo and export an actual PNG Blob. |
| `/component/autoid-inspector` | Audit duplicate/missing IDs inside the sample fixture, highlight and export local metadata. |

Against the same public export inventory, component source presence grows from 25 to 38 of 41 exports; seven new native workflows have explicit route/journey bindings. This is a source count, not 38 independently audited interactions. Forms remain 15 of 23 source groups; services grow from five to six of 11 with local Excel parsing. Editor/MiniEditor and the remaining form/service gaps stay visible in the coverage matrix.

The seven new component routes share VI/EN and Reset controls. Existing page patterns, Instructions and Role examples remain included in the complete regression suite.

## Reproduce verification

Use Node 24.19.0 and Chrome. Run heavy checks sequentially, with `NG_BUILD_MAX_WORKERS=2` and one browser worker.

```sh
npm ci
npm run check:core-release
npm run check:toolchain
npm run test:catalog
npm run test:pattern
npm run check:catalog
npm run check:pattern
npm run check:core-coverage
npm run lint
npx ngc -p tsconfig.app.json --noEmit
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
npm run build-storybook
npm run test:e2e:release
npm run test:e2e:release-storybook
npm run build -- --base-href=/portal-template/
```

Copy `dist/browser/index.html` to `dist/browser/404.html` using the native shell, then run `npm run test:e2e:release-pages`. The Pages checks verify the exact revision/public integrity, deep links, lazy assets/fonts and native interactions on desktop, 390px and 320px. Pages diagnostics and screenshots stay under ignored `test-results/`. Retained compatibility suites also generate local font/diagnostic files under ignored `docs/core31-*` paths; run with `CORE31_ARTIFACT_REVISION=public-release` and `CORE31_COMPAT_CAPTURE=none` to keep those separate from historical captures.

On a base-prefixed cold deep link, the Portal replays one navigation through the public Router after the shell renders. This synchronizes the V1 menu path while preserving query, fragment and browser history; it changes no library bytes, global routing policy or permission configuration. Pages checks assert the correct category, desktop active leaf, native menu navigation, reload and Back. Mobile Form captures scroll the native Render input into the viewport.

For online acceptance, set `PORTAL_RELEASE_URL=https://sdcorejs.github.io/portal-template/` and `PORTAL_EXPECTED_COMMIT` to the deployed remote SHA, then run the same Pages command. `release.json` is generated for each build; it is not a committed, manually copied deployment claim.

GitHub PR verification runs these gates. Existing GitHub Pages deployment remains on `main`, using the repo's `dev` build configuration and `/portal-template/` base path. No unrelated Firebase deployment or auth/protection change is part of this release.

## Known limits

Editor and MiniEditor remain pending a separate licensing decision; this release adds no new license or activation flow. Source coverage lists the remaining form/service gaps and distinguishes imports, explicit workflows and current execution evidence.

Some native ModalResizable titles are Vietnamese and OrgChart toggle labels are English because the public API has no locale override. Automated viewport resize covers panel geometry, not a native mobile IME. Form/Explorer demo routes and test identifiers retain their original names for compatibility. Fixtures do not provide production persistence, backend validation or permission enforcement.

Existing unused-import, CommonJS and demo budget warnings must be reported; budgets must not be increased to hide them. Historical design records describe implementation authority and prior private-runtime work; formal convergence remains NOT_RUN unless an actual approved artifact graph is supplied.
