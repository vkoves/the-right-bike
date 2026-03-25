<template>
  <a
    class="tier-card"
    :class="tier"
    :href="bike.review"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="tier-badge">{{ tierLabel }}</div>
    <div class="tier-image" :class="{ '-no-image': !bike.image }">
      <img
        v-if="bike.image"
        :src="bike.image"
        :alt="bike.model"
        @error="(e: Event) => (e.target as HTMLElement).closest('.tier-image')?.classList.add('-no-image')"
      >
    </div>
    <div class="tier-body">
      <h4>{{ bike.model }}</h4>
      <div class="tier-price">{{ bike.price }}</div>
      <span class="tier-cta">Read Review &#8594;</span>
    </div>
  </a>
</template>

<script setup lang="ts">
const TierLabels: Record<string, string> = {
  budget: 'Budget',
  midrange: 'Mid-Range',
  premium: 'Premium'
};

const props = defineProps({
  bike: { type: Object, required: true },
  tier: { type: String, required: true }
});

const tierLabel = TierLabels[props.tier] || props.tier;
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as vars;

$tier-premium: #7a5200;
$tier-premium-bg: #fef9ec;

.tier-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 300px;
  background-color: vars.$white;
  border-radius: vars.$border-radius;
  box-shadow: vars.$shadow-md;
  overflow: hidden;
  text-decoration: none;
  border: 2px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: vars.$shadow-lg;

    .tier-cta { text-decoration: underline; }
  }

  &.budget   { border-top: 4px solid vars.$primary; }
  &.midrange { border-top: 4px solid vars.$secondary; }
  &.premium  { border-top: 4px solid $tier-premium; }
}

.tier-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.35rem 0.75rem;
  text-align: left;

  .budget   & { color: vars.$primary-dark; background-color: vars.$primary-lighter; }
  .midrange & { color: vars.$secondary-dark; background-color: vars.$secondary-light; }
  .premium  & { color: $tier-premium; background-color: $tier-premium-bg; }
}

.tier-image {
  background-color: vars.$white;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0.75rem;
  }

  &.-no-image {
    &::after {
      content: '🚲';
      font-size: 3rem;
      opacity: 0.3;
    }
    img { display: none; }
  }
}

.tier-body {
  padding: 1rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;

  h4 {
    color: vars.$dark;
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
  }
}

.tier-price {
  color: vars.$text-secondary;
  font-size: 0.9rem;
  font-weight: 600;
}

.tier-cta {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;

  .budget   & { color: vars.$primary; }
  .midrange & { color: vars.$secondary-dark; }
  .premium  & { color: $tier-premium; }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .tier-card {
    max-width: 100%;
    flex-direction: row;
    border-top: none;
    border-left: 4px solid transparent;

    &.budget   { border-left-color: vars.$primary; }
    &.midrange { border-left-color: vars.$secondary; }
    &.premium  { border-left-color: $tier-premium; }
  }

  .tier-badge {
    display: none;
  }

  .tier-image {
    width: 110px;
    min-width: 110px;
    height: auto;
    min-height: 110px;
    flex-shrink: 0;
  }

  .tier-body {
    padding: 0.75rem;
  }
}
</style>
