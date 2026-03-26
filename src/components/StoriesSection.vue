<template>
  <section class="stories-section">
    <div class="stories-content">
      <h2>Need Inspiration?</h2>
      <p class="stories-intro">Read interviews with everyday cyclists who replaced car trips with bikes.</p>
      <a href="https://chiwho.bike" target="_blank" rel="noopener" class="stories-cta">
        Read Their Stories on Chicagoans Who Bike &#8594;
      </a>
    </div>
    <div class="stories-img-row">
      <div class="stories-imgs">
        <a href="https://chiwho.bike/interviews/17" target="_blank" rel="noopener">
          <img src="/images/stories/post17.webp" alt="A man stands in front of an orange long-tail bike with two of his kids sitting on the bike, on an autumn day">
        </a>
        <a href="https://chiwho.bike/interviews/12" target="_blank" rel="noopener">
          <img src="/images/stories/post12.webp" alt="A man stands smiling in a park holding his bike, wearing a grey shirt that says Bike City">
        </a>
        <a href="https://chiwho.bike/interviews/18" target="_blank" rel="noopener">
          <img src="/images/stories/post18.webp" alt="An older man stands smiling with his black ebike in front of Chicago's 606 trail">
        </a>
        <a href="https://chiwho.bike/interviews/15" target="_blank" rel="noopener">
          <img src="/images/stories/post15.webp" alt="A woman stands smiling looking down at her two young children in a bucket cargo bike in a downtown plaza">
        </a>
      </div>
      <div class="banner-blue"></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

$chicago-blue: #41B6E6;

.stories-section {
  background-color: vars.$white;
  padding: 4rem 0 3rem;
  text-align: center;

  h2 {
    color: vars.$dark;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    text-decoration: underline;
    text-decoration-color: $chicago-blue;
    text-decoration-thickness: 0.25rem;
    text-underline-offset: 0.3rem;
  }
}

.stories-content {
  padding: 0 2rem;
}

.stories-intro {
  color: vars.$text-secondary;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.stories-cta {
  display: inline-block;
  margin-bottom: 2.5rem;
  padding: 0.75rem 2rem;
  background-color: vars.$secondary-accessible;
  color: vars.$white;
  border-radius: vars.$border-radius-lg;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
}

.stories-img-row {
  position: relative;
  padding-bottom: 4rem;
  isolation: isolate;
}

.stories-imgs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  overflow: hidden;

  a {
    display: contents;
  }

  img {
    width: auto;
    height: 18.75rem;
    border-radius: 1rem;
    object-fit: cover;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
  }
}

.banner-blue {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30%;
  background-color: $chicago-blue;
  z-index: -1;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .stories-section {
    padding: 2.5rem 0 2rem;

    h2 { font-size: 1.5rem; }
  }

  .stories-content {
    padding: 0 1rem;
  }

  .stories-img-row { padding-bottom: 2rem; }

  .stories-imgs img {
    height: 9rem;
    border-radius: 0.5rem;
  }
}
</style>
