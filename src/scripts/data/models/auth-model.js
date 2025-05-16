import { 
  register, 
  login, 
  getAuthData, 
  getAuthToken, 
  isLoggedIn as apiIsLoggedIn,
  logout as apiLogout
} from '../api/auth-api.js';

export class AuthModel {
  getToken() {
    return getAuthToken();
  }

  async register(name, email, password) {
    return await register(name, email, password);
  }

  async login(email, password) {
    return await login(email, password);
  }

  getAuthData() {
    return getAuthData();
  }

  getAuthToken() {
    return getAuthToken();
  }

  isLoggedIn() {
    return apiIsLoggedIn() && !!this.getToken();
  }

  logout() {
    apiLogout();
    window.dispatchEvent(new Event('auth-change'));
  }
}
