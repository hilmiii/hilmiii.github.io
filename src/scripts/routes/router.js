import { HomeModel } from '../data/models/home-model.js';
import { AuthModel } from '../data/models/auth-model.js';
import { StoryModel } from '../data/models/story-model.js';
import { HomePresenter } from '../../presenters/home-presenter.js';
import { AuthPresenter } from '../../presenters/auth-presenter.js';
import { StoryPresenter } from '../../presenters/story-presenter.js';
import { HomeView } from '../../views/home/home-view.js';
import { LoginView } from '../../views/auth/login-view.js';
import { RegisterView } from '../../views/auth/register-view.js';
import { AddStoryView } from '../../views/story/add-story-view.js';
import { DetailStoryView } from '../../views/story/detail-story-view.js';

const authModel = new AuthModel(); // DIBUAT SEKALI UNTUK SEMUA ROUTE

const routes = {
  '/home': async () => {
    if (window.currentView && window.currentView.stopCamera) {
      window.currentView.stopCamera(); 
    }

    const model = new HomeModel();
    const view = new HomeView();
    const presenter = new HomePresenter(view, model, authModel);
    await presenter.init();
    window.currentView = view;
  },
  '/login': () => {
    const model = authModel;
    const view = new LoginView();
    const presenter = new AuthPresenter(model);

    document.querySelector('main').innerHTML = '';
    presenter.initLogin(view);
    window.currentView = view; 
  },
  '/register': () => {
    const model = authModel;
    const view = new RegisterView();
    const presenter = new AuthPresenter(model);

    document.querySelector('main').innerHTML = '';
    presenter.initRegister(view);
    window.currentView = view; 
  },
  '/add-story': async (authModel) => {
    const model = new StoryModel();
    const view = new AddStoryView();
    const presenter = new StoryPresenter(model, authModel);
    await presenter.initAddStory(view);

    window.currentView = view;
  },
  '/detail-story': async (authModel) => {
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');

    if (!storyId) {
      document.querySelector('main').innerHTML = '<p class="error">Curhat tidak ditemukan.</p>';
      return;
    }

    const model = new StoryModel();
    const view = new DetailStoryView();
    const presenter = new StoryPresenter(model);
    await presenter.initDetailStory(view, storyId);
    window.currentView = view; 
  }
};

const router = async () => {
  const main = document.querySelector('main');
  const path = window.location.hash.slice(1) || '/home';

  if (!document.startViewTransition) {
    main.innerHTML = '';
    await routes[path]();
    return;
  }

  const transition = document.startViewTransition(async () => {
    main.innerHTML = '';
    await routes[path]();
  });

  try {
    await transition.finished;
  } catch (error) {
    console.error('View transition failed:', error);
  }

  const protectedRoutes = ['/home', '/add-story', '/detail-story'];

  const authModel = new AuthModel();

  if (protectedRoutes.includes(path) && !authModel.isLoggedIn()) {
    window.location.hash = '#/login';
    return;
  }

  const authPages = ['/login', '/register'];
  if (authPages.includes(path) && authModel.isLoggedIn()) {
    window.location.hash = '#/home';
    return;
  }

  try {
    const main = document.querySelector('main');
    if (!main) {
      console.error('Main element not found');
      return;
    }

    const path = window.location.hash.slice(1) || '/home';
    console.log('Current path:', path); 

    const authModel = new AuthModel();

    console.log('Available routes:', Object.keys(routes));

    if (typeof routes[path] !== 'function') {
      console.error('Route not found:', path);
      main.innerHTML = '<p>Halaman tidak ditemukan</p>';
      return;
    }

    main.innerHTML = '';
    await routes[path](authModel);

  } catch (error) {
    console.error('Router error:', error);
    document.querySelector('main').innerHTML = `
      <div class="error">Terjadi kesalahan: ${error.message}</div>
    `;
  }

  if (protectedRoutes.includes(path) && !authModel.isLoggedIn()) {
    window.location.hash = '#/login';
    return;
  }

};

window.addEventListener('auth-change', router);

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
