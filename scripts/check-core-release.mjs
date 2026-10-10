import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = process.cwd();
const readJson = file => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
const artifact = readJson('docs/core31-release-artifact.json');
const manifest = readJson('package.json');
const lock = readJson('package-lock.json');
const locked = lock.packages['node_modules/@sdcorejs/angular'];
const installed = readJson('node_modules/@sdcorejs/angular/package.json');
const { satisfies } = createRequire(import.meta.url)('semver');

assert.equal(artifact.name, '@sdcorejs/angular');
assert.equal(artifact.published, true, 'Release requires a verified public package');
assert.match(artifact.version, /^22\.3\.\d+$/);
assert.match(artifact.integrity, /^sha512-[A-Za-z0-9+/]+={0,2}$/);
assert.match(artifact.sourceCommit, /^[a-f0-9]{40}$/);
assert.equal(manifest.dependencies[artifact.name], artifact.version, 'Exact manifest pin');
assert.equal(lock.packages[''].dependencies[artifact.name], artifact.version, 'Exact root lock pin');
assert.equal(locked.version, artifact.version, 'Locked public version');
assert.equal(locked.resolved, artifact.tarball, 'Locked public registry tarball');
assert.ok(new URL(locked.resolved).hostname === 'registry.npmjs.org', 'Use the public npm registry');
assert.equal(locked.integrity, artifact.integrity, 'Registry integrity');
assert.equal(installed.name, artifact.name);
assert.equal(installed.version, artifact.version, 'Clean-installed public version');
assert.equal(readJson('node_modules/@angular/core/package.json').version.split('.')[0], '22');

const peers = {};
for (const [name, range] of Object.entries(installed.peerDependencies ?? {})) {
  const version = readJson('node_modules/' + name + '/package.json').version;
  assert.ok(satisfies(version, range), `${name}@${version} must satisfy ${range}`);
  peers[name] = { installed: version, range };
}
const packageRoot = path.join(root, 'node_modules/@sdcorejs/angular');
const files = [];
function walk(folder, prefix = '') {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    // npm may place dependency installations here; they are not publisher tarball files.
    if (prefix === '' && entry.name === 'node_modules') continue;
    const relative = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) walk(path.join(folder, entry.name), relative);
    else files.push(relative);
  }
}
walk(packageRoot);
const fingerprint = createHash('sha256');
for (const file of files.sort())
  fingerprint.update(
    file +
      '\0' +
      createHash('sha256')
        .update(readFileSync(path.join(packageRoot, file)))
        .digest('hex') +
      '\n'
  );
assert.equal(files.length, artifact.packedFiles, 'Installed public file count');
assert.equal(fingerprint.digest('hex'), artifact.installedPackageFingerprint, 'Installed public package bytes');
console.log(
  JSON.stringify({
    verified: true,
    publicVersion: installed.version,
    integrity: locked.integrity,
    sourceCommit: artifact.sourceCommit,
    peers,
  })
);
