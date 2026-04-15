const { runAssessment } = require('./helpers');
const { Recommendation, Savings, BuyingOptions, BikeComparison } = require('./selectors');

Feature('Visual Regression Tests');

const DesktopSize = { width: 1280, height: 900 };
const MobileSize = { width: 375, height: 812 };

// Hide the sticky site header so it doesn't overlay element screenshots.
function hideStickyHeader(I: CodeceptJS.I) {
  I.executeScript(() => {
    const style = document.createElement('style');
    style.textContent = 'header, .sticky-header { display: none !important; }';
    document.head.appendChild(style);
  });
}

// Navigate to cargo eBike results with alternate note (basement storage)
function goToCargoEbikeResult(I: CodeceptJS.I) {
  runAssessment(I, ['Heavy Cargo / Pets'], 'Mostly Flat', 'Medium', 'Basement Or Up A Few Steps');
  I.see('Front-Loader Cargo eBike', Recommendation.Title);
  I.waitForText("Absolutely Can't Store Outside?");

  hideStickyHeader(I);
  // Wait for the 300ms fade-in transition to complete
  I.wait(0.5);
}

// -- Homepage --

Scenario('Homepage - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  I.amOnPage('/');
  I.waitForText('Find Your Perfect Bike');

  I.dontSeeVisualChanges('homepage-desktop');
});

Scenario('Homepage - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  I.amOnPage('/');
  I.waitForText('Find Your Perfect Bike');

  I.dontSeeVisualChanges('homepage-mobile');
});

// -- Results page sections (cargo eBike with alternate note) --

Scenario('Recommendation - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('recommendation-desktop', { element: Recommendation.Container });
});

Scenario('Recommendation - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('recommendation-mobile', { element: Recommendation.Container });
});

Scenario('Savings overview (own car, 80%) - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  goToCargoEbikeResult(I);
  I.click('I Already Own A Car');
  I.waitForText('How much of your driving would you replace with biking?');

  I.executeScript((sel: string) => {
    const slider = document.querySelector(sel) as HTMLInputElement;
    slider.value = '80';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }, Savings.ReplacementSlider);

  I.see('80%', Savings.SliderValue);
  I.dontSeeVisualChanges('savings-overview-own-car-desktop', { element: Savings.Section });
});

Scenario('Savings overview (own car, 80%) - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  goToCargoEbikeResult(I);
  I.click('I Already Own A Car');
  I.waitForText('How much of your driving would you replace with biking?');
  I.executeScript((sel: string) => {
    const slider = document.querySelector(sel) as HTMLInputElement;
    slider.value = '80';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }, Savings.ReplacementSlider);
  I.see('80%', Savings.SliderValue);
  I.dontSeeVisualChanges('savings-overview-own-car-mobile', { element: Savings.Section });
});

Scenario('Buying options - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('buying-options-desktop', { element: BuyingOptions.Section });
});

Scenario('Buying options - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('buying-options-mobile', { element: BuyingOptions.Section });
});

Scenario('Bike comparison - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('bike-comparison-desktop', { element: BikeComparison.Grid });
});

Scenario('Bike comparison - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('bike-comparison-mobile', { element: BikeComparison.Grid });
});
