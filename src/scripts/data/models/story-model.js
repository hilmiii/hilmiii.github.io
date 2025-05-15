import { 
  getStories, 
  getStoryById, 
  addStory, 
  addGuestStory 
} from '../api/story-api.js';

export class StoryModel {
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