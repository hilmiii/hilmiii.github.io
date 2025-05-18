importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.setConfig({ debug: false });

const manifest = self.__WB_MANIFEST;

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Asset tambahan
// const CACHE_NAME = 'app-shell-v1';
// const ASSETS_TO_CACHE = [
//   '/',
//   '/index.html',
//   '/scripts/main.js',
//   '/styles/styles.css',
//   '/images/logo.png',
// ];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Route handler untuk SPA
workbox.routing.registerRoute(
  new workbox.routing.NavigationRoute(
    workbox.precaching.createHandlerBoundToURL('index.html')
  )
);

// Notifikasi push
self.addEventListener('push', (event) => {
  console.log('[SW] Push Event Received - Production:', event);
  
  let payload = {
    title: 'CurhatAnonim',
    body: 'Pesan baru tersedia',
    icon: '/images/logo.png',
    url: '/'
  };

  try {
    if (event.data) {
      const text = event.data.text();
      console.log('[SW] Raw notification data:', text);
      if (text) payload = JSON.parse(text);
    }
  } catch (e) {
    console.error('[SW] Error parsing notification:', e);
  }

  const iconUrl = new URL(payload.icon, self.location.origin).href;
  console.log('[SW] Notification details:', {
    title: payload.title,
    body: payload.body,
    icon: iconUrl
  });

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: iconUrl,
      badge: '/images/logo.png',
      data: { url: payload.url || '/' },
      vibrate: [200, 100, 200]
    })
  );
});

// Background sync untuk POST API
workbox.routing.registerRoute(
  new RegExp('https://story-api.dicoding.dev/v1/stories'),
  new workbox.strategies.NetworkOnly({
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('storyQueue', {
        maxRetentionTime: 24 * 60 
      })
    ]
  }),
  'POST'
);

// Caching gambar
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxEntries: 100 }),
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] })
    ],
    fetchOptions: {
      mode: 'no-cors'
    }
  })
);

// Cleanup saat activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes('workbox') && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
