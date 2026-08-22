<script setup>
import { onMounted, ref } from 'vue';
import { api } from '../api';
import { useTheme } from '../theme';
import { CATEGORY_ICONS } from '../categoryIcons';
import CategoryIcon from '../components/CategoryIcon.vue';

const { theme, themes, applyTheme } = useTheme();
const mealTypes = ref([]);
const recipeCategories = ref([]);
const categories = ref([]);
const mealLabel = ref('');
const recipeCategoryLabel = ref('');
const recipeCategoryIcon = ref('sides');
const pickingId = ref(null);
const categoryLabel = ref('');
const error = ref('');

async function load() {
  const data = await api('/api/settings');
  mealTypes.value = data.mealTypes || [];
  recipeCategories.value = data.recipeCategories || [];
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

async function addRecipeCategory() {
  error.value = '';
  try {
    await api('/api/settings/recipe-categories', {
      method: 'POST',
      body: JSON.stringify({ label: recipeCategoryLabel.value, icon: recipeCategoryIcon.value }),
    });
    recipeCategoryLabel.value = '';
    recipeCategoryIcon.value = 'sides';
    await load();
  } catch (err) {
    error.value = err.message;
  }
}

async function setRecipeCategoryIcon(item, icon) {
  error.value = '';
  try {
    await api(`/api/settings/recipe-categories/${item.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ icon }),
    });
    pickingId.value = null;
    await load();
  } catch (err) {
    error.value = err.message;
  }
}

async function removeRecipeCategory(item) {
  error.value = '';
  try {
    await api(`/api/settings/recipe-categories/${item.id}`, { method: 'DELETE' });
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
        <p>Meal types are for the planner. Menu categories are for the recipe list.</p>
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
        <p class="hint">Shown as slots in the planner. Remove only if no plan uses it.</p>
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
        <h2>Menu categories</h2>
        <p class="hint">Pick an icon for each filter on the menu. Remove only if no recipe uses it.</p>
        <ul>
          <li v-for="item in recipeCategories" :key="item.id">
            <div class="cat-row">
              <button class="icon-btn" type="button" :title="'Change icon'" @click="pickingId = pickingId === item.id ? null : item.id">
                <CategoryIcon :name="item.icon" />
              </button>
              <span>{{ item.label }}</span>
            </div>
            <button class="btn btn-ghost" type="button" @click="removeRecipeCategory(item)">Remove</button>
            <div v-if="pickingId === item.id" class="icon-grid">
              <button
                v-for="icon in CATEGORY_ICONS"
                :key="icon"
                class="icon-btn"
                :class="{ selected: item.icon === icon }"
                type="button"
                @click="setRecipeCategoryIcon(item, icon)"
              >
                <CategoryIcon :name="icon" />
              </button>
            </div>
          </li>
        </ul>
        <div class="icon-grid">
          <button
            v-for="icon in CATEGORY_ICONS"
            :key="icon"
            class="icon-btn"
            :class="{ selected: recipeCategoryIcon === icon }"
            type="button"
            @click="recipeCategoryIcon = icon"
          >
            <CategoryIcon :name="icon" />
          </button>
        </div>
        <form class="add" @submit.prevent="addRecipeCategory">
          <input v-model="recipeCategoryLabel" placeholder="e.g. Seafood" required />
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
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid var(--line);
}

.cat-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  margin-top: 10px;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--line);
  background: var(--input);
  color: var(--ink);
  border-radius: 12px;
  cursor: pointer;
}

.icon-btn.selected {
  border-color: var(--terracotta);
  color: var(--terracotta);
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
