import {
  closeSimpleSnackBar,
  generateFormNameWithDate,
  getSimpleSnackBarWithText,
  navigateToBaseUrl,
} from 'cypress/utils';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { DefaultTabLabels, TabType } from 'src/app/_shared/models/tab.model';
import { AuthPage } from '../../../auth/auth.po';
import { AddFieldFormPopup } from '../../add-field-form/add-field-form.po';
import { FormListPage } from '../../form-list/forms-list.po';
import { FormHistory } from '../form-history/form-history.po';
import { GeneratorPage } from './generator-component.po';

describe('generator component', () => {
  const authPage = new AuthPage();
  const formListPage = new FormListPage();
  const generatorPage = new GeneratorPage();
  const formHistory = new FormHistory();
  const addFieldFormPopup = new AddFieldFormPopup();
  let firstFormId: string;
  let secondFormId: string;

  before(() => {
        navigateToBaseUrl();
  });

  it('navigates to proper url at form version edit page', () => {
    cy.url().should('include', '/generator/view/');
  });

  it('presents header "Edycja formularza" in edit form mode', () => {
    generatorPage.getHeader().should('have.text', 'Edycja formularza');
  });

  it('allows form changing form type in edit mode', () => {
    generatorPage.getChooseFormTypeLabel().should('exist');
    generatorPage.getChooseFormTypeRadioButtons().should('exist');
  });

  it('presents form history component in edit mode', () => {
    formHistory.getComponent().should('be.visible');
  });

  it('presents form settings button in edit mode', () => {
    generatorPage.getFormSettingsButton().should('be.visible');
  });

  it('navigates back to form list after back link clicked', () => {
    generatorPage.getBackLink().click();

    cy.url().should('include', '/generator');
    authPage.getLogoutButton().should('be.visible');
    formListPage.getHeader().should('be.visible');
    formListPage.getAddNewFormButton().should('be.visible');
    formListPage.getHeader().should('have.text', 'Formularze (Ankiety)');
  });

  it('navigates to create new form page', () => {
    formListPage.navigateToAddForm();

    cy.url().should('include', '/generator/new');
    generatorPage.getHeader().should('have.text', 'Nowy formularz');
    generatorPage.getChooseFormTypeLabel().should('be.visible');
    generatorPage.getChooseFormTypeRadioButtons().should('be.visible');
  });

  it('hides form history component in new form mode', () => {
    formHistory.getComponent().should('not.exist');
  });

  it('hides form settings button in new form mode', () => {
    generatorPage.getFormSettingsButton().should('not.exist');
  });

  it('creates field of type: TEXTFIELD as first field on first page', () => {
    generatorPage.getAllFieldsFromActivePage().should('have.length', 0);

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.TEXT_FIELD);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 1);
    generatorPage.getFieldWithLabel('Etykieta pola TEXT_FIELD').should('be.visible');
    generatorPage.getComponentFromActivePage('mc-input-text input[type=text]').should('be.visible');
  });

  it('switches to second page', () => {
    generatorPage.getActiveTabLabel().should('contain.text', DefaultTabLabels[TabType.MAIN]);

    generatorPage.switchToPageWithLabel(DefaultTabLabels[TabType.FINISH]);

    generatorPage.getActiveTabLabel().should('contain.text', DefaultTabLabels[TabType.FINISH]);
  });

  it('creates field of type: TEXTAREA as first field on second page', () => {
    generatorPage.getAllFieldsFromActivePage().should('have.length', 0);

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.TEXTAREA);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 1);
    generatorPage.getFieldWithLabel('Etykieta pola TEXTAREA').should('be.visible');
    generatorPage.getComponentFromActivePage('mc-input-textarea').should('be.visible');
  });

  it('adds repeating section with two text fields on second page', () => {
    generatorPage.getAllFieldsFromActivePage().should('have.length', 1);

    generatorPage.addRepeatingSection('Sekcja pól');

    generatorPage.getAllFieldsFromActivePage().should('have.length', 2);
  });

  it('have initially two tabs (pages) created', () => {
    generatorPage.getAllTabs().should('have.length', 2);
  });

  it('moves first field from "Strona końcowa" to "Strona 1" and switches to "Strona 1"', () => {
    generatorPage.getActiveTabLabel().should('contain.text', DefaultTabLabels[TabType.FINISH]);

    generatorPage.moveFieldToPage({ fieldIndex: 0, pageLabel: DefaultTabLabels[TabType.MAIN] });

    generatorPage.getActiveTabLabel().should('contain.text', DefaultTabLabels[TabType.MAIN]);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 2);
    generatorPage.getFieldWithLabel('Etykieta pola TEXTAREA').should('be.visible');
    generatorPage.getComponentFromActivePage('mc-input-textarea').should('be.visible');
  });

  it('moves first field from "Strona 1" to "Strona 1" and switches to "Strona końcowa"', () => {
    generatorPage.getActiveTabLabel().should('contain.text', DefaultTabLabels[TabType.MAIN]);

    generatorPage.moveFieldToPage({ fieldIndex: 0, pageLabel: DefaultTabLabels[TabType.FINISH] });

    generatorPage.getActiveTabLabel().should('contain.text', DefaultTabLabels[TabType.FINISH]);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 2);
    generatorPage.getFieldWithLabel('Etykieta pola TEXT_FIELD').should('be.visible');
    generatorPage.getComponentFromActivePage('mc-input-text input[type=text]').should('be.visible');
  });

  it('creates new tab (page)', () => {
    generatorPage.getAllTabs().each(($tab) => {
      cy.wrap($tab).should('not.contain.text', 'Strona 2');
    });
    generatorPage.createTab('Strona 2');

    generatorPage.getActiveTabLabel().should('contain.text', DefaultTabLabels[TabType.FINISH]);
    generatorPage.getTabContainingLabel('Strona 2').should('be.visible');
    generatorPage.getAllTabs().should('have.length', 3);
  });

  it('deletes newly created tab', () => {
    generatorPage.getAllTabs().should('have.length', 3);

    generatorPage.deleteTab('Strona 2');

    generatorPage.getAllTabs().each(($tab) => {
      cy.wrap($tab).should('not.contain.text', 'Strona 2');
    });
    generatorPage.getActiveTabLabel().should('contain.text', DefaultTabLabels[TabType.FINISH]);
  });

  it('creates new form and present success snack bar', () => {
    generatorPage.setFormTechName(generateFormNameWithDate());
    generatorPage.saveForm();

    getSimpleSnackBarWithText('Formularz został zapisany!').should('be.visible');

    closeSimpleSnackBar();
  });

  it('returns to form list after new form created', () => {
    cy.url().should('include', '/generator');
  });

  it('presents newly created form in form list', () => {
    formListPage.getFormWithName(generatorPage.formTechName).should('be.visible');
  });

  it('navigates to form with given name', () => {
    formListPage.chooseFormWithName(generatorPage.formTechName);

    cy.url().then((url) => {
      secondFormId = url.substring(url.lastIndexOf('/') + 1);
    });

    generatorPage.getFormTechName().should('have.value', generatorPage.formTechName);
  });
});
