import AddStoryPresenter from './add-story-presenter.js';
import { initMap, addMarkers } from '../../../utils/map-initializer.js';
import "leaflet/dist/leaflet.css";

export default class AddStory {
  constructor() {
    this.presenter = new AddStoryPresenter(this);
    this.map = null;
    this.marker = null;
    this.photoBlob = null;
    this.cameraStream = null;
  }

  async render() {
    return `
      <section class="content" id="main-content" role="main">
        <form id="storyForm" class="story-form" aria-label="Formulir Tambah Story">
          <h1>Tambah Story</h1>
          
          <div class="form-group">
            <label for="cameraInput">Ambil Gambar</label>
            <video id="cameraPreview" class="camera-preview" autoplay playsinline></video>
            <button type="button" id="takePhoto" class="btn">Ambil Foto</button>
            <div id="cameraError" class="error-message"></div>
            <canvas id="photoCanvas" class="hidden"></canvas>
            <img id="photoPreview" alt="Foto yang diambil" class="photo-preview" />
          </div>

          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div class="form-group">
            <label for="map">Pilih Lokasi</label>
            <div id="locationError" class="error-message" style="display: none;">
              Silakan pilih lokasi pada peta.
            </div>
            <div id="map" class="map-container"></div>
            <input type="hidden" id="latitude" name="latitude">
            <input type="hidden" id="longitude" name="longitude">
          </div>

          <button type="submit" class="btn-submit">Kirim Story</button>
        </form>
        
        <p id="formMessage" class="form-message" role="status" aria-live="polite"></p>
      </section>
    `;
  }

  async afterRender() {
    const elements = this.getElements();
    this._initCamera(elements);
    this._initMap(elements);
    this._initForm(elements);

    this.presenter.onSubmitSuccess = () => {
      this.stopCamera();
      setTimeout(() => this.navigateTo('#/'), 1000);
    };
    
    this.presenter.onLogError = (error) => {
      this.logError(error);
    };
    window.addEventListener('hashchange', () => this.stopCamera());
  }

  

  getElements() {
    return {
      form: document.getElementById('storyForm'),
      video: document.getElementById('cameraPreview'),
      canvas: document.getElementById('photoCanvas'),
      takePhotoButton: document.getElementById('takePhoto'),
      photoPreview: document.getElementById('photoPreview'),
      latitude: document.getElementById('latitude'),
      longitude: document.getElementById('longitude'),
      description: document.getElementById('description'),
      formMessage: document.getElementById('formMessage'),
      cameraError: document.getElementById('cameraError'),
    };
  }

  _initCamera({ video, canvas, takePhotoButton }) {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.updateCameraError('Perangkat atau browser tidak mendukung kamera.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.cameraStream = stream;
        this.presenter.setCameraStream(stream);
        video.srcObject = stream;
        this.updateCameraError('');
      })
      .catch((error) => {
        this.logError(error);
        this.updateCameraError('Akses kamera ditolak atau tidak tersedia.');
        takePhotoButton.disabled = true;
      });

    takePhotoButton.addEventListener('click', () => {
      if (!this.presenter.hasCameraStream()) {
        alert('Tidak dapat mengakses kamera.');
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        this.presenter.setPhotoBlob(blob);
        this.updatePhotoPreview(blob);
      }, 'image/jpeg', 0.95);
    });
  }

  _initMap({ latitude, longitude }) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const defaultLatLng = [position.coords.latitude, position.coords.longitude];
        this._loadMap(defaultLatLng, latitude, longitude);
      },
      () => {
        console.warn('Geolocation gagal, fallback ke Jakarta.');
        const fallback = [-6.2, 106.8];
        this._loadMap(fallback, latitude, longitude);
      }
    );
  }

  _loadMap(latlng, latitudeEl, longitudeEl) {
    this.map = initMap('map', latlng, 13);
    setTimeout(() => this.map.invalidateSize(), 500);

    const markers = addMarkers(this.map, [{
      lat: latlng[0],
      lon: latlng[1],
      description: 'Lokasi Anda',
    }]);

    this.marker = markers[0];
    this.marker.openPopup();

    latitudeEl.value = latlng[0];
    longitudeEl.value = latlng[1];

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      const newMarker = addMarkers(this.map, [{
        lat,
        lon: lng,
        description: 'Lokasi Anda'
      }])[0];

      this.marker = newMarker;
      this.marker.openPopup();

      latitudeEl.value = lat;
      longitudeEl.value = lng;
    });
  }

  _initForm({ form, description, latitude, longitude }) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        description: description.value,
        latitude: latitude.value,
        longitude: longitude.value,
        photo: this.photoBlob,
      };

      this.presenter.handleFormSubmit(data);
    });
  }

  updatePhotoPreview(blob) {
    this.photoBlob = blob;
    const { photoPreview } = this.getElements();
    photoPreview.src = URL.createObjectURL(blob);
  }

  updateMessage(message) {
    const { formMessage } = this.getElements();
    formMessage.textContent = message;
  }

  updateCameraError(message) {
    const { cameraError } = this.getElements();
    cameraError.textContent = message;
  }

  navigateTo(hash) {
    window.location.hash = hash;
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  logError(error) {
    console.error('[AddStory View Error]', error);
  }
}
