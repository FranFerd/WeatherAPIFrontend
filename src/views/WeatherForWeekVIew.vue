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

function refineData(data){
    const date = data[0].datetime
    const hours = data[0].hours

    dataTodayRefined.value = {
        [date]: [ // [date] is used because plain date would be a 'date' string, not 2025-06-05, for example.
            ['night'],
            ['morning'],
            ['afternoon'],
            ['evening']
        ]
    }

    // console.log doesn't create a snapshot of the object. Instead it logs a reference and what you see in the console is the CURRENT state of the object.
    // console.log(JSON.parse(JSON.stringify(dataTodayRefined.value[date])))
    // Combined these 2 functions create a copy of dataTodayRefined. Now it's completely new object with no reference to the original.
    // No manipulations are done to it after, unlike dataTodayRefined, and it retains the original value; so it's a snapshot.
    
    if(dataTodayRefined.value[date]){
        const itemsToPush = ['temp', 'feelslike', 'windspeed', 'icon']
        let dataStartIndex = 1
        for(let itemToPush of itemsToPush){
            fillData(hours, itemToPush, date) 
            //console.table shows clearer logs and a snapshot. Works best with arrays and plain objects.
            // console.table(dataTodayRefined.value[date]) 
            dataTodayRefined.value[date].forEach(element => getAverage(element, dataStartIndex))
            dataStartIndex++
        }
    }
    console.log(dataTodayRefined.value[date])
}

function getAverage(element, valuesStartIndex){ 
    const values = element.slice(valuesStartIndex) // extract portion of an array starting at valuesStartIndex
    if (values.length === 0) return                // it shifts to the right every iteration to not delete average
    
    let average
    
    if(typeof(values[0]) === 'number'){
        const sum = values.reduce((accumulator, value) => accumulator + Math.floor(value), 0) // accumulator = value + accumulator (both of previous step)(0 on the first) 
        average = Math.floor(sum/values.length)
    }
    else if(typeof(values[0] === 'string')){
        const weatherPriorityListObject = getWeatherPriorityObject() 
        average = values.reduce((initial, current) => {  // initial is the first value because nothing is passed at the end (unlike 0 in previous reduce)
            return weatherPriorityListObject[current] > weatherPriorityListObject[initial] ? current : initial
        })
    }

    element.splice(valuesStartIndex) // removes all values before pushing average
    element.push(average)
}

function fillData(data, item, date){
    for(let i = 0; i < data.length; i++){ // i is hour index(0-23)
        const value = data[i][item]
        if (i <= 5) dataTodayRefined.value[date][0].push(value) // first 6 values in first array 
        else if (i <= 11) dataTodayRefined.value[date][1].push(value) // next 6 values in second array
        else if (i <= 17) dataTodayRefined.value[date][2].push(value)
        else dataTodayRefined.value[date][3].push(value)
    }
}

function getWeatherPriorityObject(){
    return {
        'thunderstorm' : 10,
        'rain' : 9,
        'snow' : 8,
        'fog' : 7,
        'partly-cloudy-day': 6,
        'partly-cloudy-night': 6,
        'cloudy': 5,
        'clear-day': 4,
        'clear-night': 4,
        'wind': 3,
        'hail': 2,
        'defaultWeather': 1
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

<WeatherForDay v-if="dataWeeklyRaw"
:data="dataWeeklyRaw"
></WeatherForDay>
</template>