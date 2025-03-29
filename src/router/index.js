import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from '@/views/HomePageView.vue'
import WeatherTodayView from '@/views/WeatherTodayView.vue'
import WeatherForWeekVIew from '@/views/WeatherForWeekVIew.vue'
import { isAuthenticated, init } from '@/authService/auth'
import AutenticationView from '@/views/AutenticationView.vue'

init()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomePageView,
      meta: {requiresAuth: false}
    },
    {
      path: '/weather/today/:address',
      name: 'weatherToday',
      component: WeatherTodayView,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/weather/week',
      name: 'weatherWeek',
      component: WeatherForWeekVIew,
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name: 'login',
      component: AutenticationView,
      meta: {requiresAuth: false}
    }
  ],
})

router.beforeEach((to) => {
  // 1. Always allow navigation to non-protected routes
  if (!to.meta.requiresAuth) {
    return true // Continue navigation
  }

  // 2. Check authentication for protected routes
  if (!isAuthenticated.value) {
    // 3. Redirect to login with return URL
    return {
      path: '/login',
      query: { redirect: to.fullPath } // Save where they came from
    }
  }

  // 4. Allow navigation for authenticated users
  return true
})
export default router
