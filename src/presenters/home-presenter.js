import { initMap, showStoriesOnMap } from '/scripts/utils/map.js';

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
      this.view.render(stories);
      
      const map = initMap('map');
      showStoriesOnMap(map, stories);
      
      this.view.hideLoading();
    } catch (error) {
      this.view.hideLoading();
      this.view.showError(
        error.message, 
        !this.authModel.isLoggedIn()
      );
    }
  }
}