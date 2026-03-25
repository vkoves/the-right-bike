<template>
  <div class="step-container">
    <h2>Where Will You Store Your Bike?</h2>
    <p class="subtitle">This helps us recommend a bike that fits your living situation</p>

    <div class="options-grid">
      <button
        v-for="(opt, key) in StorageOptions"
        :key="key"
        type="button"
        class="option-card"
        :class="{ selected: modelValue === key }"
        @click="updateStorage(key)"
        :aria-pressed="modelValue === key"
      >
        <div class="option-icon">{{ opt.icon }}</div>
        <div class="option-content">
          <div class="option-label">{{ opt.label }}</div>
          <div class="option-description">{{ opt.description }}</div>
        </div>
      </button>
    </div>

    <div class="navigation-buttons">
      <button class="btn-prev" @click="$emit('prev')">Back</button>
      <button class="btn-next" @click="$emit('calculate')" :disabled="!modelValue">See My Results</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StorageOptions } from '../../constants/assessmentOptions';

defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'prev', 'calculate']);

function updateStorage(value: string) {
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
