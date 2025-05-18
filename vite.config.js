import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'public',       // BUKAN src/public
      filename: 'sw.js',
      injectRegister: 'auto',
      manifest: {
        name: 'SerlokTakParani',
        short_name: 'Serlok',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'images/logo.png',
            sizes: '192x192',
            type: 'image/png',
          }
        ]
      }
    })
  ]
});
