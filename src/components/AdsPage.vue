<template>
  <div class="ads-page">
    <h1>Ads</h1>

    <section class="ad-preview">
      <div class="ad-meta">
        <h2><router-link to="/ads/square">Square Ad</router-link></h2>
        <p><code>1000 &times; 800px</code></p>
      </div>
      <div class="ad-frame">
        <AdSquare />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AdSquare from './AdSquare.vue'
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
