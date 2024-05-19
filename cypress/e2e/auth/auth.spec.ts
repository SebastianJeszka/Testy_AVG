import { AuthPage } from './auth.po';
import { ClientPage } from './client.po';

describe('authPage', () => {
  const authPage = new AuthPage();

  before(() => {
    authPage.navigateTo();
  {
  } 
  });


  it('presents login button', () => {
    authPage.clickLoginButton()
    const clientPage = new ClientPage();
    clientPage.getUsernameInput().type(Cypress.env('USER_LOGIN'));
    clientPage.getPasswordInput().type(Cypress.env('USER_PASSWORD'));
    clientPage.clickLogInButton();
  });
  
  it('check result', () => {
  
 
     authPage.getLogoutButton().should('be.visible');
    })
  });
