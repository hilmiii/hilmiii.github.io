import { BaseView } from '../shared/base-view.js';
import { initMap, getCurrentLocation } from '../../scripts/utils/map.js';

export class AddStoryView extends BaseView {
  constructor() {
    super();
    this.cameraStream = null;
    this.map = null;
    this.photoFile = null;
    this.isSubmitting = false;
    this.submitHandler = null;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.startCamera = this.startCamera.bind(this);
    this.stopCamera = this.stopCamera.bind(this);
    this.capturePhoto = this.capturePhoto.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleGetLocation = this.handleGetLocation.bind(this);
    this.setupMapClickHandler = this.setupMapClickHandler.bind(this);
  }

  async init(onSubmit) {
    try {
      this.submitHandler = onSubmit;
      this.renderTemplate();
      this.initializeMap();
      this.setupEventListeners();
      this.setupAriaAttributes();
      this.focusFirstField();
    } catch (error) {
      console.error('Initialization failed:', error);
      this.showError('Failed to initialize form');
    }
  }

  renderTemplate() {
    const isLoggedIn = false; 
    
    this.main.innerHTML = `
      <section class="add-story" aria-labelledby="addStoryTitle">
        <h2 id="addStoryTitle">${isLoggedIn ? 'Buat Curhat Baru' : 'Buat Curhat Anonim'}</h2>
        <form id="storyForm" aria-label="Formulir tambah curhat">
          ${this.getDescriptionField()}
          ${this.getPhotoField()}
          ${this.getLocationField()}
          ${this.getNotificationConsent(isLoggedIn)}
          <button type="submit" class="btn-primary" id="submitBtn">
            Kirim Curhat
          </button>
        </form>
      </section>
    `;
  }

  initializeMap() {
    this.map = initMap('map');
    this.setupMapClickHandler();
  }

  setupEventListeners() {
    const form = document.getElementById('storyForm');
    if (!form) return;

    form.removeEventListener('submit', this.handleSubmit);
    form.addEventListener('submit', this.handleSubmit);

    const cameraBtn = document.getElementById('cameraBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const captureBtn = document.getElementById('captureBtn');
    const photoInput = document.getElementById('photoInput');
    const getLocationBtn = document.getElementById('getLocationBtn');

    if (cameraBtn) cameraBtn.addEventListener('click', this.startCamera);
    if (uploadBtn) uploadBtn.addEventListener('click', () => photoInput.click());
    if (captureBtn) captureBtn.addEventListener('click', this.capturePhoto);
    if (photoInput) photoInput.addEventListener('change', this.handleFileUpload);
    if (getLocationBtn) getLocationBtn.addEventListener('click', this.handleGetLocation);
  }

  setupAriaAttributes() {
    const form = document.getElementById('storyForm');
    if (form) {
      form.setAttribute('aria-live', 'polite');
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.setLoadingState(true);

    try {
      const formData = this.getFormData();
      await this.validateFormData(formData);
      await this.submitHandler(formData);
      
      this.showSuccess('Curhat berhasil dikirim!');
      setTimeout(() => {
        window.location.hash = '#/home';
      }, 2000);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.isSubmitting = false;
      this.setLoadingState(false);
    }
  }

  async validateFormData(formData) {
    if (!formData.description || formData.description.length < 5) {
      throw new Error('Deskripsi harus minimal 5 karakter');
    }

    if (!formData.photo) {
      throw new Error('Silakan tambahkan foto');
    }

    if (formData.photo.size > 1000000) {
      throw new Error('Ukuran file terlalu besar. Maksimal 1MB.');
    }
  }

  getFormData() {
    const description = document.getElementById('description')?.value;
    const lat = document.getElementById('lat')?.value;
    const lng = document.getElementById('lng')?.value;

    return {
      description,
      photo: this.photoFile,
      location: lat && lng ? { 
        lat: parseFloat(lat), 
        lng: parseFloat(lng) 
      } : null
    };
  }

  /* Camera Methods */
  async startCamera() {
    try {
      this.stopCamera();
      
      const cameraFeed = document.getElementById('cameraFeed');
      const captureBtn = document.getElementById('captureBtn');
      const photoInput = document.getElementById('photoInput');
      
      if (photoInput) photoInput.value = '';
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      this.cameraStream = stream;
      if (cameraFeed) {
        cameraFeed.srcObject = stream;
        cameraFeed.style.display = 'block';
      }
      if (captureBtn) captureBtn.style.display = 'inline-block';
    } catch (error) {
      console.error('Camera error:', error);
      this.showError('Tidak dapat mengakses kamera: ' + error.message);
    }
  }

  stopCamera() {
    if (!this.cameraStream) return;
    
    this.cameraStream.getTracks().forEach(track => track.stop());
    const cameraFeed = document.getElementById('cameraFeed');
    const captureBtn = document.getElementById('captureBtn');
    
    if (cameraFeed) {
      cameraFeed.srcObject = null;
      cameraFeed.style.display = 'none';
    }
    if (captureBtn) captureBtn.style.display = 'none';
    
    this.cameraStream = null;
  }

  capturePhoto() {
    const cameraFeed = document.getElementById('cameraFeed');
    const photoPreview = document.getElementById('photoPreview');
    const photoInput = document.getElementById('photoInput');
    
    if (!cameraFeed || !photoPreview) return;

    const canvas = document.createElement('canvas');
    canvas.width = cameraFeed.videoWidth;
    canvas.height = cameraFeed.videoHeight;
    canvas.getContext('2d').drawImage(cameraFeed, 0, 0);
    
    canvas.toBlob(blob => {
      this.photoFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      photoPreview.src = URL.createObjectURL(this.photoFile);
      photoPreview.style.display = 'block';
      
      if (photoInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(this.photoFile);
        photoInput.files = dataTransfer.files;
      }

      this.stopCamera();
    }, 'image/jpeg', 0.9);
  }

  handleFileUpload(event) {
    this.stopCamera();
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      this.showError('Hanya file gambar yang diperbolehkan');
      event.target.value = '';
      return;
    }

    if (file.size > 1000000) {
      this.showError('Ukuran file terlalu besar. Maksimal 1MB.');
      event.target.value = '';
      return;
    }

    this.photoFile = file;
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
      photoPreview.src = URL.createObjectURL(file);
      photoPreview.style.display = 'block';
    }
  }

  /* Location Methods */
  async handleGetLocation() {
    try {
      const position = await getCurrentLocation();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      this.updateLocationFields(lat, lng);
      this.updateMapMarker(lat, lng);
      
    } catch (error) {
      this.showError('Gagal mendapatkan lokasi: ' + error.message);
    }
  }

  setupMapClickHandler() {
    if (!this.map) return;
    
    this.map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      this.updateLocationFields(lat, lng);
      this.updateMapMarker(lat, lng);
    });
  }

  updateLocationFields(lat, lng) {
    const latInput = document.getElementById('lat');
    const lngInput = document.getElementById('lng');
    const coordinatesText = document.getElementById('coordinatesText');
    const coordinatesInfo = document.getElementById('coordinatesInfo');
    
    if (latInput) latInput.value = lat;
    if (lngInput) lngInput.value = lng;
    if (coordinatesText) coordinatesText.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    if (coordinatesInfo) coordinatesInfo.style.display = 'block';
  }

  updateMapMarker(lat, lng) {
    if (!this.map) return;
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) this.map.removeLayer(layer);
    });
    
    L.marker([lat, lng]).addTo(this.map)
      .bindPopup(`
        <b>Lokasi yang dipilih</b><br>
        Lat: ${lat.toFixed(6)}<br>
        Lng: ${lng.toFixed(6)}
      `)
      .openPopup();
  }

  /* UI Helper Methods */
  setLoadingState(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;

    submitBtn.disabled = isLoading;
    submitBtn.innerHTML = isLoading
      ? `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Memproses...`
      : 'Kirim Curhat';
  }

  showSuccess(message) {
    this.showAlert(message, 'success');
  }

  showError(message) {
    this.showAlert(message, 'danger');
  }

  showAlert(message, type) {
    this.clearAlerts();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
      <span class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" 
            aria-hidden="true"></span>
      <span>${message}</span>
    `;
    
    const form = document.getElementById('storyForm');
    if (form) {
      form.parentNode.insertBefore(alertDiv, form);
    }
    
    setTimeout(() => {
      alertDiv.classList.add('fade-out');
      setTimeout(() => alertDiv.remove(), 300);
    }, type === 'success' ? 3000 : 5000);
  }

  clearAlerts() {
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
  }

  focusFirstField() {
    const descriptionField = document.getElementById('description');
    if (descriptionField) descriptionField.focus();
  }

  /* Template Parts */
  getDescriptionField() {
    return `
      <div class="form-group">
        <label for="description" id="descriptionLabel">Isi Curhat:</label>
        <textarea 
          id="description" 
          name="description" 
          required 
          aria-required="true"
          aria-labelledby="descriptionLabel"
          placeholder="Apa yang ingin kamu curhatkan?"
          aria-describedby="descriptionHelp"
        ></textarea>
        <small id="descriptionHelp" class="help-text">Tuliskan curhatan Anda dengan jelas</small>
      </div>
    `;
  }

  getPhotoField() {
    return `
      <div class="form-group">
        <label id="photoLabel">Ambil Foto:</label>
        <div id="photoOptions" class="photo-options" role="group" aria-labelledby="photoLabel">
          <button 
            type="button" 
            id="cameraBtn" 
            class="btn-secondary"
            aria-label="Gunakan kamera untuk mengambil foto"
            aria-expanded="false"
            aria-controls="cameraFeed captureBtn"
          >
            <i class="fas fa-camera" aria-hidden="true"></i> Gunakan Kamera
          </button>
          <span class="or-text" aria-hidden="true">atau</span>
          <button 
            type="button" 
            id="uploadBtn" 
            class="btn-secondary"
            aria-label="Unggah foto dari perangkat"
          >
            <i class="fas fa-upload" aria-hidden="true"></i> Unggah File
          </button>
        </div>
        <input 
          type="file" 
          id="photoInput" 
          name="photo" 
          accept="image/*" 
          style="display:none;"
          aria-labelledby="photoLabel"
          aria-describedby="fileInfo"
        >
        <div class="photo-preview-container">
          <video 
            id="cameraFeed" 
            autoplay 
            style="display:none;"
            aria-label="Pratinjau kamera"
            aria-live="polite"
          ></video>
          <button 
            type="button" 
            id="captureBtn" 
            class="btn-secondary" 
            style="display:none;"
            aria-label="Ambil foto dari kamera"
          >
            <i class="fas fa-camera" aria-hidden="true"></i> Ambil Foto
          </button>
          <img 
            id="photoPreview" 
            src="" 
            alt="Pratinjau foto yang akan diunggah" 
            style="display:none;"
            aria-live="polite"
          >
        </div>
        <p id="fileInfo" class="file-info">Maksimal ukuran file 1MB</p>
      </div>
    `;
  }

  getLocationField() {
    return `
      <div class="form-group">
        <label id="locationLabel">Lokasi:</label>
        <button 
          type="button" 
          id="getLocationBtn" 
          class="btn-secondary"
          aria-label="Gunakan lokasi saat ini"
          aria-describedby="locationHelp"
        >
          <i class="fas fa-location-arrow" aria-hidden="true"></i> Gunakan Lokasi Sekarang
        </button>
        <small id="locationHelp" class="help-text">Izinkan akses lokasi saat diminta</small>
        <div 
          id="map" 
          style="height: 300px;"
          role="application"
          aria-label="Peta untuk memilih lokasi"
          tabindex="0"
        ></div>
        <input type="hidden" id="lat" name="lat" aria-hidden="true">
        <input type="hidden" id="lng" name="lng" aria-hidden="true">
        <div id="coordinatesInfo" style="margin-top: 10px; display: none;" aria-live="polite">
          <p>Koordinat: <span id="coordinatesText"></span></p>
        </div>
      </div>
    `;
  }

  getNotificationConsent(isLoggedIn) {
    if (!isLoggedIn || !('Notification' in window)) return '';
    
    return `
      <div class="form-group" id="notificationConsent">
        <label for="enableNotifications">
          <input 
            type="checkbox" 
            id="enableNotifications"
            aria-describedby="notificationHelp"
          > Aktifkan notifikasi
        </label>
        <small id="notificationHelp" class="help-text">Anda akan menerima notifikasi ketika ada balasan</small>
      </div>
    `;
  }

  cleanup() {
    this.stopCamera();
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
    
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview?.src) {
      URL.revokeObjectURL(photoPreview.src);
    }
    
    const form = document.getElementById('storyForm');
    if (form) {
      form.removeEventListener('submit', this.handleSubmit);
    }
  }
}