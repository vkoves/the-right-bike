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
          <span class="cost-value">{{ formatCurrency(costs.bike.purchase) }}</span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Maintenance</span>
          <span class="cost-value">{{ formatCurrency(costs.bike.maintenance) }}</span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual "Fuel" Cost</span>
          <span class="cost-value">{{ formatCurrency(costs.bike.fuel) }}</span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Insurance</span>
          <span class="cost-value">{{ formatCurrency(costs.bike.insurance) }}</span>
        </div>
        <div class="cost-item total">
          <span class="cost-label">5-Year Total Cost</span>
          <span class="cost-value">{{ formatCurrency(bikeTotalCost) }}</span>
        </div>
      </div>
    </div>

    <div class="comparison-divider">
      <div class="vs-circle">VS</div>
    </div>

    <div class="comparison-item car">
      <div class="comparison-header">
        <img src="/images/honda-crv.jpg" alt="New Honda CR-V">
        <h4>Average New Car</h4>
      </div>
      <div class="cost-breakdown">
        <div class="cost-item">
          <span class="cost-label">Initial Purchase</span>
          <span class="cost-value">
            {{ formatCurrency(costs.car.purchase) }}
            <sup class="footnote-link" @click="showFootnote('purchase')">¹</sup>
          </span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Maintenance</span>
          <span class="cost-value">
            {{ formatCurrency(costs.car.maintenance) }}
            <sup class="footnote-link" @click="showFootnote('maintenance')">²</sup>
          </span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Fuel Cost</span>
          <span class="cost-value">
            {{ formatCurrency(costs.car.fuel) }}
            <sup class="footnote-link" @click="showFootnote('fuel')">³</sup>
          </span>
        </div>
        <div class="cost-item">
          <span class="cost-label">Annual Insurance</span>
          <span class="cost-value">
            {{ formatCurrency(costs.car.insurance) }}
            <sup class="footnote-link" @click="showFootnote('insurance')">⁴</sup>
          </span>
        </div>
        <div class="cost-item total">
          <span class="cost-label">5-Year Total Cost</span>
          <span class="cost-value">{{ formatCurrency(carTotalCost) }}</span>
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
        <p><strong>¹ Car purchase price:</strong> $48,500 (Average between $48,401 - $48,641)</p>
        <p class="source-link">
          <a :href="carCostSources.purchaseSource" target="_blank">
            Source: Spectrum Local News (September 2024)
          </a>
        </p>
      </div>
      <div class="footnote" v-if="activeFootnote === 'maintenance' || activeFootnote === 'all'">
        <p><strong>² Car maintenance:</strong> $1,200 (Range: $583 - $1,623 per year, varies by brand)</p>
        <p class="source-link">
          <a :href="carCostSources.maintenanceSource" target="_blank">
            Source: Consumer Affairs
          </a>
        </p>
      </div>
      <div class="footnote" v-if="activeFootnote === 'fuel' || activeFootnote === 'all'">
        <p><strong>³ Fuel costs:</strong> $2,500 (Range: $500 - $8,250 per year, varies by vehicle)</p>
        <p class="source-link">
          <a :href="carCostSources.fuelSource" target="_blank">
            Source: U.S. Department of Energy
          </a>
        </p>
      </div>
      <div class="footnote" v-if="activeFootnote === 'insurance' || activeFootnote === 'all'">
        <p><strong>⁴ Insurance costs:</strong> $1,800 (Range: $631 - $2,685 per year, minimum to full coverage)</p>
        <p class="source-link">
          <a :href="carCostSources.insuranceSource" target="_blank">
            Source: Forbes Advisor
          </a>
        </p>
        <p class="source-link">
          <a :href="carCostSources.insuranceSource2" target="_blank">
            Additional Source: Bankrate
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CAR_COSTS } from '../../constants/bikeCosts';

defineProps({
  bikeTitle: { type: String, required: true },
  bikeImage: { type: String, required: true },
  costs: { type: Object, required: true },
  bikeTotalCost: { type: Number, required: true },
  carTotalCost: { type: Number, required: true },
  isComparing: { type: Boolean, default: false },
});

const carCostSources = {
  purchaseSource: CAR_COSTS.purchaseSource,
  maintenanceSource: CAR_COSTS.maintenanceSource,
  fuelSource: CAR_COSTS.fuelSource,
  insuranceSource: CAR_COSTS.insuranceSource,
  insuranceSource2: CAR_COSTS.insuranceSource2
};

const showFootnotes = ref(false);
const activeFootnote = ref('all');

function showFootnote(type) {
  activeFootnote.value = type;
  showFootnotes.value = true;
}

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
  padding: 1.5rem;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid vars.$border-lighter;

  &:has(+ .total) {
    border-bottom: none;
  }

  &.total {
    font-weight: bold;
    font-size: 1.1rem;
    margin-top: 1.5rem;
    border-top: 2px solid vars.$border-lighter;
    border-bottom: none;
    padding-top: 1rem;
  }
}

.cost-label {
  color: vars.$gray;
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
  background-color: vars.$secondary;
  color: vars.$white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
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
  color: vars.$danger;
}

.car .cost-item.total .cost-value {
  color: vars.$danger-dark;
}

.bike .cost-item.total .cost-value {
  color: vars.$primary-light;
}

/* Footnotes */
.footnote-link {
  font-size: 0.7rem;
  color: vars.$primary;
  cursor: pointer;
  font-weight: bold;
  border: 1px solid vars.$primary-lighter;
  border-radius: 50%;
  padding: 0 4px;
  margin-left: 3px;

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
  }

  .footnotes-section {
    padding: 1rem;
  }

  .footnote {
    padding: 0.75rem;
  }
}
</style>
