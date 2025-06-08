<script setup>
const props = defineProps({
    address: {
        type: String,
        required: true
    }
})
</script>

<template>
<div class="address-container">
    <h1 class="address-label">{{props.address}}</h1>
</div>
</template>

<style scoped>
.address-container{
    background-color: rgb(129, 254, 148);
    min-height: 4em;
    position: relative;
    z-index: -1;
    margin-bottom: -1em;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
}
.address-label{
    margin-left: 30px;
    font-size: 2em;
    padding: 5px;
    color: hsl(0, 0%, 15%);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
</style>