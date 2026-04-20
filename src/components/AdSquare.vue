<template>
  <div class="social-image">
    <div class="ad-header">
      <div class="eyebrow">Car payments. Gas Prices. Insurance.</div>
      <h1>There's a Better Way.</h1> <!-- Consider "What If You Had One Less Car."-->
    </div>
    <div class="ad-body">
      <div class="content">
        <div class="content-title">Find The<br>Right Bike</div>
        <div class="benefits-summary">
          <div class="benefit-item">
            <div class="benefit-icon">💰</div>
            <div>Save Thousands</div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🌍</div>
            <div>Reduce Emissions</div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">⏱️</div>
            <div>Get Back Time</div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">❤️</div>
            <div>Improve Your Health</div>
          </div>
        </div>
      </div>
      <div class="collage">
        <div class="photo photo-1">
          <img src="/images/bikes/urban-arrow.jpg" alt="Family bike">
        </div>
        <div class="photo photo-2">
          <img src="/images/bikes/gazelle-ebike.jpg" alt="Electric bike">
        </div>
        <div class="photo photo-3">
          <img src="/images/bikes/tern-gsd-500.jpg" alt="Cargo bike">
        </div>
        <div class="photo photo-4">
          <img src="/images/bikes/dutch-bike.jpg" alt="City bike">
        </div>
      </div>
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

// 2x2 collage
.collage {
  width: 550px;
  height: 450px;
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  padding: 0rem 2rem 0rem 0.5rem;
  align-items: center;
  justify-items: center;
  margin-left: -8rem;
}

.photo {
  padding: 8px;
  border-radius: 5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  width: max-content;

  img {
    height: 180px;
    width: auto;
    display: block;
    border-radius: 2px;
  }

  &.photo-1 {
    background: #E63946;
    transform: rotate(-4deg) translate(0rem, -0.25rem);
  }
  &.photo-2 {
    background: #3A86FF;
    transform: rotate(3deg) translate(-2rem, 0.5rem);
  }
  &.photo-3 {
    background: #FFBE0B;
    transform: rotate(-4deg) translate(5rem, -1rem);
    z-index: 1;
  }
  &.photo-4 {
    background: #06D6A0;
    transform: rotate(3deg) translate(0.5rem, -2rem);
  }
}
</style>
