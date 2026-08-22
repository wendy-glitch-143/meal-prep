<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../auth';

const { user, logout } = useAuth();
const router = useRouter();

function onLogout() {
  logout();
  router.push('/login');
}
</script>

<template>
  <header class="nav">
    <router-link to="/planner" class="brand">
      <span class="mark">🌿</span>
      <span class="serif">Prepd</span>
    </router-link>
    <nav>
      <router-link to="/menu">Menu</router-link>
      <router-link to="/planner">Planner</router-link>
      <router-link to="/grocery">Grocery</router-link>
      <router-link to="/settings">Settings</router-link>
    </nav>
    <div class="user">
      <span>{{ user?.username }}</span>
      <button class="btn btn-ghost" type="button" @click="onLogout">Log out</button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: min(1120px, calc(100% - 32px));
  margin: 18px auto 0;
  padding: 12px 16px;
  background: rgba(255, 250, 243, 0.86);
  border: 1px solid var(--line);
  border-radius: 18px;
  backdrop-filter: blur(8px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
}

nav {
  display: flex;
  gap: 18px;
}

nav a {
  color: var(--muted);
}

nav a.router-link-active {
  color: var(--ink);
  font-weight: 600;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}

@media (max-width: 720px) {
  .nav {
    flex-wrap: wrap;
  }

  .user span {
    display: none;
  }
}
</style>
