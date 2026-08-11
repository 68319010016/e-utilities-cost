import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AppLayout from '../components/layout/AppLayout.vue';

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
        { path: '', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'expenses', name: 'ExpenseList', component: () => import('../views/ExpenseListView.vue') },
        { path: 'settings/categories', name: 'CategoryManage', component: () => import('../views/CategoryManageView.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.accessToken) {
    next('/login');
  } else {
    next();
  }
});

export default router;