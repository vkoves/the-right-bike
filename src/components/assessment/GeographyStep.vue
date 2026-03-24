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
        :aria-pressed="modelValue.windy.toString()"
      >
        <div class="option-icon">🌬️</div>
        <div class="option-label">Windy</div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: modelValue.hilly }"
        @click="toggleGeography('hilly')"
        :aria-pressed="modelValue.hilly.toString()"
      >
        <div class="option-icon">⛰️</div>
        <div class="option-label">Hilly</div>
      </button>

      <button
        type="button"
        class="option-card"
        :class="{ selected: !modelValue.hilly }"
        @click="setFlatGeography"
        :aria-pressed="(!modelValue.hilly).toString()"
      >
        <div class="option-icon">📏</div>
        <div class="option-label">Mostly Flat</div>
      </button>
    </div>

    <div class="navigation-buttons">
      <button class="btn-prev" @click="$emit('prev')">Back</button>
      <button class="btn-next" @click="$emit('next')">Continue</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'prev', 'next']);

function toggleGeography(type) {
  // Create a new object to maintain reactivity
  const updatedGeography = { ...props.modelValue };
  // Toggle the value of the specified geography type
  updatedGeography[type] = !updatedGeography[type];
  // Emit the update event with the new object
  emit('update:modelValue', updatedGeography);

}

function setFlatGeography() {
  const updatedGeography = { ...props.modelValue, hilly: false };
  emit('update:modelValue', updatedGeography);
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;
@use "../../assets/scss/assessment";
</style>