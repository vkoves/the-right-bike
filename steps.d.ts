/// <reference types='codeceptjs' />
type VisualTesting = import('./tests/e2e/PlaywrightVisualTesting.js');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any }
  interface Methods extends Playwright, VisualTesting {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
