<script setup>
  import { useAuthStore } from '@/stores/auth';
  import { clearAuth } from '@/authService/auth';
  import { useRoute } from 'vue-router';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const showDropdown = ref(false)
  const username = computed(() => auth.currentUser)
  const isLoggedIn = computed(() => auth.isLoggedIn)

  onMounted(async() => {
    await auth.initialize()
    console.log('Current auth state:', {
      isLoggedIn: isLoggedIn.value,
      username: username.value,
      token: localStorage.getItem('token')
    }) 
  })



  function isActive(urlComponent){
      if (route.fullPath.includes(urlComponent)){
        return true
      }
    }

  function handleLogout(){
    clearAuth()
  
    window.location.href = '/login'
  }

  function redirectLogin(){
    router.push('/login')
  }

</script>

<template>
  <section>
    <nav class="navbar">
      <ul class="menuItems">
        <li><a :class="{active: isActive('home')}" href='/home'>Home</a></li>
        <li><a :class="{active: isActive('weather/today')}" href='/weather/today'>Weather today</a></li>
        <li><a :class="{active: isActive('weather/week')}" href='/weather/week'>Weather for a week</a></li>
        <li class="dropdown-wrapper">
          <div class="account-box-dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
            <svg class="account-icon" width="25px" 
            height="25px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="profile_x2C__person"> <g> <g> <g> <path d="M16,31C7.729,31,1,24.271,1,16S7.729,1,16,1s15,6.729,15,15S24.271,31,16,31z M16,2C8.28,2,2,8.28,2,16 s6.28,14,14,14s14-6.28,14-14S23.72,2,16,2z" fill="#263238"></path> </g> </g> </g> <g> <g id="team_3_"> <g> <g> <g> <g> <path d="M23.64,20.713l-4.762-1.652l-0.323-2.584c-0.215,0.307-0.523,0.546-0.924,0.671l0.293,2.345 c0.023,0.189,0.152,0.349,0.332,0.41l5.055,1.756c0.9,0.314,1.689,1.427,1.689,2.381v-0.007c0,0.276,0.224,0.5,0.5,0.5 c0.275,0,0.499-0.223,0.5-0.498C25.997,22.656,24.94,21.168,23.64,20.713z" fill="#263238"></path> </g> </g> </g> </g> <g> <g> <g> <g> <path d="M6.5,24.532c-0.276,0-0.5-0.224-0.5-0.5v0.007c0-1.379,1.059-2.871,2.359-3.326l4.762-1.641 l0.012-0.28c0.034-0.274,0.289-0.465,0.559-0.434c0.273,0.034,0.468,0.284,0.434,0.559l-0.051,0.589 c-0.023,0.189-0.153,0.348-0.333,0.41l-5.054,1.742C7.789,21.973,7,23.086,7,24.039v-0.007C7,24.309,6.776,24.532,6.5,24.532 z" fill="#263238"></path> </g> </g> </g> </g> <g> <g> <g> <g> <g> <path d="M16,18.039c-2.779,0-4.192-1.844-4.201-6.469c-0.002-1.174,0.123-2.363,1.227-3.469 C13.729,7.396,14.729,7.039,16,7.039s2.271,0.357,2.975,1.063c1.104,1.105,1.229,2.295,1.227,3.469 C20.192,16.195,18.779,18.039,16,18.039z M16,8.039c-1.009,0-1.75,0.252-2.267,0.769c-0.632,0.633-0.938,1.2-0.935,2.761 c0.008,4.018,1.055,5.471,3.201,5.471s3.193-1.453,3.201-5.471c0.003-1.561-0.303-2.128-0.935-2.761 C17.75,8.291,17.009,8.039,16,8.039z" fill="#263238"></path> </g> </g> </g> </g> </g> </g> </g> </g> </g> ></svg>
            <span v-if="isLoggedIn" class="user-name">
              Welcome, {{ username }}
              <img width="20" height="20" src="https://img.icons8.com/ios/50/expand-arrow--v1.png" alt="expand-arrow" class="dropdown-icon" :class="{'rotate-180' : showDropdown}"/>
            </span>
            <span v-else @click="redirectLogin">Login</span>

            
            <transition name="fade">
              <div v-if="showDropdown && isLoggedIn" class="dropdown-content">
                <button @click="handleLogout">Logout</button>
              </div>
            </transition>
          </div>
        </li>
      </ul>
    </nav>
  </section>
</template>

<style scoped>
.navbar {
  border-radius: 30px;
  margin-bottom: 25px;
  background-color: #feffda;
}

.menuItems {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 0;
}

.menuItems li {
  margin: 20px;
  position: relative;
}

.dropdown-wrapper {
  position: relative;
}

.account-box-dropdown {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  position: relative;
}

.account-icon{
  transition: all 0.3s ease;
}

.dropdown-icon {
  transition: transform 0.3s ease;
  transform-origin: center;
}

.dropdown-icon.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
  z-index: 100;
  border-radius: 4px;
  overflow: hidden;
}

.dropdown-content button {
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 0.7em;
}

.dropdown-content button:hover {
  background-color: #ddd;
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Keep existing hover styles */
.menuItems li a, 
.menuItems li div {
  text-decoration: none;
  color: #8f8f8f;
  font-size: 24px;
  transition: all 0.3s ease-in-out;
  text-transform: uppercase;
}

.menuItems li a.active, 
.menuItems li div.active {
  color: #7cdfdb;
}

.menuItems li a:hover, 
.menuItems li div:hover {
  color: #7cdfdb;
  text-shadow: 0px -1px 0px #5da9a7;
  .account-icon{
    transform: scale(1.1);
    }
}
</style>