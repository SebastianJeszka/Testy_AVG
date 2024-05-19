import { getItemByTestId } from 'cypress/utils';

export class FormListPage {
  navigateTo() {
    cy.visit('#/generator');
  }

  getHeader() {
    return getItemByTestId('formListHeader');
  }

  getFormListTable() {
    return cy.get('.mc-table');
  }

  getFormLinksFromTable() {
    return getItemByTestId('formsListLink');
  }

  getFormWithName(formName: string) {
    return this.getFormLinksFromTable().filter(`:contains(${formName})`);
  }

  getAddNewFormButton() {
    return getItemByTestId('navigateToAddForm');
  }

  getImportFormButton() {
    return getItemByTestId('importForm');
  }

  getNoRecordsCell() {
    return cy.get('.no-records-cell');
  }

  getMoreButtonByFormName(formName: string) {
    return this.getFormListTable()
      .find(`> tr > td:first-child:contains(${formName})`)
      .parent()
      .find('> td:last-child > button');
  }

  getExportFormButton() {
    return getItemByTestId('exportFormButton');
  }

  getCloneFormButton() {
    return getItemByTestId('cloneFormButton');
  }

  getFirstFormName() {
    return this.getFormListTable()
      .find('> tr')
      .eq(1)
      .find('> td')
      .first()
      .find('a')
      .invoke('text')
      .then((formName) => formName.trim());
  }

  chooseFormWithName(formName: string) {
    this.getFormWithName(formName).click();
  }

  chooseLastForm() {
    this.getFormListTable().find('> tr:last-child > td:first-child').click();
  }

  navigateToAddForm() {
    this.getAddNewFormButton().click();

    //FIXME
    cy.wait(1000);
  }

  waitForForms() {
    cy.intercept({
      method: 'GET',
      url: '/api/form-generator/forms'
    }).as('getForms');

    cy.wait('@getForms');
  }
}
