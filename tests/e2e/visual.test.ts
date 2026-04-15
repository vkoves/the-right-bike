const { runAssessment } = require('./helpers');

Feature('Visual Regression Tests');

const DesktopSize = { width: 1280, height: 900 };
const MobileSize = { width: 375, height: 812 };

// Lock to a system font so visual baselines are identical across environments.
function lockFont(I: CodeceptJS.I) {
  I.executeScript(() => {
    const style = document.createElement('style');
    style.textContent = '* { font-family: Arial, Helvetica, sans-serif !important; }';
    document.head.appendChild(style);
  });
}

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
  I.see('Front-Loader Cargo eBike', 'h3');
  I.waitForText("Absolutely Can't Store Outside?");
  lockFont(I);
  hideStickyHeader(I);
  // Wait for the 300ms fade-in transition to complete
  I.wait(0.5);
}

// -- Homepage --

Scenario('Homepage - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  I.amOnPage('/');
  I.waitForText('Find Your Perfect Bike');
  lockFont(I);
  I.dontSeeVisualChanges('homepage-desktop');
});

Scenario('Homepage - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  I.amOnPage('/');
  I.waitForText('Find Your Perfect Bike');
  lockFont(I);
  I.dontSeeVisualChanges('homepage-mobile');
});

// -- Results page sections (cargo eBike with alternate note) --

Scenario('Recommendation - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('recommendation-desktop', { element: '.bike-recommendation' });
});

Scenario('Recommendation - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('recommendation-mobile', { element: '.bike-recommendation' });
});

Scenario('Savings overview - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('savings-overview-desktop', { element: '.savings-section' });
});

Scenario('Savings overview - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('savings-overview-mobile', { element: '.savings-section' });
});

Scenario('Buying options - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('buying-options-desktop', { element: '#buying-options' });
});

Scenario('Buying options - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('buying-options-mobile', { element: '#buying-options' });
});

Scenario('Bike comparison - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('bike-comparison-desktop', { element: '.bike-comparison-grid' });
});

Scenario('Bike comparison - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  goToCargoEbikeResult(I);
  I.dontSeeVisualChanges('bike-comparison-mobile', { element: '.bike-comparison-grid' });
});
