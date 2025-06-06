<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { weatherIcons } from '@/assets/icons/icons';
import {weatherMatchersForIcons, weatherMathcersForDisplay} from '@/utils/weatherMatchersForIcons';
const props = defineProps({
    dataHourly : {
        type: Object,
        required: true
    }
})
const scrollContainer = ref(null)
const dataHourly = ref([])
const matchersForIcons = weatherMatchersForIcons()
const matchersForDisplay = weatherMathcersForDisplay()


function getWeatherIcon(weatherDescription) {
    const iconKey = matchersForIcons[weatherDescription]
    return weatherIcons[iconKey]? weatherIcons[iconKey] : weatherIcons.defaultWeather;
}

function handleWheel(e) {  // e is event, passed automatically when user uses mouse wheel.
    if (scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth) { // Only scroll horizontally if there's horizontal content
        e.preventDefault() // Prevent vertical scrolling
        scrollContainer.value.scrollLeft += e.deltaY // Scroll horizontally instead
    }
}


function getCurrentTimeString() {
    const now = new Date()
    return `${now.getHours().toString().padStart(2,"0")}:00:00` // Pads with a leading zero if needed (e.g., "9" → "09")
}

function scrollToCurrentTime(){
    if(!scrollContainer.value || !dataHourly.value) return

    const currentTime = getCurrentTimeString()
    const index = dataHourly.value.findIndex(item => item.datetime === currentTime)  // Search through dataHourly and find item where item.datetime === currentTIme

    if(index !== -1){
        const container = scrollContainer.value;
        const items = container.querySelectorAll('.scroll-item');
    if (items[index]) {
        items[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}
}

onMounted(async () => {
    try{
        dataHourly.value = props.dataHourly  // Props are not ref, so .value is an error(undefined)
        await nextTick() // Let the DOM fully render
        scrollToCurrentTime() // Now scroll
    }
    catch(error){
        console.error('Failed to load weather: ', error)
    }
})  




</script>

<template>
<div class="hourly-info-label-container">
    <h3 class="hourly-info-label">Hourly Info</h3>
</div>
<div class="weather-display-container">
    <div class="feels-like-label">feels like</div>
    <div class="feels-like-line"></div>
    <div class="horizontal-scroll-container" ref="scrollContainer" @wheel.prevent="handleWheel">
        <div v-for="(item, index) in dataHourly" :key="index" class="scroll-item">
            <div :class="{ 'current-time': item.datetime === getCurrentTimeString() }">
                {{ item.datetime === getCurrentTimeString() ? 'Now' : item.datetime }}
            </div>
            <div>
                <img :src="getWeatherIcon(item.icon)" :alt="item.icon" class="weatherIcon" :title="matchersForDisplay[item.icon]">
            </div>
            <div class="temperature">
                {{ item.temp }}℃
            </div>
            <div class="feels-like-temperature">
                {{ item.feelslike }}℃
            </div>
        </div>
    </div>
</div>


</template>

<style scoped>

.hourly-info-label-container{
    background-color: rgb(171, 254, 184);
    height: 3.5em;
    position: relative;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
}

.hourly-info-label{
    margin-left: 30px;
    font-size: 2em;
    padding: 5px;
    color: hsl(0, 0%, 15%);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.weather-display-container{
    position: relative;
    z-index: 1;
    margin-top: -1em;
}

.feels-like-label{
    position: absolute;
    top: 61%;
    width: 100px;
    text-align: right;
    padding-right: 10px;
    color: rgb(121, 120, 120);
}

.feels-like-line{
    position: absolute;
    left: 0;
    top: 68%;
    right: 0;
    height: 1px;
    background-color: rgb(121, 120, 120);
    z-index: 0;
}

.horizontal-scroll-container {
    display: flex;
    overflow-x: auto; /* Enables horizontal scrolling */
    gap: 16px; 
    padding: 12px;
    background: #f5f5f5;
    border-radius: 15px;
}

.scroll-item {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;  /*Prevents items from shrinking/growing */
    padding: 20px;
    width: 70px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    user-select: none;
    text-align: center;
}

.current-time {
    font-weight: bold;
    color: #42b983;
}

.weatherIcon{
    width: 25px;
    height: 30px;
    margin-top: 1em;
}

.temperature{
    margin-top: 1em;
}

.feels-like-temperature{
    margin-top: 1.5em;
    color: rgb(121, 120, 120);
}
</style>