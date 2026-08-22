<script setup>
import { onMounted, ref } from 'vue';
import { api } from '../api';
import { useTheme } from '../theme';

const { theme, themes, applyTheme } = useTheme();
const mealTypes = ref([]);
const categories = ref([]);
const mealLabel = ref('');
const categoryLabel = ref('');
const error = ref('');

async function load() {
  const data = await api('/api/settings');
  mealTypes.value = data.mealTypes || [];
  categories.value = data.categories || [];
}

async function addMeal() {
  error.value = '';
  try {
    await api('/api/settings/meal-types', {
      method: 'POST',
      body: JSON.stringify({ label: mealLabel.value }),
    });
    mealLabel.value = '';
    await load();
  } catch (err) {
    error.value = err.message;
  }
}

async function removeMeal(item) {
  error.value = '';
  try {
    await api(`/api/settings/meal-types/${item.id}`, { method: 'DELETE' });
    await load();
  } catch (err) {
    error.value = err.message;
  }
}

async function addCategory() {
  error.value = '';
  try {
    await api('/api/settings/ingredient-categories', {
      method: 'POST',
      body: JSON.stringify({ label: categoryLabel.value }),
    });
    categoryLabel.value = '';
    await load();
  } catch (err) {
    error.value = err.message;
  }
}

async function removeCategory(item) {
  error.value = '';
  try {
    await api(`/api/settings/ingredient-categories/${item.id}`, { method: 'DELETE' });
    await load();
  } catch (err) {
    error.value = err.message;
  }
}

onMounted(async () => {
  try {
    await load();
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <main class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Preferences</p>
        <h1>General settings</h1>
        <p>Add or remove meal and ingredient types, and pick a theme.</p>
      </div>
    </header>

    <p v-if="error" class="error">{{ error }}</p>

    <article class="card panel theme-panel">
      <h2>Theme</h2>
      <p class="hint">Choose how Prepd looks. Your pick is saved on this device.</p>
      <div class="themes">
        <button
          v-for="item in themes"
          :key="item.id"
          class="theme-btn"
          :class="{ selected: theme === item.id }"
          type="button"
          @click="applyTheme(item.id)"
        >
          <span class="swatches">
            <i :style="{ background: item.cream }" />
            <i :style="{ background: item.paper }" />
            <i :style="{ background: item.accent }" />
          </span>
          {{ item.name }}
        </button>
      </div>
    </article>

    <section class="grid">
      <article class="card panel">
        <h2>Meal types</h2>
        <p class="hint">Remove a type only if no recipes or plans still use it.</p>
        <ul>
          <li v-for="item in mealTypes" :key="item.id">
            <span>{{ item.label }}</span>
            <button class="btn btn-ghost" type="button" @click="removeMeal(item)">Remove</button>
          </li>
        </ul>
        <form class="add" @submit.prevent="addMeal">
          <input v-model="mealLabel" placeholder="e.g. Snack" required />
          <button class="btn btn-sage">Add</button>
        </form>
      </article>

      <article class="card panel">
        <h2>Ingredient types</h2>
        <p class="hint">Remove a type only if no ingredients still use it.</p>
        <ul>
          <li v-for="item in categories" :key="item.id">
            <span>{{ item.label }}</span>
            <button class="btn btn-ghost" type="button" @click="removeCategory(item)">Remove</button>
          </li>
        </ul>
        <form class="add" @submit.prevent="addCategory">
          <input v-model="categoryLabel" placeholder="e.g. Frozen" required />
          <button class="btn btn-sage">Add</button>
        </form>
      </article>
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

.hero p:last-child,
.hint {
  color: var(--muted);
}

.theme-panel {
  margin-bottom: 16px;
}

.themes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.theme-btn {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
  border: 1px solid var(--line);
  background: var(--input);
  color: var(--ink);
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
  font-weight: 600;
}

.theme-btn.selected {
  border-color: var(--sage);
}

.swatches {
  display: flex;
  gap: 4px;
}

.swatches i {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--line);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.panel {
  padding: 22px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid var(--line);
}

.add {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.add input {
  flex: 1;
  border: 1px solid var(--line);
  background: var(--input);
  color: var(--ink);
  border-radius: 12px;
  padding: 10px 12px;
}
</style>
