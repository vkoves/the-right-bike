<template>
  <div v-if="bike" class="social-image">
    <div class="content">
      <div class="eyebrow">Your perfect bike is a</div>
      <h1>{{ bike.title }}</h1>
      <ul class="features">
        <li v-for="feature in bike.features.slice(0, 3)" :key="feature">{{ feature }}</li>
      </ul>
      <div class="price">~ {{ bike.priceRange }}</div>
    </div>
    <div class="photo-area">
      <div class="photo-frame">
        <img :src="bike.image" :alt="bike.title">
      </div>
      <div v-if="bike.electric" class="electric-badge">⚡ Electric</div>
    </div>
    <div class="site-brand">
      <img src="/images/icons/favicon.svg" alt="" class="site-logo">
      findtheright.bike
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { BikeTypes } from '../constants/bikeTypes';

const props = defineProps({
  type: { type: String, required: true }
});

const bike = computed(() => BikeTypes[props.type] || null);
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;
@use '../assets/scss/social-image';

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;

  li {
    color: vars.$white;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.3rem 0;

    &::before {
      content: '✓ ';
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.price {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.18);
  color: vars.$white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
}

.photo-area {
  width: 440px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  position: relative;
}

.photo-frame {
  background: vars.$white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transform: rotate(2deg);

  img {
    width: 360px;
    height: auto;
    display: block;
    border-radius: 4px;
  }
}

.electric-badge {
  top: 2rem;
  right: 2.5rem;
  font-size: 0.9rem;
  padding: 0.35rem 0.75rem;
}
</style>
