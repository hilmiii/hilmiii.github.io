if(!self.define){let e,t={};const i=(i,n)=>(i=new URL(i+".js",n).href,t[i]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=t,document.head.appendChild(e)}else e=i,importScripts(i),t()})).then((()=>{let e=t[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,o)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(t[s])return;let r={};const c=e=>i(e,s),d={module:{uri:s},exports:r,require:c};t[s]=Promise.all(n.map((e=>d[e]||c(e)))).then((e=>(o(...e),r)))}}define(["./workbox-840119a7"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.registerRoute(/^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,new e.NetworkFirst({cacheName:"api-cache",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:86400})]}),"GET")}));
self.addEventListener('push', (event) => {
  console.log('[SW] Push Event Received - Production:', event);
  
  // Default payload untuk production debugging
  let payload = {
    title: 'CurhatAnonim',
    body: 'Notifikasi default',
    icon: '/images/logo.png',
    url: '/'
  };

  try {
    // Coba parse data notifikasi
    if (event.data) {
      const text = event.data.text();
      console.log('[SW] Raw notification data:', text);
      
      if (text) {
        payload = JSON.parse(text);
      }
    }
  } catch (e) {
    console.error('[SW] Error parsing notification:', e);
  }

  // Pastikan URL icon absolute untuk production
  const iconUrl = new URL(payload.icon || '/images/logo.png', self.location.origin).href;
  console.log('[SW] Using icon URL:', iconUrl);

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: iconUrl,
      badge: '/images/logo.png',
      data: { url: payload.url || '/' },
      vibrate: [200, 100, 200]
    })
    .then(() => console.log('[SW] Notification shown in production'))
    .catch(err => console.error('[SW] Failed to show notification:', err))
  );
});