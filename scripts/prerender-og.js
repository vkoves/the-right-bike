/**
 * Post-build script that generates per-page HTML files with correct meta tags.
 *
 * - For each bike type, copies dist/index.html to dist/bike/:type/index.html
 *   with the title, description, OG, and Twitter meta replaced.
 * - For supplementary pages (About, Gear Guide, Maintenance), generates
 *   index.html files with page-specific titles and descriptions.
 *
 * This lets social crawlers see the right preview without needing SSR.
 *
 * Run automatically via: yarn build
 */
const fs = require('fs');
const path = require('path');
const { bikeTypes } = require('./bike-types');
const { siteName, pages: pageMeta } = require('../src/constants/pageMeta.json');

const DIST = path.join(__dirname, '..', 'dist');
const BASE_URL = 'https://findtheright.bike';

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

/**
 * Replace all meta tags (title, description, OG, Twitter) in the template HTML.
 */
function renderMeta(html, { title, description, url, image }) {
  return html
    .replace(/<title>[^<]*<\/title>/,
      `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/,
      `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${image}"`)
    .replace(/<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${description}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${image}" />`);
}

// --- Bike type pages ---

for (const [slug, bike] of Object.entries(bikeTypes)) {
  const title = `Your Perfect Bike: ${bike.title} - ${siteName}`;
  const description = `See how much you could save with a ${bike.title}. Find the right bike to replace some car trips!`;

  const html = renderMeta(template, {
    title,
    description,
    url: `${BASE_URL}/bike/${slug}`,
    image: `${BASE_URL}/images/social-${slug}.png`,
  });

  const dir = path.join(DIST, 'bike', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Generated ${path.relative(DIST, dir)}/index.html`);
}

// --- Supplementary pages ---

for (const [slug, page] of Object.entries(pageMeta)) {
  const title = `${page.title} - ${siteName}`;

  const html = renderMeta(template, {
    title,
    description: page.description,
    url: `${BASE_URL}/${slug}`,
    image: page.socialImage === false
      ? `${BASE_URL}/images/social.png`
      : `${BASE_URL}/images/social-${slug}.png`,
  });

  const dir = path.join(DIST, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Generated ${path.relative(DIST, dir)}/index.html`);
}
