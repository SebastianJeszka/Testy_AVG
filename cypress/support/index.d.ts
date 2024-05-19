declare namespace Cypress {
  interface Chainable<Subject = any> {
      /**
       * Custom command to login by api to backend
       * @example cy.loginByApi()
       */
       createInitialState(): void;
  }
}
