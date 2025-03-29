import axios from 'axios'
import { ref } from 'vue'

const isAuthenticated = ref(false)
const authToken = ref(localStorage.getItem('token') || null)

function setAuth(token) {
  authToken.value = token
  isAuthenticated.value = true
  localStorage.setItem('token', token)
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

function clearAuth() {
  authToken.value = null
  isAuthenticated.value = false
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
}

async function login(credentials) {
  try {
    const response = await axios.post('http://localhost:5000/login', credentials,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    setAuth(response.data.access_token)
    return true
  } catch (error) {
    clearAuth()
    throw error
  }
}

function init() {
  if (authToken.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken.value}`
  }
}

export { isAuthenticated, authToken, login, clearAuth, init }