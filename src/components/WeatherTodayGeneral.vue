<script setup>

const props = defineProps({
    data: {
        type: Object
    }
})

const labelMap = {
    description: 'Description',
    feelsLike: 'Feels Like',
    temperatureMax: 'Max Temp',
    temperatureMin: 'Min Temp',
    temperatureAvg: 'Avg Temp',
    precipitationType: 'Precipitation'
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
    <div class="stats-item" v-for="(value, key) in props.data">
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
    justify-content: space-between;
    gap: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;;
}

.stats-item{
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;  /*Prevents items from shrinking/growing */
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
}

</style>