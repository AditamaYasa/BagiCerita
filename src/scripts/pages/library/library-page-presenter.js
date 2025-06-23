import StoryDB from "../../data/database";

export default class LibraryPagePresenter {
  constructor(view) {
    this.view = view;
  }

   async loadLibraryFavorite() {
    try {
        const stories = await StoryDB.getAllStories();
        this.view.showStories(stories);
    } catch (error) {
        console.error("Gagal memuat story dari favorit:", error);
    }
  }

  async deleteStory(id) {
    try {
        await StoryDB.deleteStory(id);
        alert("Story berhasil dihapus dari favorit.");
        await this.loadLibraryFavorite();
    } catch (error) {
        console.error("Gagal menghapus story dari favorit:", error);
        alert("Terjadi kesalahan saat menghapus story.");
    }
  }
}