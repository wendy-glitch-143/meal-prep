<script setup>
import BrandMark from './BrandMark.vue';
</script>

<template>
  <header class="nav">
    <span class="brand">
      <BrandMark />
      <span class="serif">Prepd</span>
    </span>
    <nav>
      <router-link to="/view">Menu</router-link>
      <router-link to="/view/planner">Planner</router-link>
    </nav>
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
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 18px;
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

nav a.router-link-exact-active {
  color: var(--ink);
  font-weight: 600;
}
</style>
