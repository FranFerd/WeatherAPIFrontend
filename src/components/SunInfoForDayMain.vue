<script setup lang="ts">
import type { SunInfoForDay } from '@/types/SunInfo';

const props = defineProps<{
    sunInfoForDayMain: SunInfoForDay
}>()
</script>
<template>
<span class="sun-info-for-day-main" v-for="sunInfoMainItem in props.sunInfoForDayMain">
    <p class="sun-info-for-day-item">
        {{ sunInfoMainItem }}
    </p>
</span>

</template>
<style scoped>
.sun-info-for-day-item{
    font-size: 1.5em;
}
</style>