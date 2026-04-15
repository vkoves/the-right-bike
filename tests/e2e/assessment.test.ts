const { runAssessment, enableOwnCarMode } = require('./helpers');
const { Recommendation, Savings } = require('./selectors');
const { CarCosts } = require('../../src/constants/vehicleCosts.ts');
const { BikeTypes } = require('../../src/constants/bikeTypes.ts');
const Currency = require('../../src/utils/currency.ts').default;

const ComparisonYears = 5;

Feature('Assessment - Common Bike Recommendations');

Scenario('recommends a Regular Bicycle for solo flat commuting at high fitness', ({ I }) => {
  const bike = BikeTypes['regular-bike'];
  runAssessment(I, ['Solo Commuting'], 'Mostly Flat', 'High', 'Garage or Shed');

  I.see(bike.title, Recommendation.Title);
  I.see(bike.priceRange);
  I.see(bike.features[0]); // Lightweight and maneuverable
  I.dontSeeElement(Recommendation.ElectricBadge);
  I.see('trailer', Recommendation.TrailerTip);
});

Scenario('recommends a Commuter eBike for solo hilly commuting at medium fitness', ({ I }) => {
  const bike = BikeTypes['commuter-ebike'];
  runAssessment(I, ['Solo Commuting'], 'Hilly', 'Medium', 'Garage or Shed');

  I.see(bike.title, Recommendation.Title);
  I.see(bike.priceRange);
  I.see(bike.features[0]); // Electric motor assists up to 20-28 mph
  I.see('Electric', Recommendation.ElectricBadge);
  I.see('trailer', Recommendation.TrailerTip);
});

Scenario('recommends a Front-Loader Cargo eBike for heavy cargo on flat terrain', ({ I }) => {
  const bike = BikeTypes['cargo-ebike'];
  runAssessment(I, ['Heavy Cargo / Pets'], 'Mostly Flat', 'Medium', 'Garage or Shed');

  I.see(bike.title, Recommendation.Title);
  I.see(bike.priceRange);
  I.see(bike.features[0]); // Front cargo box for people or cargo
  I.see('Electric', Recommendation.ElectricBadge);

  // Verify default savings heading (new car comparison)
  I.see('Potential Savings vs Buying A', Savings.Heading);

  // Toggle "I Already Own A Car" and set replacement to 80%
  const ReplacementPercent = 80;
  enableOwnCarMode(I, ReplacementPercent);

  // Verify heading and car column title
  I.see('Potential Savings by Going Car-Lite', Savings.Heading);
  I.see(`With ${ReplacementPercent}% Less Use`, Savings.CarSubtitle);

  // Compute expected savings from actual constants
  const scale = ReplacementPercent / 100;
  const remainingScale = 1 - scale;

  // Per-line annual savings (unrounded, matching the app's computed properties)
  const maintenanceSaving = CarCosts.maintenance * scale;                       // $720
  const fuelSaving = CarCosts.fuel * scale;                                     // $2,000
  const mileageInsurance = CarCosts.mileageInsuranceBase
    + (CarCosts.averageAnnualMiles * remainingScale * CarCosts.mileageInsurancePerMile);
  const insuranceSaving = CarCosts.insurance - mileageInsurance;                // ~$1,608.50

  // Currency.format rounds at display time, matching the app's behavior
  I.see(`Save ${Currency.format(maintenanceSaving)}/yr`);
  I.see(`Save ${Currency.format(fuelSaving)}/yr`);
  I.see(`Save ${Currency.format(insuranceSaving)}/yr`);

  // N-year savings line in the cost table
  const totalAnnualSaving = maintenanceSaving + fuelSaving + insuranceSaving;
  const totalSaving = totalAnnualSaving * ComparisonYears;                       // ~$21,642.50
  I.see(Currency.format(totalSaving), Savings.SavingsTotalRow);

  // Overall savings: full car running costs minus reduced car costs, minus bike cost
  const bikeTotalCost = bike.costs.purchase
    + (bike.costs.maintenance * ComparisonYears)
    + (bike.costs.fuel * ComparisonYears)
    + (bike.costs.insurance * ComparisonYears);
  const fullCarRunning = (CarCosts.maintenance * ComparisonYears)
    + (CarCosts.fuel * ComparisonYears)
    + (CarCosts.insurance * ComparisonYears);
  const carTotalCost = (CarCosts.maintenance * ComparisonYears * remainingScale)
    + (CarCosts.fuel * ComparisonYears * remainingScale)
    + (mileageInsurance * ComparisonYears);
  const overallSavings = (fullCarRunning - carTotalCost) - bikeTotalCost;        // ~$14,467.50
  I.see(Currency.format(overallSavings), Savings.Amount);
});

Scenario('recommends a Longtail Cargo eBike for transporting kids on hilly terrain', ({ I }) => {
  const bike = BikeTypes['longtail-ebike'];
  runAssessment(I, ['Transporting Kids'], 'Hilly', 'Medium', 'Garage or Shed');

  I.see(bike.title, Recommendation.Title);
  I.see(bike.priceRange);
  I.see(bike.features[0]); // E-assist for easy passenger hauling
  I.see('Electric', Recommendation.ElectricBadge);

  // Verify savings are shown with the correct bike cost
  I.see('Your 5-Year Savings', Savings.SavingsTotal);
  I.see(bike.priceRange);
});

Scenario('recommends a Cargo Electric Trike when stability is preferred with cargo needs', ({ I }) => {
  const bike = BikeTypes['cargo-etrike'];
  runAssessment(I, ['Heavy Cargo / Pets'], 'Mostly Flat', 'Medium', 'Garage or Shed', {
    prefersStability: true,
  });

  I.see(bike.title, Recommendation.Title);
  I.see(bike.priceRange);
  I.see(bike.features[0]); // Three wheels for maximum stability
  I.see(bike.features[3]); // No balance required — safe for all abilities
  I.see('Electric', Recommendation.ElectricBadge);

  // Verify savings are shown with the correct bike cost
  I.see('Your 5-Year Savings', Savings.SavingsTotal);
});
