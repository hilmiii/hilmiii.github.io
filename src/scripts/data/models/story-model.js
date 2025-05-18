import { 
  getStories, 
  getStoryById, 
  addStory, 
  addGuestStory 
} from '../api/story-api.js';

export class StoryModel {
   constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async addStory(description, photo, lat, lon) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    formData.append('lat', lat);
    formData.append('lon', lon);

    const response = await fetch(`${this.baseUrl}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to add story');
    }

    return await response.json();
  }

  async getStories(page = 1, size = 10, withLocation = false) {
    return await getStories(page, size, withLocation);
  }

  async getStoryById(id) {
    return await getStoryById(id);
  }

  async addStory(description, photo, lat, lon) {
    return await addStory(description, photo, lat, lon);
  }

  async addGuestStory(description, photo, lat, lon) {
    return await addGuestStory(description, photo, lat, lon);
  }
}