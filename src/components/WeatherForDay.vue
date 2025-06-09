<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import switchDayOfWeek from '@/utils/switchDayOfWeek'
import switchMonth from '@/utils/switchMonth'
import WeatherForDayAverage from './WeatherForDayAverage.vue'
import SunInfoForDay from './SunInfoForDay.vue'
const props = defineProps({
    weatherInfo: {
        type: Object,
        required: true
    },
    sunInfo: {
        type: Object,
        required: true
    }
})
const weatherWeekly = ref(props.weatherInfo)
const sunInfo = ref(props.sunInfo)
const screenWidth = ref(window.innerWidth)
const isHideSunInfo = isWidthSmaller(1250)
const isHideLabels = isWidthSmaller(900)

console.log(weatherWeekly.value)
console.log(sunInfo.value)

watchEffect(() => {
  if (weatherWeekly.value && Object.keys(weatherWeekly.value).length) {
    for (const [day, dataForWeek] of Object.entries(weatherWeekly.value)) {
      console.log('Day:', day)
      console.log('Data for week:', dataForWeek)
    }
  }
})

function numberDateToWordDate(numberDate){ // 2025-06-07 YYYY-MM-DD
    const date = numberDate.slice(5)
    const numberMonth = date.slice(0,2)
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

function isWidthSmaller(width){
    return computed(() => screenWidth.value <= width)
}
function updateWidth(){
    screenWidth.value = window.innerWidth
}

onMounted(() => window.addEventListener('resize', updateWidth)) // adds listener to updateWidth every time it changes

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
    <div class="sun-info" v-if="!isHideSunInfo">
        <div class="sun-container">
            <svg viewBox="0 0 200 50" width="400" height="100">
                <!-- Arc -->
                <path d="M0,80 A80,80 0 0,1 160,80" fill="none" stroke="#fbc02d" stroke-width="2" />
                
                <!-- Sun Icon (positioned at midpoint here — noon) -->
                <circle cx="0" cy="50" r="10" fill="#fdd835" />
            </svg>
        </div>
        <div class="sun-time-container" v-for="(sunData, index) in sunInfo" :key="index"> 
            <SunInfoForDay 
            :sun-info-for-week="sunData">
            </SunInfoForDay>
        </div>
    </div>
</div>


</template>

<style scoped>
.weather-info-container{
    display: flex;
    gap: 4em;
    background-color: #f5f5f5;
    border-radius: 1em;
    margin-bottom: 20px;
}
.weather-info-averages{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    min-height: 500px;
    min-width: 300px;
    /* max-width: 1000px; */
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
    gap: 3em;
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
.sun-info{
    display: flex;
    flex-direction: column;
    margin-top: 5em;
}
</style>