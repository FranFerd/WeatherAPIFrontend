<script setup>
import { weatherIcons } from '@/assets/icons/icons';
import {weatherMatchersForIcons, weatherMathcersForDisplay} from '@/utils/weatherMatchersForIcons';
const props = defineProps({
    dataForDayAverage: {
        type: Array,
        required: true
    }
})
const matchersForIcons = weatherMatchersForIcons()
const matchersForDisplay = weatherMathcersForDisplay()
console.log(props.dataForDayAverage)

function addIcon(description){
    const iconKey = matchersForIcons[description]
    return weatherIcons[iconKey] ? weatherIcons[iconKey] : weatherIcons.defautWeather
}
</script>
<template>
    <div class="weather-info-item" v-for="(item, index) in props.dataForDayAverage" :key="index">
        <div v-if="item > 0">
            <p>+</p>
        </div>
        <div class="item-container">
            <img v-if="typeof item === 'string' && addIcon(item)"
                :src="addIcon(item)"
                alt="weather icon"
                class="weather-icon"
            >
            <p class="item-word">
                {{ matchersForDisplay[item] || item}}
            </p>
        </div>
    </div>
</template>
<style scoped>
.weather-info-item{
    display: flex;
    align-items: center;
    margin: 5px;
    width: 10em;
}
.item-container{
    display: flex;
    align-items: center;
    gap: 7px;
}
.item-word{
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 1.5em;
}
.weather-icon{
    width: 50px;
    height: 50px;
}
</style>