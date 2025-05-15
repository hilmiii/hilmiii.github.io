import { BaseView } from '../shared/base-view.js';
import { initMap, getCurrentLocation } from '../../scripts/utils/map.js';

export class AddStoryView extends BaseView {
  constructor() {
    super();
    this.cameraStream = null;
    this.map = null;
    this.photoFile = null;
    
    // Bind all methods that need 'this' context
    this.startCamera = this.startCamera.bind(this);
    this.stopCamera = this.stopCamera.bind(this);
    this.capturePhoto = this.capturePhoto.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleGetLocation = this.handleGetLocation.bind(this);
    this.setupMapClickHandler = this.setupMapClickHandler.bind(this);
  }

   async ensureDOMReady() {
    let attempts = 0;
    while (attempts < 5) {
      if (document.getElementById('storyForm')) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 50));
      attempts++;
    }
    return false;
  }

  // async init(onSubmit) {
  //   try {
  //     this.main.innerHTML = this.getTemplate();
      
  //     if (!(await this.ensureDOMReady())) {
  //       throw new Error('Form elements not found in DOM');
  //     }
      
  //     this.map = await initMap('map');
  //     await this.setupEventListeners(onSubmit);
  //     this.setupMapClickHandler();
  //     this.setupAriaAttributes();
  //     this.initialized = true;
  //   } catch (error) {
  //     console.error('Initialization failed:', error);
  //     this.showError('Failed to initialize form');
  //   }
  // }

  async init(onSubmit) {
    this.main.innerHTML = this.getTemplate();
    this.setupEventListeners(onSubmit);
    this.map = initMap('map');
    this.setupMapClickHandler();
  }

  async _startCamera() {
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

  _stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      const cameraFeed = document.getElementById('cameraFeed');
      if (cameraFeed) {
        cameraFeed.srcObject = null;
        cameraFeed.style.display = 'none';
      }
      const captureBtn = document.getElementById('captureBtn');
      if (captureBtn) captureBtn.style.display = 'none';
      this.cameraStream = null;
    }
  }

  _capturePhoto() {
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

  _handleFileUpload(event) {
    this.stopCamera();
    const file = event.target.files[0];
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
    photoPreview.src = URL.createObjectURL(file);
    photoPreview.style.display = 'block';
  }

  _setupMapClickHandler() {
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    this.map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      document.getElementById('lat').value = lat;
      document.getElementById('lng').value = lng;
      
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
      
      const marker = L.marker([lat, lng]).addTo(this.map)
        .bindPopup(`
          <b>Lokasi yang dipilih</b><br>
          Lat: ${lat.toFixed(6)}<br>
          Lng: ${lng.toFixed(6)}
        `)
        .openPopup();
      
      const coordinatesInfo = document.getElementById('coordinatesInfo');
      const coordinatesText = document.getElementById('coordinatesText');
      if (coordinatesText) {
        coordinatesText.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
      if (coordinatesInfo) {
        coordinatesInfo.style.display = 'block';
      }
    });
  }

  getTemplate() {
    const isLoggedIn = false;
    
    return `
      <section class="add-story" aria-labelledby="addStoryTitle">
        <h2 id="addStoryTitle">${isLoggedIn ? 'Buat Curhat Baru' : 'Buat Curhat Anonim'}</h2>
        <form id="storyForm" aria-label="Formulir tambah curhat">
          ${this.getDescriptionField()}
          ${this.getPhotoField()}
          ${this.getLocationField()}
          ${this.getNotificationConsent(isLoggedIn)}
          <button type="submit" class="btn-primary">Kirim Curhat</button>
        </form>
      </section>
    `;
  }

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

  setupAriaAttributes() {
    const form = document.getElementById('storyForm');
    if (form) {
      form.setAttribute('aria-live', 'polite');
    }
  }

  getNotificationConsent(isLoggedIn) {
    if (!isLoggedIn || !('Notification' in window)) return '';
    
    return `
      <div class="form-group" id="notificationConsent">
        <label for="enableNotifications">
          <input type="checkbox" id="enableNotifications"> Aktifkan notifikasi
        </label>
      </div>
    `;
  }

// setupEventListeners(onSubmit) {
//   // Wait for DOM to be fully rendered
//   setTimeout(() => {
//     const form = document.getElementById('storyForm');
//     if (!form) {
//       console.error('Form element not found');
//       return;
//     }

//     const photoInput = document.getElementById('photoInput');
//     const cameraBtn = document.getElementById('cameraBtn');
//     const uploadBtn = document.getElementById('uploadBtn');
//     const captureBtn = document.getElementById('captureBtn');
//     const getLocationBtn = document.getElementById('getLocationBtn');

//     // Verify elements exist before adding listeners
//     if (!photoInput || !cameraBtn || !uploadBtn || !captureBtn || !getLocationBtn) {
//       console.error('One or more form elements not found');
//       return;
//     }

//     // Add event listeners
//     cameraBtn.addEventListener('click', this.startCamera);
//     captureBtn.addEventListener('click', this.capturePhoto);
//     uploadBtn.addEventListener('click', () => photoInput.click());
//     photoInput.addEventListener('change', this.handleFileUpload);
//     getLocationBtn.addEventListener('click', this.handleGetLocation);

//     form.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       try {
//         const formData = this.getFormData();
//         await onSubmit(formData);
//         this.showSuccess('Story submitted successfully!');
//         window.location.hash = '#/home';
//       } catch (error) {
//         this.showError(error.message);
//       }
//     });
//   }, 100); // Small delay to ensure DOM is ready
// }

setupEventListeners(onSubmit) {
  const form = document.getElementById('storyForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const formData = this.getFormData();
      await onSubmit(formData);
      this.showSuccess('Story submitted successfully!');
      setTimeout(() => {
        window.location.hash = '#/home';
      }, 2000);
    } catch (error) {
      this.showError(error.message);
    }
  });
  const photoInput = document.getElementById('photoInput');
  const photoPreview = document.getElementById('photoPreview');
  const cameraBtn = document.getElementById('cameraBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const cameraFeed = document.getElementById('cameraFeed');
  const captureBtn = document.getElementById('captureBtn');
  const getLocationBtn = document.getElementById('getLocationBtn');

  cameraBtn.addEventListener('click', this.startCamera.bind(this));
  captureBtn.addEventListener('click', this.capturePhoto.bind(this));
  uploadBtn.addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', (e) => this.handleFileUpload(e));
  getLocationBtn.addEventListener('click', this.handleGetLocation.bind(this));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const formData = this.getFormData();
      await onSubmit(formData);
      
      // Show success message
      this.showSuccess('Curhat berhasil dikirim!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.hash = '#/home';
      }, 2000);
      
    } catch (error) {
      this.showError(`Gagal mengirim curhat: ${error.message}`);
    }
  });
}

  async startCamera() {
    try {
      this.stopCamera();
      
      const cameraFeed = document.getElementById('cameraFeed');
      const captureBtn = document.getElementById('captureBtn');
      const photoInput = document.getElementById('photoInput');
      
      photoInput.value = '';
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      this.cameraStream = stream;
      cameraFeed.srcObject = stream;
      cameraFeed.style.display = 'block';
      captureBtn.style.display = 'inline-block';
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
    
    cameraFeed.srcObject = null;
    cameraFeed.style.display = 'none';
    captureBtn.style.display = 'none';
    this.cameraStream = null;
  }

  capturePhoto() {
    const cameraFeed = document.getElementById('cameraFeed');
    const photoPreview = document.getElementById('photoPreview');
    const photoInput = document.getElementById('photoInput');
    
    const canvas = document.createElement('canvas');
    canvas.width = cameraFeed.videoWidth;
    canvas.height = cameraFeed.videoHeight;
    canvas.getContext('2d').drawImage(cameraFeed, 0, 0);
    
    canvas.toBlob(blob => {
      this.photoFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      photoPreview.src = URL.createObjectURL(this.photoFile);
      photoPreview.style.display = 'block';
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(this.photoFile);
      photoInput.files = dataTransfer.files;

      this.stopCamera();
    }, 'image/jpeg', 0.9);
  }

  handleFileUpload(event) {
    this.stopCamera();
    const file = event.target.files[0];
    
    if (!file?.type.match('image.*')) {
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
    photoPreview.src = URL.createObjectURL(file);
    photoPreview.style.display = 'block';
  }

  async handleGetLocation() {
    try {
      const position = await getCurrentLocation();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      document.getElementById('lat').value = lat;
      document.getElementById('lng').value = lng;
      
      this.map.setView([lat, lng], 15);
      L.marker([lat, lng]).addTo(this.map)
        .bindPopup('Lokasi kamu saat ini')
        .openPopup();
      
      const coordinatesText = document.getElementById('coordinatesText');
      const coordinatesInfo = document.getElementById('coordinatesInfo');
      coordinatesText.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      coordinatesInfo.style.display = 'block';
    } catch (error) {
      this.showError('Gagal mendapatkan lokasi: ' + error.message);
    }
  }

  setupMapClickHandler() {
    this.map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      document.getElementById('lat').value = lat;
      document.getElementById('lng').value = lng;
      
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker) this.map.removeLayer(layer);
      });
      
      L.marker([lat, lng]).addTo(this.map)
        .bindPopup(`<b>Lokasi yang dipilih</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
        .openPopup();
      
      const coordinatesText = document.getElementById('coordinatesText');
      const coordinatesInfo = document.getElementById('coordinatesInfo');
      coordinatesText.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      coordinatesInfo.style.display = 'block';
    });
  }

  getFormData() {
    const description = document.getElementById('description').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;

    if (!description || description.length < 5) {
      throw new Error('Deskripsi harus minimal 5 karakter');
    }

    if (!this.photoFile) {
      throw new Error('Silakan tambahkan foto');
    }

    return {
      description,
      photo: this.photoFile,
      location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null
    };
  }

  showError(message) {
    const errorElement = document.getElementById('error-message') || this.createAlertElement('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }

  showSuccess(message) {
    const successElement = document.getElementById('success-message') || this.createAlertElement('success');
    successElement.textContent = message;
    successElement.style.display = 'block';
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 3000);
  }

  createAlertElement(type) {
    const element = document.createElement('div');
    element.id = `${type}-message`;
    element.className = `alert ${type}`;
    element.style.display = 'none';
    document.body.appendChild(element);
    return element;
  }

  cleanup() {
    this.stopCamera();
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview?.src) {
      URL.revokeObjectURL(photoPreview.src);
    }
  }
}