import { AuthService } from '../../../data/api';

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleRegister({ name, email, password }) {
    try {
      this.view.updateMessage('Mendaftarkan akun...');

      const response = await AuthService.register({ name, email, password });

      if (!response || typeof response !== 'object') {
        this.view.updateMessage('Respons dari server tidak valid.');
        return;
      }

      if (response.error) {
        const errorMessage = response.message || 'Terjadi kesalahan saat registrasi.';
        this.view.updateMessage(`Gagal: ${errorMessage}`);
        return;
      }

      this.view.updateMessage('Registrasi berhasil! Mengarahkan ke halaman login...');
      this.view.onRegisterSuccess?.();
      
    } catch (error) {
      const message = error?.message || 'Terjadi kesalahan saat proses registrasi.';
      console.error('[RegisterPresenter Error]', error);
      this.view.updateMessage(message);
    }
  }
}
