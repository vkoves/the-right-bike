<template>
  <div class="buying-options" v-if="options">
    <h3>Where to Buy</h3>
    <p class="buying-subtitle">Specific models to consider at different price points.</p>

    <div class="tiers">
      <a
        v-for="tier in tiers"
        :key="tier.key"
        class="tier-card"
        :class="tier.key"
        :href="options[tier.key].review"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="tier-badge">{{ tier.label }}</div>
        <div class="tier-image" :class="{ '-no-image': !options[tier.key].image }">
          <img
            v-if="options[tier.key].image"
            :src="options[tier.key].image"
            :alt="options[tier.key].model"
            @error="(e) => e.target.closest('.tier-image').classList.add('-no-image')"
          >
        </div>
        <div class="tier-body">
          <h4>{{ options[tier.key].model }}</h4>
          <div class="tier-price">{{ options[tier.key].price }}</div>
          <span class="tier-cta">Read Review &#8594;</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { BIKE_RECOMMENDATIONS } from '../../constants/bike-recommendations';

const props = defineProps({
  bikeType: { type: String, required: true }
});

const tiers = [
  { key: 'budget',   label: 'Budget'    },
  { key: 'midrange', label: 'Mid-Range' },
  { key: 'premium',  label: 'Premium'   },
];

const options = computed(() => BIKE_RECOMMENDATIONS[props.bikeType] || null);
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

$tier-premium: #9b6b00;
$tier-premium-bg: #fef9ec;

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
  color: vars.$gray;
  margin-bottom: 1.5rem;
}

.tiers {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
}

.tier-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 300px;
  background-color: vars.$white;
  border-radius: vars.$border-radius;
  box-shadow: vars.$shadow-md;
  overflow: hidden;
  text-decoration: none;
  border: 2px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: vars.$shadow-lg;

    .tier-cta { text-decoration: underline; }
  }

  &.budget   { border-top: 4px solid vars.$primary; }
  &.midrange { border-top: 4px solid vars.$secondary; }
  &.premium  { border-top: 4px solid $tier-premium; }
}

.tier-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.35rem 0.75rem;
  text-align: left;

  .budget   & { color: vars.$primary; background-color: vars.$primary-lighter; }
  .midrange & { color: vars.$secondary-dark; background-color: vars.$secondary-light; }
  .premium  & { color: $tier-premium; background-color: $tier-premium-bg; }
}

.tier-image {
  background-color: vars.$lightest-gray;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0.75rem;
  }

  &.-no-image {
    &::after {
      content: '🚲';
      font-size: 3rem;
      opacity: 0.3;
    }
    img { display: none; }
  }
}

.tier-body {
  padding: 1rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;

  h4 {
    color: vars.$dark;
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
  }
}

.tier-price {
  color: vars.$gray;
  font-size: 0.9rem;
}

.tier-cta {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;

  .budget   & { color: vars.$primary; }
  .midrange & { color: vars.$secondary-dark; }
  .premium  & { color: $tier-premium; }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .tiers {
    flex-direction: column;
    align-items: stretch;
  }

  .tier-card {
    max-width: 100%;
    flex-direction: row;
    border-top: none;
    border-left: 4px solid transparent;

    &.budget   { border-left-color: vars.$primary; }
    &.midrange { border-left-color: vars.$secondary; }
    &.premium  { border-left-color: $tier-premium; }
  }

  .tier-badge {
    display: none;
  }

  .tier-image {
    width: 110px;
    min-width: 110px;
    height: auto;
    min-height: 110px;
    flex-shrink: 0;
  }

  .tier-body {
    padding: 0.75rem;
  }
}
</style>
