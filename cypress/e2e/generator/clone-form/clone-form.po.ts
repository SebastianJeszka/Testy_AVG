import { getItemByTestId } from 'cypress/utils';

export class CloneForm {
  getComponent() {
    return cy.get('clone-form');
  }

  getHeader() {
    return getItemByTestId('cloneFormHeader');
  }

  getTechNameInput() {
    return getItemByTestId('cloneFormTechName').find('input');
  }

  getCloneButton() {
    return getItemByTestId('cloneFormButton');
  }
}
