import { getItemByTestId, getOptionByLabel } from 'cypress/utils';

export class DictionaryConfigForm {
  getExternalApiParametrizedUrl() {
    return getItemByTestId('externalApiParametrizedUrl');
  }

  getExternalApiFieldsButton() {
    return getItemByTestId('externalApiFieldsButton');
  }

  getLabelPropertyNameSelect() {
    return getItemByTestId('labelPropertyNameSelect');
  }

  getValuePropertyNameSelect() {
    return getItemByTestId('valuePropertyNameSelect');
  }

  getDictionaryLevelTitleInput() {
    return getItemByTestId('dictionaryLevelTitle');
  }

  getDictionaryLevelPlaceholderInput() {
    return getItemByTestId('dictionaryLevelPlaceholder');
  }

  getToggleAdditionalParams() {
    return getItemByTestId('toggleAdditionalParamsCheckbox').find('input');
  }

  getNoParamsOnFirstLevelInfo() {
    return getItemByTestId('noParamsOnFirstLevelInfo');
  }

  getSaveButton() {
    return getItemByTestId('saveDictionaryConfigForm');
  }

  getCancelButton() {
    return getItemByTestId('cancelDictionaryConfigForm');
  }

  getGenericSourceUrlInput() {
    return getItemByTestId('genericSourceUrl').find('input');
  }

  getAddFirstParameterButton() {
    return getItemByTestId('addFirstParameterButton');
  }

  getParamNameInput() {
    return getItemByTestId('paramNameInput');
  }

  getDictLevel() {
    return getItemByTestId('dictLevelSelect');
  }

  getExternalApiFields() {
    cy.intercept({
      method: 'POST',
      url: '/api/form-generator/dictionary/external/fields'
    }).as('postExternalFields');

    this.getExternalApiFieldsButton().should('be.enabled');

    cy.wait(1000);
    this.getExternalApiFieldsButton().click();
    cy.wait(1000);

    cy.wait('@postExternalFields');
    this.getLabelPropertyNameSelect().should('exist');
    this.getValuePropertyNameSelect().should('exist');
    this.getExternalApiFieldsButton().should('be.disabled');
  }

  configureExternalApiUrl(apiUrl: string) {
    this.getExternalApiParametrizedUrl().type(apiUrl);
    this.getExternalApiFieldsButton().should('be.enabled');
  }

  configureLabelAndValueProperies({ labelOption = 'name', valueOption = 'id' } = {}) {
    this.getExternalApiFieldsButton().should('be.disabled');

    this.getLabelPropertyNameSelect().should('be.visible');
    this.getLabelPropertyNameSelect().click();
    getOptionByLabel(labelOption).click();

    this.getValuePropertyNameSelect().should('be.visible');
    this.getValuePropertyNameSelect().click();
    getOptionByLabel(valueOption).click();
  }
}
