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
      <router-link to="/menu">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 7h14v12H7a2 2 0 0 0-2 2V7zM5 7v12M9 11h6M9 15h4" />
        </svg>
        Menu
      </router-link>
      <router-link to="/planner">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 5h12v15H6zM6 9h12M9 5V3M15 5V3M9 13h2M13 13h2M9 17h2" />
        </svg>
        Planner
      </router-link>
      <router-link to="/grocery">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
        Grocery
      </router-link>
      <router-link to="/settings">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.8 6.8l1.4 1.4M15.8 15.8l1.4 1.4M6.8 17.2l1.4-1.4M15.8 8.2l1.4-1.4" />
        </svg>
        Settings
      </router-link>
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
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--muted);
}

nav a svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
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
