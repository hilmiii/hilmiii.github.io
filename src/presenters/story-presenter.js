import { initMap, showStoriesOnMap } from '../scripts/utils/map.js';
import { storyDB } from '../scripts/utils/database.js';
import { NotificationApi } from '../scripts/data/api/notification-api.js';

export class StoryPresenter {
  constructor(model, authModel) {
    this.model = model;
    this.authModel = authModel;
    this.notificationApi = new NotificationApi();
    this.vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
    this.initializePushNotifications();
  }

  async registerPushNotifications() {
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    console.error('Push API not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const convertedVapidKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    }

    const token = this.authModel.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    // Debug: Log subscription details
    console.log('Push Subscription:', JSON.stringify(subscription));
    
    const response = await this.notificationApi.subscribe(subscription, token);
    console.log('Subscription response:', response);

  } catch (error) {
    console.error('Push registration failed:', error);
    throw error;
  }
  }

  async createPushSubscription(registration) {
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
    });
  }

  async initializePushNotifications() {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    try {
      await navigator.serviceWorker.ready;
      console.log('Push notifications initialized');
    } catch (error) {
      console.error('Push initialization failed:', error);
    }
  }

  async initAddStory(view) {
    this.view = view;
    await this.view.init(this.handleFormSubmit.bind(this));
  }

  async initDetailStory(view, storyId) {
    this.view = view;
    
    try {
      const story = await this.getStoryWithFallback(storyId);
      this.view.render(story);
      this.initStoryMap([story]);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async initStoryList(view) {
    this.view = view;
    await this.loadStories();
  }

  async getStoryWithFallback(storyId) {
    try {
      const story = await this.model.getStoryById(storyId);
      await storyDB.saveStory(story);
      return story;
    } catch (networkError) {
      console.log('Network error, trying IndexedDB...');
      const story = await storyDB.getStory(storyId);
      if (!story) throw new Error('Story not found in offline storage');
      return story;
    }
  }

  async loadStories() {
    try {
      const stories = await this.getStoriesWithFallback();
      this.view.renderStories(stories);
      if (this.view.initMap) {
        this.initStoryMap(stories);
      }
    } catch (error) {
      this.view.showError('Failed to load stories: ' + error.message);
    }
  }

  async getStoriesWithFallback() {
    try {
      const stories = await this.model.getAllStories();
      await storyDB.saveStories(stories);
      return stories;
    } catch (networkError) {
      console.log('Network error, loading offline stories...');
      const stories = await storyDB.getAllStories();
      this.view.showOfflineWarning();
      return stories;
    }
  }

  initStoryMap(stories) {
    const map = this.view.initMap ? this.view.initMap() : initMap('map');
    showStoriesOnMap(map, stories);
  }

async syncPendingStories() {
  try {
    const pendingStories = await storyDB.getPendingStories();
    const results = [];
    
    for (const story of pendingStories) {
      try {
        let result;
        if (this.authModel.isLoggedIn()) {
          result = await this.model.addStory(
            story.description,
            story.photo,
            story.lat,
            story.lon
          );
        } else {
          result = await this.model.addGuestStory(
            story.description,
            story.photo,
            story.lat,
            story.lon
          );
        }
        
        await storyDB.deletePendingStory(story.id);
        results.push(result);
      } catch (error) {
        console.error('Failed to sync story:', story.id, error);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Failed to sync pending stories:', error);
    return [];
  }
}

async handleFormSubmit(formData) {
  try {
    if (!navigator.onLine) {
      await storyDB.savePendingStory(formData);
      this.view.showSuccess('Curhat disimpan secara offline dan akan dikirim ketika online');
      return { offline: true };
    }

    const result = await this.processFormSubmission(formData);
    
    if (this.authModel.isLoggedIn()) {
      await this.registerPushNotifications();
    }
    
    return result;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      await storyDB.savePendingStory(formData);
      this.view.showSuccess('Curhat disimpan secara offline dan akan dikirim ketika online');
      return { offline: true };
    }
    throw error;
  }
}

  async processFormSubmission(formData) {
    return this.authModel.isLoggedIn() 
      ? this.model.addStory(
          formData.description,
          formData.photo,
          formData.location?.lat,
          formData.location?.lng
        )
      : this.model.addGuestStory(
          formData.description,
          formData.photo,
          formData.location?.lat,
          formData.location?.lng
        );
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
  }

async testNotification() {
  const registration = await navigator.serviceWorker.ready;
  registration.showNotification('Test Notification', {
    body: 'This is a test notification',
    icon: '/images/logo.png'
  });
}
}