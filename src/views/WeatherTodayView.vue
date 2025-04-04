<script setup>
    import WeatherHourly from '@/components/WeatherHourly.vue';
    import WeatherTodayGeneral from '@/components/WeatherTodayGeneral.vue';
    import axios from 'axios';
    import { onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    const data = ref(null)
    const dataHourly = ref(null)
    const dataGeneral = ref(null)
    const addressUrl = ref(null)
    const message = ref()
    const route = useRoute()
    const props = defineProps({
        address : {
            type: String,
            required: true
        }
    })

    watch(() => route.params.address, (newAddress) => {
        addressUrl.value = newAddress
    }, {immediate:true})

    async function checkAddress(location){
        try{
            const response = await axios.get(`http://127.0.0.1:5000/weather/today/hourly/check-address/${location}`)
            if (response.data) return true
            else {return false}
        }
        catch(error){
                message.value = 'Error fetching.'
                console.error(error)
            }
    }

    async function fetchWeatherToday(location) {   
        try{
            const response = await axios.get(`http://127.0.0.1:5000/weather/today/hourly/${location}`)
            return response.data
        }
        catch(error){
            console.error(error)
        }
    }

    function setDataGeneral(data){
        dataGeneral.value = {
            "description" : data.conditions,
            "feelsLike" : Math.floor(data.feelslike) + '℃',
            "temperatureMax" : Math.floor(data.tempmax) + '℃',
            "temperatureMin" : Math.floor(data.tempmin) + '℃',
            "temperatureAvg" : Math.floor(data.temp) + '℃',
            "precipitationType" : data.preciptype?.join(', ') || "-"
        }
    }

    onMounted(async() => {
        try{
            if (checkAddress(addressUrl.value)){
                const weatherData = await fetchWeatherToday(addressUrl.value)
                data.value = weatherData
                setDataGeneral(weatherData)
            }
            else{
                console.log('No fucking way')
            }
        }
        catch(error){
            console.error('Error: ', error)
            data.value = []
        }
    })
</script>

<template>
    <div class="weather-info" v-if="!message">
        <h1 class="weather-today" v-if="data">{{ data.datetime }} (Today) {{ address }}</h1>
        <hr>
        <WeatherHourly v-if="data" :data="data"></WeatherHourly>
        <WeatherTodayGeneral v-if="dataGeneral" :data="dataGeneral"></WeatherTodayGeneral>
    </div>
    <div class="error-message">
        <p>{{ message }}</p>
    </div>
</template>

<style scoped>
    .weather-today{
        text-align: center;
        font-size: 3em;
    }

    .error-message{
        font-size: 30px;
        color: red;
    }

</style>