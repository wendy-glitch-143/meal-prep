<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../auth';
import BrandMark from './BrandMark.vue';

const { user, logout } = useAuth();
const route = useRoute();
const router = useRouter();
const open = ref(false);
const collapsed = ref(localStorage.getItem('prepd_sidebar') === '1');
const side = ref(null);

function onLogout() {
  logout();
  router.push('/login');
}

function isMobile() {
  return window.innerWidth <= 800;
}

function toggleSide() {
  if (isMobile()) {
    open.value = !open.value;
    return;
  }
  collapsed.value = !collapsed.value;
  localStorage.setItem('prepd_sidebar', collapsed.value ? '1' : '0');
}

function addRecipe() {
  open.value = false;
  router.push({ path: '/menu', query: { add: '1' } });
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
    <router-link to="/planner" class="brand">
      <BrandMark />
      <span class="serif">Prepd</span>
    </router-link>
    <div class="user">
      <span>{{ user?.username }}</span>
      <button class="menu-btn" type="button" aria-label="Open menu" @click="toggleSide">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 8h14M5 12h14M5 16h14" />
        </svg>
      </button>
      <button class="btn btn-ghost" type="button" @click="onLogout">Log out</button>
    </div>
  </header>
  <aside ref="side" class="app-side" :class="{ open, collapsed }">
    <div class="side-inner">
      <button class="btn btn-primary add" type="button" @click="addRecipe">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 6v12M6 12h12" />
        </svg>
        <span class="label">Add recipe</span>
      </button>
      <nav>
        <router-link to="/menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 7h14v12H7a2 2 0 0 0-2 2V7zM5 7v12M9 11h6M9 15h4" />
          </svg>
          <span class="label">Menu</span>
        </router-link>
        <router-link to="/planner">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 5h12v15H6zM6 9h12M9 5V3M15 5V3M9 13h2M13 13h2M9 17h2" />
          </svg>
          <span class="label">Planner</span>
        </router-link>
        <router-link to="/grocery">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span class="label">Grocery</span>
        </router-link>
        <router-link to="/settings">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.8 6.8l1.4 1.4M15.8 15.8l1.4 1.4M6.8 17.2l1.4-1.4M15.8 8.2l1.4-1.4" />
          </svg>
          <span class="label">Settings</span>
        </router-link>
      </nav>
      <button class="side-toggle" type="button" :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'" @click="toggleSide">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path v-if="collapsed" d="M9 6l6 6-6 6" />
          <path v-else d="M15 6l-6 6 6 6" />
        </svg>
        <span class="label">{{ collapsed ? 'Expand' : 'Collapse' }}</span>
      </button>
    </div>
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

.menu-btn svg,
.side-toggle svg,
.add svg,
nav svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.menu-btn svg {
  width: 22px;
  height: 22px;
  stroke-width: 1.8;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}

.app-side {
  width: 220px;
  align-self: stretch;
  background: var(--paper);
  border-right: 1px solid var(--line);
  overflow: hidden;
  transition: width 0.25s ease;
}

.app-side.collapsed {
  width: 72px;
}

.side-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  padding: 18px 12px;
}

.app-side.collapsed .side-inner {
  padding-left: 10px;
  padding-right: 10px;
}

.add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

nav {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
}

nav a,
.side-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
}

nav a.router-link-active,
nav a:hover,
.side-toggle:hover {
  background: var(--chip-bg);
  color: var(--ink);
}

nav a.router-link-active {
  font-weight: 600;
}

.label {
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.app-side.collapsed .add,
.app-side.collapsed nav a,
.app-side.collapsed .side-toggle {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.app-side.collapsed .label {
  width: 0;
  opacity: 0;
}

@media (max-width: 800px) {
  .side-toggle {
    display: none;
  }

  .menu-btn {
    display: grid;
  }

  .user span {
    display: none;
  }

  .side-inner {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 21;
    width: 220px;
    background: var(--paper);
    border-right: 1px solid var(--line);
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .app-side.collapsed .add,
  .app-side.collapsed nav a,
  .app-side.collapsed .side-toggle {
    justify-content: flex-start;
    padding: 10px 14px;
  }

  .app-side.collapsed .add {
    justify-content: center;
  }

  .app-side.collapsed .label {
    width: auto;
    opacity: 1;
  }

  .app-side.open .side-inner {
    transform: none;
    box-shadow: var(--shadow);
  }
}
</style>
