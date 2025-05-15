import { API_BASE_URL, STORAGE_KEY } from '../../utils/config.js';

export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.message || 'Registration failed');
  }

  return responseJson;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.message || 'Login failed');
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    token: responseJson.loginResult.token,
    userId: responseJson.loginResult.userId,
    name: responseJson.loginResult.name,
  }));

  return responseJson;
};

export const getAuthData = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

export const getAuthToken = () => {
  const authData = getAuthData();
  return authData?.token;
};

export const isLoggedIn = () => {
  return !!getAuthToken();
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
};