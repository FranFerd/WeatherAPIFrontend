<script setup>

    const props = defineProps({
        data: {
            type: Object
        }
    })

    const labelMap = {
        description: 'Weather',
        feelsLike: 'Feels Like',
        temperatureMax: 'Max Temp',
        temperatureMin: 'Min Temp',
        temperatureAvg: 'Avg Temp',
        precipitationType: 'Precipitation'
    }

</script>

<template>
    <br>
    <h2 class="general-info-label">General Info</h2>
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

    .general-info-label{
        margin-left: 30px;
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