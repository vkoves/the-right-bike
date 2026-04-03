<template>
  <button
    class="anchor-copy-btn"
    :class="{ '-copied': showCopied }"
    @click="copyAnchorLink"
    >
    <span class="anchor-copy-icon" aria-hidden="true"></span>
    <span :class="{ '-show': showCopied }" class="copied-text">Copied!</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  anchor: { type: String, required: true }
});

const showCopied = ref(false);

async function copyAnchorLink() {
  const url = window.location.origin + window.location.pathname + window.location.search + '#' + props.anchor;
  try {
    await navigator.clipboard.writeText(url);
    showCopied.value = true;
    setTimeout(() => { showCopied.value = false; }, 2000);
  } catch {
    window.prompt('Copy this link:', url);
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.anchor-copy-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  vertical-align: middle;
  opacity: 0.8;
  transition: opacity 0.2s;
  line-height: 1;

  &:hover,
  &.-copied {
    opacity: 1;
  }
}

.anchor-copy-icon {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  background-color: vars.$primary;
  mask: url('/images/icons/share.svg') no-repeat center / contain;
  -webkit-mask: url('/images/icons/share.svg') no-repeat center / contain;
}

.copied-text {
  background: vars.$dark;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem;
  position: absolute;
  border-radius: 5px;
  top: 110%;
  left: -70%;
  width: fit-content;
  opacity: 0;
  transition: opacity 0.3s;

  &.-show { opacity: 1; }
}
</style>
