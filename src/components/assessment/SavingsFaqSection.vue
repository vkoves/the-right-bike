<template>
  <div class="faq-section" id="car-faq">
    <h3>What if I need a car sometimes? 🤔</h3>
    <div class="faq-content">
      <p>Even with a bike as your primary transportation, you'll occasionally need a car for certain trips. Here are cost-effective alternatives to car ownership:</p>

      <div class="alternatives-grid">
        <div class="alternative-card">
          <div class="alternative-icon">🚗</div>
          <h4>Car Sharing</h4>
          <p>Services like Zipcar or Getaround offer hourly rentals (~$10-15/hour) for quick errands.</p>
          <div class="alternative-savings">
            <strong>10 rentals/year:</strong><br>
            $300 - $450
          </div>
        </div>

        <div class="alternative-card">
          <div class="alternative-icon">🚕</div>
          <h4>Ride Share</h4>
          <p>Uber, Lyft or taxis are perfect for evenings out or airport trips.</p>
          <div class="alternative-savings">
            <strong>20 rides/year:</strong><br>
            $400 - $600
          </div>
        </div>

        <div class="alternative-card">
          <div class="alternative-icon">🛻</div>
          <h4>Truck/Van Rental</h4>
          <p>Home Depot, U-Haul or similar for large purchases and moves.</p>
          <div class="alternative-savings">
            <strong>3 rentals/year:</strong><br>
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
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  savingsAmount: { type: Number, required: true }
});

const adjustedSavings = computed(() => {
  const netSavings = props.savingsAmount - 5000; // $1,000/year × 5 years
  return Math.floor(Math.max(0, netSavings) / 1000) * 1000;
});

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

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

.faq-content > p {
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
  0%   { box-shadow: vars.$shadow-primary; }
  50%  { box-shadow: vars.$shadow-primary-active; }
  100% { box-shadow: vars.$shadow-primary; }
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
  .alternatives-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .faq-section h3 {
    font-size: 1.5rem;
  }

  .alternatives-grid {
    grid-template-columns: 1fr;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .alternative-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .total-comparison {
    padding: 1.5rem 1rem;
    margin-top: 1rem;

    p { font-size: 1.05rem; }

    strong {
      display: inline-block;
      margin: 0.25rem 0;
    }
  }
}
</style>
