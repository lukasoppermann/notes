import { defineConfig } from 'astro/config';

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
});
