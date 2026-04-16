# Find The Right Bike

[![Netlify Status](https://api.netlify.com/api/v1/badges/7da8135b-611a-4c73-84ef-82ecc92810a6/deploy-status)](https://app.netlify.com/projects/therightbike/deploys)

A web app that helps people figure out if a bike could replace some of their car trips — and how much they could save if it did.

## Features

- **Hero + 3-question assessment** — guides users through their transportation needs, geography, and fitness level to recommend a bike type
- **Bike recommendation** — displays a matched bike type with description, features, and typical price range
- **5-year cost savings** — compares bike ownership costs vs. a car, with a savings breakdown and "what else you could do with this money" callouts
- **Car FAQ** — addresses common concerns about occasional car needs (car share, rentals, etc.)
- **Buying options** — budget / mid-range / premium model suggestions with images and review links for the recommended bike type
- **Bike comparison** — lets users explore savings for other bike types side-by-side
- **Bike gallery** — homepage grid of all bike types linking directly to their savings page
- **Stories section** — links to [Chicagoans Who Bike](https://chiwho.bike) with real cyclist interview photos

## Tech Stack

- **Vue 3** with `<script setup>` and **TypeScript**
- **Vite** for dev server and builds
- **Vitest** for unit tests
- **SCSS** for styling

## Development

### Prerequisites

- Node.js 22 (use `nvm use` to pick up the `.nvmrc`)
- yarn

### Installation

```bash
yarn install
```

### Development Server with Hot Reload

```bash
yarn dev
```

### Build for Production

```bash
yarn build
```

Note: Vite does **not** type-check during build — it only transpiles TypeScript. Run
`yarn typecheck` to catch type errors, or add it to CI.

The build runs `vite build` followed by `scripts/prerender-og.js`, which generates
static HTML files at `dist/bike/:type/index.html` for each bike type. These contain
per-bike Open Graph meta tags and social images so that social crawlers see the correct
preview when a bike result page is shared.

### Deployment (Netlify)

The site deploys on Netlify with `yarn build` as the build command and `dist` as the
publish directory. The `public/_redirects` file routes `/bike/:type` to the prerendered
HTML (for social crawlers) and falls back to the SPA `index.html` for all other routes.

### Generating Social Images

Social card images (for Open Graph / Twitter) are generated via Puppeteer screenshots of
dedicated social image routes. The dev server must be running first.

```bash
yarn dev                    # start the dev server
yarn screenshot-social      # in another terminal — generates all images
yarn screenshot-social gear-guide  # just one image by slug
```

This screenshots `/social-image` (the default card), `/social-image/:type` for each bike
type, and `/social-image/page/:slug` for supplementary pages, saving PNGs to
`public/images/`. Pass a slug argument to regenerate a single image. Visit `/admin` locally
to preview all social card pages.

## Testing

### Unit Tests

Unit tests use **Vitest** and cover services and utilities:

```bash
yarn test            # watch mode
yarn vitest run      # single run
```

### E2E Tests

End-to-end tests use **CodeceptJS** with **Playwright** (headless Chromium). They require the dev server to be running:

```bash
yarn dev                  # start the dev server in one terminal
yarn test:e2e             # run E2E tests headless
yarn test:e2e:ui          # run with a visible browser (useful for debugging)
yarn test:e2e:visual      # run only visual regression tests headless

# Run a single test by matching its scenario name
HEADLESS=true npx codeceptjs run --steps --grep "Regular Bicycle"
```

The E2E suite covers the most common assessment flows (regular bike, commuter eBike, cargo eBike, longtail eBike, and cargo eTrike).

E2E tests also run in CI on every push and PR. To skip them, add `[skip-e2e]` to your
commit message. You can also trigger them manually from the **Actions** tab on GitHub.

### Visual Regression Tests

Visual tests use [codeceptjs-visual-testing](https://github.com/Watercycle/codeceptjs-visual-testing)
to compare screenshots against committed baselines. They run as part of the E2E suite.

To update baselines after intentional UI changes:

```bash
yarn test:e2e:visual-update
```

Review the updated images in `tests/e2e/visual-baselines/` and commit them.

## Project Structure

```
src/
  types/
    index.ts              # Shared TypeScript interfaces and types
  components/
    assessment/           # Multi-step assessment + results components
    HomePage.vue
    StoriesSection.vue
    Header.vue
    AboutPage.vue
  constants/
    bikeTypes.ts          # Bike type metadata (single source of truth)
    bikeCosts.ts          # Cost data for savings calculations
    bike-recommendations.ts  # Budget/mid/premium model suggestions per bike type
    assessmentOptions.ts  # Labels/icons for assessment step options
  services/
    BikeModelRecommender.ts  # Bike type + model recommendation engine
  assets/scss/            # Global styles and variables
public/
  images/
    bikes/          # Homepage carousel images
    bike-models/    # Product images for buying options (locally hosted WebP)
    stories/        # Interview photos from chiwho.bike
    icons/          # SVG icons
```
