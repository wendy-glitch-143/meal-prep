<script setup>
import { computed, onMounted, ref } from 'vue';
import { api } from '../api';
import RecipeCard from '../components/RecipeCard.vue';
import VideoEmbed from '../components/VideoEmbed.vue';
import { parseVideo } from '../video';

const EMOJIS = ['🍽️', '🥣', '🥑', '🍓', '🥚', '🍌', '🥗', '🌯', '🍲', '🐟', '🍋', '🥘', '🍝', '🌮', '🍗', '🍚', '🍞', '🧀', '🍎', '🥕', '🥞', '🍕', '🍜', '🥙', '🍪', '☕'];

const recipes = ref([]);
const mealTypes = ref([]);
const categories = ref([]);
const filter = ref('all');
const error = ref('');
const showForm = ref(false);
const saving = ref(false);
const form = ref(blankForm());

function blankForm() {
  return {
    name: '',
    description: '',
    meal_type: mealTypes.value[0]?.slug || 'breakfast',
    prep_minutes: 15,
    servings: 2,
    emoji: '🍽️',
    video_url: '',
    ingredients: [{ name: '', quantity: 1, unit: 'count', category: categories.value[0]?.slug || 'produce' }],
  };
}

const visible = computed(() =>
  filter.value === 'all' ? recipes.value : recipes.value.filter((r) => r.meal_type === filter.value)
);

async function load() {
  const [recipeRows, settings] = await Promise.all([api('/api/recipes'), api('/api/settings')]);
  recipes.value = recipeRows;
  mealTypes.value = settings.mealTypes || [];
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

function openForm() {
  form.value = blankForm();
  showForm.value = !showForm.value;
}

async function saveRecipe() {
  error.value = '';
  saving.value = true;
  try {
    const meal = mealTypes.value.find((m) => m.slug === form.value.meal_type);
    await api('/api/recipes', {
      method: 'POST',
      body: JSON.stringify({
        ...form.value,
        color: meal?.color,
        ingredients: form.value.ingredients.filter((item) => item.name.trim()),
      }),
    });
    form.value = blankForm();
    showForm.value = false;
    await load();
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
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
        <p class="eyebrow">This week’s table</p>
        <h1>Menu list</h1>
        <p>Add your own recipes, then drop them into the planner.</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openForm">
        {{ showForm ? 'Cancel' : '+ Add recipe' }}
      </button>
    </header>

    <form v-if="showForm" class="card form" @submit.prevent="saveRecipe">
      <h2>New recipe</h2>
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
          <label for="meal_type">Meal</label>
          <select id="meal_type" v-model="form.meal_type">
            <option v-for="meal in mealTypes" :key="meal.slug" :value="meal.slug">{{ meal.label }}</option>
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
        <VideoEmbed v-if="parseVideo(form.video_url)" :url="form.video_url" />
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
      <button class="btn btn-sage save" :disabled="saving">
        {{ saving ? 'Saving…' : 'Save recipe' }}
      </button>
    </form>

    <div class="filters">
      <button class="btn" :class="filter === 'all' ? 'btn-sage' : 'btn-ghost'" type="button" @click="filter = 'all'">
        All
      </button>
      <button
        v-for="meal in mealTypes"
        :key="meal.slug"
        class="btn"
        :class="filter === meal.slug ? 'btn-sage' : 'btn-ghost'"
        type="button"
        @click="filter = meal.slug"
      >
        {{ meal.label }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!visible.length" class="empty card">No recipes yet. Add one to start planning.</p>
    <section class="grid">
      <router-link v-for="recipe in visible" :key="recipe.id" :to="`/menu/${recipe.id}`">
        <RecipeCard :recipe="recipe" />
      </router-link>
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

.save {
  margin-top: 14px;
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

@media (max-width: 720px) {
  .row,
  .ing-row {
    grid-template-columns: 1fr;
  }
}
</style>
