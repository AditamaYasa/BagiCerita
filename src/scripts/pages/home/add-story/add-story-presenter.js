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
    this.view.updatePhotoPreview(blob);
  }
  
  validateForm({ description, latitude, longitude }) {
  if (!this.photoBlob) return 'Foto belum diambil.';
  if (!description) return 'Deskripsi belum diisi.';
  if (!latitude || !longitude) return 'Lokasi belum dipilih.';
  return true;
  }

  async handleFormSubmit({ description, latitude, longitude }) {
    try {
      const validationResult = this.validateForm({ description, latitude, longitude });
      if (validationResult !== true) {
        this.view.updateMessage(validationResult);
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
