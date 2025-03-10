import { computed } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
// ---
import LayoutHeaderToolbar from '@/components/layout/LayoutHeaderToolbar.vue';
//---
import LoginView from '@/views/LoginView.vue';
// ---
const routes = [
  // --- login
  {
    path: '/login',
    name: 'login',
    meta: {
      requiresAuth: false,
      layout: LoginView,
    },
    component: LoginView,
  },
  // --- user
  {
    path: '/',
    name: 'home',
    redirect: '/user',
    meta: {
      requiresAuth: true,
      layout: LayoutHeaderToolbar,
      title: 'home',
    },   
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      requiresAuth: true,
      layout: LayoutHeaderToolbar,
      title: 'user',
    },
    component: () => import('@/views/UsersView.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login',
  },
];
export default (store) => {
  const { BASE_URL } = import.meta.env
  const router = createRouter({
    history: createWebHistory(BASE_URL),
    routes
  })
  const loggedIn = computed(() => store?.state?.auth?.status?.loggedIn)
  const tokenExpiration = computed(() => store?.state?.auth?.user?.tokenExpiration)
  if (loggedIn.value && tokenExpiration.value) {
    const nowDate = new Date()
    const expiresDate = new Date(tokenExpiration.value)
    if (expiresDate < nowDate) {
      store.dispatch('auth/LOGOUT')
      router.replace({ name: 'login' })
    }
  }
  router.beforeEach((to, from, next) => {
    if (to.name === 'login' && loggedIn.value) {
      next({ path: '/' })
    } else if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!loggedIn.value) {
        next({
          name: 'login'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })
  return router
}
