const VisualTesting = require('codeceptjs-visual-testing');

/**
 * Extends codeceptjs-visual-testing to add Playwright support.
 * The upstream plugin only checks for Puppeteer and WebDriver, and
 * expects saveScreenshot to return a buffer — Playwright writes to
 * a file instead. We also support element-level screenshots by
 * accepting a CSS selector via the `element` option.
 */
class PlaywrightVisualTesting extends VisualTesting {
  get driver() {
    return this.helpers.Playwright ?? this.helpers.Puppeteer ?? this.helpers.WebDriver;
  }

  async _captureScreen() {
    const playwright = this.helpers.Playwright;

    // If an element selector was stashed by dontSeeVisualChanges, screenshot
    // just that element; otherwise screenshot the full page.
    if (this._elementSelector) {
      const locator = playwright.page.locator(this._elementSelector);
      return locator.screenshot();
    }

    return playwright.page.screenshot({ fullPage: true });
  }

  async dontSeeVisualChanges(name, options = {}) {
    // Stash the element selector so _captureScreen can pick it up
    this._elementSelector = options.element || null;
    return super.dontSeeVisualChanges(name, options);
  }
}

module.exports = PlaywrightVisualTesting;
