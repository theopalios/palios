// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  // site: 'https://example.com', // TODO(theo): set your final domain, then canonical/OG URLs are emitted
  vite: {
    plugins: [tailwindcss()],
  },
});
