<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import WeatherForDayAverage from './WeatherForDayAverage.vue'
import SunInfoForDayMain from './SunInfoForDayMain.vue'
import SunInfoForDayAdditional from './SunInfoForDayAdditional.vue'

import switchDayOfWeek from '@/utils/switchDayOfWeek'
import switchMonth, { MonthStringIndex } from '@/utils/switchMonth'
import { sunPositions } from '@/utils/sunPositions'

import type { WeatherDataForWeekRefined } from '@/types/WeatherData'
import type { SunInfoForWeek } from '@/types/SunInfo'
import type { UvindexAndHighUvHoursForWeek } from '@/types/UvIndexData'

const props = defineProps<{
    weatherInfo: WeatherDataForWeekRefined,
    sunInfo: SunInfoForWeek,
    uvindexInfo: UvindexAndHighUvHoursForWeek
}>()

const weatherWeekly = ref(props.weatherInfo)
const sunInfo = ref(props.sunInfo)
const uvindexInfo = ref(props.uvindexInfo)

const screenWidth = ref<number>(window.innerWidth)

const isHideSunInfo = isWidthSmaller(1250)
const isHideLabels = isWidthSmaller(900)

function numberDateToWordDate(numberDate: string): string{ // 2025-06-07 YYYY-MM-DD
    const date = numberDate.slice(5)
    const numberMonth: MonthStringIndex = date.slice(0,2)
    let numberDay = date.slice(3)
    
    if(numberDay[0] === '0'){
        numberDay = numberDay.slice(1) // Remove leading 0
    }

    const dateString = new Date(numberDate)
    const dayOfWeek = dateString.getDay() // Returns day of the week using numberDate
    
    const wordMonth = switchMonth(numberMonth)
    const wordDayOfWeek = switchDayOfWeek(dayOfWeek)

    return `${wordDayOfWeek}, ${numberDay} ${wordMonth}`
}

function isToday(numberDate){
    if(!numberDate || typeof numberDate !== 'string') return ''
    const date = numberDate.slice(5)

    const currentDateObject = new Date
    let currentDayOfMonth = currentDateObject.getDate()
    let currentMonth = currentDateObject.getMonth() + 1 //getMonth is 0-indexed

    if(String(currentDayOfMonth).length === 1){
        currentDayOfMonth = String(currentDayOfMonth).padStart(2, '0') // Pads with a leading zero if needed (e.g., "9" → "09)
    }
    if(String(currentMonth).length === 1){
        currentMonth = String(currentMonth).padStart(2, '0')
    }

    const today = `${currentMonth}-${currentDayOfMonth}`

    return date == today
}
function isWeekend(numberDate){
    if(!numberDate || typeof numberDate !== 'string') return ''
    const dateObject = new Date(numberDate)
    const dayOfWeek = dateObject.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // 0-indexed. Start with Sunday
}

function isWidthSmaller(width){ // return true if passed with is smaller that screenWidth
    return computed(() => screenWidth.value <= width) // computed is to make it reactive
}
function updateWidth(){
    screenWidth.value = window.innerWidth
}

function getCurrentSunArcPosition(sunriseTime, sunsetTime){
    const [sunriseHours, sunriseMinutes] = sunriseTime.split(':')
    const [sunsetHours, sunsetMinutes] = sunsetTime.split(':')

    const sunriseTimeInMinutes = Number(sunriseHours) * 60 + Number(sunriseMinutes)
    let sunsetTimeInMinutes = Number(sunsetHours) * 60 + Number(sunsetMinutes)

    if(sunsetTimeInMinutes < sunriseTimeInMinutes) { // add a whole day in minutes if sunset is after midnight
        sunsetTimeInMinutes += 1440
    }

    const currentTime = new Date()
    const currentTimeInMinutes = Number(currentTime.getHours()) * 60 + Number(currentTime.getMinutes())

    const daylightDuration = sunsetTimeInMinutes - sunriseTimeInMinutes
    const minutesSinceSunrise = currentTimeInMinutes - sunriseTimeInMinutes

    let coefficient = Math.min(Math.max(minutesSinceSunrise / daylightDuration, 0), 1) // max ensures the value is at least 0 
    coefficient =  Math.round(coefficient * 10)                                        // min ensures the value is not bigger than 1)

    return sunPositions[coefficient] || [-10, -10] //sunPositions is exported. Contains [cx, cy] for sun. Positions 0 to 9
}                                               // [-10, -10] for polar day/night. Removes the sun from the arc

onMounted(() => {
    window.addEventListener('resize', updateWidth)  // adds listener to update screenWidth every time viewport changes 
    console.log(props.sunInfo)
    console.log(props.uvindexInfo)
    console.log(props.weatherInfo)
})  

onBeforeUnmount(() => window.removeEventListener('resize', updateWidth))
</script>
<template>
<div class="weather-info-container" v-for="(dataForWeek, day) in weatherWeekly" :key="day">
    <div class="weather-info-averages">
        <div class="labels-container">
            <div class="date-container">
                <h2 :class="{'week-day': !isWeekend(day), weekend: isWeekend(day), today: isToday(day)}">
                    {{ numberDateToWordDate(day)}} 
                </h2>
            </div>
            <div class="labels" v-if="!isHideLabels">
                <div class="feels-like-label">
                    <h2>
                        Feels like
                    </h2>
                </div>
                <div class="wind-speed-lable">
                    <h2>
                        Wind speed
                    </h2>
                </div>
            </div>
        </div>
        <div class="weather-info" v-for="(dataForDayMain) in dataForWeek">
            <WeatherForDayAverage 
            :dataForDayAverageMain="dataForDayMain"
            :is-hide-labels="isHideLabels">
            </WeatherForDayAverage>
        </div>
    </div>
    <div class="sun-info-container" v-if="!isHideSunInfo && sunInfo[day]">
        <div class="sun-arc-container">
            <svg viewBox="0 0 200 30" width="400" height="100" class="sun-arc">
                <path d="M0,80 A80,80 0 0,1 160,80" fill="none" stroke="#fbc02d" stroke-width="1.5" /> <!-- Arc -->
                <circle
                :cx="getCurrentSunArcPosition(sunInfo[day][0], sunInfo[day][2])[0]" 
                :cy="getCurrentSunArcPosition(sunInfo[day][0], sunInfo[day][2])[1]" 
                r="9"
                fill="#fdd835"/> <!-- sunInfo[day][0] is sunriseTime [2] - sunset. [0] is cx, [1] - cy -->
            </svg>
        </div>
        <div class="sun-info-text">
            <div class="sun-info-main-container" v-if="sunInfo[day]"> <!-- day is the key from for loop -->
                <SunInfoForDayMain
                :sun-info-for-day-main="sunInfo[day]">
                </SunInfoForDayMain>
            </div>
            <div class="sun-info-additional-container" v-if="sunInfo[day]">
                <SunInfoForDayAdditional
                :sun-info-for-day-additional="uvindexInfo[day]">
                </SunInfoForDayAdditional>
            </div>
        </div>
    </div>
</div>
</template>
<style scoped>
.weather-info-container{
    display: flex;
    justify-content: space-between;
    gap: 8em;
    background-color: #f5f5f5;
    border-radius: 1em;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
}
.weather-info-averages{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    min-height: 500px;
    min-width: 300px;
    max-width: 1000px;
    width: 100%;
    border-radius: 1em;
}
.labels-container{
    width: 97%;
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.week-day{
    font-size: 2em;
}
.labels{
    display: flex;
    justify-content: space-between;
    gap: 3.5em;
}
.today{
    font-size: 2em;
    color: green;
}
.weekend{
    font-size: 2em;
    color: red;
}
.weather-info{
    display: flex; 
    justify-content: space-between;
    align-items: center;
}
.sun-info-container{
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-top: 8em;
    margin-right: 5em;
    text-align: center;
}
.sun-info-text{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2em;
}
.sun-info-main{
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.sun-info-main-container{
    display: flex;
    gap: 4em;
    margin-right: 5em;
}
.sun-info-additional-container{
    display: flex;
    flex-direction: column;
    gap: 1em;
}
</style>