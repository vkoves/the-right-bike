<template>
  <button
    class="anchor-copy-btn"
    :class="{ '-copied': showCopied }"
    @click="copyAnchorLink"
    :title="showCopied ? 'Copied!' : 'Copy link to this section'"
  >
    <span class="anchor-copy-icon" aria-hidden="true"></span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  anchor: { type: String, required: true }
});

const showCopied = ref(false);

async function copyAnchorLink() {
  const url = window.location.origin + window.location.pathname + '#' + props.anchor;
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
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  vertical-align: middle;
  opacity: 0.4;
  transition: opacity 0.2s;

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
</style>
