<template>
  <div class="page-container">
    <h1>Find Your Perfect Bike</h1>
    <p class="page-intro">Answer a few questions about your needs, and we'll recommend the right bike type for you.</p>

    <div class="assessment-container">
      <div class="progress-bar">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-dot -at-quarter" :class="{ '-done': currentStep > 2, '-active': currentStep === 2 }"></div>
        <div class="progress-dot -at-half" :class="{ '-done': currentStep > 3, '-active': currentStep === 3 }"></div>
        <div class="progress-dot -at-three-quarter" :class="{ '-done': currentStep > 4, '-active': currentStep === 4 }"></div>
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
          @next="nextStep"
        />

        <!-- Step 4: Storage -->
        <storage-step
          v-else-if="currentStep === 4"
          key="step4"
          v-model="storage"
          @prev="prevStep"
          @calculate="calculateRecommendation"
        />

        <!-- Step 5: Results -->
        <div v-else-if="currentStep === 5" key="step5" class="step-container results-container">
          <div class="sticky-header" :class="{ '-visible': showStickyHeader && stickysavings }">
            <img :src="recommendationDetails.image" :alt="recommendationDetails.title" class="sticky-bike-image">
            <span class="sticky-bike">{{ recommendationDetails.title }}</span>
            <span class="sticky-separator">vs</span>
            <span class="sticky-car">{{ stickyCarLabel }}</span>
            <span class="sticky-savings">{{ formatCurrency(stickysavings) }} savings</span>
          </div>

          <your-choices
            v-if="savedChoices.length"
            :choices="savedChoices"
            @edit="goToStep"
          />

          <h2>Your Recommended Bike Type</h2>

          <bike-recommendation
            :recommendation-details="recommendationDetails"
            :all-bike-types="bikeTypeDetails"
            :ideal-bike-type="idealBikeType"
            :storage-constrained="storage === 'upper-floor' || idealBikeType !== null"
            :recommended-bike-type="recommendation"
            :savings-amount="stickysavings"
            @bike-change="handleBikeChange"
          />

          <nav class="results-jump-links" aria-label="Jump to section">
            <div class="jump-label">Quick Links</div>
            <a href="#savings">💰 Savings</a>
            <a v-if="!('own' in route.query)" href="#car-faq">🚗 Car FAQ</a>
            <a href="#buying-options">🛒 Options</a>
            <router-link to="/gear-guide">⛑️ Gear Guide</router-link>
            <a href="#" class="restart-link" @click.prevent="goToStep(TOTAL_STEPS)">⬅️ Back</a>
            <a href="#" class="restart-link" @click.prevent="restartAssessment">🔄 Restart</a>
          </nav>

          <savings-comparison
            ref="savingsSentinel"
            :bike-title="recommendationDetails.title"
            :bike-image="recommendationDetails.image"
            :costs="costs"
            :all-bike-types="bikeTypeDetails"
            :selected-bike-type="recommendation.value"
            @bike-change="handleBikeChange"
            @update:savings="stickysavings = $event"
            @update:car-label="stickyCarLabel = $event"
            key="savings-component"
          />

          <div class="gear-guide-cta">
            <p>Now that you know your bike, make sure you have the essentials.</p>
            <router-link to="/gear-guide" class="gear-guide-btn">
              View Essential Gear Guide
            </router-link>
          </div>

          <results-footer @restart="restartAssessment" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import TransportationNeedsStep from './TransportationNeedsStep.vue';
import StorageStep from './StorageStep.vue';
import GeographyStep from './GeographyStep.vue';
import FitnessStep from './FitnessStep.vue';
import BikeRecommendation from './BikeRecommendation.vue';
import SavingsComparison from './SavingsComparison.vue';
import ResultsFooter from './ResultsFooter.vue';
import YourChoices from './YourChoices.vue';
import { BIKE_COSTS, CAR_COSTS } from '../../constants/bikeCosts';
import { BikeTypes } from '../../constants/bikeTypes';
import { TransportationNeedOptions, GeographyOptions, FitnessOptions, StorageOptions } from '../../constants/assessmentOptions';
import BikeModelRecommender from '../../services/BikeModelRecommender';

const props = defineProps({
  type: { type: String, default: '' }
});

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
  hilly: false,
  flat: false
});

const storage = ref('');
const fitnessLevel = ref('');

// Watch for reactive state changes
watch(transportationNeeds, () => {}, { deep: true });
watch(geography, () => {}, { deep: true });
const recommendation = ref('');
const idealBikeType = ref(null);
const recommendationDetails = ref({});
const stickysavings = ref(0);
const stickyCarLabel = ref('');
const showStickyHeader = ref(false);
const savingsSentinel = ref(null);
let stickyScrollHandler = null;


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

// Total number of question steps (excluding results)
const TOTAL_STEPS = 4;

// Computed properties
const progressPercent = computed(() => {
  return ((currentStep.value - 1) / TOTAL_STEPS) * 100;
});

const savedChoices = ref([]);

const ChoicesStorageKey = 'bikeAssessmentChoices';

function buildChoicesSummary() {
  const groups = [];

  const needs = transportationNeeds.value;
  const needPills = Object.keys(needs).filter(k => needs[k]).map(k => ({ icon: TransportationNeedOptions[k].icon, label: TransportationNeedOptions[k].label }));
  if (needPills.length) groups.push({ category: 'Needs', step: 1, pills: needPills });

  const geo = geography.value;
  const geoPills = Object.keys(geo).filter(k => geo[k]).map(k => ({ icon: GeographyOptions[k].icon, label: GeographyOptions[k].label }));
  if (geoPills.length) groups.push({ category: 'Geography', step: 2, pills: geoPills });

  if (fitnessLevel.value) {
    const opt = FitnessOptions[fitnessLevel.value];
    groups.push({ category: 'Fitness', step: 3, pills: [{ icon: opt.icon, label: opt.label }] });
  }

  if (storage.value) {
    const opt = StorageOptions[storage.value];
    groups.push({ category: 'Storage', step: 4, pills: [{ icon: opt.icon, label: opt.label }] });
  }

  return groups;
}

function saveChoicesToSession() {
  const choices = buildChoicesSummary();
  savedChoices.value = choices;
  sessionStorage.setItem(ChoicesStorageKey, JSON.stringify(choices));
}

function loadChoicesFromSession() {
  try {
    const stored = sessionStorage.getItem(ChoicesStorageKey);
    if (stored) savedChoices.value = JSON.parse(stored);
  } catch { /* ignore */ }
}

function clearChoicesFromSession() {
  savedChoices.value = [];
  sessionStorage.removeItem(ChoicesStorageKey);
}

// Methods
function scrollToTop() {
  window.scrollTo({ top: 0 });
}

function nextStep() {
  if (currentStep.value <= TOTAL_STEPS) {
    currentStep.value++;
    scrollToTop();
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
    scrollToTop();
  }
}

function goToStep(step) {
  currentStep.value = step;
  scrollToTop();
}

function calculateRecommendation() {
  const recommender = new BikeModelRecommender({
    transportationNeeds: transportationNeeds.value,
    geography: geography.value,
    fitnessLevel: fitnessLevel.value,
    storage: storage.value
  });

  recommendation.value = recommender.bikeType;
  idealBikeType.value = recommender.idealBikeType;

  // Set recommendation details
  setRecommendationDetails();

  // Update purchase cost based on the recommendation
  updateBikeCosts(recommendation.value);

  // Update URL with query parameter
  updateUrlWithRecommendation(recommendation.value);

  // Save choices so they survive the route change
  saveChoicesToSession();

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
  idealBikeType.value = null;

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
  const query = idealBikeType.value ? { ideal: idealBikeType.value } : {};
  router.replace({ name: 'BikeResult', params: { type: bikeType }, query });
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
    hilly: false,
    flat: false
  };

  storage.value = '';
  fitnessLevel.value = '';
  recommendation.value = '';
  idealBikeType.value = null;

  clearChoicesFromSession();

  // Navigate back to the assessment start
  router.replace({ name: 'Assessment' });
}

// Reset when clicking "Bike Finder" while already on the assessment page
onBeforeRouteUpdate((to) => {
  if (to.query._r) {
    currentStep.value = 1;
    transportationNeeds.value = { soloCommuting: false, cargo: false, transportingKids: false, transportingAdults: false };
    geography.value = { windy: false, hilly: false, flat: false };
    storage.value = '';
    fitnessLevel.value = '';
    recommendation.value = '';
    idealBikeType.value = null;
    showStickyHeader.value = false;
    stickysavings.value = 0;
    stickyCarLabel.value = '';
    clearChoicesFromSession();

    const { _r, ...rest } = to.query;
    router.replace({ name: 'Assessment', query: rest });
  }
});

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

// Initialize based on route param /bike/:type (need to be after all functions are defined)
onMounted(() => {
  if (props.type && Object.keys(bikeTypeDetails).includes(props.type)) {
    // Set to the last step (results)
    currentStep.value = TOTAL_STEPS + 1;

    // Set recommendation from URL
    recommendation.value = props.type;

    // Restore ideal bike type from query param if present
    const idealParam = route.query.ideal;
    if (idealParam && Object.keys(bikeTypeDetails).includes(idealParam)) {
      idealBikeType.value = idealParam;
    }

    // Restore choices from session if available
    loadChoicesFromSession();

    // Update the UI
    setRecommendationDetails();
    updateBikeCosts(recommendation.value);
  }
});

// Scroll-based sticky header: appears once the savings <h3> scrolls off-screen,
// hides when it scrolls back into view. Adjust StickyHeaderPxOffset to fine-tune
// when exactly it triggers (positive = triggers earlier, negative = later).
const StickyHeaderPxOffset = 0;
const SiteHeaderHeight = 80;

watch(savingsSentinel, (comp, _, onCleanup) => {
  if (stickyScrollHandler) {
    window.removeEventListener('scroll', stickyScrollHandler);
    stickyScrollHandler = null;
  }
  showStickyHeader.value = false;
  if (!comp?.$el) return;

  const savingsHeading = comp.$el.querySelector('.savings-highlight h3');
  if (!savingsHeading) return;

  let hasBeenInView = false;

  stickyScrollHandler = () => {
    const rect = savingsHeading.getBoundingClientRect();
    const threshold = SiteHeaderHeight + StickyHeaderPxOffset;

    // Element is currently in view
    if (rect.top >= 0 && rect.top < window.innerHeight) {
      hasBeenInView = true;
    }

    // Show sticky only when heading has been seen and has scrolled above threshold
    showStickyHeader.value = hasBeenInView && rect.bottom < threshold;
  };

  window.addEventListener('scroll', stickyScrollHandler, { passive: true });
  onCleanup(() => {
    window.removeEventListener('scroll', stickyScrollHandler);
    stickyScrollHandler = null;
  });
});

onUnmounted(() => {
  if (stickyScrollHandler) {
    window.removeEventListener('scroll', stickyScrollHandler);
    stickyScrollHandler = null;
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
  max-width: 1200px;
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

  &.-at-quarter { left: 25%; }
  &.-at-half { left: 50%; }
  &.-at-three-quarter { left: 75%; }
}

.sticky-header {
  position: fixed;
  top: 5rem;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background-color: vars.$primary-dark;
  color: vars.$white;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: vars.$shadow-md;
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &.-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.sticky-bike-image {
  aspect-ratio: 1;
  border-radius: 10rem;
  border: solid 2px vars.$lighter-gray;
  object-fit: cover;
  height: 3rem;
  flex-shrink: 0;
}

.sticky-bike {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sticky-separator {
  opacity: 0.7;
}

.sticky-car {
  white-space: nowrap;
}

.sticky-savings {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  white-space: nowrap;
}

.step-container {
  margin-bottom: 2rem;
}

.results-container {
  text-align: center;
}

.results-jump-links {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0.5rem 0 2rem;

  .jump-label {
    font-size: 0.8rem;
    font-weight: bold;
    color: vars.$text-body;
    letter-spacing: 0.05em;
    width: 100%;
    text-align: left;
  }

  a {
    display: inline-block;
    padding: 0.4rem 1rem;
    background-color: vars.$primary-lighter;
    color: vars.$primary-dark;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
      background-color: vars.$primary;
      color: vars.$white;
    }

    &.restart-link {
      background-color: vars.$lighter-gray;
      color: vars.$light-gray;

      &:hover {
        background-color: vars.$border-gray;
        color: vars.$dark;
      }
    }
  }
}

h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: vars.$dark;
}


.gear-guide-cta {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: vars.$primary-lighter;
  border-radius: 8px;
  text-align: center;

  p {
    margin-bottom: 0.75rem;
    color: vars.$primary-dark;
  }
}

.gear-guide-btn {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background-color: vars.$primary;
  color: vars.$white;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: vars.$primary-dark;
  }
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
  h1 { margin: 0; }

  .page-container {
    padding: 1rem 1.5rem;
  }

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

  .sticky-header {
    top: 4rem;
    font-size: 0.75rem;
    gap: 0.35rem;
    padding: 0.5rem 0.75rem;
  }

  .sticky-bike-image {
    display: none;
  }
}
</style>