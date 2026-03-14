<template>
  <div class="gear-guide-container">
    <h1>Essential Gear Guide</h1>
    <p class="page-intro">
      Got your bike picked out? These three accessories are the essentials every
      rider should have from day one.
    </p>

    <div class="gear-grid">
      <div v-for="item in ESSENTIAL_GEAR" :key="item.id" class="gear-card">
        <img v-if="item.image" :src="item.image" :alt="item.title" class="gear-image" :class="item.imageClass">
        <div class="gear-card-body">
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
          <a
            :href="item.wirecutter.url"
            target="_blank"
            rel="noopener noreferrer"
            class="wirecutter-link"
          >
            Read Wirecutter Guide &rarr;
          </a>
        </div>
      </div>
    </div>

    <h2 class="section-heading">Nice to Have</h2>

    <div class="gear-grid">
      <div v-for="item in NICE_TO_HAVE_GEAR" :key="item.id" class="gear-card">
        <img v-if="item.image" :src="item.image" :alt="item.title" class="gear-image" :class="item.imageClass">
        <div class="gear-card-body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <a
            :href="item.wirecutter.url"
            target="_blank"
            rel="noopener noreferrer"
            class="wirecutter-link"
          >
            Read Wirecutter Guide &rarr;
          </a>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <p>Haven't found your bike yet?</p>
      <router-link to="/assessment" class="assessment-link">Take the Bike Assessment &rarr;</router-link>
    </div>
  </div>
</template>

<script setup>
import { ESSENTIAL_GEAR, NICE_TO_HAVE_GEAR } from '../constants/essentialGear';
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
  background-color: vars.$bg-body;
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

  p { flex: 1; }
}

.gear-image {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: contain;
  padding: 1rem;
  border-bottom: 1px solid vars.$border-light;
  background-color: vars.$white;

  &.-extra-padding {
    padding: 2.5rem;
  }
}

.wirecutter-link {
  display: inline-block;
  margin-top: 1rem;
  color: vars.$primary;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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
}
</style>
