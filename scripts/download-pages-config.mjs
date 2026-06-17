import { execSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import TOML from '@iarna/toml';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const wranglerJsoncPath = resolve(repoRoot, 'wrangler.jsonc');
const wranglerTomlPath = resolve(repoRoot, 'wrangler.toml');
const wranglerBin = resolve(repoRoot, 'node_modules/wrangler/bin/wrangler.js');

execSync(`node "${wranglerBin}" pages download config dotani-net --force`, {
  stdio: 'inherit',
  cwd: repoRoot,
});

if (!existsSync(wranglerTomlPath)) {
  throw new Error('Expected wrangler.toml after download.');
}

const downloaded = TOML.parse(readFileSync(wranglerTomlPath, 'utf8'));

const merged = {
  ...downloaded,
  $schema: './node_modules/wrangler/config-schema.json',
  name: downloaded.name ?? 'dotani-net',
  pages_build_output_dir: './apps/web/dist',
  compatibility_date: downloaded.compatibility_date ?? '2026-04-15',
  compatibility_flags: downloaded.compatibility_flags ?? ['nodejs_compat'],
};

writeFileSync(wranglerJsoncPath, `${JSON.stringify(merged, null, 2)}\n`);
unlinkSync(wranglerTomlPath);

console.log('Updated wrangler.jsonc with dashboard bindings.');