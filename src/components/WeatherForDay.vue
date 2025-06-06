<script setup>
import { onMounted, ref } from 'vue'
import switchDayOfWeek from '@/utils/switchDayOfWeek'
import switchMonth from '@/utils/switchMonth'
import WeatherForDayAverage from './WeatherForDayAverage.vue'
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
console.log(weatherWeekly.value)

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
    return dayOfWeek === 0 || dayOfWeek === 6
}

function sunPosition(time){

}
onMounted(async() => {
    try{
        isToday()
    }
    catch(error){
        console.error('Error: ', error)
    }
})
</script>

<template>
<div class="weather-info-container" v-for="(dataForWeek, day) in weatherWeekly" :key="day">
    <div class="weather-info-averages">
        <div class="date">
            <h2 :class="{'week-day': !isWeekend(day), weekend: isWeekend(day), today: isToday(day)}">
                {{ numberDateToWordDate(day)}} 
            </h2>
        </div>
        <div class="weather-info" v-for="(dataForDay) in dataForWeek">
            <WeatherForDayAverage :data-for-day-average="dataForDay"></WeatherForDayAverage>
        </div>
    </div>
    <div class="sun-info">
        <div class="sun-container">
            <svg viewBox="0 0 200 50" width="400" height="100">
                <!-- Arc -->
                <path d="M0,80 A80,80 0 0,1 160,80" fill="none" stroke="#fbc02d" stroke-width="2" />
                
                <!-- Sun Icon (positioned at midpoint here — noon) -->
                <circle cx="0" cy="50" r="10" fill="#fdd835" />
            </svg>
        </div>
        <div class="sun-time-container">

        </div>
    </div>
</div>


</template>

<style scoped>
.weather-info-container{
    display: flex;
    flex-wrap: wrap;
    gap: 5em;
    /* align-items: center; */
    width: 100%;
}
.weather-info-averages{
    width: 70%;
    height: 300px;
    background-color: azure;
    margin-bottom: 20px;
}
.date{
    padding: 1em;
}
.week-day{
    font-size: 2em;
}
.today{
    color: green;
    font-size: 2em;
}
.weekend{
    color: red;
    font-size: 2em;
}
.weather-info{
    display: flex; 
    gap: 20px;
    padding: 5px;
    margin-left: 1em;
}
.sun-info{
    display: flex;
    flex-direction: column;
    margin-top: 5em;
}
</style>