
<script setup>
import { ref } from 'vue'; 
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute()
const message = ref(null);
const city = ref(null);

async function handleSearch(){
    if (city.value) {
        const formattedCity = city.value.trim().replace(/\s+/g, '-').toLowerCase();
        const isValidAddress = await checkAddress(formattedCity);
        if (!isValidAddress) {
            message.value = 'Invalid address. Please try again.';
            return;
        }

        if(route.path.includes('today')){
            router.push(`/weather/today/${formattedCity}`);
        }
        else if(route.path.includes('week')){
            router.push(`/weather/week/${formattedCity}`);
        }
    } 
    else {
        alert('Please enter a city name.');
    }
}

async function checkAddress(location){
        try{
            const response = await axios.get(`http://127.0.0.1:5000/weather/hourly/check-address/${location}`)
            if (response.data) return true
            return false
        }
        catch(error){
            if(error.response){
                if(error.response.data?.message === 'Incorrect location'){
                    message.value = 'Incorrect location'
                }
                else{
                    message.value = 'Error checking address'
                }
            }
            else if(error.request){
                message.value = 'Network error - no response'
            }
            else{
                message.value = 'Request setup error'
            }
            console.error(error)
            }
    }

</script>

<template>
    <div class="weather-search">
        <form @submit.prevent="handleSearch">
            <input 
                type="text" 
                v-model="city" 
                placeholder="Enter city name" 
                class="search-input"
            />
            <button type="submit" class="search-button">Search</button>
        </form>
    </div>
    <div>
        <p v-if="message" class="error-message">{{ message }}</p>
        <p v-else class="success-message">Search for a city to get the weather!</p>
    </div>
</template>
<style scoped>
.weather-search {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

.search-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
}

.search-button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007BFF;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-button:hover {
    background-color: #0056b3;
    transition: background-color 0.3s ease;
}
.error-message {
    color: red;
    text-align: center;
    font-size: 18px;
}
.success-message {
    color: green;
    text-align: center;
    font-size: 18px;
}
</style>