export class ClientPage {
  getUsernameInput() {
    return cy.get('#username');
  }

  getPasswordInput() {
    return cy.get('#password');
  }

  clickLogInButton(){
    this.getLogInButton().click();
  }
  getLogInButton(){
    return cy.get('button[type=submit]').should('have.text', 'Zaloguj');
  }

}
