export const storyDB = {
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('StoryDB', 2);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('stories')) {
          const store = db.createObjectStore('stories', { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('pendingStories')) {
          const pendingStore = db.createObjectStore('pendingStories', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          pendingStore.createIndex('status', 'status', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  async saveStory(story) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stories'], 'readwrite');
      const store = transaction.objectStore('stories');
      const request = store.put(story);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async saveStories(stories) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stories'], 'readwrite');
      const store = transaction.objectStore('stories');
      
      stories.forEach(story => {
        store.put(story);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  },

  async getStory(id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stories'], 'readonly');
      const store = transaction.objectStore('stories');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async getAllStories() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stories'], 'readonly');
      const store = transaction.objectStore('stories');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async savePendingStory(storyData) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingStories'], 'readwrite');
      const store = transaction.objectStore('pendingStories');
      const request = store.add({
        ...storyData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async getPendingStories() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingStories'], 'readonly');
      const store = transaction.objectStore('pendingStories');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async deletePendingStory(id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingStories'], 'readwrite');
      const store = transaction.objectStore('pendingStories');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }
};