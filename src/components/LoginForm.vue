<script setup>
import { ref } from 'vue'
import { login } from '@/authService/auth'

const credentials = ref({
  username: '',
  password: ''
})

async function handleLogin() {
  try {
    await login(credentials.value)
    // Redirect on success
  } catch (error) {
    alert('Login failed')
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="credentials.username" placeholder="Username">
    <input v-model="credentials.password" type="password" placeholder="Password">
    <button type="submit">Login</button>
  </form>
</template>