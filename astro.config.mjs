import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import sentry from "@sentry/astro";


// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: "standalone"
  }),
  integrations: [svelte(), tailwind(), sentry()]
});