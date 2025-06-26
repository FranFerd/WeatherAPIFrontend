<script setup lang="ts">
  import Navbar from './components/Navbar.vue';
  import { RouterView } from 'vue-router';
  import { init } from './authService/auth';
  import { onMounted } from 'vue';

  onMounted(() => {
    init()
  })
</script>

<template>
  <Navbar></Navbar>
  <RouterView></RouterView>
</template>
