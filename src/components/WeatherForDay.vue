<script setup>
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
</script>

<template>
<div class="weather-info-container">
    <h2>Today, 22 may</h2>
</div>

<svg viewBox="0 0 100 50" width="200" height="100">
  <!-- Arc -->
  <path d="M0,50 A50,50 0 0,1 100,50" fill="none" stroke="#fbc02d" stroke-width="2" />
  
  <!-- Sun Icon (positioned at midpoint here — noon) -->
  <circle cx="0" cy="50" r="10" fill="#fdd835" />
</svg>
</template>

<style scoped>
.weather-info-container{
    /* width: 100%; */
    height: 300px;
    background-color: azure;
}
</style>