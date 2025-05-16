import { BaseView } from '../shared/base-view.js';

export class HomeView extends BaseView {
  constructor() {
    super();
    this.loadingElement = document.createElement('div');
    this.loadingElement.className = 'loading';
    this.loadingElement.innerHTML = 'Memuat...';
  }

  showLoading() {
    this.main.appendChild(this.loadingElement);
  }

  hideLoading() {
    if (this.loadingElement.parentNode) {
      this.loadingElement.parentNode.removeChild(this.loadingElement);
    }
  }

  render(stories) {
    this.main.innerHTML = `
      <section class="stories">
        <h2>Curhat Terbaru</h2>
        <div class="stories-container"></div>
      </section>
      <section class="map-container">
        <h2>Lokasi Curhat</h2>
        <div id="map" style="height: 400px;"></div>
      </section>
      <section class="offline-actions">
        <button id="clear-offline-btn" class="btn-danger">Hapus Data Offline</button>
      </section>
    `;

    this.renderStories(stories);
    this.bindClearOfflineButton();
  }

  renderStories(stories) {
    const container = this.main.querySelector('.stories-container');
    if (!container) return;

    container.innerHTML = '';

    stories.forEach(story => {
      const element = document.createElement('article');
      element.className = 'story-card';
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'article');
      element.innerHTML = this.getStoryHTML(story);
      container.appendChild(element);
    });
  }

  getStoryHTML(story) {
    return `
      <img src="${story.photoUrl}" alt="Foto ilustrasi cerita dari ${story.name || 'Anonim'}" class="story-image">
      <div class="story-content">
        <h3>${story.name || 'Anonim'}</h3>
        <p class="story-date">${new Date(story.createdAt).toLocaleDateString()}</p>
        <p class="story-text">${story.description}</p>
        <div class="story-meta">
          <span><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${story.locationName || 'Bumi'}</span>
        </div>
      </div>
    `;
  }

  showError(message, showLoginPrompt = false) {
    this.main.innerHTML = `
      <div class="error">
        ${message}
        ${showLoginPrompt ? '<a href="#/login" class="btn-primary">Login untuk melihat curhat</a>' : ''}
      </div>
    `;
  }

  bindClearOfflineButton() {
    const clearBtn = this.main.querySelector('#clear-offline-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', async () => {
        const confirmClear = confirm('Yakin ingin menghapus semua data offline?');
        if (confirmClear) {
          const { storyDB } = await import('/scripts/utils/database.js');
          await storyDB.clearStories();
          alert('Data offline berhasil dihapus.');
          location.reload();
        }
      });
    }
  }
}
