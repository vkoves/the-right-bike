<template>
  <div class="buying-options" v-if="visibleModels && visibleModels.length">
    <h3 id="options">
      <span class="hide-mobile">Some Specific </span>Bikes to Consider <anchor-copy-button anchor="options" />
    </h3>
    <p class="buying-subtitle">
      Here's some specific models to consider at different price points!
    </p>
    <p>
      Use this as a starting point - we're not recommending any specific model, and aren't
      affiliated with any brand.
    </p>

    <p v-for="(warning, i) in warnings" :key="i" class="buying-warning">
      <strong>Note:</strong> {{ warning }}
    </p>

    <div class="tiers">
      <bike-model-card
        v-for="bike in visibleModels"
        :key="bike.model"
        :bike="bike"
        :electric="BikeTypes[bikeType as BikeTypeId]?.electric ?? false"
      />
    </div>

    <button
      v-if="!showAll && hasMore"
      class="view-all-btn"
      @click="showAll = true"
    >
      View All {{ BikeTypes[bikeType as BikeTypeId]?.label }} Models
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BikeModelRecommender from '../../services/BikeModelRecommender';
import { BikeTypes } from '../../constants/bikeTypes';
import AnchorCopyButton from '../AnchorCopyButton.vue';
import BikeModelCard from './BikeModelCard.vue';
import type { AssessmentProfile, BikeTypeId, BikeModelWithReasons } from '../../types';

const props = defineProps({
  bikeType: { type: String, required: true },
  profile: { type: Object as () => AssessmentProfile | null, default: null }
});

const showAll = ref(false);
watch(() => props.bikeType, () => { showAll.value = false; });

const recommender = computed(() =>
  props.profile
    ? new BikeModelRecommender(props.bikeType as BikeTypeId, props.profile)
    : null
);

const recommendations = computed<BikeModelWithReasons[] | null>(() => {
  if (recommender.value) return recommender.value.getRecommendations();
  return BikeModelRecommender.getDefaultRecommendations(props.bikeType as BikeTypeId);
});

const allModels = computed<BikeModelWithReasons[] | null>(() => {
  if (recommender.value) return recommender.value.getAllModels();
  return BikeModelRecommender.getDefaultRecommendations(props.bikeType as BikeTypeId);
});

const visibleModels = computed(() =>
  showAll.value ? allModels.value : recommendations.value
);

const hasMore = computed(() =>
  (allModels.value?.length ?? 0) > (recommendations.value?.length ?? 0)
);

const warnings = computed(() =>
  recommender.value ? recommender.value.getWarnings() : []
);
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

  .buying-subtitle {
    font-size: 1.125em;
    font-weight: 600;
    max-width: none;
  }
}

.buying-warning {
  background-color: vars.$secondary-light;
  border: 1px solid vars.$secondary;
  border-radius: vars.$border-radius;
  color: vars.$text-body;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  text-align: left;
}

.tiers {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.view-all-btn {
  margin-top: 1.25rem;
  padding: 0.6rem 1.5rem;
  background-color: vars.$lightest-gray;
  color: vars.$text-secondary;
  border: 2px solid vars.$lighter-gray;
  border-radius: vars.$border-radius-lg;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: vars.$primary;
    color: vars.$primary;
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .tiers {
    grid-template-columns: 1fr;
  }
}
</style>
