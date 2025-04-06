<script setup>
import { onMounted } from 'vue'


const props = defineProps({
    dataGeneral: {
        type: Object
    }
})

// const 

// onMounted(() => {
//     const cachedAttributes = props.dataGeneral? {
//     description: props.dataGeneral.conditions,
//     feelsLike: `${Math.floor(props.dataGeneral.feelslike)}℃`,
//     feelsLikeMax: `${Math.floor(props.dataGeneral.feelslikemax)}℃`,
//     feelsLikeMin: `${Math.floor(props.dataGeneral.feelslikemin)}℃`,
//     temperatureMax: `${Math.floor(props.dataGeneral.tempmax)}℃`,
//     temperatureMin: `${Math.floor(props.dataGeneral.tempmin)}℃`,
//     temperatureAvg: `${Math.floor(props.dataGeneral.temp)}℃`,
//     precipitationType: props.dataGeneral.preciptype?.join(', ') || "-",
//     humidity: `${Math.floor(props.dataGeneral.humidity)}%`,
//     windSpeedMean: `${Math.floor(props.dataGeneral.windspeedmean)} m/s`,
//     uvindexAvg: Math.floor(props.dataGeneral.uvindexAvg / 24),
//     uvindexMax: props.dataGeneral.uvindex
//     } : null
// })


const labelMap = {
    description: 'Description',
    feelsLikeAvg: 'Feels Like avg',
    feelsLikeMax : 'Feels like max',
    feelsLikeMin : 'Feels like min',
    temperatureMax: 'Max Temp',
    temperatureMin: 'Min Temp',
    temperatureAvg: 'Avg Temp',
    precipitationType: 'Precipitation',
    humidity : 'humidity',
    uvindexAvg : 'Avg UV index',
    uvindexMax : 'Max UV index'

}

</script>

<template>
<br>
<div class="title">
    <div>
        <h3 class="general-info-label">General Info</h3>
    </div>
    <div class="add-more-container">
        <label class="add-more-label">Add more attributes</label>
        <form class="inline-form">
            <input type="text" name="" id="">
        </form>
    </div>
</div>
 <div class="weather-average-stats">
    <div class="stats-item" v-for="(value, key) in props.dataGeneral">
        <div class="item-label">
            <u>{{ labelMap[key] || key }}</u>
        </div>
        <div class="item-value">
            {{ value }}
        </div>
    </div>
 </div>

</template>

<style scoped>

.title{
    display: flex;
    gap: 100px;
    align-items: center;
}
.add-more-container{
    display: flex;
    align-items: center;
    gap: 10px;
}

.general-info-label, .add-more-label{
    margin-left: 30px;
    font-size: 2em;
}

.weather-average-stats{
    margin-top: 3px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;;
}

.stats-item{
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    padding: 10px 20px;
    width: 130px;
    height: 70px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    user-select: none;
    text-align: center;
}

.item-label{
    margin-bottom: 5px;
    color: rgb(121, 120, 120);
}

</style>