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
        :aria-pressed="modelValue === key"
      >
        <div class="option-icon">{{ opt.icon }}</div>
        <div class="option-content">
          <div class="option-label">{{ opt.label }}</div>
          <p class="option-description">{{ opt.description }}</p>
        </div>
      </button>
    </div>

    <hr class="stability-divider" />

    <label
      class="stability-checkbox"
      :class="{ selected: prefersStability }"
    >
      <input
        type="checkbox"
        :checked="prefersStability"
        @change="$emit('update:prefersStability', ($event.target as HTMLInputElement).checked)"
      />
      <span class="check-circle" aria-hidden="true"></span>
      <span class="stability-text">
        <span class="stability-label">I Prefer Extra Stability</span>
        <!-- e.g., three wheels or a very low step-through frame -->
        <span class="stability-hint">Check this if you have concerns about balance or difficulty mounting a standard bike.</span>
      </span>
    </label>

    <div class="navigation-buttons">
      <button class="btn-prev" @click="$emit('prev')">Back</button>
      <button class="btn-next" @click="$emit('next')" :disabled="!modelValue">Continue</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FitnessOptions } from '../../constants/assessmentOptions';

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  prefersStability: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'update:prefersStability', 'prev', 'next']);

function updateFitnessLevel(level: string) {
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

.stability-divider {
  border: none;
  border-top: 1px solid vars.$lighter-gray;
  margin: vars.$spacing-lg 0;
}

.stability-checkbox {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: vars.$spacing-md;
  padding: vars.$spacing-md vars.$spacing-lg;
  border: 2px solid vars.$lighter-gray;
  border-radius: vars.$border-radius;
  background-color: vars.$lightest-gray;
  cursor: pointer;
  transition: all 0.2s ease;

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .check-circle {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border: 2px solid vars.$lighter-gray;
    border-radius: 50%;
    margin-top: 0.1rem;
    transition: all 0.2s ease;
  }

  &:focus-within {
    @extend %focus-ring;
  }

  &.selected {
    border-color: vars.$primary;
    background-color: rgba(44, 138, 87, 0.05);

    .check-circle {
      border-color: vars.$primary;
      background-color: vars.$primary;

      &::after {
        content: "✓";
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: vars.$white;
        font-weight: bold;
        font-size: 14px;
      }
    }
  }

  .stability-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stability-label {
    font-weight: 600;
  }

  .stability-hint {
    font-size: 0.85rem;
    color: vars.$text-secondary;
    font-weight: 600;
  }
}
</style>