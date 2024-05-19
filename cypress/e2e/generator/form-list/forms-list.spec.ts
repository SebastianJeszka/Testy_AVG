import { FormListPage } from './forms-list.po';

describe('formListPage', () => {
  const formListPage = new FormListPage();

  before(() => {
      formListPage.navigateTo();
      formListPage.waitForForms();
  });

  it('navigates to generator tab after successfull login', () => {
    cy.url().should('include', '/generator');
  });

  it('displays generator tab with form list header', () => {
    formListPage.getHeader().should('include.text', 'Formularze (Ankiety)');
  });

  it('enables adding new form', () => {
    formListPage.getAddNewFormButton().should('be.visible').and('be.enabled');
  });

  it('enables importing form from file', () => {
    formListPage.getImportFormButton().should('be.visible').and('be.enabled');
  });

  it('displays form list table', () => {
    formListPage.getFormListTable().should('be.visible');
  });

  it('enables cloning form and exporting form', () => {
    formListPage.getFirstFormName().then((formName) => {
      formListPage.getMoreButtonByFormName(formName).as('firstFormMoreButton').should('be.visible').and('be.enabled');
      cy.get('@firstFormMoreButton').click();
      formListPage.getCloneFormButton().should('be.be.visible').and('be.enabled');
      formListPage.getExportFormButton().should('be.be.visible').and('be.enabled');
    });
  });
});
