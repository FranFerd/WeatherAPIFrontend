<script setup>
import { ref } from 'vue'
import { login } from '@/authService/auth'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const message = ref(null)
const credentials = ref({
  username: '',
  password: ''
})

async function handleLogin() {
  try {
    await login(credentials.value)

    console.log('Login state:', authStore.isLoggedIn) // true
    console.log('Username:', authStore.username) // should show username

    authStore.username = credentials.value.username
    authStore.isLoggedIn = true
    message.value = 'Logged in successfully'
    // Redirect on success
    const redirect = route.query.redirect || '/home'
    setTimeout(() => {
      router.push(redirect)
    }, 2000);

  } catch (error) {
    console.error('Full error:', error)
    console.error('Response data:', error.response?.data)
    alert(error.response?.data?.msg || 'Login failed' + error.message)
  }
}
</script>

<template>
  <div class="login-container">
    <h1 class="login-label">Login</h1>
    <form @submit.prevent="handleLogin">
      <label for="username">Username(4-16 characters)</label>
      <div class="username-box">
        <input v-model="credentials.username" placeholder="Username" id="username" minlength="4" maxlength="16" class="username-input">
      </div>
      <label for="password">Password(4-16 characters)</label>
      <div class="password-box">
        <input v-model="credentials.password" type="password" placeholder="Password" minlength="4" maxlength="16" id="password" class="password-input">
      </div>
      <button type="submit" class="login-button">Login</button>
      <label class="not-logged-in">Not logged in?</label>
      <button class="signup-button">Sign up</button>
    </form>
  </div>
  <div class="message">
    {{ message }}
  </div>

</template>

<style scoped>
  .login-container{
    display: flex;
    margin-top: 10%;
    flex-direction: column;
    align-items: center;
  }
  .login-label{
    margin-bottom: 10px;
  }
  .username-box{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .username-input{
    font-size: 1em;
    width: 400px;
    height: 20px;
    padding: 8px;
    border-radius: 5px;
    border: none;
  }
  .username-input:focus{
    box-shadow: 0px 0px 10px rgb(89, 89, 252);
    outline: none;
  }
  .password-input{
    font-size: 1em;
    width: 400px;
    height: 20px;
    padding: 8px;
    border-radius: 5px;
    border: none
  }
  .password-input:focus{
    box-shadow: 0px 0px 20px rgb(89, 89, 252);
    outline: none;
  }

  .password-input{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .login-button{
    margin-top: 10px;
    height: 30px;
    width: 80px;
    background-color: hsl(180, 100%, 50%);
    border-radius: 5px;
    border: none;
    cursor: pointer;
    }
  .login-button:hover{
    background-color: hsl(180, 100%, 40%);
    transition: background-color 0.3s ease
  }
  .not-logged-in{
    margin-left: 30.75%;
    margin-right: 0.3em;
  }
  .signup-button{
    height: 30px;
    width: 80px;
    background-color: hsl(180, 100%, 50%);
    border-radius: 5px;
    border: none;
    cursor: pointer;
  }
  .message{
    position: absolute;
    left: 30%;
    margin-top: 2em;
    font-size: 2em;
    color: rgb(0, 163, 0);
  }

</style>