import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const wranglerPath = resolve(distDir, 'server', 'wrangler.json');

writeFileSync(
  resolve(distDir, '_routes.json'),
  JSON.stringify({
    version: 1,
    include: ['/*'],
    exclude: ['/favicon.ico', '/favicon.svg'],
  }),
);

writeFileSync(
  resolve(distDir, '_worker.js'),
  "export { default } from './server/entry.mjs';\n",
);

// Copy _headers to root if it exists in client (needed for Cloudflare Pages)
try {
  const clientHeaders = readFileSync(resolve(distDir, 'client', '_headers'), 'utf8')
  writeFileSync(resolve(distDir, '_headers'), clientHeaders)
} catch {}

const wrangler = JSON.parse(readFileSync(wranglerPath, 'utf8'));
delete wrangler.pages_build_output_dir;
delete wrangler.configPath;
delete wrangler.userConfigPath;
wrangler.assets = {
  ...wrangler.assets,
  run_worker_first: true,
};
writeFileSync(wranglerPath, JSON.stringify(wrangler));