<template>
  <div class="bike-recommendation">
    <div v-if="alternateBikeType && allBikeTypes && allBikeTypes[alternateBikeType as BikeTypeId]" class="alternate-note">
      <h4 class="alternate-note-heading">Absolutely Can't Store Outside?</h4>
      <a :href="'/bike/' + alternateBikeType" target="_blank" rel="noopener" aria-hidden="true" tabindex="-1">
        <img :src="allBikeTypes[alternateBikeType as BikeTypeId].image" :alt="allBikeTypes[alternateBikeType as BikeTypeId].title" class="alternate-note-image">
      </a>
      <div class="alternate-note-body">
        <p>
          You can store a large cargo bike outside with a cover and a great lock — some
          owners also add a GPS tracker, motorcycle alarm, or bike-specific insurance for
          extra peace of mind. But if you absolutely can't store outside, check out
          {{ alternateArticle }}
          <a :href="'/bike/' + alternateBikeType" target="_blank" rel="noopener" class="alternate-link">
            <strong>{{ allBikeTypes[alternateBikeType as BikeTypeId].title }}</strong>
          </a>
          instead. It's much easier to store indoors!
        </p>
        <p class="alternate-note-tip">
          <router-link to="/storage" target="_blank" class="pill-link">
            Learn Bike Storage Tips
          </router-link>
        </p>
      </div>
    </div>

    <div class="recommendation-card">
      <div class="recommendation-badge">Recommended</div>
      <div class="result-image">
        <img :src="recommendationDetails.image" :alt="recommendationDetails.title">
        <div v-if="recommendationDetails.electric" class="electric-badge">⚡ Electric</div>
      </div>
    <div class="result-content">
      <div class="title-row">
        <h3>{{ recommendationDetails.title }}</h3>
      </div>

      <p class="result-description">{{ recommendationDetails.description }}</p>

      <div class="feature-list">
        <div class="feature" v-for="(feature, index) in recommendationDetails.features" :key="index">
          <span class="feature-icon">✓</span>
          <span>{{ feature }}</span>
        </div>
      </div>

      <div class="price-range">
        <span>Typical Price Range: </span>
        <strong>{{ recommendationDetails.priceRange }}</strong>
      </div>

      <div v-if="storageConstrained" class="storage-tip">
        <p v-if="recommendedBikeType === 'commuter-ebike'">
          <strong>Storage Tip!</strong> Look for a lighter eBike with an integrated battery, which
          are easier to carry upstairs. Other ebikes are heavier, but you can pull the battery and
          charge indoors, improving battery health and deterring theft.
        </p>
        <p>
          <strong>No room for a bike? Try bikeshare!</strong> Check if your area has a
          bikeshare program you get the benefits of biking without needing to store anything at home.
        </p>
      </div>
      <p class="usd-note">Note: All prices are in <strong>USD</strong>.</p>

      <share-button :savings-amount="savingsAmount" />
    </div>

      <div v-if="recommendationDetails.showTrailerTip" class="trailer-tip">
        <img src="/images/gear/bike-trailer.webp" alt="Bike trailer" class="trailer-image">
        <div class="trailer-tip-body">
          <strong>Need To Haul More? Get A Trailer!</strong>
          <p>
            A trailer hitches to your bike for extra cargo capacity and can store flat.
          </p>
          <a href="/gear-guide#bike-trailer" target="_blank" rel="noopener" class="trailer-link">
            See Trailer Reviews <span class="chevron-right"></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ShareButton from './ShareButton.vue';
import type { BikeType, BikeTypeId } from '../../types';

const props = withDefaults(defineProps<{
  recommendationDetails: BikeType;
  allBikeTypes?: Record<BikeTypeId, BikeType> | null;
  alternateBikeType?: string | null;
  storageConstrained?: boolean;
  recommendedBikeType?: string;
  savingsAmount?: number;
}>(), {
  allBikeTypes: null,
  alternateBikeType: null,
  storageConstrained: false,
  recommendedBikeType: '',
  savingsAmount: 0
});

const alternateArticle = computed(() => {
  if (!props.alternateBikeType || !props.allBikeTypes?.[props.alternateBikeType as BikeTypeId]) return 'a';
  const title = props.allBikeTypes[props.alternateBikeType as BikeTypeId].title;
  return /^[aeiou]/i.test(title) ? 'an' : 'a';
});
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;

.recommendation-card {
  background-color: vars.$lightest-gray;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: vars.$shadow-sm;
  text-align: left;
  position: relative;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.result-image {
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: vars.$shadow-md;
    padding: 0.5rem;
    background: vars.$white;
  }

  .electric-badge {
    top: -0.5rem;
  }
}

.title-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-content h3 {
  font-size: 1.5rem;
  color: vars.$primary;
  margin-bottom: 0.5rem;
  margin-right: 1rem;
  flex: 1;
}

.compare-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  label {
    font-size: 0.9rem;
    color: vars.$text-secondary;
  }

  select {
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid vars.$border-form;
    background-color: vars.$white;
    font-size: 0.9rem;
    color: vars.$text-body;
    cursor: pointer;
    min-width: 200px;

    &:focus {
      outline: none;
      border-color: vars.$primary;
      box-shadow: 0 0 0 2px rgba(44, 138, 87, 0.2);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.return-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: vars.$lightest-gray;
  border: 1px solid vars.$primary;
  color: vars.$primary;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: vars.$primary-lighter;
  }
}

.comparison-badge,
.recommendation-badge {
  position: absolute;
  top: -10px;
  left: 20px;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: vars.$white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: fit-content;
  z-index: 1;
}

.comparison-badge {
  background-color: vars.$secondary;
}

.recommendation-badge {
  background-color: vars.$primary;
}

.original-recommendation {
  border-left: 4px solid vars.$primary;
}

.result-description {
  color: vars.$dark;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.feature-list {
  margin: 1.5rem 0;
}

.feature {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.feature-icon {
  color: vars.$primary;
  font-weight: bold;
  margin-right: 0.75rem;
}

.price-range {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid vars.$border-gray;
}

.usd-note {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.alternate-note {
  background-color: vars.$secondary-light;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
  text-align: left;

  p {
    margin: 0;
    color: vars.$secondary-dark;
    line-height: 1.5;
    font-size: 0.9rem;
  }
}

.alternate-note-heading {
  color: vars.$secondary-dark;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.alternate-note-body {
  flex: 1;
  min-width: 0;
}

.alternate-note-tip {
  margin-top: 0.75rem !important;
}

.storage-tip {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: vars.$primary-lighter;
  border-radius: 6px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: vars.$primary-dark;

  p + p { margin-top: 1rem; }
}

.trailer-tip {
  margin-top: 1.5rem;
  display: flex;
  align-items: flex-start;
  background-color: vars.$bg-highlight;
  border-radius: 8px;
  box-shadow: vars.$shadow-sm;
  font-size: 0.9rem;
  line-height: 1.5;
  color: vars.$primary-dark;
  overflow: hidden;

  p {
    margin: 0.5rem 0;
  }
}

.trailer-image {
  width: 150px;
  flex-shrink: 0;
  object-fit: contain;
  align-self: stretch;
  background-color: vars.$white;
}

.trailer-tip-body {
  padding: 1rem 1.25rem;
}

.trailer-link {
  display: inline-block;
  margin-top: 0.25rem;
  color: vars.$primary;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.alternate-link {
  color: vars.$secondary-dark;
  text-decoration: underline;

  &:hover {
    color: vars.$secondary-accessible;
  }
}

.alternate-note-image {
  float: left;
  width: auto;
  height: 6rem;
  border-radius: 8px;
  margin-right: 1rem;
  margin-bottom: 0.25rem;
  background-color: vars.$white;
  padding: 0.25rem;
}

@media (min-width: #{vars.$breakpoint-mobile-up}) {
  .recommendation-card {
    display: grid;
    grid-template-columns: 40% 1fr;
    grid-template-rows: auto auto;
    column-gap: 2rem;
  }

  .result-image {
    grid-column: 1;
    grid-row: 1;
    margin-bottom: 0;
  }

  .result-content {
    grid-column: 2;
    grid-row: 1 / -1;
  }

  .trailer-tip {
    grid-column: 1;
    grid-row: 2;
    align-self: start;
  }

  .alternate-note {
    display: flex;
    align-items: flex-start;
    gap: 0 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .alternate-note-heading {
    width: 100%;
  }

  .alternate-note-image {
    float: none;
    margin: auto;
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .recommendation-card {
    background-color: vars.$white;
    padding: 1rem;
  }

  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-image { margin-top: 1rem; }

  .result-content h3 {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .compare-selector {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;

    select {
      width: 100%;
    }
  }

  .comparison-badge {
    position: static;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .trailer-tip {
    flex-direction: column;
  }

  .trailer-image {
    width: 100%;
    padding-right: 20%;
  }
}
</style>