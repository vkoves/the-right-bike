<template>
  <div class="comparison-container">
    <div class="comparison-item bike" :class="{ 'comparing': isComparing }">
      <div class="comparison-header">
        <img :src="bikeImage" :alt="bikeTitle">
        <h4>{{ bikeTitle }} <span v-if="isComparing" class="comparing-badge">Comparing</span></h4>
      </div>
      <div class="cost-breakdown">
        <div class="cost-item">
          <span class="cost-label">Initial Purchase</span>
          <span class="cost-value">{{ Currency.format(costs.bike.purchase) }}</span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Maintenance</span>
          <span class="cost-value">{{ Currency.format(costs.bike.maintenance) }}</span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual "Fuel" Cost</span>
          <span class="cost-value">{{ Currency.format(costs.bike.fuel) }}</span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Insurance</span>
          <span class="cost-value">{{ Currency.format(costs.bike.insurance) }}</span>
        </div>
        <div class="cost-item total">
          <span class="cost-label">5-Year Total Cost</span>
          <span class="cost-value">{{ Currency.format(bikeTotalCost) }}</span>
        </div>
      </div>
    </div>

    <div class="comparison-divider">
      <div class="vs-circle" :class="{ 'plus-mode': alreadyOwnsCar }">{{ alreadyOwnsCar ? '+' : 'VS' }}</div>
    </div>

    <div class="comparison-item car" :class="{ 'own-car-mode': alreadyOwnsCar }">
      <div class="comparison-header">
        <img src="/images/honda-crv.jpg" alt="Car">
        <div v-if="!alreadyOwnsCar" class="car-type-toggle">
          <button
            class="toggle-option"
            :class="{ active: isNew }"
            @click="emit('car-type-change', true)"
          >New</button>
          <button
            class="toggle-option"
            :class="{ active: !isNew }"
            @click="emit('car-type-change', false)"
          >Used</button>
        </div>
        <h4 v-if="alreadyOwnsCar">Your Car -
          <span class="car-subtitle">With {{replacementPercent }}% Less Use</span>
        </h4>
        <h4 v-else>Average {{ isNew ? 'New' : 'Used' }} Car</h4>
      </div>
      <div class="cost-breakdown">
        <div class="cost-item" v-if="!alreadyOwnsCar">
          <span class="cost-label">Initial Purchase</span>
          <span class="cost-value">
            {{ Currency.format(isNew ? CAR_COSTS.purchase : CAR_COSTS.usedPurchase) }}
            <sup class="footnote-link" @click="showFootnote('purchase')">¹</sup>
          </span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Maintenance</span>
          <span class="cost-value">
            {{ Currency.format(costs.car.maintenance * (alreadyOwnsCar ? 1 - replacementPercent / 100 : 1)) }}
            <sup class="footnote-link" @click="showFootnote('maintenance')">{{ alreadyOwnsCar ? '¹' : '²' }}</sup>
          </span>
          <span v-if="alreadyOwnsCar" class="cost-saving">
            Save {{ Currency.format(maintenanceSaving) }}/yr
          </span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Fuel Cost</span>
          <span class="cost-value">
            {{ Currency.format(costs.car.fuel * (alreadyOwnsCar ? 1 - replacementPercent / 100 : 1)) }}
            <sup class="footnote-link" @click="showFootnote('fuel')">{{ alreadyOwnsCar ? '²' : '³' }}</sup>
          </span>
          <span v-if="alreadyOwnsCar" class="cost-saving">
            Save {{ Currency.format(fuelSaving) }}/yr
          </span>
        </div>
        <div class="cost-item">
          <span class="cost-label">
            {{ alreadyOwnsCar ? 'Mileage-Based Insurance' : 'Annual Insurance' }}
          </span>
          <span class="cost-value">
            {{ Currency.format(alreadyOwnsCar ? mileageInsuranceAnnual : costs.car.insurance) }}
            <sup class="footnote-link" @click="showFootnote('insurance')">{{ alreadyOwnsCar ? '³' : '⁴' }}</sup>
          </span>
          <span v-if="alreadyOwnsCar" class="cost-saving">
            Save {{ Currency.format(insuranceSaving) }}/yr
          </span>
        </div>
        <div class="cost-item total">
          <span class="cost-label">5-Year Total Cost</span>
          <span class="cost-value">{{ Currency.format(carTotalCost) }}</span>
        </div>
        <div v-if="alreadyOwnsCar" class="cost-item total savings-total">
          <span class="cost-label">5-Year Savings</span>
          <span class="cost-value">{{ Currency.format(totalAnnualSaving * 5) }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Footnotes Section -->
  <div class="footnotes-section" v-if="showFootnotes">
    <div class="footnote-header">
      <h3>Sources</h3>
      <button class="close-footnotes" @click="showFootnotes = false">×</button>
    </div>
    <div class="footnote-content">
      <div class="footnote" v-if="activeFootnote === 'purchase' || activeFootnote === 'all'">
        <p v-if="!isNew"><strong>¹ Used car purchase price:</strong> {{ Currency.format(CAR_COSTS.usedPurchase) }} average (Cox Automotive, {{ CAR_COSTS.usedPurchaseUpdatedAt }})</p>
        <p v-else><strong>¹ New car purchase price:</strong> {{ Currency.format(CAR_COSTS.purchase) }} average (Cox Automotive, {{ CAR_COSTS.purchaseUpdatedAt }})</p>
        <p class="source-link">
          <a :href="isNew ? carCostSources.purchaseSource : carCostSources.usedPurchaseSource" target="_blank">
            Source: Cox Automotive ({{ isNew ? CAR_COSTS.purchaseUpdatedAt : CAR_COSTS.usedPurchaseUpdatedAt }})
          </a>
        </p>
      </div>
      <div class="footnote" v-if="activeFootnote === 'maintenance' || activeFootnote === 'all'">
        <p><strong>² Car maintenance:</strong> $1,200 ($583 - $1,623 per year, varies by brand)</p>
        <p class="source-link">
          <a :href="carCostSources.maintenanceSource" target="_blank">
            Source: Consumer Affairs
          </a>
        </p>
      </div>
      <div class="footnote" v-if="activeFootnote === 'fuel' || activeFootnote === 'all'">
        <p><strong>³ Fuel costs:</strong> $2,500 ($500 - $8,250 per year, varies by vehicle)</p>
        <p class="source-link">
          <a :href="carCostSources.fuelSource" target="_blank">
            Source: U.S. Department of Energy
          </a>
        </p>
      </div>
      <div class="footnote" v-if="activeFootnote === 'insurance' || activeFootnote === 'all'">
        <template v-if="alreadyOwnsCar">
          <p>
            <strong>Mileage-based insurance:</strong> $58 - $150/month. Monthly bill combines a fixed
            base rate ($30 - $60) with a per-mile charge (avg $0.06 - $0.07/mile).
          </p>
          <p class="source-link">
            <a :href="carCostSources.mileageInsuranceSource" target="_blank">
              Source: MoneyGeek
            </a>
          </p>
        </template>
        <template v-else>
          <p><strong>⁴ Insurance costs:</strong> {{ Currency.format(CAR_COSTS.insurance) }}/year average ({{ CAR_COSTS.insuranceUpdatedAt }})</p>
          <p class="source-link">
            <a :href="carCostSources.insuranceSource" target="_blank">
              Source: NerdWallet ({{ CAR_COSTS.insuranceUpdatedAt }})
            </a>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { CAR_COSTS } from '../../constants/bikeCosts';
import Currency from '../../utils/currency';

const props = defineProps({
  bikeTitle: { type: String, required: true },
  bikeImage: { type: String, required: true },
  costs: { type: Object, required: true },
  bikeTotalCost: { type: Number, required: true },
  carTotalCost: { type: Number, required: true },
  isComparing: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  alreadyOwnsCar: { type: Boolean, default: false },
  replacementPercent: { type: Number, default: 100 },
  mileageInsuranceAnnual: { type: Number, default: 0 },
});

const emit = defineEmits(['car-type-change']);

const carCostSources = {
  purchaseSource: CAR_COSTS.purchaseSource,
  usedPurchaseSource: CAR_COSTS.usedPurchaseSource,
  maintenanceSource: CAR_COSTS.maintenanceSource,
  fuelSource: CAR_COSTS.fuelSource,
  insuranceSource: CAR_COSTS.insuranceSource,
  mileageInsuranceSource: CAR_COSTS.mileageInsuranceSource,
};

const showFootnotes = ref(false);
const activeFootnote = ref('all');

function showFootnote(type: string) {
  activeFootnote.value = type;
  showFootnotes.value = true;
}


// Per-line annual savings when in "already owns" mode
const scale = computed(() => props.replacementPercent / 100);
const maintenanceSaving = computed(() => props.costs.car.maintenance * scale.value);
const fuelSaving = computed(() => props.costs.car.fuel * scale.value);
const insuranceSaving = computed(() => props.costs.car.insurance - props.mileageInsuranceAnnual);
const totalAnnualSaving = computed(() => maintenanceSaving.value + fuelSaving.value + insuranceSaving.value);
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;

.comparison-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
  gap: 1rem;
  margin-bottom: 2rem;
}

.comparison-item {
  flex: 1;
  min-width: 250px;
  background-color: vars.$white;
  border-radius: vars.$border-radius;
  box-shadow: vars.$shadow-md;
  overflow: hidden;
}

.comparison-header {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid vars.$border-lighter;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
  min-height: 14rem;

  img {
    width: 150px;
    height: 100px;
    object-fit: contain;
    margin-bottom: 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  h4 {
    color: vars.$dark;
    font-size: 1.2rem;
  }
}

.comparing .comparison-header img {
  box-shadow: vars.$shadow-image-highlight;
}

.cost-breakdown {
  padding: 0.5rem 2rem 1.5rem 2rem;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid vars.$border-lighter;

  &:has(+ .total) {
    border-bottom: none;
  }

  &.total {
    font-weight: bold;
    font-size: 1.1rem;
    border-top: 2px solid vars.$border-lighter;
    border-bottom: none;
    padding-top: 1rem;
    margin-bottom: 0;

    .cost-item, .cost-value { font-weight: bold; }
  }

  &.total + .savings-total {
    border-top: none;
    margin: 0;
  }
}

.cost-label {
  color: vars.$text-secondary;
}

.cost-value {
  font-weight: 600;
  color: vars.$dark;
  white-space: nowrap;
}

.comparison-divider {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: vars.$secondary-accessible;
  color: vars.$white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.car-type-toggle {
  display: inline-flex;
  background-color: vars.$lighter-gray;
  border-radius: 20px;
  padding: 3px;
  margin-bottom: 1rem;
}

.toggle-option {
  border: none;
  background: none;
  padding: 0.25rem 0.85rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: vars.$text-body;
  transition: background-color 0.2s, color 0.2s;

  &.active {
    background-color: vars.$white;
    color: vars.$dark;
    box-shadow: vars.$shadow-sm;
  }

  &:not(.active):hover {
    color: vars.$dark;
  }
}

.comparing-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: normal;
  background-color: vars.$secondary;
  color: vars.$white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin-left: 0.5rem;
  vertical-align: middle;
}

.comparison-item.comparing {
  border-left: 3px solid vars.$secondary;
}

.bike .cost-value {
  color: vars.$primary;
}

.car .cost-value {
  color: vars.$danger-dark;
}

.car.own-car-mode .cost-value {
  color: vars.$gray;
}

.car .cost-item.total .cost-value {
  color: vars.$danger-dark;
}

.car.own-car-mode .cost-item.total .cost-value {
  color: vars.$primary-dark;
}

.car-subtitle {
  font-weight: normal;
  color: vars.$text-secondary;
}

.plus-mode {
  background-color: vars.$primary;
  font-size: 2.5rem;
}

.savings-total.total {
  margin-top: 0;
  border-top: none;
  padding: 0;
  font-weight: bold;

  .cost-label,
  .cost-value {
    color: vars.$primary;
  }
}

.car.own-car-mode .cost-item.total:not(.savings-total) .cost-value {
  color: vars.$gray;
}

.car.own-car-mode .cost-item.total:not(.savings-total) .cost-label {
  color: vars.$gray;
}

.cost-saving {
  width: 100%;
  display: block;
  font-weight: 700;
  color: vars.$primary;
  text-align: right;
  margin-right: 1.5rem;
}

.cost-item:has(.cost-saving) {
  flex-wrap: wrap;
}

.bike .cost-item.total .cost-value {
  color: vars.$primary-dark;
}

/* Footnotes */
.footnote-link {
  position: absolute;
  color: vars.$primary;
  font-weight: bold;
  border-radius: 10rem;
  padding: 0 4px;
  margin-left: 3px;
  font-size: 1rem;
  vertical-align: middle;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background-color: vars.$primary-lighter;
    color: vars.$primary-dark;
  }
}

.footnotes-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: vars.$white;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  z-index: 100;
  max-height: 80vh;
  overflow-y: auto;
  border-top: 3px solid vars.$primary;
  animation: slideUp 0.3s ease-in-out;
}

.footnote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    color: vars.$primary;
    margin: 0;
  }

  .close-footnotes {
    background-color: vars.$lighter-gray;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    min-width: 30px;
    font-size: 1.2rem;
    line-height: 30px;
    padding: 0;
    cursor: pointer;
    color: vars.$dark;

    &:hover {
      background-color: vars.$border-gray;
      color: vars.$dark;
    }
  }
}

.footnote-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footnote {
  background-color: vars.$lightest-gray;
  padding: 1rem;
  border-radius: vars.$border-radius;
  border-left: 3px solid vars.$primary-lighter;

  p {
    margin: 0.5rem 0;
    color: vars.$dark;
    text-align: left;
  }

  .source-link {
    font-size: 0.85rem;

    a {
      color: vars.$primary;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .comparison-container {
    flex-direction: column;

    .comparison-header { min-height: initial; }
  }

  .footnotes-section {
    padding: 1rem;
  }

  .footnote {
    padding: 0.75rem;
  }
}
</style>
