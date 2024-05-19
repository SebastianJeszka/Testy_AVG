import { typeToWysiwyg, getItemByTestId, getOptionByLabel } from 'cypress/utils';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';

export class AddFieldFormPopup {
  getSubmitButton() {
    return getItemByTestId('submitAddFieldButton');
  }

  getQuestionTitleInput() {
    return cy.get('#questionTitle');
  }

  getComponent() {
    return cy.get('add-field-form');
  }

  getAddFieldFormContent() {
    return getItemByTestId('addFieldFormContent');
  }

  getFieldByLabel(fieldType: FieldTypes) {
    return cy.get(`label[for="type${fieldType}"]`);
  }

  getAddOptionButton() {
    return getItemByTestId('addOption');
  }

  getOptionTextInput() {
    return cy.get('#option_for_save');
  }

  getSaveOptionButton() {
    return getItemByTestId('saveOption');
  }

  getAddConsentButton() {
    return getItemByTestId('addConsentButton');
  }

  getSaveConsentButton() {
    return getItemByTestId('saveConsentButton');
  }

  getCkeditorComponent() {
    return cy.get('ckeditor');
  }

  getEditFieldButton() {
    return getItemByTestId('editField');
  }

  getFieldSettingsByIndex(index: number) {
    return getItemByTestId('fieldSettingsButton').eq(index);
  }

  getUseDictionaryButton() {
    return getItemByTestId('useDictionary');
  }

  getDictionaryLevelInfo() {
    return getItemByTestId('dictionaryLevelInfo');
  }

  getDictionaryLevelTitle() {
    return getItemByTestId('dictionaryLevelTitle');
  }

  getDictionaryLevelPlaceholder() {
    return getItemByTestId('dictionaryLevelPlaceholder');
  }

  getOneConsentSectionHeader() {
    return getItemByTestId('oneConsentSectionHeader');
  }

  getOneConsentPopup() {
    return cy.get('one-consent');
  }

  getUseDictionaryListItem(name: string) {
    return getItemByTestId('dictionariesList').find('.mat-line').contains(name).parentsUntil('mat-list-item');
  }

  getUsedDictionary() {
    return getItemByTestId('usedDictionary');
  }

  getDynamicStatesHeader() {
    return getItemByTestId('dynamicStatesHeader');
  }

  getDynamicStatesFieldCheckbox() {
    return getItemByTestId('dynamicStatesFieldCheckbox').find('input');
  }

  getDynamicStatesOfFieldSelect() {
    return getItemByTestId('dynamicStatesOfFieldSelect').find('.mat-select-trigger');
  }

  getStateQueryCommandInput() {
    return getItemByTestId('stateQueryCommandInput').find('input');
  }

  getEditQueryCommandBtn() {
    return getItemByTestId('editQueryCommandBtn');
  }

  submitAddFieldForm() {
    this.getSubmitButton().click();
    this.getComponent().should('not.exist');
  }

  setQuestionTitle(fieldType: FieldTypes, questionTitle?: string) {
    this.getQuestionTitleInput().type(questionTitle || `Etykieta pola ${fieldType}`);
  }

  addNewField(fieldType: FieldTypes, questionTitle?: string, additionalDescription?: string) {
    this.getFieldByLabel(fieldType).click();
    this.setQuestionTitle(fieldType, questionTitle);
    if (additionalDescription) {
      typeToWysiwyg(additionalDescription);
    }
    this.submitAddFieldForm();
  }

  addNewFieldWithOptions(
    fieldType: FieldTypes,
    options: string[],
    questionTitle?: string,
    additionalDescription?: string
  ) {
    this.getFieldByLabel(fieldType).click();
    this.setQuestionTitle(fieldType, questionTitle);
    options.forEach((option) => {
      this.addOption(option);
    });
    if (additionalDescription) {
      typeToWysiwyg(additionalDescription);
    }
    this.submitAddFieldForm();
  }

  addFieldWithDictionary(
    fieldType: FieldTypes.CHECKBOX | FieldTypes.SELECT | FieldTypes.RADIO,
    labelName: string,
    dictionaryName: string
  ) {
    this.getFieldByLabel(fieldType).click();
    this.getQuestionTitleInput().type(labelName);
    this.getUseDictionaryButton().click();
    this.getUseDictionaryListItem(dictionaryName).find('button').click();
    this.getUsedDictionary().should('contain.text', dictionaryName);
  }

  editFieldQuestionTitle(text: string) {
    this.getQuestionTitleInput().clear().type(text);
    this.submitAddFieldForm();
  }

  addOption(optionValue: string) {
    this.getAddOptionButton().click();
    this.getOptionTextInput().type(optionValue);
    this.getSaveOptionButton().click();
  }

  addNewConsent({ consentTechName, consentText }: { consentTechName: string; consentText: string }) {
    this.getFieldByLabel(FieldTypes.CONSENT_SECTION).click();
    cy.get('#consentTechName').type(consentTechName);
    this.getAddConsentButton().click();
    this.getCkeditorComponent().should('be.visible');
    this.setConsentText(consentText);
    this.getSaveConsentButton().click();
    this.getOneConsentPopup().should('not.exist');
    this.submitAddFieldForm();
  }

  addConsentText({ fieldIndex }: { fieldIndex: number }, text?: string) {
    this.getFieldSettingsByIndex(fieldIndex).click();
    this.getEditFieldButton().click({ force: true });
    this.getAddConsentButton().click();
    this.setConsentText(text);
    this.getSaveConsentButton().click();
    this.getOneConsentPopup().should('not.exist');
    this.submitAddFieldForm();
  }

  setConsentText(text: string) {
    typeToWysiwyg(text);
  }

  removeConsentText({ fieldIndex, consentIndex }: { fieldIndex: number; consentIndex: number }) {
    this.getFieldSettingsByIndex(fieldIndex).click();
    this.getEditFieldButton().click({ force: true });
    getItemByTestId('removeConsentButton').eq(consentIndex).click();
    this.submitAddFieldForm();
  }

  editConsent({ fieldIndex, consentIndex }: { fieldIndex: number; consentIndex: number }, text: string) {
    this.getFieldSettingsByIndex(fieldIndex).click();
    this.getEditFieldButton().click({ force: true });
    getItemByTestId('editConsentButton').eq(consentIndex).click();
    this.setConsentText(text);
    this.getSaveConsentButton().click();
    this.getOneConsentPopup().should('not.exist');
    this.submitAddFieldForm();
  }

  editQuestionTitleByIndex(fieldIndex: number, title: string) {
    this.getFieldSettingsByIndex(fieldIndex).click();
    this.getEditFieldButton().click({ force: true });
    this.editFieldQuestionTitle(title);
  }

  openEditionPopupForField(index: number) {
    this.getFieldSettingsByIndex(index).click();
    this.getEditFieldButton().click({ force: true });
  }

  chooseDynamicStateForField(stateName: string) {
    this.getDynamicStatesOfFieldSelect().click({force: true}).then(() => {
      getOptionByLabel(stateName).click();
    });
  }
}
