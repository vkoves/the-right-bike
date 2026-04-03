/**
 * Screenshots social image routes and saves them as PNGs.
 *
 * Usage:
 *   node scripts/screenshot-social.js            # all images
 *   node scripts/screenshot-social.js gear-guide  # just social-gear-guide.png
 *
 * The dev server (yarn dev) must be running first.
 */
const puppeteer = require('puppeteer');
const path = require('path');
const { bikeTypes } = require('./bike-types');
const { pages: pageMeta } = require('../src/constants/pageMeta.json');

const BASE_URL = 'http://localhost:5173';
const OUT_DIR = path.join(__dirname, '..', 'public', 'images');

const allPages = [
  { slug: 'home', url: '/social-image', file: 'social.png', width: 1000, height: 522 },
  ...Object.keys(bikeTypes).map(slug => ({
    slug,
    url: `/social-image/${slug}`,
    file: `social-${slug}.png`,
    width: 1000,
    height: 522
  })),
  ...Object.keys(pageMeta)
    .filter(slug => pageMeta[slug].socialImage !== false)
    .map(slug => ({
      slug,
      url: `/social-image/page/${slug}`,
      file: `social-${slug}.png`,
      width: 1000,
      height: 522
    }))
];

const filter = process.argv[2];
const pages = filter
  ? allPages.filter(p => p.slug === filter)
  : allPages;

if (pages.length === 0) {
  const slugs = allPages.map(p => p.slug).join(', ');
  console.error(`No page matching "${filter}". Available slugs: ${slugs}`);
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const { url, file, width, height } of pages) {
    await page.setViewport({ width, height });
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle0' });
    const outPath = path.join(OUT_DIR, file);
    await page.screenshot({ path: outPath });
    console.log(`Saved ${outPath}`);
  }

  await browser.close();
})();
