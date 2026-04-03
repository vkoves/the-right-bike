<template>
  <div v-if="page" class="social-image">
    <div class="background-image" v-if="page.image">
      <img :src="page.image" alt="">
    </div>
    <div class="collage" v-else-if="page.images">
      <img v-for="(src, i) in page.images" :key="i" :src="src" alt=""
        class="collage-img" :class="`-pos-${i}`">
    </div>
    <div class="content">
      <h1>{{ page.title }}</h1>
      <div class="subtitle">Find The Right Bike</div>
    </div>
    <div class="site-brand">
      <img src="/images/icons/favicon.svg" alt="" class="site-logo">
      findtheright.bike
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PageMeta } from '../constants/pageMeta';

const props = defineProps({
  slug: { type: String, required: true }
});

const PageImages: Record<string, { image?: string; images?: string[] }> = {
  maintenance: {
    image: '/images/bike-maintenance.webp',
  },
  storage: {
    image: '/images/bike-storage.webp',
  },
  'gear-guide': {
    images: [
      '/images/gear/helmet.webp',
      '/images/gear/lights.webp',
      '/images/gear/lock.webp',
      '/images/gear/pump.webp',
      '/images/gear/rack.webp',
      '/images/gear/panniers.webp',
    ],
  },
};

const page = computed(() => {
  const meta = PageMeta[props.slug];
  if (!meta) return null;
  return { ...meta, ...PageImages[props.slug] };
});
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;
@use '../assets/scss/social-image';

.background-image {
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
}

.collage {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.75) 0%,
      rgba(0, 0, 0, 0.35) 100%
    );
    z-index: 1;
  }
}

.collage-img {
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: contain;
  background: white;

  &.-pos-1 { padding: 2rem; }
  &.-pos-2 { padding: 1.5rem; }
}

.content {
  z-index: 2;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-shadow: vars.$shadow-text;
}

h1 {
  font-size: 4rem;
  margin-bottom: 0rem;
}

.subtitle {
  font-size: 2rem;
  font-weight: 700;
  color: vars.$white;
}
</style>
