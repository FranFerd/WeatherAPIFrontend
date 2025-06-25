<script setup lang="ts">
import { computed } from 'vue';

import { weatherMatchersForIcons, WEATHER_ICONS_KEYS } from '@/utils/weatherMatchersForIcons';

import { weatherIcons } from '@/assets/icons/icons';

import { WeatherDataForDayRefined, WeatherDataForDayRefinedBasic } from '@/types/WeatherData';
const props = defineProps<{
    dataForDayAverageMain: WeatherDataForDayRefined,
    isHideLabels: boolean
}>()

const filteredData = computed<WeatherDataForDayRefined | WeatherDataForDayRefinedBasic>(() => {
    const [time, temp, desc] = props.dataForDayAverageMain
    if(!props.isHideLabels) return props.dataForDayAverageMain

    if(
        typeof time === 'string' &&
        typeof temp === 'number' &&
        typeof desc === 'string'
    ){
        return [time, temp, desc]
    }

    return ['time of day', 0, 'weather description'] // Fallback to default values, in case temp or desc are undefined
})

function addIcon(description: typeof WEATHER_ICONS_KEYS[number]): string{ // "Give me the union of all possible values in this array or tuple and typeof it."
    const iconKey = weatherMatchersForIcons[description]          // If it's as const, then it would give its precise values, instead of 'string' or 'number' for example.
    return weatherIcons[iconKey] ? weatherIcons[iconKey] : weatherIcons.defaultWeather
}

function isWeatherMatchersForIconsKey(item: unknown): item is typeof WEATHER_ICONS_KEYS[number]{
    return typeof item === 'string' && ((WEATHER_ICONS_KEYS as readonly string []).includes(item))
}

function isGreaterThanZeroAndIsTemperature(item: unknown, index: number): boolean{
    return typeof item === 'number' && item > 0 && (index === 1 || index === 3) // index 1 - temperature, index 3 - feelslike
}

function isWeatherDescriptionAndHasIcon(item: typeof WEATHER_ICONS_KEYS[number], index: number): boolean{
    return index === 2 && !!addIcon(item) // index 2 is weatherDescription
}

function isItemWord(index: number): boolean{
    return index === 0 || index === 2 // index 0 is partOfDay (night, morning, etc)
}
</script>
<template>
    <div class="weather-info-item" v-for="(item, index) in filteredData" :key="index">
        <div v-if="isGreaterThanZeroAndIsTemperature(item, index)" >
            <p>+</p>
        </div>
        <div class="item-container">
            <img v-if="isWeatherMatchersForIconsKey(item) && isWeatherDescriptionAndHasIcon(item, index)"
                :src="addIcon(item)"
                alt="weather icon"
                class="weather-icon"
            >
            <p :class="isItemWord(index) ? 'item-word' : 'item-digit'"> <!-- index 0 is night, morning..., index 2 is weather condition -->
                {{ item }}
            </p>
        <div v-if="(index === 4)"> <!-- index 4 is windspeed -->
            <p class="wind-speed-unit">m/s</p>
        </div>    
        </div>
    </div>
</template>
<style scoped>
.weather-info-item{
    display: flex;
    align-items: center;
    margin-left: 1em;
    margin-right: 1em;
}
.item-container{
    display: flex;
    align-items: center;
    gap: 7px; 
}
.item-word{
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 1.5em;
    width: 4em;
}
.item-digit{
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 1.5em;
    width: 1em;
    text-align: center;
}
.weather-icon{
    width: 50px;
    height: 50px;
}
.wind-speed-unit{
    font-size: 1.5em;
}
</style>