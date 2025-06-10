import '../styles/styles.css';
import App from './pages/app';
import APP_CONFIG from './config';

function handleSkipToContent(event) {
  event.preventDefault();
  const mainContent = document.querySelector('main, [role="main"], #main-content');

  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
    setTimeout(() => {
      mainContent.removeAttribute('tabindex');
    }, 1000);
  } else {
    console.warn('Elemen main content tidak ditemukan');
  }
}

function redirectToLoginIfUnauthorized() {
  const token = localStorage.getItem(APP_CONFIG.ACCESS_TOKEN_KEY);
  const currentHash = window.location.hash;
  const publicRoutes = ['#/login', '#/register'];

  if (!token && !publicRoutes.includes(currentHash)) {
    window.location.hash = '#/login';
    return true;
  }

  return false;
}

document.addEventListener('DOMContentLoaded', async () => {
  const content = document.querySelector('#main-content');
  const drawerButton = document.querySelector('#drawer-button');
  const navigationDrawer = document.querySelector('#main-navigation');
  const navLinks = document.querySelector('.nav-links');

  drawerButton?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    const isClickInside =
      navLinks?.contains(event.target) || drawerButton?.contains(event.target);
    if (!isClickInside) {
      navLinks?.classList.remove('open');
    }
  });

  const app = new App({
    content,
    drawerButton,
    navigationDrawer,
  });

  const redirected = redirectToLoginIfUnauthorized();
  if (redirected) return;

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    if (!document.startViewTransition) {
      await app.renderPage();
      app._updateAuthUI();
      return;
    }

    document.startViewTransition(async () => {
      await app.renderPage();
      app._updateAuthUI();
    });
  });

  document
    .getElementById('skip-to-content')
    ?.addEventListener('click', handleSkipToContent);
});
