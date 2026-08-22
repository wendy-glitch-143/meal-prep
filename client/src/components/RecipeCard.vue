<script setup>
import { computed } from 'vue';

const props = defineProps({
  recipe: { type: Object, required: true },
});

const isAvailable = computed(() => Number(props.recipe.available) !== 0);
const isNew = computed(() => {
  if (!props.recipe.created_at) return false;
  return Date.now() - new Date(props.recipe.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
});
</script>

<template>
  <article class="recipe-card card" :class="{ unavailable: !isAvailable }" :style="{ '--accent': recipe.color }">
    <span v-if="isNew" class="badge">New</span>
    <div class="emoji">{{ recipe.emoji }}</div>
    <span class="chip">{{ recipe.category_label || recipe.category }}</span>
    <h3>{{ recipe.name }}</h3>
    <p>{{ recipe.description }}</p>
    <small>{{ recipe.prep_minutes }} min · {{ recipe.servings }} servings</small>
  </article>
</template>

<style scoped>
.recipe-card {
  position: relative;
  padding: 18px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background:
    linear-gradient(180deg, var(--accent), transparent 92px),
    var(--paper);
}

.recipe-card.unavailable {
  opacity: 0.5;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--terracotta);
  color: #fffaf3;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.emoji {
  font-size: 2rem;
}

.chip {
  align-self: start;
  width: fit-content;
}

h3 {
  margin: 4px 0 0;
}

p,
small {
  color: var(--muted);
  margin: 0;
}

p {
  flex: 1;
}
</style>
