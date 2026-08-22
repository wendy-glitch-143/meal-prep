<script setup>
defineProps({
  recipe: { type: Object, required: true },
});
</script>

<template>
  <article class="recipe-card card" :style="{ '--accent': recipe.color }">
    <div class="emoji">{{ recipe.emoji }}</div>
    <span class="chip">{{ recipe.meal_type }}</span>
    <h3>{{ recipe.name }}</h3>
    <p>{{ recipe.description }}</p>
    <small>{{ recipe.prep_minutes }} min · {{ recipe.servings }} servings</small>
  </article>
</template>

<style scoped>
.recipe-card {
  padding: 18px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background:
    linear-gradient(180deg, var(--accent), transparent 92px),
    var(--paper);
}

.emoji {
  font-size: 2rem;
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
