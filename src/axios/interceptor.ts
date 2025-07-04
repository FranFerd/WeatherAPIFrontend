import axios from 'axios'
import router from '@/router'
import { clearAuth } from '@/authService/auth'

axios.interceptors.response.use(
  response => response, // Pass successful responses through
  error => {
    // Catch token expiry or invalid token
    if (
      error.response?.status === 401 &&
      typeof error.response.data?.detail === 'string' &&
      error.response.data.detail.toLowerCase().includes("token")
    ) {
      clearAuth() // Clear token, localStorage, etc.
      router.push('/login?expired=true') // Redirect to login
    }

    return Promise.reject(error) // Without this, the error will be handles silently, and catch won't fire
  }
)
