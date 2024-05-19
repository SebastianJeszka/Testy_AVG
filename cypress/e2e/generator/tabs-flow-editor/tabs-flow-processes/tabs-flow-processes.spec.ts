import { tabsWithEmailField } from 'cypress/fixtures/tabs-with-email-field.mock';
import { chooseFormWithName, createInitialAppState, navigateToBaseUrl, removeFormByApi } from 'cypress/utils';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { ProcessType, ProcessTypeLabels } from 'src/app/_shared/models/process-of-node.model';
import { DefaultTabLabels, TabType } from 'src/app/_shared/models/tab.model';
import { GeneratorPage } from '../../generator-core/generator-component/generator-component.po';
import { TabsFlowViewPO } from '../tabs-flow-component.po';

import { ProcessPopupPO } from './process-popup.po';

describe('tabs flow processes', () => {
  const processPopupPage = new ProcessPopupPO();
  const tabsFlowPage = new TabsFlowViewPO();
  const generatorPage = new GeneratorPage();

  let formId: string;

  before(() => {
    createInitialAppState({ type: FormVersionTypes.FORM, tabs: tabsWithEmailField }).then((resp) => {
      formId = resp.body?.formId;
      navigateToBaseUrl();
      chooseFormWithName(resp.body.name);
    });
  });

  it('should navigate to tabs flow view', () => {
    generatorPage.goToTabsFlowComponent();
    cy.url().should('include', '/generator/flow/');
  });

  it('[process] open process popup - should appear content', () => {
    tabsFlowPage.openProcessPopupForNode(DefaultTabLabels[TabType.MAIN]);
    processPopupPage.getProcessPopupHeader().should('exist');
    processPopupPage.getProcessEnableCheckbox().should('exist');
  });

  it('[process] enable process - shoud appear config of process', () => {
    processPopupPage.enableProcess('before');
    processPopupPage.getProcessTypeSelect().should('exist');
    processPopupPage.getProcessForCopiesCheckbox().should('exist');
  });

  it('[process login] choose type (Logowanie) of process - should appear config of specific type', () => {
    processPopupPage.chooseProcessType(ProcessTypeLabels[ProcessType.LOGIN]);
    processPopupPage.getAutoCompleteHeader().should('exist');
    processPopupPage.getAddAutocompleteFieldButton().should('exist');
  });

  it('[process login] setup config of autocomplete - should appear autocomplete config and validation should work', () => {
    processPopupPage.getAddAutocompleteFieldButton().click();
    processPopupPage.getSelectOfAutocompletePropFromMap(0).should('exist');
    processPopupPage.getSelectOfPageForAutocomplete(0).should('exist');
    processPopupPage.getSelectOfFieldForAutocomplete(0).should('exist');
  });

  it('[process login] setup config of autocomplete for 2 rows - should appear validation', () => {
    processPopupPage.choosePropForAutocomplete(0, 0);
    processPopupPage.choosePageForAutocomplete(0, 0);
    processPopupPage.chooseFieldForAutocomplete(0, 0);
    processPopupPage.getAddAutocompleteFieldButton().click();
    processPopupPage.choosePropForAutocomplete(1, 0);
    processPopupPage.choosePageForAutocomplete(1, 0);
    processPopupPage.chooseFieldForAutocomplete(1, 0);
    processPopupPage
      .getSelectOfAutocompletePropFromMap(0)
      .find('div.invalid-feedback')
      .should('contain.text', ' Ta wartość już wybrana ');
    processPopupPage
      .getSelectOfFieldForAutocomplete(0)
      .find('div.invalid-feedback')
      .should('contain.text', ' Ta wartość już wybrana ');
    processPopupPage
      .getSelectOfAutocompletePropFromMap(1)
      .find('div.invalid-feedback')
      .should('contain.text', ' Ta wartość już wybrana ');
    processPopupPage
      .getSelectOfFieldForAutocomplete(1)
      .find('div.invalid-feedback')
      .should('contain.text', ' Ta wartość już wybrana ');
  });

  it('[process login] change value for second select - should disappear error message', () => {
    processPopupPage.choosePropForAutocomplete(1, 1);
    processPopupPage.getSelectOfAutocompletePropFromMap(0).find('div.invalid-feedback').should('not.exist');
    processPopupPage.getSelectOfAutocompletePropFromMap(1).find('div.invalid-feedback').should('not.exist');
  });

  it('[process login] remove autocomplete config row - should disappear autocomplete config row', () => {
    processPopupPage.getRemoveAutocompleteRow(1).click();
    processPopupPage.getSelectOfAutocompletePropFromMap(1).should('not.exist');
    processPopupPage.getSelectOfPageForAutocomplete(1).should('not.exist');
    processPopupPage.getSelectOfFieldForAutocomplete(1).should('not.exist');
    processPopupPage.getCancelProcessEditionButton().click();
  });
  // TODO test login process on renderer

  it('[process redirect] enable redirect process - should appear redirect process config', () => {
    tabsFlowPage.openProcessPopupForNode(DefaultTabLabels[TabType.MAIN]);
    processPopupPage.enableProcess('before');
    processPopupPage.chooseProcessType(ProcessTypeLabels[ProcessType.REDIRECT]);
    processPopupPage.getProcessRedirectProtocol().should('exist');
    processPopupPage.getProcessRedirectUrl().should('exist');
    processPopupPage.getCancelProcessEditionButton().click();
  });
  // TODO setup redirect process and test on renderer

  it('[process email - any email] enable email process - should appear emails process config', () => {
    tabsFlowPage.openProcessPopupForNode(DefaultTabLabels[TabType.MAIN]);
    processPopupPage.enableProcess('before');
    processPopupPage.chooseProcessType(ProcessTypeLabels[ProcessType.DEFINE_EMAILS]);
    processPopupPage.getEmailsDefineMessageTypeResults().should('exist').should('be.checked');
    processPopupPage.getEmailsDefineMessageTypePersonal().should('exist').should('not.be.checked');
    processPopupPage.getAddEmailInputProcessBtn().should('exist');
  });

  it('[process email - field emails] check current active tab is "Adres dowolny"', () => {
    processPopupPage.getFieldEmailsHeader().should('contain.text', 'Email do wysłania');
  });

  it('[process email - any email] disabled save button after uncheck emails define messege type result', () => {
    processPopupPage.getEmailsDefineMessageTypeResults().uncheck({ force: true });
    processPopupPage.getSaveProcessEdition().should('have.class', 'btn-disabled');
    processPopupPage.getEmailsDefineMessageTypeResults().check({ force: true });
  });

  it('[process email - any email] enable email with personal content - should appear ckeditor for content', () => {
    processPopupPage.getEmailsDefineMessageTypePersonal().check({ force: true });
    processPopupPage.getCkEditorForDefinedEmails().should('exist');
  });

  it('[process email - any email] adding email input - should appear email input and then after wrong value show up validation', () => {
    processPopupPage.getAddEmailInputProcessBtn().click();
    processPopupPage.getEmailForResultInput(0).type('WrongValue');
    processPopupPage.getSaveProcessEdition().click({ force: true });
    processPopupPage
      .getEmailForResultInputError(0)
      .should('exist')
      .should('contain.text', ' Niepoprawny adres e-mail ');
  });

  it('[process email - any email] edit wrong email value - should disappear validation message', () => {
    processPopupPage.getEmailForResultInput(0).clear().type('WrongValue@example.com');
    processPopupPage.getEmailForResultInputError(0).should('not.exist');
  });

  it('[process email - any email] remove email input - should disappear email input', () => {
    processPopupPage.getEmailInputResultRemoveBtn(0).click();
    processPopupPage.getEmailForResultInput(0).should('not.exist');
  });

  it('[process email - field emails] change active tab on "Adresy z pól formularza"', () => {
    processPopupPage.getEmailsProcessTabHeader('Adresy z pól formularza').click();
    processPopupPage.getFieldEmailsHeader().should('contain.text', 'Pola email do wysłania wyników');
  });

  it('[process email - field email] disabled save button after uncheck emails fields define messege type result', () => {
    processPopupPage.getEmailsFieldsDefineMessageTypeResults().uncheck({ force: true });
    processPopupPage.getSaveProcessEdition().should('have.class', 'btn-disabled');
    processPopupPage.getEmailsFieldsDefineMessageTypeResults().check({ force: true });
  });

  it('[process email - field email] enable email with personal content - should appear ckeditor for content', () => {
    processPopupPage.getEmailsFieldsDefineMessageTypePersonal().check({ force: true });
    processPopupPage.getCkEditorForDefinedEmailsFields().should('exist');
  });

  it('[process email - field email] add email from field select', () => {
    processPopupPage.getAddFieldEmailProcessBtn().click();

    processPopupPage.chooseFieldEmailsPage('Strona 1');
    processPopupPage.chooseFieldEmailsField('etykieta_pola_text_field');

    processPopupPage.getFieldEmailsPageSelect().find('.mat-select-value').contains('Strona 1').should('exist');
    processPopupPage
      .getFieldEmailsFieldSelect()
      .find('.mat-select-value')
      .contains('etykieta_pola_text_field')
      .should('exist');
  });

  // TODO enabling process after (switching to next tab)
  // TODO check euc service processes when renderer will be ready

  it('[process] save process (before) - process visually should appear on graph', () => {
    processPopupPage.getSaveProcessEdition().click();
    tabsFlowPage.getOneNodeByLabel(DefaultTabLabels[TabType.MAIN]).find('div.process.process-left');
  });

  after(() => {
    // TODO check if this flag will be false on deploy builds by Jenkis
    // if (Cypress.config('isInteractive')) {
    removeFormByApi(formId);
    // }
  });
});
