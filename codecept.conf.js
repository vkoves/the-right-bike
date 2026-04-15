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
  },
  name: 'the-right-bike',
};
