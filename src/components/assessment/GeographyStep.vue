<template>
  <div class="step-container">
    <h2>Is it Windy Or Hilly Where You Are?</h2>
    <p class="subtitle">Select all that apply to your location</p>

    <div class="options-grid">
      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue.windy }"
        @click="toggleGeography('windy')"
        :aria-pressed="modelValue.windy"
      >
        <div class="option-icon">{{ GeographyOptions.windy.icon }}</div>
        <div class="option-label">{{ GeographyOptions.windy.label }}</div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue.hilly }"
        @click="toggleHilly"
        :aria-pressed="modelValue.hilly"
      >
        <div class="option-icon">{{ GeographyOptions.hilly.icon }}</div>
        <div class="option-label">{{ GeographyOptions.hilly.label }}</div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue.flat }"
        @click="setFlatGeography"
        :aria-pressed="modelValue.flat"
      >
        <div class="option-icon">{{ GeographyOptions.flat.icon }}</div>
        <div class="option-label">{{ GeographyOptions.flat.label }}</div>
      </button>
    </div>

    <div class="navigation-buttons">
      <button class="btn-prev" @click="$emit('prev')">Back</button>
      <button class="btn-next" @click="$emit('next')" :disabled="!hasSelected">Continue</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GeographyOptions } from '../../constants/assessmentOptions';
import type { Geography } from '../../types';

const props = defineProps<{
  modelValue: Geography;
}>();

const emit = defineEmits(['update:modelValue', 'prev', 'next']);

const hasSelected = computed(() => {
  return props.modelValue.windy || props.modelValue.hilly || props.modelValue.flat;
});

function toggleGeography(type: keyof Geography) {
  const updatedGeography = { ...props.modelValue };
  updatedGeography[type] = !updatedGeography[type];
  emit('update:modelValue', updatedGeography);
}

function toggleHilly() {
  const newHilly = !props.modelValue.hilly;
  const updatedGeography = { ...props.modelValue, hilly: newHilly };
  if (newHilly) {
    updatedGeography.flat = false;
  }
  emit('update:modelValue', updatedGeography);
}

function setFlatGeography() {
  const updatedGeography = { ...props.modelValue, flat: !props.modelValue.flat, hilly: false };
  emit('update:modelValue', updatedGeography);
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;
@use "../../assets/scss/assessment";
</style>
