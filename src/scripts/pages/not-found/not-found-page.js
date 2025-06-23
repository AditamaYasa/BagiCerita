export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found-page" id="main-content" role="main">
        <h1 class="not-found-title">404</h1>
        <p class="not-found-message">Ups! Halaman tidak ditemukan.</p>
        <p class="not-found-description">
          Halaman yang kamu cari mungkin telah dihapus atau belum tersedia.
        </p>
        <a href="#/" class="back-home-btn">Kembali ke Beranda</a>
      </section>
    `;
  }

  async afterRender() {
  }
}
