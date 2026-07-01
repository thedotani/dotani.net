import { readFileSync, writeFileSync, renameSync, rmSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src');

writeFileSync(
  resolve(distDir, '_routes.json'),
  JSON.stringify({
    version: 1,
    include: ['/*'],
    exclude: ['/_astro/*', '/favicon.ico', '/favicon.svg'],
  }),
);

writeFileSync(
  resolve(distDir, '_worker.js'),
  "export { default } from './server/entry.mjs';\n",
);

// Generate _headers from single source of truth (security-headers.json)
const headersJson = JSON.parse(readFileSync(resolve(srcDir, 'lib', 'security-headers.json'), 'utf-8'));
const headersLines = Object.entries(headersJson).map(([k, v]) => `  ${k}: ${v}`);
writeFileSync(resolve(distDir, '_headers'), `/*\n${headersLines.join('\n')}\n`);

// Move static assets from client/ to dist/ root so Pages can serve them directly
const clientDir = resolve(distDir, 'client');
try {
  const clientEntries = readdirSync(clientDir);
  for (const entry of clientEntries) {
    if (entry === '_headers' || entry === '.assetsignore') continue;
    const src = join(clientDir, entry);
    const dst = join(distDir, entry);
    renameSync(src, dst);
  }
  rmSync(clientDir, { recursive: true, force: true });
} catch {}
