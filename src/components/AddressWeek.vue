<script setup lang="ts">
const props = defineProps({
    address: {
        type: String,
        required: true
    }
})
</script>

<template>
<div class="address-container">
    <h1 class="address-label" :tooltip="props.address">{{props.address}}</h1>
</div>
</template>

<style scoped>
.address-container{
    background-color: rgb(129, 254, 148);
    min-height: 4em;
    z-index: 1;
    margin-bottom: -1em;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
}
.address-label{
    display: block;
    margin-left: 30px;
    font-size: 2em;
    padding: 5px;
    color: hsl(0, 0%, 15%);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 1500px;
    z-index: 3;
    position: relative;
}
</style>