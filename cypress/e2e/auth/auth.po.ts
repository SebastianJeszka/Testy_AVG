import { getItemByTestId } from 'cypress/utils';

export class AuthPage {
  navigateTo() {
    cy.visit('/');
  }

  clickLoginButton() {
    this.getLoginButton().click();
  }

  getLoginButton() {
    return cy.get('#standardLoginButton');
  }

  logOut() {
    this.getLogoutButton().click();
  }

  getLogoutButton() {
    return getItemByTestId('logoutButton');
  }
}
