import { execFileSync, execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const studioDir = resolve(repoRoot, 'apps', 'studio');
const seedScript = resolve(repoRoot, 'scripts', 'seed-content.mjs');
const seedFile = resolve(repoRoot, 'seed.ndjson');

const args = new Set(process.argv.slice(2));
const dataset = process.env.SANITY_DATASET || 'staging';
const confirmProduction = args.has('--confirm-production');
const skipGenerate = args.has('--skip-generate');

if (dataset === 'production' && !confirmProduction) {
  console.error(
    [
      'Refusing to import into production without explicit confirmation.',
      'Recommended flow:',
      '  1. npm run seed:import',
      '  2. Preview with PUBLIC_SANITY_DATASET=staging',
      '  3. npm run seed:import:production',
      '',
    ].join('\n'),
  );
  process.exit(1);
}

if (!skipGenerate) {
  const ndjson = execFileSync(process.execPath, [seedScript], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  writeFileSync(seedFile, ndjson);
  console.log(`Generated ${seedFile}`);
}

if (!existsSync(seedFile)) {
  throw new Error('seed.ndjson not found. Run npm run seed:generate first.');
}

const lineCount = readFileSync(seedFile, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean).length;

console.log(`Importing ${lineCount} documents into Sanity dataset "${dataset}"...`);

if (dataset === 'production') {
  console.warn('This will replace existing documents that use the same _id values.');
}

function runImport() {
  execSync(`npx sanity datasets import -d ${dataset} "${seedFile}" --replace`, {
    cwd: studioDir,
    stdio: 'inherit',
  });
}

function ensureDataset(name) {
  try {
    execSync(`npx sanity datasets create ${name} --visibility public`, {
      cwd: studioDir,
      stdio: 'inherit',
    });
    console.log(`Created dataset "${name}".`);
  } catch {
    // Dataset may already exist.
  }
}

try {
  runImport();
} catch (error) {
  if (dataset !== 'staging') {
    throw error;
  }

  console.log('Staging dataset not found. Creating it first...');
  ensureDataset('staging');
  runImport();
}

console.log(`Import complete for dataset "${dataset}".`);
if (dataset === 'staging') {
  console.log('Preview locally with PUBLIC_SANITY_DATASET=staging in apps/web/.env');
}