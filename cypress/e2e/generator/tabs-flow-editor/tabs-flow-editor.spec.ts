import { chooseFormWithName, navigateToBaseUrl } from 'cypress/utils';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { DefaultTabLabels, TabType } from 'src/app/_shared/models/tab.model';
import { GeneratorPage } from '../generator-core/generator-component/generator-component.po';
import { AddLinkFormPO } from './add-link-form-component.po';
import { TabsFlowViewPO } from './tabs-flow-component.po';

describe('tabs flow editor (flow graph)', () => {
  const generatorPage = new GeneratorPage();
  const tabsFlowPage = new TabsFlowViewPO();
  const addLinkFormPage = new AddLinkFormPO();
  const testPageName = 'Strona 2';
  const step2Name = 'Krok 2';
  let formId: string;

  before(() => {
      navigateToBaseUrl();
  
    });

    generatorPage.createTab(testPageName);
    generatorPage.switchToPageWithLabel(testPageName);
    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.NUMBER);
    generatorPage.openAddFieldForm();
    generatorPage.addNewField(FieldTypes.TEXT_BLOCK);
    generatorPage.saveForm();

  it('should navigate to tabs flow view', () => {
    generatorPage.goToTabsFlowComponent();
    cy.url().should('include', '/generator/flow/');
    tabsFlowPage
      .getGraphValidationMessage()
      .should('exist')
      .should('contain.text', ' Nie dodano żadnego przejścia między stronami ');
    tabsFlowPage.getHeader().should('have.text', 'Zarządzaj przepływem stron');
    addLinkFormPage.getStartNodeSelect().should('exist');
    addLinkFormPage.getEndNodeSelect().should('exist');
  });

  it('[adding step] choose start and finish node - should be showed full configuration of step', () => {
    const addLinkFormPage = new AddLinkFormPO();
    addLinkFormPage.chooseOptionOfStepstSelects(addLinkFormPage.getStartNodeSelect(), DefaultTabLabels[TabType.MAIN]);
    addLinkFormPage.chooseOptionOfStepstSelects(addLinkFormPage.getEndNodeSelect(), DefaultTabLabels[TabType.FINISH]);
    addLinkFormPage.getDefaultStepCheckbox().should('exist');
    addLinkFormPage.getQueryNameInputForNewStep().should('exist');
    addLinkFormPage.getSaveLinkButton().should('exist');
  });

  it('[adding step] add new step that is default - should appear on graph', () => {
    addLinkFormPage.getSaveLinkButton().click();
    
    addLinkFormPage.getDefaultStepCheckbox().should('not.exist');
    tabsFlowPage.getOneLink().should('exist');
    tabsFlowPage.getSaveFlowButton().should('have.text', ' Zapisz zmiany * ');
  });

  it('[edition step] open edition popup for default step - should appear config for default step without queries', () => {
    tabsFlowPage.getOneLink().click();
    addLinkFormPage.getEditStepHeader().should('have.text', 'Edytuj krok');
    addLinkFormPage.getEditStepQueryNameInput().should('exist');
    addLinkFormPage.getEditStepStartNodeSelect().should('exist');
    addLinkFormPage.getEditStepEndNodeSelect().should('exist');
    addLinkFormPage.getDefaultStepCheckbox().find('input').should('be.checked');
    addLinkFormPage.getEditStepQueryBuilder().should('not.exist');
    addLinkFormPage.getEditStepCloseButton().click();
    addLinkFormPage.getStartNodeSelect().should('exist');
    addLinkFormPage.getEditStepHeader().should('not.exist');
  });

  it('[adding step] add new step - should appear quieries config and errors after save without queries and step name', () => {
    addLinkFormPage.chooseOptionOfStepstSelects(addLinkFormPage.getStartNodeSelect(), DefaultTabLabels[TabType.MAIN]);
    addLinkFormPage.chooseOptionOfStepstSelects(addLinkFormPage.getEndNodeSelect(), testPageName);
    addLinkFormPage.getQueryBuilderForStep().should('exist');
    addLinkFormPage.getSaveLinkButton().click();
    addLinkFormPage
      .getQueryNameInputForNewStep()
      .find('#queryName-describedby')
      .should('exist')
      .should('contain.text', ' Pole jest wymagane ');
    addLinkFormPage
      .getQueryBuilderErrorInfo()
      .should('exist')
      .should('contain.text', ' Muszą być dodane warunki przejścia jeśli krok nie jest domyślny ');
    tabsFlowPage
      .getGraphValidationMessage()
      .should('exist')
      .should('contain.text', ' Nie wszystkie strony zostały połączone przejściami ');
  });

  it('[adding step] add new step (second) with queiries - should appear second step on graph', () => {
    addLinkFormPage.getQueryNameInputForNewStep().type(step2Name);
    addLinkFormPage.addSimpleRule();
    addLinkFormPage.getQueryValueInput().type('1');
    addLinkFormPage.getSaveLinkButton().click();
    tabsFlowPage.getOneLink().contains(step2Name).should('exist');
  });

  it('[edition step] open edition popup for step with query - should appear config for step with queries', () => {
    tabsFlowPage.getOneLink().contains(step2Name).click();
    addLinkFormPage.getEditStepHeader().should('have.text', 'Edytuj krok');
    addLinkFormPage.getEditStepQueryNameInput().should('exist');
    addLinkFormPage.getEditStepStartNodeSelect().should('exist');
    addLinkFormPage.getEditStepEndNodeSelect().should('exist');
    addLinkFormPage.getEditStepDefaultStepChechbox().find('input').should('not.be.checked');
    addLinkFormPage.getEditStepQueryBuilder().should('exist');
    addLinkFormPage.getEditStepCloseButton().click();
  });

  it('[edition step] change step name - should be changed name and new name should be visible on graph', () => {
    const newName = 'Krok 2 edited';
    tabsFlowPage.getOneLink().contains(step2Name).click();
    addLinkFormPage.getEditStepQueryNameInput().clear().type(newName);
    addLinkFormPage.getSaveEditionStepButton().click();
    tabsFlowPage.getOneLink().contains(newName).should('exist');
    // back to previous value
    tabsFlowPage.getOneLink().contains(newName).click();
    addLinkFormPage.getEditStepQueryNameInput().clear().type(step2Name);
    addLinkFormPage.getSaveEditionStepButton().click();
    tabsFlowPage.getOneLink().contains(step2Name).should('exist');
  });

  it('[edition step] change default step - another step should be deafult', () => {
    tabsFlowPage.getOneLink().contains(step2Name).click();
    addLinkFormPage.getEditStepDefaultStepChechbox().find('input').check({ force: true });
    addLinkFormPage.getEditStepQueryBuilder().should('not.exist');
    addLinkFormPage.getEditStepCloseButton().click();
  });

  // TODO: change different step queries (when will be opportunity to check queries with renderer)

  it('[remove step] should remove default step - step should be removed', () => {
    tabsFlowPage.getOneLink().contains(' Domyślny ').click({ force: true });
    addLinkFormPage.getRemoveStepButtonFromPopup().click();
    tabsFlowPage.getOneLink().contains(' Domyślny ').should('not.exist');
  });

  it('[remove step] should remove step with quries - step should be removed', () => {
    tabsFlowPage.getOneLink().contains(step2Name).click({ force: true });
    addLinkFormPage.getRemoveStepButtonFromPopup().click();
    tabsFlowPage.getOneLink().contains(step2Name).should('not.exist');
    tabsFlowPage
      .getGraphValidationMessage()
      .should('exist')
      .should('contain.text', ' Nie dodano żadnego przejścia między stronami ');
  });

});

