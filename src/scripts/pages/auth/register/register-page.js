import RegisterPresenter from "./register-page-presenter";

export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter(this);
  }

  async render() {
    return `
      <section class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">Daftar Akun</h1>
          <form id="registerForm" class="auth-form" aria-label="Formulir Registrasi">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="password">Kata Sandi</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" class="auth-form button" id="submitButton">Daftar</button>
          </form>
          <p id="formMessage" class="auth-error" role="status" aria-live="polite"></p>
          <p class="auth-footer">
            Sudah punya akun? <a href="#/login">Masuk di sini</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('registerForm');
    const submitButton = document.getElementById('submitButton');

    if (!form || !submitButton) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      if (!name || !email || !password) {
        this.updateMessage('Semua kolom wajib diisi.');
        return;
      }

      submitButton.disabled = true;
      this.updateMessage('');

      this.presenter.handleRegister({ name, email, password })
        .finally(() => {
          submitButton.disabled = false;
        });
    });
  }

  updateMessage(message) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
      formMessage.textContent = message;
    }
  }

  navigateTo(path) {
    window.location.hash = path;
  }
  
  onRegisterSuccess() {
    setTimeout(() => {
      this.navigateTo('#/login');
    }, 1500);
  }
}
