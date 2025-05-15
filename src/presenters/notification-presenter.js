import { NotificationModel } from '../scripts/data/models/notification-model.js';
import { VAPID_PUBLIC_KEY } from '../scripts/utils/config.js';

const model = new NotificationModel();

export const subscribeToPushNotifications = async () => {
  if (!('serviceWorker' in navigator)) return;
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
  }

  const reg = await navigator.serviceWorker.ready;

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const data = {
    endpoint: subscription.endpoint,
    keys: subscription.toJSON().keys,
  };

  await model.subscribeUserToPush(data);
};

// helper
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return new Uint8Array([...raw].map(c => c.charCodeAt(0)));
}
