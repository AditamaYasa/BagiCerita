import LoginPagePresenter from './login-page-presenter';

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPagePresenter(this);
  }

  async render() {
    return `
      <section class="auth-container">
        <div class="auth-card">
          <h2 class="auth-title">Login</h2>
          <form id="login-form" class="auth-form" aria-label="Formulir Login">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" class="auth-form button" id="login-button">Login</button>
            <p id="login-error" class="auth-error" role="status" aria-live="polite"></p>
          </form>
          <p class="auth-footer">
            Belum punya akun? <a href="#/register" id="register-link">Daftar di sini</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#login-form');
    const errorMessage = document.getElementById('login-error');
    const loginButton = document.getElementById('login-button');

    if (!form || !errorMessage || !loginButton) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = form.email.value.trim();
      const password = form.password.value;

      if (!email || !password) {
        this.updateMessage('Email dan password wajib diisi.');
        return;
      }

      loginButton.disabled = true;
      this.updateMessage('');

      try {
        await this.presenter.handleLogin({ email, password });
      } catch (error) {
        this.updateMessage(error?.message || 'Login gagal.');
      } finally {
        loginButton.disabled = false;
      }
    });
  }

  updateMessage(message) {
    const msg = document.getElementById('login-error');
    if (msg) msg.textContent = message;
  }

  navigateTo(path) {
    window.location.hash = path;
  }
  onLoginSuccess = () => {
    this.updateMessage('Login berhasil!');
    setTimeout(() => {
      this.navigateTo('#/');
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }, 1000);
  };
}
