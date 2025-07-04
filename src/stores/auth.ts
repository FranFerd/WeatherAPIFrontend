import { defineStore } from 'pinia'
import { ref } from 'vue'

import { login, logout, isAuthenticated, authToken, init, signup, clearAuth, setAuth } from '@/authService/auth'

import type { Credentials, TokenData, UserDb } from '@/types/User'

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
      return payload.sub || payload.identity || payload.username // Contains username
    } catch {
      return null
    }
  }
  
  async function userLogin(credentials: URLSearchParams): Promise<TokenData> {
    try{
      const tokenData = await login(credentials)
      setAuth(tokenData.access_token)
      username.value = decodeUsername(authToken.value)
      return tokenData
    }
    catch(error){
      clearAuth()
      throw error
    }
  }
  
  async function userLogout(): Promise<void> {
    await logout()
    username.value = null
  }

  async function userSignup(credentials: Credentials): Promise<UserDb>{
    return await signup(credentials) // No catch, because no need for clearing tokens, logging. Unlike userLogin
  }
  
  return {
    username,
    isLoggedIn,
    initialize,
    login: userLogin,
    logout: userLogout,
    signup: userSignup
  }
})