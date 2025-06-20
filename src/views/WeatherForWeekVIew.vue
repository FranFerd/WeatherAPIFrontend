<script setup>
import WeatherForDay from '@/components/WeatherForDay.vue';
import AddressWeek from '@/components/AddressWeek.vue';
import calculateDayLength from '@/utils/calculateDayLength';
import { weatherPriorityObject } from '@/utils/getWeatherPriorityObject'
import { setUvIndexHourly, showHighUvHoursMessage, getUvDescription } from '@/utils/uvIndex';
import axios from 'axios';
import { onMounted, watch, ref} from 'vue';
import { useRoute } from 'vue-router';
// import type { WeatherPriority } from '../utils/getWeatherPriorityObject';

const props = defineProps({
    address : {
        type: String,
        required: true
    }
})

const addressUrl = ref(null)
const route = useRoute()
const resolvedAddress = ref(null)
const dataWeeklyRaw = ref(null)
const dataWeeklyRefined =  ref({})
const sunInfo = ref({})
const uvIndexHourly = ref({})
const highUvHoursMessage = ref(null)
const uvIndexForWeek = ref({})

watch(() => route.params.address, (newAddress) => {
    addressUrl.value = newAddress
}, {immediate:true} )

async function fetchWeatherData(location){
    try{
        const response = await axios.get(`http://127.0.0.1:5000/weather/hourly/${location}/7`)
        return response.data
    }
    catch(error){
        console.error(`Error: `, error)
        return null
    }
}

function refineData(data){
    for(let dayIndex = 0; dayIndex < data.length; dayIndex++){ // day index (0-6)
        const date = data[dayIndex].datetime
        const hourlyData = data[dayIndex].hours

        dataWeeklyRefined.value[date] = [  // [date] is used because plain date would be a 'date' string, not '2025-06-05', for example.
            ['night'],
            ['morning'],
            ['afternoon'],
            ['evening']
        ]

        const sunrise = data[dayIndex].sunrise.slice(0, 5) // Remove seconds
        const sunset = data[dayIndex].sunset.slice(0, 5)
        sunInfo.value[date] = [sunrise, calculateDayLength(data[dayIndex]), sunset]

        fillSunDataAdditional(hourlyData, date, data[dayIndex].uvindex)
        
        if(dataWeeklyRefined.value[date]){
            const itemsToPush = ['temp', 'icon', 'feelslike', 'windspeed', ]
            let dataStartIndex = 1
            for(let itemToPush of itemsToPush){
                fillData(hourlyData, itemToPush, date) 
                dataWeeklyRefined.value[date].forEach(element => getAverage(element, dataStartIndex))
                dataStartIndex++
            }
        }
    }
}

function getAverage(element, valuesStartIndex){ 
    const values = element.slice(valuesStartIndex) // extract portion of an array starting at valuesStartIndex
    if (values.length === 0) return                // it shifts to the right every iteration to not delete averages
    
    let average
    
    if(typeof(values[0]) === 'number'){
        const sum = values.reduce((accumulator, value) => accumulator + Math.floor(value), 0) // accumulator = value + accumulator (both of previous step)(0 on the first) 
        average = Math.floor(sum/values.length)
    }
    else if(typeof(values[0] === 'string')){
        const weatherPriorityListObject = weatherPriorityObject
        average = values.reduce((initial, current) => {  // initial is the first value because nothing is passed at the end (unlike 0 in previous reduce)
            return weatherPriorityListObject[current] > weatherPriorityListObject[initial] ? current : initial
        })
    }

    element.splice(valuesStartIndex) // removes all values before pushing average
    element.push(average)
}

function fillSunDataAdditional(data, date, uvindex){
    uvIndexHourly.value[date] = setUvIndexHourly(data)
    highUvHoursMessage.value = showHighUvHoursMessage(uvIndexHourly.value[date])
    
    uvIndexForWeek.value[date] = {
        'uvindex': `${uvindex}, ${getUvDescription(uvindex)}`,
        'highUvHours' : highUvHoursMessage.value ? highUvHoursMessage.value : 'No high UV hours'
    }
}

function fillData(data, item, date){
    for(let hourIndex = 0; hourIndex < data.length; hourIndex++){ // hour index(0-23)
        const value = data[hourIndex][item]
        if (hourIndex <= 5) dataWeeklyRefined.value[date][0].push(value) // first 6 values in first array 
        else if (hourIndex <= 11) dataWeeklyRefined.value[date][1].push(value) // next 6 values in second array
        else if (hourIndex <= 17) dataWeeklyRefined.value[date][2].push(value)
        else dataWeeklyRefined.value[date][3].push(value)
    }
}

onMounted(async() => {
    // No need for try-catch, fetchWeatherData already has it. Refer to WeatherTodayView for comparison
    const weatherData = await fetchWeatherData(addressUrl.value)
    if(weatherData){
        dataWeeklyRaw.value = weatherData
        resolvedAddress.value = weatherData.resolvedAddress
        refineData(dataWeeklyRaw.value.days)
    }
})
</script>

<template>
<AddressWeek v-if="resolvedAddress"
:address="resolvedAddress"
></AddressWeek>

<WeatherForDay v-if="dataWeeklyRefined" 
:weather-info="dataWeeklyRefined"
:sun-info="sunInfo"
:uvindex-info="uvIndexForWeek">
</WeatherForDay> <!-- Vue automatically handles props; no need to pass .value in props -->
</template>