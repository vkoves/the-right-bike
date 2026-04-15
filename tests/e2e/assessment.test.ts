Feature('Assessment - Common Bike Recommendations');

/**
 * Helper: runs through the full assessment flow by clicking option labels.
 *
 * @param needs    - transportation need labels to click (multi-select)
 * @param geo      - geography label to click
 * @param fitness  - fitness level label to click
 * @param storage  - storage label to click
 * @param options  - extra options like prefersStability
 */
function runAssessment(
  I: CodeceptJS.I,
  needs: string[],
  geo: string,
  fitness: string,
  storage: string,
  options: { prefersStability?: boolean } = {}
) {
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
