<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="not-found-icon">🚲💨</div>
      <h1>404</h1>
      <p class="not-found-message">This page has cycled off into the sunset.</p>
      <router-link to="/" class="btn-home">Back to Home</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: vars.$spacing-xl;
  text-align: center;
}

.not-found-content {
  max-width: 480px;
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: vars.$spacing-md;
}

h1 {
  font-size: 5rem;
  color: vars.$dark;
  margin: 0 0 vars.$spacing-sm;
  line-height: 1;
}

.not-found-message {
  font-size: 1.25rem;
  color: vars.$text-secondary;
  font-weight: 600;
  margin-bottom: vars.$spacing-xl;
}

.btn-home {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: vars.$primary;
  color: vars.$white;
  text-decoration: none;
  border-radius: vars.$border-radius-lg;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: vars.$primary-dark;
  }
}
</style>
