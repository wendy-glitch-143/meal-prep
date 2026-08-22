<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../api';

const route = useRoute();
const router = useRouter();
const recipe = ref(null);
const error = ref('');
const isPublic = computed(() => Boolean(route.meta.public));
const backTo = computed(() => (isPublic.value ? '/view' : '/menu'));

async function removeRecipe() {
  if (!recipe.value || !confirm(`Delete “${recipe.value.name}”?`)) return;
  error.value = '';
  try {
    await api(`/api/recipes/${recipe.value.id}`, { method: 'DELETE' });
    router.push('/menu');
  } catch (err) {
    error.value = err.message;
  }
}

onMounted(async () => {
  try {
    const path = isPublic.value
      ? `/api/public/recipes/${route.params.id}`
      : `/api/recipes/${route.params.id}`;
    recipe.value = await api(path);
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <main class="page">
    <router-link :to="backTo" class="back">← Back to menu</router-link>
    <p v-if="error" class="error">{{ error }}</p>
    <article v-if="recipe" class="card detail" :style="{ '--accent': recipe.color }">
      <div class="top">
        <span class="emoji">{{ recipe.emoji }}</span>
        <span class="chip">{{ recipe.meal_type }}</span>
      </div>
      <h1>{{ recipe.name }}</h1>
      <p class="desc">{{ recipe.description }}</p>
      <p class="meta">{{ recipe.prep_minutes }} min · {{ recipe.servings }} servings</p>
      <div v-if="!isPublic" class="actions">
        <router-link class="btn btn-ghost" :to="{ path: '/menu', query: { edit: recipe.id } }">Edit</router-link>
        <button class="btn btn-ghost" type="button" @click="removeRecipe">Delete</button>
      </div>
      <p v-if="recipe.video_url" class="video">
        <a :href="recipe.video_url" target="_blank" rel="noreferrer">Watch video</a>
      </p>
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

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.actions .btn {
  text-decoration: none;
}

.video a {
  color: var(--sage-dark);
  font-weight: 600;
}
</style>
