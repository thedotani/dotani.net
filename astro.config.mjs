// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Used when Cloudflare Pages runs `astro build` from the repo root.
export default defineConfig({
  srcDir: './apps/web/src',
  publicDir: './apps/web/public',
  outDir: './apps/web/dist',
  output: 'server',
  adapter: cloudflare(),
});