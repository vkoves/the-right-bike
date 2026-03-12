<template>
  <div class="app-wrapper" :class="{ '-fit-viewport': route.path === '/' }">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <footer>
      <p>
        ©{{ currentYear }} -<a href="https://viktorkoves.com">Viktor Köves</a>
        | <a href="https://github.com/vkoves/the-right-bike" target="_blank" rel="noopener noreferrer">View On GitHub</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentYear = new Date().getFullYear();
</script>

<style lang="scss">
/* Global styles are imported in main.js */
</style>