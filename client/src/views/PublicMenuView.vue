<script setup>
import { computed, onMounted, ref } from 'vue';
import { api } from '../api';
import RecipeCard from '../components/RecipeCard.vue';

const recipes = ref([]);
const recipeCategories = ref([]);
const filter = ref('all');
const error = ref('');

const visible = computed(() =>
  filter.value === 'all' ? recipes.value : recipes.value.filter((r) => r.category === filter.value)
);

onMounted(async () => {
  try {
    const data = await api('/api/public/menu');
    recipes.value = data.recipes || [];
    recipeCategories.value = data.recipeCategories || [];
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <main class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Prepd</p>
        <h1>Menu</h1>
        <p>Scan, browse, and pick a dish.</p>
      </div>
    </header>

    <div class="filters">
      <button class="btn" :class="filter === 'all' ? 'btn-sage' : 'btn-ghost'" type="button" @click="filter = 'all'">
        All
      </button>
      <button
        v-for="cat in recipeCategories"
        :key="cat.slug"
        class="btn"
        :class="filter === cat.slug ? 'btn-sage' : 'btn-ghost'"
        type="button"
        @click="filter = cat.slug"
      >
        {{ cat.label }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="!visible.length" class="empty card">No dishes on the menu yet.</p>
    <section class="grid">
      <router-link v-for="recipe in visible" :key="recipe.id" :to="`/view/${recipe.id}`">
        <RecipeCard :recipe="recipe" />
      </router-link>
    </section>
  </main>
</template>

<style scoped>
.hero {
  margin-bottom: 22px;
}

.eyebrow {
  margin: 0;
  color: var(--sage-dark);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
}

h1 {
  margin: 4px 0;
  font-size: 2.4rem;
}

.hero p:last-child {
  margin: 0;
  color: var(--muted);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}
</style>
