<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import WeatherHourly from '@/components/WeatherHourly.vue';
import WeatherTodayGeneral from '@/components/WeatherTodayGeneral.vue';

import calculateDayLength from '@/utils/calculateDayLength';
import { getUvDescription, setUvIndexHourly, showHighUvHoursMessage } from '@/utils/uvIndex';
import { DataGeneralForDay, FetchedWeatherData, HourlyInfo, WeatherDataForDayFull, WeatherDataForWeekRaw } from '@/types/WeatherData';
import { UvindexHourlyDescription } from '@/types/UvIndexData';


const route = useRoute()

const dataForDayFull = ref<WeatherDataForDayFull | null>(null)
const dataHourly = ref<HourlyInfo[] | null>(null)
const dataGeneral = ref<DataGeneralForDay | null>(null)

const addressUrl = ref<string>('')
const resolvedAddress = ref<string>('')

const message = ref<string>('')

const highUvHoursMessage = ref<string>('')
const uvindexHourly = ref<UvindexHourlyDescription[] | null>(null)

const dayLength = ref<string>('')

watch(() => route.params.address, (newAddress) => {
    addressUrl.value = String(newAddress)
}, {immediate:true})

async function fetchWeatherToday(location: string): Promise<FetchedWeatherData | null> {   
    try{
        const response = await axios.get(`http://127.0.0.1:8000/weather/hourly/${location}/1`) // '0' to get 1 day - today
        return response.data
    }
    catch(error){
        console.error(error)
        return null
    }
}

function setDataGeneral(data: WeatherDataForDayFull): void{
    if(data){
        const [sunRiseHours, sunRiseMinutes] = data.sunrise.split(':')
        const [sunSetHours, sunSetMinutes] = data.sunset.split(':')

        const sunRise: string = `${sunRiseHours}:${sunRiseMinutes}`
        const sunSet: string = `${sunSetHours}:${sunSetMinutes}`
    
        dataGeneral.value = {
            "description" : data.conditions,
            ...(data.preciptype?.length && {precipitationType : data.preciptype.join(', ')}), // ?. (not .?)
            "uvindex" : `${data.uvindex} (${getUvDescription(data.uvindex)})`,                // Empty array is a value, it is true and spread works
            ...(highUvHoursMessage.value?.length && {highUvHours : highUvHoursMessage.value}),       // So length is required
            "sunRise" : sunRise,
            "sunSet" : sunSet,
            "dayLength" : dayLength.value,
            // The ... tries to spread the result only if it is a real object. If it’s false, nothing happens.
            }
        }
    }

function roundUp(element: HourlyInfo): void{
    element.temp = +Math.round(element.temp)
    element.feelslike = +Math.round(element.feelslike)
}

onMounted(async() => {
    try{
        const fetchedWeatherData = await fetchWeatherToday(addressUrl.value)
        if(fetchedWeatherData){
            resolvedAddress.value = fetchedWeatherData.weather_data.resolvedAddress || ''
            dataForDayFull.value = fetchedWeatherData.weather_data.days[0] || null
            dataHourly.value = dataForDayFull.value.hours || null
        }
        
        if(dataHourly.value){
          dataHourly.value.forEach(roundUp)  
          uvindexHourly.value = setUvIndexHourly(dataHourly.value)
          highUvHoursMessage.value = showHighUvHoursMessage(uvindexHourly.value)
        } 

        if(dataForDayFull.value) {
            dayLength.value = calculateDayLength(dataForDayFull.value)
            setDataGeneral(dataForDayFull.value)
        }
    }
    catch(error){
        console.error('Error: ', error)
        message.value = 'Failed to load weather data'
    }
})
</script>

<template>
<div class="weather-info" v-if="!message">
    <p class="weather-today" v-if="dataForDayFull">{{ dataForDayFull.datetime }}</p>
    <p class="weather-today">{{ resolvedAddress }}</p>

    <hr>
    <br><br><br>
    <WeatherHourly v-if="dataHourly" :dataHourly="dataHourly"></WeatherHourly>
    <br><br><br>
    <WeatherTodayGeneral v-if="dataGeneral" 
                         :dataGeneral="dataGeneral">
    </WeatherTodayGeneral>
</div>
<div class="error-message">
    <p>{{ message }}</p>
</div>
</template>

<style scoped>
.weather-today{
    text-align: center;
    font-size: 3em;
}

.error-message{
    font-size: 30px;
    color: red;
}

</style>