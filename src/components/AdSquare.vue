<template>
  <div class="social-image">
    <div class="ad-header">
      <div class="eyebrow">Car payments. Gas Prices. Insurance.</div>
      <h1>There's a Better Way.</h1> <!-- Consider "What If You Had One Less Car."-->
    </div>
    <div class="ad-body">
      <div class="content">
        <div class="content-title">Find The<br>Right Bike</div>
        <SocialImageBenefits />
      </div>
      <SocialImageCollage />
    </div>
    <div class="cta-row">
      <div class="cta-button">Find The Bike For You</div>
    </div>
    <div class="ad-footer">
      <div class="site-brand">
        <img src="/images/icons/favicon.svg" alt="" class="site-logo">
        www.findtheright.bike
      </div>
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

.social-image {
  height: 800px;
  flex-direction: column;
  align-items: stretch;
}

.ad-header {
  flex-shrink: 0;
  text-align: center;
  padding: 1.5rem 2rem 0.75rem;
  font-size: 3rem;

  h1 {
    font-size: 3.75rem;
    margin-bottom: 0;
  }

  .eyebrow {
    color: vars.$white;
    font-size: 1.5rem;
  }
}

h1 {
  font-size: 4rem;
}

.ad-body {
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 1rem 0;
}

.content {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem 2rem;
  flex-basis: 60%;
  flex-shrink: 0;
}

.content-title {
  font-size: 4rem;
  font-weight: 700;
  color: vars.$white;
  line-height: 1.1;
  margin: 0 0 1.5rem;
}

.cta-row {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 0.75rem 2rem;
}

.cta-button {
  background-color: vars.$white;
  color: vars.$primary;
  font-weight: 700;
  font-size: 1.75rem;
  padding: 0.9rem 2.5rem;
  border-radius: 50px;
}

.ad-footer {
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
  height: 450px;
  padding: 0rem 2rem 0rem 0.5rem;
  margin-left: -8rem;
}

:deep(.photo img) {
  height: 180px;
}
</style>
