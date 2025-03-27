<script setup>
    import { ref, onMounted, computed, nextTick } from 'vue';
    import axios from 'axios';
    import { weatherIcons } from '@/assets/icons/icons';

    const weatherToday = ref(null)
    const isLoading = ref(false)
    const dataHourly = ref([])
    const scrollContainer = ref(null)

    async function fetchWeatherToday(location) {   
        try{
            const response = await axios.get(`http://127.0.0.1:5000/weather/today/hourly/${location}`)
            return response.data
        }
        catch(error){
            console.error(error)
            throw error
        }
    }

    function handleWheel(e) {
        // Only scroll horizontally if there's horizontal content
        if (scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth) {
            // Prevent vertical scrolling
            e.preventDefault()
            // Scroll horizontally instead
            scrollContainer.value.scrollLeft += e.deltaY
        }
    }

    function displayIcon(weatherDescription){
        if (weatherDescription.includes('partly-cloudy-day')) return weatherIcons.partlyCloudy
        if (weatherDescription.includes('cloudy')) return weatherIcons.cloudy
        if (weatherDescription.includes('rain')) return weatherIcons.rain
        if (weatherDescription.includes('clear-night')) return weatherIcons.clearNight
    }

    function getCurrentTimeString() {
       const now = new Date()
       return `${now.getHours().toString().padStart(2,"0")}:00:00`
    }

    function scrollToCurrentTime(){
        if(!scrollContainer.value || !dataHourly.value) return

        const currentTime = getCurrentTimeString()
        const index = dataHourly.value.findIndex(item => item.datetime === currentTime)

        if(index !== -1){
            const container = scrollContainer.value;
            const items = container.querySelectorAll('.scroll-item');
        if (items[index]) {
            items[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    }

    function roundUp(element,index,array){
        array[index].temp = +Math.round(array[index].temp)
        array[index].feelslike = +Math.round(array[index].feelslike)
    }

    
    onMounted(async () => {
        isLoading.value = true
        try{
            const data = await fetchWeatherToday('Grodno')
            weatherToday.value = data
            dataHourly.value = data.hours || []
            dataHourly.value.forEach(roundUp)
            
            await nextTick()
            scrollToCurrentTime()
        }
        catch(error){
            console.error('Failed to load weather: ', error)
        }
        finally{
            isLoading.value = false
        }
    })  



    
</script>

<template>
    <h1>Weather Today</h1>
    <hr>
    <br>
    <div class="weather-display-container">
        <div class="feels-like-label">feels like</div>
        <div class="horizontal-scroll-container" ref="scrollContainer" @wheel.prevent="handleWheel">
            <div v-for="(item, index) in dataHourly" :key="index" class="scroll-item">
                <div :class="{ 'current-time': item.datetime === getCurrentTimeString() }">
                    {{ item.datetime === getCurrentTimeString() ? 'Now' : item.datetime }}
                </div>
                <div>
                    <img :src="displayIcon(item.icon)" :alt="item.icon" class="weatherIcon" :title="item.icon">
                </div>
                <div class="temperature">
                    {{ item.temp }}℃
                </div>
                <div class="feels-like-temperature">
                    {{ item.feelslike }}℃
                </div>
            </div>
        </div>
    </div>
 <div class="weather-average-stats" v-if="weatherToday">
    <p>Description: {{ weatherToday.conditions }} </p>
    <p>Max temperature: {{ weatherToday.tempmax }}℃</p>
    <p>Min temperature: {{ weatherToday.tempmin }}℃</p>
    <p>Average temeperature: {{ weatherToday.temp }}℃</p>
    <p>Feels like {{ weatherToday.feelslike }}℃</p>
    <p>Precipitation type: {{ weatherToday.preciptype.join(', ') }}</p>
 </div>
</template>

<style scoped>
    
    .weather-display-container{
        position: relative;
    }
    
    .horizontal-scroll-container {
        display: flex;
        overflow-x: auto; /* Enables horizontal scrolling */
        white-space: nowrap; /* Prevents items from wrapping */
        gap: 16px; /* Adds space between items */
        padding: 12px;
        background: #f5f5f5;
        border-radius: 8px;
    }

    .scroll-item {
        display: flex;
        flex-direction: column;
        flex: 0 0 auto;  /*Prevents items from shrinking/growing */
        padding: 20px;
        width: 70px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        user-select: none;
        text-align: center;
    }

    .current-time {
        font-weight: bold;
        color: #42b983;
    }

    .weatherIcon{
        width: 25px;
        height: 30px;
        margin-top: 1em;
    }

    .temperature{
        margin-top: 1em;
    }

    .feels-like-label{
        position: absolute;
        left: 1%;
        top: 60%;
        width: 100px;
        text-align: right;
        padding-right: 10px;
        color: rgb(121, 120, 120);
    }

    .feels-like-temperature{
        margin-top: 1.5em;
        color: rgb(121, 120, 120);
    }
</style>