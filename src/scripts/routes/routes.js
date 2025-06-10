import HomePage from '../pages/home/home-page.js';
import LoginPage from '../pages/auth/login/login-page.js';
import RegisterPage from '../pages/auth/register/register-page.js';
import AboutPage from '../pages/about/about-page.js';
import AddStoryPage from '../pages/home/add-story/add-story.js';

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/about': AboutPage,
  '/add-story': AddStoryPage,
};

export default routes;
