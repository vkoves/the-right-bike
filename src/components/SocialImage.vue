<template>
  <div class="social-image">
    <div class="content">
      <div class="eyebrow">4 questions. No nonsense.</div>
      <h1>Find The<br>Right Bike</h1>
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
        <img src="/images/bikes/dutch-bike.jpg" alt="City bike">
      </div>
      <div class="photo photo-2">
        <img src="/images/bikes/gazelle-ebike.jpg" alt="Electric bike">
      </div>
      <div class="photo photo-3">
        <img src="/images/bikes/tern-gsd-500.jpg" alt="Cargo bike">
      </div>
      <div class="photo photo-4">
        <img src="/images/bikes/urban-arrow.jpg" alt="Family bike">
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

$bg-start: #1e6b3d;
$bg-mid: #2c8a57;

.social-image {
  width: 1000px;
  height: 522px;
  background: linear-gradient(135deg, $bg-start 0%, $bg-mid 60%, #3aaa6e 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
}

.content {
  flex: 1;
  padding: 2rem;
  z-index: 1;
  flex-shrink: 0;
  margin-bottom: 3rem;
}

.eyebrow {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: vars.$white;
  margin-bottom: 1rem;
}

h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: vars.$white;
  line-height: 1.1;
  margin: 0 0 1.5rem;
}

.benefits-summary { gap: 1rem 0.5rem; }

.benefit-item {
  background-color: rgba(255, 255, 255, 0.18);
  color: vars.$white;
  font-weight: 700;
  box-shadow: none;
  font-size: 1rem;
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
    transform: rotate(2deg) translate(1rem, -2rem);
    z-index: 1;
  }
  &.photo-4 {
    background: #06D6A0;
    transform: rotate(-3deg) translate(-1rem, 0rem);
  }
}

.site-brand {
  position: absolute;
  bottom: 1.25rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: vars.$white;
  letter-spacing: 0.05em;
  z-index: 2;
}

.site-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 5px;
  border: 2px solid vars.$white;
}
</style>
