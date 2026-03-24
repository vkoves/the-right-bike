<template>
  <div>
    <div v-if="idealBikeType && allBikeTypes[idealBikeType]" class="ideal-note">
      <h4 class="ideal-note-heading">Your Ideal Bike Might Be Too Hard To Store</h4>
      <img :src="allBikeTypes[idealBikeType].image" :alt="allBikeTypes[idealBikeType].title" class="ideal-note-image">
      <div class="ideal-note-body">
        <p>
          {{ idealArticle }}
          <a :href="'/bike/' + idealBikeType" target="_blank" rel="noopener noreferrer" class="ideal-link">
            <strong>{{ allBikeTypes[idealBikeType].title }}</strong>
          </a>
          would be the ideal fit for your needs, but based on your storage situation
          <strong>we've recommended a more practical option below.</strong>
          Keep it in mind if your storage changes down the road!
        </p>
        <p class="ideal-note-tip">
          However, some people do store cargo bikes outside under motorcycle covers!
          <a href="https://youtu.be/r-fWnbTkuaQ?si=92wLmDFhAng-eSo3&t=440" target="_blank" rel="noopener noreferrer" class="ideal-link">
            See how one cargo bike family in NYC does it.
          </a>
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

      <share-button :savings-amount="savingsAmount" />
    </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ShareButton from './ShareButton.vue';

const props = defineProps({
  recommendationDetails: {
    type: Object,
    required: true
  },
  allBikeTypes: {
    type: Object,
    default: null
  },
  idealBikeType: {
    type: String,
    default: null
  },
  storageConstrained: {
    type: Boolean,
    default: false
  },
  recommendedBikeType: {
    type: String,
    default: ''
  },
  savingsAmount: {
    type: Number,
    default: 0
  }
});

const idealArticle = computed(() => {
  if (!props.idealBikeType || !props.allBikeTypes?.[props.idealBikeType]) return 'A';
  const title = props.allBikeTypes[props.idealBikeType].title;
  return /^[aeiou]/i.test(title) ? 'An' : 'A';
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
  display: flex;
  flex-direction: column;
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

.ideal-note {
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

.ideal-note-heading {
  color: vars.$secondary-dark;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.ideal-note-body {
  flex: 1;
  min-width: 0;
}

.ideal-note-tip {
  margin-top: 0.5rem !important;
  font-size: 0.85rem !important;
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

.ideal-link {
  color: vars.$secondary-dark;
  text-decoration: underline;

  &:hover {
    color: vars.$secondary-accessible;
  }
}

.ideal-note-image {
  float: left;
  width: auto;
  height: 80px;
  border-radius: 8px;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

@media (min-width: #{vars.$breakpoint-mobile-up}) {
  .recommendation-card {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .ideal-note {
    display: flex;
    align-items: flex-start;
    gap: 0 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ideal-note-heading {
    width: 100%;
  }

  .ideal-note-image {
    float: none;
    margin: auto;
  }

  .result-image {
    flex: 0 0 40%;
    margin-right: 2rem;
    margin-bottom: 0;
  }

  .result-content {
    flex: 1;
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .recommendation-card {
    background-color: vars.$white;
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }

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

  .comparison-badge,
  .recommendation-badge {
    position: static;
    display: inline-block;
    margin-bottom: 1rem;
  }
}
</style>