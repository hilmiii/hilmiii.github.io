import { NotificationApi } from '../scripts/data/api/notification-api.js';
import { storyDB } from '../scripts/utils/database.js';

// const notificationApi = new NotificationApi(); // ✅ Instance global

  export class AuthPresenter {
  constructor(model) {
    this.model = model;
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
      // 1. Authenticate user
      await this.model.login(email, password);
      
      // 2. Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        try {
          await this.subscribeToPushNotifications();
        } catch (error) {
          console.warn('Push subscription failed:', error);
          // Non-critical error - continue with login
        }
      }
      
      this.view.showSuccess('Login berhasil!');
      window.location.hash = '#/home';
    } catch (error) {
      this.view.showError(`Login gagal: ${error.message}`);
    }
  }

  async subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      throw new Error('Push notifications not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.notificationApi.urlBase64ToUint8Array(
          this.notificationApi.VAPID_PUBLIC_KEY
        )
      });
    }

    return this.notificationApi.subscribe(subscription);
  }

  async unsubscribeFromPushNotifications() {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await this.notificationApi.unsubscribe(subscription.endpoint);
      await subscription.unsubscribe();
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
