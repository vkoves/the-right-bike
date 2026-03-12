<template>
  <div class="step-container">
    <h2>What Types Of Transportation Needs Do You Have?</h2>
    <p class="subtitle">Select all that apply to your situation</p>

    <div class="options-grid">
      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue.soloCommuting }"
        @click="toggleNeed('soloCommuting')"
        :aria-pressed="modelValue.soloCommuting.toString()"
      >
        <div class="option-icon">🚴</div>
        <div class="option-content">
          <div class="option-label">Solo Commuting</div>
          <div class="option-description">Daily commuting or exercise</div>
        </div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue.cargo }"
        @click="toggleNeed('cargo')"
        :aria-pressed="modelValue.cargo.toString()"
      >
        <div class="option-icon">📦</div>
        <div class="option-content">
          <div class="option-label">Cargo</div>
          <div class="option-description">Carrying groceries or goods</div>
        </div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue.transportingKids }"
        @click="toggleNeed('transportingKids')"
        :aria-pressed="modelValue.transportingKids.toString()"
      >
        <div class="option-icon">👶</div>
        <div class="option-content">
          <div class="option-label">Transporting Kids</div>
          <div class="option-description">Taking children to school or activities</div>
        </div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue.transportingAdults }"
        @click="toggleNeed('transportingAdults')"
        :aria-pressed="modelValue.transportingAdults.toString()"
      >
        <div class="option-icon">👩</div>
        <div class="option-content">
          <div class="option-label">Transporting Adults</div>
          <div class="option-description">Carrying adult passengers</div>
        </div>
      </button>

    </div>

    <div class="navigation-buttons">
      <button class="btn-next" @click="$emit('next')" :disabled="!hasSelectedAny">Continue</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'next']);

const hasSelectedAny = computed(() => {
  return Object.values(props.modelValue).some(value => value);
});

function toggleNeed(need) {
  // Create a new object to maintain reactivity
  const updatedNeeds = { ...props.modelValue };
  // Toggle the value of the specified need
  updatedNeeds[need] = !updatedNeeds[need];
  // Emit the update event with the new object
  emit('update:modelValue', updatedNeeds);

}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '../../assets/scss/variables' as vars;
@use "../../assets/scss/assessment";

@media (min-width: #{vars.$breakpoint-mobile-up}) {
  .option-card {
    padding: 1.5rem 1rem;
    height: 100%;
  }
}

.option-icon {
  flex-shrink: 0;
}

.option-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  gap: 0.25rem;
  width: 100%;
}

.option-description {
  font-size: 0.8rem;
  line-height: 1.3;
}

</style>