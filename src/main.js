import './assets/main.css'
import { init } from './authService/auth'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

init()

app.mount('#app')


