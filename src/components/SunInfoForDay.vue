<script setup>
const props = defineProps({
    sunInfoForDayMain: {
        type: Array,
        required: true
    },
    sunInfoForDayAdditional: {
        type: Array,
        required: true
    }
})
console.log(props.sunInfoForDayMain)
</script>
<template>
<div class="sun-info-for-day" v-for="sunItem in props.sunInfoForDayMain">
    <p class="sun-info-for-day-item">
        {{ sunItem }}
    </p>
</div>
</template>
<style scoped>
.sun-info-for-day-item{
    font-size: 1.5em;
}
</style>