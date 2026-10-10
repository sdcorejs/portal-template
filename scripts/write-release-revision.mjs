import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const artifact = JSON.parse(readFileSync('docs/core31-release-artifact.json', 'utf8'));
const commit =
  process.env.GITHUB_SHA ??
  execFileSync('git', ['-c', 'safe.directory=' + process.cwd(), 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Expected the exact build commit');
writeFileSync(
  'public/release.json',
  JSON.stringify(
    { schemaVersion: 1, commit, coreVersion: artifact.version, coreIntegrity: artifact.integrity, coreSourceCommit: artifact.sourceCommit },
    null,
    2
  ) + '\n'
);
