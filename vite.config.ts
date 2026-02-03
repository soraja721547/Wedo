import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/Wedo/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/Wedo/index.html',
        cleanupOutdatedCaches: true
      },
      devOptions: {
        enabled: false
      },
      includeAssets: ['logo.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'WEDO 任務管理',
        short_name: 'WEDO',
        description: '現代化極簡高效任務管理系統',
        theme_color: '#818cf8',
        display: 'standalone',
        start_url: '/Wedo/',
        icons: [
          {
            src: '/Wedo/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Wedo/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/Wedo/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
