<script setup>
import { useRoute } from 'vue-router';
import AppNav from './components/AppNav.vue';

const route = useRoute();
</script>

<template>
  <div class="app-shell">
    <AppNav v-if="!route.meta.guest && !route.meta.public" />
    <router-view />
  </div>
</template>
