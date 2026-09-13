#!/usr/bin/env node
/**
 * Minimal static server for the test run.
 *
 * Playwright needs a server it can own: start it, wait for it, kill it when the
 * run ends. `astro preview` daemonises and returns, which makes that impossible
 * two ways over — Playwright's `webServer` sees the command exit immediately,
 * and on GitHub Actions the surviving background process inherits the step's
 * stdout, so the step never completes even after the tests pass. That hung a CI
 * job for 43 minutes.
 *
 * So: a foreground server, no dependencies, serving exactly what a static host
 * serves. Directory URLs resolve to index.html and unknown paths get 404.html
 * with a real 404, which is what Netlify does.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('dist');
const PORT = Number(process.env.PORT ?? 4321);
const HOST = process.env.HOST ?? '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

if (!existsSync(ROOT)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(2);
}

/** Resolve a URL path to a file inside dist/, or null if it escapes or is missing. */
function resolveFile(urlPath) {
  // normalize() collapses ".." before we join, so a crafted path cannot escape.
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const target = join(ROOT, clean);
  if (!target.startsWith(ROOT)) return null;

  if (existsSync(target) && statSync(target).isDirectory()) {
    const index = join(target, 'index.html');
    return existsSync(index) ? index : null;
  }
  return existsSync(target) ? target : null;
}

const server = createServer((req, res) => {
  const file = resolveFile(req.url ?? '/');

  if (!file) {
    const notFound = join(ROOT, '404.html');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    if (existsSync(notFound)) return createReadStream(notFound).pipe(res);
    return res.end('Not found');
  }

  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`serving dist/ at http://${HOST}:${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
