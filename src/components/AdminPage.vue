<template>
  <div class="admin-page">
    <h1>Social Cards</h1>
    <ul>
      <li><router-link to="/social-image">Default</router-link></li>
      <li v-for="(bike, key) in BikeTypes" :key="key">
        <router-link :to="'/social-image/' + key">{{ bike.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { BikeTypes } from '../constants/bikeTypes';
</script>

<style scoped>
.admin-page { max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
</style>
