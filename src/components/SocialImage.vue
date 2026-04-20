<template>
  <div class="social-image">
    <div class="content">
      <div class="eyebrow">4 questions. No nonsense.</div>
      <h1>Find The<br> Right Bike</h1>
      <SocialImageBenefits />
    </div>
    <SocialImageCollage />
    <div class="site-brand">
      <img src="/images/icons/favicon.svg" alt="" class="site-logo">
      findtheright.bike
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialImageCollage from './SocialImageCollage.vue'
import SocialImageBenefits from './SocialImageBenefits.vue'
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;
@use '../assets/scss/social-image';

.content {
  padding: 2rem;
  flex-shrink: 0;
}

.eyebrow {
  color: vars.$white;
}

h1 {
  font-size: 4rem;
}

:deep(.collage) {
  height: 100%;
  padding: 2rem 2.5rem 2rem 1rem;
  margin-left: -9rem;
}

:deep(.photo img) {
  height: 170px;
}
</style>
