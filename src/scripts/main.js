// src/scripts/main.js

import { registerSW } from 'virtual:pwa-register';

/**
 * Application Main Entry Point
 * - Handles service worker registration
 * - Initializes core application functionality
 */

const initApp = async () => {
  // Daftarkan service worker jika produksi
  if (import.meta.env.PROD) {
    try {
      registerSW({
        onNeedRefresh() {
          if (confirm("Versi baru tersedia. Muat ulang?")) {
            window.location.reload();
          }
        },
        onOfflineReady() {
          console.log("App siap offline");
        },
      });
    } catch (error) {
      console.warn("PWA features failed to initialize:", error);
    }
  }

  console.log('Application initialized');

  // Update status jaringan
  const updateOnlineStatus = () => {
    const statusElement = document.getElementById('network-status');
    if (statusElement) {
      statusElement.textContent = navigator.onLine ? 'Online' : 'Offline';
      statusElement.className = navigator.onLine ? 'online' : 'offline';
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initApp, 1);
} else {
  document.addEventListener('DOMContentLoaded', initApp);
};

// Ekspor hanya fungsi yang valid
export { initApp };
