<script setup>

const props = defineProps({
    dataGeneral: {
        type: Object
    }
})

const labelMap = {
    description: 'Description',
    precipitationType: 'Precipitation',
    uvindex: 'UV index',
    sunRise: 'Sunrise',
    sunSet: 'Sunset',
    highUvHours: "High UV hours",
    dayLength: "Day Length"     
}

</script>

<template>
<div class="general-info-label-container">
    <h3 class="general-info-label">General Info</h3>
</div>
<div class="weather-average-stats">
    <div class="stats-item" v-for="(value, key) in props.dataGeneral">
        <div class="item-label">
            {{ labelMap[key] || key }}
        </div>
        <div class="item-value">
            {{ value }}
        </div>
    </div>
</div>

</template>

<style scoped>

.general-info-label-container{
    background-color: rgb(171, 254, 184);
    height: 3.5em;
    position: relative;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
}

.general-info-label{
    margin-left: 30px;
    font-size: 2em;
    padding: 5px;
    color: hsl(0, 0%, 15%);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.weather-average-stats{
    margin-top: 3px;
    display: flex;
    position: relative;
    z-index: 1;
    margin-top: -1em;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 15px;;
}

.stats-item{
    display: flex;
    position: relative;
    flex-direction: column;
    flex: 0 0 auto;
    padding: 10px 20px;
    width: 130px;
    border-radius: 4px;
    user-select: none;
    text-align: center;
}

.item-value{
    margin-top: 5px;
    font-size: 1em;
    padding: 5px;
    font-weight: bold;
}
.item-label{
    margin-bottom: 5px;
    color: rgb(121, 120, 120);
}

</style>