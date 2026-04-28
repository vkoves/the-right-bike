<template>
  <div class="social-image">
    <div class="promo-header">
      <div class="eyebrow">Car payments. Gas Prices. Insurance.</div>
      <h1>There's a Better Way.</h1> <!-- Consider "What If You Had One Less Car."-->
    </div>
    <div class="promo-body">
      <div class="content">
        <div class="content-title">Find The<br>Right Bike</div>
        <SocialImageBenefits />
      </div>
      <SocialImageCollage />
    </div>
    <div class="cta-row">
      <div class="cta-button">Take The Quiz</div>
    </div>
    <div class="promo-footer">
      <div class="site-brand">
        <img src="/images/icons/favicon.svg" alt="" class="site-logo">
        www.findtheright.bike
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 1000×800px square ad for Streetsblog and similar outlets.
 * Rendered bare at /ads/square for screenshot capture; previewed at /ads.
 */
import SocialImageCollage from './SocialImageCollage.vue'
import SocialImageBenefits from './SocialImageBenefits.vue'
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;
@use '../assets/scss/social-image';

.social-image {
  height: 800px;
  flex-direction: column;
  align-items: stretch;
}

.promo-header {
  flex-shrink: 0;
  text-align: center;
  padding: 1.5rem 2rem 0.75rem;
  font-size: 3rem;

  h1 {
    font-size: 3.75rem;
    margin-bottom: 0.5rem;
  }

  .eyebrow {
    color: vars.$white;
    font-size: 1.5rem;
    margin-bottom: 0rem;
  }
}

.promo-body {
  display: flex;
  align-items: center;
  padding: 1rem 0;
}

.content {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem 2rem;
  flex-basis: 60%;
  max-width: 60%;
  flex-shrink: 0;
}

.content-title {
  font-size: 5.25rem;
  font-weight: 700;
  color: vars.$white;
  line-height: 1.1;
  margin: 0 0 1.5rem;
}

.cta-row {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-start;
  padding: 0 2rem;
  margin-top: 1.5rem;

  .cta-button {
    background-color: vars.$white;
    color: vars.$primary;
    font-weight: 700;
    font-size: 2.25rem;
    padding: 0.9rem 2.5rem;
    border-radius: 50px;
  }
}

.promo-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 1rem 2.5rem;
  margin-top: auto;
}

// Override absolute positioning from social-image.scss so it flows in the footer
.site-brand {
  position: static;
}

:deep(.collage) {
  position: absolute;
  right: 0;
  top: 10rem;
  height: 600px;
  width: 500px;
  margin-bottom: -2rem;
  grid-template-columns: 1fr;
  gap: 0;
  overflow: hidden;

  .photo-1 {
    transform: rotate(-4deg) translate(0rem, 0.5rem)
  }

  .photo-2 {
    transform: rotate(3deg) translate(-2rem, -0.5rem)
  }

  .photo-4 {
    display: none;
  }
}

:deep(.photo img) {
  height: 180px;
}
</style>
