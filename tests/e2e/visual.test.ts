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

Scenario('Cargo eBike result with alternate note - desktop', async ({ I }) => {
  I.resizeWindow(DesktopSize.width, DesktopSize.height);
  // Heavy cargo, flat, medium fitness, basement storage → cargo-ebike with alternate note
  runAssessment(I, ['Heavy Cargo / Pets'], 'Mostly Flat', 'Medium', 'Basement Or Up A Few Steps');
  I.see('Front-Loader Cargo eBike', 'h3');
  I.waitForText("Absolutely Can't Store Outside?");
  lockFont(I);
  // Wait for the 300ms fade-in transition to complete
  I.wait(0.5);
  I.dontSeeVisualChanges('cargo-ebike-alternate-desktop');
});

Scenario('Cargo eBike result with alternate note - mobile', async ({ I }) => {
  I.resizeWindow(MobileSize.width, MobileSize.height);
  runAssessment(I, ['Heavy Cargo / Pets'], 'Mostly Flat', 'Medium', 'Basement Or Up A Few Steps');
  I.see('Front-Loader Cargo eBike', 'h3');
  I.waitForText("Absolutely Can't Store Outside?");
  lockFont(I);
  // Wait for the 300ms fade-in transition to complete
  I.wait(0.5);
  I.dontSeeVisualChanges('cargo-ebike-alternate-mobile');
});
