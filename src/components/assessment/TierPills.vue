<template>
  <div v-if="hasPills" class="tier-pills">
    <span v-if="electric" class="tier-pill -electric"><span class="tier-pill-emoji emoji-shadow">⚡</span><span class="tier-pill-text">Electric</span></span>
    <span v-if="bike.singleSpeed" class="tier-pill"><span class="tier-pill-emoji emoji-shadow">⚙️</span><span class="tier-pill-text">Single Speed</span></span>
    <span v-if="bike.lightweight" class="tier-pill"><span class="tier-pill-emoji emoji-shadow">🪶</span><span class="tier-pill-text">Lightweight</span></span>
    <span v-if="bike.trike" class="tier-pill"><span class="tier-pill-emoji emoji-shadow">🛞</span><span class="tier-pill-text">Trike</span></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  bike: { type: Object, required: true },
  electric: { type: Boolean, default: false }
});

const hasPills = computed(() =>
  props.electric || props.bike.singleSpeed || props.bike.lightweight || props.bike.trike
);
</script>
