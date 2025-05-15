import { 
  subscribeToNotifications, 
  unsubscribeFromNotifications, 
  requestNotificationPermission, 
  createPushSubscription 
} from '../api/notification-api.js';

export class NotificationModel {
  async subscribe(subscription) {
    return await subscribeToNotifications(subscription);
  }

  async unsubscribe(endpoint) {
    return await unsubscribeFromNotifications(endpoint);
  }

  async requestPermission() {
    return await requestNotificationPermission();
  }

  async createSubscription() {
    return await createPushSubscription();
  }
}