import NotificationApi from '../scripts/data/api/notification-api.js';
import { storyDB } from '../scripts/utils/database.js';

// const notificationApi = new NotificationApi(); // ✅ Instance global

  export class AuthPresenter {
  constructor(model) {
    this.model = model;
    this.vapidPublicKey = 'BFYa10SRrAlf_ZBtqrbHtfyxfSxpRqniHz_iiNmKiYuY1A5o-2l6cJ2CWh-adWIY0gOKO_iZPaneCfBbEPAuPcc';
    this.notificationApi = new NotificationApi();
  }

  initLogin(view) {
    this.view = view;
    this.view.render();
    this.view.setSubmitHandler(this.handleLogin.bind(this));
    this.view.focusEmailField();
  }

  initRegister(view) {
    this.view = view;
    this.view.render();
    this.view.setSubmitHandler(this.handleRegister.bind(this));
    this.view.focusNameField();
  }

  async checkNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async handleRegister(name, email, password) {
    try {
      await this.model.register(name, email, password);
      this.view.showSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 2000);
    } catch (error) {
      this.view.showError(`Registrasi gagal: ${error.message}`);
      throw error;
    }
  }

async handleLogin(email, password) {
  try {
    const result = await this.model.login(email, password); // ✅ dapatkan token
    localStorage.setItem('token', result.token);             // ✅ simpan token
    this.view.showSuccess('Login berhasil!');
    
    await storyDB.openDB();
    
    const hasPermission = await this.checkNotificationPermission();
    if (hasPermission) {
      try {
        await this.subscribeToPushNotifications(); // token sudah tersimpan
      } catch (err) {
        console.error('Gagal subscribe push:', err);
      }
    }

    window.location.hash = '#/home';
  } catch (error) {
    this.view.showError(`Login gagal: ${error.message}`);
  }
}


  async subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    // Verify token exists before proceeding
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User authentication token not found');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
        });
      }

      // Send subscription to server
      await this.notificationApi.subscribe(subscription);
    } catch (error) {
      console.error('Push subscription error:', error);
      throw error;
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
