import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(repoRoot, 'apps/web/dist');
const wranglerBin = resolve(repoRoot, 'node_modules/wrangler/bin/wrangler.js');

if (!existsSync(distDir)) {
  throw new Error('Build output missing. Run npm run build first.');
}

if (!existsSync(wranglerBin)) {
  throw new Error('Wrangler is not installed. Run npm install at the repo root.');
}

execSync(`node "${wranglerBin}" pages deploy "${distDir}" --project-name dotani-net`, {
  stdio: 'inherit',
  cwd: repoRoot,
});