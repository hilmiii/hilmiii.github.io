if(!self.define){let e,t={};const i=(i,n)=>(i=new URL(i+".js",n).href,t[i]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=t,document.head.appendChild(e)}else e=i,importScripts(i),t()})).then((()=>{let e=t[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,o)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(t[s])return;let r={};const c=e=>i(e,s),d={module:{uri:s},exports:r,require:c};t[s]=Promise.all(n.map((e=>d[e]||c(e)))).then((e=>(o(...e),r)))}}define(["./workbox-840119a7"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.registerRoute(/^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,new e.NetworkFirst({cacheName:"api-cache",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:86400})]}),"GET")}));
self.addEventListener('push', (event) => {
  console.log('[SW] Push Event Received', event);

  // Default notification content
  const defaultNotification = {
    title: 'CurhatAnonim',
    body: 'Ada pesan baru untuk kamu!',
    icon: '/icons/icon-192.png',
    url: '/#/home'
  };

  let notificationData = defaultNotification;

  try {
    // First try to get as text
    const textData = event.data.text();
    console.log('[SW] Raw push data:', textData);

    // Check if it's JSON
    if (textData.startsWith('{') || textData.startsWith('[')) {
      const jsonData = JSON.parse(textData);
      console.log('[SW] Parsed JSON data:', jsonData);
      
      notificationData = {
        title: jsonData.title || defaultNotification.title,
        body: jsonData.options?.body || jsonData.body || defaultNotification.body,
        icon: jsonData.icon || defaultNotification.icon,
        url: jsonData.url || defaultNotification.url
      };
    } else {
      // For non-JSON data (like test messages)
      notificationData.body = textData;
    }
  } catch (e) {
    console.error('[SW] Error processing push data:', e);
  }

  console.log('[SW] Showing notification:', notificationData);

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: '/icons/icon-192.png',
      data: { url: notificationData.url },
      vibrate: [200, 100, 200]
    })
    .then(() => console.log('[SW] Notification displayed'))
    .catch(err => console.error('[SW] Notification failed:', err))
  );

  // Tambahkan log untuk debugging production
console.log('Service Worker activated for scope:', self.registration.scope);

self.addEventListener('push', (event) => {
  const payload = event.data?.json() || {
    title: 'CurhatAnonim',
    body: 'Pesan baru tersedia',
    icon: '/icons/icon-192.png'
  };

  // Pastikan URL icon absolute untuk production
  const iconUrl = new URL(payload.icon || '/icons/icon-192.png', self.location.origin).href;

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: iconUrl,
      badge: '/icons/icon-192.png',
      data: { url: payload.url || '/' }
    })
    .then(() => console.log('Notifikasi ditampilkan'))
    .catch(err => console.error('Gagal menampilkan notifikasi:', err))
  );
});
});