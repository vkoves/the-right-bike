const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const OUT_DIR = path.join(__dirname, '..', 'public', 'images');

const pages = [
  { url: '/social-image', file: 'social.png', width: 1000, height: 522 },
  { url: '/social-image/regular-bike', file: 'social-regular-bike.png', width: 1000, height: 522 },
  { url: '/social-image/commuter-ebike', file: 'social-commuter-ebike.png', width: 1000, height: 522 },
  { url: '/social-image/cargo-bike', file: 'social-cargo-bike.png', width: 1000, height: 522 },
  { url: '/social-image/cargo-ebike', file: 'social-cargo-ebike.png', width: 1000, height: 522 },
  { url: '/social-image/longtail-bike', file: 'social-longtail-bike.png', width: 1000, height: 522 },
  { url: '/social-image/longtail-ebike', file: 'social-longtail-ebike.png', width: 1000, height: 522 },
];

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
