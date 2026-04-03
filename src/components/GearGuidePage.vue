<template>
  <div class="gear-guide-container">
    <h1>Essential Gear Guide</h1>
    <p class="page-intro">
      Got your bike picked out? These three accessories are the essentials every
      rider should have from day one.
    </p>

    <div class="gear-grid">
      <div v-for="item in ESSENTIAL_GEAR" :key="item.id" class="gear-card">
        <div v-if="item.images" class="gear-image-pair">
          <div class="gear-image-half -left">
            <img :src="item.images[0]" :alt="item.title">
          </div>
          <div class="gear-image-half -right">
            <img :src="item.images[1]" :alt="item.title">
          </div>
        </div>
        <img v-else-if="item.image" :src="item.image" :alt="item.title" class="gear-image" :class="item.imageClass">
        <div class="gear-card-body">
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
          <a
            :href="item.wirecutter?.url"
            target="_blank"
            rel="noopener"
            class="review-link"
          >
            {{ item.wirecutter?.title }} <span class="chevron-right"></span>
            <span class="review-source">Wirecutter</span>
          </a>
        </div>
      </div>
    </div>

    <h2 class="section-heading">Important Extras</h2>

    <div class="gear-grid">
      <div v-for="item in NICE_TO_HAVE_GEAR" :key="item.id" :id="item.id" class="gear-card">
        <img v-if="item.image" :src="item.image" :alt="item.title" class="gear-image" :class="item.imageClass">
        <div class="gear-card-body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <a
            v-if="item.wirecutter"
            :href="item.wirecutter.url"
            target="_blank"
            rel="noopener"
            class="review-link"
          >
            {{ item.wirecutter.title }} <span class="chevron-right"></span>
            <span class="review-source">Wirecutter</span>
          </a>
          <template v-if="item.links">
            <a
              v-for="link in item.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener"
              class="review-link"
            >
              {{ link.title }} <span class="chevron-right"></span>
              <span v-if="link.source" class="review-source">{{ link.source }}</span>
            </a>
          </template>
        </div>
      </div>
    </div>

    <div class="winter-section">
      <h2 class="winter-heading">Winter Riding <img src="/images/icons/snowflake.svg" class="snowflake-icon" alt=""></h2>
      <p class="winter-intro">
        Planning to ride year-round? These upgrades make cold-weather commuting safe and comfortable.
        See <a href="https://www.nytimes.com/wirecutter/reviews/best-rain-gear-for-biking/" target="_blank" rel="noopener" class="winter-link">Wirecutter's Foul-Weather Bike Commuting Guide</a> for full reviews.
      </p>

      <div class="gear-grid">
        <div v-for="item in WINTER_GEAR" :key="item.id" class="gear-card -winter">
          <div v-if="item.image" class="gear-image-container" :class="item.imageClass">
            <img :src="item.image" :alt="item.title" class="gear-image">
          </div>
          <div class="gear-card-body">
            <span v-if="item.emoji" class="gear-emoji">{{ item.emoji }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>

      <div class="winter-video-card">
        <h3>More Winter Riding Tips</h3>
        <p>
          Want to learn more about winter biking? We made a video just for you, with more tips o
          winter clothing, maintenance and more.
        </p>
        <div class="winter-video">
          <iframe
            src="https://www.youtube-nocookie.com/embed/m8w0Yu6Youo"
            title="Winter biking tips"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <p>Haven't found your bike yet?</p>
      <router-link to="/assessment" class="assessment-link">Take the Bike Assessment &rarr;</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ESSENTIAL_GEAR, NICE_TO_HAVE_GEAR, WINTER_GEAR } from '../constants/essentialGear';
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.gear-guide-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: vars.$primary;
  margin-bottom: 1rem;
}

.page-intro {
  max-width: 700px;
  margin-bottom: 2.5rem;
  font-size: 1.2rem;
  color: vars.$text-secondary;
}

.section-heading {
  color: vars.$primary;
  margin: 2.5rem 0 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid vars.$bg-bike-type;
}

.gear-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.gear-card {
  background-color: vars.$white;
  border-radius: 8px;
  padding: 0;
  box-shadow: vars.$shadow-sm;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  h2, h3 {
    color: vars.$primary;
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
  }

  p {
    color: vars.$text-body;
    line-height: 1.6;
  }
}

.gear-card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;

  p {
    flex: 1;
    margin-bottom: 0.5rem;
  }
}

.gear-image-pair {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  border-bottom: 2px solid vars.$border-light;
  background-color: vars.$white;
  overflow: hidden;
}

.gear-image-half {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 55%;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0.75rem;
  }

  &.-left {
    left: 0;
    transform: scale(0.75) translate(0.5em, 0em) rotate(28deg);
  }

  &.-right {
    right: 0;
    clip-path: polygon(18% 0, 100% 0, 100% 100%, 0 100%);
  }
}

.gear-image {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: contain;
  padding: 1rem;
  border-bottom: 2px solid vars.$border-light;
  background-color: vars.$white;

  &.-extra-padding {
    padding: 2.5rem;
  }

  &.-no-pad-left {
    padding-left: 0;
    object-fit: cover;
  }
}

.gear-image-container {
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border-bottom: 2px solid vars.$border-light;
  background-color: vars.$white;

  .gear-image {
    width: 100%;
    border-bottom: none;
  }

  &.-edge-to-edge {
    .gear-image {
      aspect-ratio: unset;
      height: auto;
      padding: 0.75rem 0 0 0;
      object-fit: cover;
    }
  }
}

.review-link {
  display: block;
  margin-top: 1rem;
  color: vars.$primary;
  font-weight: 600;
  text-decoration: none;
  line-height: 1.2;

  &:hover {
    text-decoration: underline;
  }
}

.review-source {
  display: block;
  font-size: 0.85rem;
  font-weight: 400;
}

.winter-section {
  margin-top: 2.5rem;
  padding: 2rem;
  background-color: vars.$secondary-light;
  border-radius: 8px;
}

.snowflake-icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
  margin-left: 0.25rem;
  // Tint the SVG to match $secondary-dark using a CSS filter
  filter: invert(44%) sepia(72%) saturate(450%) hue-rotate(172deg) brightness(90%) contrast(95%);
}

.winter-link {
  color: vars.$secondary-dark;

  &:hover {
    color: #124a6e;
  }
}

.winter-heading {
  color: vars.$secondary-dark;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.winter-intro {
  color: vars.$text-secondary;
  margin-bottom: 1.5rem;

  a {
    color: vars.$secondary-dark;
    font-weight: 600;

    &:hover {
      text-decoration: none;
    }
  }
}

.winter-video-card {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: vars.$white;
  border-radius: 8px;
  max-width: 600px;

  h3 {
    color: vars.$secondary-dark;
    margin-bottom: 0.5rem;
  }

  p {
    color: vars.$text-secondary;
    margin-bottom: 1rem;
  }
}

.winter-video {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
  }
}

.gear-card.-winter {
  background-color: vars.$white;

  h3 {
    color: vars.$secondary-dark;
  }
}

.gear-emoji {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}


.page-footer {
  margin-top: 3rem;
  text-align: center;
  padding: 2rem;
  background-color: vars.$bg-body;
  border-radius: 8px;

  p {
    color: vars.$text-secondary;
    margin-bottom: 0.75rem;
  }
}

.assessment-link {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background-color: vars.$primary;
  color: vars.$white;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: vars.$primary-dark;
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .gear-grid {
    grid-template-columns: 1fr;
  }

  .winter-section {
    margin: 1rem -1rem;
    padding: 1.5rem;
  }
}
</style>
