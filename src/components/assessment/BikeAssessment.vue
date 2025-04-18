<template>
  <div class="page-container">
    <h1>Find Your Perfect Bike</h1>
    <p class="page-intro">Answer a few questions about your needs, and we'll recommend the right bike type for you.</p>

    <div class="assessment-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercent + '%' }"></div>
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
import { useRouter, useRoute } from 'vue-router';
import TransportationNeedsStep from './TransportationNeedsStep.vue';
import GeographyStep from './GeographyStep.vue';
import FitnessStep from './FitnessStep.vue';
import BikeRecommendation from './BikeRecommendation.vue';
import SavingsComparison from './SavingsComparison.vue';
import ResultsFooter from './ResultsFooter.vue';
import { BIKE_COSTS, CAR_COSTS } from '../../constants/bikeCosts';

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

// All bike type details
const bikeTypeDetails = reactive({
  'regular-bike': {
    title: 'Regular Bicycle',
    image: '/images/bikes/dutch-bike.jpg',
    description: 'A traditional bicycle is perfect for your needs. With your fitness level and local conditions, you\'ll be able to navigate comfortably without electric assistance.',
    features: [
      'Lightweight and maneuverable',
      'Lower cost than electric alternatives',
      'Simple maintenance',
      'No charging required'
    ],
    priceRange: '$300 - $1,000'
  },
  'commuter-ebike': {
    title: 'Commuter Electric Bicycle',
    image: '/images/bikes/gazelle-ebike.jpg',
    description: 'An electric commuter bike is ideal for your situation. The electric assistance will help with hills, wind, or longer distances while maintaining the convenience of a standard bicycle.',
    features: [
      'Electric motor assists up to 20-28 mph',
      'Helps overcome hills and wind resistance',
      'Reduces sweat during commutes',
      '20-50 mile range per charge'
    ],
    priceRange: '$1,500 - $4,000'
  },
  'cargo-bike': {
    title: 'Non-Electric Cargo Bicycle',
    image: '/images/bikes/bakfiets-classic-long.jpg',
    description: 'A non-electric cargo bike will address your carrying needs. These bikes are designed to handle loads while maintaining stability and ease of use without requiring battery power.',
    features: [
      'Front cargo box for groceries and goods',
      'Stable frame design for carrying heavy loads',
      'Can transport goods, groceries, or equipment',
      'No battery to charge or maintain'
    ],
    priceRange: '$1,000 - $2,500'
  },
  'cargo-ebike': {
    title: 'Electric Cargo Bicycle (Bucket Style)',
    image: '/images/bikes/urban-arrow.jpg',
    description: 'An electric cargo bike with front loading design is perfect for your needs. The electric assistance makes hauling cargo easier, while the bucket design is ideal for groceries and goods.',
    features: [
      'Large front cargo area for groceries or goods',
      'Electric assist makes carrying loads easier',
      'Stable even when fully loaded',
      'Can replace a car for most errands'
    ],
    priceRange: '$3,000 - $6,000'
  },
  'longtail-bike': {
    title: 'Non-Electric Longtail Cargo Bicycle',
    image: '/images/bikes/yuba-mundo.jpg',
    description: 'A non-electric longtail cargo bike is perfect for transporting people and heavy loads. With your fitness level, you can handle this sturdy bike without electric assistance while still carrying passengers or cargo.',
    features: [
      'Extended rear deck for passengers or cargo',
      'High weight capacity (up to 550 lbs)',
      'Can carry up to 3-4 children or 2 adults',
      'No battery charging required'
    ],
    priceRange: '$1,800 - $2,200'
  },
  'longtail-ebike': {
    title: 'Electric Longtail Cargo Bicycle',
    image: '/images/bikes/tern-gsd-500.jpg',
    description: 'A longtail electric cargo bike is ideal for transporting people. The extended rear section provides seating for children or adults while electric assistance makes the ride effortless.',
    features: [
      'Extended rear deck for passengers',
      'Electric assist makes carrying passengers easier',
      'Can accommodate child seats or passenger seating',
      'High weight capacity'
    ],
    priceRange: '$3,500 - $8,000'
  }
});

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
  height: 8px;
  background-color: vars.$lighter-gray;
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: vars.$primary;
  transition: width 0.3s ease;
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

@media (max-width: 600px) {
  .assessment-container {
    padding: 1.5rem;
  }
}
</style>