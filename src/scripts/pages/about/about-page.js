export default class AboutPage {
 async render() {
  return `
    <section class="container about-section" id="main-content" role="main">
      <h1>Tentang Aplikasi</h1>
      <p>
        BagiCerita adalah sebuah platform berbasis Single Page Application (SPA) yang memungkinkan pengguna 
        untuk berbagi cerita mereka secara mudah dan cepat. Pengguna dapat mengunggah cerita lengkap dengan 
        foto dan lokasi, menjadikan setiap kisah lebih hidup dan bermakna. Dengan antarmuka yang sederhana 
        dan interaktif, BagiCerita hadir untuk menjadi ruang berbagi pengalaman, inspirasi, dan kenangan 
        dari berbagai tempat dan sudut pandang.
      </p>
    </section>
  `;
  }

  async afterRender() {
    // Do your job here
  }
}