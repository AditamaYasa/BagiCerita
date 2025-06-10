import APP_CONFIG from "../config";

const API_BASE = APP_CONFIG.BASE_URL;
const AUTH_TOKEN_KEY = APP_CONFIG.ACCESS_TOKEN_KEY;

const API_ROUTES = {
  AUTH: {
    SIGN_UP: `${API_BASE}/register`,
    SIGN_IN: `${API_BASE}/login`,
  },
  POSTS: {
    BASE: `${API_BASE}/stories`,
    GUEST: `${API_BASE}/stories/guest`,
    SINGLE: (postId) => `${API_BASE}/stories/${postId}`,
  },
};

const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const buildHeaders = (requiresJson = true, requiresAuth = true) => {
  const headers = new Headers();

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }

  if (requiresJson) {
    headers.append('Content-Type', 'application/json');
  }

  return headers;
};

const handleResponse = async (response) => {
  let data = null;
  try {
    data = await response.json();
  } catch {
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized. Silakan login kembali.');
    if (response.status === 500) throw new Error('Terjadi kesalahan server. Silakan coba lagi nanti.');
    throw new Error(data?.message || response.statusText || 'Permintaan gagal');
  }

  return data;
};

export const AuthService = {
  async register({ name, email, password }) {
    const response = await fetch(API_ROUTES.AUTH.SIGN_UP, {
      method: 'POST',
      headers: buildHeaders(true, false), 
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  async login({ email, password }) {
    const response = await fetch(API_ROUTES.AUTH.SIGN_IN, {
      method: 'POST',
      headers: buildHeaders(true, false), 
      body: JSON.stringify({ email, password }),
    });

    const result = await handleResponse(response);

    const token = result?.token || result?.loginResult?.token;
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log('Token saved:', token);
    } else {
      console.error('No token received from API:', result);
    }

    return result;
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  isLoggedIn() {
    return !!getAuthToken();
  }
};

export const StoryService = {
  async create({ description, photo, lat, lon }) {
    const token = getAuthToken();
    if (!token) throw new Error('Token tidak ditemukan, silakan login.');

    const formPayload = new FormData();
    formPayload.append('description', description);
    formPayload.append('photo', photo);
    if (lat) formPayload.append('lat', lat);
    if (lon) formPayload.append('lon', lon);

    const response = await fetch(API_ROUTES.POSTS.BASE, {
      method: 'POST',
      headers: new Headers({ Authorization: `Bearer ${token}` }), 
      body: formPayload,
    });

    return handleResponse(response);
  },

  async createGuestStory({ description, photo, lat, lon }) {
    const formPayload = new FormData();
    formPayload.append('description', description);
    formPayload.append('photo', photo);
    if (lat) formPayload.append('lat', lat);
    if (lon) formPayload.append('lon', lon);

    const response = await fetch(API_ROUTES.POSTS.GUEST, {
      method: 'POST',
      body: formPayload,
    });

    return handleResponse(response);
  },

  async fetchAll({ page = 1, size = 5, location } = {}) {
    const url = new URL(API_ROUTES.POSTS.BASE);
    const params = new URLSearchParams({ page, size });
    if (location !== undefined && location !== null && location !== 0) {
      params.append('location', location);
    }
    url.search = params.toString();

    const response = await fetch(url, {
      headers: buildHeaders(false, true),
    });

    return handleResponse(response);
  },

  async fetchById(postId) {
    const response = await fetch(API_ROUTES.POSTS.SINGLE(postId), {
      headers: buildHeaders(false, true),
    });

    return handleResponse(response);
  },

  async deleteById(postId) {
    const response = await fetch(API_ROUTES.POSTS.SINGLE(postId), {
      method: 'DELETE',
      headers: buildHeaders(false, true),
    });
    return handleResponse(response);
  }
};

export const AppState = {
  setPostLoginFlag() {
    localStorage.setItem('postLogin', 'true');
  },
  getPostLoginFlag() {
    return localStorage.getItem('postLogin') === 'true';
  },
  clearPostLoginFlag() {
    localStorage.removeItem('postLogin');
  }
};

