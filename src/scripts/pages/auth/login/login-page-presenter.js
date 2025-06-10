import { AuthService, AppState } from '../../../data/api';

export default class LoginPagePresenter {
  constructor(view) {
    this.view = view;
  }

  async handleLogin({ email, password }) {
    try {
      this.view.updateMessage('Memproses login...');

      const result = await AuthService.login({ email, password });

      if (!AuthService.isLoggedIn()) {
        throw new Error(result?.message || 'Login gagal. Token tidak ditemukan.');
      }
      AppState.setPostLoginFlag();

      this.view.updateMessage('Login berhasil!');
      
      this.view.onLoginSuccess?.();

    } catch (error) {
      const message = error?.message || 'Login gagal. Periksa kembali email dan password Anda.';
      this.view.updateMessage(message);
    }
  }
}
