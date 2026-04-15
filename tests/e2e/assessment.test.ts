const { runAssessment } = require('./helpers');
const { CAR_COSTS } = require('../../src/constants/bikeCosts.ts');
const { BikeTypes } = require('../../src/constants/bikeTypes.ts');
const Currency = require('../../src/utils/currency.ts').default;

const ComparisonYears = 5;

Feature('Assessment - Common Bike Recommendations');

Scenario('recommends a Regular Bicycle for solo flat commuting at high fitness', ({ I }) => {
  runAssessment(I, ['Solo Commuting'], 'Mostly Flat', 'High', 'Garage or Shed');
  I.see('Regular Bicycle', 'h3');
});

Scenario('recommends a Commuter eBike for solo hilly commuting at medium fitness', ({ I }) => {
  runAssessment(I, ['Solo Commuting'], 'Hilly', 'Medium', 'Garage or Shed');
  I.see('Commuter eBike', 'h3');
});

Scenario('recommends a Front-Loader Cargo eBike for heavy cargo on flat terrain', ({ I }) => {
  runAssessment(I, ['Heavy Cargo / Pets'], 'Mostly Flat', 'Medium', 'Garage or Shed');
  I.see('Front-Loader Cargo eBike', 'h3');

  // Verify default savings heading (new car comparison)
  I.see('Potential Savings vs Buying A', '.savings-heading');

  // Toggle "I Already Own A Car" and set replacement to 80%
  const ReplacementPercent = 80;
  I.click('I Already Own A Car');
  I.waitForText('How much of your driving would you replace with biking?');
  I.executeScript((pct: number) => {
    const slider = document.querySelector('#replacement-slider') as HTMLInputElement;
    slider.value = String(pct);
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }, ReplacementPercent);
  I.see(`${ReplacementPercent}%`, '.slider-value');

  // Verify heading and car column title
  I.see('Potential Savings by Going Car-Lite', '.savings-heading');
  I.see(`With ${ReplacementPercent}% Less Use`, '.car-subtitle');

  // Compute expected savings from actual constants
  const scale = ReplacementPercent / 100;
  const remainingScale = 1 - scale;
  const bikeCosts = BikeTypes['cargo-ebike'].costs;

  // Per-line annual savings (unrounded, matching the app's computed properties)
  const maintenanceSaving = CAR_COSTS.maintenance * scale;                       // $720
  const fuelSaving = CAR_COSTS.fuel * scale;                                     // $2,000
  const mileageInsurance = CAR_COSTS.mileageInsuranceBase
    + (CAR_COSTS.averageAnnualMiles * remainingScale * CAR_COSTS.mileageInsurancePerMile);
  const insuranceSaving = CAR_COSTS.insurance - mileageInsurance;                // ~$1,608.50

  // Currency.format rounds at display time, matching the app's behavior
  I.see(`Save ${Currency.format(maintenanceSaving)}/yr`);
  I.see(`Save ${Currency.format(fuelSaving)}/yr`);
  I.see(`Save ${Currency.format(insuranceSaving)}/yr`);

  // N-year savings line in the cost table
  const totalAnnualSaving = maintenanceSaving + fuelSaving + insuranceSaving;
  const totalSaving = totalAnnualSaving * ComparisonYears;                       // ~$21,642.50
  I.see(Currency.format(totalSaving), '.savings-total');

  // Overall savings: full car running costs minus reduced car costs, minus bike cost
  const bikeTotalCost = bikeCosts.purchase
    + (bikeCosts.maintenance * ComparisonYears)
    + (bikeCosts.fuel * ComparisonYears)
    + (bikeCosts.insurance * ComparisonYears);
  const fullCarRunning = (CAR_COSTS.maintenance * ComparisonYears)
    + (CAR_COSTS.fuel * ComparisonYears)
    + (CAR_COSTS.insurance * ComparisonYears);
  const carTotalCost = (CAR_COSTS.maintenance * ComparisonYears * remainingScale)
    + (CAR_COSTS.fuel * ComparisonYears * remainingScale)
    + (mileageInsurance * ComparisonYears);
  const overallSavings = (fullCarRunning - carTotalCost) - bikeTotalCost;        // ~$14,467.50
  I.see(Currency.format(overallSavings), '.amount');
});

Scenario('recommends a Longtail Cargo eBike for transporting kids on hilly terrain', ({ I }) => {
  runAssessment(I, ['Transporting Kids'], 'Hilly', 'Medium', 'Garage or Shed');
  I.see('Longtail Cargo eBike', 'h3');
});

Scenario('recommends a Cargo Electric Trike when stability is preferred with cargo needs', ({ I }) => {
  runAssessment(I, ['Heavy Cargo / Pets'], 'Mostly Flat', 'Medium', 'Garage or Shed', {
    prefersStability: true,
  });
  I.see('Cargo Electric Trike', 'h3');
});
