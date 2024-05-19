import { closeSimpleSnackBar, confirmOperation, getItemByTestId, getSimpleSnackBarWithText } from 'cypress/utils';
import { FieldTypes } from '../../../../../src/app/_shared/models/field-types.enum';

export class GeneratorPage {
  private _formTechName: string;
  public get formTechName(): string {
    return this._formTechName;
  }
  public set formTechName(value: string) {
    this._formTechName = value;
  }

  navigateToNewForm() {
    cy.visit('#/generator/new');
  }

  getHeader() {
    return getItemByTestId('generatorHeader');
  }

  getBackLink() {
    return getItemByTestId('backToIndex');
  }

  getGeneratorPageLink() {
    return getItemByTestId('generatorPageLink');
  }

  getAddFieldButton() {
    return getItemByTestId('addField');
  }

  getChooseFormTypeLabel() {
    return getItemByTestId('chooseFormTypeParagraph');
  }

  getChooseFormTypeRadioButtons() {
    return cy.get('mc-input-radio[name=formType]');
  }

  getFormTechName() {
    return cy.get('#formTechName');
  }

  getRepeatingSectionTechName() {
    return getItemByTestId('repeatingSectionTechName');
  }

  getAllFieldsFromActivePage() {
    return getItemByTestId('fieldItem');
  }

  getFieldWithLabel(label: string) {
    return this.getAllFieldsFromActivePage().find('h2').contains(label);
  }

  getFieldCheckboxes(label: string) {
    return this.getFieldWithLabel(label)
      .parentsUntil('question-field')
      .find('mc-input-checkbox')
  }

  getFieldRadioButtons(label: string) {
    return this.getFieldWithLabel(label)
      .parentsUntil('question-field')
      .find('mc-input-radio');
  }

  getFieldSelects(label: string) {
    return this.getFieldWithLabel(label)
      .parentsUntil('question-field')
      .find('mc-input-select');
  }

  getConsentWithText(text: string) {
    return getItemByTestId('consentDescription').find('p').contains(text);
  }

  getComponentFromActivePage(componentType: string) {
    return this.getAllFieldsFromActivePage().find(`article.question__body ${componentType}`);
  }

  getAllTabs() {
    return cy.get('.mat-tab-label-content');
  }

  getTabContainingLabel(label: string) {
    return this.getAllTabs().filter(`:contains(${label})`);
  }

  getTabSettingsButton(tabName: string) {
    return this.getTabContainingLabel(tabName).find('button');
  }

  getTabEditSaveButton() {
    return getItemByTestId('editTabPopupSave');
  }

  getFieldSettingsByIndex(index: number) {
    getItemByTestId('fieldSettingsButton').eq(index).click();
  }

  getRemoveFieldOptionItem() {
    return getItemByTestId('removeField');
  }

  getMoveFieldOptionItem() {
    return getItemByTestId('moveField');
  }

  getPageOptionWithLabel(pageLabel: string) {
    return cy.get('button.mat-menu-item').filter(`:contains(${pageLabel})`);
  }

  getActiveTabLabel() {
    return cy.get('.mat-tab-label-active > .mat-tab-label-content');
  }

  getSaveFormButton() {
    return getItemByTestId('saveFormButton');
  }

  getChangeStatusToPendingButton() {
    return getItemByTestId('changeStatusToPendingButton');
  }

  getNewSketchButton() {
    return getItemByTestId('newSketchButton');
  }

  getFormSettingsButton() {
    return getItemByTestId('formSettingsButton');
  }

  getGraphValidationMessage(){
    return getItemByTestId('graphValidationMessage');
  }

  getForm() {
    return getItemByTestId('generatorForm');
  }

  goToTabsFlowComponent() {
    getItemByTestId('tabsFlowComponentLink').click({force: true})
  }

  saveTabEditPopup() {
    this.getTabEditSaveButton().click();
  }

  openAddFieldForm() {
    this.getAddFieldButton().click();
  }

  addNewField(fieldType: FieldTypes, customFieldTitle?: string) {
    cy.get(`label[for="type${fieldType}"]`).click();
    if(customFieldTitle){
      cy.get('#questionTitle').type(customFieldTitle);
    } else {
      cy.get('#questionTitle').type(`Etykieta pola ${fieldType}`);
    }
    getItemByTestId('submitAddFieldButton').click();
  }

  addRepeatingSection(sectionName: string) {
    getItemByTestId('addRepeatingSection').click();
    cy.get('#sectionName').type(sectionName);

    cy.get('#questionTechName_0').type('Pole 1');
    cy.get('#inputType_0').click();
    cy.get('[ng-reflect-value="TEXT_FIELD"').click();
    getItemByTestId('addNewFieldInRepeatingSection').click();

    cy.get('#questionTechName_1').type('Pole 2');
    cy.get('#inputType_1').click();
    cy.get('[ng-reflect-value="TEXT_FIELD"').click();
    getItemByTestId('saveRepeatingSection').click();
  }

  createTab(tabName: string) {
    getItemByTestId('newTabName').type(tabName);
    getItemByTestId('addNewTab').click();
  }

  deleteTab(tabName: string) {
    this.getTabContainingLabel(tabName).click();
    getItemByTestId('removeTab').click();
    confirmOperation();
  }

  deleteFieldByIndex(fieldIndex: number) {
    this.getFieldSettingsByIndex(fieldIndex);
    this.getRemoveFieldOptionItem().click({ force: true });
    confirmOperation();
  }

  moveFieldToPage({ fieldIndex, pageLabel }) {
    this.getFieldSettingsByIndex(fieldIndex);
    this.getMoveFieldOptionItem().click({ force: true });
    this.getPageOptionWithLabel(pageLabel).click({ force: true });
  }

  switchToPageWithLabel(label: string) {
    this.getTabContainingLabel(label).click();
  }

  openTabEditPopup(tabName: string) {
    this.getTabSettingsButton(tabName).click();
    getItemByTestId('editTabButton').click({ force: true });
  }

  setFormTechName(formTechName: string): void {
    this.formTechName = formTechName;
    this.getFormTechName().type(formTechName);
  }

  saveForm() {
    this.getSaveFormButton().click();
  }

  createForm(formName: string) {
    this.setFormTechName(formName);

    this.openAddFieldForm();
    this.addNewField(FieldTypes.TEXT_FIELD);
    this.getFieldWithLabel('Etykieta pola TEXT_FIELD').should('exist');

    this.switchToPageWithLabel('Strona końcowa');
    this.openAddFieldForm();
    this.addNewField(FieldTypes.TEXTAREA);
    this.getFieldWithLabel('Etykieta pola TEXTAREA').should('exist');

    this.saveForm();

    getSimpleSnackBarWithText('Formularz został zapisany!').should('exist');

    closeSimpleSnackBar();
  }
}
