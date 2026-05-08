<template>
  <div class="shops-container">
    <h1>Bike Shops</h1>
    <p class="intro">Find local bike shops where you can browse and buy bikes in person.</p>

    <div class="shops-list">
      <div v-for="shop in shops" :key="shop.name" class="shop-card">
        <div class="shop-header">
          <img :src="shop.logo" :alt="`${shop.name} logo`" class="shop-logo">
          <div class="shop-title-group">
            <h2>{{ shop.name }}</h2>
            <p class="shop-address">
              {{ shop.address }}<br>
              {{ shop.city }}, {{ shop.state }} {{ shop.zip }}
            </p>
          </div>
        </div>

        <p class="shop-description">{{ shop.description }}</p>

        <dl class="shop-details">
          <div class="detail-row">
            <dt>Avg. Price</dt>
            <dd>${{ shop.avgPrice }}</dd>
          </div>
          <div class="detail-row">
            <dt>Phone</dt>
            <dd><a :href="`tel:${shop.phone}`">{{ shop.phone }}</a></dd>
          </div>
          <div class="detail-row">
            <dt>Website</dt>
            <dd>
              <a :href="shop.website" target="_blank" rel="noopener">
                {{ shop.website.replace('https://', '').replace('http://', '') }}
              </a>
            </dd>
          </div>
        </dl>

        <div v-if="shop.bikeTypes.length" class="bike-types">
          <span class="bike-types-label">Bike Types</span>
          <div class="type-badges">
            <span v-for="typeId in shop.bikeTypes" :key="typeId" class="type-badge">
              {{ BikeTypes[typeId].shortTitle }}
            </span>
          </div>
        </div>

        <p v-if="shop.notes" class="shop-notes">{{ shop.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Lists local bike shops with contact info, avg prices, and supported bike types.
 */
import shopsData from '../constants/bike-shops.json';
import { BikeTypes } from '../constants/bikeTypes';
import type { BikeShop } from '../types';

const shops = shopsData as BikeShop[];
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.shops-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: vars.$primary;
  margin-bottom: 0.5rem;
}

.intro {
  color: vars.$text-muted;
  margin-bottom: 2rem;
}

.shops-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.shop-card {
  background: vars.$bg-card;
  border-radius: vars.$border-radius;
  box-shadow: vars.$shadow-card;
  padding: 1.5rem;
}

.shop-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.shop-logo {
  width: 5rem;
  height: 5rem;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: vars.$border-radius-sm;
}

.shop-title-group {
  h2 {
    color: vars.$primary;
    margin: 0 0 0.25rem;
  }
}

.shop-address {
  color: vars.$text-muted;
  margin: 0;
  line-height: 1.5;
}

.shop-description {
  margin-bottom: 1rem;
}

.shop-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0 0 1rem;
}

.detail-row {
  dt {
    font-size: 0.75rem;
    font-weight: 600;
    color: vars.$text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.15rem;
  }

  dd {
    margin: 0;

    a {
      color: vars.$primary-dark;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.bike-types {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bike-types-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: vars.$text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.type-badges {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.type-badge {
  background: vars.$bg-bike-type;
  color: vars.$primary-dark;
  border-radius: vars.$border-radius-sm;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.shop-notes {
  margin-top: 0.75rem;
  color: vars.$text-muted;
  font-style: italic;
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .shop-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .shop-details {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
