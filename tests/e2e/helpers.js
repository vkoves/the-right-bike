/**
 * Runs through the full assessment flow by clicking option labels.
 *
 * @param {CodeceptJS.I} I
 * @param {string[]} needs    - transportation need labels to click (multi-select)
 * @param {string} geo        - geography label to click
 * @param {string} fitness    - fitness level label to click
 * @param {string} storage    - storage label to click
 * @param {{ prefersStability?: boolean }} options
 */
function runAssessment(I, needs, geo, fitness, storage, options = {}) {
  I.amOnPage('/');
  I.click('Find Your Perfect Bike');
  I.waitForText('What Types Of Transportation Needs Do You Have?');

  // Step 1: Transportation Needs (multi-select, then Continue)
  for (const need of needs) {
    I.click(locate('.option-card').withDescendant(locate('.option-label').withText(need)));
  }
  I.click('Continue');

  // Step 2: Geography (single-select, then Continue)
  I.waitForText('Is it Windy Or Hilly Where You Are?');
  I.click(locate('.option-card').withDescendant(locate('.option-label').withText(geo)));
  I.click('Continue');

  // Step 3: Fitness (single-select + optional stability, then Continue)
  I.waitForText("What's your fitness level?");
  I.click(locate('.option-card').withDescendant(locate('.option-label').withText(fitness)));
  if (options.prefersStability) {
    I.click('I Prefer Extra Stability');
  }
  I.click('Continue');

  // Step 4: Storage (single-select, then See My Results!)
  I.waitForText('Where Will You Store Your Bike?');
  I.click(locate('.option-card').withDescendant(locate('.option-label').withText(storage)));
  I.click('See My Results!');

  // Wait for results to render
  I.waitForText('Your Recommended Bike Type');
}

const { Savings } = require('./selectors');

/**
 * Toggles "I Already Own A Car" and sets the driving replacement percentage.
 *
 * @param {CodeceptJS.I} I
 * @param {number} percent - replacement percentage (e.g. 80)
 */
function enableOwnCarMode(I, percent) {
  I.click('I Already Own A Car');
  I.waitForText('How much of your driving would you replace with biking?');

  // Set the range input directly via executeScript because CodeceptJS's
  // fillField doesn't work reliably with range inputs. Args are bundled
  // into one object because executeScript only supports a single argument.
  I.executeScript(({ sel, pct }) => {
    const slider = document.querySelector(sel);
    slider.value = String(pct);
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }, { sel: Savings.ReplacementSlider, pct: percent });

  I.see(`${percent}%`, Savings.SliderValue);
}

module.exports = { runAssessment, enableOwnCarMode };
