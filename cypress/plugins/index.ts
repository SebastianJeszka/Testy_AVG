import getJwtToken from './getJwtToken';

module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): Cypress.PluginConfigOptions => {
  on('task', {
    getJwtToken
  });
  require('cypress-fail-fast/plugin')(on, config);

  return config;
};
