export class HeaderView {
  constructor(authModel) {
    this.authModel = authModel;
    this.setupLogoutHandler();
  }

  setupLogoutHandler() {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.authModel.logout();
      });
    }
  }

  updateAuthStatus() {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const authNav = document.getElementById('auth-nav');

    if (this.authModel.isLoggedIn()) {
      loginLink.style.display = 'none';
      logoutLink.style.display = 'inline';
      authNav.style.display = 'block';
    } else {
      loginLink.style.display = 'inline';
      logoutLink.style.display = 'none';
      authNav.style.display = 'block';
    }
  }
}