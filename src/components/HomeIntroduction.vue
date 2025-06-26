<script setup lang="ts">
</script>
<template>
    <div class="introduction">
        <div class="logo-container">
            <img src="/src/assets/icons/logo.png" alt="Sunny Side Logo" class="logo" />
        </div>
        <div class="quick-intro-text">
            <div class="app-info">
                <p class="app-info-text">The weather app that will brighten your day!</p>
                <p class="app-info-text">Get accurate and up-to-date weather information.</p>
                <p class="app-info-text">Check the weather forecast for your location.</p>
                <p class="app-info-text">Stay informed about the weather conditions.</p>
                <p class="app-info-text">Plan your day with confidence.</p>
                <p class="app-info-text">SunnySide is your go-to weather companion.</p>
            </div>
        </div>
    </div>
    <br>
</template>
<style scoped>
.introduction{
    margin-top: 200px;
    display: flex;
    flex-wrap: wrap;
    color: #727272;
    text-align: center;
    align-items: center;
    justify-content: center;
    gap: 100px;
}
.logo{
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: transform 0.5s, box-shadow 0.3s, filter 0.5s;
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
}
.app-info{
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    flex-direction: column;
}
.app-info-text{
    font-size: 30px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}  
</style>