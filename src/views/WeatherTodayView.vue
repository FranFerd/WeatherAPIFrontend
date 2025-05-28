<script setup>
import WeatherHourly from '@/components/WeatherHourly.vue';
import WeatherTodayGeneral from '@/components/WeatherTodayGeneral.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

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
        const response = await axios.get(`http://127.0.0.1:5000/weather/hourly/${location}/1`)
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
            ...(data.preciptype?.length && {precipitationType : data.preciptype.join(', ')}),
            "uvindex" : `${data.uvindex} (${getUvDescription(data.uvindex)})`,
            ...(highUvHours.value?.length && {highUvHours : highUvHoursMessage.value}),
            "sunRise" : sunRise,
            "sunSet" : sunSet,
            "dayLength" : dayLength.value,
            // The ... tries to spread the result only if it is a real object. If it’s false, nothing happens.
            }
        }
    }


function calculateDayLength(){
    const sunrise = data.value.sunrise
    const sunset = data.value.sunset

    const [a,b] = sunrise.split(':').map(Number)
    const [d,e] = sunset.split(':').map(Number)

    const sunriseSeconds = a*3600 + b*60
    let sunsetSeconds = d*3600 + e*60

    if (d < a){
        sunsetSeconds += 86400
        // Sunset after midnight
    }

    const differenceSeconds = sunsetSeconds - sunriseSeconds

    const hours = Math.floor(differenceSeconds / 3600)
    const minutes = Math.floor((differenceSeconds % 3600) / 60)

    dayLength.value = `${hours}h:${minutes}m`
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
        // Why || []?
        dataHourly.value.forEach(roundUp)
        console.log(data.value)
        console.log(dataHourly.value)

        setUvIndexHourly(dataHourly)
        showHighUvHours(uvIndexHourly.value)
        calculateDayLength()
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
    <WeatherHourly v-if="dataHourly" :data="data"></WeatherHourly>
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