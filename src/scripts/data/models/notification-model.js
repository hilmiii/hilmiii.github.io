import { subscribeToNotification } from '../api/notification-api.js';

export class NotificationModel {
  async subscribeUserToPush(subscription) {
    return await subscribeToNotification(subscription);
  }
}
