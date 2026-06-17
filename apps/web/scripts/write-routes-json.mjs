import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
writeFileSync(
  resolve(distDir, '_routes.json'),
  JSON.stringify({
    version: 1,
    include: ['/*'],
    exclude: ['/_astro/*', '/favicon.ico', '/favicon.svg'],
  }),
);