<script setup>
import WeatherHourly from '@/components/WeatherHourly.vue';
import WeatherTodayGeneral from '@/components/WeatherTodayGeneral.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import calculateDayLength from '@/utils/calculateDayLength';

const data = ref(null)
const dataHourly = ref(null)
const dataGeneral = ref(null)
const addressUrl = ref(null)
const resolvedAddress = ref(null)
const message = ref(null)
const route = useRoute()
const uvIndexHourly = ref([])
const highUvHours = ref([])
const highUvHoursMessage = ref(null)
const dayLength = ref(null)

const props = defineProps({
    address : {
        type: String,
        required: true
    }
})

watch(() => route.params.address, (newAddress) => {
    addressUrl.value = newAddress
}, {immediate:true})

async function fetchWeatherToday(location) {   
    try{
        const response = await axios.get(`http://127.0.0.1:5000/weather/hourly/${location}/1`) // '0' to get 1 day - today
        return response.data
    }
    catch(error){
        console.error(error)
    }
}

function getUvDescription(uvIndex){
    if (uvIndex <= 2) return 'Low'
    if (uvIndex <=5) return 'Moderate' 
    if (uvIndex <=7) return 'High'
    if (uvIndex <=10) return 'Very High'
    return 'Extreme'
}

function setUvIndexHourly(data){
    for(let i = 0; i < data.value.length; i++){
        uvIndexHourly.value.push({
            "time": data.value[i].datetime,
            "uvindex": data.value[i].uvindex,
            "description": getUvDescription(data.value[i].uvindex)
        })
    }
}

function showHighUvHours(uvDataHourly){
    for (let hour of uvDataHourly){
        if (hour.uvindex >= 6){
            highUvHours.value.push(hour.time)
        }
    }
    highUvHoursMessage.value = `From ${highUvHours.value[0]} to ${highUvHours.value[highUvHours.value.length - 1]}`
    
}

function setDataGeneral(data){
    if(data){
        
        const [sunRiseHours, sunRiseMinutes] = data.sunrise.split(':')
        const [sunSetHours, sunSetMinutes] = data.sunset.split(':')

        const sunRise = `${sunRiseHours}:${sunRiseMinutes}`
        const sunSet = `${sunSetHours}:${sunSetMinutes}`
    
        dataGeneral.value = {
            "description" : data.conditions,
            ...(data.preciptype?.length && {precipitationType : data.preciptype.join(', ')}), // ?. (not .?)
            "uvindex" : `${data.uvindex} (${getUvDescription(data.uvindex)})`,                // Empty array is a value, it is true and spread works
            ...(highUvHours.value?.length && {highUvHours : highUvHoursMessage.value}),       // So length is required
            "sunRise" : sunRise,
            "sunSet" : sunSet,
            "dayLength" : dayLength.value,
            // The ... tries to spread the result only if it is a real object. If it’s false, nothing happens.
            }
        }
    }

function roundUp(element,index,array){
    array[index].temp = +Math.round(array[index].temp)
    array[index].feelslike = +Math.round(array[index].feelslike)
}

onMounted(async() => {
    try{
        const fetchedWeatherData = await fetchWeatherToday(addressUrl.value)
        resolvedAddress.value = fetchedWeatherData.resolvedAddress
        data.value = fetchedWeatherData.days[0]
        dataHourly.value = fetchedWeatherData.days[0].hours || []
        dataHourly.value.forEach(roundUp)

        setUvIndexHourly(dataHourly)
        showHighUvHours(uvIndexHourly.value)
        dayLength.value = calculateDayLength(data.value)
        setDataGeneral(data.value)
    }
    catch(error){
        console.error('Error: ', error)
        message.value = 'Failed to load weather data'
        data.value = []
    }
})
</script>

<template>
<div class="weather-info" v-if="!message">
    <p class="weather-today" v-if="data">{{ data.datetime }}</p>
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