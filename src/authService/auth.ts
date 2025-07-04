import axios from 'axios'
import { ref } from 'vue'

import { Credentials, TokenData, UserDb } from '@/types/User'

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

async function login(credentials: URLSearchParams): Promise<TokenData> {
  const response = await axios.post('http://localhost:8000/token', credentials)
  return response.data
}

async function signup(credentials: Credentials): Promise<UserDb>{
  const response = await axios.post("http://localhost:8000/signup", credentials)
  return response.data
}

async function logout(): Promise<void>{ // No logout endpoint for now
    await axios.post('https://localhost:8000/logout', {}, { //Usually the logout request has an empty body ({}) but requires an Authorization header to identify the user token.
      headers: {                                          // Axios can’t guess to add Authorization headers automatically, so I explicitly add:
        Authorization: `Bearer ${authToken.value}`
      }
    })
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
  signup, 
  clearAuth, 
  setAuth,
  init, 
  logout }