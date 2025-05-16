<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'


const props = defineProps({
    dataGeneral: {
        type: Object
    },
    deletedItems: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['delete-item', 'restore-item'])
const searchQuery = ref('')
const isShowDropdown = ref(false)

function handleClickOutside(event) {
    if (event.target.closest('.dropdown-wrapper') === null) {
        isShowDropdown.value = false
    }
}

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

function handleDelete(key) {
    emit('delete-item', key)
}

function handleRestoreItem(key) {
    console.log('Restoring item:', key)
    emit('restore-item', key)
    isShowDropdown.value = false
    searchQuery.value = '' 
}

const filteredDeletedItems = computed(() => {
  if (!props.deletedItems) return {}
  return Object.entries(props.deletedItems)
    .map(([key, value]) => ({ key, value }))
    .filter(item => {
      const label = labelMap[item.key] || item.key
      return label.toLowerCase().includes(searchQuery.value.toLowerCase())
    })
})

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
<br>
<div class="title">
    <div>
        <h3 class="general-info-label">General Info</h3>
    </div>
    <div class="add-more-container" v-if="Object.keys(props.deletedItems).length">
        <label class="add-more-label">Add more attributes</label>
        <div class="dropdown-wrapper">
            <input type="text" v-model="searchQuery" @focus="isShowDropdown = true" placeholder="Search..." class="dropdown-input" >
            <div v-if="isShowDropdown && filteredDeletedItems.length" class="dropdown-menu">
                <div 
                v-for="item in filteredDeletedItems" 
                :key="item.key"
                class="dropdown-item"
                @click="handleRestoreItem(item.key)"
                >
                    {{ labelMap[item.key] || item.key }}: {{ item.value }}
                    <button class="restore-btn">Restore</button>
                </div>
            </div>
        </div>

    </div>
</div>
 <div class="weather-average-stats">
    <div class="stats-item" v-for="(value, key) in props.dataGeneral">
        <button class="cancel-button" @click="handleDelete(key)">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 128 128"><path fill="#fff" d="M64 14A50 50 0 1 0 64 114A50 50 0 1 0 64 14Z" transform="rotate(-45.001 64 64.001)"></path><path fill="#444b54" d="M64,117c-14.2,0-27.5-5.5-37.5-15.5c-20.7-20.7-20.7-54.3,0-75C36.5,16.5,49.8,11,64,11c14.2,0,27.5,5.5,37.5,15.5c10,10,15.5,23.3,15.5,37.5s-5.5,27.5-15.5,37.5C91.5,111.5,78.2,117,64,117z M64,17c-12.6,0-24.4,4.9-33.2,13.8c-18.3,18.3-18.3,48.1,0,66.5C39.6,106.1,51.4,111,64,111c12.6,0,24.4-4.9,33.2-13.8S111,76.6,111,64s-4.9-24.4-13.8-33.2S76.6,17,64,17z"></path><path fill="#ff697b" d="M53.4,77.6c-0.8,0-1.5-0.3-2.1-0.9c-1.2-1.2-1.2-3.1,0-4.2l21.2-21.2c1.2-1.2,3.1-1.2,4.2,0c1.2,1.2,1.2,3.1,0,4.2L55.5,76.7C54.9,77.3,54.2,77.6,53.4,77.6z"></path><path fill="#ff697b" d="M74.6,77.6c-0.8,0-1.5-0.3-2.1-0.9L51.3,55.5c-1.2-1.2-1.2-3.1,0-4.2c1.2-1.2,3.1-1.2,4.2,0l21.2,21.2c1.2,1.2,1.2,3.1,0,4.2C76.1,77.3,75.4,77.6,74.6,77.6z"></path>
            </svg>
        </button>
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

.add-more-container {
  position: relative;
  margin-top: 1rem;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dropdown-item {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.restore-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
}

.restore-btn:hover {
  background: #45a049;
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
    position: relative;
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

.cancel-button {
    position: absolute;
    top: -13%;
    left: 90%;
    right: 0;
    background-color: transparent;
    border: none;
    color: rgb(225, 86, 86);
    font-size: 1.2em;
    cursor: pointer;
    width: 30px; /* Match SVG dimensions */
    height: 30px;
    padding: 0;
    transition: all 0.2s ease; 
    border-radius: 50%; /* Makes the hit area circular */
}

.cancel-button:hover {
    color: rgb(255, 0, 0);
    transform: scale(1.1); /* Slightly increase size */
}

/* Target the circle path in SVG on hover */
.cancel-button:hover svg path:first-child {
    fill: #ff697b; /* Same color as the X */
}

/* Target the X paths to make them white when circle is filled */
.cancel-button:hover svg path:not(:first-child) {
    fill: white;
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