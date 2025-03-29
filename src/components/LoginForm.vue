<script setup>
import { ref } from 'vue'
import { login } from '@/authService/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const credentials = ref({
  username: '',
  password: ''
})

async function handleLogin() {
  try {
    const response =  await login(credentials.value)
    console.log('Login successful!', response)
    // Redirect on success
    router.push('/home')
  } catch (error) {
    console.error('Full error:', error)
    console.error('Response data:', error.response?.data)
    alert(error.response?.data?.msg || 'Login failed' + error.message)
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