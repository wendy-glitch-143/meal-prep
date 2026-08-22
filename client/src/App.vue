<script setup>
import { useRoute } from 'vue-router';
import AppNav from './components/AppNav.vue';
import PublicNav from './components/PublicNav.vue';

const route = useRoute();
</script>

<template>
  <div class="app-shell" :class="{ 'has-nav': !route.meta.guest && !route.meta.public }">
    <AppNav v-if="!route.meta.guest && !route.meta.public" />
    <PublicNav v-else-if="route.meta.public" />
    <div class="app-main">
      <router-view />
    </div>
  </div>
</template>
