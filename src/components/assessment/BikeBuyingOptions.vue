<template>
  <div class="buying-options" v-if="options">
    <h3>Some Potential Options</h3>
    <p class="buying-subtitle">
      Here's some specific models to consider at different price points! Use this as a starting
      point, we're not recommending any specific model.
    </p>

    <div class="tiers">
      <bike-model-card
        v-for="tier in tiers"
        :key="tier"
        :bike="options[tier]"
        :tier="tier"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { BIKE_RECOMMENDATIONS } from '../../constants/bike-recommendations';
import BikeModelCard from './BikeModelCard.vue';

const props = defineProps({
  bikeType: { type: String, required: true }
});

const tiers = ['budget', 'midrange', 'premium'];

const options = computed(() => BIKE_RECOMMENDATIONS[props.bikeType] || null);
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

.buying-options {
  margin: 2rem 0;
  text-align: center;

  h3 {
    color: vars.$primary;
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
  }
}

.buying-subtitle {
  color: vars.$text-secondary;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.tiers {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .tiers {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
