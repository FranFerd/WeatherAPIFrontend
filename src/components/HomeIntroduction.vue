<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isLoggedIn)

</script>

<template>
    <div class="welcomeFlex">
        <h1 class="weather-api-app-name">
            Weather API
        </h1>
        <p class="app-info">an application that will provide you all the necessary info about the weather</p>
        <div class="authentication" v-if="!isLoggedIn">
            <span class="signInUp">
                <a href="/login">Sign in</a>
            </span>
            <span class="signInUp">
                <a>Sign up</a>
            </span>
        </div>
    </div>
    <br>
</template>

<style scoped>

.welcomeFlex{
    display: flex;
    flex-direction: column;
    height: 50%;
    width: 100%;
    color: #727272;
    text-align: center;
}
.weather-api-app-name{
    color: #0579feec;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 120px;
}
.app-info{
    font-size: 80px;
}
.authentication{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 500px;
}

.signInUp{
    padding: 20px;
    background-color: rgb(209, 240, 230);
    border-radius: 20px;
    cursor: pointer;
}
.signInUp a{
    text-decoration: none;
    font-size: 40px;
    color: #8f8f8f;
}

.signInUp:hover{
    background-color: rgb(143, 222, 197);
    transition: background-color 0.3s;
}
.signInUp:hover a{
    color: #5f5d5d;;
    transition: color 0.3s;
}
   
</style>