<script setup>
import { computed } from 'vue';
import { categoryIcon } from '../categoryIcons';

const props = defineProps({
  name: { type: String, default: 'sides' },
});

const icon = computed(() => categoryIcon(props.name));
</script>

<template>
  <svg class="cat-icon" viewBox="0 0 32 32" aria-hidden="true">
    <g v-if="icon === 'book'">
      <path d="M7 7h13a2 2 0 0 1 2 2v16H9a2 2 0 0 0-2 2V7z" />
      <path d="M7 7v18" />
      <path d="M13 4.5c1.2 1 2.6 1 3.8 0v5.2c-1.2.8-2.6.8-3.8 0V4.5z" />
      <path d="M20 14h-6M20 18h-6" />
    </g>
    <g v-else-if="icon === 'breakfast'">
      <path d="M8 20h8v4H8z" />
      <path d="M9 20V11l3 2 3-2v9" />
      <path d="M20 14h3a3 3 0 0 1 0 6h-3v-6z" />
      <path d="M20 15.5V12" />
    </g>
    <g v-else-if="icon === 'lunch'">
      <path d="M6 18c0 5 4 8 10 8s10-3 10-8H6z" />
      <path d="M22 12c2 1 3 3 3 5" />
      <path d="M13 8c0 2 .8 3.5 2 3.5S17 10 17 8" />
      <path d="M16 7.5V5" />
    </g>
    <g v-else-if="icon === 'dessert'">
      <path d="M7 18h18l-2 8H9l-2-8z" />
      <path d="M8 18c1-5 5-8 8-8s7 3 8 8" />
      <path d="M16 7c0 2-1.4 3-2.4 3" />
      <circle cx="18.5" cy="10" r="1.2" />
      <circle cx="21" cy="12" r="1.2" />
    </g>
    <g v-else-if="icon === 'dinner'">
      <path d="M6 20h12" />
      <path d="M8 20a6 6 0 0 1 12 0" />
      <path d="M14 8v3" />
      <path d="M22 13c2 0 3.5 1.6 3.5 4v7" />
      <path d="M21 24h7" />
    </g>
    <g v-else-if="icon === 'sides'">
      <path d="M7 16c0 6 4 10 9 10s9-4 9-10H7z" />
      <path d="M10 16c1-3 3-5 6-5s5 2 6 5" />
    </g>
    <g v-else-if="icon === 'snacks'">
      <path d="M8 12h8l1.5 14h-11L8 12z" />
      <path d="M8 12c0-2 2-4 4-4s4 2 4 4" />
      <path d="M21 14c2 1 3 3 2 7l-3 5" />
      <path d="M19 16.5c1 .4 2 .2 2.6-.6" />
    </g>
    <g v-else-if="icon === 'soups'">
      <path d="M8 16h16l-1.5 10H9.5L8 16z" />
      <path d="M7 16h18" />
      <path d="M10 16V13h12v3" />
      <path d="M13 10c0 1.4.8 2.2 1.8 2.2" />
      <path d="M18 9c0 1.4.8 2.2 1.8 2.2" />
    </g>
    <g v-else-if="icon === 'vegan'">
      <path d="M7 18c0 5 4 8 9 8s9-3 9-8H7z" />
      <path d="M12 17c-1-4 2-8 5-8" />
      <path d="M16 18c1-4 4-6 6-5" />
      <path d="M14 16c0-3-2-5-4-5" />
    </g>
    <g v-else-if="icon === 'chicken'">
      <path d="M10 22c2 3 7 4 11 1 3-2 4-6 2-9-2-4-7-5-10-2" />
      <path d="M10 14c-2-1-4 0-5 2 2 0 3 1 4 3" />
      <path d="M21 12c1-2 3-3 4-2" />
      <circle cx="20" cy="13" r="0.8" fill="currentColor" />
    </g>
    <g v-else-if="icon === 'pork'">
      <path d="M8 14c0-3 3-6 8-6s8 3 8 6v6c0 3-3 5-8 5s-8-2-8-5v-6z" />
      <path d="M8 16h16" />
      <path d="M12 10v4M20 10v4" />
    </g>
    <g v-else-if="icon === 'beef'">
      <path d="M7 13c2-4 16-4 18 0v8c-2 4-16 4-18 0v-8z" />
      <path d="M11 13v8M21 13v8" />
      <path d="M7 17h18" />
    </g>
    <g v-else-if="icon === 'fish'">
      <path d="M6 16c6-7 14-7 20 0-6 7-14 7-20 0z" />
      <path d="M6 16l-3-4v8l3-4z" />
      <circle cx="22" cy="14.5" r="0.9" fill="currentColor" />
    </g>
    <g v-else-if="icon === 'pasta'">
      <path d="M6 20c2 5 18 5 20 0" />
      <path d="M8 12c4 2 12 2 16 0" />
      <path d="M7 16c5 2 13 2 18 0" />
      <path d="M10 8c3 1 9 1 12 0" />
    </g>
    <g v-else>
      <path d="M7 18c1 5 4 8 9 8s8-3 9-8H7z" />
      <path d="M9 18c1-4 3-7 7-7s6 3 7 7" />
      <path d="M16 7v3" />
    </g>
  </svg>
</template>

<style scoped>
.cat-icon {
  width: 1.8rem;
  height: 1.8rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
