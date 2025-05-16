module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,webp,json,ico}'
  ],
  globIgnores: [
    '**/node_modules/**/*',
    'sw.js',
    'workbox-*.js'
  ],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 24 * 60 * 60 
        }
      }
    }
  ]
};
