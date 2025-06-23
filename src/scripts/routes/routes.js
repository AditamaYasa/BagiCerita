import HomePage from '../pages/home/home-page.js';
import LoginPage from '../pages/auth/login/login-page.js';
import RegisterPage from '../pages/auth/register/register-page.js';
import AboutPage from '../pages/about/about-page.js';
import AddStoryPage from '../pages/home/add-story/add-story.js';
import LibraryPage from '../pages/library/library-page.js';
import NotFoundPage from '../pages/not-found/not-found-page.js';

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/library': LibraryPage,
  '/about': AboutPage,
  '/add-story': AddStoryPage,
};

export { routes as default, NotFoundPage };
