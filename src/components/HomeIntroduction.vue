<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isLoggedIn)
const router = useRouter()



</script>

<template>
    <div class="introduction">
        <div class="logo-container">
            <img src="/src/assets/icons/logo.png" alt="Sunny Side Logo" class="logo" />
        </div>
        <div class="quick-intro-text">
            <div class="app-name">
                <h1 class="app-info-text">SunnySide</h1>
            </div>
            <div class="app-info">
                <p class="app-info-text">The weather app that will brighten your day!</p>
                <p class="app-info-text">Get accurate and up-to-date weather information.</p>
                <p class="app-info-text">Check the weather forecast for your location.</p>
                <p class="app-info-text">Stay informed about the weather conditions.</p>
                <p class="app-info-text">Plan your day with confidence.</p>
                <p class="app-info-text">SunnySide is your go-to weather companion.</p>
            </div>
        </div>
        <!-- <div class="quick-intro-text">
            <p class="app-info">SunnySide will provide you all the necessary info about the weather.</p>
        </div> -->
    </div>
    <br>
</template>

<style scoped>

.introduction{
    display: flex;
    flex-wrap: wrap;
    color: #727272;
    text-align: center;
    justify-content: center;
    gap: 50px;
}
    
.logo{
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: transform 0.3s, box-shadow 0.3s, filter 0.3s;
}
.logo:hover{
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    transform: scale(1.05);
    filter: brightness(1.2);
}
.quick-intro-text{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    width: 1000px;
    height: 400px;
}
.app-info-text{
    font-size: 30px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}

   
</style>