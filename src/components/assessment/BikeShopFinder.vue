<template>
  <section class="shop-finder" id="shop-finder">
    <h3>In Chicago? We Can Help You Find a Bike Shop!</h3>
    <p class="finder-intro">
      Enter your ZIP code to see nearby shops — we'll highlight any that carry a
      <strong>{{ bikeShortTitle }}</strong>.
    </p>

    <form class="zip-form" @submit.prevent="findShops">
      <label for="zip-input" class="sr-only">Your ZIP code</label>
      <input
        id="zip-input"
        v-model="zipInput"
        type="text"
        inputmode="numeric"
        pattern="\d{5}"
        maxlength="5"
        placeholder="Your ZIP code"
        class="zip-input"
      >
      <button type="submit" class="find-btn" :disabled="!isValidZip">
        Find Shops
      </button>
    </form>

    <p v-if="errorMessage" role="alert" class="error-message">{{ errorMessage }}</p>

    <ul v-if="rankedShops.length" class="shop-results">
      <bike-shop-result-card
        v-for="shop in rankedShops"
        :key="shop.name"
        :shop="shop"
        :bike-short-title="bikeShortTitle"
      />
    </ul>
  </section>
</template>

<script setup lang="ts">
/**
 * Looks up the user's Chicago ZIP code and lists bike shops sorted by distance,
 * highlighting shops that carry the recommended bike type.
 * @prop recommendedBikeType - The BikeTypeId from the assessment result.
 */
import { ref, computed } from 'vue';
import shopsData from '../../constants/bike-shops.json';
import { BikeTypes } from '../../constants/bikeTypes';
import { ChicagoZipCodes } from '../../constants/chicagoZipCodes';
import { haversineDistanceMi } from '../../utils/distance';
import BikeShopResultCard from './BikeShopResultCard.vue';
import type { BikeShop, BikeTypeId } from '../../types';

const props = defineProps({
  recommendedBikeType: { type: String as () => BikeTypeId, required: true }
});

export interface ShopWithDistance extends BikeShop {
  distanceMi: number;
  carriesType: boolean;
}

const ZipPattern = /^\d{5}$/;

const shops = shopsData as BikeShop[];

const zipInput = ref('');
const errorMessage = ref('');
const rankedShops = ref<ShopWithDistance[]>([]);

const isValidZip = computed(() => ZipPattern.test(zipInput.value));
const bikeShortTitle = computed(() => BikeTypes[props.recommendedBikeType].shortTitle);

function findShops() {
  if (!isValidZip.value) return;

  errorMessage.value = '';
  rankedShops.value = [];

  const coords = ChicagoZipCodes[zipInput.value];
  if (!coords) {
    errorMessage.value = "We don't have data for that ZIP code. This tool currently covers Chicago-area ZIP codes.";
    return;
  }

  rankedShops.value = shops
    .map((shop) => ({
      ...shop,
      distanceMi: haversineDistanceMi(coords.lat, coords.lng, shop.lat, shop.lng),
      carriesType: shop.bikeTypes.includes(props.recommendedBikeType)
    }))
    .sort((a, b) => a.distanceMi - b.distanceMi);
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

.shop-finder {
  background: vars.$primary-lightest;
  border: 1px solid vars.$primary-disabled;
  border-radius: vars.$border-radius;
  padding: 2rem;
  margin: 2rem 0;
}

h3 {
  color: vars.$primary-dark;
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
}

.finder-intro {
  color: vars.$text-muted;
  margin: 0 0 1.25rem;
}

.zip-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.zip-input {
  width: 9rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid vars.$border-form;
  border-radius: vars.$border-radius-sm;
  font-size: 1rem;

  &:focus {
    outline: 2px solid vars.$primary;
    outline-offset: 2px;
    border-color: vars.$primary;
  }
}

.find-btn {
  padding: 0.6rem 1.25rem;
  background: vars.$primary;
  color: vars.$white;
  border: none;
  border-radius: vars.$border-radius-sm;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: vars.$primary-dark;
  }

  &:disabled {
    background: vars.$primary-disabled;
    cursor: not-allowed;
  }
}

.error-message {
  color: vars.$danger-dark;
  margin-top: 0.75rem;
  font-weight: 600;
}

.shop-results {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
