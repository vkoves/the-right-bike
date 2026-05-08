<template>
  <li class="result-card" :class="{ '-carries-type': shop.carriesType }">
    <img :src="shop.logo" :alt="`${shop.name} logo`" class="shop-logo">

    <div class="shop-header">
      <span class="shop-name">{{ shop.name }}</span>
      <span v-if="shop.carriesType" class="carries-badge">Carries {{ bikeShortTitle }}</span>
    </div>

    <span class="distance">{{ shop.distanceMi.toFixed(1) }} mi away</span>

    <p class="address">
      {{ shop.address }}, {{ shop.city }}, {{ shop.state }} {{ shop.zip }}
    </p>

    <p class="shop-description">{{ shop.description }}</p>

    <div class="bike-types">
      <div>Sells Bike Types</div>

      <span v-for="type in shop.bikeTypes" :key="type" class="bike-type-tag">
        {{ BikeTypes[type]?.shortTitle ?? type }}
      </span>
    </div>

    <p class="avg-price">Avg. price: <strong>${{ shop.avgPrice }}</strong></p>

    <div class="shop-links">
      <a :href="`tel:${shop.phone}`" class="shop-link">{{ shop.phone }}</a>
      <a :href="shop.website" target="_blank" rel="noopener" class="shop-link">
        {{ stripProtocol(shop.website) }}
      </a>
    </div>
  </li>
</template>

<script setup lang="ts">
/**
 * Displays a single bike shop result card with distance and type-match indicator.
 * @prop shop - The shop data plus computed distanceMi and carriesType fields.
 * @prop bikeShortTitle - Display name of the recommended bike type for the badge.
 */
import type { ShopWithDistance } from './BikeShopFinder.vue';
import { BikeTypes } from '../../constants/bikeTypes';

defineProps({
  shop: { type: Object as () => ShopWithDistance, required: true },
  bikeShortTitle: { type: String, required: true }
});

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

.result-card {
  display: grid;
  grid-template-columns: 3.5rem 1fr auto;
  grid-template-areas:
    "logo header      distance"
    "logo address     address"
    "logo description description"
    "logo bike-types  bike-types"
    "logo avg-price   avg-price"
    "logo links       links";
  column-gap: 1rem;
  align-items: start;
  background: vars.$bg-card;
  border: 1px solid vars.$border-light;
  border-radius: vars.$border-radius-sm;
  padding: 1rem;
  text-align: left;

  &.-carries-type {
    border-color: vars.$primary;
    box-shadow: 0 0 0 1px vars.$primary;
  }
}

.shop-logo {
  grid-area: logo;
  align-self: center;
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
  border-radius: vars.$border-radius-sm;
}

.shop-header {
  grid-area: header;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0 0.5rem;
}

.shop-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: vars.$text-dark;
}

.carries-badge {
  background: vars.$primary;
  color: vars.$white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: vars.$border-radius-sm;
}

.distance {
  grid-area: distance;
  font-size: 0.85rem;
  font-weight: 600;
  color: vars.$text-secondary;
  white-space: nowrap;
}

.address {
  grid-area: address;
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: vars.$text-muted;
}

.shop-description {
  grid-area: description;
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: vars.$text-muted;
}

.bike-types {
  grid-area: bike-types;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.5rem 0;

  div {
    width: 100%;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

.bike-type-tag {
  background: vars.$bg-bike-type;
  color: vars.$primary-dark;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: vars.$border-radius-sm;
}

.avg-price {
  grid-area: avg-price;
  margin: 0.35rem 0 0.5rem;
  font-size: 0.85rem;
  color: vars.$text-secondary;
  font-weight: 600;
}

.shop-links {
  grid-area: links;
  display: flex;
  gap: 0.25rem 1rem;
  flex-wrap: wrap;
}

.shop-link {
  font-size: 0.9rem;
  color: vars.$primary-dark;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .result-card {
    grid-template-columns: 3.5rem 1fr;
    grid-template-areas:
      "logo header"
      "logo distance"
      "address     address"
      "description description"
      "bike-types  bike-types"
      "avg-price   avg-price"
      "links       links";
  }

  .carries-badge { margin-bottom: 0.25rem; }

  .address { margin-top: 1rem; }

  .shop-logo {
    align-self: start;
  }
}
</style>
