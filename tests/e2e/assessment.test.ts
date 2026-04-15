const { runAssessment } = require('./helpers');

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
