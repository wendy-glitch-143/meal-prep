<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../api';
import RecipeCard from '../components/RecipeCard.vue';
import MenuQr from '../components/MenuQr.vue';
import CategoryFilters from '../components/CategoryFilters.vue';

const EMOJIS = ['🍽️', '🥣', '🥑', '🍓', '🥚', '🍌', '🥗', '🌯', '🍲', '🐟', '🍋', '🥘', '🍝', '🌮', '🍗', '🍚', '🍞', '🧀', '🍎', '🥕', '🥞', '🍕', '🍜', '🥙', '🍪', '☕'];

const route = useRoute();
const router = useRouter();
const recipes = ref([]);
const recipeCategories = ref([]);
const categories = ref([]);
const filter = ref('all');
const sort = ref('alpha');
const showSort = ref(false);
const sortMenu = ref(null);
const error = ref('');
const showForm = ref(false);
const saving = ref(false);
const editingId = ref(null);
const form = ref(blankForm());

function blankForm() {
  return {
    name: '',
    description: '',
    category: recipeCategories.value[0]?.slug || 'chicken',
    prep_minutes: 15,
    servings: 2,
    emoji: '🍽️',
    video_url: '',
    ingredients: [{ name: '', quantity: 1, unit: 'count', category: categories.value[0]?.slug || 'produce' }],
  };
}

const visible = computed(() => {
  const rows = filter.value === 'all' ? recipes.value : recipes.value.filter((r) => r.category === filter.value);
  return [...rows].sort((a, b) => {
    if (sort.value === 'latest') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
    return a.name.localeCompare(b.name);
  });
});

async function load() {
  const [recipeRows, settings] = await Promise.all([api('/api/recipes'), api('/api/settings')]);
  recipes.value = recipeRows;
  recipeCategories.value = settings.recipeCategories || [];
  categories.value = settings.categories || [];
}

function addIngredientRow() {
  form.value.ingredients.push({
    name: '',
    quantity: 1,
    unit: 'count',
    category: categories.value[0]?.slug || 'produce',
  });
}

function removeIngredientRow(index) {
  form.value.ingredients.splice(index, 1);
}

function closeForm() {
  editingId.value = null;
  form.value = blankForm();
  showForm.value = false;
}

function openForm() {
  editingId.value = null;
  form.value = blankForm();
  showForm.value = true;
}

async function startEdit(recipe) {
  error.value = '';
  try {
    const full = await api(`/api/recipes/${recipe.id}`);
    editingId.value = full.id;
    form.value = {
      name: full.name,
      description: full.description || '',
      category: full.category || recipeCategories.value[0]?.slug || 'chicken',
      prep_minutes: full.prep_minutes,
      servings: full.servings,
      emoji: full.emoji || '🍽️',
      video_url: full.video_url || '',
      ingredients: full.ingredients?.length
        ? full.ingredients.map((item) => ({
            name: item.name,
            quantity: Number(item.quantity),
            unit: item.unit,
            category: item.category || categories.value[0]?.slug || 'produce',
          }))
        : [{ name: '', quantity: 1, unit: 'count', category: categories.value[0]?.slug || 'produce' }],
    };
    showForm.value = true;
  } catch (err) {
    error.value = err.message;
  }
}

async function toggleAvailable(recipe, available) {
  error.value = '';
  try {
    const data = await api(`/api/recipes/${recipe.id}/available`, {
      method: 'PATCH',
      body: JSON.stringify({ available }),
    });
    recipe.available = data.available;
  } catch (err) {
    error.value = err.message;
  }
}

async function saveRecipe() {
  error.value = '';
  saving.value = true;
  try {
    const cat = recipeCategories.value.find((c) => c.slug === form.value.category);
    const payload = {
      ...form.value,
      color: cat?.color,
      ingredients: form.value.ingredients.filter((item) => item.name.trim()),
    };
    if (editingId.value) {
      await api(`/api/recipes/${editingId.value}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      await api('/api/recipes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }
    closeForm();
    await load();
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
}

function setSort(value) {
  sort.value = value;
  showSort.value = false;
}

function onDocClick(event) {
  if (!sortMenu.value?.contains(event.target)) showSort.value = false;
}

async function handleQuery() {
  if (route.query.edit) {
    await startEdit({ id: route.query.edit });
    router.replace({ path: '/menu' });
  } else if (route.query.add) {
    openForm();
    router.replace({ path: '/menu' });
  }
}

onMounted(async () => {
  document.addEventListener('click', onDocClick);
  try {
    await load();
    await handleQuery();
  } catch (err) {
    error.value = err.message;
  }
});

watch(
  () => [route.query.add, route.query.edit],
  () => {
    handleQuery();
  }
);

onUnmounted(() => document.removeEventListener('click', onDocClick));
</script>

<template>
  <main class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">This week’s table</p>
        <h1>Menu list</h1>
        <p>Add your own recipes, then drop them into the planner.</p>
      </div>
      <div class="hero-actions">
        <MenuQr />
      </div>
    </header>

    <form v-if="showForm" class="card form" @submit.prevent="saveRecipe">
      <h2>{{ editingId ? 'Edit recipe' : 'New recipe' }}</h2>
      <div class="field">
        <label for="name">Name</label>
        <input id="name" v-model="form.name" required />
      </div>
      <div class="field">
        <span class="label">Emoji</span>
        <div class="emoji-row">
          <button
            v-for="icon in EMOJIS"
            :key="icon"
            class="emoji-btn"
            :class="{ selected: form.emoji === icon }"
            type="button"
            @click="form.emoji = icon"
          >
            {{ icon }}
          </button>
        </div>
      </div>
      <div class="row">
        <div class="field">
          <label for="category">Category</label>
          <select id="category" v-model="form.category">
            <option v-for="cat in recipeCategories" :key="cat.slug" :value="cat.slug">{{ cat.label }}</option>
          </select>
        </div>
        <div class="field">
          <label for="prep_minutes">Prep minutes</label>
          <input id="prep_minutes" v-model.number="form.prep_minutes" type="number" min="1" />
        </div>
        <div class="field">
          <label for="servings">Servings</label>
          <input id="servings" v-model.number="form.servings" type="number" min="1" />
        </div>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <input id="description" v-model="form.description" />
      </div>
      <div class="field">
        <label for="video_url">Video link</label>
        <input
          id="video_url"
          v-model="form.video_url"
          placeholder="YouTube, TikTok, Instagram, or Facebook Reels"
        />
      </div>

      <h3>Ingredients</h3>
      <div v-for="(item, i) in form.ingredients" :key="i" class="ing-row">
        <input v-model="item.name" placeholder="Name" />
        <input v-model.number="item.quantity" type="number" min="0.1" step="0.1" />
        <input v-model="item.unit" placeholder="unit" />
        <select v-model="item.category">
          <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.label }}</option>
        </select>
        <button class="btn btn-ghost" type="button" @click="removeIngredientRow(i)">✕</button>
      </div>
      <button class="btn btn-ghost" type="button" @click="addIngredientRow">+ Ingredient</button>
      <div class="form-actions">
        <button class="btn btn-ghost" type="button" @click="closeForm">Cancel</button>
        <button class="btn btn-sage save" :disabled="saving">
          {{ saving ? 'Saving…' : editingId ? 'Update recipe' : 'Save recipe' }}
        </button>
      </div>
    </form>

    <div class="toolbar">
      <CategoryFilters v-model="filter" :categories="recipeCategories" />
      <div ref="sortMenu" class="sort">
        <button class="sort-btn" type="button" aria-label="Sort" @click.stop="showSort = !showSort">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h10M4 17h6" />
          </svg>
        </button>
        <div v-if="showSort" class="sort-menu">
          <button type="button" :class="{ active: sort === 'alpha' }" @click="setSort('alpha')">A–Z</button>
          <button type="button" :class="{ active: sort === 'latest' }" @click="setSort('latest')">Latest</button>
        </div>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!visible.length" class="empty card">No recipes yet. Add one to start planning.</p>
    <section class="grid">
      <div v-for="recipe in visible" :key="recipe.id" class="menu-item">
        <router-link :to="`/menu/${recipe.id}`">
          <RecipeCard :recipe="recipe" />
        </router-link>
        <label class="avail-switch">
          <input
            type="checkbox"
            :checked="Number(recipe.available)"
            @change="toggleAvailable(recipe, $event.target.checked)"
          />
          <span class="track"></span>
          <span>{{ Number(recipe.available) ? 'Available' : 'Unavailable' }}</span>
        </label>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
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

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.form {
  padding: 22px;
  margin-bottom: 22px;
}

.label {
  font-size: 0.88rem;
  color: var(--muted);
}

.emoji-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.emoji-btn {
  border: 1px solid var(--line);
  background: var(--input);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.emoji-btn.selected {
  border-color: var(--sage);
  background: #eef4ef;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.ing-row {
  display: grid;
  grid-template-columns: 2fr 80px 90px 140px auto;
  gap: 8px;
  margin-bottom: 8px;
}

.ing-row input,
.ing-row select {
  border: 1px solid var(--line);
  background: var(--input);
  color: var(--ink);
  border-radius: 12px;
  padding: 10px 12px;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.toolbar {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.toolbar :deep(.cats) {
  margin-bottom: 22px;
}

.sort {
  position: relative;
}

.sort-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.sort-btn svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.sort-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 2;
  min-width: 120px;
  padding: 6px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: var(--shadow);
}

.sort-menu button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}

.sort-menu button.active,
.sort-menu button:hover {
  background: var(--chip-bg);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.avail-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.88rem;
  cursor: pointer;
}

.avail-switch input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.track {
  position: relative;
  width: 40px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--line);
  transition: background 0.2s;
}

.track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--paper);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
  transition: transform 0.2s;
}

.avail-switch input:checked + .track {
  background: var(--sage);
}

.avail-switch input:checked + .track::after {
  transform: translateX(16px);
}

.avail-switch input:focus-visible + .track {
  outline: 2px solid var(--sage);
  outline-offset: 2px;
}

@media (max-width: 720px) {
  .row,
  .ing-row {
    grid-template-columns: 1fr;
  }
}
</style>
