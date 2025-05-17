import { NotificationModel } from '../scripts/data/models/notification-model.js';
import { VAPID_PUBLIC_KEY } from '../scripts/utils/config.js';

const model = new NotificationModel();

export const subscribeToPushNotifications = async () => {
  try {
    // 1. Check browser support
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers not supported');
      return { success: false, message: 'Browser tidak mendukung service worker' };
    }

    if (!('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return { success: false, message: 'Browser tidak mendukung push notifications' };
    }

    // 2. Request notification permission
    let permission = Notification.permission;
    if (permission === 'default') {
      console.log('Requesting notification permission...');
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return { success: false, message: 'Izin notifikasi ditolak' };
    }

    // 3. Register service worker
    console.log('Registering service worker...');
    const reg = await navigator.serviceWorker.register('/sw.js')
      .catch(err => {
        console.error('Service worker registration failed:', err);
        throw new Error('Gagal mendaftarkan service worker');
      });

    // 4. Check existing subscription
    let subscription = await reg.pushManager.getSubscription();
    
    if (subscription) {
      console.log('Found existing push subscription');
      return { success: true, message: 'Sudah berlangganan notifikasi' };
    }

    // 5. Create new subscription
    console.log('Creating new push subscription...');
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    }).catch(err => {
      console.error('Push subscription failed:', err);
      throw new Error('Gagal membuat langganan push');
    });

    // 6. Prepare subscription data
    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey('auth'))
      }
    };

    console.log('Subscription data:', subscriptionData);

    // 7. Send to server
    const result = await model.subscribeUserToPush(subscriptionData);
    console.log('Server subscription result:', result);

    return { 
      success: true, 
      message: 'Berhasil berlangganan notifikasi',
      data: result 
    };

  } catch (error) {
    console.error('Error in subscribeToPushNotifications:', error);
    return { 
      success: false, 
      message: error.message || 'Gagal berlangganan notifikasi'
    };
  }
};

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}

// Existing function (keep this)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return new Uint8Array([...raw].map(c => c.charCodeAt(0)));
}

// Additional debug functions
export const checkPushSupport = () => {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    permission: Notification.permission
  };
};

export const getCurrentSubscription = async () => {
  const reg = await navigator.serviceWorker.ready;
  return await reg.pushManager.getSubscription();
};