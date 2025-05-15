// vite.config.js
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  root: 'src', // or specify the folder containing index.html
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'SerlokTakParani',
        short_name: 'Serlok',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b883',
        icons: [
          {
            src: '/images/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/logo.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      },
    })
  ]
})


