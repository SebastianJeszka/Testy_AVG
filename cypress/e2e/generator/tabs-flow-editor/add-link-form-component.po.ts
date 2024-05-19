import { getItemByTestId } from 'cypress/utils';

export class AddLinkFormPO {
  getAddLinkForm() {
    return cy.get('add-link-form');
  }

  getStartNodeSelect() {
    return getItemByTestId('startNodeSelect');
  }

  getEndNodeSelect() {
    return getItemByTestId('endNodeSelect');
  }

  getSaveLinkButton() {
    return getItemByTestId('saveLinkButton');
  }

  getDefaultStepCheckbox() {
    return getItemByTestId('defaultStepCheckbox');
  }

  getQueryNameInputForNewStep() {
    return getItemByTestId('queryNameInputForNew');
  }

  getQueryBuilderForStep() {
    return getItemByTestId('queryBuilderForStep');
  }

  getQueryBuilderFieldSelect() {
    return getItemByTestId('queryBuilderFieldSelect');
  }

  getQueryBuilderErrorInfo() {
    return getItemByTestId('queryBuilderErrorInfo');
  }

  getSimpleRuleButton() {
    return cy.get('button.mat-focus-indicator span').contains(' + Dodaj regułę ');
  }

  // ELements of edit step popup
  getItemOfEditStepPopup(itemName: string) {
    return cy.get(`edit-link-popup [data-testid=${itemName}]`);
  }

  getEditStepHeader() {
    return this.getItemOfEditStepPopup('editStepHeader');
  }

  getEditStepQueryNameInput() {
    return this.getItemOfEditStepPopup('editionStepQueryName');
  }

  getEditStepStartNodeSelect() {
    return this.getItemOfEditStepPopup('startNodeSelect');
  }

  getEditStepEndNodeSelect() {
    return this.getItemOfEditStepPopup('endNodeSelect');
  }

  getEditStepQueryBuilder() {
    return this.getItemOfEditStepPopup('queryBuilderForStep');
  }

  getEditStepDefaultStepChechbox() {
    return this.getItemOfEditStepPopup('defaultStepCheckbox');
  }

  getRemoveStepButtonFromPopup() {
    return this.getItemOfEditStepPopup('removeStepButton');
  }

  getEditStepCloseButton() {
    return this.getItemOfEditStepPopup('closeLinkPopup');
  }

  getSaveEditionStepButton() {
    return this.getItemOfEditStepPopup('saveStepEditionButton');
  }

  addSimpleRule() {
    this.getSimpleRuleButton().click();
  }

  getQueryValueInput() {
    return cy.get('mc-input-text[label="Wartość"] input');
  }

  chooseOptionOfStepstSelects(selectElement, optName: string) {
    selectElement.click();
    cy.get('mat-option').contains(optName).click();
  }

  addStepStartEnd(startTab: string, endTab: string) {
    this.chooseOptionOfStepstSelects(this.getStartNodeSelect(), startTab);
    this.chooseOptionOfStepstSelects(this.getEndNodeSelect(), endTab);
  }

  selectFieldForRule(fieldName: string) {
    this.getQueryBuilderFieldSelect().click();
    cy.get('mat-option').find('span>div>div.q-select-option-row').contains(fieldName).click();
  }
}
