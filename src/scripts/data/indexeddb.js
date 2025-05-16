import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/build/esm/index.js';

const DB_NAME = 'serlok-db';
const STORE_NAME = 'offline-stories';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  }
});

export const IndexedDBHelper = {
  async saveStory(story) {
    const db = await dbPromise;
    return db.put(STORE_NAME, story);
  },
  
  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async deleteStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  }
};
