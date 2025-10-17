import { defineConfig } from 'astro/config';
import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  // Ensure proper routing for Vercel
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  // Enable markdown support
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  vite: {
    plugins: [yaml()]
  }
});
