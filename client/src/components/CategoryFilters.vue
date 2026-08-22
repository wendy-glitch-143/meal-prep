<script setup>
import CategoryIcon from './CategoryIcon.vue';

defineProps({
  categories: { type: Array, default: () => [] },
  modelValue: { type: String, default: 'all' },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="cats">
    <button
      class="cat"
      :class="{ active: modelValue === 'all' }"
      type="button"
      @click="$emit('update:modelValue', 'all')"
    >
      <CategoryIcon name="book" />
      <span>All Recipes</span>
    </button>
    <button
      v-for="cat in categories"
      :key="cat.slug"
      class="cat"
      :class="{ active: modelValue === cat.slug }"
      type="button"
      @click="$emit('update:modelValue', cat.slug)"
    >
      <CategoryIcon :name="cat.icon" />
      <span>{{ cat.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.cats {
  display: flex;
  flex-wrap: nowrap;
  gap: 18px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 22px;
}

.cat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 64px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 0.78rem;
  cursor: pointer;
  white-space: nowrap;
}

.cat:not(.active) {
  color: var(--muted);
}

.cat.active {
  color: var(--terracotta);
  font-weight: 600;
}
</style>
