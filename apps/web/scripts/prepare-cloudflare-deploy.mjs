import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const serverDir = resolve(distDir, 'server');
const wranglerPath = resolve(serverDir, 'wrangler.json');
const deployScript = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'scripts',
  'deploy.mjs',
);

writeFileSync(
  resolve(distDir, '_routes.json'),
  JSON.stringify({
    version: 1,
    include: ['/*'],
    exclude: ['/_astro/*', '/favicon.ico', '/favicon.svg'],
  }),
);

const wrangler = JSON.parse(readFileSync(wranglerPath, 'utf8'));
delete wrangler.pages_build_output_dir;
delete wrangler.configPath;
delete wrangler.userConfigPath;
wrangler.assets = {
  ...wrangler.assets,
  run_worker_first: true,
};
writeFileSync(wranglerPath, JSON.stringify(wrangler));

if (process.env.CF_PAGES === '1') {
  execSync(`node "${deployScript}"`, { stdio: 'inherit' });
}