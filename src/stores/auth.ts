import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { login, logout, isAuthenticated, authToken, init } from '@/authService/auth'

import type { Credentials } from '@/types/User'

export const useAuthStore = defineStore('auth', () => {
  const username = ref<string | null>(null)

  const isLoggedIn = isAuthenticated // not ref, just giving it a different name. Any changes to isAuthenticated change isLoggedIn

  async function initialize(): Promise<void> {
    init() // set axios header and check localstorage for token
    if (authToken.value && isAuthenticated.value) {
      username.value = decodeUsername(authToken.value)
    }
  }
  
  // Helper to decode JWT
  function decodeUsername(token: string | null): string | null {
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub || payload.identity || payload.username
    } catch {
      return null
    }
  }
  
  async function userLogin(credentials: Credentials): Promise<void> {
    await login(credentials)
    username.value = decodeUsername(authToken.value)
  }
  
  async function userLogout(): Promise<void> {
    await logout()
    username.value = null
  }
  
  return {
    username,
    isLoggedIn,
    initialize,
    login: userLogin,
    logout: userLogout,
  }
})