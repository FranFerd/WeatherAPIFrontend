<script setup lang="ts">
import { onMounted, watch, ref} from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import WeatherForDay from '@/components/WeatherForDay.vue';
import AddressWeek from '@/components/AddressWeek.vue';

import calculateDayLength from '@/utils/calculateDayLength';
import { weatherPriorityObject } from '@/utils/getWeatherPriorityObject'
import { setUvIndexHourly, showHighUvHoursMessage, getUvDescription } from '@/utils/uvIndex';
import type { WeatherKey } from '@/utils/getWeatherPriorityObject';

import type { 
    WeatherDataForWeekRaw, 
    WeatherDataForWeekRefined, 
    WeatherDataForDayRefined, 
    WeatherDataForDayFull, 
    HourlyInfo, 
    ItemToPushKey
} from '@/types/WeatherData';

import type { SunInfoForWeek } from '@/types/SunInfo';
import type { UvindexAndHighUvHoursForWeek, UvindexForDay } from '@/types/UvIndexData';

const route = useRoute()

const addressUrl = ref<string>('')
const resolvedAddress = ref<string>('')

const dataWeeklyRaw = ref<WeatherDataForWeekRaw | null>(null)
const dataWeeklyRefined =  ref<WeatherDataForWeekRefined>({})

const sunInfo = ref<SunInfoForWeek>({})
const uvindexHourly = ref<UvindexForDay>({})
const highUvHoursMessage = ref<string>('')
const uvindexForWeek = ref<UvindexAndHighUvHoursForWeek>({})

watch(() => route.params.address, (newAddress) => {
    addressUrl.value = String(newAddress)
}, {immediate:true} )

function isNumber(value: unknown): value is number { // Treat value as number if the function returns true
    return typeof value === 'number' && !isNaN(value)
}

function isString(value: unknown): value is string {
    return typeof value === 'string'
}

async function fetchWeatherData(location: string): Promise<WeatherDataForWeekRaw | null>{
    try{
        const response = await axios.get(`http://127.0.0.1:5000/weather/hourly/${location}/7`)
        return response.data
    }
    catch(error){
        console.error(`Error: `, error)
        return null
    }
}

function refineData(data: WeatherDataForDayFull[]): void{
    for(let dayIndex = 0; dayIndex < data.length; dayIndex++){ // day index (0-6)
        const date: string = data[dayIndex].datetime
        const hourlyData: HourlyInfo[] = data[dayIndex].hours

        dataWeeklyRefined.value[date] = [  // [date] is used because plain date would be a 'date' string, not '2025-06-05', for example.
            ['night'],
            ['morning'],
            ['afternoon'],
            ['evening']
        ]

        const sunrise: string = data[dayIndex].sunrise.slice(0, 5) // Remove seconds
        const sunset: string = data[dayIndex].sunset.slice(0, 5)
        sunInfo.value[date] = [sunrise, calculateDayLength(data[dayIndex]), sunset]

        fillSunDataAdditional(hourlyData, date, data[dayIndex].uvindex)
        
        if(dataWeeklyRefined.value[date]){
            const itemsToPush: ItemToPushKey[] = ['temp', 'icon', 'feelslike', 'windspeed' ]
            let dataStartIndex = 1
            for(let itemToPush of itemsToPush){
                fillData(hourlyData, itemToPush, date) 
                dataWeeklyRefined.value[date].forEach(element => getAverage(element, dataStartIndex))
                dataStartIndex++
            }
        }
    }
}

function getAverage(element: WeatherDataForDayRefined, valuesStartIndex: number): number | string | undefined{ 
    const values = element.slice(valuesStartIndex) // extract portion of an array starting at valuesStartIndex
    if (values.length === 0) return undefined      // it shifts to the right every iteration to not delete averages
    
    let average: number | string | undefined
    
    if(typeof(values[0]) === 'number'){
        const validNumbers: number[] = values.filter(isNumber) // now validNumbers is filtered to only numbers array.
        if(validNumbers.length === 0) return undefined

        const sum: number = validNumbers.reduce((accumulator, value) => accumulator + Math.floor(value), 0) // accumulator = value + accumulator (both of previous step)(0 on the first) 
        average = Math.floor(Number(sum)/values.length)
    }
    else if(typeof values[0] === 'string'){
        const validStrings: string[] = values.filter(isString)
        if(validStrings.length === 0) return undefined

        average = validStrings.reduce((initial, current) => {  // initial is the first value because nothing is passed at the end (unlike 0 in previous reduce)
            return weatherPriorityObject[current as WeatherKey] > weatherPriorityObject[initial as WeatherKey] ? current : initial // whatever reduce returns becomes new initial
        })                                                     // 
    }

    if(average !== undefined){
        element.splice(valuesStartIndex) // removes all values before pushing average
        element.push(average)
    }
}

function fillSunDataAdditional(data: HourlyInfo[], date: string, uvindex: number): void{
    uvindexHourly.value[date] = setUvIndexHourly(data)
    highUvHoursMessage.value = showHighUvHoursMessage(uvindexHourly.value[date])
    
    uvindexForWeek.value[date] = {
        'uvindex': `${uvindex}, ${getUvDescription(uvindex)}`,
        'highUvHours' : highUvHoursMessage.value ? highUvHoursMessage.value : 'No high UV hours'
    }
}

function fillData(data: HourlyInfo[], item: ItemToPushKey, date: string): void{
    for(let hourIndex = 0; hourIndex < data.length; hourIndex++){ // hour index(0-23)
        const value: string | number = data[hourIndex][item]

        if (hourIndex <= 5) dataWeeklyRefined.value[date][0].push(value) // first 6 values in first array 
        else if (hourIndex <= 11) dataWeeklyRefined.value[date][1].push(value) // next 6 values in second array
        else if (hourIndex <= 17) dataWeeklyRefined.value[date][2].push(value) // [0] is night array, [1] is morning, etc
        else dataWeeklyRefined.value[date][3].push(value)
    }
}

onMounted(async() => {
    // No need for try-catch, fetchWeatherData already has it. Refer to WeatherTodayView for comparison
    const weatherData = await fetchWeatherData(addressUrl.value)
    if(weatherData){
        dataWeeklyRaw.value = weatherData
        resolvedAddress.value = weatherData.resolvedAddress
        if(dataWeeklyRaw.value) refineData(dataWeeklyRaw.value.days)
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
:uvindex-info="uvindexForWeek">
</WeatherForDay> <!-- Vue automatically handles props; no need to pass .value in props -->
</template>