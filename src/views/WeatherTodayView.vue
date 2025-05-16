<script setup>
import WeatherHourly from '@/components/WeatherHourly.vue';
import WeatherTodayGeneral from '@/components/WeatherTodayGeneral.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const data = ref(null)
const uvindexAvg = ref(0)
const dataHourly = ref(null)
const dataGeneral = ref(null)
const dataGeneralCached = ref(null)
const dataGeneralDeleted = ref({})
const addressUrl = ref(null)
const resolvedAddress = ref(null)
const message = ref()
const route = useRoute()

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
        const response = await axios.get(`http://127.0.0.1:5000/weather/hourly/${location}`)
        return response.data
    }
    catch(error){
        console.error(error)
    }
}

function handleDeleteItem(key) {
    if (key in dataGeneral.value) {
        dataGeneralDeleted.value[key] = dataGeneralCached.value[key]
        delete dataGeneral.value[key]
    }
}

function handleRestoreItem(key){
    if (key in dataGeneralDeleted.value) {
        dataGeneral.value = {
            ...dataGeneral.value,
            [key]: dataGeneralDeleted.value[key]
        };
        
        const { [key]: _, ...rest } = dataGeneralDeleted.value;
        dataGeneralDeleted.value = rest;
    }
}

function setDataGeneral(data){
    if(data){
        dataGeneral.value = {
            "description" : data.conditions,
            "feelsLikeAvg" : Math.floor(data.feelslike) + '℃',
            "feelsLikeMax" : Math.floor(data.feelslikemax) + '℃',
            "feelsLikeMin" : Math.floor(data.feelslikemin) + '℃',
            "temperatureMax" : Math.floor(data.tempmax) + '℃',
            "temperatureMin" : Math.floor(data.tempmin) + '℃',
            "temperatureAvg" : Math.floor(data.temp) + '℃',
            "precipitationType" : data.preciptype?.join(', ') || "-",
            "humidity" : Math.floor(data.humidity) + '%',
            "windSpeedMean" : Math.floor(data.windspeedmean) + ' m/s',
            "uvindexAvg" : Math.floor(uvindexAvg.value/24),
            "uvindexMax" : data.uvindex
        }
        dataGeneralCached.value = {...dataGeneral.value}
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

        for(let i = 0; i < dataHourly.value.length; i++){
            uvindexAvg.value = uvindexAvg.value + dataHourly.value[i].uvindex
        }
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
    <WeatherHourly v-if="dataHourly" :data="data"></WeatherHourly>
    <WeatherTodayGeneral v-if="dataGeneral" 
                         :dataGeneral="dataGeneral"
                         :deletedItems="dataGeneralDeleted"
                         @delete-item="handleDeleteItem"
                         @restore-item="handleRestoreItem">
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