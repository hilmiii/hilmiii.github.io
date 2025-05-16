const DB_NAME = 'StoryDB';
const DB_VERSION = 2;
const STORIES_STORE = 'stories';
const PENDING_STORE = 'pendingStories';

export const storyDB = {
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORIES_STORE)) {
          const store = db.createObjectStore(STORIES_STORE, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains(PENDING_STORE)) {
          const pendingStore = db.createObjectStore(PENDING_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          pendingStore.createIndex('status', 'status', { unique: false });
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async saveStory(story) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(STORIES_STORE);
      const request = store.put(story);
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async saveStories(stories) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(STORIES_STORE);
      stories.forEach((story) => store.put(story));
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  },

  async getStory(id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORIES_STORE], 'readonly');
      const store = transaction.objectStore(STORIES_STORE);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async getAllStories() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORIES_STORE], 'readonly');
      const store = transaction.objectStore(STORIES_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async clearStories() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(STORIES_STORE);
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject('Gagal menghapus semua data');
    });
  },

  async savePendingStory(storyData) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PENDING_STORE], 'readwrite');
      const store = transaction.objectStore(PENDING_STORE);
      const request = store.add({
        ...storyData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async getPendingStories() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PENDING_STORE], 'readonly');
      const store = transaction.objectStore(PENDING_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async deletePendingStory(id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PENDING_STORE], 'readwrite');
      const store = transaction.objectStore(PENDING_STORE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  },
};
