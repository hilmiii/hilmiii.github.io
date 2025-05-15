import { BaseView } from '../shared/base-view.js';
import { getLocationName, showStoriesOnMap } from '/scripts/utils/map.js';

export class DetailStoryView extends BaseView {
  async render(story) {
    try {
      let locationInfo = await this.prepareLocationInfo(story);
      
      this.main.innerHTML = this.createStoryTemplate(story, locationInfo);

      if (this.hasValidCoordinates(story)) {
        this.initializeMap(story);
      }
    } catch (error) {
      console.error('Error rendering detail story:', error);
      this.showErrorView();
    }
  }

  async prepareLocationInfo(story) {
    if (!this.hasValidCoordinates(story)) {
      return {
        display: 'Lokasi tidak diketahui',
        coordinates: null
      };
    }

    try {
      const locationName = await getLocationName(story.lat, story.lon);
      return {
        display: locationName || this.formatCoordinates(story.lat, story.lon),
        coordinates: this.formatCoordinates(story.lat, story.lon)
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return {
        display: this.formatCoordinates(story.lat, story.lon),
        coordinates: this.formatCoordinates(story.lat, story.lon)
      };
    }
  }

  hasValidCoordinates(story) {
    return story.lat !== undefined && 
           story.lon !== undefined &&
           !isNaN(parseFloat(story.lat)) && 
           !isNaN(parseFloat(story.lon)) &&
           Math.abs(story.lat) <= 90 &&
           Math.abs(story.lon) <= 180;
  }

  formatCoordinates(lat, lon) {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }

  createStoryTemplate(story, locationInfo) {
    return `
      <section class="story-detail">
        <article class="story-card">
          <img src="${story.photoUrl}" alt="Foto curhat dari ${story.name}" class="story-image">
          <div class="story-content">
            <h3>${story.name}</h3>
            <p class="story-date">${new Date(story.createdAt).toLocaleDateString()}</p>
            <p class="story-text">${story.description}</p>
            <div class="story-meta">
              <span><i class="fas fa-map-marker-alt"></i> ${locationInfo.display}</span>
              ${locationInfo.coordinates ? 
                `<span class="coordinates">
                  <i class="fas fa-globe"></i> ${locationInfo.coordinates}
                </span>` : ''
              }
            </div>
          </div>
        </article>
        ${this.hasValidCoordinates(story) ? `<div id="map" style="height: 400px;"></div>` : ''}
        <a href="#/home" class="btn-primary">Kembali ke Beranda</a>
      </section>
    `;
  }

  initializeMap(story) {
    try {
      const map = L.map('map').setView([story.lat, story.lon], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(`
          <b>${story.name}</b><br>
          ${story.description.substring(0, 100)}...
        `)
        .openPopup();
    } catch (mapError) {
      console.error('Gagal memuat peta:', mapError);
    }
  }

  showErrorView() {
    this.main.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Gagal memuat detail cerita. Silakan coba lagi.</p>
        <a href="#/home" class="btn-primary">Kembali ke Beranda</a>
      </div>
    `;
  }
}