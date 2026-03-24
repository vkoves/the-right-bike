<template>
  <div class="step-container">
    <h2>Where Will You Store Your Bike?</h2>
    <p class="subtitle">This helps us recommend a bike that fits your living situation</p>

    <div class="options-grid">
      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue === 'garage' }"
        @click="updateStorage('garage')"
        :aria-pressed="(modelValue === 'garage').toString()"
      >
        <div class="option-icon">🏠</div>
        <div class="option-content">
          <div class="option-label">Garage or Shed</div>
          <div class="option-description">Dedicated ground-level space for bikes</div>
        </div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue === 'basement' }"
        @click="updateStorage('basement')"
        :aria-pressed="(modelValue === 'basement').toString()"
      >
        <div class="option-icon">🚪</div>
        <div class="option-content">
          <div class="option-label">Basement or a Few Steps</div>
          <div class="option-description">Some stairs, but manageable</div>
        </div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue === 'upper-floor' }"
        @click="updateStorage('upper-floor')"
        :aria-pressed="(modelValue === 'upper-floor').toString()"
      >
        <div class="option-icon">🪜</div>
        <div class="option-content">
          <div class="option-label">Upper Floor / No Storage</div>
          <div class="option-description">Need to carry bike up stairs or lock outside</div>
        </div>
      </button>
    </div>

    <div class="navigation-buttons">
      <button class="btn-prev" @click="$emit('prev')">Back</button>
      <button class="btn-next" @click="$emit('calculate')" :disabled="!modelValue">See My Results</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'prev', 'calculate']);

function updateStorage(value) {
  emit('update:modelValue', value);
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;
@use "../../assets/scss/assessment";

.option-description {
  font-size: 0.8rem;
  line-height: 1.3;
}
</style>
