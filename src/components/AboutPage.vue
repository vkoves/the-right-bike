<template>
  <div class="about-container">
    <h1>About The Right Bike</h1>

    <section class="about-section -two-cols">
      <div>
        <h2>Our Mission</h2>
        <p>
          At The Right Bike, we're passionate about helping people discover the benefits of cycling
          as a sustainable, healthy, and cost-effective transportation alternative. Our mission is to
          provide tools and information that make it easy for anyone to evaluate whether a bicycle
          could replace some or all of their car trips.
        </p>
      </div>

      <div class="viktor-bio">
        <img src="https://viktorkoves.com/images/headshot-bike.webp" width="200"
          alt="Photo of Viktor Köves on his White Gazelle ebike, riding down Chicago's Lakefront trail
            past a tennis court, wearing shorts, a t-shirt and sunglasses">
        <p>
          The Right Bike is created by Viktor Köves, who also created
          <a href="https://chiwho.bike">Chicagoans Who Bike</a>, a multi-media project interviewing
          people who bike around Chicago.
        </p>
      </div>
    </section>

    <section class="about-section">
      <h2>Why Cycling?</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <h3>Financial Savings</h3>
          <p>Save thousands annually on fuel, car payments, insurance, maintenance, and parking fees.</p>
        </div>
        <div class="benefit-card">
          <h3>Health Benefits</h3>
          <p>Incorporate physical activity into your daily routine, improving cardiovascular health and mental wellbeing.</p>
        </div>
        <div class="benefit-card">
          <h3>Environmental Impact</h3>
          <p>Reduce your carbon footprint and contribute to cleaner air in your community.</p>
        </div>
        <div class="benefit-card">
          <h3>Community Connection</h3>
          <p>Experience your neighborhood at a human pace and connect more with your local community.</p>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2>How Our Calculator Works</h2>
      <p>Our calculator takes into account your specific transportation needs, local conditions, and personal preferences to help you understand:</p>

      <ul>
        <li>Which trips you currently make by car could reasonably be replaced by bicycle</li>
        <li>What type of bicycle might best suit your needs</li>
        <li>How much money you could save over time</li>
        <li>The environmental impact of making this switch</li>
        <li>Health benefits you might experience</li>
      </ul>
    </section>

    <section class="about-section contact">
      <h2>Contact Us</h2>

      <p>
        Have questions or feedback? We'd love to hear from you!
        <a href="https://github.com/vkoves/the-right-bike/issues" target="_blank" rel="noopener noreferrer">Create an issue on GitHub</a>.
      </p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '../assets/scss/variables' as vars;

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: vars.$primary;
  margin-bottom: 2rem;
}

.about-section {
  margin-bottom: 3rem;

  &.-two-cols {
    display: flex;
    gap: 2rem;
  }

  .viktor-bio {
    flex-basis: 35rem;
    flex-shrink: 0;
    background-color: vars.$lighter-gray;
    display: flex;
    align-items: center;
    margin-top: 1rem;
    gap: 2rem;
    padding: 1rem;
    border-radius: 0.5rem;

    img {
      border-radius: 0.5rem;
    }
    p { max-width: 20rem; }
  }
}

h2 {
  color: vars.$primary;
  margin-bottom: 1rem;
  border-bottom: 2px solid vars.$bg-bike-type;
  padding-bottom: 0.5rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.benefit-card {
  background-color: vars.$bg-body;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: vars.$primary;
    margin-bottom: 0.75rem;
  }
}

.bike-types {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.bike-type {
  background-color: vars.$bg-bike-type;
  border-radius: 8px;
  padding: 1.5rem;

  h3 {
    color: vars.$primary;
    margin-bottom: 0.75rem;
  }
}

ul {
  list-style-position: inside;
  margin-left: 1rem;
  margin-top: 1rem;
}

li {
  margin-bottom: 0.5rem;
}

.contact {
  text-align: center;
  background-color: vars.$bg-body;
  padding: 2rem;
  border-radius: 8px;

  a {
    color: vars.$primary;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .-two-cols {
    flex-direction: column;
  }

  .viktor-bio {
    flex-direction: column;
    flex-basis: auto;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>