import api from './api';
import Cookies from 'js-cookie';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

interface LoginData {
  username: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/users/register/', data);
    const { access, refresh } = response.data;
    Cookies.set('access_token', access);
    Cookies.set('refresh_token', refresh);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await api.post('/users/login/', data);
    const { access, refresh } = response.data;
    Cookies.set('access_token', access);
    Cookies.set('refresh_token', refresh);
    return response.data;
  },

  async logout() {
    const refresh = Cookies.get('refresh_token');
    try {
      await api.post('/users/logout/', { refresh });
    } finally {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  },

  async getProfile() {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  async updateProfile(data: { first_name?: string; last_name?: string }) {
    const response = await api.patch('/users/profile/', data);
    return response.data;
  },

  isAuthenticated() {
    return !!Cookies.get('access_token');
  },
};
