const API_BASE_URL = 'https://story-api.dicoding.dev/v1';
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export class NotificationApi {
  constructor() {
    this.VAPID_PUBLIC_KEY = VAPID_PUBLIC_KEY;
  }

  /**
   * Subscribe to push notifications
   * @param {PushSubscription} subscription 
   * @returns {Promise<Object>}
   */
   async subscribe(subscription) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }

    const body = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    };

    const response = await fetch(`${this.baseUrl}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.message || 'Gagal subscribe push notification');
    }

    return result.data;
  }

  /**
   * Unsubscribe from push notifications
   * @param {string} endpoint 
   * @returns {Promise<Object>}
   */
  async unsubscribe(endpoint) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ endpoint })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to unsubscribe');
      }

      return data;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      throw error;
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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