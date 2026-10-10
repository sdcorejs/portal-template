import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const library = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/@sdcorejs/angular/package.json'), 'utf8'));
const declaredVersion = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).dependencies['@sdcorejs/angular'];
const artifactPath = path.join(root, 'docs/core31-release-artifact.json');
const artifact = fs.existsSync(artifactPath) ? JSON.parse(fs.readFileSync(artifactPath, 'utf8')) : null;
const isPublicRelease = artifact?.version === library.version && artifact?.published === true;
if (!isPublicRelease || library.version !== declaredVersion) throw new Error('Coverage requires the confirmed clean-installed public pin');
const entries = Object.keys(library.exports).filter(key => /^\.\/(components|forms|services)\//.test(key));
const sources = new Map(entries.map(key => [key, []]));
const symbols = new Map();
for (const key of entries) {
  const text = fs.readFileSync(path.join(root, 'node_modules/@sdcorejs/angular', library.exports[key].types), 'utf8');
  const file = ts.createSourceFile(key, text, ts.ScriptTarget.Latest);
  const names = [];
  for (const node of file.statements) {
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      names.push(...node.exportClause.elements.map(item => item.name.text));
    }
  }
  symbols.set(key, new Set(names));
}
function walk(folder) {
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    const absolute = path.join(folder, item.name);
    if (item.isDirectory()) walk(absolute);
    else if (item.name.endsWith('.component.ts')) {
      const relative = path.relative(root, absolute).replaceAll('\\', '/');
      const file = ts.createSourceFile(relative, fs.readFileSync(absolute, 'utf8'), ts.ScriptTarget.Latest);
      for (const node of file.statements) {
        if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier) || node.importClause?.isTypeOnly) continue;
        const specifier = node.moduleSpecifier.text.replace('@sdcorejs/angular', '.');
        const named = node.importClause?.namedBindings;
        const imported =
          named && ts.isNamedImports(named)
            ? named.elements.filter(item => !item.isTypeOnly).map(item => (item.propertyName ?? item.name).text)
            : [];
        for (const key of entries) {
          if (
            (specifier === key || specifier === key.split('/').slice(0, 2).join('/')) &&
            imported.some(name => symbols.get(key).has(name))
          )
            sources.get(key).push(relative);
        }
      }
    }
  }
}
walk(path.join(root, 'src/modules'));

const useCases = {
  kanban: 'Native ordered board, search/menu/keyboard and confirmed local async moves, failure/reset/read-only',
  anchor: 'Jump to sections; section-linked anchors',
  'api-contract-builder': 'Edit/view/disabled; valid/invalid/empty; snapshot; canonical JSON export',
  'audit-diff': 'Before/after approval and schema history',
  'autoid-inspector': 'Scoped local fixture audit, duplicate/missing IDs, highlight, local export; optional native panel',
  avatar: 'Sizes, fallback, initials',
  badge: 'Status tones and shapes',
  breadcrumb: 'Manual trail, navigation, current-page semantics',
  button: 'Tones, loading, error/retry, disabled, confirmation, keyboard',
  card: 'Filter queue by status',
  'ckeditor-styles': 'Stylesheet integration helper; no interactive screen',
  'code-editor': 'Read-only source and JSON; editable form schema',
  'data-state': 'Loading, empty, error/retry and success',
  editor: 'Pending: rich content editing',
  'file-explorer': 'Folders, search, paging, preview; typed metadata, selection actions, native/API move, cancellation and retry',
  'form-generic': 'Builder to same schema to Render and validated submission; tabs/steps, model gates and conditional pages',
  highlight: 'Search term highlighted in result names; plain text rendering',
  history: 'Local actions and audit chronology',
  'image-editor': 'Local PNG source, load failure/retry, native crop/rotate/history, local Blob preview/export',
  'import-excel': 'Native local workbook chooser/parse, invalid/warning rows, corrected synchronous session acceptance',
  inform: 'Workspace guidance; consumer form errors and warnings',
  'job-progress': 'Local upload progress',
  'mini-editor': 'Pending: inline rich text',
  modal: 'Slots and view modes',
  'modal-resizable': 'Interactive nonmodal docked component: compare two records, local note validation/save/retry, narrow single panel',
  operator: 'Change quick-budget comparison and hand off to Query Builder',
  'org-chart': 'Fictional project teams, native collapse/custom-node detail, loading/error/empty/disabled preview',
  preview: 'Image/PDF and local document preview',
  'query-bar': 'Fields, modes and saved filters',
  'query-builder': 'AND/OR, nesting, fields, date, search, sort, selection, confirm/undo, empty/error/retry',
  'quick-action': 'Contained undo after local project pause',
  section: 'Headers and section-item label; itemLeft including conditional empty projection',
  'side-drawer': 'Record details, preview and keyboard close',
  splitter: 'Resizable panes',
  stepper: 'Request steps and validation',
  tab: 'Interactive tabs',
  'tab-router': 'Routed component demos',
  table: 'Filter/sort, row actions, selection actions, desktop and mobile cards',
  tree: 'Standalone lazy catalogue, native keyboard expansion, loaded-descendant selection, root/child retry',
  'upload-file': 'Local validation, progress, removal and Explorer handoff',
  view: 'Media/view composition',
};
const validationPath = path.join(root, 'docs/core31-release-validation.json');
const currentQa = fs.existsSync(validationPath) ? JSON.parse(fs.readFileSync(validationPath, 'utf8')) : {};
const registry = JSON.parse(fs.readFileSync('docs/core31-successor-demo-registry.json', 'utf8'));
const newEntries = new Set(['api-contract-builder', 'breadcrumb', 'highlight', 'operator', 'query-builder', 'quick-action']);
const rows = entries.map(key => {
  const [group, name] = key.slice(2).split('/');
  const helper = ['ckeditor-styles', 'directives', 'models', 'label'].includes(name);
  const files = [...new Set(sources.get(key))].sort();
  const demo = registry.demos.find(demo => demo.entry === key.slice(2));
  if (demo && (!files.includes(demo.source) || !fs.existsSync(demo.test))) throw new Error('Invalid interactive demo registry: ' + key);
  const qa = currentQa.coverage?.[key] ?? {
    desktop: 'Not individually recorded on this public pin',
    mobile: 'Not individually recorded on this public pin',
  };
  return {
    entry: key.slice(2),
    kind: helper ? 'helper' : group === 'components' || group === 'forms' ? 'UI group' : 'service',
    interactiveDemo: demo
      ? {
          route: demo.route,
          nativeSelector: demo.nativeSelector,
          source: demo.source,
          browserEvidence: demo.test,
          status: 'registered; public execution evidence in release validation report',
        }
      : null,
    demoStatus: demo ? 'interactive demo registered' : files.length ? 'source present' : helper ? 'supporting entry' : 'gap',
    batch: newEntries.has(name) ? 1 : files.length || helper ? 'existing' : ['tree', 'org-chart'].includes(name) ? 2 : 3,
    useCases: useCases[name] ?? (files.length ? 'Existing form/service demo; source links below' : 'Pending functional demo'),
    desktop: qa.desktop,
    mobile: qa.mobile,
    sources: files,
  };
});
const componentRows = rows.filter(row => row.entry.startsWith('components/'));
const output = {
  libraryVersion: library.version,
  declaredDependencyVersion: declaredVersion,
  installedArtifact: { version: artifact.version, integrity: artifact.integrity, sourceCommit: artifact.sourceCommit, published: true },
  angularMajor: 22,
  releasePortalBase: '8e238b1d8fddf7f9ec67586721e770d124e132f8',
  method:
    'AST import declarations in src/modules/**/*.component.ts matched to installed secondary exports; source presence is not a demonstrated workflow. Explicit successor registry binds seven routes to actual native component selectors and authored browser journeys; current execution/visual acceptance is reported separately, never inferred from imports. Snippets, stories and test imports are excluded. Helpers are classified separately.',
  components: {
    exportedEntries: componentRows.length,
    sourcePresent: componentRows.filter(row => row.sources.length > 0).length,
    registeredInteractiveDemos: componentRows.filter(row => row.interactiveDemo).length,
    sourceWithoutSuccessorDemoAudit: componentRows.filter(row => row.sources.length && !row.interactiveDemo).length,
    missingUiGroups: componentRows.filter(row => row.demoStatus === 'gap').map(row => row.entry),
  },
  rows,
};
const markdown = `# Core demo source inventory

Exact public dependency and installed Core: **${library.version}** (Angular 22). Registry integrity and producer source identity are in [release artifact](core31-release-artifact.json). Current execution results are reported separately in [release validation](core31-release-validation.json).

${output.method}

${output.components.exportedEntries} component secondary exports; ${output.components.sourcePresent} have actual source imports. ${output.components.registeredInteractiveDemos} explicitly registered interaction demos; ${output.components.sourceWithoutSuccessorDemoAudit} further imports have no seven-route-specific audit. Source imports, route presence and passing behavior are separate counts. ModalResizable is interactive UI; ckeditor-styles is a CSS helper.

| Entry | Inventory status | Use cases | Public desktop evidence | Public mobile evidence |
|---|---|---|---|---|
${rows.map(row => `| ${row.entry} | ${row.demoStatus} | ${row.useCases} | ${row.desktop} | ${row.mobile} |`).join('\n')}

Exact source paths are in [core-demo-coverage.json](core-demo-coverage.json). A missing per-entry record does not imply a broken legacy demo.

## Interactive workflows

Kanban, Tree, OrgChart, ModalResizable, ImportExcel, ImageEditor and AutoIdInspector are bound to native selectors and browser journeys in [demo registry](core31-successor-demo-registry.json). Explorer metadata/move, Form Builder to Render navigation/schema handoff, Contract/Query/Outline and the linked workspace remain part of the full consumer suite. See [release guide](core31-release.md).

Editor and MiniEditor remain on hold for a separate licensing decision. Additional forms/services remain visible gaps; no paid license or remote integration is assumed.
`;
const artifacts = [
  ['docs/core-demo-coverage.json', JSON.stringify(output, null, 2) + '\n'],
  ['docs/core-demo-coverage.md', markdown],
];
for (const [file, text] of artifacts) {
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') !== text)
      throw new Error('Coverage artifact out of date: ' + file);
  } else fs.writeFileSync(file, text);
}
console.log(JSON.stringify(output.components));
