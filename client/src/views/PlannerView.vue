<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../api';
import { DAYS, addDays, formatDay, lastWeek, rememberWeek, toDateKey } from '../week';

const route = useRoute();
const router = useRouter();

const weekStart = ref(route.query.week || lastWeek());
const weekDate = computed(() => new Date(`${weekStart.value}T00:00:00`));
const view = ref('week');
const focusDay = ref(0);
const slots = ref([]);
const recipes = ref([]);
const mealTypes = ref([]);
const picker = ref(null);
const error = ref('');
const saving = ref(false);

const slotMap = computed(() => {
  const map = {};
  for (const slot of slots.value) {
    map[`${slot.day_of_week}-${slot.meal_type}`] = slot;
  }
  return map;
});

const pickerRecipes = computed(() => {
  if (!picker.value) return [];
  return recipes.value.filter((r) => r.meal_type === picker.value.meal);
});

const visibleDays = computed(() =>
  view.value === 'week' ? DAYS.map((_, i) => i) : [focusDay.value]
);

async function loadPlan() {
  error.value = '';
  try {
    const data = await api(`/api/plans/${weekStart.value}`);
    slots.value = data.slots || [];
  } catch (err) {
    error.value = err.message;
  }
}

async function savePlan(nextSlots) {
  saving.value = true;
  try {
    await api(`/api/plans/${weekStart.value}`, {
      method: 'PUT',
      body: JSON.stringify({ slots: nextSlots }),
    });
    slots.value = nextSlots;
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
}

function shiftWeek(delta) {
  weekStart.value = toDateKey(addDays(weekDate.value, delta * 7));
}

function openPicker(day, meal) {
  picker.value = { day, meal };
}

function chooseRecipe(recipe) {
  const next = slots.value.filter(
    (s) => !(s.day_of_week === picker.value.day && s.meal_type === picker.value.meal)
  );
  next.push({
    day_of_week: picker.value.day,
    meal_type: picker.value.meal,
    recipe_id: recipe.id,
    name: recipe.name,
    emoji: recipe.emoji,
    color: recipe.color,
    prep_minutes: recipe.prep_minutes,
  });
  picker.value = null;
  savePlan(next);
}

function clearSlot(day, meal) {
  savePlan(slots.value.filter((s) => !(s.day_of_week === day && s.meal_type === meal)));
}

onMounted(async () => {
  rememberWeek(weekStart.value);
  try {
    const [recipeRows, settings] = await Promise.all([api('/api/recipes'), api('/api/settings')]);
    recipes.value = recipeRows;
    mealTypes.value = settings.mealTypes || [];
    await loadPlan();
  } catch (err) {
    error.value = err.message;
  }
});

watch(weekStart, () => {
  rememberWeek(weekStart.value);
  router.replace({ query: { week: weekStart.value } });
  loadPlan();
});
</script>

<template>
  <main class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Daily & weekly prep</p>
        <h1>Your planner</h1>
        <p>Tap a slot to add a recipe. The grocery list updates from this week.</p>
      </div>
      <div class="controls">
        <button class="btn btn-ghost" type="button" @click="shiftWeek(-1)">←</button>
        <strong>{{ formatDay(weekDate) }}</strong>
        <button class="btn btn-ghost" type="button" @click="shiftWeek(1)">→</button>
        <button class="btn" :class="view === 'week' ? 'btn-sage' : 'btn-ghost'" type="button" @click="view = 'week'">
          Week
        </button>
        <button class="btn" :class="view === 'day' ? 'btn-sage' : 'btn-ghost'" type="button" @click="view = 'day'">
          Day
        </button>
      </div>
    </header>

    <div v-if="view === 'day'" class="day-pills">
      <button
        v-for="(label, i) in DAYS"
        :key="label"
        class="btn"
        :class="focusDay === i ? 'btn-primary' : 'btn-ghost'"
        type="button"
        @click="focusDay = i"
      >
        {{ label }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="saving" class="saving">Saving…</p>

    <section class="planner" :class="view">
      <div v-for="day in visibleDays" :key="day" class="day-col card">
        <h3>{{ DAYS[day] }}</h3>
        <small>{{ formatDay(addDays(weekDate, day)) }}</small>
        <div v-for="meal in mealTypes" :key="meal.slug" class="slot">
          <span class="meal-label">{{ meal.label }}</span>
          <button
            v-if="slotMap[`${day}-${meal.slug}`]"
            class="filled"
            type="button"
            :style="{ background: slotMap[`${day}-${meal.slug}`].color }"
            @click="openPicker(day, meal.slug)"
          >
            <span>{{ slotMap[`${day}-${meal.slug}`].emoji }} {{ slotMap[`${day}-${meal.slug}`].name }}</span>
            <em @click.stop="clearSlot(day, meal.slug)">✕</em>
          </button>
          <button v-else class="empty-slot" type="button" @click="openPicker(day, meal.slug)">+ Add meal</button>
        </div>
      </div>
    </section>

    <div v-if="picker" class="overlay" @click.self="picker = null">
      <section class="card picker">
        <h2>Choose {{ picker.meal }}</h2>
        <p v-if="!pickerRecipes.length" class="empty">
          No {{ picker.meal }} recipes yet.
          <router-link to="/menu">Add one</router-link>
        </p>
        <button
          v-for="recipe in pickerRecipes"
          :key="recipe.id"
          class="pick"
          type="button"
          @click="chooseRecipe(recipe)"
        >
          <span>{{ recipe.emoji }}</span>
          <div>
            <strong>{{ recipe.name }}</strong>
            <small>{{ recipe.prep_minutes }} min</small>
          </div>
        </button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
  margin-bottom: 20px;
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
.saving,
small {
  color: var(--muted);
}

.controls,
.day-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.day-pills {
  margin-bottom: 16px;
}

.planner {
  display: grid;
  gap: 12px;
}

.planner.week {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.planner.day {
  grid-template-columns: 1fr;
}

.day-col {
  padding: 14px;
}

h3 {
  margin: 0;
}

.slot {
  margin-top: 12px;
}

.meal-label {
  display: block;
  text-transform: capitalize;
  font-size: 0.78rem;
  color: var(--muted);
  margin-bottom: 6px;
}

.filled,
.empty-slot {
  width: 100%;
  border: 0;
  border-radius: 14px;
  min-height: 74px;
  text-align: left;
  padding: 10px;
  cursor: pointer;
}

.filled {
  display: flex;
  justify-content: space-between;
  align-items: start;
  font-weight: 600;
}

.empty-slot {
  border: 1px dashed var(--line);
  background: var(--input);
  color: var(--muted);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 38, 31, 0.35);
  display: grid;
  place-items: center;
  padding: 20px;
}

.picker {
  width: min(460px, 100%);
  padding: 22px;
  max-height: 80vh;
  overflow: auto;
}

.pick {
  width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  border: 0;
  background: var(--input);
  color: var(--ink);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  text-align: left;
}

.pick small {
  display: block;
}

@media (max-width: 980px) {
  .planner.week {
    grid-template-columns: 1fr;
  }
}
</style>
