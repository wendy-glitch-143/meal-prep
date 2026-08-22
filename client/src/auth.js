import { computed, ref } from 'vue';
import { api, clearSession, getStoredUser, getToken, setSession } from './api';

const user = ref(getStoredUser());
const token = ref(getToken());

export function useAuth() {
  const isLoggedIn = computed(() => Boolean(token.value && user.value));

  async function signup(payload) {
    const data = await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setSession(data.token, data.user);
    token.value = data.token;
    user.value = data.user;
  }

  async function login(payload) {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setSession(data.token, data.user);
    token.value = data.token;
    user.value = data.user;
  }

  function logout() {
    clearSession();
    token.value = '';
    user.value = null;
  }

  return { user, isLoggedIn, signup, login, logout };
}
