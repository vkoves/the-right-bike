<template>
  <header class="site-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/" aria-hidden="true" tabindex="-1">
          <img src="/images/icons/favicon.svg" alt="" class="logo-icon">
        </router-link>
        <div class="logo-text-group">
          <router-link to="/" class="logo-title">Find The Right Bike</router-link>
          <span class="logo-byline">By <a href="https://chiwho.bike" target="_blank" rel="noopener" class="byline-link">Chicagoans Who Bike</a></span>
        </div>
      </div>
      <nav class="desktop-nav">
        <ul>
          <li v-for="link in NavLinks" :key="link.to">
            <router-link :to="link.to" @click.prevent="handleNavClick(link)">{{ link.label }}</router-link>
          </li>
        </ul>
      </nav>
      <button class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
        <img src="/images/icons/menu.svg" alt="" class="menu-icon">
      </button>
    </div>
    <nav class="mobile-nav" :class="{ '-open': mobileMenuOpen }">
      <ul>
        <li v-for="link in NavLinks" :key="link.to">
          <router-link :to="link.to" @click.prevent="handleNavClick(link); mobileMenuOpen = false">{{ link.label }}</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const mobileMenuOpen = ref(false);

/** Shared desktop mobile nav links */
const NavLinks = [
  { to: '/assessment', label: 'Bike Finder' },
  { to: '/gear-guide', label: 'Gear Guide' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/storage', label: 'Storage' },
  { to: '/shops', label: 'Bike Shops' },
  { to: '/about', label: 'About' },
];

function handleNavClick(link: { to: string; label: string }) {
  if (link.to === '/assessment') {
    // If already on /assessment, force a reset via query param since the path
    // doesn't change. For /bike/:type the path change triggers a remount.
    if (route.name === 'Assessment') {
      router.push({ name: 'Assessment', query: { _r: '1' } });
    } else {
      router.push({ name: 'Assessment' });
    }
  } else {
    router.push(link.to);
  }
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
  height: 5rem;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo > a {
  display: flex;
  align-items: center;
}

.logo-text-group {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-title {
  color: vars.$white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}

.logo-byline {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.byline-link {
  font-family: 'Big Shoulders Display', sans-serif;
  font-weight: 800;
  font-size: 0.85rem;
  color: vars.$white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border: 2px solid vars.$white;
  border-radius: 7px;
  box-shadow: vars.$shadow-md;
}

.desktop-nav {
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
    color: vars.$white;

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

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
  filter: brightness(0) invert(1);
}

.mobile-nav {
  display: none;
}

.logo a:focus-visible {
  outline-color: vars.$white;
}

@media (max-width: #{vars.$breakpoint-tablet}) {
  .site-header {
    padding: 0.75rem 0.5rem;
    height: auto;
  }

  .header-container {
    padding: 0 1rem;
  }

  .logo-title {
    font-size: 1.1rem;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .mobile-nav {
    display: block;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;

    &.-open {
      max-height: 300px;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0.5rem 1rem 0;
    }

    li {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    a {
      display: block;
      padding: 0.75rem 0;
      color: vars.$white;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        color: vars.$white;
      }

      &.router-link-active {
        color: vars.$white;
        font-weight: 700;
      }

      &:focus-visible {
        outline-color: vars.$white;
      }
    }
  }
}
</style>