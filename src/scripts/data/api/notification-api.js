// src/scripts/data/api/notification-api.js
const API_BASE_URL = 'https://story-api.dicoding.dev/v1'; // Replace with your actual API base URL

export class NotificationApi {
  constructor() {
    this.API_BASE_URL = 'https://story-api.dicoding.dev/v1';
  }
  /**
   * Subscribe to push notifications
   * @param {PushSubscription} subscription - The PushSubscription object
   * @returns {Promise<Object>} - Response from the server
   */
  async subscribe(subscription) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User authentication token not found');
      }

      // Verify subscription is valid
      if (!subscription || !subscription.endpoint) {
        throw new Error('Invalid push subscription');
      }

      const response = await fetch(`${this.API_BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.toJSON().keys.p256dh,
            auth: subscription.toJSON().keys.auth,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to subscribe to notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Notification subscription error:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   * @returns {Promise<Object>} - Response from the server
   */
  async unsubscribe() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        return { success: true, message: 'No active subscription' };
      }

      // Unsubscribe from browser push service
      await subscription.unsubscribe();

      // Notify server about unsubscription
      const response = await fetch(`${API_BASE_URL}/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unsubscribe from notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Notification unsubscription error:', error);
      throw error;
    }
  }

  /**
   * Get user's notification preferences
   * @returns {Promise<Object>} - User's notification settings
   */
  async getPreferences() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get notification preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Get preferences error:', error);
      throw error;
    }
  }

  /**
   * Update user's notification preferences
   * @param {Object} preferences - New notification preferences
   * @returns {Promise<Object>} - Updated preferences
   */
  async updatePreferences(preferences) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update notification preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }

  /**
   * Get user's notification history
   * @param {number} limit - Number of notifications to fetch
   * @returns {Promise<Array>} - List of notifications
   */
  async getHistory(limit = 10) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/notifications/history?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get notification history');
      }

      return await response.json();
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }
}

// Default export for backward compatibility
export default NotificationApi;