<template>
  <button class="share-button" @click="share" :class="{ '-copied': showCopied }">
    <img src="/images/icons/share.svg" alt="" class="share-icon">
    <span v-if="showCopied">Copied to clipboard!</span>
    <span v-else>Share Your Result</span>
  </button>
</template>

<script setup lang="ts">
/** Share button that uses the Web Share API with a clipboard fallback. */
import { computed, ref } from 'vue';

const props = defineProps({
  savingsAmount: {
    type: Number,
    default: 0
  }
});

const showCopied = ref(false);

const formattedSavings = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(props.savingsAmount);
});

const shareText = computed(() => {
  return `I found the right bike for me on Find The Right Bike, and could save `
   + `${formattedSavings.value} over five years! Take a look at the bike I got suggested, and ` +
   ` find the right bike for you and get tips for getting started. ${window.location.href}`;
});

async function share() {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({ text: shareText.value, url });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(shareText.value);
    showCopied.value = true;
    setTimeout(() => { showCopied.value = false; }, 2000);
  } catch {
    // Last resort: prompt the user to copy manually
    window.prompt('Copy this text to share:', shareText.value);
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

.share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.7rem 1.4rem;
  background-color: vars.$primary;
  color: vars.$white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: vars.$primary-dark;
  }

  &.-copied {
    background-color: vars.$secondary;
  }
}

.share-icon {
  width: 1rem;
  height: 1rem;
  filter: brightness(0) invert(1);
}
</style>
