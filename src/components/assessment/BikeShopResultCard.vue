<template>
  <li class="result-card" :class="{ '-carries-type': shop.carriesType }">
    <img :src="shop.logo" :alt="`${shop.name} logo`" class="shop-logo">

    <div class="card-body">
      <div class="name-row">
        <span class="shop-name">{{ shop.name }}</span>
        <span v-if="shop.carriesType" class="carries-badge">Carries {{ bikeShortTitle }}</span>
      </div>

      <span class="distance">{{ shop.distanceMi.toFixed(1) }} mi away</span>

      <p class="address">
        {{ shop.address }}, {{ shop.city }}, {{ shop.state }} {{ shop.zip }}
      </p>

      <div class="shop-links">
        <a :href="`tel:${shop.phone}`" class="shop-link">{{ shop.phone }}</a>
        <a :href="shop.website" target="_blank" rel="noopener" class="shop-link">
          {{ stripProtocol(shop.website) }}
        </a>
      </div>
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
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: vars.$bg-card;
  border: 1px solid vars.$border-light;
  border-radius: vars.$border-radius-sm;
  padding: 1rem;

  &.-carries-type {
    border-color: vars.$primary;
    box-shadow: 0 0 0 1px vars.$primary;
  }
}

.shop-logo {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: vars.$border-radius-sm;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
}

.shop-name {
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
  font-size: 0.85rem;
  font-weight: 600;
  color: vars.$text-secondary;
}

.address {
  margin: 0.25rem 0 0.5rem;
  font-size: 0.9rem;
  color: vars.$text-muted;
}

.shop-links {
  display: flex;
  gap: 1rem;
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
</style>
