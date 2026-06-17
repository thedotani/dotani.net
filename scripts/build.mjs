import { execSync } from 'node:child_process';

execSync('npm run build --workspace apps/web', { stdio: 'inherit' });