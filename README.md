# The Right Bike

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

## Development

### Prerequisites

- Node.js (v16 or newer)
- npm

### Installation

```bash
npm install
```

### Development Server with Hot Reload

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Project Structure

```
src/
  components/
    assessment/     # Multi-step assessment + results components
    HomePage.vue
    StoriesSection.vue
    Header.vue
    AboutPage.vue
  constants/
    bikeTypes.js          # Bike type metadata (single source of truth)
    bikeCosts.js          # Cost data for savings calculations
    bike-recommendations.js  # Budget/mid/premium model suggestions per bike type
  assets/scss/      # Global styles and variables
public/
  images/
    bikes/          # Homepage carousel images
    bike-models/    # Product images for buying options (locally hosted WebP)
    stories/        # Interview photos from chiwho.bike
    icons/          # SVG icons
```
