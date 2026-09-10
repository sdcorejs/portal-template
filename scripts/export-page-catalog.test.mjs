import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, validateCatalog, renderArtifacts } from './export-page-catalog.mjs';
test('CASE-EXPORT: complete, serializable catalog and exact source artifacts', async () => {
  const c = await loadCatalog();
  assert.equal(validateCatalog(c), true);
  assert.equal(JSON.parse(JSON.stringify(c)).patterns.length, 12);
  const artifacts = await renderArtifacts();
  assert.ok(artifacts['docs/page-patterns.md'].includes('list-master-detail'));
  assert.ok(JSON.parse(artifacts['public/catalog/page-pattern-sources.v1.json']).files['src/libs/pages/data/models.ts']);
});
test('CASE-EXPORT: rejects duplicate identities and escaped source paths', async () => {
  const c = await loadCatalog();
  c.patterns[1].id = c.patterns[0].id;
  assert.throws(() => validateCatalog(c), /Duplicate/);
  const d = await loadCatalog();
  d.patterns[0].sourceFiles = ['../secret'];
  assert.throws(() => validateCatalog(d), /Invalid source/);
});
