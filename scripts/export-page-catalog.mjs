import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
export async function loadCatalog() {
  const source = readFileSync('src/libs/pages/catalog/pattern-registry.ts', 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
  const { PAGE_PATTERNS } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
  return { schemaVersion: 1, coreVersion: '22.2.7', patterns: structuredClone(PAGE_PATTERNS) };
}
export function validateCatalog(catalog) {
  if (catalog.schemaVersion !== 1 || catalog.coreVersion !== '22.2.7' || catalog.patterns.length !== 12)
    throw new Error('Catalog version/count mismatch');
  const ids = new Set();
  for (const p of catalog.patterns) {
    if (ids.has(p.id)) throw new Error('Duplicate pattern ' + p.id);
    ids.add(p.id);
    if (
      p.recordRoutes?.create !== p.route + '/create' ||
      p.recordRoutes?.detail !== p.route + '/:id/detail' ||
      p.recordRoutes?.update !== p.route + '/:id/update'
    )
      throw new Error('Record URL contract mismatch');
    if (p.route !== '/pages/' + (p.id.startsWith('list-') ? 'list/' : 'detail/') + p.id || p.coreVersion !== catalog.coreVersion)
      throw new Error('Pattern identity mismatch');
    for (const path of [...p.sourceFiles, p.dataContract, p.fixtures]) {
      if (path.includes('..') || !path.startsWith('src/libs/pages/') || !existsSync(path)) throw new Error('Invalid source ' + path);
    }
    if (!p.suitableWhen || !p.avoidWhen || !p.requiredFields.length) throw new Error('Missing selection guidance');
  }
  return true;
}
export async function renderArtifacts() {
  const catalog = await loadCatalog();
  validateCatalog(catalog);
  const sources = { schemaVersion: 1, coreVersion: catalog.coreVersion, files: {} };
  function collect(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = dir + '/' + entry.name;
      if (entry.isDirectory()) collect(path);
      else if (/\.(ts|html|scss)$/.test(path) && !path.endsWith('.spec.ts') && !path.endsWith('.stories.ts'))
        sources.files[path] = readFileSync(path, 'utf8');
    }
  }
  collect('src/libs/pages');
  sources.files['src/styles/reference.scss'] = readFileSync('src/styles/reference.scss', 'utf8');
  const markdown =
    '# Page patterns — Core 22.2.7\n\nGenerated from the pattern registry. Demo data is synthetic and scoped to one mounted reference; replace the service boundary for production.\n\n' +
    catalog.patterns
      .map(
        p =>
          '## ' +
          p.name +
          ' — ' +
          p.id +
          '\n\n' +
          p.purpose +
          '\n\n- Phù hợp: ' +
          p.suitableWhen +
          '\n- Không phù hợp: ' +
          p.avoidWhen +
          '\n- Shape: ' +
          p.dataShape +
          '; container: ' +
          p.container +
          '\n- Route: ' +
          p.route +
          '\n- Create: ' +
          p.recordRoutes.create +
          '\n- Detail: ' +
          p.recordRoutes.detail +
          '\n- Update: ' +
          p.recordRoutes.update +
          '\n- Source: ' +
          p.sourceFiles.join(', ') +
          '\n- Fields: ' +
          p.requiredFields.join(', ') +
          '\n'
      )
      .join('\n');
  return {
    'public/catalog/page-patterns.v1.json': JSON.stringify(catalog, null, 2) + '\n',
    'public/catalog/page-pattern-sources.v1.json': JSON.stringify(sources, null, 2) + '\n',
    'docs/page-patterns.md': markdown,
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  for (const [path, content] of Object.entries(await renderArtifacts())) {
    if (process.argv.includes('--check')) {
      if (!existsSync(path) || readFileSync(path, 'utf8') !== content) throw new Error('Stale generated artifact: ' + path);
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
  }
  console.log('Catalog: 12 patterns; source and guide consistent.');
}
