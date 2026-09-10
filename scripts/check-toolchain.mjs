import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const [major, minor, patch] = process.versions.node.split('.').map(Number);
assert.ok(
  (major === 22 && (minor > 22 || (minor === 22 && patch >= 3))) || (major === 24 && minor >= 15) || major === 26,
  'Use Node ^22.22.3, ^24.15.0 or ^26.0.0'
);
assert.equal(require('@sdcorejs/angular/package.json').version, '22.2.7');
assert.equal(require('@angular/core/package.json').version.split('.')[0], '22');
console.log('Core 22.2.7 and Angular 22 on supported Node ' + process.versions.node);
