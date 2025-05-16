// Import Workbox modules
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Set Workbox configuration
workbox.setConfig({
  debug: false
});

// VAPID Public Key for push notifications
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Precaching configuration
workbox.precaching.precacheAndRoute([
  {url: "assets/index-CtJ4DkCl.js", revision: null},
  {url: "assets/index-DZ1nFDTM.css", revision: null},
  {url: "assets/router-CB9oiy3g.js", revision: null},
  {url: "assets/workbox-window.prod.es5-B9K5rw8f.js", revision: null},
  {url: "index.html", revision: "8f14086d7398fd7b4fb36ea294199e47"},
  {url: "images/logo.png", revision: "ac73f380ba0147f4fa5951dfaba2a665"},
  {url: "manifest.webmanifest", revision: "6ecae317d6ade3c36a55a8ec6f812a6e"}
]);

// Cache strategy for navigation
workbox.routing.registerRoute(
  new workbox.routing.NavigationRoute(
    workbox.precaching.createHandlerBoundToURL('index.html')
  )
);

// Push Notification Handling
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Notifikasi';
const options = {
  body: data.body || 'Pesan baru diterima!',
  icon: data.icon || '/images/logo.png',
  badge: data.badge || '/images/logo.png',
  data: {
    url: data.url || '/#/home'
  }
};


  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data?.url || '/#/home';
      
      // Check if there's already a window/tab open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if none found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync for failed requests
workbox.routing.registerRoute(
  new RegExp('https://story-api.dicoding.dev/v1/stories'),
  new workbox.strategies.NetworkOnly({
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('storyQueue', {
        maxRetentionTime: 24 * 60 // Retry for max 24 hours
      })
    ]
  }),
  'POST'
);

// Convert VAPID key to Uint8Array
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

// Service worker activation
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
