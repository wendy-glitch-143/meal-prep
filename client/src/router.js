import { createRouter, createWebHistory } from 'vue-router';
import { getToken } from './api';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';
import MenuView from './views/MenuView.vue';
import RecipeDetailView from './views/RecipeDetailView.vue';
import PlannerView from './views/PlannerView.vue';
import GroceryView from './views/GroceryView.vue';
import SettingsView from './views/SettingsView.vue';
import PublicMenuView from './views/PublicMenuView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/planner' },
    { path: '/login', component: LoginView, meta: { guest: true } },
    { path: '/signup', component: SignupView, meta: { guest: true } },
    { path: '/view', component: PublicMenuView, meta: { public: true } },
    { path: '/view/:id', component: RecipeDetailView, meta: { public: true } },
    { path: '/menu', component: MenuView, meta: { auth: true } },
    { path: '/menu/:id', component: RecipeDetailView, meta: { auth: true } },
    { path: '/planner', component: PlannerView, meta: { auth: true } },
    { path: '/grocery', component: GroceryView, meta: { auth: true } },
    { path: '/settings', component: SettingsView, meta: { auth: true } },
  ],
});

router.beforeEach((to) => {
  const loggedIn = Boolean(getToken());
  if (to.meta.auth && !loggedIn) return '/login';
  if (to.meta.guest && loggedIn) return '/planner';
});

export default router;
