<template>
  <button class="download-btn" :disabled="loading" @click="download">
    {{ loading ? 'Generating…' : 'Download PNG' }}
  </button>
</template>

<script setup lang="ts">
/**
 * Button that captures a target element with html2canvas and downloads it as a PNG.
 *
 * @prop target   - The HTMLElement to capture (no-op if null).
 * @prop filename - Output filename, e.g. "square-ad.png".
 */
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps<{
  target: HTMLElement | null
  filename: string
}>()

const loading = ref(false)

async function download() {
  if (!props.target) return
  loading.value = true
  try {
    const canvas = await html2canvas(props.target, {
      scale: 1,
      useCORS: true,
      // Pin the clone to 0,0 so html2canvas doesn't pick up the element's
      // page offset, which would cause a sub-pixel white border on capture.
      onclone: (_doc: Document, el: HTMLElement) => {
        el.style.position = 'fixed'
        el.style.top = '0'
        el.style.left = '0'
      }
    })
    const link = document.createElement('a')
    link.download = props.filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.download-btn {
  font-size: 1rem;
  padding: 0.5rem 1.25rem;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
}
</style>
