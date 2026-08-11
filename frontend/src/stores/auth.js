import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
  }),
  actions: {
    async login(username, password) {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      this.accessToken = res.data.accessToken;
      this.user = res.data.user;
    },
    logout() {
      this.accessToken = null;
      this.user = null;
    },
  },
});