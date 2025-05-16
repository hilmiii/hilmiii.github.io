import { initMap, showStoriesOnMap } from '/scripts/utils/map.js';
import { storyDB } from '/scripts/utils/database.js'; 

export class HomePresenter {
  constructor(view, model, authModel) {
    this.view = view;
    this.model = model;
    this.authModel = authModel || { isLoggedIn: () => false };
  }

  async init() {
    try {
      this.view.showLoading();
      
      const stories = await this.model.getStories(1, 10, true);

      await storyDB.saveStories(stories);

      this.view.render(stories);

      const map = initMap('map');
      showStoriesOnMap(map, stories);

      this.view.hideLoading();
    } catch (error) {
      console.warn('Gagal fetch dari API, coba ambil dari IndexedDB:', error);

      try {
        const offlineStories = await storyDB.getAllStories();

        if (offlineStories.length === 0) {
          throw new Error('Tidak ada data offline yang tersedia.');
        }

        this.view.render(offlineStories);

        const map = initMap('map');
        showStoriesOnMap(map, offlineStories);
      } catch (dbError) {
        this.view.showError(
          dbError.message || 'Gagal memuat data offline.',
          !this.authModel.isLoggedIn()
        );
      } finally {
        this.view.hideLoading();
      }
    }
  }
}
