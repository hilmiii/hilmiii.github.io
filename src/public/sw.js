importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.setConfig({
  debug: false
});

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

const CACHE_NAME = 'app-shell-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.js',
  '/styles.css',
  '/fallback.html',
  '/icons/icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/fallback.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

workbox.precaching.precacheAndRoute([
  {url: "assets/index-CtJ4DkCl.js", revision: null},
  {url: "assets/index-DZ1nFDTM.css", revision: null},
  {url: "assets/router-CB9oiy3g.js", revision: null},
  {url: "assets/workbox-window.prod.es5-B9K5rw8f.js", revision: null},
  {url: "index.html", revision: "8f14086d7398fd7b4fb36ea294199e47"},
  {url: "images/logo.png", revision: "ac73f380ba0147f4fa5951dfaba2a665"},
  {url: "manifest.webmanifest", revision: "6ecae317d6ade3c36a55a8ec6f812a6e"}
]);

workbox.routing.registerRoute(
  new workbox.routing.NavigationRoute(
    workbox.precaching.createHandlerBoundToURL('index.html')
  )
);

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received');
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error('Failed to parse push data:', e);
    data = {
      title: 'Notifikasi Baru',
      body: 'Anda menerima pesan baru'
    };
  }

  const title = data.title || 'CurhatAnonim';
  const options = {
    body: data.body || 'Ada curhat baru di sekitar Anda!',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    data: {
      url: data.url || '/#/home'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => console.log('Notification shown'))
      .catch(err => console.error('Notification failed:', err))
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data?.url || '/#/home';
      
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

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

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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

ASSETS_TO_CACHE.push('/images/fallback.jpg');

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes('workbox') && cacheName !== 'static-assets-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
