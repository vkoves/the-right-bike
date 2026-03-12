<template>
  <div class="page-container">
    <h1>Find Your Perfect Bike</h1>
    <p class="page-intro">Answer a few questions about your needs, and we'll recommend the right bike type for you.</p>

    <div class="assessment-container">
      <div class="progress-bar">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-dot" :class="{ '-done': currentStep > 2, '-active': currentStep === 2 }" style="left: 33.33%"></div>
        <div class="progress-dot" :class="{ '-done': currentStep > 3, '-active': currentStep === 3 }" style="left: 66.66%"></div>
      </div>

      <transition name="fade" mode="out-in">
        <!-- Step 1: Transportation Needs -->
        <transportation-needs-step
          v-if="currentStep === 1"
          key="step1"
          v-model="transportationNeeds"
          @next="nextStep"
        />

        <!-- Step 2: Geography -->
        <geography-step
          v-else-if="currentStep === 2"
          key="step2"
          v-model="geography"
          @prev="prevStep"
          @next="nextStep"
        />

        <!-- Step 3: Fitness Level -->
        <fitness-step
          v-else-if="currentStep === 3"
          key="step3"
          v-model="fitnessLevel"
          @prev="prevStep"
          @calculate="calculateRecommendation"
        />

        <!-- Step 4: Results -->
        <div v-else-if="currentStep === 4" key="step4" class="step-container results-container">
          <h2>Your Recommended Bike Type</h2>

          <bike-recommendation
            :recommendation-details="recommendationDetails"
            :all-bike-types="bikeTypeDetails"
            @bike-change="handleBikeChange"
          />

          <savings-comparison
            :bike-title="recommendationDetails.title"
            :bike-image="recommendationDetails.image"
            :costs="costs"
            :all-bike-types="bikeTypeDetails"
            :selected-bike-type="recommendation.value"
            @bike-change="handleBikeChange"
            key="savings-component"
          />

          <results-footer @restart="restartAssessment" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import TransportationNeedsStep from './TransportationNeedsStep.vue';
import GeographyStep from './GeographyStep.vue';
import FitnessStep from './FitnessStep.vue';
import BikeRecommendation from './BikeRecommendation.vue';
import SavingsComparison from './SavingsComparison.vue';
import ResultsFooter from './ResultsFooter.vue';
import { BIKE_COSTS, CAR_COSTS } from '../../constants/bikeCosts';
import { BikeTypes } from '../../constants/bikeTypes';

// Router setup
const router = useRouter();
const route = useRoute();

// State
const currentStep = ref(1);
// Use ref with an object inside instead of reactive directly
const transportationNeeds = ref({
  soloCommuting: false,
  cargo: false,
  transportingKids: false,
  transportingAdults: false
});

// Use ref with an object inside instead of reactive directly
const geography = ref({
  windy: false,
  hilly: false
});

const fitnessLevel = ref('medium');

// Watch for reactive state changes
watch(transportationNeeds, () => {}, { deep: true });
watch(geography, () => {}, { deep: true });
const recommendation = ref('');
const recommendationDetails = ref({});


// Cost comparison data
const costs = reactive({
  bike: {
    purchase: 0,
    maintenance: BIKE_COSTS.default.maintenance,
    fuel: BIKE_COSTS.default.fuel,
    insurance: BIKE_COSTS.default.insurance
  },
  car: {
    purchase: CAR_COSTS.purchase,
    maintenance: CAR_COSTS.maintenance,
    fuel: CAR_COSTS.fuel,
    insurance: CAR_COSTS.insurance
  }
});

// All bike type details — sourced from the single constant, not duplicated here
const bikeTypeDetails = BikeTypes;

// Computed properties
const progressPercent = computed(() => {
  return ((currentStep.value - 1) / 3) * 100;
});

// Determine if the user needs electric assistance - this basically means they are pulling a lot
// (e.g. kids, adults, cargo) and are medium or below fitness, or it's windy or hilly
const needsAssistance = computed(() => {
  // For high fitness, only return needs assistance if transporting adults
  if (fitnessLevel.value === 'high') {
    return transportationNeeds.value.transportingAdults;
  }

  // Any high load is an issue if you're not very strong, suggest e-assist. They can always opt
  // for a cheaper option
  return (needsCargo.value && fitnessLevel.value !== 'high') ||
         geography.value.windy ||
         geography.value.hilly ||
         fitnessLevel.value === 'low';
});

const needsCargo = computed(() => {
  return transportationNeeds.value.cargo ||
         transportationNeeds.value.transportingKids ||
         transportationNeeds.value.transportingAdults;
});

// Methods
function nextStep() {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function calculateRecommendation() {
  if (needsCargo.value) {
    if (transportationNeeds.value.transportingKids || transportationNeeds.value.transportingAdults) {
      // Longtail bike recommendation
      if (needsAssistance.value) {
        recommendation.value = 'longtail-ebike';
      } else {
        recommendation.value = 'longtail-bike';
      }
    } else if (needsAssistance.value) {
      // Regular cargo bike recommendation
      recommendation.value = 'cargo-ebike';
    } else {
      recommendation.value = 'cargo-bike';
    }
  } else {
    if (needsAssistance.value) {
      recommendation.value = 'commuter-ebike';
    } else {
      recommendation.value = 'regular-bike';
    }
  }

  // Set recommendation details
  setRecommendationDetails();

  // Update purchase cost based on the recommendation
  updateBikeCosts(recommendation.value);

  // Update URL with query parameter
  updateUrlWithRecommendation(recommendation.value);

  // Move to results page
  nextStep();
}

function updateBikeCosts(bikeType = null) {
  // Use the passed bike type or the current recommendation
  const typeToUse = bikeType || recommendation.value;

  // Get bike costs from constants
  const bikeCost = BIKE_COSTS[typeToUse] || BIKE_COSTS.default;

  // Update all cost values at once
  costs.bike.purchase = bikeCost.purchase;
  costs.bike.maintenance = bikeCost.maintenance;
  costs.bike.fuel = bikeCost.fuel;
  costs.bike.insurance = bikeCost.insurance;
}

function setRecommendationDetails() {
  recommendationDetails.value = bikeTypeDetails[recommendation.value];
}

// Handle bike change from the dropdown
function handleBikeChange(bikeType) {

  if (!bikeType) {
    // Restore original bike costs and details for the recommended bike
    updateBikeCosts(recommendation.value);
    recommendationDetails.value = bikeTypeDetails[recommendation.value];

    // Update URL to show the original recommendation
    updateUrlWithRecommendation(recommendation.value);
    return;
  }

  // Update costs and details based on selected bike type
  updateBikeCosts(bikeType);
  recommendationDetails.value = {...bikeTypeDetails[bikeType]};

  // Update URL with the new bike selection
  updateUrlWithRecommendation(bikeType);
}

// Function to update URL with bike recommendation
function updateUrlWithRecommendation(bikeType) {
  router.replace({
    query: {
      ...route.query,
      bike: bikeType
    }
  });
}

function restartAssessment() {
  // Reset all values
  currentStep.value = 1;

  // Reset transportationNeeds
  transportationNeeds.value = {
    soloCommuting: false,
    cargo: false,
    transportingKids: false,
    transportingAdults: false
  };

  // Reset geography
  geography.value = {
    windy: false,
    hilly: false
  };

  fitnessLevel.value = 'medium';
  recommendation.value = '';

  // Remove bike query parameter
  router.replace({
    query: {}
  });
}

// Reset when navigating to the assessment (e.g. clicking "Bike Finder" in the header)
onBeforeRouteUpdate((to) => {
  if (to.query._r) restartAssessment();
});

// Initialize based on URL parameter (need to be after all functions are defined)
onMounted(() => {
  if (route.query.bike && Object.keys(bikeTypeDetails).includes(route.query.bike)) {
    // Set to the last step (results)
    currentStep.value = 4;

    // Set recommendation from URL
    recommendation.value = route.query.bike;

    // Update the UI
    setRecommendationDetails();
    updateBikeCosts(recommendation.value);
  }
});
</script>

<style lang="scss" scoped>
/**
 * BikeAssessment.vue scoped styles — page-level layout only.
 *
 * These styles are scoped to this component and do NOT reach child components
 * (TransportationNeedsStep, GeographyStep, FitnessStep). Any styles that need
 * to apply inside those components must go in assets/scss/assessment.scss,
 * which each step component imports directly.
 */
@use "sass:color";
@use '../../assets/scss/variables' as vars;

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.page-intro {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 2.5rem auto;
  font-size: 1.2rem;
  color: vars.$text-secondary;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: vars.$primary;
}

.assessment-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: vars.$bg-card;
  border-radius: 12px;
  box-shadow: vars.$shadow-sm;
}

.progress-bar {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.progress-track {
  width: 100%;
  height: 8px;
  background-color: vars.$lighter-gray;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: vars.$primary;
  transition: width 0.3s ease;
}

.progress-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: vars.$lighter-gray;
  border: 2px solid vars.$white;
  transform: translateX(-50%);
  transition: background-color 0.3s ease;

  &.-active {
    background-color: vars.$primary-lighter;
    border-color: vars.$primary;
  }

  &.-done {
    background-color: vars.$primary;
    border-color: vars.$white;
  }
}

.step-container {
  margin-bottom: 2rem;
}

.results-container {
  text-align: center;
}

h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: vars.$dark;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .assessment-container {
    padding: 1rem 0;
    background-color: transparent;
    box-shadow: none;
  }

  .progress-bar { margin-bottom: 1rem; }

  h1 {
    font-size: 1.25rem;
  }

  h2 {
    font-size: 1rem;
  }

  .page-intro {
    display: none;
  }

}
</style>