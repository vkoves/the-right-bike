<template>
  <div class="buying-options" v-if="recommendations && recommendations.length">
    <h3 id="options">Some Potential Options <anchor-copy-button anchor="options" /></h3>
    <p class="buying-subtitle">
      Here's some specific models to consider at different price points! Use this as a starting
      point, we're not recommending any specific model.
    </p>

    <p v-if="lightweightHillsWarning" class="buying-warning">
      ⚠️ We're showing lightweight bikes since you need to carry yours upstairs, but lighter
      e-bikes may have less powerful motors — consider test-riding on hills before buying.
    </p>

    <div class="tiers">
      <bike-model-card
        v-for="(bike, i) in recommendations"
        :key="i"
        :bike="bike"
        :electric="bikeType.includes('ebike')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BikeModelRecommender from '../../services/BikeModelRecommender';
import AnchorCopyButton from '../AnchorCopyButton.vue';
import BikeModelCard from './BikeModelCard.vue';
import type { AssessmentProfile, BikeTypeId, BikeModelWithReasons } from '../../types';

const props = defineProps({
  bikeType: { type: String, required: true },
  profile: { type: Object as () => AssessmentProfile | null, default: null }
});

const recommendations = computed<BikeModelWithReasons[] | null>(() => {
  if (props.profile) {
    const recommender = new BikeModelRecommender(props.profile);
    return recommender.getRecommendations();
  }

  return BikeModelRecommender.getDefaultRecommendations(props.bikeType as BikeTypeId);
});

const lightweightHillsWarning = computed(() => {
  if (!props.profile || !recommendations.value) return false;
  return props.profile.geography.hilly &&
    props.profile.storage === 'upper-floor' &&
    recommendations.value.some(r => r.lightweight);
});
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

.buying-warning {
  background-color: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: vars.$border-radius;
  color: vars.$text-body;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .tiers {
    grid-template-columns: 1fr;
  }
}
</style>
