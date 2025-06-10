<script setup>
import { weatherIcons } from '@/assets/icons/icons';
import { computed } from 'vue';
import { weatherMatchersForIcons, weatherMathcersForDisplay } from '@/utils/weatherMatchersForIcons';
const props = defineProps({
    dataForDayAverageMain: {
        type: Array,
        required: true
    },
    isHideLabels: {
        type: Boolean,
        default: false
    }
})
const matchersForIcons = weatherMatchersForIcons()
const matchersForDisplay = weatherMathcersForDisplay()

const filteredData = computed(() => {
    return props.dataForDayAverageMain.filter((item, index) => {
        if(props.isHideLabels && (index === 3 || index === 4)){ // Skip index 3 and 4 if isHideLabels. Feelslike and windspeed
            return false // return true to keep the element, false to exclude it
        }
        return true // keep this item
    })
})

function addIcon(description){
    const iconKey = matchersForIcons[description]
    return weatherIcons[iconKey] ? weatherIcons[iconKey] : weatherIcons.defautWeather
}
</script>
<template>
    <div class="weather-info-item" v-for="(item, index) in filteredData" :key="index">
        <div v-if="(item > 0) && (index === 1 || index === 3)" > <!-- index 1 is temperature, index 3 is feelslike -->
            <p>+</p>
        </div>
        <div class="item-container">
            <img v-if="typeof item === 'string' && addIcon(item)"
                :src="addIcon(item)"
                alt="weather icon"
                class="weather-icon"
            >
            <p :class="(index === 0 || index === 2) ? 'item-word' : 'item-digit'"> <!-- index 0 is night, morning..., index 2 is weather condition -->
                {{ matchersForDisplay[item] || item}}
            </p>
        <div v-if="(index === 4)"> <!-- index 4 is windspeed -->
            <p class="wind-speed-unit">m/s</p>
        </div>    
        </div>
    </div>
</template>
<style scoped>
.weather-info-item{
    display: flex;
    align-items: center;
    margin-left: 1em;
    margin-right: 1em;
}
.item-container{
    display: flex;
    align-items: center;
    gap: 7px; 
}
.item-word{
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 1.5em;
    width: 4em;
}
.item-digit{
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 1.5em;
    width: 1em;
    text-align: center;
}
.weather-icon{
    width: 50px;
    height: 50px;
}
.wind-speed-unit{
    font-size: 1.5em;
}
</style>