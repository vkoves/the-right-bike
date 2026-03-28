<template>
  <div class="savings-section">
    <h2 class="savings-heading" id="savings">
      <template v-if="alreadyOwnsCar">
        Potential Savings by Going Car-Lite
      </template>
      <template v-else>
        Potential Savings vs Buying A <span class="car-type-label">{{ isNew ? 'New' : 'Used' }}</span> Car
      </template>
    </h2>
    <p class="savings-intro">
      <template v-if="alreadyOwnsCar">
        See how much you could save on fuel and maintenance by driving less, and biking instead!
      </template>
      <template v-else>
        See how much you could save by choosing a bike instead of a car.
      </template>
    </p>


    <div class="ownership-toggle" :class="{ '-active': alreadyOwnsCar }">
      <label class="toggle-label">
        <input type="checkbox" v-model="alreadyOwnsCar">
        <span class="toggle-switch"></span>
        I Already Own A Car
      </label>

      <transition name="slider-reveal">
      <div v-if="alreadyOwnsCar" class="replacement-slider">
        <label for="replacement-slider" class="slider-label">
          How much of your driving would you replace with biking?
        </label>
        <p id="replace-subtitle" class="smaller">
          Like grocery shopping, dropping off kids at school, or commuting!
        </p>
        <div class="slider-row">
          <div class="slider-track-group">
            <div class="slider-track">
              <input
                  id="replacement-slider"
                  attr.aria-describedby="replace-subtitle"
                  type="range"
                  v-model.number="replacementPercent"
                  :min="ReplacementMin"
                  max="100"
                  step="5"
                  class="slider-input"
                >
              <div class="slider-fill-bar"
                :style=" { width: (100 *  ((replacementPercent - ReplacementMin) / ReplacementRange) - 1) + '%' }"></div>
            </div>
            <div class="slider-range">
              <span>25%</span>
              <span>100%</span>
            </div>
          </div>
          <div class="slider-value" :style="{ color: sliderColor }" aria-live="polite">
            {{ replacementPercent }}%
          </div>
        </div>
      </div>
      </transition>
    </div>

    <cost-comparison-table
      :bike-title="bikeTitle"
      :bike-image="bikeImage"
      :costs="costs"
      :bike-total-cost="bikeTotalCost"
      :car-total-cost="carTotalCost"
      :is-comparing="isComparing"
      :is-new="isNew"
      :already-owns-car="alreadyOwnsCar"
      :replacement-percent="replacementPercent"
      :mileage-insurance-annual="mileageInsuranceAnnual"
      @car-type-change="isNew = $event"
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
            <p>Take {{ Math.round(savingsAmount / IntlVacationCost) }} international vacations</p>
            <p class="vacation-cost-note">at ~{{ formatCurrency(IntlVacationCost) }} per trip</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-emoji">🏠</div>
            <h5>Housing</h5>
            <p>Put this towards a down payment on your dream home</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-emoji">📈</div>
            <h5>Invest</h5>
            <p>
              Worth <strong>{{ formatRounded(savings10Year) }} in 10 years</strong> at 7% growth
            </p>
            <p class="long-term-growth">
              Or <strong>{{ formatRounded(savings40Year) }} over 40 years</strong>, like in your 401k!
            </p>
          </div>
        </div>
      </div>
    </div>

    <savings-faq-section v-if="!alreadyOwnsCar" :savings-amount="savingsAmount" />

    <bike-buying-options id="buying-options" :bike-type="displayedBikeType" :profile="profile" />

    <h3>Tips For Buying A Bike</h3>

    <div class="buying-tips">
      <div class="buying-tips-icon">🚍</div>
      <div class="buying-tips-content">
        <h4>Consider Your Needs</h4>
        <p>
          Think about any specific needs you have for your bike.
        </p>
        <p>
          <strong>Need to take it on transit?</strong> Make sure it's light enough that you can lift
          it up on a bus' bike rack, and within the limits allowed by your transit agency.
        </p>
        <p>
          <strong>Dealing With Tons Of Snow?</strong> Look for bikes with wider, knobby tires
           and fenders to keep salt and slush off your frame.
        </p>
      </div>
    </div>

    <div class="buying-tips">
      <div class="buying-tips-icon">🏪</div>
      <div class="buying-tips-content">
        <h4>Find a Local Bike Shop</h4>
        <p>
          It's best to test ride a few bikes before you settle on one, and a good local shop can
          also help you pick the best model for you, along and help fit, accessories,
          and ongoing maintenance.
        </p>
        <p>
          <strong>Buying online might be easier, but can make maintenance harder!</strong>
        </p>
        <a
          href="https://www.google.com/maps/search/bike+shop+near+me"
          target="_blank"
          rel="noopener"
          class="find-shops-btn"
        >
          Search Bike Shops Near You <span class="chevron-right" aria-hidden="true"></span>
        </a>
      </div>
    </div>

    <hr class="section-divider">

    <!-- Bike comparison grid -->
    <div class="bike-comparison-grid" id="compare">
      <h3>
        <p>Want to check out something else?</p>
        Compare With Other Types Of Bikes
      </h3>
      <div class="bike-options-scroll-wrapper">
        <div class="bike-options-scroll-container">
        <div class="bike-options">
          <div class="bike-option original-option active">
            <div class="bike-option-image">
              <img :src="bikeImage" :alt="bikeTitle">
              <div v-if="selectedBikeType && allBikeTypes[selectedBikeType]?.electric" class="electric-badge">⚡ Electric</div>
            </div>
            <div class="bike-option-details">
              <div class="recommendation-pill">Your Recommendation</div>
              <h4>{{ bikeTitle }}</h4>
              <div class="bike-price">~ {{ formatCurrency(costs.bike.purchase) }}</div>
            </div>
          </div>
          <router-link class="bike-option"
               v-for="type in availableBikeTypes"
               :key="type.value"
               :to="`/bike/${type.value}`"
               @click="handleComparisonClick($event, type.value)"
               :class="{ 'active': comparisonBike === type.value }">
            <div class="bike-option-image">
              <img :src="allBikeTypes[type.value].image" :alt="type.label">
              <div v-if="allBikeTypes[type.value]?.electric" class="electric-badge">⚡ Electric</div>
            </div>
            <div class="bike-option-details">
              <h4>{{ type.label }}</h4>
              <div class="bike-price">~ {{ formatCurrency(BikeTypes[type.value as BikeTypeId].costs.purchase) }}</div>
            </div>
          </router-link>
        </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { CAR_COSTS } from '../../constants/bikeCosts';
import { BikeTypes } from '../../constants/bikeTypes';
import { isPlainClick } from '../../utils/navigation';
import type { AssessmentProfile, BikeTypeId } from '../../types';

import CostComparisonTable from './CostComparisonTable.vue';
import SavingsFaqSection from './SavingsFaqSection.vue';
import BikeBuyingOptions from './BikeBuyingOptions.vue';

const EstGrowthRate = 0.07;
const InvestmentYearsShort = 10;
const InvestmentYearsLong = 40;

const ReplacementMin = 25;
const ReplacementRange = 100 - ReplacementMin;

// a pretty rough guestimate, but you can definitely take an international vacation for this much
const IntlVacationCost = 2_500;

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
    default: () => BikeTypes
  },
  profile: {
    type: Object as () => AssessmentProfile | null,
    required: false,
    default: null
  }
});

const emit = defineEmits(['bike-change', 'update:savings', 'update:carLabel']);

const route = useRoute();

// State for new vs used car toggle
const isNew = ref(true);

// State for "already own a car" mode — initialize from query params
const alreadyOwnsCar = ref('own' in route.query);
const replacementPercent = ref(
  route.query.replace ? Math.min(100, Math.max(25, parseInt(route.query.replace as string, 10) || 50)) : 50
);

// Interpolate slider color from grey (#727272) at 25% to green (#298653) at 100%
const sliderColor = computed(() => {
  const t = (replacementPercent.value - 25) / 75; // 0 at 25%, 1 at 100%
  const r = Math.round(0x72 + (0x29 - 0x72) * t);
  const g = Math.round(0x72 + (0x86 - 0x72) * t);
  const b = Math.round(0x72 + (0x53 - 0x72) * t);
  return `rgb(${r}, ${g}, ${b})`;
});

// Sync query params when ownership/replacement changes — use history API
// directly to avoid triggering Vue Router's route update cycle, which can
// cause unexpected remounts.
watch([alreadyOwnsCar, replacementPercent], ([owns, percent]) => {
  const query = new URLSearchParams(window.location.search);
  if (owns) {
    query.set('own', '');
    query.set('replace', String(percent));
  } else {
    query.delete('own');
    query.delete('replace');
  }
  const qs = query.toString();
  const newUrl = window.location.pathname + (qs ? `?${qs}` : '');
  window.history.replaceState(history.state, '', newUrl);
});

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

// Annual mileage-based insurance: base rate + per-mile charge for remaining driving
const mileageInsuranceAnnual = computed(() => {
  const remainingDriving = 1 - replacementPercent.value / 100;
  const milesKept = CAR_COSTS.averageAnnualMiles * remainingDriving;
  return CAR_COSTS.mileageInsuranceBase + (milesKept * CAR_COSTS.mileageInsurancePerMile);
});

const carTotalCost = computed(() => {
  if (alreadyOwnsCar.value) {
    // No purchase cost; fuel and maintenance scale with remaining driving
    // Insurance switches to pay-per-mile
    const remainingScale = 1 - replacementPercent.value / 100;
    return (props.costs.car.maintenance * 5 * remainingScale) +
           (props.costs.car.fuel * 5 * remainingScale) +
           (mileageInsuranceAnnual.value * 5);
  }
  const purchase = isNew.value ? CAR_COSTS.purchase : CAR_COSTS.usedPurchase;
  return purchase +
         (props.costs.car.maintenance * 5) +
         (props.costs.car.fuel * 5) +
         (props.costs.car.insurance * 5);
});

// Full car running costs (no purchase) over 5 years — baseline before biking
const fullCarRunningCost = computed(() => {
  return (props.costs.car.maintenance * 5) +
         (props.costs.car.fuel * 5) +
         (props.costs.car.insurance * 5);
});

const savingsAmount = computed(() => {
  if (alreadyOwnsCar.value) {
    // Savings = how much less you spend on car costs, minus the bike cost
    return (fullCarRunningCost.value - carTotalCost.value) - bikeTotalCost.value;
  }
  return carTotalCost.value - bikeTotalCost.value;
});

const savings10Year = computed(() => savingsAmount.value * Math.pow(1 + EstGrowthRate, InvestmentYearsShort));
const savings40Year = computed(() => savingsAmount.value * Math.pow(1 + EstGrowthRate, InvestmentYearsLong));

// Emit savings and car label to parent for sticky header
const carLabel = computed(() => {
  if (alreadyOwnsCar.value) return 'Car-Lite';
  return isNew.value ? 'New Car' : 'Used Car';
});

watch(savingsAmount, (val) => emit('update:savings', val), { immediate: true });
watch(carLabel, (val) => emit('update:carLabel', val), { immediate: true });

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
  const similarTypes = currentType ?
    BikeTypes[currentType as BikeTypeId]?.similarTypes ?? [] : [];

  return Object.entries(props.allBikeTypes)
    .filter(([key]) => key !== currentType)
    .map(([key, value]) => ({
      value: key,
      label: value.label || value.title
    }))
    .sort((a, b) => {
      const aIndex = similarTypes.indexOf(a.value as BikeTypeId);
      const bIndex = similarTypes.indexOf(b.value as BikeTypeId);
      // Similar types first (by their order in the array), then the rest
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
});

// The bike type currently shown — comparison selection takes priority over the recommendation
const displayedBikeType = computed(() => comparisonBike.value || recommendationType.value);

// Handle bike type change — only do in-page comparison on plain clicks;
// let Ctrl+Click / Cmd+Click / middle-click navigate normally.
function handleComparisonClick(event: MouseEvent, bikeType: string) {
  if (!isPlainClick(event)) return;
  event.preventDefault();
  comparisonBike.value = bikeType;
  emit('bike-change', bikeType);
}

// Currency formatting helper
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

// Rounds to nearest $1k below $1M, or "$X.XM" above
function formatRounded(value: number) {
  if (value >= 1_000_000) {
    const millions = Math.round(value / 100_000) / 10;
    const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return '$' + formatted + ' million';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.round(value / 1000) * 1000);
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;

.section-divider {
  border: none;
  border-top: 1px solid vars.$border-light;
  margin: 2rem 0;
}

.savings-section {
  background-color: vars.$lightest-gray;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: vars.$shadow-sm;
}

.car-type-label {
  text-decoration: underline;
}

.savings-heading {
  color: vars.$primary;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
}

.savings-intro {
  color: vars.$text-secondary;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.ownership-toggle {
  background-color: vars.$white;
  border-radius: vars.$border-radius;
  margin-bottom: 1.5rem;
  box-shadow: vars.$shadow-md;
  overflow: hidden;

  &.-active .toggle-label {
    background-color: vars.$primary;
    color: vars.$white;
  }

  &.-active .toggle-switch {
    background-color: rgba(255, 255, 255, 0.3);

    &::after {
      background-color: vars.$white;
    }
  }
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  font-weight: 600;
  color: vars.$dark;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  input[type="checkbox"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background-color: vars.$lighter-gray;
  border-radius: 12px;
  position: relative;
  flex-shrink: 0;
  transition: background-color 0.2s;

  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    background-color: vars.$white;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  input:checked + & {
    &::after {
      transform: translateX(20px);
    }
  }

  input:focus-visible + & {
    outline: 0.25rem solid vars.$primary-dark;
    outline-offset: 0.125rem;
  }
}

.replacement-slider {
  padding: 1rem 1.5rem 1.25rem;

  .slider-row { margin-top: 0.5rem; }
}

.slider-reveal-enter-active,
.slider-reveal-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.slider-reveal-enter-from,
.slider-reveal-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}

.slider-label {
  display: block;
  font-weight: 600;
  color: vars.$dark;
  font-size: 0.95rem;
}

.slider-row {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.slider-track-group {
  flex: 1;
  min-width: 0;
  margin-top: 0.4rem;

  .slider-track {
    position: relative;

    .slider-fill-bar {
      position: absolute;
      width: 150px;
      height: 9px;
      border-radius: 5px 0 0 5px;
      top: 10px;
      background-color: vars.$primary;
      pointer-events: none;
    }
  }
}

.slider-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: vars.$primary;
  white-space: nowrap;
  width: 4rem;
}

.slider-input {
  width: 100%;
  height: 8px;
  appearance: none;
  background: vars.$lighter-gray;
  border-radius: 4px;

  &:focus-visible {
    outline: none;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 22px;
    height: 22px;
    background: vars.$primary;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: vars.$shadow-md;
    z-index: 10;

    &:hover {
      background: vars.$primary-dark;
    }
  }

  &:focus-visible::-webkit-slider-thumb {
    outline: 0.25rem solid vars.$primary-dark;
    outline-offset: 0.125rem;
  }

  &::-moz-range-thumb {
    width: 22px;
    height: 22px;
    background: vars.$primary;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: vars.$shadow-md;

    &:hover {
      background: vars.$primary-dark;
    }
  }

  &:focus-visible::-moz-range-thumb {
    outline: 0.25rem solid vars.$primary-dark;
    outline-offset: 0.125rem;
  }
}

.slider-range {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: vars.$text-secondary;
  font-weight: 600;
  margin-top: 0.25rem;
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

  p {
    color: vars.$text-secondary;
    font-weight: normal;
    font-size: 1rem;
  }
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
  text-decoration: none;
  color: inherit;

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
  padding: 1.5rem 0.5rem 0.5rem;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  .electric-badge {
    z-index: 1;
    top: 0.8125rem;
  }
}

.recommendation-pill {
  position: absolute;
  top: -0.8rem;
  width: 10.5rem;
  margin: auto;
  left: 0;
  right: 0;
  display: inline-block;
  background-color: vars.$secondary-accessible;
  color: vars.$white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
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

.long-term-growth {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.vacation-cost-note {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

.buying-tips {
  display: flex;
  align-items: center;
  gap: 2rem;
  background-color: vars.$primary-lighter;
  border-radius: vars.$border-radius;
  border-left: 4px solid vars.$primary;
  padding: 1.25rem 1.5rem;
  margin-top: 1.5rem;
  text-align: left;
}

.buying-tips-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.buying-tips-content {
  h4 {
    color: vars.$primary-dark;
    font-size: 1.1rem;
    margin-bottom: 0.35rem;
  }

  p {
    color: vars.$dark;
    font-size: 0.95rem;
    margin-bottom: 0.75rem;
    text-align: left;
  }
}

.find-shops-btn {
  display: inline-block;
  background-color: vars.$primary;
  color: vars.$white;
  text-decoration: none;
  padding: 0.5rem 0.75rem 0.5rem 1.25rem;
  border-radius: vars.$border-radius-lg;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: vars.$primary-dark;
    transform: translateY(-1px);
  }

  span { margin-left: 0.25rem; }
}

@media (max-width: 900px) {
  .benefits-grid {
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

  .benefits-grid {
    grid-template-columns: 1fr;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .benefit-emoji {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .benefit-card {
    padding: 1.25rem;
  }

  .savings-highlight {
    padding: 1.5rem;
  }

  .buying-tips {
    display: block;
  }

  .buying-tips-icon {
    float: left;
    font-size: 2rem;
    margin: 1rem 1rem 1rem 0.5rem;
  }
}
</style>