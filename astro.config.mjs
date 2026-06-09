import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// Disable the CSRF origin check in dev so the RSVP form can be tested
// from any local origin (localhost:3000 / 127.0.0.1 / vercel dev proxy).
// Production keeps the protection.
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  adapter: vercel(),
  security: { checkOrigin: isProd },
});
