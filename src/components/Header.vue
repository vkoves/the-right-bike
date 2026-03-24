<template>
  <header class="site-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <img src="/images/icons/favicon.svg" alt="" class="logo-icon">
          Find The Right Bike
        </router-link>
      </div>
      <nav>
        <ul>
          <li class="hide-mobile"><router-link to="/">Home</router-link></li>
          <li class="hide-mobile">
            <router-link to="/assessment" @click.prevent="goToAssessment">Bike Finder</router-link>
          </li>
          <li class="hide-mobile"><router-link to="/gear-guide">Gear Guide</router-link></li>
          <li><router-link to="/about">About</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToAssessment() {
  router.push({ path: '/assessment', query: { _r: Date.now() } });
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../assets/scss/variables' as vars;

.site-header {
  background-color: vars.$primary;
  color: vars.$white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  color: vars.$white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border: 2px solid vars.$white;
  border-radius: 7px;
  box-shadow: vars.$shadow-md;
  margin-right: 0.5rem;
}

nav {
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-left: 2rem;
  }

  a {
    text-decoration: none;
    transition: opacity 0.3s;
    font-weight: 600;
    color: vars.$lightest-gray;

    &:hover {
      color: vars.$white;
    }

    &.router-link-active {
      font-weight: 700;
      border-bottom: 2px solid vars.$white;
    }

    &:focus-visible {
      outline-color: vars.$white;
    }
  }
}

.logo a:focus-visible {
  outline-color: vars.$white;
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .site-header {
    padding: 0.75rem 0.5rem;
  }

  .header-container {
    padding: 0 1rem;
  }

  .logo a {
    font-size: 1.1rem;
  }

  .hide-mobile {
    display: none;
  }
}
</style>