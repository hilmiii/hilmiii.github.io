(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const q="modulepreload",_=function(s){return"/"+s},M={},x=function(e,t,r){let i=Promise.resolve();if(t&&t.length>0){let o=function(l){return Promise.all(l.map(u=>Promise.resolve(u).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),p=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));i=o(t.map(l=>{if(l=_(l),l in M)return;M[l]=!0;const u=l.endsWith(".css"),c=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":q,u||(d.as="script"),d.crossOrigin="",d.href=l,p&&d.setAttribute("nonce",p),document.head.appendChild(d),u)return new Promise((k,P)=>{d.addEventListener("load",k),d.addEventListener("error",()=>P(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return i.then(o=>{for(const n of o||[])n.status==="rejected"&&a(n.reason);return e().catch(a)})};function V(s={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:r,onRegistered:i,onRegisteredSW:a,onRegisterError:o}=s;let n,p;const l=async(c=!0)=>{await p};async function u(){if("serviceWorker"in navigator){if(n=await x(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-B9K5rw8f.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/sw.js",{scope:"/",type:"classic"})).catch(c=>{o==null||o(c)}),!n)return;n.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),n.addEventListener("installed",c=>{c.isUpdate||r==null||r()}),n.register({immediate:e}).then(c=>{a?a("/sw.js",c):i==null||i(c)}).catch(c=>{o==null||o(c)})}}return p=u(),l}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")});const C=async()=>{try{V({onNeedRefresh(){confirm("Versi baru tersedia. Muat ulang?")&&window.location.reload()},onOfflineReady(){console.log("App siap offline")}})}catch(e){console.warn("PWA features failed to initialize:",e)}console.log("Application initialized");const s=()=>{const e=document.getElementById("network-status");e&&(e.textContent=navigator.onLine?"Online":"Offline",e.className=navigator.onLine?"online":"offline")};window.addEventListener("online",s),window.addEventListener("offline",s),s()};document.readyState==="complete"||document.readyState==="interactive"?setTimeout(C,1):document.addEventListener("DOMContentLoaded",C);const w="https://story-api.dicoding.dev/v1",I="serloktakparani_auth",z=async(s,e,t)=>{const r=await fetch(`${w}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s,email:e,password:t})}),i=await r.json();if(!r.ok)throw new Error(i.message||"Registration failed");return i},R=async(s,e)=>{const t=await fetch(`${w}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,password:e})}),r=await t.json();if(!t.ok)throw new Error(r.message||"Login failed");return localStorage.setItem(I,JSON.stringify({token:r.loginResult.token,userId:r.loginResult.userId,name:r.loginResult.name})),r},D=()=>JSON.parse(localStorage.getItem(I)),S=()=>{const s=D();return s==null?void 0:s.token},G=()=>!!S(),K=()=>{localStorage.removeItem(I)},F=async(s,e={})=>{const t=S();if(!t&&!s.includes("/guest"))throw new Error("Authentication required");const r={...e.headers,...t&&{Authorization:`Bearer ${t}`}},i=await fetch(s,{...e,headers:r});if(i.status===401)throw logout(),window.location.hash="#/login",new Error("Session expired. Please login again.");return i},j=async(s=1,e=10,t=!1)=>{const r=new URLSearchParams({page:s,size:e,location:t?"1":"0"}),i=await F(`${w}/stories?${r}`),a=await i.json();if(!i.ok)throw new Error(a.message||"Failed to fetch stories");return a.listStory},W=async s=>{const e=await F(`${w}/stories/${s}`),t=await e.json();if(!e.ok)throw new Error(t.message||"Failed to fetch story");return t.story},J=async(s,e,t,r)=>{console.log("Adding story with:",{description:s,photo:e,lat:t,lon:r});const i=new FormData;i.append("description",s),i.append("photo",e),t!==void 0&&r!==void 0&&(i.append("lat",t),i.append("lon",r)),console.log("FormData entries:");for(let[a,o]of i.entries())console.log(a,o);try{const a=await F(`${w}/stories`,{method:"POST",body:i}),o=await a.json();if(console.log("API response:",o),!a.ok)throw new Error(o.message||"Failed to add story");return o}catch(a){throw console.error("API call failed:",a),a}},Y=async(s,e,t,r)=>{const i=new FormData;i.append("description",s),i.append("photo",e),t!==void 0&&r!==void 0&&(i.append("lat",t),i.append("lon",r));const a=await fetch(`${w}/stories/guest`,{method:"POST",body:i}),o=await a.json();if(!a.ok)throw console.error("Error details:",o),new Error(o.message||"Failed to add guest story");return o};class Q{async getStories(e=1,t=10,r=!1){return await j(e,t,r)}}class Z{getToken(){return S()}async register(e,t,r){return await z(e,t,r)}async login(e,t){return await R(e,t)}getAuthData(){return D()}getAuthToken(){return S()}isLoggedIn(){return G()&&!!this.getToken()}logout(){K(),window.dispatchEvent(new Event("auth-change"))}}class ${constructor(){this.baseUrl="https://story-api.dicoding.dev/v1"}async addStory(e,t,r,i){const a=new FormData;a.append("description",e),a.append("photo",t),a.append("lat",r),a.append("lon",i);const o=await fetch(`${this.baseUrl}/stories`,{method:"POST",headers:{Authorization:`Bearer ${this.getAuthToken()}`},body:a});if(!o.ok)throw new Error("Failed to add story");return await o.json()}async getStories(e=1,t=10,r=!1){return await j(e,t,r)}async getStoryById(e){return await W(e)}async addStory(e,t,r,i){return await J(e,t,r,i)}async addGuestStory(e,t,r,i){return await Y(e,t,r,i)}}let y=null;const E=s=>(y&&y.remove(),y=L.map(s).setView([-2.5489,118.0149],5),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(y),y),X=()=>new Promise((s,e)=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(s,e):e(new Error("Geolocation tidak didukung oleh browser ini."))}),ee=async(s,e)=>{try{if(!O(s,e))throw new Error("Koordinat tidak valid");const t=new AbortController,r=setTimeout(()=>t.abort(),5e3),i=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${s}&lon=${e}&zoom=10&addressdetails=1`,{headers:{"User-Agent":"YourAppName/1.0 (your@email.com)"},signal:t.signal});if(clearTimeout(r),!i.ok)throw new Error(`HTTP error! status: ${i.status}`);const a=await i.json();return te(a)}catch(t){throw console.error("Error in getLocationName:",t),t}};function O(s,e){return s!==void 0&&e!==void 0&&!isNaN(s)&&!isNaN(e)&&s>=-90&&s<=90&&e>=-180&&e<=180}function te(s){if(!s.address)return s.display_name||null;const{address:e}=s,t=[e.road,e.village,e.town,e.city,e.state,e.country].filter(Boolean);return t.length>0?t.join(", "):s.display_name}const T=(s,e)=>{e.forEach(t=>{O(t.lat,t.lon)&&L.marker([t.lat,t.lon]).addTo(s).bindPopup(`<b>${t.name}</b><br>${t.description.substring(0,50)}...`)})},re="StoryDB",ie=2,h="stories",g="pendingStories",m={async openDB(){return new Promise((s,e)=>{const t=indexedDB.open(re,ie);t.onupgradeneeded=r=>{const i=r.target.result;i.objectStoreNames.contains(h)||i.createObjectStore(h,{keyPath:"id"}).createIndex("createdAt","createdAt",{unique:!1}),i.objectStoreNames.contains(g)||i.createObjectStore(g,{keyPath:"id",autoIncrement:!0}).createIndex("status","status",{unique:!1})},t.onsuccess=r=>s(r.target.result),t.onerror=r=>e(r.target.error)})},async saveStory(s){const e=await this.openDB();return new Promise((t,r)=>{const o=e.transaction([h],"readwrite").objectStore(h).put(s);o.onsuccess=()=>t(),o.onerror=n=>r(n.target.error)})},async saveStories(s){const e=await this.openDB();return new Promise((t,r)=>{const i=e.transaction([h],"readwrite"),a=i.objectStore(h);s.forEach(o=>a.put(o)),i.oncomplete=()=>t(),i.onerror=o=>r(o.target.error)})},async getStory(s){const e=await this.openDB();return new Promise((t,r)=>{const o=e.transaction([h],"readonly").objectStore(h).get(s);o.onsuccess=()=>t(o.result),o.onerror=n=>r(n.target.error)})},async getAllStories(){const s=await this.openDB();return new Promise((e,t)=>{const a=s.transaction([h],"readonly").objectStore(h).getAll();a.onsuccess=()=>e(a.result||[]),a.onerror=o=>t(o.target.error)})},async clearStories(){const s=await this.openDB();return new Promise((e,t)=>{const a=s.transaction([h],"readwrite").objectStore(h).clear();a.onsuccess=()=>e(!0),a.onerror=()=>t("Gagal menghapus semua data")})},async savePendingStory(s){const e=await this.openDB();return new Promise((t,r)=>{const o=e.transaction([g],"readwrite").objectStore(g).add({...s,status:"pending",createdAt:new Date().toISOString()});o.onsuccess=()=>t(o.result),o.onerror=n=>r(n.target.error)})},async getPendingStories(){const s=await this.openDB();return new Promise((e,t)=>{const a=s.transaction([g],"readonly").objectStore(g).getAll();a.onsuccess=()=>e(a.result||[]),a.onerror=o=>t(o.target.error)})},async deletePendingStory(s){const e=await this.openDB();return new Promise((t,r)=>{const o=e.transaction([g],"readwrite").objectStore(g).delete(s);o.onsuccess=()=>t(),o.onerror=n=>r(n.target.error)})}},ae=Object.freeze(Object.defineProperty({__proto__:null,storyDB:m},Symbol.toStringTag,{value:"Module"}));class se{constructor(e,t,r){this.view=e,this.model=t,this.authModel=r||{isLoggedIn:()=>!1}}async init(){try{this.view.showLoading();const e=await this.model.getStories(1,10,!0);await m.saveStories(e),this.view.render(e);const t=E("map");T(t,e),this.view.hideLoading()}catch(e){console.warn("Gagal fetch dari API, coba ambil dari IndexedDB:",e);try{const t=await m.getAllStories();if(t.length===0)throw new Error("Tidak ada data offline yang tersedia.");this.view.render(t);const r=E("map");T(r,t)}catch(t){this.view.showError(t.message||"Gagal memuat data offline.",!this.authModel.isLoggedIn())}finally{this.view.hideLoading()}}}}const b="https://story-api.dicoding.dev/v1",oe="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";class U{constructor(){this.VAPID_PUBLIC_KEY=oe,this.baseUrl="https://story-api.dicoding.dev/v1"}async sendStoryNotification({subscription:e,description:t,userId:r}){const i=await fetch(`${this.baseUrl}/notifications`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.getAuthToken()}`},body:JSON.stringify({userId:r,description:t,endpoint:e.endpoint,keys:e.toJSON().keys})});if(!i.ok)throw new Error("Failed to send notification");return await i.json()}async subscribe(e,t){try{if(!e||!t)throw new Error("Subscription data or token is missing");const r={p256dh:e.getKey("p256dh")?this.arrayBufferToBase64(e.getKey("p256dh")):"",auth:e.getKey("auth")?this.arrayBufferToBase64(e.getKey("auth")):""},i=await fetch(`${b}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e.endpoint,keys:r})}),a=await i.json();if(!i.ok)throw console.error("Subscription failed:",a),new Error(a.message||"Failed to subscribe to notifications");return console.log("Subscription successful:",a),a}catch(r){throw console.error("Error in subscribe:",r),r}}arrayBufferToBase64(e){const t=new Uint8Array(e);return btoa(String.fromCharCode.apply(null,t))}async unsubscribe(e){try{const t=localStorage.getItem("token");if(!t)throw new Error("User not authenticated");const r=await fetch(`${b}/notifications/subscribe`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({endpoint:e})}),i=await r.json();if(!r.ok)throw new Error(i.message||"Failed to unsubscribe");return i}catch(t){throw console.error("Unsubscribe error:",t),t}}urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),r=(e+t).replace(/-/g,"+").replace(/_/g,"/"),i=atob(r),a=new Uint8Array(i.length);for(let o=0;o<i.length;++o)a[o]=i.charCodeAt(o);return a}async getPreferences(){try{const e=localStorage.getItem("token");if(!e)throw new Error("User not authenticated");const t=await fetch(`${b}/notifications/preferences`,{method:"GET",headers:{Authorization:`Bearer ${e}`}});if(!t.ok){const r=await t.json();throw new Error(r.message||"Failed to get notification preferences")}return await t.json()}catch(e){throw console.error("Get preferences error:",e),e}}async updatePreferences(e){try{const t=localStorage.getItem("token");if(!t)throw new Error("User not authenticated");const r=await fetch(`${b}/notifications/preferences`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(e)});if(!r.ok){const i=await r.json();throw new Error(i.message||"Failed to update notification preferences")}return await r.json()}catch(t){throw console.error("Update preferences error:",t),t}}async getHistory(e=10){try{const t=localStorage.getItem("token");if(!t)throw new Error("User not authenticated");const r=await fetch(`${b}/notifications/history?limit=${e}`,{method:"GET",headers:{Authorization:`Bearer ${t}`}});if(!r.ok){const i=await r.json();throw new Error(i.message||"Failed to get notification history")}return await r.json()}catch(t){throw console.error("Get history error:",t),t}}}class N{constructor(e){this.model=e,this.notificationApi=new U}initLogin(e){this.view=e,this.view.render(),this.view.setSubmitHandler(this.handleLogin.bind(this)),this.view.focusEmailField()}initRegister(e){this.view=e,this.view.render(),this.view.setSubmitHandler(this.handleRegister.bind(this)),this.view.focusNameField()}async checkNotificationPermission(){return"Notification"in window?await Notification.requestPermission()==="granted":!1}async handleRegister(e,t,r){try{await this.model.register(e,t,r),this.view.showSuccess("Registrasi berhasil! Silakan login."),setTimeout(()=>{window.location.hash="#/login"},2e3)}catch(i){throw this.view.showError(`Registrasi gagal: ${i.message}`),i}}async handleLogin(e,t){try{const r=await this.model.login(e,t);if(r&&r.token)localStorage.setItem("token",r.token);else throw new Error("Token tidak tersedia dari server.");this.view.showSuccess("Login berhasil!");try{await m.openDB()}catch(a){console.error("Gagal buka DB:",a)}if(await this.checkNotificationPermission())try{await this.subscribeToPushNotifications()}catch(a){console.error("Gagal subscribe push:",a)}window.location.hash="#/home"}catch(r){this.view.showError(`Login gagal: ${r.message}`)}}async subscribeToPushNotifications(){if(!("serviceWorker"in navigator&&"PushManager"in window)){console.warn("Push notifications not supported");return}const e=this.model.getAuthToken();if(!e)throw new Error("User authentication token not found");try{const t=await navigator.serviceWorker.ready;let r=await t.pushManager.getSubscription();r||(r=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(this.vapidPublicKey)})),await this.notificationApi.subscribe(r,e)}catch(t){throw console.error("Push subscription error:",t),t}}async unsubscribeFromPushNotifications(){if(!("serviceWorker"in navigator))return;const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();t&&(await this.notificationApi.unsubscribe(t.endpoint),await t.unsubscribe())}urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),r=(e+t).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(r),a=new Uint8Array(i.length);for(let o=0;o<i.length;++o)a[o]=i.charCodeAt(o);return a}}class H{constructor(e,t){this.model=e,this.authModel=t,this.notificationApi=new U,this.vapidPublicKey="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",this.initializePushNotifications()}async registerPushNotifications(){if(!("serviceWorker"in navigator&&"PushManager"in window)){console.error("Push API not supported");return}try{const e=await navigator.serviceWorker.ready;let t=await e.pushManager.getSubscription();if(!t){const a=this.urlBase64ToUint8Array(this.vapidPublicKey);t=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:a})}const r=this.authModel.getToken();if(!r)throw new Error("User not authenticated");console.log("Push Subscription:",JSON.stringify(t));const i=await this.notificationApi.subscribe(t,r);console.log("Subscription response:",i)}catch(e){throw console.error("Push registration failed:",e),e}}async createPushSubscription(e){return await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(this.vapidPublicKey)})}async initializePushNotifications(){if(!("serviceWorker"in navigator&&"PushManager"in window)){console.warn("Push notifications not supported");return}try{await navigator.serviceWorker.ready,console.log("Push notifications initialized")}catch(e){console.error("Push initialization failed:",e)}}async initAddStory(e){this.view=e,await this.view.init(this.handleFormSubmit.bind(this))}async initDetailStory(e,t){this.view=e;try{const r=await this.getStoryWithFallback(t);this.view.render(r),this.initStoryMap([r])}catch(r){this.view.showError(r.message)}}async initStoryList(e){this.view=e,await this.loadStories()}async getStoryWithFallback(e){try{const t=await this.model.getStoryById(e);return await m.saveStory(t),t}catch{console.log("Network error, trying IndexedDB...");const r=await m.getStory(e);if(!r)throw new Error("Story not found in offline storage");return r}}async loadStories(){try{const e=await this.getStoriesWithFallback();this.view.renderStories(e),this.view.initMap&&this.initStoryMap(e)}catch(e){this.view.showError("Failed to load stories: "+e.message)}}async getStoriesWithFallback(){try{const e=await this.model.getAllStories();return await m.saveStories(e),e}catch{console.log("Network error, loading offline stories...");const t=await m.getAllStories();return this.view.showOfflineWarning(),t}}initStoryMap(e){const t=this.view.initMap?this.view.initMap():E("map");T(t,e)}async syncPendingStories(){try{const e=await m.getPendingStories(),t=[];for(const r of e)try{let i;this.authModel.isLoggedIn()?i=await this.model.addStory(r.description,r.photo,r.lat,r.lon):i=await this.model.addGuestStory(r.description,r.photo,r.lat,r.lon),await m.deletePendingStory(r.id),t.push(i)}catch(i){console.error("Failed to sync story:",r.id,i)}return t}catch(e){return console.error("Failed to sync pending stories:",e),[]}}async handleFormSubmit(e){try{if(!navigator.onLine)return await m.savePendingStory(e),this.view.showSuccess("Curhat disimpan secara offline dan akan dikirim ketika online"),{offline:!0};const t=await this.processFormSubmission(e);return this.authModel.isLoggedIn()&&await this.registerPushNotifications(),t}catch(t){if(t.message.includes("Failed to fetch"))return await m.savePendingStory(e),this.view.showSuccess("Curhat disimpan secara offline dan akan dikirim ketika online"),{offline:!0};throw t}}async processFormSubmission(e){var t,r,i,a;return this.authModel.isLoggedIn()?this.model.addStory(e.description,e.photo,(t=e.location)==null?void 0:t.lat,(r=e.location)==null?void 0:r.lng):this.model.addGuestStory(e.description,e.photo,(i=e.location)==null?void 0:i.lat,(a=e.location)==null?void 0:a.lng)}urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),r=(e+t).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(r);return new Uint8Array([...i].map(a=>a.charCodeAt(0)))}async testNotification(){(await navigator.serviceWorker.ready).showNotification("Test Notification",{body:"This is a test notification",icon:"/images/logo.png"})}}class v{constructor(){this.main=document.querySelector("main"),this.main.style.viewTransitionName="content"}async showLoading(){if(!document.startViewTransition){this.main.innerHTML=this.loadingTemplate();return}await document.startViewTransition(()=>{this.main.innerHTML=this.loadingTemplate()}).finished}loadingTemplate(){return`
      <div class="loading" aria-live="polite">
        <div class="loading-spinner"></div>
        <p>Memuat...</p>
      </div>
    `}async render(e){if(!document.startViewTransition){this.main.innerHTML=e;return}await document.startViewTransition(()=>{this.main.innerHTML=e}).finished}}class ne extends v{constructor(){super(),this.loadingElement=document.createElement("div"),this.loadingElement.className="loading",this.loadingElement.innerHTML="Memuat..."}showLoading(){this.main.appendChild(this.loadingElement)}hideLoading(){this.loadingElement.parentNode&&this.loadingElement.parentNode.removeChild(this.loadingElement)}render(e){this.main.innerHTML=`
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
    `,this.renderStories(e),this.bindClearOfflineButton()}renderStories(e){const t=this.main.querySelector(".stories-container");t&&(t.innerHTML="",e.forEach(r=>{const i=document.createElement("article");i.className="story-card",i.setAttribute("tabindex","0"),i.setAttribute("role","article"),i.innerHTML=this.getStoryHTML(r),t.appendChild(i)}))}getStoryHTML(e){return`
      <img src="${e.photoUrl}" alt="Foto ilustrasi cerita dari ${e.name||"Anonim"}" class="story-image">
      <div class="story-content">
        <h3>${e.name||"Anonim"}</h3>
        <p class="story-date">${new Date(e.createdAt).toLocaleDateString()}</p>
        <p class="story-text">${e.description}</p>
        <div class="story-meta">
          <span><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${e.locationName||"Bumi"}</span>
        </div>
      </div>
    `}showError(e,t=!1){this.main.innerHTML=`
      <div class="error">
        ${e}
        ${t?'<a href="#/login" class="btn-primary">Login untuk melihat curhat</a>':""}
      </div>
    `}bindClearOfflineButton(){const e=this.main.querySelector("#clear-offline-btn");e&&e.addEventListener("click",async()=>{if(confirm("Yakin ingin menghapus semua data offline?")){const{storyDB:r}=await x(async()=>{const{storyDB:i}=await Promise.resolve().then(()=>ae);return{storyDB:i}},void 0);await r.clearStories(),alert("Data offline berhasil dihapus."),location.reload()}})}}class ce extends v{constructor(){super(),this.submitButton=null,this.errorTimeout=null}render(){this.main.innerHTML=`
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
    `}initializeForm(){this.submitButton=document.getElementById("submitButton");const e=document.getElementById("loginForm"),t=e.querySelector("#password"),r=e.querySelector("#togglePassword");r==null||r.addEventListener("click",()=>{const i=t.type==="password";t.type=i?"text":"password",r.innerHTML=i?'<i class="fas fa-eye-slash" aria-hidden="true"></i>':'<i class="fas fa-eye" aria-hidden="true"></i>',r.setAttribute("aria-label",i?"Sembunyikan password":"Tampilkan password")}),e.addEventListener("submit",this.handleSubmit.bind(this))}async handleSubmit(e){e.preventDefault();const t=e.target,r=t.email.value.trim(),i=t.password.value;if(this.clearError(),!r||!i){this.showError("Harap isi semua field");return}if(i.length<8){this.showError("Password harus minimal 8 karakter");return}this.setLoadingState(!0);try{await this.submitHandler(r,i),this.clearForm()}catch(a){this.showError(a.message||"Terjadi kesalahan saat login")}finally{this.setLoadingState(!1)}}setSubmitHandler(e){this.submitHandler=async(t,r)=>{try{await e(t,r),this.showSuccess("Login berhasil!"),location.reload()}catch(i){throw i}}}setLoadingState(e){this.submitButton&&(e?(this.submitButton.disabled=!0,this.submitButton.innerHTML=`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Memproses...
      `):(this.submitButton.disabled=!1,this.submitButton.textContent="Masuk"))}showSuccess(e){this.clearError();const t=document.createElement("div");t.className="alert alert-success",t.setAttribute("role","alert"),t.innerHTML=`
      <span class="fas fa-check-circle" aria-hidden="true"></span>
      <span>${e}</span>
    `,document.querySelector(".auth-card").prepend(t),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),300)},3e3)}showError(e){this.clearError();const t=document.createElement("div");t.className="alert alert-danger",t.setAttribute("role","alert"),t.innerHTML=`
      <span class="fas fa-exclamation-circle" aria-hidden="true"></span>
      <span>${e}</span>
    `;const r=document.getElementById("loginForm");r.parentNode.insertBefore(t,r),this.errorTimeout=setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),300)},5e3)}clearError(){this.errorTimeout&&(clearTimeout(this.errorTimeout),this.errorTimeout=null);const e=document.querySelector(".alert-danger");e&&e.remove()}clearForm(){const e=document.getElementById("loginForm");e&&e.reset()}focusEmailField(){const e=document.getElementById("email");e&&(e.focus(),e.select())}cleanup(){this.clearError();const e=document.getElementById("loginForm");e&&e.removeEventListener("submit",this.handleSubmit)}}class le extends v{constructor(){super(),console.log("RegisterView initialized"),this.submitButton=null,this.passwordInput=null,this.confirmPasswordInput=null}getNameField(){return`
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
    `,this.submitButton=document.getElementById("submitButton"),this.passwordInput=document.getElementById("password"),this.confirmPasswordInput=document.getElementById("confirmPassword")}setSubmitHandler(e){var n,p;const t=document.getElementById("registerForm");if(!t){console.error("Register form not found");return}const r=t.querySelector("#name"),i=t.querySelector("#email"),a=t.querySelector("#togglePassword"),o=t.querySelector("#toggleConfirmPassword");if(!r||!i||!this.passwordInput||!this.confirmPasswordInput){console.error("Required form fields not found");return}a&&a.addEventListener("click",()=>{const l=this.passwordInput.getAttribute("type")==="password"?"text":"password";this.passwordInput.setAttribute("type",l),a.innerHTML=l==="password"?'<i class="fas fa-eye"></i>':'<i class="fas fa-eye-slash"></i>'}),o&&o.addEventListener("click",()=>{const l=this.confirmPasswordInput.getAttribute("type")==="password"?"text":"password";this.confirmPasswordInput.setAttribute("type",l),o.innerHTML=l==="password"?'<i class="fas fa-eye"></i>':'<i class="fas fa-eye-slash"></i>'}),(n=this.passwordInput)==null||n.addEventListener("input",()=>{this.updatePasswordStrength(),this.validatePasswordMatch()}),(p=this.confirmPasswordInput)==null||p.addEventListener("input",()=>{this.validatePasswordMatch()}),t.addEventListener("submit",async l=>{l.preventDefault();const u=r.value.trim(),c=i.value.trim(),d=this.passwordInput.value,k=this.confirmPasswordInput.value;if(!u||!c||!d||!k){this.showError("Harap isi semua field");return}if(u.length<3){this.showError("Nama harus minimal 3 karakter");return}if(d.length<8){this.showError("Password harus minimal 8 karakter");return}if(d!==k){this.showError("Password dan konfirmasi password tidak cocok");return}this.setLoadingState(!0);try{await e(u,c,d)}catch(P){this.setLoadingState(!1),this.showError(P.message)}})}updatePasswordStrength(){const e=this.passwordInput.value,t=document.querySelector(".strength-bar"),r=document.querySelector(".strength-feedback");if(!e){t.style.width="0%",t.style.backgroundColor="transparent",r.textContent="";return}let i=0;e.length>=8&&(i+=1),/[A-Z]/.test(e)&&(i+=1),/[0-9]/.test(e)&&(i+=1),/[^A-Za-z0-9]/.test(e)&&(i+=1);const a=i/4*100;t.style.width=`${a}%`;let o,n;switch(i){case 0:case 1:o="#dc3545",n="Lemah";break;case 2:o="#fd7e14",n="Sedang";break;case 3:o="#ffc107",n="Kuat";break;case 4:o="#28a745",n="Sangat Kuat";break;default:o="#dc3545",n=""}t.style.backgroundColor=o,r.textContent=n,r.style.color=o}validatePasswordMatch(){const e=this.passwordInput.value,t=this.confirmPasswordInput.value,r=document.getElementById("confirmPasswordError");e&&t&&e!==t?(r.style.display="block",this.confirmPasswordInput.classList.add("is-invalid")):(r.style.display="none",this.confirmPasswordInput.classList.remove("is-invalid"))}setLoadingState(e){this.submitButton&&(e?(this.submitButton.disabled=!0,this.submitButton.innerHTML=`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Memproses...
      `):(this.submitButton.disabled=!1,this.submitButton.textContent="Daftar"))}showSuccess(e){const t=document.createElement("div");t.className="alert alert-success",t.textContent=e,document.querySelector(".auth-card").prepend(t),setTimeout(()=>t.remove(),3e3)}showError(e){const t=document.createElement("div");t.className="alert alert-danger",t.textContent=e;const r=document.querySelector(".auth-card"),i=r.querySelector(".alert-danger");if(i)i.replaceWith(t);else{const a=document.getElementById("registerForm");r.insertBefore(t,a)}setTimeout(()=>t.remove(),5e3)}clearForm(){const e=document.getElementById("registerForm");e&&e.reset(),document.querySelector(".strength-bar").style.width="0%",document.querySelector(".strength-feedback").textContent=""}focusNameField(){const e=document.getElementById("name");e&&e.focus()}}class de extends v{constructor(){super(),this.cameraStream=null,this.map=null,this.photoFile=null,this.isSubmitting=!1,this.submitHandler=null,this.handleSubmit=this.handleSubmit.bind(this),this.startCamera=this.startCamera.bind(this),this.stopCamera=this.stopCamera.bind(this),this.capturePhoto=this.capturePhoto.bind(this),this.handleFileUpload=this.handleFileUpload.bind(this),this.handleGetLocation=this.handleGetLocation.bind(this),this.setupMapClickHandler=this.setupMapClickHandler.bind(this)}async init(e){try{this.submitHandler=e,this.renderTemplate(),this.initializeMap(),this.setupEventListeners(),this.setupAriaAttributes(),this.focusFirstField()}catch(t){console.error("Initialization failed:",t),this.showError("Failed to initialize form")}}renderTemplate(){this.main.innerHTML=`
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
    `}initializeMap(){this.map=E("map"),this.setupMapClickHandler()}setupEventListeners(){const e=document.getElementById("storyForm");if(!e)return;e.removeEventListener("submit",this.handleSubmit),e.addEventListener("submit",this.handleSubmit);const t=document.getElementById("cameraBtn"),r=document.getElementById("uploadBtn"),i=document.getElementById("captureBtn"),a=document.getElementById("photoInput"),o=document.getElementById("getLocationBtn");t&&t.addEventListener("click",this.startCamera),r&&r.addEventListener("click",()=>a.click()),i&&i.addEventListener("click",this.capturePhoto),a&&a.addEventListener("change",this.handleFileUpload),o&&o.addEventListener("click",this.handleGetLocation)}setupAriaAttributes(){const e=document.getElementById("storyForm");e&&e.setAttribute("aria-live","polite")}async handleSubmit(e){if(e.preventDefault(),!this.isSubmitting){this.isSubmitting=!0,this.setLoadingState(!0);try{const t=this.getFormData();await this.validateFormData(t),await this.submitHandler(t),this.showSuccess("Curhat berhasil dikirim!"),setTimeout(()=>{window.location.hash="#/home"},2e3)}catch(t){this.showError(t.message)}finally{this.isSubmitting=!1,this.setLoadingState(!1)}}}async validateFormData(e){if(!e.description||e.description.length<5)throw new Error("Deskripsi harus minimal 5 karakter");if(!e.photo)throw new Error("Silakan tambahkan foto");if(e.photo.size>1e6)throw new Error("Ukuran file terlalu besar. Maksimal 1MB.")}getFormData(){var i,a,o;const e=(i=document.getElementById("description"))==null?void 0:i.value,t=(a=document.getElementById("lat"))==null?void 0:a.value,r=(o=document.getElementById("lng"))==null?void 0:o.value;return{description:e,photo:this.photoFile,location:t&&r?{lat:parseFloat(t),lng:parseFloat(r)}:null}}async startCamera(){try{this.stopCamera();const e=document.getElementById("cameraFeed"),t=document.getElementById("captureBtn"),r=document.getElementById("photoInput");r&&(r.value="");const i=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1});this.cameraStream=i,e&&(e.srcObject=i,e.style.display="block"),t&&(t.style.display="inline-block")}catch(e){console.error("Camera error:",e),this.showError("Tidak dapat mengakses kamera: "+e.message)}}stopCamera(){if(!this.cameraStream)return;this.cameraStream.getTracks().forEach(r=>r.stop());const e=document.getElementById("cameraFeed"),t=document.getElementById("captureBtn");e&&(e.srcObject=null,e.style.display="none"),t&&(t.style.display="none"),this.cameraStream=null}capturePhoto(){const e=document.getElementById("cameraFeed"),t=document.getElementById("photoPreview"),r=document.getElementById("photoInput");if(!e||!t)return;const i=document.createElement("canvas");i.width=e.videoWidth,i.height=e.videoHeight,i.getContext("2d").drawImage(e,0,0),i.toBlob(a=>{if(this.photoFile=new File([a],"photo.jpg",{type:"image/jpeg"}),t.src=URL.createObjectURL(this.photoFile),t.style.display="block",r){const o=new DataTransfer;o.items.add(this.photoFile),r.files=o.files}this.stopCamera()},"image/jpeg",.9)}handleFileUpload(e){var i;this.stopCamera();const t=(i=e.target.files)==null?void 0:i[0];if(!t)return;if(!t.type.match("image.*")){this.showError("Hanya file gambar yang diperbolehkan"),e.target.value="";return}if(t.size>1e6){this.showError("Ukuran file terlalu besar. Maksimal 1MB."),e.target.value="";return}this.photoFile=t;const r=document.getElementById("photoPreview");r&&(r.src=URL.createObjectURL(t),r.style.display="block")}async handleGetLocation(){try{const e=await X(),t=e.coords.latitude,r=e.coords.longitude;this.updateLocationFields(t,r),this.updateMapMarker(t,r)}catch(e){this.showError("Gagal mendapatkan lokasi: "+e.message)}}setupMapClickHandler(){this.map&&this.map.on("click",e=>{const t=e.latlng.lat,r=e.latlng.lng;this.updateLocationFields(t,r),this.updateMapMarker(t,r)})}updateLocationFields(e,t){const r=document.getElementById("lat"),i=document.getElementById("lng"),a=document.getElementById("coordinatesText"),o=document.getElementById("coordinatesInfo");r&&(r.value=e),i&&(i.value=t),a&&(a.textContent=`${e.toFixed(6)}, ${t.toFixed(6)}`),o&&(o.style.display="block")}updateMapMarker(e,t){this.map&&(this.map.eachLayer(r=>{r instanceof L.Marker&&this.map.removeLayer(r)}),L.marker([e,t]).addTo(this.map).bindPopup(`
        <b>Lokasi yang dipilih</b><br>
        Lat: ${e.toFixed(6)}<br>
        Lng: ${t.toFixed(6)}
      `).openPopup())}setLoadingState(e){const t=document.getElementById("submitBtn");t&&(t.disabled=e,t.innerHTML=e?'<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Memproses...':"Kirim Curhat")}showSuccess(e){this.showAlert(e,"success")}showError(e){this.showAlert(e,"danger")}showAlert(e,t){this.clearAlerts();const r=document.createElement("div");r.className=`alert alert-${t}`,r.setAttribute("role","alert"),r.innerHTML=`
      <span class="fas ${t==="success"?"fa-check-circle":"fa-exclamation-circle"}" 
            aria-hidden="true"></span>
      <span>${e}</span>
    `;const i=document.getElementById("storyForm");i&&i.parentNode.insertBefore(r,i),setTimeout(()=>{r.classList.add("fade-out"),setTimeout(()=>r.remove(),300)},t==="success"?3e3:5e3)}clearAlerts(){document.querySelectorAll(".alert").forEach(t=>t.remove())}focusFirstField(){const e=document.getElementById("description");e&&e.focus()}getDescriptionField(){return`
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
    `}getNotificationConsent(e){return!e||!("Notification"in window)?"":`
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
    `}cleanup(){this.stopCamera(),this.map&&(this.map.off(),this.map.remove(),this.map=null);const e=document.getElementById("photoPreview");e!=null&&e.src&&URL.revokeObjectURL(e.src);const t=document.getElementById("storyForm");t&&t.removeEventListener("submit",this.handleSubmit)}}class ue extends v{async render(e){try{let t=await this.prepareLocationInfo(e);this.main.innerHTML=this.createStoryTemplate(e,t),this.hasValidCoordinates(e)&&this.initializeMap(e)}catch(t){console.error("Error rendering detail story:",t),this.showErrorView()}}async prepareLocationInfo(e){if(!this.hasValidCoordinates(e))return{display:"Lokasi tidak diketahui",coordinates:null};try{return{display:await ee(e.lat,e.lon)||this.formatCoordinates(e.lat,e.lon),coordinates:this.formatCoordinates(e.lat,e.lon)}}catch(t){return console.error("Error getting location:",t),{display:this.formatCoordinates(e.lat,e.lon),coordinates:this.formatCoordinates(e.lat,e.lon)}}}hasValidCoordinates(e){return e.lat!==void 0&&e.lon!==void 0&&!isNaN(parseFloat(e.lat))&&!isNaN(parseFloat(e.lon))&&Math.abs(e.lat)<=90&&Math.abs(e.lon)<=180}formatCoordinates(e,t){return`${e.toFixed(6)}, ${t.toFixed(6)}`}createStoryTemplate(e,t){return`
      <section class="story-detail">
        <article class="story-card">
          
          <img src="${e.photoUrl}" onerror="this.src='../public/images/fallback.jpg'" class="story-image" alt="Foto curhat dari ${e.name}" />
          <div class="story-content">
            <h3>${e.name}</h3>
            <p class="story-date">${new Date(e.createdAt).toLocaleDateString()}</p>
            <p class="story-text">${e.description}</p>
            <div class="story-meta">
              <span><i class="fas fa-map-marker-alt"></i> ${t.display}</span>
              ${t.coordinates?`<span class="coordinates">
                  <i class="fas fa-globe"></i> ${t.coordinates}
                </span>`:""}
            </div>
          </div>
        </article>
        ${this.hasValidCoordinates(e)?'<div id="map" style="height: 400px;"></div>':""}
        <a href="#/home" class="btn-primary">Kembali ke Beranda</a>
      </section>
    `}initializeMap(e){try{const t=L.map("map").setView([e.lat,e.lon],15);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(t),L.marker([e.lat,e.lon]).addTo(t).bindPopup(`
          <b>${e.name}</b><br>
          ${e.description.substring(0,100)}...
        `).openPopup()}catch(t){console.error("Gagal memuat peta:",t)}}showErrorView(){this.main.innerHTML=`
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Gagal memuat detail cerita. Silakan coba lagi.</p>
        <a href="#/home" class="btn-primary">Kembali ke Beranda</a>
      </div>
    `}}const f=new Z,B={"/home":async()=>{window.currentView&&window.currentView.stopCamera&&window.currentView.stopCamera();const s=new Q,e=new ne;await new se(e,s,f).init(),window.currentView=e},"/login":()=>{const s=f,e=new ce,t=new N(s);document.querySelector("main").innerHTML="",t.initLogin(e),window.currentView=e},"/register":()=>{const s=f,e=new le,t=new N(s);document.querySelector("main").innerHTML="",t.initRegister(e),window.currentView=e},"/add-story":async s=>{const e=new $,t=new de;await new H(e,s).initAddStory(t),window.currentView=t},"/detail-story":async s=>{const t=new URLSearchParams(window.location.search).get("id");if(!t){document.querySelector("main").innerHTML='<p class="error">Curhat tidak ditemukan.</p>';return}const r=new $,i=new ue;await new H(r).initDetailStory(i,t),window.currentView=i}},A=async()=>{const s=document.querySelector("main"),e=window.location.hash.slice(1)||"/home",t=["/home","/add-story","/detail-story"],r=["/login","/register"],i=t.includes(e),a=r.includes(e),o=f.isLoggedIn();if(i&&!o){window.location.hash="#/login";return}if(a&&o){window.location.hash="#/home";return}if(typeof B[e]!="function"){s.innerHTML=`
      <section class="not-found">
        <h1>404 - Halaman tidak ditemukan</h1>
        <p>Maaf, halaman yang kamu cari tidak tersedia.</p>
        <a href="#/home">⬅️ Kembali ke Beranda</a>
      </section>
    `;return}if(!document.startViewTransition){s.innerHTML="",await B[e](f);return}const n=document.startViewTransition(async()=>{s.innerHTML="",await B[e](f)});try{await n.finished}catch(p){console.error("View transition failed:",p)}};window.addEventListener("auth-change",A);window.addEventListener("hashchange",A);window.addEventListener("load",A);
