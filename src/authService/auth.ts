import axios from 'axios'
import { ref } from 'vue'

import type { Credentials } from '@/types/User'

const isAuthenticated = ref(false)
const authToken = ref<string | null>(localStorage.getItem('token') || null) // JWT token ref

function setAuth(token: string): void {
  authToken.value = token
  isAuthenticated.value = true
  localStorage.setItem('token', token) // Store the token in localStorage to survive page reloads
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}` // Set the default authorization header in Axios, so all future 
}                                                                    // requests will automatically send the token 

function clearAuth(): void {
  authToken.value = null
  isAuthenticated.value = false
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
}

async function login(credentials: URLSearchParams): Promise<void> {
  try {
    const response = await axios.post('http://localhost:8000/token', credentials)
    setAuth(response.data.access_token)
  } catch (error) {
    clearAuth()
    throw error
  }
}

async function logout(): Promise<void>{ // No logout endpoint for now
  try{
    await axios.post('https://localhost:8000/logout', {}, { //Usually the logout request has an empty body ({}) but requires an Authorization header to identify the user token.
      headers: {                                          // Axios can’t guess to add Authorization headers automatically, so I explicitly add:
        Authorization: `Bearer ${authToken.value}`
      }
    })
  } finally{
    clearAuth()
    window.location.assign('/login?logout=sucess')
  }
}

function init(): void {
  if (authToken.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken.value}`
    isAuthenticated.value = true
  }
}

export { 
  isAuthenticated,
  authToken, 
  login, 
  clearAuth, 
  init, 
  logout }