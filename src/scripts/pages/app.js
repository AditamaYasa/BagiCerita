import routes, { NotFoundPage } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import APP_CONFIG from '../config';

const AUTH_TOKEN_KEY = APP_CONFIG.ACCESS_TOKEN_KEY;

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    window.addEventListener('hashchange', () => this.renderPage());
    this.renderPage();
  }

  _setupDrawer() {
    if (!this.#drawerButton || !this.#navigationDrawer) {
      console.warn('Drawer button or navigation drawer not found');
      return;
    }

    document.body.addEventListener('click', (event) => {
      const isClickInsideNav = this.#navigationDrawer.contains(event.target);
      const isClickOnToggle = this.#drawerButton.contains(event.target);
      const isClickOnLink = [...this.#navigationDrawer.querySelectorAll('a')].some(link =>
        link.contains(event.target)
      );

      if ((!isClickInsideNav && !isClickOnToggle) || isClickOnLink) {
        this.#navigationDrawer.classList.remove('open');
      }
    });

    document.getElementById('logout-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      this._logout();
    });
  }

  async _logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this._updateAuthUI();
    window.location.hash = '#/login';
    await this.renderPage();
  }

  async renderPage() {
    const url = getActiveRoute();
    const PageClass = routes[url];
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const isAuthPage = url === '/login' || url === '/register';
    const isPostLogin = localStorage.getItem('postLogin') === 'true';

    if (!token && !isAuthPage) {
      window.location.hash = '#/login';
      return;
    }

    if (token && isAuthPage && !isPostLogin) {
      window.location.hash = '#/';
      return;
    }

    if (!PageClass) {
      const page = new NotFoundPage(); 
      this.#content.innerHTML = await page.render();
      await page.afterRender?.();
      return;
    }

    localStorage.removeItem('postLogin');
    const page = new PageClass();

    await this._cleanupBeforeNavigation();
    this._updateAuthUI();

    this.#content.style.viewTransitionName = 'main-content';

    if (!document.startViewTransition) {
      this.#content.innerHTML = await page.render();
      await page.afterRender?.();
      return;
    }

    const transition = document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender?.();
      this.#content.style.viewTransitionName = '';
    });

    transition.finished.finally(() => {
      this.#content.style.viewTransitionName = '';
    });
  }

  _updateAuthUI() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const loginItem = document.getElementById('login-item');
    const logoutItem = document.getElementById('logout-item');

    if (!loginItem || !logoutItem) {
      console.error('Login or logout item not found in DOM');
      return;
    }

    if (token) {
      loginItem.setAttribute('hidden', '');
      logoutItem.removeAttribute('hidden');
    } else {
      loginItem.removeAttribute('hidden');
      logoutItem.setAttribute('hidden', '');
    }
  }

  async _cleanupBeforeNavigation() {
    const activePresenter = this.#content?._presenter;
    if (activePresenter && typeof activePresenter.stopCamera === 'function') {
      try {
        await activePresenter.stopCamera();
      } catch (error) {
        console.error('Error stopping camera:', error);
      }
    }
  }
}

export default App;
