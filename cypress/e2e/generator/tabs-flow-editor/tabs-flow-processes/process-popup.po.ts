import { getItemByTestId, getOptionByIndex, getOptionByLabel } from 'cypress/utils';

export class ProcessPopupPO {
  getProcessPopupHeader() {
    return getItemByTestId('processPopupHeader');
  }

  getCancelProcessEditionButton() {
    return getItemByTestId('cancelProcessEdition');
  }

  getSaveProcessEdition() {
    return getItemByTestId('saveProcessEdition');
  }

  getProcessEnableCheckbox() {
    return getItemByTestId('processEnableCheckbox');
  }

  getProcessTypeSelect() {
    return getItemByTestId('processTypeSelect');
  }

  getProcessForCopiesCheckbox() {
    return getItemByTestId('processForCopiesCheckbox').find('input');
  }

  getAddAutocompleteFieldButton() {
    return getItemByTestId('addAutocompleteFieldButton');
  }

  getAutoCompleteHeader() {
    return getItemByTestId('autoCompleteHeader');
  }

  getSelectOfAutocompletePropFromMap(index: string | number = 0) {
    return getItemByTestId(`propFromMap_${index}`);
  }

  getSelectOfPageForAutocomplete(index: string | number = 0) {
    return getItemByTestId(`pageForAutocomplete_${index}`);
  }

  getSelectOfFieldForAutocomplete(index: string | number = 0) {
    return getItemByTestId(`fieldForAutocomplete_${index}`);
  }

  getRemoveAutocompleteRow(index: string | number) {
    return getItemByTestId(`removeAutocompleteRow_${index}`);
  }

  getProcessRedirectProtocol() {
    return getItemByTestId('processRedirectProtocol');
  }

  getProcessRedirectUrl() {
    return getItemByTestId('processRedirectUrl');
  }

  getEmailsDefineMessageTypeResults() {
    return cy.get('mc-input-checkbox[name="emailsDefineMessageTypeResults"] input');
  }

  getEmailsDefineMessageTypePersonal() {
    return cy.get('mc-input-checkbox[name="emailsDefineMessageTypePersonal"] input');
  }

  getCkEditorForDefinedEmails() {
    return cy.get('ckeditor[name="personalMessageForDefinedEmails"]');
  }

  getEmailsFieldsDefineMessageTypeResults() {
    return cy.get('mc-input-checkbox[name="emailsFieldsDefineMessageTypeResults"] input');
  }

  getEmailsFieldsDefineMessageTypePersonal() {
    return cy.get('mc-input-checkbox[name="emailsFieldsDefineMessageTypePersonal"] input');
  }

  getCkEditorForDefinedEmailsFields() {
    return cy.get('ckeditor[name="personalMessageForEmailsFields"]');
  }

  getFieldEmailsPageSelect() {
    return getItemByTestId('fieldEmailsPageSelect').find('mat-select');
  }

  getFieldEmailsFieldSelect() {
    return getItemByTestId('fieldEmailsFieldSelect').find('mat-select');
  }

  getAddEmailInputProcessBtn() {
    return getItemByTestId('addEmailInputProcessBtn');
  }

  getAddFieldEmailProcessBtn() {
    return getItemByTestId('addFieldEmailProcessBtn');
  }

  getEmailForResultInput(index?: string | number) {
    return getItemByTestId(`emailForResultInput_${index ? index : 0}`);
  }

  getEmailForResultInputError(index) {
    return this.getEmailForResultInput(index).find(`#emailForResults_before_${index}-describedby`);
  }

  getEmailInputResultRemoveBtn(index) {
    return getItemByTestId(`emailInputResultRemoveBtn_${index}`);
  }

  getEmailsProcessTabGroup() {
    return getItemByTestId('emailsProcessTabGroup');
  }

  getEmailsProcessTabHeader(name: string) {
    return this.getEmailsProcessTabGroup().find('.mat-tab-label-content').contains(name);
  }

  getFieldEmailsHeader() {
    return getItemByTestId('fieldEmailsHeader');
  }

  getProcessTechName() {
    return getItemByTestId('processTechName');
  }

  enableProcess(timeExecution: 'before' | 'after') {
    this.getProcessEnableCheckbox().find(`label[for=enableProcess_${timeExecution}]`).click({ force: true });
  }

  chooseProcessType(optionLabel: string) {
    this.getProcessTypeSelect()
      .click()
      .then(() => {
        getOptionByLabel(optionLabel).click();
      });
  }

  choosePropForAutocomplete(selectIndex: number, optionIndex: number) {
    this.getSelectOfAutocompletePropFromMap(selectIndex)
      .find('mat-select')
      .click()
      .then(() => {
        getOptionByIndex(optionIndex).click();
      });
  }

  choosePageForAutocomplete(selectIndex: number, optionIndex: number) {
    this.getSelectOfPageForAutocomplete(selectIndex)
      .find('mat-select')
      .click()
      .then(() => {
        getOptionByIndex(optionIndex).click();
      });
  }

  chooseFieldForAutocomplete(selectIndex: number, optionIndex: number) {
    this.getSelectOfFieldForAutocomplete(selectIndex)
      .find('mat-select')
      .click()
      .then(() => {
        getOptionByIndex(optionIndex).click();
      });
  }

  chooseFieldEmailsPage(optionLabel: string) {
    return this.getFieldEmailsPageSelect()
      .click()
      .then(() => {
        return getOptionByLabel(optionLabel).click();
      });
  }

  chooseFieldEmailsField(optionLabel: string) {
    return this.getFieldEmailsFieldSelect()
      .click()
      .then(() => {
        return getOptionByLabel(optionLabel).click();
      });
  }
}
