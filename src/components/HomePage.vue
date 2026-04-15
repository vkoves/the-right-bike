<template>
  <div class="home-page">
    <div class="hero-container">
      <div class="hero-content">
        <h1>
          <span class="nowrap">Discover Your&nbsp;</span>
          <span class="nowrap">Perfect Bike</span>
          <br>
          <span class="smaller">
            With Just 4 Questions!
          </span>
        </h1>
        <p class="subtitle">Find the right bike to help biking replace some of your car trips</p>

        <h2>Why Bike?</h2>

        <div class="benefits-summary">
          <div class="benefit-item">
            <div class="benefit-icon">💰</div>
            <div>Save Thousands</div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">❤️</div>
            <div>Improve Your Health</div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">⏱️</div>
            <div>Get Back Time</div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🌍</div>
            <div>Reduce Emissions</div>
          </div>
        </div>

        <button class="cta-button" @click="startAssessment">Find Your Perfect Bike</button>
        <a class="scroll-hint" href="#bike-gallery" aria-label="Scroll to bike gallery">&#8595; Already know your type?</a>
      </div>

      <div class="bike-showcase">
        <div class="carousel-3d-container">
          <div class="carousel-3d" :style="{ transform: 'rotateY(' + currentRotation + 'deg)' }">
            <div
              class="carousel-item"
              :class="{ 'active': carouselIndex === 0 }"
              :style="{ transform: 'rotateY(0deg) translateZ(250px)' }"
            >
              <div class="image-container">
                <img src="/images/bikes/dutch-bike.jpg" alt="City Bike">
                <div class="overlay"></div>
              </div>
              <div class="caption">City Commuter</div>
            </div>
            <div
              class="carousel-item"
              :class="{ 'active': carouselIndex === 1 }"
              :style="{ transform: 'rotateY(90deg) translateZ(250px)' }"
            >
              <div class="image-container">
                <img src="/images/bikes/gazelle-ebike.jpg" alt="Gazelle commuter eBike">
                <div class="overlay"></div>
              </div>
              <div class="caption">Electric Power</div>
            </div>
            <div
              class="carousel-item"
              :class="{ 'active': carouselIndex === 2 }"
              :style="{ transform: 'rotateY(180deg) translateZ(250px)' }"
            >
              <div class="image-container">
                <img src="/images/bikes/tern-gsd-500.jpg" alt="Cargo Bike">
                <div class="overlay"></div>
              </div>
              <div class="caption">Cargo Carrier</div>
            </div>
            <div
              class="carousel-item"
              :class="{ 'active': carouselIndex === 3 }"
              :style="{ transform: 'rotateY(270deg) translateZ(250px)' }"
            >
              <div class="image-container">
                <img src="/images/bikes/urban-arrow.jpg" alt="Family Bike">
                <div class="overlay"></div>
              </div>
              <div class="caption">Family Transport</div>
            </div>
          </div>
        </div>

        <div class="carousel-controls">
          <button class="control-btn prev" @click="rotateCarousel('prev')" aria-label="Previous bike">
            <img src="/images/icons/chevron-left.svg" alt="" class="chevron-icon">
          </button>
          <button class="control-btn next" @click="rotateCarousel('next')" aria-label="Next bike">
            <img src="/images/icons/chevron-left.svg" alt="" class="chevron-icon chevron-right">
          </button>
        </div>
      </div>
    </div>

    <stories-section />

    <!-- Bike Gallery Section -->
    <section id="bike-gallery" class="bike-gallery-section">
      <h2>Already Know Your Type?</h2>
      <p class="gallery-intro">Skip the quiz and jump straight to the savings!</p>
      <div class="gallery-grid">
        <a
          v-for="bike in bikeOptions"
          :key="bike.key"
          class="gallery-card"
          :href="'/bike/' + bike.key"
          @click="navigateToBike($event, bike.key)"
        >
          <div class="gallery-card-image">
            <img :src="bike.image" :alt="bike.title">
            <div v-if="bike.electric" class="electric-badge">⚡ Electric</div>
          </div>
          <div class="gallery-card-body">
            <h3>{{ bike.title }}</h3>
            <div class="gallery-price">{{ bike.priceRange }}</div>
            <span class="gallery-cta">View Savings &#8594;</span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { BikeTypes } from '../constants/bikeTypes';
import { isPlainClick } from '../utils/navigation';
import StoriesSection from './StoriesSection.vue';

const router = useRouter();
const currentRotation = ref(0);
const carouselIndex = ref(0);
const autoRotateInterval = ref<ReturnType<typeof setInterval> | null>(null);

const bikeOptions = Object.entries(BikeTypes).map(([key, bike]) => ({ key, ...bike }));

function startAssessment() {
  router.push('/assessment');
}

function navigateToBike(event: MouseEvent, bikeKey: string) {
  if (!isPlainClick(event)) return;
  event.preventDefault();
  router.push({ name: 'BikeResult', params: { type: bikeKey } });
}

function rotateCarousel(direction: string) {
  // Stop auto-rotation temporarily when user manually rotates
  if (autoRotateInterval.value) {
    clearInterval(autoRotateInterval.value);
    startAutoRotation(); // Restart the auto-rotation
  }

  if (direction === 'next') {
    carouselIndex.value = (carouselIndex.value + 1) % 4;
  } else {
    carouselIndex.value = (carouselIndex.value - 1 + 4) % 4;
  }

  // Calculate the rotation angle
  currentRotation.value = -90 * carouselIndex.value;
}

function startAutoRotation() {
  autoRotateInterval.value = setInterval(() => {
    carouselIndex.value = (carouselIndex.value + 1) % 4;
    currentRotation.value = -90 * carouselIndex.value;
  }, 5000);
}

onMounted(() => {
  startAutoRotation();
});

onUnmounted(() => {
  if (autoRotateInterval.value) {
    clearInterval(autoRotateInterval.value);
  }
});
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../assets/scss/variables' as vars;

.home-page {
  display: flex;
  flex-direction: column;
}

.hero-container {
  padding: 8rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: vars.$bg-hero;
}

.hero-content {
  flex: 1;
  padding: 1rem 4rem;
  max-width: 700px;
}

h1 {
  color: vars.$dark;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;

  // Keep words in pairs, so we don't get "Discover Your Perfect \n Bike"
  .nowrap { display: inline-block; }

  .smaller {
    font-size: 0.75em;
    font-weight: normal;
  }
}

.subtitle {
  color: vars.$dark;
  font-size: 1.25rem;
  margin: 0 auto 1.5rem auto;
}

.benefits-summary {
  margin-bottom: 2rem;
  max-width: 30rem;
}

.cta-button {
  background: vars.$primary;
  color: vars.$white;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: vars.$border-radius-lg;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(44, 138, 87, 0.4);
  position: relative;
  overflow: hidden;
  z-index: 1;
  letter-spacing: 0.5px;

  &:hover {
    background: vars.$primary-dark;
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(44, 138, 87, 0.5);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
    z-index: -1;
  }

  &:hover:before {
    left: 100%;
  }
}

/* 3D Carousel Styles */
.bike-showcase {
  flex: 1;
  max-width: 850px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  perspective: 1000px;
}

.carousel-3d-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.carousel-3d {
  position: relative;
  width: 300px;
  height: 350px;
  transform-style: preserve-3d;
  transition: transform 1s ease;
}

.carousel-item {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: visible;
  transform-origin: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  z-index: 1;

  .image-container {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    margin-bottom: 1rem;
  }

  img {
    width: 100%;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    background-color: vars.$white;
    padding: 10px;
    transition: all 0.5s ease;
    filter: blur(2px) brightness(0.7);
    transform: scale(0.95);
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    transition: opacity 0.5s ease;
    opacity: 1;
    pointer-events: none;
  }

  &.active {
    z-index: 5;

    img {
      filter: blur(0) brightness(1);
      transform: scale(1);

      &:hover {
        transform: scale(1.05);
      }
    }

    .overlay {
      opacity: 0;
    }
  }
}

.caption {
  font-weight: 600;
  color: vars.$dark;
  font-size: 1.2rem;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
  background-color: vars.$bg-caption;
  padding: 0.4rem 1rem;
  border-radius: vars.$border-radius-lg;
  transition: opacity 0.5s ease, transform 0.5s ease;
  opacity: 0.7;
  transform: translateY(-5px);
  position: relative;
  z-index: 2;

  .active & {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-controls {
  position: absolute;
  bottom: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  transform: translateY(50%);
  z-index: 10;
}

.control-btn {
  background-color: vars.$bg-control;
  border: none;
  border-radius: 50%;
  padding: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: vars.$bg-control-hover;
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

}

.chevron-icon {
  width: 40px;
  height: 40px;

  &.chevron-right {
    transform: rotate(180deg);
  }
}

@media (max-width: #{vars.$breakpoint-tablet}) {
  .hero-container {
    flex-direction: column;
    padding: 1rem 0;
  }

  .hero-content {
    max-width: 100%;
    padding: 1rem;
    text-align: center;
    flex: 0 0 auto;

    h1 { font-size: 2rem; }
    .smaller {
      font-size: 1.5rem;
      font-weight: 600;
    }
    .subtitle {
      max-width: 18.75rem;
      font-size: 1rem;
    }
  }

  .benefits-summary {
    justify-content: center;
  }

  .cta-button {
    padding: 1rem;
    font-size: 1.1rem;
    width: 80%;
    max-width: 300px;
    margin: 0 auto;
  }

  .benefit-item {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .bike-showcase {
    width: 100%;
    flex: none;
    height: 300px;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .carousel-3d {
    width: 200px;
    height: 250px;
  }

  .chevron-icon {
    width: 32px;
    height: 32px;
  }

  .carousel-controls {
    bottom: 50%;
    transform: translateY(50%);
    padding: 0 1rem;
  }
}

/* Scroll hint link */
.scroll-hint {
  display: inline-block;
  margin-top: 1.5rem;
  margin-left: 1rem;
  color: vars.$text-dark;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  animation: bounce-down 2s infinite;

  &:hover {
    opacity: 1;
  }
}

@keyframes bounce-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* Bike Gallery Section */
.bike-gallery-section {
  display: none;
  padding: 4rem 2rem;
  background-color: vars.$white;
  text-align: center;

  h2 {
    color: vars.$dark;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
}

.gallery-intro {
  color: vars.$text-secondary;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.gallery-card {
  display: flex;
  flex-direction: column;
  background-color: vars.$lightest-gray;
  border-radius: vars.$border-radius;
  overflow: hidden;
  box-shadow: vars.$shadow-md;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: vars.$shadow-lg;
  }
}

.gallery-card-image {
  position: relative;
  background-color: vars.$white;

  img {
    width: 100%;
    height: 180px;
    object-fit: contain;
    padding: 0.75rem;
    display: block;
  }

}

.gallery-card-body {
  padding: 1rem 1.25rem 1.25rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;

  h3 {
    color: vars.$dark;
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
  }
}

.gallery-price {
  color: vars.$text-secondary;
  font-size: 0.9rem;
  font-weight: 600;
}

.gallery-cta {
  margin-top: auto;
  padding-top: 0.5rem;
  color: vars.$primary-dark;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

@media (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .bike-gallery-section {
    padding: 2.5rem 1rem;

    h2 {
      font-size: 1.5rem;
    }
  }

  .gallery-intro {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .gallery-card-image img {
    height: 130px;
  }

  .scroll-hint {
    display: none;
  }
}
</style>