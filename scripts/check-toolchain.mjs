import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const [major, minor, patch] = process.versions.node.split('.').map(Number);
assert.ok(
  (major === 22 && (minor > 22 || (minor === 22 && patch >= 3))) || (major === 24 && minor >= 15) || major === 26,
  'Use Node ^22.22.3, ^24.15.0 or ^26.0.0'
);
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const coreVersion = manifest.dependencies['@sdcorejs/angular'];
assert.match(coreVersion, /^22\.3\.\d+$/);
assert.equal(require('@sdcorejs/angular/package.json').version, coreVersion);
// utils 1.2.5 exports public entry points without exposing package.json.
assert.equal(JSON.parse(readFileSync(new URL('../node_modules/@sdcorejs/utils/package.json', import.meta.url), 'utf8')).version, '1.2.5');
assert.equal(require('@angular/core/package.json').version.split('.')[0], '22');
console.log('Core UI ' + coreVersion + ', utils 1.2.5 and Angular 22 on supported Node ' + process.versions.node);
