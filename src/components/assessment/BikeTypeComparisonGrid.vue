<template>
  <!-- Grid showing the recommended bike alongside other types for in-page comparison -->
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
              <div class="bike-price">~ {{ Currency.format(costs.bike.purchase) }}</div>
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
              <div class="bike-price">~ {{ Currency.format(BikeTypes[type.value as BikeTypeId].costs.purchase) }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Scrollable grid of bike types letting the user compare their recommendation against alternatives.
 * @prop bikeTitle - display title of the recommended bike
 * @prop bikeImage - image path for the recommended bike
 * @prop costs - cost breakdown for the recommended bike (uses costs.bike.purchase)
 * @prop selectedBikeType - key of the currently recommended bike type
 * @prop allBikeTypes - map of all bike type keys to their metadata
 * @prop comparisonBike - key of the currently selected comparison bike (controlled by parent)
 * @emit bike-change - emitted with the selected bike type key when a comparison card is clicked
 */
import { computed } from 'vue';
import { BikeTypes } from '../../constants/bikeTypes';
import { isPlainClick } from '../../utils/navigation';
import Currency from '../../utils/currency';
import type { BikeTypeId } from '../../types';

const props = defineProps({
  bikeTitle: { type: String, required: true },
  bikeImage: { type: String, required: true },
  costs: { type: Object, required: true },
  selectedBikeType: { type: String, required: true },
  allBikeTypes: { type: Object, required: true },
  comparisonBike: { type: String, default: '' },
});

const emit = defineEmits(['bike-change']);

const availableBikeTypes = computed(() => {
  const currentType = props.selectedBikeType;
  const similarTypes = currentType ?
    BikeTypes[currentType as BikeTypeId]?.similarTypes ?? [] : [];

  return Object.entries(props.allBikeTypes)
    .filter(([key]) => key !== currentType)
    .map(([key, value]) => ({
      value: key,
      label: (value as { shortTitle?: string; title: string }).shortTitle || (value as { title: string }).title
    }))
    .sort((a, b) => {
      const aIndex = similarTypes.indexOf(a.value as BikeTypeId);
      const bIndex = similarTypes.indexOf(b.value as BikeTypeId);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
});

function handleComparisonClick(event: MouseEvent, bikeType: string) {
  if (!isPlainClick(event)) return;
  event.preventDefault();
  emit('bike-change', bikeType);
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

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

  scrollbar-width: auto;
  scrollbar-color: vars.$primary vars.$lighter-gray;
  -ms-overflow-style: auto;

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

  &::-webkit-scrollbar-button {
    display: none;
  }

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

@media (max-width: #{vars.$breakpoint-mobile}) {
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
}
</style>
