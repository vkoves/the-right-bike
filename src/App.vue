<template>
  <div class="app-wrapper">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <footer>
      <p>
        ©{{ currentYear }} <a href="https://viktorkoves.com" class="author-link">Viktor Köves</a>

        <a href="https://github.com/vkoves/the-right-bike" target="_blank" rel="noopener noreferrer" class="github-pill">
          <img src="/images/icons/github.svg" alt="" class="github-icon">
          Contribute On GitHub
        </a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';

const currentYear = new Date().getFullYear();
</script>

<style lang="scss">
/* Global styles are imported in main.js */
</style>