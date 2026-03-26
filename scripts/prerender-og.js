/**
 * Post-build script that generates per-bike HTML files with correct OG meta tags.
 *
 * For each bike type, copies dist/index.html to dist/bike/:type/index.html with
 * the OG title, description, and image replaced. This lets social crawlers see
 * the right preview without needing SSR.
 *
 * Run automatically via: yarn build
 */
const fs = require('fs');
const path = require('path');
const { bikeTypes } = require('./bike-types');

const DIST = path.join(__dirname, '..', 'dist');
const BASE_URL = 'https://findtheright.bike';

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

for (const [slug, bike] of Object.entries(bikeTypes)) {
  const ogTitle = `Your Perfect Bike: ${bike.title}`;
  const ogDesc = `See how much you could save with a ${bike.title}. Find the right bike to replace some car trips!`;
  const ogImage = `${BASE_URL}/images/social-${slug}.png`;
  const ogUrl = `${BASE_URL}/bike/${slug}`;

  const html = template
    .replace(/<title>[^<]*<\/title>/,
      `<title>${ogTitle} - Find The Right Bike</title>`)
    .replace(/<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${ogTitle}" />`)
    .replace(/<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${ogDesc}" />`)
    .replace(/<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${ogUrl}" />`)
    .replace(/<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${ogImage}"`)
    .replace(/<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${ogTitle}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${ogDesc}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${ogImage}" />`);

  const dir = path.join(DIST, 'bike', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Generated ${path.relative(DIST, dir)}/index.html`);
}
