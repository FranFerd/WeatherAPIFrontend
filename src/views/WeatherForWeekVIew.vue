<script setup>
import WeatherForDay from '@/components/WeatherForDay.vue';
import axios from 'axios';
import { onMounted, watch, ref} from 'vue';
import { useRoute } from 'vue-router';
import AddressWeek from '@/components/AddressWeek.vue';

const addressUrl = ref(null)
const route = useRoute()
const dataWeeklyRaw = ref(null)
const dataTodayRefined =  ref({})
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
        const response = await axios.get(`http://127.0.0.1:5000/weather/hourly/${location}/7`)
        return response.data
    }
    catch(error){
        console.error(`Error: `, error)
        return null
    }

}

function getWeatherCondition(icons){
    const weatherPriority = {
        'thunderstorm' : 1,
        'rain' : 2,
        'snow' : 3,
        'fog' : 4,
        'partly-cloudy-day': 5,
        'partly-cloudy-night': 5,
        'cloudy': 6,
        'clear-day': 7,
        'clear-night': 7,
        'wind': 8,
        'hail': 9,
        'defaultWeather': 10
    }
    
}

function refineData(data){
    console.log(data[0])
    const date = data[0].datetime
    const hours = data[0]. hours
    
    dataTodayRefined.value[date] = [
        ['night'],
        ['morning'],
        ['afternoon'],
        ['evening']
    ]

    for(let i = 0; i < hours.length; i++){ // i is hour index
        const temp = hours[i].temp
        if (i <= 5){
            dataTodayRefined.value[date][0].push(temp)
        }
        else if (i <= 11){
            dataTodayRefined.value[date][1].push(temp)
        }
        else if (i <= 17){
            dataTodayRefined.value[date][2].push(temp)
        }
        else{
            dataTodayRefined.value[date][3].push(temp)
        }

    }
    dataTodayRefined.value['2025-06-04'].forEach(getAverage)

    console.log(dataTodayRefined.value)


    // dataWeeklyRefined.value = {
    //     "2025-05-29": [
    //         ["morning", 15, 13, 4, 'partially cloudy'],
    //         ["afternoon", 20, 18, 5, 'sunny'],
    //         ["evening", 18, 16, 5, 'cloudy'],
    //         ["night", 14, 13, 2, 'clear-night']
    //     ]
    // }
}

function getAverage(element, index, array){
    const [label, ...temps] = element
    if (temps.length === 0) return

    const sum = temps.reduce((accumulator, value) => accumulator + Math.floor(value), 0) // accumulator = value + accumulator (both of previous step)(0 on the first) 
    const average = Math.floor(sum/temps.length)

    element.splice(1) // removes temperatures
    element.push(average)
    
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

<WeatherForDay v-if="dataWeeklyRaw"
:data="dataWeeklyRaw"
></WeatherForDay>
</template>