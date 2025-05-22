import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from '@/views/HomePageView.vue'
import WeatherTodayView from '@/views/WeatherTodayView.vue'
import WeatherForWeekVIew from '@/views/WeatherForWeekVIew.vue'
import { isAuthenticated, init } from '@/authService/auth'
import AutenticationView from '@/views/AutenticationView.vue'
import TestView from '@/views/TestView.vue'
import WeatherSearchView from '@/views/WeatherSearchView.vue'

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
      path: '/login',
      name: 'login',
      component: AutenticationView,
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
      path: '/weather/week/:address',
      name: 'weatherWeek',
      component: WeatherForWeekVIew,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/weather/today',
      name: 'searchLocationToday',
      component: WeatherSearchView,
      meta: {requiresAuth: true}
    },
    {
      path: '/weather/week',
      name: 'searchLocationWeek',
      component: WeatherSearchView,
      meta: {requiresAuth: true}
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: {requiresAuth: false}
    }
  ],
})

router.beforeEach(async(to) => {
  if (isAuthenticated.value === null) {
    init()
  }

  if(to.meta.hideForAuth && isAuthenticated.value){
    return '/home'
  }

  if(to.meta.requiresAuth && !isAuthenticated.value){
    return {
      path: '/login',
      query: {redirect: to.fullPath}
    }
  }
  return true
})
export default router
