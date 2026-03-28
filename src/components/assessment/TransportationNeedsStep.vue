<template>
  <div class="step-container">
    <h2>What Types Of Transportation Needs Do You Have?</h2>
    <p class="subtitle">Select all that apply to your situation</p>

    <div class="options-grid">
      <button
        v-for="(opt, key) in TransportationNeedOptions"
        :key="key"
        type="button"
        class="option-card"
        :class="{ selected: modelValue[key] }"
        @click="toggleNeed(key)"
        :aria-pressed="modelValue[key].toString()"
      >
        <div class="option-icon">
          <template v-if="Array.isArray(opt.icon)">
            <span v-for="(emoji, i) in opt.icon" :key="i" :class="{ 'icon-extra': i > 0 }">{{ emoji }}</span>
          </template>
          <template v-else>{{ opt.icon }}</template>
        </div>
        <div class="option-content">
          <div class="option-label">{{ opt.label }}</div>
          <div class="option-description">{{ opt.description }}</div>
        </div>
      </button>
    </div>

    <div class="navigation-buttons -single-row">
      <button class="btn-next" @click="$emit('next')" :disabled="!hasSelectedAny">
        Continue
        <span class="chevron-right"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TransportationNeedOptions } from '../../constants/assessmentOptions';

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

function toggleNeed(need: string) {
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
    padding: 1.5rem 0.5rem;
    height: 100%;
  }
}

.option-icon {
  flex-shrink: 0;

  .icon-extra {
    margin-left: 0.25rem;
    font-size: 0.95em;
  }
}

.option-description {
  font-size: 0.8rem;
  line-height: 1.3;
}

</style>