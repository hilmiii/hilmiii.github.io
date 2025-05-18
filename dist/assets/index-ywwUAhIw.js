(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=e(r);fetch(r.href,a)}})();const q="modulepreload",_=function(s){return"/"+s},M={},x=function(t,e,i){let r=Promise.resolve();if(e&&e.length>0){let o=function(l){return Promise.all(l.map(u=>Promise.resolve(u).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),p=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));r=o(e.map(l=>{if(l=_(l),l in M)return;M[l]=!0;const u=l.endsWith(".css"),c=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":q,u||(d.as="script"),d.crossOrigin="",d.href=l,p&&d.setAttribute("nonce",p),document.head.appendChild(d),u)return new Promise((S,P)=>{d.addEventListener("load",S),d.addEventListener("error",()=>P(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return r.then(o=>{for(const n of o||[])n.status==="rejected"&&a(n.reason);return t().catch(a)})};function V(s={}){const{immediate:t=!1,onNeedRefresh:e,onOfflineReady:i,onRegistered:r,onRegisteredSW:a,onRegisterError:o}=s;let n,p;const l=async(c=!0)=>{await p};async function u(){if("serviceWorker"in navigator){if(n=await x(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-B9K5rw8f.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/sw.js",{scope:"/",type:"classic"})).catch(c=>{o==null||o(c)}),!n)return;n.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),n.addEventListener("installed",c=>{c.isUpdate||i==null||i()}),n.register({immediate:t}).then(c=>{a?a("/sw.js",c):r==null||r(c)}).catch(c=>{o==null||o(c)})}}return p=u(),l}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")});const C=async()=>{try{V({onNeedRefresh(){confirm("Versi baru tersedia. Muat ulang?")&&window.location.reload()},onOfflineReady(){console.log("App siap offline")}})}catch(t){console.warn("PWA features failed to initialize:",t)}console.log("Application initialized");const s=()=>{const t=document.getElementById("network-status");t&&(t.textContent=navigator.onLine?"Online":"Offline",t.className=navigator.onLine?"online":"offline")};window.addEventListener("online",s),window.addEventListener("offline",s),s()};document.readyState==="complete"||document.readyState==="interactive"?setTimeout(C,1):document.addEventListener("DOMContentLoaded",C);const w="https://story-api.dicoding.dev/v1",T="serloktakparani_auth",z=async(s,t,e)=>{const i=await fetch(`${w}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s,email:t,password:e})}),r=await i.json();if(!i.ok)throw new Error(r.message||"Registration failed");return r},R=async(s,t)=>{const e=await fetch(`${w}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,password:t})}),i=await e.json();if(!e.ok)throw new Error(i.message||"Login failed");return localStorage.setItem(T,JSON.stringify({token:i.loginResult.token,userId:i.loginResult.userId,name:i.loginResult.name})),i},D=()=>JSON.parse(localStorage.getItem(T)),k=()=>{const s=D();return s==null?void 0:s.token},G=()=>!!k(),W=()=>{localStorage.removeItem(T)},F=async(s,t={})=>{const e=k();if(!e&&!s.includes("/guest"))throw new Error("Authentication required");const i={...t.headers,...e&&{Authorization:`Bearer ${e}`}},r=await fetch(s,{...t,headers:i});if(r.status===401)throw logout(),window.location.hash="#/login",new Error("Session expired. Please login again.");return r},j=async(s=1,t=10,e=!1)=>{const i=new URLSearchParams({page:s,size:t,location:e?"1":"0"}),r=await F(`${w}/stories?${i}`),a=await r.json();if(!r.ok)throw new Error(a.message||"Failed to fetch stories");return a.listStory},K=async s=>{const t=await F(`${w}/stories/${s}`),e=await t.json();if(!t.ok)throw new Error(e.message||"Failed to fetch story");return e.story},J=async(s,t,e,i)=>{console.log("Adding story with:",{description:s,photo:t,lat:e,lon:i});const r=new FormData;r.append("description",s),r.append("photo",t),e!==void 0&&i!==void 0&&(r.append("lat",e),r.append("lon",i)),console.log("FormData entries:");for(let[a,o]of r.entries())console.log(a,o);try{const a=await F(`${w}/stories`,{method:"POST",body:r}),o=await a.json();if(console.log("API response:",o),!a.ok)throw new Error(o.message||"Failed to add story");return o}catch(a){throw console.error("API call failed:",a),a}},Y=async(s,t,e,i)=>{const r=new FormData;r.append("description",s),r.append("photo",t),e!==void 0&&i!==void 0&&(r.append("lat",e),r.append("lon",i));const a=await fetch(`${w}/stories/guest`,{method:"POST",body:r}),o=await a.json();if(!a.ok)throw console.error("Error details:",o),new Error(o.message||"Failed to add guest story");return o};class Q{async getStories(t=1,e=10,i=!1){return await j(t,e,i)}}class Z{getToken(){return k()}async register(t,e,i){return await z(t,e,i)}async login(t,e){return await R(t,e)}getAuthData(){return D()}getAuthToken(){return k()}isLoggedIn(){return G()&&!!this.getToken()}logout(){W(),window.dispatchEvent(new Event("auth-change"))}}class N{constructor(){this.baseUrl="https://story-api.dicoding.dev/v1"}async addStory(t,e,i,r){const a=new FormData;a.append("description",t),a.append("photo",e),a.append("lat",i),a.append("lon",r);const o=await fetch(`${this.baseUrl}/stories`,{method:"POST",headers:{Authorization:`Bearer ${this.getAuthToken()}`},body:a});if(!o.ok)throw new Error("Failed to add story");return await o.json()}async getStories(t=1,e=10,i=!1){return await j(t,e,i)}async getStoryById(t){return await K(t)}async addStory(t,e,i,r){return await J(t,e,i,r)}async addGuestStory(t,e,i,r){return await Y(t,e,i,r)}}let y=null;const E=s=>(y&&y.remove(),y=L.map(s).setView([-2.5489,118.0149],5),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(y),y),X=()=>new Promise((s,t)=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(s,t):t(new Error("Geolocation tidak didukung oleh browser ini."))}),tt=async(s,t)=>{try{if(!U(s,t))throw new Error("Koordinat tidak valid");const e=new AbortController,i=setTimeout(()=>e.abort(),5e3),r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${s}&lon=${t}&zoom=10&addressdetails=1`,{headers:{"User-Agent":"YourAppName/1.0 (your@email.com)"},signal:e.signal});if(clearTimeout(i),!r.ok)throw new Error(`HTTP error! status: ${r.status}`);const a=await r.json();return et(a)}catch(e){throw console.error("Error in getLocationName:",e),e}};function U(s,t){return s!==void 0&&t!==void 0&&!isNaN(s)&&!isNaN(t)&&s>=-90&&s<=90&&t>=-180&&t<=180}function et(s){if(!s.address)return s.display_name||null;const{address:t}=s,e=[t.road,t.village,t.town,t.city,t.state,t.country].filter(Boolean);return e.length>0?e.join(", "):s.display_name}const I=(s,t)=>{t.forEach(e=>{U(e.lat,e.lon)&&L.marker([e.lat,e.lon]).addTo(s).bindPopup(`<b>${e.name}</b><br>${e.description.substring(0,50)}...`)})},it="StoryDB",rt=2,h="stories",g="pendingStories",m={async openDB(){return new Promise((s,t)=>{const e=indexedDB.open(it,rt);e.onupgradeneeded=i=>{const r=i.target.result;r.objectStoreNames.contains(h)||r.createObjectStore(h,{keyPath:"id"}).createIndex("createdAt","createdAt",{unique:!1}),r.objectStoreNames.contains(g)||r.createObjectStore(g,{keyPath:"id",autoIncrement:!0}).createIndex("status","status",{unique:!1})},e.onsuccess=i=>s(i.target.result),e.onerror=i=>t(i.target.error)})},async saveStory(s){const t=await this.openDB();return new Promise((e,i)=>{const o=t.transaction([h],"readwrite").objectStore(h).put(s);o.onsuccess=()=>e(),o.onerror=n=>i(n.target.error)})},async saveStories(s){const t=await this.openDB();return new Promise((e,i)=>{const r=t.transaction([h],"readwrite"),a=r.objectStore(h);s.forEach(o=>a.put(o)),r.oncomplete=()=>e(),r.onerror=o=>i(o.target.error)})},async getStory(s){const t=await this.openDB();return new Promise((e,i)=>{const o=t.transaction([h],"readonly").objectStore(h).get(s);o.onsuccess=()=>e(o.result),o.onerror=n=>i(n.target.error)})},async getAllStories(){const s=await this.openDB();return new Promise((t,e)=>{const a=s.transaction([h],"readonly").objectStore(h).getAll();a.onsuccess=()=>t(a.result||[]),a.onerror=o=>e(o.target.error)})},async clearStories(){const s=await this.openDB();return new Promise((t,e)=>{const a=s.transaction([h],"readwrite").objectStore(h).clear();a.onsuccess=()=>t(!0),a.onerror=()=>e("Gagal menghapus semua data")})},async savePendingStory(s){const t=await this.openDB();return new Promise((e,i)=>{const o=t.transaction([g],"readwrite").objectStore(g).add({...s,status:"pending",createdAt:new Date().toISOString()});o.onsuccess=()=>e(o.result),o.onerror=n=>i(n.target.error)})},async getPendingStories(){const s=await this.openDB();return new Promise((t,e)=>{const a=s.transaction([g],"readonly").objectStore(g).getAll();a.onsuccess=()=>t(a.result||[]),a.onerror=o=>e(o.target.error)})},async deletePendingStory(s){const t=await this.openDB();return new Promise((e,i)=>{const o=t.transaction([g],"readwrite").objectStore(g).delete(s);o.onsuccess=()=>e(),o.onerror=n=>i(n.target.error)})}},at=Object.freeze(Object.defineProperty({__proto__:null,storyDB:m},Symbol.toStringTag,{value:"Module"}));class st{constructor(t,e,i){this.view=t,this.model=e,this.authModel=i||{isLoggedIn:()=>!1}}async init(){try{this.view.showLoading();const t=await this.model.getStories(1,10,!0);await m.saveStories(t),this.view.render(t);const e=E("map");I(e,t),this.view.hideLoading()}catch(t){console.warn("Gagal fetch dari API, coba ambil dari IndexedDB:",t);try{const e=await m.getAllStories();if(e.length===0)throw new Error("Tidak ada data offline yang tersedia.");this.view.render(e);const i=E("map");I(i,e)}catch(e){this.view.showError(e.message||"Gagal memuat data offline.",!this.authModel.isLoggedIn())}finally{this.view.hideLoading()}}}}const b="https://story-api.dicoding.dev/v1",ot="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";class O{constructor(){this.VAPID_PUBLIC_KEY=ot,this.baseUrl="https://story-api.dicoding.dev/v1"}async sendStoryNotification({subscription:t,description:e,userId:i}){const r=await fetch(`${this.baseUrl}/notifications`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.getAuthToken()}`},body:JSON.stringify({userId:i,description:e,endpoint:t.endpoint,keys:t.toJSON().keys})});if(!r.ok)throw new Error("Failed to send notification");return await r.json()}async subscribe(t,e){try{if(!t||!e)throw new Error("Subscription data or token is missing");const i={p256dh:t.getKey("p256dh")?this.arrayBufferToBase64(t.getKey("p256dh")):"",auth:t.getKey("auth")?this.arrayBufferToBase64(t.getKey("auth")):""},r=await fetch(`${b}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({endpoint:t.endpoint,keys:i})}),a=await r.json();if(!r.ok)throw console.error("Subscription failed:",a),new Error(a.message||"Failed to subscribe to notifications");return console.log("Subscription successful:",a),a}catch(i){throw console.error("Error in subscribe:",i),i}}arrayBufferToBase64(t){const e=new Uint8Array(t);return btoa(String.fromCharCode.apply(null,e))}async unsubscribe(t){try{const e=localStorage.getItem("token");if(!e)throw new Error("User not authenticated");const i=await fetch(`${b}/notifications/subscribe`,{method:"DELETE",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({endpoint:t})}),r=await i.json();if(!i.ok)throw new Error(r.message||"Failed to unsubscribe");return r}catch(e){throw console.error("Unsubscribe error:",e),e}}urlBase64ToUint8Array(t){const e="=".repeat((4-t.length%4)%4),i=(t+e).replace(/-/g,"+").replace(/_/g,"/"),r=atob(i),a=new Uint8Array(r.length);for(let o=0;o<r.length;++o)a[o]=r.charCodeAt(o);return a}async getPreferences(){try{const t=localStorage.getItem("token");if(!t)throw new Error("User not authenticated");const e=await fetch(`${b}/notifications/preferences`,{method:"GET",headers:{Authorization:`Bearer ${t}`}});if(!e.ok){const i=await e.json();throw new Error(i.message||"Failed to get notification preferences")}return await e.json()}catch(t){throw console.error("Get preferences error:",t),t}}async updatePreferences(t){try{const e=localStorage.getItem("token");if(!e)throw new Error("User not authenticated");const i=await fetch(`${b}/notifications/preferences`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(t)});if(!i.ok){const r=await i.json();throw new Error(r.message||"Failed to update notification preferences")}return await i.json()}catch(e){throw console.error("Update preferences error:",e),e}}async getHistory(t=10){try{const e=localStorage.getItem("token");if(!e)throw new Error("User not authenticated");const i=await fetch(`${b}/notifications/history?limit=${t}`,{method:"GET",headers:{Authorization:`Bearer ${e}`}});if(!i.ok){const r=await i.json();throw new Error(r.message||"Failed to get notification history")}return await i.json()}catch(e){throw console.error("Get history error:",e),e}}}class ${constructor(t){this.model=t,this.notificationApi=new O}initLogin(t){this.view=t,this.view.render(),this.view.setSubmitHandler(this.handleLogin.bind(this)),this.view.focusEmailField()}initRegister(t){this.view=t,this.view.render(),this.view.setSubmitHandler(this.handleRegister.bind(this)),this.view.focusNameField()}async checkNotificationPermission(){return"Notification"in window?await Notification.requestPermission()==="granted":!1}async handleRegister(t,e,i){try{await this.model.register(t,e,i),this.view.showSuccess("Registrasi berhasil! Silakan login."),setTimeout(()=>{window.location.hash="#/login"},2e3)}catch(r){throw this.view.showError(`Registrasi gagal: ${r.message}`),r}}async handleLogin(t,e){try{const i=await this.model.login(t,e);if(i&&i.token)localStorage.setItem("token",i.token);else throw new Error("Token tidak tersedia dari server.");this.view.showSuccess("Login berhasil!");try{await m.openDB()}catch(a){console.error("Gagal buka DB:",a)}if(await this.checkNotificationPermission())try{await this.subscribeToPushNotifications()}catch(a){console.error("Gagal subscribe push:",a)}window.location.hash="#/home"}catch(i){this.view.showError(`Login gagal: ${i.message}`)}}async subscribeToPushNotifications(){if(!("serviceWorker"in navigator&&"PushManager"in window)){console.warn("Push notifications not supported");return}const t=this.model.getAuthToken();if(!t)throw new Error("User authentication token not found");try{const e=await navigator.serviceWorker.ready;let i=await e.pushManager.getSubscription();i||(i=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(this.vapidPublicKey)})),await this.notificationApi.subscribe(i,t)}catch(e){throw console.error("Push subscription error:",e),e}}async unsubscribeFromPushNotifications(){if(!("serviceWorker"in navigator))return;const e=await(await navigator.serviceWorker.ready).pushManager.getSubscription();e&&(await this.notificationApi.unsubscribe(e.endpoint),await e.unsubscribe())}urlBase64ToUint8Array(t){const e="=".repeat((4-t.length%4)%4),i=(t+e).replace(/-/g,"+").replace(/_/g,"/"),r=window.atob(i),a=new Uint8Array(r.length);for(let o=0;o<r.length;++o)a[o]=r.charCodeAt(o);return a}}class H{constructor(t,e){this.model=t,this.authModel=e,this.notificationApi=new O,this.vapidPublicKey="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",this.hasActiveSubscription=!1,this.isNotificationSupported="Notification"in window,this.initializePushNotifications()}async initializePushNotifications(){if(this.isNotificationSupported)try{await navigator.serviceWorker.ready;const t=await this.getPushSubscription();t&&console.log("Push subscription active:",t.endpoint)}catch(t){console.error("Push init error:",t)}}async getPushSubscription(){return this.isNotificationSupported?await(await navigator.serviceWorker.ready).pushManager.getSubscription():null}async triggerNewStoryNotification(t){if(this.isNotificationSupported)try{const e=await this.getPushSubscription();if(!e){console.warn("No active push subscription");return}await this.notificationApi.sendStoryNotification({subscription:e,description:t,userId:this.authModel.getCurrentUser().id})}catch(e){console.error("Notification trigger failed:",e)}}async checkPushSubscription(){if(!("serviceWorker"in navigator))return!1;try{const e=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return this.hasActiveSubscription=!!e,this.hasActiveSubscription}catch(t){return console.error("Error checking subscription:",t),!1}}async initializePushNotifications(){if(!("serviceWorker"in navigator&&"PushManager"in window)){console.warn("Push notifications not supported");return}try{await this.checkPushSubscription(),console.log("Push notifications initialized, subscription status:",this.hasActiveSubscription)}catch(t){console.error("Push initialization failed:",t)}}async initAddStory(t){this.view=t,await this.view.init(this.handleFormSubmit.bind(this))}async initDetailStory(t,e){this.view=t;try{const i=await this.getStoryWithFallback(e);this.view.render(i),this.initStoryMap([i])}catch(i){this.view.showError(i.message)}}async initStoryList(t){this.view=t,await this.loadStories()}async getStoryWithFallback(t){try{const e=await this.model.getStoryById(t);return await m.saveStory(e),e}catch{console.log("Network error, trying IndexedDB...");const i=await m.getStory(t);if(!i)throw new Error("Story not found in offline storage");return i}}async loadStories(){try{const t=await this.getStoriesWithFallback();this.view.renderStories(t),this.view.initMap&&this.initStoryMap(t)}catch(t){this.view.showError("Failed to load stories: "+t.message)}}async getStoriesWithFallback(){try{const t=await this.model.getAllStories();return await m.saveStories(t),t}catch{console.log("Network error, loading offline stories...");const e=await m.getAllStories();return this.view.showOfflineWarning(),e}}initStoryMap(t){const e=this.view.initMap?this.view.initMap():E("map");I(e,t)}async syncPendingStories(){try{const t=await m.getPendingStories(),e=[];for(const i of t)try{let r;this.authModel.isLoggedIn()?r=await this.model.addStory(i.description,i.photo,i.lat,i.lon):r=await this.model.addGuestStory(i.description,i.photo,i.lat,i.lon),await m.deletePendingStory(i.id),e.push(r)}catch(r){console.error("Failed to sync story:",i.id,r)}return e}catch(t){return console.error("Failed to sync pending stories:",t),[]}}async handleFormSubmit(t,e,i){try{if(!navigator.onLine)return await m.savePendingStory(t),this.view.showSuccess("Curhat disimpan offline"),{offline:!0};const r=await this.processFormSubmission(t);return this.authModel.isLoggedIn()&&await this.registerPushNotifications(),e&&e(r),r}catch(r){if(r.message.includes("Failed to fetch"))return await m.savePendingStory(t),this.view.showSuccess("Curhat disimpan offline"),{offline:!0};throw i&&i(r),r}}async processFormSubmission(t){var e,i,r,a;return this.authModel.isLoggedIn()?this.model.addStory(t.description,t.photo,(e=t.location)==null?void 0:e.lat,(i=t.location)==null?void 0:i.lng):this.model.addGuestStory(t.description,t.photo,(r=t.location)==null?void 0:r.lat,(a=t.location)==null?void 0:a.lng)}urlBase64ToUint8Array(t){const e="=".repeat((4-t.length%4)%4),i=(t+e).replace(/-/g,"+").replace(/_/g,"/"),r=window.atob(i);return new Uint8Array([...r].map(a=>a.charCodeAt(0)))}async testNotification(){(await navigator.serviceWorker.ready).showNotification("Test Notification",{body:"This is a test notification",icon:"/images/logo.png"})}}class v{constructor(){this.main=document.querySelector("main"),this.main.style.viewTransitionName="content"}async showLoading(){if(!document.startViewTransition){this.main.innerHTML=this.loadingTemplate();return}await document.startViewTransition(()=>{this.main.innerHTML=this.loadingTemplate()}).finished}loadingTemplate(){return`
      <div class="loading" aria-live="polite">
        <div class="loading-spinner"></div>
        <p>Memuat...</p>
      </div>
    `}async render(t){if(!document.startViewTransition){this.main.innerHTML=t;return}await document.startViewTransition(()=>{this.main.innerHTML=t}).finished}}class nt extends v{constructor(){super(),this.loadingElement=document.createElement("div"),this.loadingElement.className="loading",this.loadingElement.innerHTML="Memuat..."}showLoading(){this.main.appendChild(this.loadingElement)}hideLoading(){this.loadingElement.parentNode&&this.loadingElement.parentNode.removeChild(this.loadingElement)}render(t){this.main.innerHTML=`
      <section class="stories">
        <h2>Curhat Terbaru</h2>
        <div class="stories-container"></div>
      </section>
      <section class="map-container">
        <h2>Lokasi Curhat</h2>
        <div id="map" style="height: 400px;"></div>
      </section>
      <section class="offline-actions">
        <button id="clear-offline-btn" class="btn-danger">Hapus Data Offline</button>
      </section>
    `,this.renderStories(t),this.bindClearOfflineButton()}renderStories(t){const e=this.main.querySelector(".stories-container");e&&(e.innerHTML="",t.forEach(i=>{const r=document.createElement("article");r.className="story-card",r.setAttribute("tabindex","0"),r.setAttribute("role","article"),r.innerHTML=this.getStoryHTML(i),e.appendChild(r)}))}getStoryHTML(t){return`
      <img src="${t.photoUrl}" alt="Foto ilustrasi cerita dari ${t.name||"Anonim"}" class="story-image">
      <div class="story-content">
        <h3>${t.name||"Anonim"}</h3>
        <p class="story-date">${new Date(t.createdAt).toLocaleDateString()}</p>
        <p class="story-text">${t.description}</p>
        <div class="story-meta">
          <span><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${t.locationName||"Bumi"}</span>
        </div>
      </div>
    `}showError(t,e=!1){this.main.innerHTML=`
      <div class="error">
        ${t}
        ${e?'<a href="#/login" class="btn-primary">Login untuk melihat curhat</a>':""}
      </div>
    `}bindClearOfflineButton(){const t=this.main.querySelector("#clear-offline-btn");t&&t.addEventListener("click",async()=>{if(confirm("Yakin ingin menghapus semua data offline?")){const{storyDB:i}=await x(async()=>{const{storyDB:r}=await Promise.resolve().then(()=>at);return{storyDB:r}},void 0);await i.clearStories(),alert("Data offline berhasil dihapus."),location.reload()}})}}class ct extends v{constructor(){super(),this.submitButton=null,this.errorTimeout=null}render(){this.main.innerHTML=`
      <section class="auth-container" aria-labelledby="loginTitle">
        <div class="auth-card">
          <h1 id="loginTitle" class="auth-title">Masuk ke SerlokTakParani</h1>
          <form id="loginForm" class="auth-form" aria-label="Formulir login">
            ${this.getEmailField()}
            ${this.getPasswordField()}
            <button type="submit" class="btn btn-primary btn-block" id="submitButton">
              Masuk
            </button>
            <div class="auth-footer">
              <p>Belum punya akun? <a href="#/register" class="auth-link">Daftar disini</a></p>
            </div>
          </form>
        </div>
      </section>
    `,this.initializeForm()}getEmailField(){return`
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="email@contoh.com" 
          required
          aria-required="true"
          aria-describedby="emailHelp"
          autocomplete="username"
          autocapitalize="off"
          spellcheck="false"
        >
        <small id="emailHelp" class="form-text">Gunakan email yang sudah terdaftar</small>
      </div>
    `}getPasswordField(){return`
      <div class="form-group password-group">
        <label for="password">Password</label>
        <div class="password-input-container">
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Minimal 8 karakter" 
            minlength="8"
            required
            aria-required="true"
            autocomplete="current-password"
          >
          <button 
            type="button" 
            id="togglePassword" 
            class="password-toggle"
            aria-label="Toggle password visibility"
          >
            <i class="fas fa-eye" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `}initializeForm(){this.submitButton=document.getElementById("submitButton");const t=document.getElementById("loginForm"),e=t.querySelector("#password"),i=t.querySelector("#togglePassword");i==null||i.addEventListener("click",()=>{const r=e.type==="password";e.type=r?"text":"password",i.innerHTML=r?'<i class="fas fa-eye-slash" aria-hidden="true"></i>':'<i class="fas fa-eye" aria-hidden="true"></i>',i.setAttribute("aria-label",r?"Sembunyikan password":"Tampilkan password")}),t.addEventListener("submit",this.handleSubmit.bind(this))}async handleSubmit(t){t.preventDefault();const e=t.target,i=e.email.value.trim(),r=e.password.value;if(this.clearError(),!i||!r){this.showError("Harap isi semua field");return}if(r.length<8){this.showError("Password harus minimal 8 karakter");return}this.setLoadingState(!0);try{await this.submitHandler(i,r),this.clearForm()}catch(a){this.showError(a.message||"Terjadi kesalahan saat login")}finally{this.setLoadingState(!1)}}setSubmitHandler(t){this.submitHandler=async(e,i)=>{try{await t(e,i),this.showSuccess("Login berhasil!"),location.reload()}catch(r){throw r}}}setLoadingState(t){this.submitButton&&(t?(this.submitButton.disabled=!0,this.submitButton.innerHTML=`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Memproses...
      `):(this.submitButton.disabled=!1,this.submitButton.textContent="Masuk"))}showSuccess(t){this.clearError();const e=document.createElement("div");e.className="alert alert-success",e.setAttribute("role","alert"),e.innerHTML=`
      <span class="fas fa-check-circle" aria-hidden="true"></span>
      <span>${t}</span>
    `,document.querySelector(".auth-card").prepend(e),setTimeout(()=>{e.classList.add("fade-out"),setTimeout(()=>e.remove(),300)},3e3)}showError(t){this.clearError();const e=document.createElement("div");e.className="alert alert-danger",e.setAttribute("role","alert"),e.innerHTML=`
      <span class="fas fa-exclamation-circle" aria-hidden="true"></span>
      <span>${t}</span>
    `;const i=document.getElementById("loginForm");i.parentNode.insertBefore(e,i),this.errorTimeout=setTimeout(()=>{e.classList.add("fade-out"),setTimeout(()=>e.remove(),300)},5e3)}clearError(){this.errorTimeout&&(clearTimeout(this.errorTimeout),this.errorTimeout=null);const t=document.querySelector(".alert-danger");t&&t.remove()}clearForm(){const t=document.getElementById("loginForm");t&&t.reset()}focusEmailField(){const t=document.getElementById("email");t&&(t.focus(),t.select())}cleanup(){this.clearError();const t=document.getElementById("loginForm");t&&t.removeEventListener("submit",this.handleSubmit)}}class lt extends v{constructor(){super(),console.log("RegisterView initialized"),this.submitButton=null,this.passwordInput=null,this.confirmPasswordInput=null}getNameField(){return`
      <div class="form-group">
        <label for="name">Nama Lengkap</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          placeholder="Nama kamu" 
          required
          minlength="3"
          autocomplete="name"
        >
      </div>
    `}getEmailField(){return`
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="email@contoh.com" 
          required
          aria-describedby="emailHelp"
          autocomplete="email"
        >
        <small id="emailHelp" class="form-text">Email harus unik dan valid</small>
      </div>
    `}getPasswordField(){return`
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="Minimal 8 karakter" 
          minlength="8"
          required
          aria-describedby="passwordHelp"
          autocomplete="new-password"
        >
        <small id="passwordHelp" class="form-text">Minimal 8 karakter</small>
        <button type="button" id="togglePassword" class="password-toggle">
          <i class="fas fa-eye"></i>
        </button>
        <div class="password-strength">
          <div class="strength-meter">
            <div class="strength-bar"></div>
          </div>
          <small class="strength-feedback"></small>
        </div>
      </div>
    `}getConfirmPasswordField(){return`
      <div class="form-group">
        <label for="confirmPassword">Konfirmasi Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          name="confirmPassword" 
          placeholder="Ketik ulang password" 
          required
          autocomplete="new-password"
        >
        <button type="button" id="toggleConfirmPassword" class="password-toggle">
          <i class="fas fa-eye"></i>
        </button>
        <small id="confirmPasswordError" class="text-danger" style="display:none;">
          Password tidak cocok
        </small>
      </div>
    `}render(){this.main.innerHTML=`
      <section class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">Daftar ke SerlokTakParani</h1>
          <form id="registerForm" class="auth-form">
            ${this.getNameField()}
            ${this.getEmailField()}
            ${this.getPasswordField()}
            ${this.getConfirmPasswordField()}
            <button type="submit" class="btn btn-primary btn-block" id="submitButton">
              Daftar
            </button>
            <div class="auth-footer">
              <p>Sudah punya akun? <a href="#/login" class="auth-link">Masuk disini</a></p>
            </div>
          </form>
        </div>
      </section>
    `,this.submitButton=document.getElementById("submitButton"),this.passwordInput=document.getElementById("password"),this.confirmPasswordInput=document.getElementById("confirmPassword")}setSubmitHandler(t){var n,p;const e=document.getElementById("registerForm");if(!e){console.error("Register form not found");return}const i=e.querySelector("#name"),r=e.querySelector("#email"),a=e.querySelector("#togglePassword"),o=e.querySelector("#toggleConfirmPassword");if(!i||!r||!this.passwordInput||!this.confirmPasswordInput){console.error("Required form fields not found");return}a&&a.addEventListener("click",()=>{const l=this.passwordInput.getAttribute("type")==="password"?"text":"password";this.passwordInput.setAttribute("type",l),a.innerHTML=l==="password"?'<i class="fas fa-eye"></i>':'<i class="fas fa-eye-slash"></i>'}),o&&o.addEventListener("click",()=>{const l=this.confirmPasswordInput.getAttribute("type")==="password"?"text":"password";this.confirmPasswordInput.setAttribute("type",l),o.innerHTML=l==="password"?'<i class="fas fa-eye"></i>':'<i class="fas fa-eye-slash"></i>'}),(n=this.passwordInput)==null||n.addEventListener("input",()=>{this.updatePasswordStrength(),this.validatePasswordMatch()}),(p=this.confirmPasswordInput)==null||p.addEventListener("input",()=>{this.validatePasswordMatch()}),e.addEventListener("submit",async l=>{l.preventDefault();const u=i.value.trim(),c=r.value.trim(),d=this.passwordInput.value,S=this.confirmPasswordInput.value;if(!u||!c||!d||!S){this.showError("Harap isi semua field");return}if(u.length<3){this.showError("Nama harus minimal 3 karakter");return}if(d.length<8){this.showError("Password harus minimal 8 karakter");return}if(d!==S){this.showError("Password dan konfirmasi password tidak cocok");return}this.setLoadingState(!0);try{await t(u,c,d)}catch(P){this.setLoadingState(!1),this.showError(P.message)}})}updatePasswordStrength(){const t=this.passwordInput.value,e=document.querySelector(".strength-bar"),i=document.querySelector(".strength-feedback");if(!t){e.style.width="0%",e.style.backgroundColor="transparent",i.textContent="";return}let r=0;t.length>=8&&(r+=1),/[A-Z]/.test(t)&&(r+=1),/[0-9]/.test(t)&&(r+=1),/[^A-Za-z0-9]/.test(t)&&(r+=1);const a=r/4*100;e.style.width=`${a}%`;let o,n;switch(r){case 0:case 1:o="#dc3545",n="Lemah";break;case 2:o="#fd7e14",n="Sedang";break;case 3:o="#ffc107",n="Kuat";break;case 4:o="#28a745",n="Sangat Kuat";break;default:o="#dc3545",n=""}e.style.backgroundColor=o,i.textContent=n,i.style.color=o}validatePasswordMatch(){const t=this.passwordInput.value,e=this.confirmPasswordInput.value,i=document.getElementById("confirmPasswordError");t&&e&&t!==e?(i.style.display="block",this.confirmPasswordInput.classList.add("is-invalid")):(i.style.display="none",this.confirmPasswordInput.classList.remove("is-invalid"))}setLoadingState(t){this.submitButton&&(t?(this.submitButton.disabled=!0,this.submitButton.innerHTML=`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Memproses...
      `):(this.submitButton.disabled=!1,this.submitButton.textContent="Daftar"))}showSuccess(t){const e=document.createElement("div");e.className="alert alert-success",e.textContent=t,document.querySelector(".auth-card").prepend(e),setTimeout(()=>e.remove(),3e3)}showError(t){const e=document.createElement("div");e.className="alert alert-danger",e.textContent=t;const i=document.querySelector(".auth-card"),r=i.querySelector(".alert-danger");if(r)r.replaceWith(e);else{const a=document.getElementById("registerForm");i.insertBefore(e,a)}setTimeout(()=>e.remove(),5e3)}clearForm(){const t=document.getElementById("registerForm");t&&t.reset(),document.querySelector(".strength-bar").style.width="0%",document.querySelector(".strength-feedback").textContent=""}focusNameField(){const t=document.getElementById("name");t&&t.focus()}}class dt extends v{constructor(){super(),this.cameraStream=null,this.map=null,this.photoFile=null,this.isSubmitting=!1,this.submitHandler=null,this.handleSubmit=this.handleSubmit.bind(this),this.startCamera=this.startCamera.bind(this),this.stopCamera=this.stopCamera.bind(this),this.capturePhoto=this.capturePhoto.bind(this),this.handleFileUpload=this.handleFileUpload.bind(this),this.handleGetLocation=this.handleGetLocation.bind(this),this.setupMapClickHandler=this.setupMapClickHandler.bind(this)}async init(t){try{this.submitHandler=e=>t(e,i=>this.handleSubmitSuccess(i),i=>this.handleSubmitError(i)),this.renderTemplate(),this.initializeMap(),this.setupEventListeners(),this.setupAriaAttributes(),this.focusFirstField()}catch(e){console.error("Initialization failed:",e),this.showError("Failed to initialize form")}}handleSubmitSuccess(t){this.showSuccess("Curhat berhasil dikirim!"),setTimeout(()=>{window.location.hash="#/home"},1e3)}handleSubmitError(t){this.showError(t.message),this.setLoadingState(!1)}async handleSubmit(t){if(t.preventDefault(),!this.isSubmitting){this.isSubmitting=!0,this.setLoadingState(!0);try{const e=this.getFormData();await this.validateFormData(e),await this.submitHandler(e)}catch(e){this.handleSubmitError(e)}}}renderTemplate(){this.main.innerHTML=`
      <section class="add-story" aria-labelledby="addStoryTitle">
        <h2 id="addStoryTitle">Buat Curhat Anonim</h2>
        <form id="storyForm" aria-label="Formulir tambah curhat">
          ${this.getDescriptionField()}
          ${this.getPhotoField()}
          ${this.getLocationField()}
          ${this.getNotificationConsent(!1)}
          <button type="submit" class="btn-primary" id="submitBtn">
            Kirim Curhat
          </button>
        </form>
      </section>
    `}initializeMap(){this.map=E("map"),this.setupMapClickHandler()}setupEventListeners(){const t=document.getElementById("storyForm");if(!t)return;t.removeEventListener("submit",this.handleSubmit),t.addEventListener("submit",this.handleSubmit);const e=document.getElementById("cameraBtn"),i=document.getElementById("uploadBtn"),r=document.getElementById("captureBtn"),a=document.getElementById("photoInput"),o=document.getElementById("getLocationBtn");e&&e.addEventListener("click",this.startCamera),i&&i.addEventListener("click",()=>a.click()),r&&r.addEventListener("click",this.capturePhoto),a&&a.addEventListener("change",this.handleFileUpload),o&&o.addEventListener("click",this.handleGetLocation)}setupAriaAttributes(){const t=document.getElementById("storyForm");t&&t.setAttribute("aria-live","polite")}async handleSubmit(t){if(t.preventDefault(),!this.isSubmitting){this.isSubmitting=!0,this.setLoadingState(!0);try{const e=this.getFormData();await this.validateFormData(e),await this.submitHandler(e),this.showSuccess("Curhat berhasil dikirim!"),setTimeout(()=>{window.location.hash="#/home"},1e3)}catch(e){this.showError(e.message)}finally{this.isSubmitting=!1,this.setLoadingState(!1)}}}async validateFormData(t){if(!t.description||t.description.length<5)throw new Error("Deskripsi harus minimal 5 karakter");if(!t.photo)throw new Error("Silakan tambahkan foto");if(t.photo.size>1e6)throw new Error("Ukuran file terlalu besar. Maksimal 1MB.")}getFormData(){var r,a,o;const t=(r=document.getElementById("description"))==null?void 0:r.value,e=(a=document.getElementById("lat"))==null?void 0:a.value,i=(o=document.getElementById("lng"))==null?void 0:o.value;return{description:t,photo:this.photoFile,location:e&&i?{lat:parseFloat(e),lng:parseFloat(i)}:null}}async startCamera(){try{this.stopCamera();const t=document.getElementById("cameraFeed"),e=document.getElementById("captureBtn"),i=document.getElementById("photoInput");i&&(i.value="");const r=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1});this.cameraStream=r,t&&(t.srcObject=r,t.style.display="block"),e&&(e.style.display="inline-block")}catch(t){console.error("Camera error:",t),this.showError("Tidak dapat mengakses kamera: "+t.message)}}stopCamera(){if(!this.cameraStream)return;this.cameraStream.getTracks().forEach(i=>i.stop());const t=document.getElementById("cameraFeed"),e=document.getElementById("captureBtn");t&&(t.srcObject=null,t.style.display="none"),e&&(e.style.display="none"),this.cameraStream=null}capturePhoto(){const t=document.getElementById("cameraFeed"),e=document.getElementById("photoPreview"),i=document.getElementById("photoInput");if(!t||!e)return;const r=document.createElement("canvas");r.width=t.videoWidth,r.height=t.videoHeight,r.getContext("2d").drawImage(t,0,0),r.toBlob(a=>{if(this.photoFile=new File([a],"photo.jpg",{type:"image/jpeg"}),e.src=URL.createObjectURL(this.photoFile),e.style.display="block",i){const o=new DataTransfer;o.items.add(this.photoFile),i.files=o.files}this.stopCamera()},"image/jpeg",.9)}handleFileUpload(t){var r;this.stopCamera();const e=(r=t.target.files)==null?void 0:r[0];if(!e)return;if(!e.type.match("image.*")){this.showError("Hanya file gambar yang diperbolehkan"),t.target.value="";return}if(e.size>1e6){this.showError("Ukuran file terlalu besar. Maksimal 1MB."),t.target.value="";return}this.photoFile=e;const i=document.getElementById("photoPreview");i&&(i.src=URL.createObjectURL(e),i.style.display="block")}async handleGetLocation(){try{const t=await X(),e=t.coords.latitude,i=t.coords.longitude;this.updateLocationFields(e,i),this.updateMapMarker(e,i)}catch(t){this.showError("Gagal mendapatkan lokasi: "+t.message)}}setupMapClickHandler(){this.map&&this.map.on("click",t=>{const e=t.latlng.lat,i=t.latlng.lng;this.updateLocationFields(e,i),this.updateMapMarker(e,i)})}updateLocationFields(t,e){const i=document.getElementById("lat"),r=document.getElementById("lng"),a=document.getElementById("coordinatesText"),o=document.getElementById("coordinatesInfo");i&&(i.value=t),r&&(r.value=e),a&&(a.textContent=`${t.toFixed(6)}, ${e.toFixed(6)}`),o&&(o.style.display="block")}updateMapMarker(t,e){this.map&&(this.map.eachLayer(i=>{i instanceof L.Marker&&this.map.removeLayer(i)}),L.marker([t,e]).addTo(this.map).bindPopup(`
        <b>Lokasi yang dipilih</b><br>
        Lat: ${t.toFixed(6)}<br>
        Lng: ${e.toFixed(6)}
      `).openPopup())}setLoadingState(t){const e=document.getElementById("submitBtn");e&&(e.disabled=t,e.innerHTML=t?'<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Memproses...':"Kirim Curhat")}showSuccess(t){this.showAlert(t,"success")}showError(t){this.showAlert(t,"danger")}showAlert(t,e){this.clearAlerts();const i=document.createElement("div");i.className=`alert alert-${e}`,i.setAttribute("role","alert"),i.innerHTML=`
      <span class="fas ${e==="success"?"fa-check-circle":"fa-exclamation-circle"}" 
            aria-hidden="true"></span>
      <span>${t}</span>
    `;const r=document.getElementById("storyForm");r&&r.parentNode.insertBefore(i,r),setTimeout(()=>{i.classList.add("fade-out"),setTimeout(()=>i.remove(),300)},e==="success"?3e3:5e3)}clearAlerts(){document.querySelectorAll(".alert").forEach(e=>e.remove())}focusFirstField(){const t=document.getElementById("description");t&&t.focus()}getDescriptionField(){return`
      <div class="form-group">
        <label for="description" id="descriptionLabel">Isi Curhat:</label>
        <textarea 
          id="description" 
          name="description" 
          required 
          aria-required="true"
          aria-labelledby="descriptionLabel"
          placeholder="Apa yang ingin kamu curhatkan?"
          aria-describedby="descriptionHelp"
        ></textarea>
        <small id="descriptionHelp" class="help-text">Tuliskan curhatan Anda dengan jelas</small>
      </div>
    `}getPhotoField(){return`
      <div class="form-group">
        <label id="photoLabel">Ambil Foto:</label>
        <div id="photoOptions" class="photo-options" role="group" aria-labelledby="photoLabel">
          <button 
            type="button" 
            id="cameraBtn" 
            class="btn-secondary"
            aria-label="Gunakan kamera untuk mengambil foto"
            aria-expanded="false"
            aria-controls="cameraFeed captureBtn"
          >
            <i class="fas fa-camera" aria-hidden="true"></i> Gunakan Kamera
          </button>
          <span class="or-text" aria-hidden="true">atau</span>
          <button 
            type="button" 
            id="uploadBtn" 
            class="btn-secondary"
            aria-label="Unggah foto dari perangkat"
          >
            <i class="fas fa-upload" aria-hidden="true"></i> Unggah File
          </button>
        </div>
        <input 
          type="file" 
          id="photoInput" 
          name="photo" 
          accept="image/*" 
          style="display:none;"
          aria-labelledby="photoLabel"
          aria-describedby="fileInfo"
        >
        <div class="photo-preview-container">
          <video 
            id="cameraFeed" 
            autoplay 
            style="display:none;"
            aria-label="Pratinjau kamera"
            aria-live="polite"
          ></video>
          <button 
            type="button" 
            id="captureBtn" 
            class="btn-secondary" 
            style="display:none;"
            aria-label="Ambil foto dari kamera"
          >
            <i class="fas fa-camera" aria-hidden="true"></i> Ambil Foto
          </button>
          <img 
            id="photoPreview" 
            src="" 
            alt="Pratinjau foto yang akan diunggah" 
            style="display:none;"
            aria-live="polite"
          >
        </div>
        <p id="fileInfo" class="file-info">Maksimal ukuran file 1MB</p>
      </div>
    `}getLocationField(){return`
      <div class="form-group">
        <label id="locationLabel">Lokasi:</label>
        <button 
          type="button" 
          id="getLocationBtn" 
          class="btn-secondary"
          aria-label="Gunakan lokasi saat ini"
          aria-describedby="locationHelp"
        >
          <i class="fas fa-location-arrow" aria-hidden="true"></i> Gunakan Lokasi Sekarang
        </button>
        <small id="locationHelp" class="help-text">Izinkan akses lokasi saat diminta</small>
        <div 
          id="map" 
          style="height: 300px;"
          role="application"
          aria-label="Peta untuk memilih lokasi"
          tabindex="0"
        ></div>
        <input type="hidden" id="lat" name="lat" aria-hidden="true">
        <input type="hidden" id="lng" name="lng" aria-hidden="true">
        <div id="coordinatesInfo" style="margin-top: 10px; display: none;" aria-live="polite">
          <p>Koordinat: <span id="coordinatesText"></span></p>
        </div>
      </div>
    `}getNotificationConsent(t){return!t||!("Notification"in window)?"":`
      <div class="form-group" id="notificationConsent">
        <label for="enableNotifications">
          <input 
            type="checkbox" 
            id="enableNotifications"
            aria-describedby="notificationHelp"
          > Aktifkan notifikasi
        </label>
        <small id="notificationHelp" class="help-text">Anda akan menerima notifikasi ketika ada balasan</small>
      </div>
    `}cleanup(){this.stopCamera(),this.map&&(this.map.off(),this.map.remove(),this.map=null);const t=document.getElementById("photoPreview");t!=null&&t.src&&URL.revokeObjectURL(t.src);const e=document.getElementById("storyForm");e&&e.removeEventListener("submit",this.handleSubmit)}}class ut extends v{async render(t){try{let e=await this.prepareLocationInfo(t);this.main.innerHTML=this.createStoryTemplate(t,e),this.hasValidCoordinates(t)&&this.initializeMap(t)}catch(e){console.error("Error rendering detail story:",e),this.showErrorView()}}async prepareLocationInfo(t){if(!this.hasValidCoordinates(t))return{display:"Lokasi tidak diketahui",coordinates:null};try{return{display:await tt(t.lat,t.lon)||this.formatCoordinates(t.lat,t.lon),coordinates:this.formatCoordinates(t.lat,t.lon)}}catch(e){return console.error("Error getting location:",e),{display:this.formatCoordinates(t.lat,t.lon),coordinates:this.formatCoordinates(t.lat,t.lon)}}}hasValidCoordinates(t){return t.lat!==void 0&&t.lon!==void 0&&!isNaN(parseFloat(t.lat))&&!isNaN(parseFloat(t.lon))&&Math.abs(t.lat)<=90&&Math.abs(t.lon)<=180}formatCoordinates(t,e){return`${t.toFixed(6)}, ${e.toFixed(6)}`}createStoryTemplate(t,e){return`
      <section class="story-detail">
        <article class="story-card">
          
          <img src="${t.photoUrl}" onerror="this.src='../public/images/fallback.jpg'" class="story-image" alt="Foto curhat dari ${t.name}" />
          <div class="story-content">
            <h3>${t.name}</h3>
            <p class="story-date">${new Date(t.createdAt).toLocaleDateString()}</p>
            <p class="story-text">${t.description}</p>
            <div class="story-meta">
              <span><i class="fas fa-map-marker-alt"></i> ${e.display}</span>
              ${e.coordinates?`<span class="coordinates">
                  <i class="fas fa-globe"></i> ${e.coordinates}
                </span>`:""}
            </div>
          </div>
        </article>
        ${this.hasValidCoordinates(t)?'<div id="map" style="height: 400px;"></div>':""}
        <a href="#/home" class="btn-primary">Kembali ke Beranda</a>
      </section>
    `}initializeMap(t){try{const e=L.map("map").setView([t.lat,t.lon],15);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(e),L.marker([t.lat,t.lon]).addTo(e).bindPopup(`
          <b>${t.name}</b><br>
          ${t.description.substring(0,100)}...
        `).openPopup()}catch(e){console.error("Gagal memuat peta:",e)}}showErrorView(){this.main.innerHTML=`
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Gagal memuat detail cerita. Silakan coba lagi.</p>
        <a href="#/home" class="btn-primary">Kembali ke Beranda</a>
      </div>
    `}}const f=new Z,B={"/home":async()=>{window.currentView&&window.currentView.stopCamera&&window.currentView.stopCamera();const s=new Q,t=new nt;await new st(t,s,f).init(),window.currentView=t},"/login":()=>{const s=f,t=new ct,e=new $(s);document.querySelector("main").innerHTML="",e.initLogin(t),window.currentView=t},"/register":()=>{const s=f,t=new lt,e=new $(s);document.querySelector("main").innerHTML="",e.initRegister(t),window.currentView=t},"/add-story":async s=>{const t=new N,e=new dt;await new H(t,s).initAddStory(e),window.currentView=e},"/detail-story":async s=>{const e=new URLSearchParams(window.location.search).get("id");if(!e){document.querySelector("main").innerHTML='<p class="error">Curhat tidak ditemukan.</p>';return}const i=new N,r=new ut;await new H(i).initDetailStory(r,e),window.currentView=r}},A=async()=>{const s=document.querySelector("main"),t=window.location.hash.slice(1)||"/home",e=["/home","/add-story","/detail-story"],i=["/login","/register"],r=e.includes(t),a=i.includes(t),o=f.isLoggedIn();if(r&&!o){window.location.hash="#/login";return}if(a&&o){window.location.hash="#/home";return}if(typeof B[t]!="function"){s.innerHTML=`
      <section class="not-found">
        <h1>404 - Halaman tidak ditemukan</h1>
        <p>Maaf, halaman yang kamu cari tidak tersedia.</p>
        <a href="#/home">⬅️ Kembali ke Beranda</a>
      </section>
    `;return}if(!document.startViewTransition){s.innerHTML="",await B[t](f);return}const n=document.startViewTransition(async()=>{s.innerHTML="",await B[t](f)});try{await n.finished}catch(p){console.error("View transition failed:",p)}};window.addEventListener("auth-change",A);window.addEventListener("hashchange",A);window.addEventListener("load",A);
