if(!self.define){let e,t={};const i=(i,n)=>(i=new URL(i+".js",n).href,t[i]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=t,document.head.appendChild(e)}else e=i,importScripts(i),t()})).then((()=>{let e=t[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,o)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(t[s])return;let r={};const c=e=>i(e,s),d={module:{uri:s},exports:r,require:c};t[s]=Promise.all(n.map((e=>d[e]||c(e)))).then((e=>(o(...e),r)))}}define(["./workbox-840119a7"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.registerRoute(/^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,new e.NetworkFirst({cacheName:"api-cache",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:86400})]}),"GET")}));
self.addEventListener('push', (event) => {
  console.log('[SW] Push Event Received');
  
  // Default values
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