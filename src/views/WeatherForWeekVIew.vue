<script setup>
import WeatherForDay from '@/components/WeatherForDay.vue';
import axios from 'axios';
import { onMounted, watch, ref} from 'vue';
import { useRoute } from 'vue-router';

const addressUrl = ref(null)
const route = useRoute()
const props = defineProps({
    address : {
        type: String,
        required: true
    }
})
watch(() => route.params.address, (newAddress) => {
    addressUrl.value = newAddress
}, {immediate:true} )

async function fetchWeatherData(location){
    try{
        const response = await axios.get(`http://127.0.0.1:5000/weather/hourly/${location}`)
        return response.data
    }
    catch(error){
        console.error(`Error: `, error)
        return null

    }

}

onMounted(async() => {
    const weatherData = await fetchWeatherData(addressUrl.value)
    if(weatherData){
    }
})
</script>

<template>
    <WeatherForDay

    ></WeatherForDay>
</template>