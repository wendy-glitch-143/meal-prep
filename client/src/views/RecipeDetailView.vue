<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../api';
import VideoEmbed from '../components/VideoEmbed.vue';

const route = useRoute();
const recipe = ref(null);
const error = ref('');

onMounted(async () => {
  try {
    recipe.value = await api(`/api/recipes/${route.params.id}`);
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <main class="page">
    <router-link to="/menu" class="back">← Back to menu</router-link>
    <p v-if="error" class="error">{{ error }}</p>
    <article v-if="recipe" class="card detail" :style="{ '--accent': recipe.color }">
      <div class="top">
        <span class="emoji">{{ recipe.emoji }}</span>
        <span class="chip">{{ recipe.meal_type }}</span>
      </div>
      <h1>{{ recipe.name }}</h1>
      <p class="desc">{{ recipe.description }}</p>
      <p class="meta">{{ recipe.prep_minutes }} min · {{ recipe.servings }} servings</p>
      <VideoEmbed v-if="recipe.video_url" :url="recipe.video_url" />
      <h2>Ingredients</h2>
      <ul>
        <li v-for="item in recipe.ingredients" :key="item.name">
          {{ Number(item.quantity) }} {{ item.unit }} {{ item.name }}
        </li>
      </ul>
    </article>
  </main>
</template>

<style scoped>
.back {
  color: var(--muted);
  display: inline-block;
  margin-bottom: 16px;
}

.detail {
  padding: 32px;
  background:
    linear-gradient(180deg, var(--accent), transparent 160px),
    var(--paper);
}

.emoji {
  font-size: 3rem;
}

h1 {
  margin: 8px 0 0;
}

.desc,
.meta,
li {
  color: var(--muted);
}

ul {
  padding-left: 18px;
}
</style>
