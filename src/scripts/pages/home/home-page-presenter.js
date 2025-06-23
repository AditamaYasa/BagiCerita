import { StoryService } from "../../data/api";
import StoryDB from "../../data/database";
import { activatePushNotification, deactivatePushNotification, enablePushNotification, unenablePushNotification } from "../../utils/notifications";

export default class HomePagePresenter {
  constructor(view) {
    this.view = view;
    this.SIZE = 8;
    this.stories = [];
    this.isSubscribed = false;
  }

  async init() {
    this.view.clear();
    this.view.showLoading();

    try {
      const data = await this._fetchStories();
      this.stories = data;
      this.view.render(data);
      await this.updateSubscribeButton();
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
  getStoryById(id) {
    return this.stories.find((story) => story.id === id);
  }
  
  async saveStoryToFavorite(story) {
    try {
      await StoryDB.putStory(story);
    } catch (error) {
      console.error("Gagal menyimpan ke Favorite", error);
    }
  }
  async handlePushToggle() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await deactivatePushNotification();
      } else {
        await activatePushNotification();
      }

      this.updateSubscribeButton();
    } catch (error) {
      console.error("Gagal mengubah status langganan:", error);
    }
  }

  async updateSubscribeButton() {
    try {
      if (!('serviceWorker' in navigator)) {
        console.warn("Service worker tidak didukung");
        return;
      }
      
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      this.view.updateSubscribeButtonText(!!subscription);
    } catch (error) {
      console.error("Gagal mengecek status langganan:", error);
    }
  }
}
