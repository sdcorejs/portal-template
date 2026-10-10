import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/browser/', import.meta.url));
const basePath = process.env.PORTAL_BASE_PATH ?? '/';
if (!/^\/(?:[a-z0-9-]+\/)?$/.test(basePath)) throw new Error('Invalid Portal base path');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

await stat(new URL('../dist/browser/index.html', import.meta.url));

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (!pathname.startsWith(basePath)) {
      response.writeHead(404).end();
      return;
    }
    let statusCode = 200;
    let file = resolve(root, '.' + '/' + pathname.slice(basePath.length));
    const within = relative(root, file);
    if (within.startsWith('..') || isAbsolute(within)) {
      response.writeHead(404).end();
      return;
    }
    if (within === '') file = resolve(root, 'index.html');
    const exists = await stat(file).catch(error => {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
      throw error;
    });
    if (!exists?.isFile()) {
      if (extname(file)) {
        response.writeHead(404).end();
        return;
      }
      file = resolve(root, basePath === '/' ? 'index.html' : '404.html');
      statusCode = basePath === '/' ? 200 : 404;
    }
    const body = await readFile(file);
    response.writeHead(statusCode, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Content-Length': body.length });
    response.end(body);
  } catch (error) {
    console.error('Built Portal request failed:', error.message);
    response.writeHead(500).end();
  }
});

server.listen(2233, '127.0.0.1', () => process.stdout.write('Built Portal ready at http://127.0.0.1:2233\n'));
process.on('SIGINT', () => server.close());
process.on('SIGTERM', () => server.close());
