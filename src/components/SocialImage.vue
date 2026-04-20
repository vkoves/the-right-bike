<template>
  <div class="social-image">
    <div class="content">
      <div class="eyebrow">4 questions. No nonsense.</div>
      <h1>Find The<br> Right Bike</h1>
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
    <div class="site-brand">
      <img src="/images/icons/favicon.svg" alt="" class="site-logo">
      findtheright.bike
    </div>
  </div>
</template>

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

// 2x2 collage
.collage {
  width: 550px;
  height: 100%;
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  padding: 2rem 2.5rem 2rem 1rem;
  align-items: center;
  justify-items: center;
  margin-left: -9rem;
}

.photo {
  padding: 8px;
  border-radius: 5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  width: max-content;

  img {
    height: 170px;
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
    transform: rotate(3deg)  translate(-2rem, 0.5rem);
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
