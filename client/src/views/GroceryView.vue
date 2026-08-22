<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../api';
import { addDays, formatDay, lastWeek, rememberWeek } from '../week';

const route = useRoute();
const weekStart = ref(route.query.week || lastWeek());
const groups = ref({});
const error = ref('');
const checked = ref({});

const aisles = computed(() => Object.keys(groups.value));
const total = computed(() => Object.values(groups.value).reduce((sum, items) => sum + items.length, 0));

async function load() {
  error.value = '';
  try {
    const data = await api(`/api/plans/${weekStart.value}/grocery`);
    groups.value = data.groups || {};
  } catch (err) {
    error.value = err.message;
  }
}

onMounted(() => {
  rememberWeek(weekStart.value);
  load();
});
watch(weekStart, load);
</script>

<template>
  <main class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Shop once</p>
        <h1>Grocery list</h1>
        <p>
          Auto-built from recipes in the week of {{ formatDay(new Date(`${weekStart}T00:00:00`)) }}
          to {{ formatDay(addDays(new Date(`${weekStart}T00:00:00`), 6)) }}.
        </p>
      </div>
      <router-link class="btn btn-primary" :to="{ path: '/planner', query: { week: weekStart } }">
        Edit planner
      </router-link>
    </header>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="!total" class="empty card">
      No meals planned yet. Add recipes to your week and the list will appear here.
    </p>

    <section v-else class="aisles">
      <article v-for="aisle in aisles" :key="aisle" class="card aisle">
        <h2>{{ aisle }}</h2>
        <label v-for="item in groups[aisle]" :key="item.name" class="item">
          <input v-model="checked[item.name]" type="checkbox" />
          <span :class="{ done: checked[item.name] }">{{ item.name }}</span>
        </label>
      </article>
    </section>
  </main>
</template>

<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
  margin-bottom: 24px;
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

.aisles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.aisle {
  padding: 20px;
}

h2 {
  margin: 0 0 12px;
}

.item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--line);
}

.done {
  text-decoration: line-through;
  color: var(--muted);
}
</style>
