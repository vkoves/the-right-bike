<template>
  <div class="maintenance-page">
    <img class="maint-img" src="/images/bike-maintenance.webp" alt="">

    <h1>Maintenance Basics</h1>

    <p class="page-intro">
      Have your bike ready, or about to buy? We've got some info for you on the absolute basics o
      bike maintenance, with some places to go for extra information!
    </p>

    <h2>Do It Yourself Or Go To A Bike Shop?</h2>

    <p>
      The very basics of keeping a bike running are airing up the tires, and keeping the chain
      lubricated with a de-greaser and bike lube. But for repairs or tune-ups, whether it's a flat
      or faulty shifting, you can count on a local bike shop or learn to do it yourself! We're
      going to just cover the very basics. Jump to the very end to find a more in-depth guide for
      DIY-ers.
    </p>

    <p>
      There are also some educational bike shops, like
      <a href="https://www.therecyclery.org" target="_blank" rel="noopener">
        The Recyclery
      </a> or <a href="https://store.workingbikes.org" rel="noopener">Working Bikes</a> in Chicago
      that will let you learn how to fix your own bike, whether through open shop hours, paid
      classes,or volunteering!
    </p>

    <h2>The ABC Bike Check - Air, Brakes, Chain!</h2>

    <p>
      Before every ride, do a quick ABC pre-check - air, brakes, and chain.
    </p>

    <ul>
      <li>
        <strong>A - Air:</strong> Push down on your tire with the palm of your hand, making sure
        it feels nice and firm. You can get a flat by riding too low, so if you're unsure, check
        with an air pump that has a PSI meter (check out our
        <router-link to=".gear-guide">Gear Guide</router-link>).
      </li>
      <li>
        <strong>B - Brakes:</strong> Test your front and rear brakes, squeezing them and making sure
        they grab the wheels and stop smoothly, and that the brakes levers don't have to be pulled
        all the way back to engage.
      </li>
      <li>
        <strong>C - Chain:</strong> Make sure your chain and gears look good, and turn your pedals
        backwards to make sure it's running smoothly. If you hear squeaky or other noise, it's
        probably to degrease and lube your chain! See
        <a href="https://www.nytimes.com/wirecutter/guides/how-to-clean-lube-bike-chain/">
          Wirecutter's Guide On How to Clean and Lube Your Bike Chain
        </a>.
      </li>
    </ul>

    <p>
      <strong>Found an issue!</strong> If it's more than just adding air or lubing your chain, take
      it in to your local bike shop!
    </p>

    <h2>DIY Deep Dive</h2>

    <p>
      There's a lot that can go into bike maintenance if you want to do it yourself - if you do,
      check out this great <a href="https://www.rei.com/learn/expert-advice/bike-maintenance.html"
      target="_blank">Bike Maintenance Basics Guide from REI</a>.
    </p>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use '../assets/scss/variables' as vars;

.maintenance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: vars.$primary;
  margin-bottom: 1rem;
}

.page-intro {
  max-width: 700px;
  font-size: 1.2rem;
  color: vars.$text-secondary;
}

.maint-img {
  float: right;
  max-width: 40%;
  margin: 1.5rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.7)
}

h2, p + p { margin-top: 1rem; }

h2 { margin-bottom: 0.5rem; }

ul {
  margin: 1rem 0rem 1rem 1.5rem;
}

p, ul {
  max-width: 50rem;
}

// Turn into cover image on mobile
@media (max-width: #{vars.$breakpoint-mobile}) {
  .maint-img {
    width: 100vw;
    max-width: none;
    margin: -2rem -2rem -3.5rem -2rem;
    max-height: 10rem;
    object-fit: cover;
    float: none;
    filter: brightness(0.6);
  }

  h1 {
    position: relative;
    z-index: 1;
    color: vars.$white;
    text-shadow: 0.1rem 0.1rem 0.1rem black;
  }
}
</style>
