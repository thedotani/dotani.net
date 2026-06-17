import { execSync } from 'node:child_process';

execSync('npm run build --workspace apps/web', { stdio: 'inherit' });

if (process.env.CF_PAGES === '1') {
  execSync('npm run deploy', { stdio: 'inherit' });
}