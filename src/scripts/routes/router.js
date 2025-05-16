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

const authModel = new AuthModel(); 

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

  const protectedRoutes = ['/home', '/add-story', '/detail-story'];
  const authPages = ['/login', '/register'];

  const isProtected = protectedRoutes.includes(path);
  const isAuthPage = authPages.includes(path);

  const userLoggedIn = authModel.isLoggedIn();

  if (isProtected && !userLoggedIn) {
    window.location.hash = '#/login';
    return;
  }

  if (isAuthPage && userLoggedIn) {
    window.location.hash = '#/home';
    return;
  }

  if (typeof routes[path] !== 'function') {
    main.innerHTML = `
      <section class="not-found">
        <h1>404 - Halaman tidak ditemukan</h1>
        <p>Maaf, halaman yang kamu cari tidak tersedia.</p>
        <a href="#/home">⬅️ Kembali ke Beranda</a>
      </section>
    `;
    return;
  }

  if (!document.startViewTransition) {
    main.innerHTML = '';
    await routes[path](authModel);
    return;
  }

  const transition = document.startViewTransition(async () => {
    main.innerHTML = '';
    await routes[path](authModel);
  });

  try {
    await transition.finished;
  } catch (error) {
    console.error('View transition failed:', error);
  }
};


window.addEventListener('auth-change', router);

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
