import HomePagePresenter from "./home-page-presenter";
import { initMap, addMarkers } from "../../utils/map-initializer";
import "leaflet/dist/leaflet.css";

export class HomePage {
  constructor() {
    this.container = document.getElementById("main-content") || document.querySelector(".container");
    this._presenter = null;
    this._map = null;
    this._mapMarkers = [];
  }

  async render(stories = []) {
    this.container.innerHTML = `
      <section class="content" aria-label="Daftar cerita populer">
        <h1>Cerita Populer</h1>
        <div class="story-grid" id="story-container">
          ${stories.map((story) => this._createStoryCard(story)).join("")}
        </div>
        <div class="loading-indicator" aria-live="polite" style="display: none;">Loading...</div>
      </section>

      <section class="map-section" aria-label="Peta lokasi cerita">
        <h2>Lokasi Cerita di Peta</h2>
        <div id="global-story-map" style="height: 400px; margin: 20px 0;"></div>
      </section>
    `;

    this._initializeMap(stories);
  }

  async afterRender() {
    this._presenter = new HomePagePresenter(this);
    await this._presenter.init();
  }

  prependStory(story) {
    const container = document.getElementById("story-container");
    if (container) {
      container.insertAdjacentHTML("afterbegin", this._createStoryCard(story));
    }

    if (story.lat && story.lon) {
      this._addMarkerToMap(story);
    }
  }

  showLoading() {
    const loader = this.container.querySelector(".loading-indicator");
    if (loader) loader.style.display = "block";
  }

  hideLoading() {
    const loader = this.container.querySelector(".loading-indicator");
    if (loader) loader.style.display = "none";
  }

  showError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    this.container.appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 3000);
  }

  clear() {
    this.container.innerHTML = "";
    this._map = null;
    this._mapMarkers = [];
  }

  _createStoryCard(story) {
    return `
      <article class="story-card" aria-labelledby="judul-cerita-${story.id}">
        <figure>
          <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}">
          <figcaption id="judul-cerita-${story.id}">${story.description}</figcaption>
        </figure>
        <div class="story-info">
          <p class="author">By ${story.name}</p>
          <p class="excerpt">Dibuat : ${new Date(story.createdAt).toLocaleString()}</p>
          ${story.lat && story.lon ? `<p class="coordinates">Lokasi : ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}</p>` : ""}
        </div>
      </article>
    `;
  }

  _initializeMap(stories) {
    const storiesWithLocation = stories.filter((story) => story.lat && story.lon);
    if (storiesWithLocation.length === 0) return;

    const map = initMap("global-story-map", [storiesWithLocation[0].lat, storiesWithLocation[0].lon], 5);
    addMarkers(map, storiesWithLocation);
    this._map = map;
  }

  _addMarkerToMap(story) {
    if (!this._map) {
      this._map = initMap("global-story-map", [story.lat, story.lon], 5);
    }

    addMarkers(this._map, [story]);
  }
}

export default HomePage;
