<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../auth';

const { user, logout } = useAuth();
const route = useRoute();
const router = useRouter();
const open = ref(false);
const side = ref(null);

function onLogout() {
  logout();
  router.push('/login');
}

function onDocClick(event) {
  if (!open.value) return;
  if (side.value?.contains(event.target) || event.target.closest('.menu-btn')) return;
  open.value = false;
}

watch(
  () => route.path,
  () => {
    open.value = false;
  }
);

onMounted(() => document.addEventListener('click', onDocClick));
onUnmounted(() => document.removeEventListener('click', onDocClick));
</script>

<template>
  <header class="app-top">
    <button class="menu-btn" type="button" aria-label="Open menu" @click="open = !open">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8h14M5 12h14M5 16h14" />
      </svg>
    </button>
    <router-link to="/planner" class="brand">
      <span class="mark">🌿</span>
      <span class="serif">Prepd</span>
    </router-link>
    <div class="user">
      <span>{{ user?.username }}</span>
      <button class="btn btn-ghost" type="button" @click="onLogout">Log out</button>
    </div>
  </header>
  <aside ref="side" class="app-side" :class="{ open }">
    <nav>
      <router-link to="/menu">Menu</router-link>
      <router-link to="/planner">Planner</router-link>
      <router-link to="/grocery">Grocery</router-link>
      <router-link to="/settings">Settings</router-link>
    </nav>
  </aside>
</template>

<style scoped>
.app-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
}

.menu-btn {
  display: none;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.menu-btn svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}

.app-side {
  background: var(--paper);
  border-right: 1px solid var(--line);
  padding: 18px 12px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

nav a {
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--muted);
}

nav a.router-link-active {
  background: var(--chip-bg);
  color: var(--ink);
  font-weight: 600;
}

@media (max-width: 800px) {
  .menu-btn {
    display: grid;
  }

  .user span {
    display: none;
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 21;
    width: 220px;
    padding: 18px 12px;
    background: var(--paper);
    border-right: 1px solid var(--line);
    transform: translateX(-100%);
    transition: transform 0.2s;
  }

  .app-side.open nav {
    transform: none;
    box-shadow: var(--shadow);
  }
}
</style>
