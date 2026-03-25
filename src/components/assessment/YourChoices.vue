<template>
  <div class="your-choices">
    <button class="your-choices-toggle" @click="expanded = !expanded" :aria-expanded="expanded">
      Your Choices
      <span class="your-choices-arrow" :class="{ '-expanded': expanded }">&#9660;</span>
    </button>
    <div v-show="expanded" class="your-choices-body">
      <p>
        Click Any Option To Change It!
      </p>
      <div class="your-choices-pills">
        <div v-for="group in choices" :key="group.category" class="choice-group">
          <span class="group-label">{{ group.category }}:</span>
          <button
            v-for="(pill, i) in group.pills"
            :key="i"
            class="choice-pill"
            @click="$emit('edit', group.step)"
          >
            <span class="pill-icon">{{ pill.icon }}</span>
            <span class="pill-label">{{ pill.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ChoiceGroup } from '../../types';

defineProps<{
  choices: ChoiceGroup[];
}>();

defineEmits(['edit']);

const expanded = ref(false);
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

.your-choices {
  width: fit-content;
  max-width: 100%;
  margin-bottom: 1.5rem;
  border: 1px solid vars.$border-gray;
  border-radius: vars.$border-radius-sm;
  overflow: hidden;
}

.your-choices-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background-color: vars.$lightest-gray;
  border: none;
  font-weight: 600;
  font-size: 0.75rem;
  color: vars.$text-secondary;
  font-family: inherit;

  &:hover {
    background-color: vars.$lighter-gray;
  }
}

.your-choices-arrow {
  font-size: 0.6rem;
  transition: transform 0.2s ease;

  &.-expanded {
    transform: rotate(180deg);
  }
}

.your-choices-body p {
  font-size: 0.8125rem;
  text-align: left;
  margin: 0.5rem 1rem;
  font-weight: 600;
  color: vars.$light-gray;
}

.your-choices-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.choice-group {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.group-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: vars.$text-secondary;
  white-space: nowrap;
}

.choice-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background-color: vars.$primary-lighter;
  color: vars.$primary-dark;
  border: 1px solid transparent;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background-color: vars.$lighter-gray;
    border-color: vars.$border-gray;
  }
}

.pill-icon {
  font-size: 0.9rem;
}
</style>
