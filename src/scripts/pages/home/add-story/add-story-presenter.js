import { StoryService } from "../../../data/api";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.cameraStream = null;
    this.photoBlob = null;
  }

  setCameraStream(stream) {
    this.cameraStream = stream;
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = null;
    }
  }

  hasCameraStream() {
    return !!this.cameraStream;
  }

  getCameraStream() {
    return this.cameraStream;
  }

  setPhotoBlob(blob) {
    this.photoBlob = blob;
  }
  
  validateForm({ description, latitude, longitude }) {
    if (!description || !latitude || !longitude) return false;
    if (!this.photoBlob) return false;
    return true;
  }

  async handleFormSubmit({ description, latitude, longitude }) {
    try {
      if (!this.validateForm({ description, latitude, longitude })) {
        this.view.updateMessage('Mohon lengkapi semua data dan ambil foto terlebih dahulu!');
        return;
      }

      this.view.updateMessage('Mengirim data...');

      await StoryService.create({
        description,
        photo: this.photoBlob,
        lat: latitude,
        lon: longitude,
      });

      this.view.updateMessage('Cerita berhasil ditambahkan!');
      
      this.view.onSubmitSuccess?.();

    } catch (error) {
      this.view.onLogError?.(error);
      this.view.updateMessage(error?.message || 'Terjadi kesalahan saat mengirim story.');
    }
  }
}
