import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from '@/views/HomePageView.vue'
import WeatherTodayView from '@/views/WeatherTodayView.vue'
import WeatherForWeekVIew from '@/views/WeatherForWeekVIew.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomePageView,
    },
    {
      path: '/weather/today',
      name: 'weatherToday',
      component: WeatherTodayView
    },
    {
      path: '/weather/week',
      name: 'weatherWeek',
      component: WeatherForWeekVIew
    }
  ],
})

export default router
