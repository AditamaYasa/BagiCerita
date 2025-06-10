import { StoryService } from "../../data/api";

export default class HomePagePresenter {
  constructor(view) {
    this.view = view;
    this.SIZE = 8;
  }

  async init() {
    this.view.clear();
    this.view.showLoading();

    try {
      const data = await this._fetchStories();
      this.view.render(data);
    } catch (error) {
      this.view.showError(error.message || "Gagal memuat cerita.");
    } finally {
      this.view.hideLoading();
    }
  }

  async _handleCreateStory({ description, photo }) {
    try {
      const position = await this._getCurrentLocation();
      const lat = position?.coords?.latitude;
      const lon = position?.coords?.longitude;

      const newStory = await StoryService.create({
        description,
        photo,
        lat,
        lon,
      });

      this.view.prependStory({
        ...newStory,
        name: "Kamu",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      this.view.showError("Gagal menambahkan cerita: " + (error.message || "Terjadi kesalahan"));
    }
  }

  async _getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation tidak didukung browser ini"));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
        });
      }
    });
  }

  async _fetchStories() {
    const { listStory } = await StoryService.fetchAll({
      page :1,
      size: this.SIZE,
      location: 1,
    });

    return listStory;
  }
}
