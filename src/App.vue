<template>
  <div class="app-wrapper">
    <template v-if="!route.meta.bare">
      <Header />
      <main class="main-content">
        <router-view :key="route.path" />
      </main>
      <footer :class="{ 'hide-mobile': route.name === 'Assessment' || route.name === 'BikeResult' }">
        <p>
          Created by <a href="https://viktorkoves.com" class="author-link">Viktor Köves</a>

          <a href="https://github.com/vkoves/the-right-bike" target="_blank" rel="noopener noreferrer" class="github-pill">
            <img src="/images/icons/github.svg" alt="" class="github-icon">
            Contribute On GitHub
          </a>
        </p>
      </footer>
    </template>
    <router-view v-else />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';

const route = useRoute();
</script>

<style lang="scss">
/* Global styles are imported in main.js */
</style>