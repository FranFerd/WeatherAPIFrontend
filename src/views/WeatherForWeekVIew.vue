<script setup>
import WeatherForDay from '@/components/WeatherForDay.vue';
import axios from 'axios';
import { onMounted, watch, ref} from 'vue';
import { useRoute } from 'vue-router';
import AddressWeek from '@/components/AddressWeek.vue';

const addressUrl = ref(null)
const route = useRoute()
const dataWeekly = ref(null)
const resolvedAddress = ref(null)
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

function refineData(data){
    console.log(data)
}

onMounted(async() => {
    // No need for try-catch, fetchWeatherData already has it. Refer to WeatherTodayView.
    const weatherData = await fetchWeatherData(addressUrl.value)
    if(weatherData){
        dataWeekly.value = weatherData
        resolvedAddress.value = weatherData.resolvedAddress
        refineData(dataWeekly.value)
    }
})
</script>

<template>
<AddressWeek v-if="resolvedAddress"
:address="resolvedAddress"
></AddressWeek>

<WeatherForDay v-if="dataWeekly"
:data="dataWeekly"
></WeatherForDay>
</template>