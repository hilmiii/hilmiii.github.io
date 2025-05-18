import { registerSW } from 'virtual:pwa-register';

// const authModel = new AuthModel();
// const storyModel = new StoryModel();
// const notificationApi = new NotificationApi();
// const storyPresenter = new StoryPresenter(storyModel, authModel, notificationApi);
// const addStoryView = new AddStoryView(storyPresenter);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

const initApp = async () => {
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

export { initApp };
