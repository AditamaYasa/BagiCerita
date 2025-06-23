import LibraryPagePresenter from "./library-page-presenter";

export default class LibraryPage {
  constructor() {
    this.presenter = new LibraryPagePresenter(this);
  }

  async render() {
    return `
      <section class="content" id="main-content" role="main">
        <h1>Library Favorite</h1>
        <br>
        <div id="library-favorite-list" class="favorite-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.showLoading();
    await this.presenter.loadLibraryFavorite(); 
  }

  showLoading() {
    const container = document.querySelector("#library-favorite-list");
    container.innerHTML = "<p>Loading data...</p>";
  }

  hideLoading() {
    const container = document.querySelector("#library-favorite-list");
    container.innerHTML = "";
  }

  showStories(stories) {
    const container = document.querySelector("#library-favorite-list");

    if (!stories.length) {
      container.innerHTML = "<p>Belum ada Story yang di Favoritkan.</p>";
      return;
    }

    container.innerHTML = ""; 

    stories.forEach((story) => {
      const storyItem = document.createElement("article");
      storyItem.className = "story-card";
      storyItem.setAttribute("aria-labelledby", `judul-cerita-${story.id}`);
      
      storyItem.innerHTML = `
      <figure>
      <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}">
      <figcaption id="judul-cerita-${story.id}">${story.description}</figcaption>
      </figure>
      <div class="story-info">
      <p class="author">By ${story.name}</p>
      <p class="excerpt">Dibuat : ${new Date(story.createdAt).toLocaleString()}</p>
      ${story.lat && story.lon ? `<p class="coordinates">Lokasi : ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}</p>` : ""}
      <button class="delete-btn" data-id="${story.id}">Hapus Story</button>
      </div>
      `;

      storyItem.querySelector(".delete-btn")
        .addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          const confirmDelete = confirm("Apakah kamu yakin ingin menghapus cerita ini dari favorite?");
          if (confirmDelete) {
            this.presenter.deleteStory(id);
          }
        });

      container.appendChild(storyItem);
    });
  }
}
