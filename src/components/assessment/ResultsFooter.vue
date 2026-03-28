<template>
  <div class="results-footer">
    <button class="btn-restart" @click="$emit('restart')">
      <img src="/images/icons/refresh.svg" alt="" class="icon">
      Start Over
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(['restart']);
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../assets/scss/variables' as vars;
@use "../../assets/scss/assessment";

button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

img {
  height: 1.125em;
  width: 1.125em;
}
</style>