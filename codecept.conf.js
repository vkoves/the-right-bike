exports.config = {
  tests: './tests/e2e/**/*.test.ts',
  output: './tests/e2e/output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:5173',
      show: !process.env.HEADLESS,
      waitForNavigation: 'networkidle',
    },
    VisualTesting: {
      require: './tests/e2e/PlaywrightVisualTesting.js',
      baseFolder: './tests/e2e/visual-baselines',
      diffFolder: './tests/e2e/output/visual-diffs',
    },
  },
  name: 'the-right-bike',
};
