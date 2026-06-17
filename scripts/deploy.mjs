import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'apps/web/dist/server',
);
const configPath = resolve(serverDir, 'wrangler.json');

if (!existsSync(configPath)) {
  throw new Error('Build output missing. Run npm run build first.');
}

execSync('npx wrangler deploy --config wrangler.json', {
  stdio: 'inherit',
  cwd: serverDir,
});