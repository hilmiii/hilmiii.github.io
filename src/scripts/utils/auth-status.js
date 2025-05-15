import { isLoggedIn, logout } from '../data/auth-api.js';

export const updateAuthStatus = () => {
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const authNav = document.getElementById('auth-nav');

  if (isLoggedIn()) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'inline';
    authNav.style.display = 'block';
  } else {
    loginLink.style.display = 'inline';
    logoutLink.style.display = 'none';
    authNav.style.display = 'block';
  }

  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
    window.location.hash = '#/login';
    updateAuthStatus();
  });
};

document.addEventListener('DOMContentLoaded', updateAuthStatus);