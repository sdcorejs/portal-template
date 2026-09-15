import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const moduleRoot = path.join(root, 'src/modules/pattern');
const manifest = {};
// Git may check out CRLF on Windows; keep published examples identical across machines.
const readSource = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
for (const group of fs.readdirSync(path.join(moduleRoot, 'features'))) {
  const seen = new Set();
  function collect(file) {
    const absolute = path.resolve(file);
    if (!absolute.startsWith(moduleRoot + path.sep) || seen.has(absolute) || !fs.existsSync(absolute)) return;
    seen.add(absolute);
    if (!absolute.endsWith('.ts')) return;
    const text = readSource(absolute);
    for (const match of text.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
      const imported = path.resolve(path.dirname(absolute), match[1]);
      collect(imported + '.ts');
    }
    for (const match of text.matchAll(/(?:templateUrl|styleUrl)\s*:\s*['"]([^'"]+)['"]/g))
      collect(path.resolve(path.dirname(absolute), match[1]));
  }
  collect(path.join(moduleRoot, 'features', group, group + '.component.ts'));
  collect(path.join(moduleRoot, 'catalog/pattern-catalog.ts'));
  manifest[group] = [...seen].sort().map(file => ({ path: path.relative(root, file).replaceAll('\\', '/'), content: readSource(file) }));
  if (manifest[group].length < 2) throw Error('Missing source for ' + group);
}
const output = path.join(root, 'public/pattern-source.json');
const content = JSON.stringify(manifest, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || readSource(output) !== content) throw Error('Pattern source stale. Run npm run export:pattern.');
  console.log('Pattern source is current.');
} else {
  fs.writeFileSync(output, content);
  console.log('Exported Angular source for ' + Object.keys(manifest).length + ' pattern groups.');
}
