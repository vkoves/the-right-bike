<template>
  <div class="page-container">
    <h1>All Bike Recommendations</h1>
    <p class="debug-note">Debug page — all specific bike model recommendations at a glance.</p>

    <div v-for="(bikes, typeKey) in BikeRecommendations" :key="typeKey" class="bike-group">
      <h2>{{ BikeTypes[typeKey].title }}</h2>
      <div class="tiers">
        <bike-model-card
          v-for="(bike, i) in bikes"
          :key="i"
          :bike="bike"
          :electric="(typeKey as string).includes('ebike')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BikeRecommendations } from '../constants/bike-recommendations';
import { BikeTypes } from '../constants/bikeTypes';
import BikeModelCard from './assessment/BikeModelCard.vue';
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: vars.$primary;
  margin-bottom: 0.5rem;
}

.debug-note {
  text-align: center;
  color: vars.$text-secondary;
  font-weight: 600;
  margin-bottom: 2rem;
}

.bike-group {
  margin-bottom: 2.5rem;
}

.bike-group h2 {
  color: vars.$dark;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid vars.$lighter-gray;
}

.tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .page-container {
    padding: 1rem;
  }

  .tiers {
    grid-template-columns: 1fr;
  }
}
</style>
