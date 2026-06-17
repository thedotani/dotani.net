import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(repoRoot, 'apps/web/dist/server/wrangler.json');
const wranglerBin = resolve(repoRoot, 'node_modules/wrangler/bin/wrangler.js');

if (!existsSync(configPath)) {
  throw new Error('Build output missing. Run npm run build first.');
}

if (!existsSync(wranglerBin)) {
  throw new Error('Wrangler is not installed. Run npm install at the repo root.');
}

execSync(`node "${wranglerBin}" deploy --config "${configPath}"`, {
  stdio: 'inherit',
  cwd: repoRoot,
});