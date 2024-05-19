import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  trashAssetsBeforeRuns: true,
  viewportWidth: 1360,
  viewportHeight: 860,
  chromeWebSecurity: false,
  env: {
    FAIL_FAST_STRATEGY: 'spec',
    FAIL_FAST_ENABLED: true,
    FAIL_FAST_BAIL: 1,
      USER_LOGIN: 'admin',
      USER_PASSWORD: 'admin',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config)
    },
    baseUrl: 'http://localhost:4201',
    excludeSpecPattern: ['cypress/e2e/**/*.po.ts'],
    specPattern: 'cypress/e2e/**/*',
  },

})
