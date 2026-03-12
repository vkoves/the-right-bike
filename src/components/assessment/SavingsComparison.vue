<template>
  <div class="savings-section">
    <h2 class="savings-heading">Potential Savings vs. Car Ownership</h2>
    <p class="savings-intro">See how much you could save by choosing a bike instead of a new car</p>


    <cost-comparison-table
      :bike-title="bikeTitle"
      :bike-image="bikeImage"
      :costs="costs"
      :bike-total-cost="bikeTotalCost"
      :car-total-cost="carTotalCost"
      :is-comparing="isComparing"
    />

    <div class="savings-highlight">
      <div class="savings-number">
        <h3>Your 5-Year Savings</h3>
        <div class="amount">{{ formatCurrency(savingsAmount) }}</div>
      </div>
      <div class="savings-benefits">
        <h4>What else you could do with this money:</h4>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-emoji">✈️</div>
            <h5>Travel</h5>
            <p>Take {{ Math.round(savingsAmount / 2000) }} international vacations</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-emoji">🏠</div>
            <h5>Housing</h5>
            <p>Save for a down payment on your dream home</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-emoji">📈</div>
            <h5>Invest</h5>
            <p>Worth {{ formatCurrency(savingsAmount * 1.5) }} in 10 years at 7% growth</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="faq-section">
      <h3>What if I need a car sometimes? 🤔</h3>
      <div class="faq-content">
        <p>Even with a bike as your primary transportation, you'll occasionally need a car for certain trips. Here are cost-effective alternatives to car ownership:</p>

        <div class="alternatives-grid">
          <div class="alternative-card">
            <div class="alternative-icon">🚗</div>
            <h4>Car Sharing</h4>
            <p>Services like Zipcar or Getaround offer hourly rentals (~$10-15/hour) for quick errands.</p>
            <div class="alternative-savings">
              <strong>10 rentals/year:</strong> <br>
              $300 - $450
            </div>
          </div>

          <div class="alternative-card">
            <div class="alternative-icon">🚕</div>
            <h4>Ride Share</h4>
            <p>Uber, Lyft or taxis are perfect for evenings out or airport trips.</p>
            <div class="alternative-savings">
              <strong>20 rides/year:</strong> <br>
              $400 - $600
            </div>
          </div>

          <div class="alternative-card">
            <div class="alternative-icon">🛻</div>
            <h4>Truck/Van Rental</h4>
            <p>Home Depot, U-Haul or similar for large purchases and moves.</p>
            <div class="alternative-savings">
              <strong>3 rentals/year:</strong> <br>
              $150 - $300
            </div>
          </div>
        </div>

        <div class="total-comparison">
          <p v-if="adjustedSavings > 0">
            Even if you spend <strong>$1,000/year</strong> on occasional rentals and ride-shares, that's still
            <span class="highlight-amount"><strong>{{ formatCurrency(adjustedSavings) }}</strong></span>
            less than the 5-year cost of car ownership!
          </p>
          <p v-else>
            When you factor in <strong>$1,000/year</strong> for occasional rentals and ride-shares, you're still
            <span class="highlight-amount"><strong>coming out ahead</strong></span>
            compared to full car ownership, while gaining health benefits and reducing environmental impact!
          </p>
        </div>
      </div>
    </div>

    <!-- Bike comparison grid -->
    <div class="bike-comparison-grid">
      <h3>Compare with other bikes</h3>
      <div class="bike-options-scroll-wrapper">
        <div class="bike-options-scroll-container">
        <div class="bike-options">
          <div class="bike-option original-option active">
            <div class="bike-option-image">
              <img :src="bikeImage" :alt="bikeTitle">
              <div v-if="selectedBikeType && selectedBikeType.includes('ebike')" class="electric-badge">⚡ Electric</div>
            </div>
            <div class="bike-option-details">
              <div class="recommendation-pill">Your Recommendation</div>
              <h4>{{ bikeTitle }}</h4>
              <div class="bike-price">~ {{ formatCurrency(costs.bike.purchase) }}</div>
            </div>
          </div>
          <div class="bike-option"
               v-for="type in availableBikeTypes"
               :key="type.value"
               @click="handleComparisonChange(type.value)"
               :class="{ 'active': comparisonBike === type.value }">
            <div class="bike-option-image">
              <img :src="allBikeTypes[type.value].image" :alt="type.label">
              <div v-if="type.value.includes('ebike')" class="electric-badge">⚡ Electric</div>
            </div>
            <div class="bike-option-details">
              <h4>{{ type.label }}</h4>
              <div class="bike-price">~ {{ formatCurrency(BIKE_COSTS[type.value].purchase) }}</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { BIKE_COSTS } from '../../constants/bikeCosts';
import CostComparisonTable from './CostComparisonTable.vue';

const props = defineProps({
  bikeTitle: {
    type: String,
    required: true
  },
  bikeImage: {
    type: String,
    required: true
  },
  costs: {
    type: Object,
    required: true
  },
  selectedBikeType: {
    type: String,
    required: false,
    default: ''
  },
  allBikeTypes: {
    type: Object,
    required: false,
    default: () => ({
      'regular-bike': {
        title: 'Regular Bicycle',
        label: 'Regular Bicycle'
      },
      'commuter-ebike': {
        title: 'Commuter Electric Bicycle',
        label: 'Electric Commuter Bike'
      },
      'cargo-bike': {
        title: 'Non-Electric Cargo Bicycle',
        label: 'Non-Electric Cargo Bike'
      },
      'cargo-ebike': {
        title: 'Electric Cargo Bicycle (Bucket Style)',
        label: 'Electric Cargo Bike'
      },
      'longtail-bike': {
        title: 'Non-Electric Longtail Cargo Bicycle',
        label: 'Non-Electric Longtail Bike'
      },
      'longtail-ebike': {
        title: 'Electric Longtail Cargo Bicycle',
        label: 'Longtail E-Bike'
      }
    })
  }
});

const emit = defineEmits(['bike-change']);

// State for comparison dropdown
const comparisonBike = ref('');

// Track if we're comparing bikes
const isComparing = computed(() => comparisonBike.value !== '');

// Watch for changes in the selected bike type from parent
watch(() => props.selectedBikeType, (newType, oldType) => {
  // Reset the comparison dropdown if the recommendation changes
  if (oldType && newType !== oldType && comparisonBike.value) {
    comparisonBike.value = '';
  }
}, { immediate: true });

// Computed properties for cost calculations
const bikeTotalCost = computed(() => {
  return props.costs.bike.purchase +
         (props.costs.bike.maintenance * 5) +
         (props.costs.bike.fuel * 5) +
         (props.costs.bike.insurance * 5);
});

const carTotalCost = computed(() => {
  return props.costs.car.purchase +
         (props.costs.car.maintenance * 5) +
         (props.costs.car.fuel * 5) +
         (props.costs.car.insurance * 5);
});

const savingsAmount = computed(() => {
  return carTotalCost.value - bikeTotalCost.value;
});

// Calculate savings after accounting for alternative transportation costs
const adjustedSavings = computed(() => {
  // Assume $1000/year for alternative transportation (5 years total)
  const alternativeTransportCost = 5000;
  // Calculate savings after alternative costs
  const netSavings = savingsAmount.value - alternativeTransportCost;
  // Make sure the value is never negative
  const positiveNetSavings = Math.max(0, netSavings);
  // Round to nearest thousand for cleaner number
  return Math.floor(positiveNetSavings / 1000) * 1000;
});

// Get the current recommendation type
const recommendationType = computed(() => {
  // If we have a selected bike type from the parent, use that
  if (props.selectedBikeType) {
    return props.selectedBikeType;
  }

  // Otherwise, try to find it by matching the title
  for (const [key, details] of Object.entries(props.allBikeTypes)) {
    if (details.title === props.bikeTitle) {
      return key;
    }
  }

  return '';
});

// Generate list of available bike types for comparison
const availableBikeTypes = computed(() => {
  const currentType = recommendationType.value;

  return Object.entries(props.allBikeTypes)
    .filter(([key]) => key !== currentType)
    .map(([key, value]) => ({
      value: key,
      label: value.label || value.title
    }));
});

// Handle bike type change from buttons
function handleComparisonChange(bikeType) {
  comparisonBike.value = bikeType;
  emit('bike-change', bikeType);
}

// Currency formatting helper
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;

.savings-section {
  background-color: vars.$lightest-gray;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: vars.$shadow-sm;
}

.savings-heading {
  color: vars.$primary;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
}

.savings-intro {
  color: vars.$gray;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Bike Comparison Grid */
.bike-comparison-grid {
  margin: 2.5rem 0 3.5rem 0;
  position: relative;
}

.bike-comparison-grid h3 {
  text-align: center;
  color: vars.$primary;
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
}

@keyframes bounce-horizontal {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-5px); }
}

.bike-options-scroll-wrapper {
  border-radius: vars.$border-radius;
  border: 0.125rem solid vars.$lighter-gray;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.bike-options-scroll-container {
  width: 100%;
  overflow-x: auto;
  padding: 1rem 0 40px 0;
  background-color: vars.$white;

  /* Custom scrollbar styling */
  scrollbar-width: auto; /* Firefox */
  scrollbar-color: vars.$primary vars.$lighter-gray; /* Firefox */
  -ms-overflow-style: auto; /* IE and Edge */

  /* Chrome, Safari, Opera scrollbar styling */
  &::-webkit-scrollbar {
    height: 32px;
    background-color: vars.$lighter-gray;
    border-radius: 16px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: vars.$primary;
    border-radius: 16px;
    border: 4px solid vars.$lighter-gray;
    cursor: pointer;

    &:hover {
      background-color: vars.$primary-dark;
    }
  }

  /* Hide scrollbar buttons/arrows */
  &::-webkit-scrollbar-button {
    display: none;
  }

  /* Visual indicators of scrollability */
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    pointer-events: none;
    z-index: 1;
  }
}

.bike-options {
  display: flex;
  flex-wrap: nowrap;
  gap: 1.2rem;
  padding: 0.5rem 1.5rem 0.5rem 1.5rem;
  min-width: min-content;
  /* Hack to make sure the container is always wide enough */
  width: max-content;
  position: relative;
}

.bike-option {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  width: 250px;
  flex-shrink: 0;
  background-color: vars.$white;
  border-radius: vars.$border-radius;
  box-shadow: vars.$shadow-md;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: vars.$shadow-lg;
  }

  &.active {
    border-color: vars.$primary;
    box-shadow: 0 0 0 4px rgba(44, 138, 87, 0.2);
  }

  &.original-option {
    border-color: vars.$secondary;
    cursor: default;
    box-shadow: 0 0 0 4px vars.$secondary-light;

    &:hover {
      transform: none;
    }
  }
}

.bike-option-image {
  position: relative;
  width: 100%;
  height: auto;
  padding: 0.5rem;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  .electric-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: vars.$secondary;
    color: vars.$white;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 12px;
    z-index: 1;
  }
}

.recommendation-pill {
  position: absolute;
  top: -5px;
  width: 150px;
  margin: auto;
  left: 0;
  right: 0;
  display: inline-block;
  background-color: vars.$secondary;
  color: vars.$white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  margin-bottom: 0.35rem;
}

.bike-option-details {
  padding: 0.75rem;
  text-align: center;

  h4 {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    color: vars.$dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bike-price {
    font-weight: bold;
    color: vars.$primary;
    font-size: 1rem;
  }
}

.savings-highlight {
  text-align: center;
  background-color: vars.$bg-highlight;
  border-radius: vars.$border-radius;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column; // makes the savings on its own line
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 2.5rem;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  /* Add subtle pattern background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.7;
    z-index: 0;
    pointer-events: none;
  }
}

.savings-number {
  flex: 1;
  min-width: 300px;
  text-align: center;
  position: relative;
  z-index: 1;

  h3 {
    margin-bottom: 1.5rem;
    color: vars.$primary-dark;
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .amount {
    font-size: 3.5rem;
    font-weight: 800;
    color: vars.$primary-light;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
    background: linear-gradient(to right, vars.$primary-dark, vars.$primary-light);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    padding: 0.5rem 1rem;
    position: relative;

    /* Subtle pulsing animation */
    animation: pulse-savings 3s infinite;

    /* Add decorative elements */
    &::before, &::after {
      content: '';
      position: absolute;
      background-color: vars.$primary-lighter;
      border-radius: 50%;
      opacity: 0.3;
      z-index: -1;
    }

    &::before {
      width: 40px;
      height: 40px;
      left: -20px;
      top: -10px;
    }

    &::after {
      width: 60px;
      height: 60px;
      right: -30px;
      bottom: -20px;
    }
  }
}

@keyframes pulse-savings {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.savings-benefits {
  flex: 2;
  min-width: 250px;

  h4 {
    color: vars.$dark;
    margin-bottom: 1rem;
  }
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}

.benefit-card {
  background-color: vars.$white;
  border-radius: vars.$border-radius;
  padding: 1.5rem;
  text-align: center;
  box-shadow: vars.$shadow-md;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: vars.$shadow-lg;
  }

  h5 {
    color: vars.$primary;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: vars.$dark;
    font-size: 0.95rem;
    line-height: 1.4;
  }
}

.benefit-emoji {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

/* FAQ Section Styles */
.faq-section {
  background-color: vars.$white;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: vars.$shadow-sm;

  h3 {
    color: vars.$primary;
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
}

.faq-content p {
  text-align: center;
  color: vars.$dark;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.alternatives-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.alternative-card {
  background-color: vars.$white;
  border-radius: vars.$border-radius;
  padding: 1.5rem;
  text-align: center;
  box-shadow: vars.$shadow-md;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: vars.$shadow-lg;
  }

  h4 {
    color: vars.$dark;
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
  }

  p {
    color: vars.$gray;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    flex-grow: 1;
  }
}

.alternative-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.alternative-savings {
  background-color: vars.$primary-lighter;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: vars.$primary-light;
}

.total-comparison {
  background-color: vars.$primary;
  padding: 1.75rem;
  border-radius: vars.$border-radius;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: vars.$shadow-primary;
  position: relative;
  overflow: hidden;
  animation: pulse 2s infinite;

  p {
    margin-bottom: 0;
    font-size: 1.2rem;
    color: vars.$white;
    line-height: 1.6;
  }

  strong {
    color: vars.$white;
    font-weight: 700;
    background-color: rgba(255, 255, 255, vars.$opacity-light);
    padding: 0.15rem 0.4rem;
    border-radius: vars.$border-radius-sm;
  }
}

@keyframes pulse {
  0% {
    box-shadow: vars.$shadow-primary;
  }
  50% {
    box-shadow: vars.$shadow-primary-active;
  }
  100% {
    box-shadow: vars.$shadow-primary;
  }
}

.highlight-amount {
  display: block;
  margin: 0.5rem 0;
  font-size: 1.4rem;

  strong {
    background-color: rgba(255, 255, 255, vars.$opacity-medium);
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    display: inline-block;
    margin: 0.25rem 0;
    box-shadow: vars.$shadow-card;
  }
}

@media (max-width: 900px) {
  .benefits-grid, .alternatives-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .savings-section {
    padding: 0;
    box-shadow: none;
    background-color: transparent;
  }

  .savings-heading {
    font-size: 1.8rem;
  }

  .bike-comparison-grid h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .bike-option {
    width: 200px;
  }

  .bike-options {
    padding: 0.5rem 1rem;
  }

  .bike-option-details h4 {
    font-size: 0.85rem;
  }

  .benefits-grid, .alternatives-grid {
    grid-template-columns: 1fr;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .benefit-emoji, .alternative-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .benefit-card {
    padding: 1.25rem;
  }

  .savings-highlight {
    padding: 1.5rem;
  }

  .faq-section h3 {
    font-size: 1.5rem;
  }

  .total-comparison {
    padding: 1.5rem 1rem;
    margin-top: 1rem;

    p {
      font-size: 1.05rem;
    }

    strong {
      display: inline-block;
      margin: 0.25rem 0;
    }
  }

}
</style>