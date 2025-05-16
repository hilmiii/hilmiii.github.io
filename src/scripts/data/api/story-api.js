import { API_BASE_URL } from '../../utils/config.js';
import { getAuthToken } from './auth-api.js';

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token && !url.includes('/guest')) {
    throw new Error('Authentication required');
  }

  const headers = {
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    logout();
    window.location.hash = '#/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

export const getStories = async (page = 1, size = 10, withLocation = false) => {
  const params = new URLSearchParams({
    page,
    size,
    location: withLocation ? '1' : '0',
  });

  const response = await fetchWithAuth(`${API_BASE_URL}/stories?${params}`);
  const responseJson = await response.json();
  
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to fetch stories');
  }
  
  return responseJson.listStory;
};

export const getStoryById = async (id) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/stories/${id}`);
  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to fetch story');
  }

  return responseJson.story;
};

export const addStory = async (description, photo, lat, lon) => {
  console.log('Adding story with:', { description, photo, lat, lon }); 
  
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  
  if (lat !== undefined && lon !== undefined) {
    formData.append('lat', lat);
    formData.append('lon', lon);
  }

  console.log('FormData entries:'); 
  for (let [key, value] of formData.entries()) {
    console.log(key, value); 
  }

  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/stories`, {
      method: 'POST',
      body: formData,
    });

    const responseJson = await response.json();
    console.log('API response:', responseJson); 

    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to add story');
    }

    return responseJson;
  } catch (error) {
    console.error('API call failed:', error); 
    throw error;
  }
};

export const addGuestStory = async (description, photo, lat, lon) => {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  
  if (lat !== undefined && lon !== undefined) {
    formData.append('lat', lat);
    formData.append('lon', lon);
  }

  const response = await fetch(`${API_BASE_URL}/stories/guest`, {
    method: 'POST',
    body: formData,
  });

  const responseJson = await response.json();

  if (!response.ok) {
    console.error('Error details:', responseJson);
    throw new Error(responseJson.message || 'Failed to add guest story');
  }

  return responseJson;
};