<script setup>
import { labelsMap } from '@/utils/labelsMap';
const props = defineProps({
    sunInfoForDayAdditional: {
        type: Object
    }
})
function getUvColor(description){
    if(description.includes('low')){
        return 'low'
    }
    else if(description.includes('Moderate')){
        return 'moderate'
    }
    else if(description.includes('Very High')){
        return 'very-high'
    }
    else if(description.includes('High')){
        return 'high'
    }
    else if(description.includes('Extreme')){
        return 'extreme'
    }
    return ''
}
</script>
<template>
<div class="sun-info-for-day-additional" v-for="(sunInfoAdditionalItem, key) in props.sunInfoForDayAdditional" :key="key">
    <div class="sun-info-for-day-key-container">
        <p class="sun-info-for-day-key">
            {{ labelsMap[key] || key }}
        </p>
    </div>
    <div class="sun-info-for-day-item-container">
        <p :class="`uv-${getUvColor(sunInfoAdditionalItem)}`" class="uv">
            {{ sunInfoAdditionalItem }} 
        </p>
    </div>
</div>
</template>
<style scoped>
.sun-info-for-day-additional{
    display: flex;
    align-items: center;
    gap: 4em;
}
.sun-info-for-day-key-container{
    width: 8em;
}
.sun-info-for-day-key{
    text-align: left;
    font-size: 1.5em;
    color: gray;
}
.sun-info-for-day-item-container{
    width: 11em;
}
.sun-info-for-day-item{
    font-size: 1.5em;
}
.uv{
    font-size: 1.5em;
    text-align: center
}
.uv-low {
  color: #2e7d32; 
}
.uv-moderate {
  color: #fbc02d; 
}
.uv-high {
  color: #f57c00; 
}
.uv-very-high {
  color: #d32f2f; 
}
.uv-extreme {
  color: #6a1b9a; 
}
</style>