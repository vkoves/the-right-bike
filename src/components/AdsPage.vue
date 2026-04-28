<template>
  <div class="ads-page">
    <h1>Ads</h1>

    <section v-for="ad in Ads" :key="ad.slug" class="ad-preview">
      <div class="ad-meta">
        <h2><router-link :to="`/ads/${ad.slug}`">{{ ad.name }}</router-link></h2>
        <p><code>{{ ad.width }} &times; {{ ad.height }}px</code></p>
        <AdDownloadButton :target="adRefs[ad.slug]" :filename="adFilename(ad)" />
      </div>
      <div class="ad-frame">
        <div :ref="el => setAdRef(ad.slug, el)">
          <component :is="ad.component" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Index page for ad previews at /ads. Shows each ad at native size with a download button.
 */
import { ref } from 'vue'
import AdDownloadButton from './AdDownloadButton.vue'
import { Ads, adFilename } from '../constants/ads'

const adRefs = ref<Record<string, HTMLElement | null>>({})

function setAdRef(slug: string, el: unknown) {
  adRefs.value[slug] = (el as HTMLElement | null)?.querySelector<HTMLElement>('.social-image') ?? null
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.ads-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: vars.$primary;
  margin-bottom: 1.5rem;
}

.ad-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h2 {
  font-size: 1.25rem;
  color: vars.$primary;
}

.ad-meta {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.ad-frame {
  overflow-x: auto;
}
</style>
