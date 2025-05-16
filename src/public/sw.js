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
  console.log('[SW] Push Event Received');
  
  let title = 'SerlokTakParani';
  let body = 'Pesan baru, Insight baru!';
  let url = '/#/home';
  
  try {
    if (event.data) {
      const textData = event.data.text();
      console.log('[SW] Raw push data:', textData);
      
      if (textData.startsWith('{') || textData.startsWith('[')) {
        const jsonData = JSON.parse(textData);
        console.log('[SW] Parsed JSON data:', jsonData);
        
        title = jsonData.title || title;
        body = jsonData.body || body;
        url = jsonData.url || url;
      } else {
        body = textData;
      }
    }
  } catch (e) {
    console.error('[SW] Error processing push data:', e);
  }

  console.log('[SW] Showing notification:', { title, body, url });
  
  const options = {
    body: body,
    icon: '/images/logo.png',  
    badge: '/images/logo.png',
    data: { url: url }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => console.log('[SW] Notification shown successfully'))
      .catch(err => console.error('[SW] Failed to show notification:', err))
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
