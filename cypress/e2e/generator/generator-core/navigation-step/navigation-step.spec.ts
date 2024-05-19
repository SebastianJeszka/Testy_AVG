import {
  closeSimpleSnackBar,
  generateFormNameWithDate,
  getSimpleSnackBarWithText,
  waitForDialogClosed
} from 'cypress/utils';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { FormListPage } from '../../form-list/forms-list.po';
import { GeneratorPage } from '../generator-component/generator-component.po';
import { NavigationStep } from './navigation-step.po';

describe('navigation steps', () => {
  const formListPage = new FormListPage();
  const navigationSteps = new NavigationStep();
  const generatorPage = new GeneratorPage();
  let formId: string;
  let formName: string;

  before(() => {
        formListPage.navigateTo();
        formListPage.waitForForms();
        formListPage.chooseFormWithName(formName);
  });

  it('adds one new tab', () => {
    generatorPage.createTab('Strona 2');
    generatorPage.switchToPageWithLabel('Strona 2');
    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.NUMBER);
    generatorPage.getFieldWithLabel('Etykieta pola NUMBER').should('be.visible');
  });

  it('shows navigation steps form', () => {
    navigationSteps.enableNavigationSteps();
    navigationSteps.getComponent().should('be.visible');
  });

  it('creates only three navigation steps and hides add new navigation step button', () => {
    navigationSteps.addNavigationStep('Krok 1', 0);
    navigationSteps.getAddStepButton().should('exist');
    navigationSteps.getNavigationStepButtonUp(0).should('not.exist');
    navigationSteps.getNavigationStepButtonDown(0).should('not.exist');

    navigationSteps.addNavigationStep('Krok 2', 1);
    navigationSteps.getAddStepButton().should('exist');
    navigationSteps.getNavigationStepButtonUp(0).should('not.exist');
    navigationSteps.getNavigationStepButtonDown(0).should('exist');
    navigationSteps.getNavigationStepButtonUp(1).should('exist');
    navigationSteps.getNavigationStepButtonDown(1).should('not.exist');

    navigationSteps.addNavigationStep('Krok 3', 2);
    navigationSteps.getAddStepButton().should('not.exist');
    navigationSteps.getNavigationStepButtonUp(0).should('not.exist');
    navigationSteps.getNavigationStepButtonDown(0).should('exist');
    navigationSteps.getNavigationStepButtonUp(1).should('exist');
    navigationSteps.getNavigationStepButtonDown(1).should('exist');
    navigationSteps.getNavigationStepButtonUp(2).should('exist');
    navigationSteps.getNavigationStepButtonDown(2).should('not.exist');
  });

  it('checks navigation steps correct order after add three steps', () => {
    navigationSteps.checkNavigationStepsCorrectOrder(['Krok 1', 'Krok 2', 'Krok 3']);
  });

  it('change navigation steps order', () => {
    navigationSteps.getNavigationStepButtonDown(0).click();
    navigationSteps.getNavigationStepButtonDown(1).click();
    navigationSteps.getNavigationStepButtonUp(1).click();
    navigationSteps.getNavigationStepButtonUp(1).click();
    navigationSteps.checkNavigationStepsCorrectOrder(['Krok 2', 'Krok 3', 'Krok 1']);
  });

  it('prevents from save form containing page without navigation steps assigned', () => {
    generatorPage.saveForm();
    getSimpleSnackBarWithText('Każda strona musi mieć przypisany krok nawigacji').should('be.visible');
    closeSimpleSnackBar();
  });

  it('assigns steps into pages', () => {
    generatorPage.openTabEditPopup('Strona 1');
    navigationSteps.clickStepOption('Krok 1');
    generatorPage.saveTabEditPopup();

    generatorPage.openTabEditPopup('Strona 2');
    navigationSteps.clickStepOption('Krok 2');
    generatorPage.saveTabEditPopup();

    generatorPage.openTabEditPopup('Strona końcowa');
    navigationSteps.clickStepOption('Krok 3');
    generatorPage.saveTabEditPopup();

    waitForDialogClosed();
  });

  it('save form with assigned steps', () => {
    generatorPage.saveForm();
    getSimpleSnackBarWithText('Formularz został zapisany!').should('be.visible');
    closeSimpleSnackBar();
  });
});
