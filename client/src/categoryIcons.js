export const CATEGORY_ICONS = [
  'book',
  'breakfast',
  'lunch',
  'dessert',
  'dinner',
  'sides',
  'snacks',
  'soups',
  'vegan',
  'chicken',
  'pork',
  'beef',
  'fish',
  'pasta',
  'rice',
];

export const DEFAULT_CATEGORY_ICONS = {
  chicken: 'chicken',
  pork: 'pork',
  beef: 'beef',
  vegetables: 'vegan',
};

export function categoryIcon(name) {
  return CATEGORY_ICONS.includes(name) ? name : 'sides';
}
