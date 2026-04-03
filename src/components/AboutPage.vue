<template>
  <div class="about-container">
    <h1>About Us</h1>

    <section class="about-section -two-cols">
      <div>
        <h2>Our Mission</h2>
        <p>
          Find The Right Bike is built to help people discover the benefits of biking as a
          sustainable, healthy, and cost-effective transportation alternative. We wanted to build
          a third-party tool, unaffiliated with any brand, to make it easy for anyone to
          what type of bike is right for them, and some potential purchase options!
        </p>
      </div>

      <div class="viktor-bio">
        <img src="https://viktorkoves.com/images/headshot-bike.webp" width="200"
          alt="Photo of Viktor Köves on his White Gazelle ebike, riding down Chicago's Lakefront trail
            past a tennis court, wearing shorts, a t-shirt and sunglasses">
        <p>
          Find The Right Bike is created by Viktor Köves, who also created
          <a href="https://chiwho.bike" target="_blank" rel="noopener">Chicagoans Who Bike</a>,
          a photo and video project interviewing people who bike around Chicago.
        </p>
      </div>
    </section>

    <section class="about-section contact">
      <h2>Contact Us</h2>

      <p>
        Have questions or feedback? We'd love to hear from you!
        <a href="https://github.com/vkoves/the-right-bike/issues" target="_blank" rel="noopener">Create an issue on GitHub</a>.
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
}

@media (max-width: #{vars.$breakpoint-mobile}) {
  .-two-cols {
    flex-direction: column;
  }

  .about-section .viktor-bio {
    flex-direction: column;
    flex-basis: auto;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>