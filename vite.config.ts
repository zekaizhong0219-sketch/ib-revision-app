import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  base: '/ib-revision-app/',
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'IB Revision',
        short_name: 'IB Revision',
        description: 'Spaced-repetition flashcards, timed practice and progress tracking for IB Physics, Chemistry and Math AA HL.',
        theme_color: '#1f4fd1',
        background_color: '#0f1115',
        display: 'standalone',
        start_url: '/ib-revision-app/',
        scope: '/ib-revision-app/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Listening recordings (VOA Learning English) are streamed once, then kept for offline use.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/voa-audio\.voanews\.eu\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'listening-audio',
              expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Separate chunks so an app-code update doesn't invalidate the (large, rarely changing)
        // study content or third-party libraries in the browser / service-worker cache.
        manualChunks(id) {
          if (id.includes('/src/data/')) return 'content';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react';
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
