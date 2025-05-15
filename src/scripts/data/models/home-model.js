import { getStories } from '../api/story-api.js';

export class HomeModel {
  async getStories(page = 1, size = 10, withLocation = false) {
    return await getStories(page, size, withLocation);
  }
}