import { fail } from 'assert';
import { AuthPage } from 'cypress/e2e/auth/auth.po';
import {
  closePopup,
  closeSimpleSnackBar,

  generateFormNameWithDate,
  getSimpleSnackBarWithText,
  navigateToBaseUrl,
} from 'cypress/utils';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { FormVersionTypes, RegistrationConfirmationType } from 'src/app/_shared/models/form-version.model';
import { ProcessType, ProcessTypeLabels } from 'src/app/_shared/models/process-of-node.model';
import { DefaultTabLabels, TabType } from 'src/app/_shared/models/tab.model';
import { FormListPage } from '../form-list/forms-list.po';
import { GeneratorPage } from '../generator-core/generator-component/generator-component.po';
import { SettingsPopup } from '../generator-core/settings-popup/settings-popup.po';
import { AddLinkFormPO } from '../tabs-flow-editor/add-link-form-component.po';
import { TabsFlowViewPO } from '../tabs-flow-editor/tabs-flow-component.po';
import { ProcessPopupPO } from '../tabs-flow-editor/tabs-flow-processes/process-popup.po';
import { RegistrationFormPo } from './registration-form.po';

describe('settings popup', () => {
  const formListPage = new FormListPage();
  const generatorPage = new GeneratorPage();
  const addLinkFormPage = new AddLinkFormPO();
  const processPopupPage = new ProcessPopupPO();
  const tabsFlowPage = new TabsFlowViewPO();
  const registerFormPage = new RegistrationFormPo();
  const settingsPopup = new SettingsPopup();

  let formId: string;
  let formName: string;
  let registrationFormId: string;
  const registrationFormName = generateFormNameWithDate() + ' registration';

  before(() => {
        navigateToBaseUrl();
  });

  it('check is registration form is visible on forms list', () => {
    formListPage.getFormWithName(registrationFormName).should('exist');
  });

  it('navigate to registration form', () => {
    formListPage.chooseFormWithName(registrationFormName);
    cy.url().should('include', `/generator/view/${registrationFormId}`);
  });

  it('navigate to tabs flow view and set default links', () => {
    generatorPage.goToTabsFlowComponent();
    addLinkFormPage.chooseOptionOfStepstSelects(addLinkFormPage.getStartNodeSelect(), DefaultTabLabels[TabType.MAIN]);
    addLinkFormPage.chooseOptionOfStepstSelects(addLinkFormPage.getEndNodeSelect(), DefaultTabLabels[TabType.FINISH]);
    addLinkFormPage.getSaveLinkButton().click();
    tabsFlowPage.getOneLink().should('exist');
  });

  it('set register process and save flow', () => {
    tabsFlowPage.openProcessPopupForNode(DefaultTabLabels[TabType.FINISH]);
    processPopupPage.enableProcess('before');
    processPopupPage.chooseProcessType(ProcessTypeLabels[ProcessType.USER_REGISTRATION]);
    processPopupPage.getProcessTechName().type('register');
    processPopupPage.getSaveProcessEdition().click();
    tabsFlowPage.getOneNodeByLabel(DefaultTabLabels[TabType.FINISH]).find('div.process.process-left');
    tabsFlowPage.getSaveFlowButton().click();
    tabsFlowPage.getBackToGeneratorLink().click();
    generatorPage.getGraphValidationMessage().should('not.exist');
  });

  it('checks validation register confirmation type via pz', () => {
    registerFormPage.getRegistrationConfirmationType('przez Profil Zaufany').click();
    generatorPage.getSaveFormButton().click();
    getSimpleSnackBarWithText(
      'Wybrałeś sposób potwierdzenia rejestracji poprzez Profil zaufany. Musisz wskazać pole email, pesel i identyfikator.'
    ).should('exist');
    closeSimpleSnackBar();
  });

  it('add new fields to validate confirmation type via email', () => {
    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.TEXT_FIELD, 'custom_text_pz_1');

    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.TEXT_FIELD, 'custom_text_pz_2');

    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.TEXT_FIELD, 'custom_text_pz_3');

    cy.wait(500);

    generatorPage.getFieldWithLabel('custom_text_pz_1').should('exist');
    generatorPage.getFieldWithLabel('custom_text_pz_2').should('exist');
    generatorPage.getFieldWithLabel('custom_text_pz_3').should('exist');
  });

  it('set register process techname to bind field with e-mail and save form', () => {

    generatorPage
      .getFieldWithLabel('custom_text_pz_1')
      .parentsUntil('question-field')
      .find('input')
      .type('{{register.email}}', {
        parseSpecialCharSequences: false
      });
    generatorPage
      .getFieldWithLabel('custom_text_pz_2')
      .parentsUntil('question-field')
      .find('input')
      .type('{{register.pesel}}', {
        parseSpecialCharSequences: false
      });
    generatorPage
      .getFieldWithLabel('custom_text_pz_3')
      .parentsUntil('question-field')
      .find('input')
      .type('{{register.identyfikator}}', {
        parseSpecialCharSequences: false
      });

    generatorPage.getSaveFormButton().click();
    getSimpleSnackBarWithText('Formularz został zapisany!').should('exist');
    closeSimpleSnackBar();
  });

  it('checks validation register confirmation type via e-mail', () => {
    registerFormPage.getRegistrationConfirmationType('przez e-mail').click();
    generatorPage.getSaveFormButton().click();
    getSimpleSnackBarWithText(
      'Wybrałeś sposób potwierdzenia rejestracji poprzez adres e-mail. Musisz wskazać pole imię, nazwisko, email, pesel i identyfikator.'
    ).should('exist');
    closeSimpleSnackBar();
  });

  it('add new fields to validate confirmation type via pz', () => {
    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.TEXT_FIELD, 'custom_text_1');

    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.TEXT_FIELD, 'custom_text_2');

    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.TEXT_FIELD, 'custom_text_3');

    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.TEXT_FIELD, 'custom_text_4');

    cy.wait(500);

    generatorPage.getFieldWithLabel('custom_text_1').should('exist');
    generatorPage.getFieldWithLabel('custom_text_2').should('exist');
    generatorPage.getFieldWithLabel('custom_text_3').should('exist');
    generatorPage.getFieldWithLabel('custom_text_4').should('exist');
  });

  it('bind fields with name, surname and save form', () => {
    generatorPage
      .getFieldWithLabel('custom_text_1')
      .parentsUntil('question-field')
      .find('input')
      .type('{{register.imie}}', {
        parseSpecialCharSequences: false
      });
    generatorPage
      .getFieldWithLabel('custom_text_2')
      .parentsUntil('question-field')
      .find('input')
      .type('{{register.nazwisko}}', {
        parseSpecialCharSequences: false
      });
    generatorPage
      .getFieldWithLabel('custom_text_3')
      .parentsUntil('question-field')
      .find('input')
      .type('{{register.pesel}}', {
        parseSpecialCharSequences: false
      });
    generatorPage
      .getFieldWithLabel('custom_text_4')
      .parentsUntil('question-field')
      .find('input')
      .type('{{register.identyfikator}}', {
        parseSpecialCharSequences: false
      });
    generatorPage.getSaveFormButton().click();
    getSimpleSnackBarWithText('Formularz został zapisany!').should('exist');
    closeSimpleSnackBar();
  });

  it('back to forms list and create default form', () => {
        navigateToBaseUrl();
        formListPage.waitForForms();
  });

  it('check is default form is visible on forms list', () => {
    formListPage.getFormWithName(formName).should('exist');
  });

  it('navigate to default form', () => {
    formListPage.chooseFormWithName(formName);
    cy.url().should('include', `/generator/view/${formId}`);
  });

  it('open settings popup and set access form settings tab', () => {
    generatorPage.getFormSettingsButton().click();
    settingsPopup.getSettingsMenuItem().click();
    settingsPopup.getHeader().should('have.text', 'Ustawienia');

    settingsPopup.getTabs().eq(0).should('have.attr', 'aria-selected', 'true');
    settingsPopup.getTabs().eq(1).should('have.attr', 'aria-selected', 'false');
    settingsPopup.getTabs().eq(2).should('have.attr', 'aria-selected', 'false');

    settingsPopup.getTabs().eq(2).click();

    settingsPopup.getTabs().eq(0).should('have.attr', 'aria-selected', 'false');
    settingsPopup.getTabs().eq(1).should('have.attr', 'aria-selected', 'false');
    settingsPopup.getTabs().eq(2).should('have.attr', 'aria-selected', 'true');
  });

  it('set register form into default form options', () => {
    settingsPopup.getAccessFormConfigCheckbox().find('input').check({ force: true });
    settingsPopup.getAccessFormListSelect().click();
    cy.get('mat-option').contains(registrationFormName).click({ force: true });
    settingsPopup.getRegisteredUsersListComponent().should('exist');
    settingsPopup.getAccessFormSaveButton().click();
    getSimpleSnackBarWithText('Zmiany zostały zastosowane').should('exist');
    closeSimpleSnackBar();
  });
});
