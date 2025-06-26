<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

import { weatherIcons } from '@/assets/icons/icons';

import { weatherMatchersForIcons, weatherMathcersForDisplay } from '@/utils/weatherMatchersForIcons';
import { WEATHER_ICONS_KEYS } from '@/utils/weatherMatchersForIcons';

import { HourlyInfo } from '@/types/WeatherData';

const props = defineProps<{
    dataHourly: HourlyInfo[]
}>()

const dataHourly = ref<HourlyInfo[] | null>(null)

const scrollContainer = ref<HTMLElement | null>(null)

function isValidWeatherDescription(weatherDescription: string): weatherDescription is typeof WEATHER_ICONS_KEYS[number]{
    return [
        'partly-cloudy-day', 'partly-cloudy-night', 'cloudy', 'rain',
        'clear-night', 'clear-day', 'snow', 'fog'
        ].includes(weatherDescription)
} 

function getWeatherIcon(weatherDescription: string): string{
    return isValidWeatherDescription(weatherDescription)
        ? weatherIcons[weatherMatchersForIcons[weatherDescription]]
        : weatherIcons.defaultWeather
}

function getWeatherDescriptionOnHover(weatherDescription: string): string{
    return isValidWeatherDescription(weatherDescription)
        ? weatherMathcersForDisplay[weatherDescription]
        : 'weather description'
}

function handleWheel(e: WheelEvent): void{  // e is event, passed automatically when user uses mouse wheel.
    if(!scrollContainer.value) return 
    if (scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth) { // if (total width of the content, incl. the part not currently visible is greater
        e.preventDefault() // Prevent vertical scrolling                            than width of the container that is currently visible(viewport inside the element))
        scrollContainer.value.scrollLeft += e.deltaY // Scroll horizontally instead
    }
}

function getCurrentTimeString(): string{
    const now = new Date()
    return `${now.getHours().toString().padStart(2,"0")}:00:00` // Pads with a leading zero if needed (e.g., "9" → "09")
}

function getTimeWithoutSeconds(time: string): string{
    return time.slice(0, time.length - 3)
}
function scrollToCurrentTime(): void{
    if(!scrollContainer.value || !dataHourly.value) return

    const currentTime: string = getCurrentTimeString()
    const index: number = dataHourly.value.findIndex((item: HourlyInfo) => item.datetime === currentTime)  // Search through dataHourly and find item where item.datetime === currentTIme

    if(index !== -1){
        const container: HTMLElement = scrollContainer.value
        const items = container.querySelectorAll<HTMLElement>('.scroll-item')
        if (items[index]) {
            items[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            })
        }
    }
}

onMounted(async () => {
    try{
        dataHourly.value = props.dataHourly  // Props are not ref, so .value is an error(undefined)
        await nextTick() // Wait for the DOM to fully render before running code below
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
            <div :class="{ 'current-time': item.datetime === getCurrentTimeString(), 'hour-label' : item.datetime !== getCurrentTimeString() }">
                {{ item.datetime === getCurrentTimeString() ? 'Now' : getTimeWithoutSeconds(item.datetime) }}
            </div>
            <div>
                <img :src="getWeatherIcon(item.icon)" :alt="item.icon" class="weatherIcon" :title="getWeatherDescriptionOnHover(item.icon)">
            </div>
            <div :class="{temperature : item.temp > 0 || item.temp < 0, 'temperature-shift-right' : item.temp === 0}"> <!--shift to right if it's 0 -->
                <div>                                                                                      <!-- which doesn't have + or -. Alignment -->     
                    <p v-if="item.temp > 0">+</p>
                </div>
                <div>
                    {{ item.temp }}℃
                </div>
            </div>
            <div :class="{'feels-like-temperature' : item.feelslike > 0 || item.feelslike < 0, 'feels-like-temperature-shift-right' : item.feelslike === 0 }">
                <div>
                    <p v-if="item.feelslike > 0">+</p>
                </div>
                <div>
                    {{ item.feelslike }}℃
                </div>
            </div>
        </div>
    </div>
</div>


</template>

<style scoped>

.hourly-info-label-container{
    background-color: rgb(129, 254, 148);
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
    top: 67%;
    width: 100px;
    text-align: right;
    color: rgb(121, 120, 120);
}

.feels-like-line{
    position: absolute;
    left: 0;
    top: 73%;
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
    align-items: center;
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
    font-size: 1.5em;
}
.hour-label{
    font-size: 1.5em;
}
.weatherIcon{
    width: 50px;
    height: 50px;
    margin-top: 1em;
}

.temperature{
    font-size: 1.5em;
    margin-top: 1em;
    display: flex;
}
.temperature-shift-right{
    font-size: 1.5em;
    margin-top: 1em;
    margin-left: 0.5em;
    display: flex;
}

.feels-like-temperature{
    font-size: 1.5em;
    margin-top: 1.5em;
    color: rgb(121, 120, 120);
    display: flex;
}
.feels-like-temperature-shift-right{
    font-size: 1.5em;
    margin-top: 1.5em;
    margin-left: 0.5em;
    color: rgb(121, 120, 120);
    display: flex;
}
</style>