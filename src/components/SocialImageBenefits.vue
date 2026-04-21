<script setup lang="ts">
/**
 * Four benefit pills (Save Thousands, Reduce Emissions, Get Back Time, Improve Your Health)
 * styled for use in social image components.
 */
</script>

<template>
  <div class="benefits-summary">
    <div class="benefit-item">
      <div class="benefit-icon">💰</div>
      <div>Save Thousands</div>
    </div>
    <div class="benefit-item">
      <div class="benefit-icon">🌍</div>
      <div>Reduce Emissions</div>
    </div>
    <div class="benefit-item">
      <div class="benefit-icon">⏱️</div>
      <div>Get Back Time</div>
    </div>
    <div class="benefit-item">
      <div class="benefit-icon">❤️</div>
      <div>Improve Your Health</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.benefits-summary {
  gap: 1rem 0.5rem;
}

.benefit-item {
  background-color: rgba(255, 255, 255, 0.18);
  color: vars.$white;
  font-weight: 700;
  box-shadow: none;
  font-size: 1.25rem;
}
</style>
