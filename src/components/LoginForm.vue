<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

import { useAuthStore } from '@/stores/auth'

import { handleApiErorr } from '@/utils/error'
import { credentialsToUrlSearchParams } from '@/utils/credentials'

import type { Credentials } from '@/types/User' 

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

const message = ref('')
const isErrorMessage = ref(false)
const isSignUp = ref(false)
const isSubmitting = ref(false)

const credentials = ref<Credentials>({
  username: '',
  password: ''
})

function isValidCredentials(username: string, password: string): boolean{
  if(!username || !password){
    window.alert('Please fill in both username and password')
    return false
  }
  return true
}

async function handleLogin(): Promise<void> {
  if(!isValidCredentials(credentials.value.username, credentials.value.password)){
    return
  }
  isSubmitting.value = true

  const formData = credentialsToUrlSearchParams(credentials.value)

  try {
    const response = await authStore.login(formData)
    if(response){
      isErrorMessage.value = false
      message.value = 'Logged in successfully'

      const redirect = route.query.redirect || '/home'
      setTimeout(() => {
        router.push(String(redirect))
        isSubmitting.value = false
      }, 1500);
    }
  } 
  catch (error: unknown) {
    isErrorMessage.value = true
    isSubmitting.value = false
    message.value = handleApiErorr(error, 'Login failed due to an unknown error')
    console.error("Login failed: ", error)
  }
}

function handleSwitch(): void{
  isSignUp.value = !isSignUp.value
}

async function handleSignUp(): Promise<void>{
  if(!isValidCredentials(credentials.value.username, credentials.value.password)){
    return
  }
  isSubmitting.value = true

  const credentialsData = {
    username: credentials.value.username,
    password: credentials.value.password
  }

  try{
    await authStore.signup(credentialsData)
    await authStore.login(credentialsToUrlSearchParams(credentialsData)) 

    isErrorMessage.value = false
    message.value = 'Account created and logged in successfully'

    const redirect = route.query.redirect || '/home'
    setTimeout(() => {
      router.push(String(redirect))
      isSubmitting.value = false
    }, 1500)
    }
  catch (error: unknown) {
    isErrorMessage.value = true
    isSubmitting.value = false
    message.value = handleApiErorr(error, 'Signup failed due to an unknown error')
    console.error("Sign error: ", error)
  }
}
</script>
<template>
<div class="login">
  <div class="login-container" v-if="!isSignUp">
    <h1 class="login-label">Login</h1>
    <form @submit.prevent="handleLogin">
      <label for="username">Username(4-16 characters)</label>
      <div class="input-box" :class="{error: isErrorMessage}">
        <input v-model="credentials.username" :disabled="isSubmitting" placeholder="Username" id="username" minlength="4" maxlength="16" class="input">
      </div>
      <label for="password">Password(4-16 characters)</label>
      <div class="input-box" :class="{error: isErrorMessage}">
        <input v-model="credentials.password" :disabled="isSubmitting" type="password" placeholder="Password" minlength="4" maxlength="16" id="password" class="input">
      </div>
      <div class="submit-box">
        <button type="submit" :disabled="isSubmitting" class="login-button">Login</button>
        <span class="switch-box">
          <div class="switch-box__wrapper">
            <label>Not logged in?</label>
          </div>
          <button type="button" :disabled="isSubmitting" class="signup-button" @click="handleSwitch">Sign up</button>
        </span>
      </div>
    </form>
  </div>
  <div class="login-container" v-if="isSignUp">
    <h1 class="login-label">Sign up</h1>
    <form @submit.prevent="handleSignUp">
      <label for="username">Username(4-16 characters)</label>
      <div class="input-box" :class="{error: isErrorMessage}">
        <input v-model="credentials.username" :disabled="isSubmitting" placeholder="Username" id="username" minlength="4" maxlength="16" class="input">
      </div>
      <label for="password">Password(4-16 characters)</label>
      <div class="input-box" :class="{error: isErrorMessage}">
        <input v-model="credentials.password" :disabled="isSubmitting" type="password" placeholder="Password" minlength="4" maxlength="16" id="password" class="input">
      </div>
      <div class="submit-box">
        <button type="submit" :disabled="isSubmitting" class="login-button">Create account</button>
        <span class="switch-box">
          <div class="switch-box__wrapper">
            <label>Have an account?</label>
          </div>
          <button type="button" :disabled="isSubmitting" class="signup-button" @click="handleSwitch">Login</button>
        </span>
      </div>
    </form>
  </div>
  <div class="message" :class="{error: isErrorMessage}">
    {{ message }}
  </div>
</div>
</template>
<style scoped>
.login{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10%;
}
.login-label{
  margin-bottom: 10px;
}
.input-box{
  margin-top: 10px;
  margin-bottom: 10px;
}
.input-box.error{
  box-shadow: 0px 0px 10px rgb(252, 89, 89);
}
.input{
  font-size: 1em;
  width: 400px;
  height: 20px;
  padding: 8px;
  border-radius: 5px;
  border: none;
}
.input:focus{
  box-shadow: 0px 0px 10px rgb(89, 89, 252);
  outline: none;
}
.login-button, .signup-button{
  height: 30px;
  width: 80px;
  background-color: hsl(180, 100%, 50%);
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-right: auto;
  }
.login-button:hover, .signup-button:hover{
  background-color: hsl(180, 100%, 40%);
  transition: background-color 0.3s ease
}
.submit-box{
  display: flex;
  margin-top: 10px;
}
.switch-box{
  display: flex;
  flex-direction: row;
  gap: 1em
}
.switch-box__wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.message{

  margin-top: 2em;
  font-size: 2em;
  color: rgb(0, 174, 0);
}
.message.error{
  color: red;
}
</style>