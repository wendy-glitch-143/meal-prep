import { ref } from 'vue';

export const THEMES = [
  { id: 'cream', name: 'Cream', cream: '#f6efe4', paper: '#fffaf3', accent: '#c46b4a' },
  { id: 'midnight', name: 'Midnight', cream: '#1b1f2a', paper: '#252b38', accent: '#8aa4ff' },
  { id: 'ocean', name: 'Ocean', cream: '#e7f3f6', paper: '#f4fbfc', accent: '#2a7d8c' },
  { id: 'berry', name: 'Berry', cream: '#f7eaf0', paper: '#fff6fa', accent: '#b44d7a' },
  { id: 'citrus', name: 'Citrus', cream: '#f8f3df', paper: '#fffbeb', accent: '#d97706' },
  { id: 'forest', name: 'Forest', cream: '#e8efe6', paper: '#f5f8f3', accent: '#3f6f4a' },
];

const theme = ref(localStorage.getItem('prepd_theme') || 'cream');

export function applyTheme(id) {
  const next = THEMES.some((t) => t.id === id) ? id : 'cream';
  theme.value = next;
  localStorage.setItem('prepd_theme', next);
  document.documentElement.dataset.theme = next;
}

export function useTheme() {
  return { theme, themes: THEMES, applyTheme };
}

applyTheme(theme.value);
