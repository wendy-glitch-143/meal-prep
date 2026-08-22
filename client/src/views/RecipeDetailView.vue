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
      <div class="header">
        <div class="intro">
          <div class="top">
            <span class="emoji">{{ recipe.emoji }}</span>
            <span class="chip">{{ recipe.meal_type }}</span>
          </div>
          <h1>{{ recipe.name }}</h1>
          <p class="desc">{{ recipe.description }}</p>
        </div>
        <div class="aside">
          <p class="meta">{{ recipe.prep_minutes }} min · {{ recipe.servings }} servings</p>
          <a v-if="recipe.video_url" class="video" :href="recipe.video_url" target="_blank" rel="noreferrer">
            Watch video
          </a>
        </div>
      </div>
      <h2>Ingredients</h2>
      <ul>
        <li v-for="item in recipe.ingredients" :key="item.name">
          {{ Number(item.quantity) }} {{ item.unit }} {{ item.name }}
        </li>
      </ul>
      <div v-if="!isPublic" class="actions">
        <router-link class="btn btn-ghost" :to="{ path: '/menu', query: { edit: recipe.id } }">Edit</router-link>
        <button class="btn btn-ghost" type="button" @click="removeRecipe">Delete</button>
      </div>
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
  max-width: 560px;
  padding: 28px;
  background:
    linear-gradient(180deg, var(--accent), transparent 140px),
    var(--paper);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 24px;
}

.intro {
  min-width: 0;
}

.aside {
  flex-shrink: 0;
  text-align: right;
}

.top {
  display: flex;
  align-items: center;
  gap: 16px;
}

.emoji {
  font-size: 2.2rem;
}

h1 {
  margin: 8px 0 0;
  font-size: 1.8rem;
}

.desc,
.meta,
li {
  color: var(--muted);
}

.meta {
  margin: 0;
}

.video {
  display: inline-block;
  margin-top: 8px;
  color: var(--sage-dark);
  font-weight: 600;
}

ul {
  padding-left: 18px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
}

.actions .btn {
  text-decoration: none;
}

@media (max-width: 520px) {
  .header {
    flex-direction: column;
  }

  .aside {
    text-align: left;
  }
}
</style>
