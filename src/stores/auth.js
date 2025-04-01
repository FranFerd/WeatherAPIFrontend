// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, isAuthenticated, authToken, init } from '@/authService/auth'

export const useAuthStore = defineStore('auth', () => {
  const username = ref(null)

    // Computed properties
    const _isLoggedIn = ref(false) // Internal state
  
    // Computed properties
    const isLoggedIn = computed({
      get: () => isAuthenticated.value,
      set: (val) => { _isLoggedIn.value = val }
    })
    const currentUser = computed(() => username.value)
  
  // Initialize auth state
  async function initialize() {
    init()
    if (isAuthenticated.value) {
      // Extract username from token (you'll need to decode JWT)
      username.value = decodeUsername(authToken.value)
    }
  }
  
  // Helper to decode JWT
  function decodeUsername(token) {
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub || payload.identity || payload.username
    } catch {
      return null
    }
  }
  
  // Login action
  async function userLogin(credentials) {
    await login(credentials)
    username.value = decodeUsername(authToken.value)
    _isLoggedIn.value = true
  }
  
  // Logout action
  async function userLogout() {
    await logout()
    username.value = null
    _isLoggedIn.value = false
  }
  

  return {
    username,
    isLoggedIn,
    currentUser,
    initialize,
    login: userLogin,
    logout: userLogout,
  }
})