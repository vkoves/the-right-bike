const VisualTesting = require('codeceptjs-visual-testing');

/**
 * Extends codeceptjs-visual-testing to add Playwright support.
 * The upstream plugin only checks for Puppeteer and WebDriver, and
 * expects saveScreenshot to return a buffer — Playwright writes to
 * a file instead. We also use Playwright's native fullPage option
 * to capture the entire scrollable page.
 */
class PlaywrightVisualTesting extends VisualTesting {
  get driver() {
    return this.helpers.Playwright ?? this.helpers.Puppeteer ?? this.helpers.WebDriver;
  }

  async _captureScreen() {
    const playwright = this.helpers.Playwright;
    return playwright.page.screenshot({ fullPage: true });
  }
}

module.exports = PlaywrightVisualTesting;
