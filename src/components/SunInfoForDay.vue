<script setup>
const props = defineProps({
    sunInfoForWeek: {
        type: Array,
        required: true
    }
})
</script>
<template>
<!-- <div v-for="(sunInfoForDay, index) in sunInfoForWeek" :key="index">
    {{ sunInfoForDay }}
</div> -->
<div>
    {{ sunInfoForWeek }}
</div>
</template>
<style scoped>

</style>