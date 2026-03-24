<template>
  <div class="step-container">
    <h2>What's your fitness level?</h2>
    <p class="subtitle">Be honest - this helps us make the right recommendation</p>

    <div class="options-grid">
      <button
        v-for="(opt, key) in FitnessOptions"
        :key="key"
        type="button"
        class="option-card fitness-card"
        :class="{ selected: modelValue === key }"
        @click="updateFitnessLevel(key)"
        :aria-pressed="(modelValue === key).toString()"
      >
        <div class="option-icon">{{ opt.icon }}</div>
        <div class="option-content">
          <div class="option-label">{{ opt.label }}</div>
          <p class="option-description">{{ opt.description }}</p>
        </div>
      </button>
    </div>

    <div class="navigation-buttons">
      <button class="btn-prev" @click="$emit('prev')">Back</button>
      <button class="btn-next" @click="$emit('next')" :disabled="!modelValue">Continue</button>
    </div>
  </div>
</template>

<script setup>
import { FitnessOptions } from '../../constants/assessmentOptions';

defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'prev', 'next']);

function updateFitnessLevel(level) {
  // Emit the update event with the new level
  emit('update:modelValue', level);

}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;
@use "../../assets/scss/assessment";

@media (min-width: #{vars.$breakpoint-mobile-up}) {
  .fitness-card {
    padding: 2rem 1.5rem;
  }
}
</style>